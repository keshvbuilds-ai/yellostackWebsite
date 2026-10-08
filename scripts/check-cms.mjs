import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import ts from 'typescript';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'.cms-check');
await fs.mkdir(out,{recursive:true});
const files={yellostack:'src/content/yellostack.ts',pages:'src/content/inner-pages.ts',blog:'src/content/blog.ts',defaults:'src/lib/cms/defaults.ts',validate:'src/lib/cms/validate.ts'};
for(const [name,file] of Object.entries(files)){
  let source=await fs.readFile(path.join(root,file),'utf8');
  source=source.replace("'@/content/yellostack'","'./yellostack.mjs'").replace("'@/content/inner-pages'","'./pages.mjs'").replace("'@/content/blog'","'./blog.mjs'").replace("'./defaults'","'./defaults.mjs'");
  if(name==='defaults')source=source.replace("import copy from '@/content/cms-copy.json';",`const copy = ${await fs.readFile(path.join(root,'src/content/cms-copy.json'),'utf8')};`);
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
