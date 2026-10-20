import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
// Export public Work content only. Never read the CMS store, sessions or draft data.
const origin=process.env.CMS_EXPORT_ORIGIN||'http://localhost:3000';
const response=await fetch(new URL('/api/cms/public',origin));
if(!response.ok)throw new Error(`Public CMS export failed: ${response.status}`);
const content=await response.json();
if(!Array.isArray(content.workProjects))throw new Error('Public Work projects missing');
const projects=[];await mkdir('public/work-published',{recursive:true});
for(const project of content.workProjects){
 const {id,title,description,image,service,url}=project;
 let publishedImage=image;
 if(image?.startsWith('/api/media/')){
  const filename=path.posix.basename(image);
  if(!/^[\w-]+\.(jpg|jpeg|png|webp|avif)$/i.test(filename))throw new Error('Unexpected media filename');
  const media=await fetch(new URL(image,origin));if(!media.ok)throw new Error(`Cannot export ${filename}`);
  await writeFile(`public/work-published/${filename}`,Buffer.from(await media.arrayBuffer()));
  publishedImage=`/work-published/${filename}`;
 }
 projects.push({id,title,description,image:publishedImage,service,url});
}
await writeFile('src/content/published-work.json',JSON.stringify(projects,null,2)+'\n');
console.log(`Exported ${projects.length} published Work projects. No drafts or credentials exported.`);
