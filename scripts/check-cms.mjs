import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import ts from 'typescript';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'.cms-check');
await fs.mkdir(out,{recursive:true});
const files={general:'src/lib/cms/general.ts',workCatalogue:'src/content/work-catalogue.ts',industries:'src/content/industries.ts',upgrade:'src/lib/cms/feedback-upgrade.ts',pose:'src/components/3d/layerStoryPose.ts',catalogue:'src/content/catalogue.ts',banners:'src/content/service-banners.ts',media:'src/content/media.ts',i18n:'src/lib/i18n.ts',yellostack:'src/content/yellostack.ts',pages:'src/content/inner-pages.ts',blog:'src/content/blog.ts',defaults:'src/lib/cms/defaults.ts',validate:'src/lib/cms/validate.ts'};
for(const [name,file] of Object.entries(files)){
  let source=await fs.readFile(path.join(root,file),'utf8');
  source=source.replace("'./general'","'./general.mjs'");
  source=source.replace("'@/content/work-catalogue'","'./workCatalogue.mjs'");
  for(const statement of ["import publishedWork from '@/content/published-work.json';","import bundled from './published-work.json';"]){if(source.includes(statement))source=source.replace(statement,'const '+(statement.includes('bundled')?'bundled':'publishedWork')+' = '+await fs.readFile(path.join(root,'src/content/published-work.json'),'utf8')+';');}
  source=source.replace("'@/content/yellostack'","'./yellostack.mjs'").replace("'@/content/inner-pages'","'./pages.mjs'").replace("'@/content/blog'","'./blog.mjs'").replace("'./defaults'","'./defaults.mjs'");
  if(name==='upgrade')source=source.replace("import changes from '@/content/feedback-copy-migration.json';",'const changes = '+await fs.readFile(path.join(root,'src/content/feedback-copy-migration.json'),'utf8')+';');
  if(name==='defaults')source=source.replace("import copy from '@/content/cms-copy.json';",`const copy = ${await fs.readFile(path.join(root,'src/content/cms-copy.json'),'utf8')};`);
  source=source.replace("'@/content/industries'","'./industries.mjs'");
  source=source.replace("'@/content/media'","'./media.mjs'").replace("'@/content/service-banners'","'./banners.mjs'");
  source=source.replace("import arabic from '@/content/arabic.json';",'const arabic = '+await fs.readFile(path.join(root,'src/content/arabic.json'),'utf8')+';');
  const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
  await fs.writeFile(path.join(out,name+'.mjs'),output);
}
const {defaultContent}=await import(pathToFileURL(path.join(out,'defaults.mjs')).href);
const {validateContent,safeUrl}=await import(pathToFileURL(path.join(out,'validate.mjs')).href);
validateContent(defaultContent);
const edit=structuredClone(defaultContent);
edit.roles.push({id:'engineer',title:'Engineer',location:'Remote',type:'Full time',description:'Build with us.',applyEmail:'jobs@example.com',open:true});
edit.clients.push({id:'client',name:'Client',image:'https://example.com/logo.png',url:'https://example.com'});
edit.posts.push({slug:'new-story',title:'A new story',date:'2026-10-07',category:'News',summary:'An introduction',paragraphs:['First paragraph.'],source:'',coverImage:'https://example.com/cover.jpg'});
edit.copy['horizon.heading']='A new horizon.';
validateContent(edit);
assert.equal(edit.roles.filter(role=>role.open).length,1);
edit.roles[0].open=false;assert.equal(edit.roles.filter(role=>role.open).length,0);
for(const mutate of [
  content=>{content.clients=[{id:'bad',name:'Bad',image:'javascript:alert(1)',url:''}];},
  content=>{content.posts[0].slug='../admin';},
  content=>{content.pages[0].slug='admin';},
  content=>{content.posts.push(content.posts[0]);},
  content=>{content.site.hero.words=[];},
  content=>{content.pages[0].sections[0].items=42;},
  content=>{content.media['/logoyelostack.png']='data:text/html,unsafe';},
  content=>{content.site.contact.email='not-an-email';},
]){const invalid=structuredClone(defaultContent);mutate(invalid);assert.throws(()=>validateContent(invalid));}
assert.equal(safeUrl('javascript:alert(1)'),false);
assert.equal(safeUrl('//example.com'),false);
assert.equal(safeUrl('/layer-experience.svg',true),true);
assert.equal(safeUrl('mailto:hello@example.com'),true);
assert.equal(safeUrl('mailto:hello@example.com',true),false);
console.log('CMS checks passed: defaults, publishable edits, careers, URLs, shapes, reserved routes and duplicates.');

