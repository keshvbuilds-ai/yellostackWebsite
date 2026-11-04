import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {randomBytes,scryptSync} from 'node:crypto';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {defaultContent} from '../.cms-check/defaults.mjs';
const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ys-arabic-qa-'));const snapshot=process.env.ARABIC_QA_CONTENT?JSON.parse(await fs.readFile(process.env.ARABIC_QA_CONTENT,'utf8')):defaultContent;const content=structuredClone(snapshot);
content.posts[0].coverImage='/banners/web.svg';content.posts[0].sections=[{heading:'Designing for people',body:'A clear paragraph beside an image.\n\nThis second paragraph keeps the article easy to read.',image:'/banners/web.svg',imageAlt:'Website illustration',layout:'image-left'}];content.posts[0].galleryImages=[{image:'/banners/mobile.svg',imageAlt:'Mobile application illustration'}];
content.posts.push({...content.posts[0],slug:'arabic-test',title:'التقنية تصنع مستقبل الأعمال',summary:'رؤى وأفكار لتطوير الأعمال باستخدام التقنية الحديثة.',paragraphs:[],sections:[{heading:'نبني معًا',body:'هذا مقال باللغة العربية لعرض اتجاه القراءة الصحيح على الموقع.',image:'',imageAlt:'',layout:'text'}],date:'2024-01-01'});
await fs.writeFile(path.join(dir,'store.json'),JSON.stringify({content,published:content,revision:1,enquiries:[],sessions:{},attempts:[]}));
const password=randomBytes(24).toString('hex'),salt=randomBytes(16).toString('hex'),origin='http://localhost:3104';
const app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3104'],{env:{...process.env,CMS_BACKEND:'local',CMS_DATA_DIR:dir,CMS_ADMIN_USERNAME:'qa-admin',CMS_ADMIN_PASSWORD_HASH:salt+':'+scryptSync(password,salt,64).toString('hex'),SITE_ALLOWED_ORIGINS:'',SMTP_HOST:'',SMTP_PASSWORD:'',NODE_ENV:'production'},stdio:'ignore'});let browser;
try {
 for(let i=0;i<60;i++){try{if((await fetch(origin+'/api/cms/status')).ok)break;}catch{}await new Promise(r=>setTimeout(r,500));}
 browser=await chromium.launch({headless:true,channel:'chrome'});const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});
 await context.addCookies([{name:'ys-locale',value:'ar',url:origin}]);const page=await context.newPage();const findings=[],browserErrors=[];page.on('pageerror',e=>browserErrors.push(e.message));
 const routes=['/',...content.pages.map(p=>'/'+p.slug),'/blog','/careers','/industries-we-serve','/portfolio/projects/web-design','/portfolio/projects/mobile-apps',...['grocery-delivery','education','healthcare','custom-web-applications','booking-on-demand'].map(x=>'/portfolio/projects/mobile-apps/'+x)];
 for(const locale of (process.env.CMS_ONLY?[]:['en','ar'])){await context.addCookies([{name:'ys-locale',value:locale,url:origin}]);for(const width of [390,1440]){await page.setViewportSize({width,height:900});for(const route of [...new Set(routes)]){
 const response=await page.goto(origin+route,{waitUntil:'domcontentloaded'});await page.waitForTimeout(250);
 const texts=await page.evaluate(()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),out=[];let n;while(n=w.nextNode()){const p=n.parentElement;if(!p||p.closest('script,style,noscript,svg,.journal-row,.journal-sidebar article,.journal-feature,.journal-article-title,.journal-article-body,.journal-related article'))continue;const text=n.textContent.trim();if(/[a-zA-Z]{3}/.test(text))out.push(text);}return [...new Set(out)];});
 findings.push({locale,width,route,status:response.status(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),texts});console.log(locale,width,route,response.status(),texts.length);assert.equal(response.status(),200);assert.equal(findings.at(-1).overflow,false,'Overflow: '+route);
 if(['/team','/website-design-company','/portfolio','/contact'].includes(route))await page.screenshot({path:'.cms-check/arabic-'+width+'-'+route.slice(1)+'.png'});
 }
 }
 }
 assert.deepEqual(browserErrors,[],'No uncaught browser errors');
 await context.addCookies([{name:'ys-locale',value:'ar',url:origin}]);
 if(findings.length)await fs.writeFile('.cms-check/arabic-audit.json',JSON.stringify(findings,null,2));
 await page.goto(origin+'/admin');await page.getByRole('button',{name:'Sign in',exact:true}).waitFor();assert.equal(await page.locator('html').getAttribute('dir'),'ltr');
 await page.locator('[name=email]').fill('qa-admin');await page.locator('[name=password]').fill(password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.waitForTimeout(1000);console.log('CMS login:',await page.locator('.cms-message').innerText().catch(()=>''));await page.screenshot({path:'.cms-check/cms-login-debug.png'});await page.getByRole('button',{name:'English',exact:true}).waitFor();await page.getByRole('button',{name:'Dismiss notification'}).click();
 await page.getByRole('button',{name:'العربية',exact:true}).click();assert.equal(await page.locator('.cms').getAttribute('dir'),'rtl');
 await page.frameLocator('iframe').locator('html[dir=rtl]').waitFor();await page.locator('.visual-controls select').selectOption('/website-design-company');const preview=page.frameLocator('iframe');await preview.locator('[data-cms-copy="development.web.title"]').click();await page.getByLabel('Selected website text').fill('تطوير مواقع بتجربة عربية متكاملة');await page.getByRole('button',{name:'Done editing',exact:true}).click();await page.getByRole('button',{name:'Save draft',exact:true}).click();await page.waitForTimeout(350);const visualSaved=await (await context.request.get(origin+'/api/cms/content')).json();assert.equal(visualSaved.content.copy['development.web.title'],defaultContent.copy['development.web.title']);assert.equal(visualSaved.content.copy['ar:'+defaultContent.copy['development.web.title']],'تطوير مواقع بتجربة عربية متكاملة');assert.ok(await page.locator('.cms-header').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1;}),'CMS language header stays within mobile viewport');await page.screenshot({path:'.cms-check/arabic-cms.png'});
 await page.locator('.visual-controls select').selectOption('/contact');await preview.locator('form').waitFor();
 let previewSubmissions=0;const watch=request=>{if(request.url().endsWith('/api/enquiries'))previewSubmissions++;};page.on('request',watch);
 await preview.locator('form').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));await page.waitForTimeout(300);assert.equal(previewSubmissions,0,'Private preview must block React form submissions');page.off('request',watch);
 await page.getByRole('button',{name:'Team members',exact:true}).first().click();
 const first=page.locator('.cms-editor > .cms-array > details').first();await first.locator('summary').first().click();
 const original=content.teamMembers[0].bio;await first.locator('label.cms-field').filter({has:page.locator('span',{hasText:/^bio$/i})}).locator('input,textarea').fill('سيرة عربية محفوظة للاختبار');
 await page.getByRole('button',{name:'Save draft',exact:true}).click();await page.waitForTimeout(350);
 let saved=await (await context.request.get(origin+'/api/cms/content')).json();assert.equal(saved.content.teamMembers[0].bio,original);assert.equal(saved.content.copy['ar:'+original],'سيرة عربية محفوظة للاختبار');
 await page.getByRole('button',{name:'English',exact:true}).click();assert.equal(await first.locator('label.cms-field').filter({has:page.locator('span',{hasText:/^bio$/i})}).locator('input,textarea').inputValue(),original);
 assert.equal((await context.cookies()).find(c=>c.name==='ys-locale').value,'ar');
 await page.getByRole('button',{name:/^\+ Add team members$/i}).click();
 await page.getByRole('button',{name:'Save draft',exact:true}).click();await page.waitForTimeout(350);saved=await (await context.request.get(origin+'/api/cms/content')).json();assert.equal(saved.content.teamMembers.length,content.teamMembers.length+1);
 page.on('dialog',d=>d.accept());await page.locator('.cms-editor > .cms-array > details').last().getByRole('button',{name:'Delete',exact:true}).click();
 await page.getByRole('button',{name:'Save draft',exact:true}).click();await page.waitForTimeout(350);saved=await (await context.request.get(origin+'/api/cms/content')).json();assert.equal(saved.content.teamMembers.length,content.teamMembers.length);
 const published=await context.request.post(origin+'/api/cms/publish',{headers:{origin},data:saved});assert.equal(published.status(),200);
 await page.goto(origin+'/team');assert.ok((await page.locator('.team-people').innerText()).includes('سيرة عربية محفوظة للاختبار'));
 await page.route('**/api/enquiries',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})}));
 for(const locale of ['en','ar']){await context.addCookies([{name:'ys-locale',value:locale,url:origin}]);await page.goto(origin+'/contact');const form=page.locator('form').first();await form.locator('[name=name]').fill('QA Visitor');await form.locator('[name=email]').fill('qa@example.com');await form.locator('[name=message]').fill('Testing the bilingual contact form.');await form.locator('[name=consent]').check();await form.evaluate(f=>f.requestSubmit());await form.locator('[role=status]').filter({hasText:locale==='ar'?/[\u0600-\u06ff]/:/Thank you/}).waitFor();}
 console.log('Preview submissions blocked; English and Arabic contact success messages passed (mock delivery).');
 console.log('CMS isolation, Arabic visual preview, bilingual save, create/delete and publish passed');
} finally {if(browser)await browser.close();app.kill();await fs.rm(dir,{recursive:true,force:true});}
