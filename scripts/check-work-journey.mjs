import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto((process.env.TEST_BASE_URL||'http://localhost:3000')+'/portfolio');
 if(!await page.locator('.y-journey').count()){console.log('No published projects: journey correctly omitted.');}
 else{
  await page.waitForTimeout(1200);
  async function seek(progress){await page.locator('.y-journey').evaluate((el,p)=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY+(el.getBoundingClientRect().height-innerHeight)*p),progress);await page.waitForTimeout(1600);const box=await page.locator('.y-stage').boundingBox();assert(Math.abs(box.y)<3,'Pinned stage must stay in the viewport');}
  const selectors='.y-services,.y-gold-sheet,.y-intro,.y-white-world,.y-flight-glyph,.y-flight-center,.y-service,.y-project-track,.y-outro,.y-brand-letter,.y-brand-rest,.y-invitation';
  const states=new Map();
  for(const p of [.17,.29,.5,.9]){await seek(p);states.set(p,await page.locator(selectors).evaluateAll(nodes=>nodes.map(node=>node.getAttribute('style'))));}
  await page.locator('.y-journey').evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().bottom+scrollY+200));await page.waitForTimeout(1200);
  for(const p of [.9,.5,.29,.17]){await seek(p);assert.deepEqual(await page.locator(selectors).evaluateAll(nodes=>nodes.map(node=>node.getAttribute('style'))),states.get(p),'Forward and reverse must render the same state');}
  await seek(.5);assert.equal(await page.locator('.y-white-world').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
  await seek(.96);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(1400);await seek(.54);await seek(.2);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal page overflow');
  await page.getByRole('button',{name:'View all projects',exact:true}).click();await page.waitForTimeout(300);
  assert.equal(await page.locator('.y-journey.is-animated').count(),0);
  assert.equal(await page.locator('.y-service[aria-hidden="true"]').count(),0);
  await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.waitForTimeout(500);
  assert.equal(await page.locator('.y-journey.is-animated').count(),0);
  assert(await page.locator('.y-project').count()>0);
 }
 assert.deepEqual(errors,[]);console.log('PASS: work journey resize/reverse scroll, list view, reduced motion and runtime checks.');
}finally{await browser.close();}