const {translate,localizeContent}=await import(pathToFileURL(path.join(out,'i18n.mjs')).href);
assert.equal(translate('HOME','ar'),translate('Home','ar'));
assert.notEqual(translate('Home','ar'),'Home');
assert.equal(translate('Custom heading','ar',{'ar:Custom heading':'عنوان مخصص'}),'عنوان مخصص');
const localized=localizeContent(defaultContent,'ar');
assert.equal(localized.pages[0].slug,defaultContent.pages[0].slug);
assert.equal(localized.site.contact.email,defaultContent.site.contact.email);
assert.deepEqual(localized.media,defaultContent.media);
assert.notEqual(localized.pages[0].title,defaultContent.pages[0].title);
assert.equal(localizeContent(defaultContent,'en'),defaultContent);
console.log('Locale checks passed: Arabic, overrides, case matching, preserved routes, media and contact addresses.');

const {upgradeFeedback}=await import(pathToFileURL(path.join(out,'upgrade.mjs')).href);
const legacy=structuredClone(defaultContent);
legacy.copy['hero.Hero.text.1']='Digital products';
legacy.copy['Globe.text.2']='An editor-customized heading';
legacy.pages=legacy.pages.filter(page=>page.slug!=='products');
legacy.site.hero.words=['Discover','Strategize','Execute'];
const upgraded=upgradeFeedback(legacy);
validateContent(upgraded);
assert.equal(upgraded.copy['hero.Hero.text.1'],'Building intelligent');
assert.equal(upgraded.copy['Globe.text.2'],'An editor-customized heading');
assert.equal(upgraded.pages.filter(page=>page.slug==='products').length,1);
assert.deepEqual(upgradeFeedback(upgraded),upgraded);
const featured=structuredClone(defaultContent);
featured.clients[0].recent=true;
assert.throws(()=>validateContent(featured));
featured.clients[0].projectSummary='An approved project description.';
validateContent(featured);
featured.clients[0].sector='Unknown';
assert.throws(()=>validateContent(featured));
const {capabilityLinks,productSlugs}=await import(pathToFileURL(path.join(out,'catalogue.mjs')).href);
for(const item of capabilityLinks)assert.ok(defaultContent.pages.some(page=>page.slug===item.slug));
for(const slug of productSlugs)assert.ok(defaultContent.pages.some(page=>page.slug===slug));
const {layerStoryPose}=await import(pathToFileURL(path.join(out,'pose.mjs')).href);
for(const [progress,index] of [[.12,2],[.37,1],[.62,0]]){
 const poses=[0,1,2].map(i=>layerStoryPose(progress,i));
 assert.equal(poses[index].emphasis,1);
 assert.equal(poses.filter(pose=>pose.emphasis===1).length,1);
}
console.log('Feedback checks passed: legacy migration, custom-copy preservation, recent-client validation, catalogue routes and bottom-to-top stack order.');

