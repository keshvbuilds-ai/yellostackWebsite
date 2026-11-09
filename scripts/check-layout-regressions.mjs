import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin='http://localhost:3180';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3180'],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<60;i++){try{if((await fetch(origin+'/api/cms/status')).ok)break;}catch{}await new Promise(r=>setTimeout(r,500));}
 browser=await chromium.launch({headless:true,channel:'chrome'});
 await fs.mkdir('.cms-check',{recursive:true});
 for(const [width,locale,reducedMotion] of [[1595,'en','no-preference'],[1595,'ar','no-preference'],[390,'en','no-preference'],[390,'ar','no-preference'],[390,'ar','reduce']]){
 const context=await browser.newContext({viewport:{width,height:868},reducedMotion});await context.addCookies([{name:'ys-locale',value:locale,url:origin}]);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/about-us');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(800);
 if(locale==='ar'){
  const metric=await page.locator('.ys-inner-hero h1').evaluate(el=>{const s=getComputedStyle(el);return {line:parseFloat(s.lineHeight)/parseFloat(s.fontSize),fill:s.webkitTextFillColor,bg:s.backgroundImage};});
  assert.ok(metric.line>=1.4);assert.notEqual(metric.fill,'rgba(0, 0, 0, 0)');assert.equal(metric.bg,'none');
  await page.screenshot({path:'.cms-check/heading-'+width+'-'+reducedMotion+'.png'});
  const section=page.locator('.ys-inner-detail').last();if(await section.count()){await section.scrollIntoViewIfNeeded();await page.waitForTimeout(1100);await page.screenshot({path:'.cms-check/sections-'+width+'-'+reducedMotion+'.png'});}
 }
 assert.equal(await page.locator('.business-footer a[href^="mailto:"]').count(),1);
 assert.equal(await page.locator('.business-footer a[href^="tel:"]').count(),1);
 await page.goto(origin+'/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(900);
 const links=page.locator('.services-sticky-index>a'),count=await links.count();assert.ok(count>=7);
 for(let i=0;i<count;i++){
  const link=links.nth(i),href=await link.getAttribute('href');await link.click();await page.waitForTimeout(reducedMotion==='reduce'?400:2200);
  const title=page.locator(href+' h3');
  const bounds=await title.boundingBox();const header=await page.locator('.site-navigation').boundingBox();
  assert.ok(bounds.y>=header.y+header.height,'Heading hidden under header: '+href+' '+locale+' '+width);
  assert.ok(bounds.y+bounds.height<=868,'Heading below viewport: '+href+' '+locale+' '+width);
  assert.equal(await link.getAttribute('aria-current'),'location');
  assert.ok(await title.evaluate(el=>Number(getComputedStyle(el.parentElement).opacity)>.95));
  if(width>800){const icon=await link.locator('.service-active-arrow svg').boundingBox();assert.equal(icon.width,24);assert.equal(icon.height,24);}
  if(i===2)await page.screenshot({path:'.cms-check/capability-'+locale+'-'+width+'-'+reducedMotion+'.png'});
 }
 const process=page.locator('.process-list');await process.scrollIntoViewIfNeeded();await page.waitForTimeout(900);
 for(const icon of await process.locator('.process-arrow svg').all()){const b=await icon.boundingBox();assert.equal(b.width,18);assert.equal(b.height,18);}
 await page.screenshot({path:'.cms-check/process-'+locale+'-'+width+'-'+reducedMotion+'.png'});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 assert.deepEqual(errors,[]);console.log('PASS',width,locale,reducedMotion,'all capability targets, headings, arrows, footer');await context.close();
 }
}finally{if(browser)await browser.close();server.kill();}
