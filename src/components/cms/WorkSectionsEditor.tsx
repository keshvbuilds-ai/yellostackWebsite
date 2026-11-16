'use client';
import {useState} from 'react';
import Link from 'next/link';
import type {SiteContent,WorkSection} from '@/lib/cms/types';
import {workSections,workProjects,workServices} from '@/content/work-catalogue';
import {Field,type Value} from './ContentField';

export default function WorkSectionsEditor({content,onChange}:{content:SiteContent;onChange:(content:SiteContent)=>void}){
 const sections=workSections(content),projects=workProjects(content);
 const [selected,setSelected]=useState('');
 const section=sections.find(s=>s.slug===selected)??sections[0];
 const saveSections=(next:WorkSection[])=>onChange({...content,workSections:next});
 const update=(change:Partial<WorkSection>)=>saveSections(sections.map(s=>s.slug===section.slug?{...s,...change}:s));
 const index=sections.findIndex(s=>s.slug===section?.slug);
 function move(offset:number){const next=[...sections];[next[index],next[index+offset]]=[next[index+offset],next[index]];saveSections(next);}
 return <div className="cms-work-sections">
 <p>Each section appears inside Why choose us on the Work page. Its View projects button opens a gallery: three columns on desktop, two on tablets, and one on phones. Save draft, then Publish.</p>
 <p>Use English / Arabic above to edit each language. Section URLs stay fixed so existing links keep working. Mobile app details can also be edited in Mobile apps.</p>
 <div className="cms-row"><button type="button" disabled={sections.length>=30} onClick={()=>{const slug='section-'+crypto.randomUUID();saveSections([...sections,{slug,service:slug,title:'New Work section',description:'Describe the work in this section.',serviceUrl:''}]);setSelected(slug);}}>+ Add Work section</button><Link href="/portfolio" target="_blank">View published Work page</Link></div>
 {section&&<><label className="cms-field"><span>Choose Work section</span><select value={section.slug} onChange={e=>setSelected(e.target.value)}>{sections.map(s=><option key={s.slug} value={s.slug}>{s.title} ({projects.filter(p=>p.service===s.service).length} projects)</option>)}</select></label>
 <label className="cms-field"><span>Section title</span><input maxLength={200} value={section.title} onChange={e=>update({title:e.target.value})}/></label>
 <label className="cms-field"><span>Section introduction</span><textarea rows={4} value={section.description} onChange={e=>update({description:e.target.value})}/></label>
 <label className="cms-field"><span>Explore service link (optional)</span><input value={section.serviceUrl} placeholder="/oracle-apex or https://example.com" onChange={e=>update({serviceUrl:e.target.value})}/></label>
 <p><Link href={'/portfolio/projects/'+section.slug} target="_blank">Open published project gallery</Link> (new sections appear after publishing)</p>
 <div className="cms-row"><button type="button" disabled={index===0} onClick={()=>move(-1)}>Move section up</button><button type="button" disabled={index===sections.length-1} onClick={()=>move(1)}>Move section down</button><button type="button" disabled={workServices.some(s=>s.slug===section.slug)||sections.length===1||projects.some(p=>p.service===section.service)} onClick={()=>{if(confirm('Remove this empty section? Publish to remove it from the website.')){saveSections(sections.filter(s=>s.slug!==section.slug));setSelected('');}}}>Remove empty section</button></div>
 <h3>Projects in this section</h3><p>Use Project collection to move a project to another section. Custom sections can be removed once empty. The original Web design and Mobile apps sections are kept for existing links.</p>
 <button type="button" disabled={projects.length>=200} onClick={()=>onChange({...content,workSections:sections,workProjectsManaged:true,workProjects:[...projects,{id:crypto.randomUUID(),service:section.service,title:'New project',description:'',image:'',url:'',category:section.slug==='mobile-apps'?'grocery-delivery':'',sections:[]}]})}>+ Add project to this section</button>
 {projects.map((project,i)=>project.service===section.service&&<details className="cms-item" key={project.id}><summary>{project.title||'Untitled project'}</summary><div className="cms-item-body"><Field collections={sections} path={'workProjects.'+i} value={project as unknown as Value} onChange={next=>onChange({...content,workSections:sections,workProjectsManaged:true,workProjects:projects.map(p=>p.id===project.id?next as unknown as typeof project:p)})}/><div className="cms-row"><button type="button" disabled={!projects.slice(0,i).some(p=>p.service===section.service)} onClick={()=>{const next=[...projects];let previous=i-1;while(previous>=0&&next[previous].service!==section.service)previous--;if(previous<0)return;[next[previous],next[i]]=[next[i],next[previous]];onChange({...content,workProjectsManaged:true,workProjects:next});}}>Move project up</button><button type="button" onClick={()=>{if(confirm('Delete this project from the draft? Publish to remove it from the website.'))onChange({...content,workProjectsManaged:true,workProjects:projects.filter(p=>p.id!==project.id)});}}>Delete project</button></div></div></details>)}
 {!projects.some(p=>p.service===section.service)&&<p>No projects yet. Add your first project above.</p>}</>}
 </div>;
}