const collections=structuredClone(defaultContent);
collections.products.push({id:'product-test',title:'Test product',description:'Details',image:'/test.png',features:['Feature one'],url:''});
collections.workProjects.push({id:'work-test',title:'Test work',description:'Details',image:'/test.png',service:'website-design-company',url:'https://example.com'});
validateContent(collections);
collections.workProjects[0].url='javascript:alert(1)';assert.throws(()=>validateContent(collections));
collections.workProjects[0].url='';collections.products.push(collections.products[0]);assert.throws(()=>validateContent(collections));
console.log('Collection checks passed: products, project links, duplicate IDs and URL safety.');
const gallery=structuredClone(defaultContent);
gallery.posts[0].galleryImages=[{image:'/banners/web.svg',imageAlt:'Project screens'}];
validateContent(gallery);
gallery.posts[0].galleryImages[0].image='javascript:alert(1)';assert.throws(()=>validateContent(gallery));
gallery.posts[0].galleryImages=Array.from({length:13},()=>({image:'/banners/web.svg',imageAlt:''}));assert.throws(()=>validateContent(gallery));
delete gallery.posts[0].galleryImages;validateContent(gallery);
console.log('Blog gallery checks passed: optional legacy field, valid images, unsafe URLs and gallery limit.');

const {generalDefaults}=await import(pathToFileURL(path.join(out,'general.mjs')));
validateContent({...structuredClone(defaultContent),general:generalDefaults});
for(const invalid of [{offerPercent:101},{salesEmail:'bad'},{mapUrl:'javascript:alert(1)'},{offerCode:'bad code'}])assert.throws(()=>validateContent({...structuredClone(defaultContent),general:{...generalDefaults,...invalid}}));
console.log('General settings: defaults and invalid input checks passed.');

const {restoreProjectCategory}=await import(pathToFileURL(path.join(out,'workCatalogue.mjs')));
const legacyGrocery={id:'legacy-grocery',title:'Grocery delivery ',description:'Grocery app',image:'',service:'mobile-application-development-company-saudi-arabia',url:''};
assert.equal(restoreProjectCategory(legacyGrocery).category,'grocery-delivery');
assert.equal(restoreProjectCategory({...legacyGrocery,category:'booking-on-demand'}).category,'booking-on-demand');
assert.equal(restoreProjectCategory({...legacyGrocery,title:'Unclassified app'}).category,undefined);
validateContent({...structuredClone(defaultContent),workProjectsManaged:true,workProjects:[restoreProjectCategory(legacyGrocery)]});
console.log('Legacy grocery category migration passes without overwriting selected categories.');

const sectionContent=structuredClone(defaultContent);
sectionContent.posts[0].sections=[{heading:'A useful heading',body:'First paragraph.\n\nSecond paragraph.',image:'/banners/web.svg',imageAlt:'Website illustration',layout:'image-left'}];
sectionContent.copy['profile.stats.0.value']='12';validateContent(sectionContent);
for(const mutate of [c=>c.posts[0].sections[0].image='javascript:alert(1)',c=>c.posts[0].sections[0].layout='unknown',c=>c.copy['profile.stats.0.value']='NaN',c=>c.copy['profile.stats.0.value']='-5']){const bad=structuredClone(sectionContent);mutate(bad);assert.throws(()=>validateContent(bad));}
const {articleSections,newestPosts,relatedPosts}=await import(pathToFileURL(path.join(out,'blog.mjs')).href);
assert.equal(articleSections(sectionContent.posts[0])[0].heading,'A useful heading');assert.equal(articleSections(defaultContent.posts[0])[0].body,defaultContent.posts[0].paragraphs[0]);
const sample=[{...defaultContent.posts[0],slug:'old',date:'2020-01-01',category:'AI'},{...defaultContent.posts[0],slug:'new',date:'2026-01-01',category:'Cloud'},{...defaultContent.posts[0],slug:'similar',date:'2025-01-01',category:'AI'}];
assert.equal(newestPosts(sample)[0].slug,'new');assert.equal(relatedPosts(sample,sample[0])[0].slug,'similar');assert.ok(!relatedPosts(sample,sample[0]).some(p=>p.slug==='old'));
console.log('Blog checks: section compatibility, image validation, figure validation, date sorting and related articles passed.');

