import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const origin='http://localhost:3105';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3105'],{stdio:'ignore'});let browser;
try{
 for(let i=0;i<60;i++){try{if((await fetch(origin+'/portfolio')).ok)break;}catch{}await new Promise(r=>setTimeout(r,500));}
 browser=await chromium.launch({headless:true,channel:'chrome'});
 for(const reducedMotion of ['no-preference','reduce'])for(const width of [390,1440]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const locale of ['ar','en']){
 await context.addCookies([{name:'ys-locale',value:locale,url:origin}]);await page.goto(origin+'/portfolio',{waitUntil:'domcontentloaded'});await page.waitForTimeout(700);
 if(reducedMotion==='no-preference'){
 await page.waitForFunction(()=>document.querySelector('.y-journey')?.dataset.journeyTime!==undefined);
 if(locale==='ar')assert.equal(await page.locator('.y-flight-center').evaluate(e=>getComputedStyle(e).visibility),'hidden');
 for(const fraction of [.3,.6,.95]){await page.evaluate(f=>{const el=document.querySelector('.y-journey');window.scrollTo(0,el.offsetTop+(el.offsetHeight-innerHeight)*f);},fraction);await page.waitForTimeout(500);}
 await page.setViewportSize({width:width+10,height:850});await page.waitForTimeout(200);await page.setViewportSize({width,height:900});
 }
 assert.deepEqual(errors,[]);assert.equal(await page.locator('.y-service').count(),2);
 console.log('PASS',locale,width,reducedMotion);
 }
 await context.close();
 }
}finally{if(browser)await browser.close();server.kill();}
