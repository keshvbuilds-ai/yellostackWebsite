import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdtemp,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomBytes,scryptSync} from 'node:crypto';
const dir=await mkdtemp(path.join(tmpdir(),'ys-work-sections-')),origin='http://localhost:3184';
const password=randomBytes(24).toString('hex'),salt=randomBytes(16).toString('hex');
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3184'],{env:{...process.env,SITE_ALLOWED_ORIGINS:'',CMS_BACKEND:'local',CMS_DATA_DIR:dir,CMS_ADMIN_USERNAME:'section-test',CMS_ADMIN_PASSWORD_HASH:salt+':'+scryptSync(password,salt,64).toString('hex')},stdio:'ignore'});
let browser;
const post=(action,body,cookie='')=>fetch(origin+'/api/cms/'+action,{method:'POST',headers:{origin,'content-type':'application/json',cookie},body:JSON.stringify(body)});
try{
 let ready=false;for(let i=0;i<90;i++){try{if((await fetch(origin+'/api/cms/status')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}assert.ok(ready);
 const login=await post('login',{email:'section-test',password});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0];
 const get=async()=>await(await fetch(origin+'/api/cms/content',{headers:{cookie}})).json();
 const original=await get();assert.equal(original.content.workSections,undefined);
 browser=await chromium.launch({channel:'chrome',headless:true});await mkdir('.cms-check',{recursive:true});
 const context=await browser.newContext({viewport:{width:1440,height:950},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/portfolio');assert.equal(await page.locator('.y-service').count(),2);
 await page.goto(origin+'/admin');await page.locator('input[name=email]').fill('section-test');await page.locator('input[name=password]').fill(password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByRole('button',{name:'Why choose us',exact:true}).first().click();
 await page.getByRole('button',{name:'+ Add Work section',exact:true}).click();await page.getByLabel('Section title',{exact:true}).fill('Cloud projects');await page.getByLabel(/Section introduction/i).fill('Cloud systems made for your business.');await page.getByLabel(/^Explore service link \(optional\)$/i).fill('/cloud-infrastructure');
 await page.getByRole('button',{name:'+ Add project to this section',exact:true}).click();const item=page.locator('.cms-work-sections>details').first();await item.locator(':scope>summary').click();await item.getByLabel(/^title$/i).fill('Cloud platform');await item.getByLabel(/description/i).fill('A cloud platform delivered for our client.');
 await page.getByRole('button',{name:'Save draft',exact:true}).click();await page.getByText('Draft saved successfully',{exact:false}).waitFor();let draft=await get();const section=draft.content.workSections.find(s=>s.title==='Cloud projects');assert.ok(section);assert.ok(draft.content.workProjects.some(p=>p.title==='Cloud platform'&&p.service===section.service));
 assert.equal((await fetch(origin+'/portfolio/projects/'+section.slug)).status,404,'Draft collection is private');
 const originalProjects=draft.content.workProjects.filter(p=>p.service!==section.service);
 for(let i=1;i<9;i++)draft.content.workProjects.push({id:'cloud-'+i,service:section.service,title:'Cloud project '+i,description:'A reliable experience.',image:'/banners/web.svg',url:'https://example.com/'});
 draft.content.copy['ar:Cloud projects']='\u0645\u0634\u0627\u0631\u064a\u0639 \u0633\u062d\u0627\u0628\u064a\u0629';
 assert.equal((await post('publish',draft,cookie)).status,200);
 assert.deepEqual((await get()).content.posts,original.content.posts);assert.deepEqual((await get()).content.pages,original.content.pages);
 for(const width of [1440,850,390])for(const locale of ['en','ar']){
  const c=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'});await c.addCookies([{name:'ys-locale',value:locale,url:origin}]);const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));const response=await p.goto(origin+'/portfolio/projects/'+section.slug);assert.equal(response.status(),200);assert.equal(await p.locator('.collection-card').count(),9);assert.equal(await p.locator('.collection-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),width===1440?3:width===850?2:1);if(locale==='ar')assert.match(await p.locator('h1').innerText(),/[\u0600-\u06ff]/);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await p.screenshot({path:'.cms-check/work-sections-'+locale+'-'+width+'.png',fullPage:true});await p.goto(origin+'/portfolio');assert.equal(await p.locator('.y-service').count(),3);assert.equal(await p.locator('.y-service .work-project-link[href="/portfolio/projects/'+section.slug+'"]').count(),1);await c.close();
 }
 // Verify a new third section also participates in the animated scroll experience.
 const animated=await browser.newContext({viewport:{width:1440,height:950},reducedMotion:'no-preference'});const motion=await animated.newPage();motion.on('pageerror',e=>errors.push(e.message));await motion.goto(origin+'/portfolio');await motion.locator('.y-journey.is-animated').waitFor();await motion.evaluate(()=>document.fonts.ready);await motion.evaluate(()=>{const root=document.querySelector('.y-journey');window.scrollTo({top:root.getBoundingClientRect().top+scrollY+(root.offsetHeight-innerHeight)*17.2/Number(root.dataset.duration),behavior:'instant'});});await motion.waitForFunction(()=>Number(document.querySelector('.y-journey')?.dataset.journeyTime)>17.0);assert.equal(await motion.locator('.y-service').nth(2).getAttribute('aria-hidden'),'false');await motion.locator('.y-service').nth(2).locator('.work-project-link').click();await motion.waitForURL('**/'+section.slug);await animated.close();
 draft=await get();for(const mutate of [c=>c.workSections[2].serviceUrl='javascript:alert(1)',c=>c.workSections[2].slug='../admin',c=>c.workSections.push({...c.workSections[2]}),c=>c.workSections.pop(),c=>c.workSections[0].service='other-group']){const bad=structuredClone(draft);mutate(bad.content);assert.equal((await post('save',bad,cookie)).status,400);}
 // Edit the Arabic title through the CMS and verify the English source survives.
 await page.reload();await page.getByRole('button',{name:'Why choose us',exact:true}).first().click();await page.getByLabel(/Choose Work section/i).selectOption(section.slug);await page.locator('.cms-header button').filter({hasText:/\u0627\u0644\u0639\u0631\u0628\u064a\u0629/}).click();await page.getByLabel('Section title',{exact:true}).fill('\u0623\u0639\u0645\u0627\u0644 \u0633\u062d\u0627\u0628\u064a\u0629');await page.getByRole('button',{name:'Save draft',exact:true}).click();await page.getByText('Draft saved successfully',{exact:false}).waitFor();draft=await get();assert.equal(draft.content.workSections.find(s=>s.slug===section.slug).title,'Cloud projects');assert.equal(draft.content.copy['ar:Cloud projects'],'\u0623\u0639\u0645\u0627\u0644 \u0633\u062d\u0627\u0628\u064a\u0629');
 // Deleting an empty custom section removes its route without disturbing existing projects.
 draft.content.workProjects=draft.content.workProjects.filter(p=>p.service!==section.service);draft.content.workSections=draft.content.workSections.filter(s=>s.slug!==section.slug);assert.equal((await post('publish',draft,cookie)).status,200);assert.equal((await fetch(origin+'/portfolio/projects/'+section.slug)).status,404);assert.deepEqual((await get()).content.workProjects,originalProjects);assert.deepEqual(errors,[]);
 await context.close();console.log('PASS Work section CMS creation, projects, Arabic editing, private drafts, publishing, responsive galleries, validation and non-destructive deletion.');
}finally{if(browser)await browser.close();server.kill();await new Promise(r=>server.exitCode!==null?r():server.once('exit',r));assert.ok(path.resolve(dir).startsWith(path.join(path.resolve(tmpdir()),'ys-work-sections-')));await rm(dir,{recursive:true,force:true});}
