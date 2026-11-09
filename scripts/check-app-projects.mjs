import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdtemp,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomBytes,scryptSync} from 'node:crypto';
const dir=await mkdtemp(path.join(tmpdir(),'ys-apps-')),origin='http://localhost:3182';
const password=randomBytes(24).toString('hex'),salt=randomBytes(16).toString('hex');
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3182'],{env:{...process.env,CMS_BACKEND:'local',CMS_DATA_DIR:dir,CMS_ADMIN_USERNAME:'app-test',CMS_ADMIN_PASSWORD_HASH:salt+':'+scryptSync(password,salt,64).toString('hex')},stdio:'ignore'});
let browser;
const post=(action,body,cookie='')=>fetch(origin+'/api/cms/'+action,{method:'POST',headers:{origin,'content-type':'application/json',cookie},body:JSON.stringify(body)});
try{
 let ready=false;for(let i=0;i<90;i++){try{if((await fetch(origin+'/api/cms/status')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}assert.ok(ready);
 const login=await post('login',{email:'app-test',password});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0];
 const draft=await(await fetch(origin+'/api/cms/content',{headers:{cookie}})).json();
 const categories=['grocery-delivery','education','healthcare','booking-on-demand','custom-web-applications'];
 draft.content.workProjectsManaged=true;
 draft.content.workProjects=Array.from({length:9},(_,i)=>({id:'test-app-'+i,title:'App '+i,description:'An application for everyday experiences.',service:'mobile-application-development-company-saudi-arabia',category:categories[i%5],image:'/banners/mobile.svg',url:'',sections:[{heading:'Inside the experience',body:'First paragraph.\n\nSecond paragraph.',image:'/banners/web.svg',imageAlt:'Application experience'}],playStoreUrl:i===0?'https://play.google.com/store/apps/details?id=test':'',appStoreUrl:i===0?'https://apps.apple.com/app/id123456':''}));
 assert.equal((await post('publish',draft,cookie)).status,200);
 const current=await(await fetch(origin+'/api/cms/content',{headers:{cookie}})).json();
 assert.equal(current.content.workProjects[0].sections[0].body,'First paragraph.\n\nSecond paragraph.');
 const bad=structuredClone(current);bad.content.workProjects[0].playStoreUrl='javascript:alert(1)';assert.equal((await post('save',bad,cookie)).status,400);
 browser=await chromium.launch({channel:'chrome',headless:true});await mkdir('.cms-check',{recursive:true});
 for(const width of [1440,390])for(const locale of ['en','ar']){
  const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'});await context.addCookies([{name:'ys-locale',value:locale,url:origin}]);const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/portfolio/projects/mobile-apps');await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.collection-card').count(),9);assert.equal(await page.locator('.app-filters a[aria-current]').count(),1);
  assert.equal(await page.locator('.collection-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),width===1440?3:1);
  await page.screenshot({path:'.cms-check/apps-'+locale+'-'+width+'.png',fullPage:true});
  for(let i=0;i<5;i++){await page.locator('.app-filters a[href$="/'+categories[i]+'"]').click();await page.waitForURL('**/'+categories[i]);assert.equal(await page.locator('.collection-card').count(),i===4?1:2);}
  await page.locator('.app-filters a').first().click();await page.locator('.collection-card .work-project-link').first().click();await page.waitForURL('**/app/test-app-0');
  assert.equal(await page.locator('.app-detail-hero h1').innerText(),'App 0');assert.equal(await page.locator('.app-detail-content p').count(),2);assert.equal(await page.locator('.app-store-links a').count(),2);assert.equal(await page.locator('.app-detail-logo img').getAttribute('alt'),'App 0');
  await page.screenshot({path:'.cms-check/app-detail-'+locale+'-'+width+'.png',fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
  await page.goto(origin+'/portfolio/projects/mobile-apps/app/test-app-1');assert.equal(await page.locator('.app-store-links a').count(),0);
  await context.close();console.log('PASS',width,locale,'filters, nine cards, detail, store links');
 }
 const editorContext=await browser.newContext();const editor=await editorContext.newPage();await editor.goto(origin+'/admin');await editor.locator('input[name="email"]').fill('app-test');await editor.locator('input[name="password"]').fill(password);await editor.getByRole('button',{name:'Sign in',exact:true}).click();await editor.getByRole('button',{name:'Work projects',exact:true}).first().click();
 const item=editor.locator('.cms-editor>.cms-array>.cms-item').first();await item.locator(':scope>summary').click();await item.getByLabel('Google Play link (HTTPS, optional)',{exact:true}).fill('https://play.google.com/store/apps/details?id=edited');
 await item.locator('summary').filter({hasText:'Page content'}).click();await item.getByRole('button',{name:'+ Add Page content',exact:false}).click();const blocks=item.locator('.cms-array>.cms-item');await blocks.last().locator(':scope>summary').click();await blocks.last().getByLabel('heading',{exact:true}).fill('Added in CMS');await blocks.last().getByLabel('body',{exact:true}).fill('Editable project content.');
 await editor.getByRole('button',{name:'Save work draft',exact:true}).click();await editor.getByText('Draft saved successfully',{exact:false}).waitFor();const edited=await(await fetch(origin+'/api/cms/content',{headers:{cookie}})).json();assert.equal(edited.content.workProjects[0].sections.length,2);assert.equal(edited.content.workProjects[0].sections[1].heading,'Added in CMS');await editor.getByRole('button',{name:'Mobile apps',exact:true}).first().click();await editor.getByRole('button',{name:'+ Add mobile app',exact:true}).click();const mobile=editor.locator('.cms-mobile-apps>details[open]');await mobile.getByLabel('App name',{exact:true}).fill('Dedicated app');await mobile.getByLabel(/App category/i).selectOption('education');await mobile.getByLabel(/Short card description/i).fill('Learn something every day.');await mobile.getByLabel(/^Introduction \/ description$/i).fill('Detailed introduction.');await mobile.getByRole('button',{name:'+ Add content section',exact:true}).click();await mobile.getByLabel(/^Paragraph content$/i).fill('Content added through the mobile editor.');await mobile.getByLabel(/^Google Play Store link$/i).fill('https://play.google.com/store/apps/details?id=dedicated');await editor.getByRole('button',{name:'Save draft',exact:true}).click();await editor.getByText('Draft saved successfully',{exact:false}).waitFor();const mobileSaved=await(await fetch(origin+'/api/cms/content',{headers:{cookie}})).json();const app=mobileSaved.content.workProjects.find(p=>p.title==='Dedicated app');assert.equal(app.shortDescription,'Learn something every day.');assert.equal(app.category,'education');assert.equal(app.sections[0].body,'Content added through the mobile editor.');assert.equal(mobileSaved.content.workProjects.length,10);assert.equal((await post('publish',mobileSaved,cookie)).status,200);const gallery=await editorContext.newPage();await gallery.goto(origin+'/portfolio/projects/mobile-apps');assert.equal(await gallery.getByText('Learn something every day.',{exact:true}).count(),1);await editorContext.close();console.log('PASS dedicated Mobile apps editor, short card description and publishing');console.log('PASS CMS fields and adding/saving a content section');
 assert.equal((await fetch(origin+'/portfolio/projects/mobile-apps/app/unknown')).status,404);
 const removed=await(await fetch(origin+'/api/cms/content',{headers:{cookie}})).json();removed.content.workProjects=[];assert.equal((await post('publish',removed,cookie)).status,200);assert.equal((await fetch(origin+'/portfolio/projects/mobile-apps/app/test-app-0')).status,404);
 console.log('PASS CMS publishing, optional fields, URL validation and removed/missing project 404');
}finally{if(browser)await browser.close();server.kill();await new Promise(resolve=>server.once('exit',resolve));await rm(dir,{recursive:true,force:true});}
