import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3000/portfolio');await page.waitForTimeout(1200);
 for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[844,390],[1024,768],[1440,900],[1920,1080]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(800);
  assert.equal(await page.locator('.y-journey.is-animated').count(),1,`${width}: animation enabled`);
  for(const p of [.3,.5,.97]){
   await page.locator('.y-journey').evaluate((el,p)=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY+(el.offsetHeight-innerHeight)*p),p);await page.waitForTimeout(1200);
   const stage=await page.locator('.y-stage').boundingBox();assert(Math.abs(stage.y)<3);assert(stage.height<=height+1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(p===.97){const cta=await page.locator('.y-outro-cta').boundingBox();assert(cta.y>=0&&cta.y+cta.height<=height,`${width}: contact CTA fits`);}
  }
  await page.screenshot({path:`.cms-check/responsive-${width}x${height}.png`});console.log(`PASS ${width}x${height}`);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
