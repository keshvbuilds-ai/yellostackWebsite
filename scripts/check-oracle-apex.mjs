import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdtemp,rm,mkdir,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomBytes,scryptSync} from 'node:crypto';
const dir=await mkdtemp(path.join(tmpdir(),'ys-oracle-')),origin='http://localhost:3183';
const password=randomBytes(24).toString('hex'),salt=randomBytes(16).toString('hex');
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3183'],{env:{...process.env,CMS_BACKEND:'local',CMS_DATA_DIR:dir,CMS_ADMIN_USERNAME:'app-test',CMS_ADMIN_PASSWORD_HASH:salt+':'+scryptSync(password,salt,64).toString('hex')},stdio:'ignore'});
let browser;
const post=(action,body,cookie='')=>fetch(origin+'/api/cms/'+action,{method:'POST',headers:{origin,'content-type':'application/json',cookie},body:JSON.stringify(body)});
try{
 let ready=false;for(let i=0;i<90;i++){try{if((await fetch(origin+'/api/cms/status')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}assert.ok(ready);
 const login=await post('login',{email:'app-test',password});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0];
 const draft=await(await fetch(origin+'/api/cms/content',{headers:{cookie}})).json();
 draft.content.pages=draft.content.pages.filter(p=>p.slug!=='oracle-apex');draft.content.pages[0].intro='Existing live content must stay.';
 assert.equal((await post('publish',draft,cookie)).status,200);
 const store=path.join(dir,'store.json'),before=await readFile(store,'utf8');
 const loaded=await(await fetch(origin+'/api/cms/content',{headers:{cookie}})).json();assert.equal(loaded.content.pages.filter(p=>p.slug==='oracle-apex').length,1);assert.equal(loaded.content.pages[0].intro,'Existing live content must stay.');assert.equal(await readFile(store,'utf8'),before);
 browser=await chromium.launch({channel:'chrome',headless:true});await mkdir('.cms-check',{recursive:true});
 for(const width of [1440,390])for(const locale of ['en','ar']){
  const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'});await context.addCookies([{name:'ys-locale',value:locale,url:origin}]);const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(origin+'/oracle-apex');assert.equal(response.status(),200);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.oracle-section').count(),10);assert.equal(await page.locator('.oracle-partner a').getAttribute('href'),'https://www.nexanor.ai');assert.equal(await page.locator('.oracle-brand img').evaluate(el=>el.complete&&el.naturalWidth>0),true);
  if(locale==='ar'){assert.match(await page.locator('.oracle-intro').innerText(),/[\u0600-\u06ff]/);assert.match(await page.locator('.oracle-partner h2').innerText(),/[\u0600-\u06ff]/);}
  const nav=await page.locator('.ys-mega-grid>a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));assert.deepEqual(nav.slice(-2),['/oracle-apex','/digital-marketing-agency']);
  const footer=await page.locator('.business-footer a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));assert.equal(footer[footer.indexOf('/oracle-apex')+1],'/digital-marketing-agency');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'.cms-check/oracle-'+locale+'-'+width+'.png',fullPage:true});assert.deepEqual(errors,[]);await context.close();console.log('PASS Oracle page',width,locale);
 }
 const custom=loaded.content.pages.find(p=>p.slug==='oracle-apex');custom.sections[0].body='Custom Oracle content';custom.partner.title='Custom partner heading';custom.partner.url='https://www.nexanor.ai/';
 assert.equal((await post('publish',loaded,cookie)).status,200);
 const saved=await(await fetch(origin+'/api/cms/content',{headers:{cookie}})).json();assert.equal(saved.content.pages.find(p=>p.slug==='oracle-apex').sections[0].body,'Custom Oracle content');assert.equal(saved.content.pages.find(p=>p.slug==='oracle-apex').partner.title,'Custom partner heading');assert.equal(saved.content.pages[0].intro,'Existing live content must stay.');
 saved.content.pages.find(p=>p.slug==='oracle-apex').partner.url='javascript:alert(1)';assert.equal((await post('save',saved,cookie)).status,400);
 const context=await browser.newContext();const editor=await context.newPage();await editor.goto(origin+'/admin');await editor.locator('input[name="email"]').fill('app-test');await editor.locator('input[name="password"]').fill(password);await editor.getByRole('button',{name:'Sign in',exact:true}).click();await editor.getByLabel('Website page',{exact:true}).selectOption('/oracle-apex');await editor.getByRole('button',{name:'Edit section text & images',exact:true}).click();await editor.getByRole('button',{name:/Partner company/}).click();await editor.locator('.studio-fields').getByLabel(/^title$/i).fill('CMS partner edit');await editor.getByRole('button',{name:'Save draft',exact:true}).click();await editor.getByText('Draft saved successfully',{exact:false}).waitFor();const edited=await(await fetch(origin+'/api/cms/content',{headers:{cookie}})).json();assert.equal(edited.content.pages.find(p=>p.slug==='oracle-apex').partner.title,'CMS partner edit');await context.close();
 console.log('PASS non-destructive legacy upgrade, CMS edits, publishing and partner URL validation');
}finally{if(browser)await browser.close();server.kill();await new Promise(resolve=>server.once('exit',resolve));await rm(dir,{recursive:true,force:true});}