const {blogLanguage,blogDirection,formatBlogDate}=await import(pathToFileURL(path.join(out,'blog.mjs')).href);
const englishPost={...defaultContent.posts[0],title:'A new English article',summary:'An English introduction.',paragraphs:['English article content.']};
const arabicPost={...englishPost,slug:'arabic-example',title:'مقال جديد باللغة العربية',summary:'مقدمة المقال باللغة العربية',paragraphs:['هذا محتوى المقال المكتوب باللغة العربية.']};
const bilingualContent={...defaultContent,posts:[englishPost,arabicPost]};
assert.equal(localizeContent(bilingualContent,'ar').posts[0].language,'ar');assert.deepEqual(localizeContent(bilingualContent,'en').posts,bilingualContent.posts);
assert.equal(blogDirection(englishPost),'ltr');assert.equal(blogDirection(arabicPost),'rtl');assert.equal(blogLanguage({...englishPost,language:'ar'}),'ar');
assert.match(formatBlogDate('2026-11-03','ar'),/[\u0600-\u06ff]/);
console.log('Blog language checks passed: original text preservation, automatic/explicit direction and Arabic dates.');

const {mergeArabicEdits}=await import(pathToFileURL(path.join(out,'i18n.mjs')).href);
const source=structuredClone(defaultContent),arabicDraft=localizeContent(source,'ar');
arabicDraft.teamMembers[0].bio='Arabic bio test';
arabicDraft.copy['label:New static label']='Arabic label test';
arabicDraft.teamMembers.splice(1,1);
const merged=mergeArabicEdits(source,arabicDraft);validateContent(merged);
assert.equal(merged.teamMembers[0].bio,source.teamMembers[0].bio);
assert.equal(localizeContent(merged,'ar').teamMembers[0].bio,'Arabic bio test');
assert.equal(merged.teamMembers[1].id,source.teamMembers[2].id);
assert.equal(merged.teamMembers[1].bio,source.teamMembers[2].bio);
assert.equal(merged.copy['label:New static label'],undefined);
assert.equal(merged.copy['ar:New static label'],'Arabic label test');
console.log('Arabic editing: English preservation, deletion identity and visual label overrides passed.');

for(const value of Object.values(defaultContent.copy))assert.ok(!/\?{2,}/.test(value),'Corrupted bundled translation');
assert.equal(translate('الخبر','ar'),'الدمام');assert.equal(translate('الحسيني','ar'),'الحصيني');
const numericDraft=localizeContent(source,'ar');numericDraft.copy['profile.stats.0.value']='15';const numeric=mergeArabicEdits(source,numericDraft);assert.equal(numeric.copy['profile.stats.0.value'],'15');

const blogDraft=localizeContent(source,'ar');blogDraft.posts[0].title='عنوان عربي للاختبار';blogDraft.posts[0].paragraphs[0]='محتوى عربي للاختبار';
const blogMerged=mergeArabicEdits(source,blogDraft);validateContent(blogMerged);assert.equal(blogMerged.posts[0].title,source.posts[0].title);assert.equal(blogMerged.posts[0].paragraphs[0],source.posts[0].paragraphs[0]);assert.equal(localizeContent(blogMerged,'ar').posts[0].title,'عنوان عربي للاختبار');assert.equal(localizeContent(blogMerged,'ar').posts[0].paragraphs[0],'محتوى عربي للاختبار');
for(const post of localizeContent(defaultContent,'ar').posts){assert.match(post.title,/[\u0600-\u06ff]/);assert.match(post.summary,/[\u0600-\u06ff]/);for(const paragraph of post.paragraphs)assert.match(paragraph,/[\u0600-\u06ff]/);}
console.log('Full Arabic blog translation and independent Arabic article edits passed.');
