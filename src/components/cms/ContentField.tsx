'use client';
import GalleryField from './GalleryField';
import ImageField from './ImageField';
import {useContent} from './ContentProvider';
export type Value = string|number|boolean|null|Value[]|{[key:string]:Value};
const templates:Record<string,Value>={
  teamMembers:{id:'new-person',name:'New team member',role:'Role',bio:'A short introduction.',image:'/team/placeholder-saudi.svg',demo:false},
  products:{id:'new-product',title:'New product',description:'Describe this product.',image:'',features:['Key feature'],url:''},
  workProjects:{id:'new-project',title:'Project name',description:'Describe the work delivered.',image:'',service:'website-design-company',url:''},
  industryEntries:{id:'new-industry',title:'Industry name',category:'People & services',headline:'A clear direction.',body:'Describe how you support this industry.',use1:'Use case one',use2:'Use case two',use3:'Use case three',service:'website-design-company',solution:'Web development',image:'/banners/enterprise.svg'},
  roles:{id:'new-role',title:'New role',location:'Saudi Arabia',type:'Full time',description:'Describe this opportunity.',applyEmail:'hello@yellostack.com',open:true},
  clients:{id:'new-client',name:'Client name',image:'',url:'',sector:'Enterprise',recent:false,projectSummary:''},
  posts:{slug:'new-article',title:'New article',date:new Date().toISOString().slice(0,10),category:'News',summary:'Article introduction.',paragraphs:['Write your article here.'],source:'',coverImage:'',galleryImages:[]},
  galleryImages:{image:'',imageAlt:''},
  pages:{slug:'new-page',title:'New page',eyebrow:'Yellostack',intro:'Page introduction.',kind:'company',source:'',sections:[{title:'Section heading',body:'Section content.',image:'',imageAlt:''}]},
};
function label(value:string){if(value==='url')return 'Destination link (optional)';if(value==='demo')return 'Show placeholder profile label';return value.replace(/([a-z])([A-Z])/g,'$1 $2').replaceAll('_',' ');}
export function Field({value,path,onChange,onSave}:{value:Value;path:string;onChange:(value:Value)=>void;onSave?:()=>void}) {
  const site=useContent();
  const name=path.split('.').at(-1)!;
  if(name==='galleryImages'&&Array.isArray(value))return <GalleryField value={value as {image:string;imageAlt:string}[]} onChange={onChange}/>;
  if(name==='id')return null;
  if(name==='service'&&typeof value==='string')return <label className="cms-field"><span>Service category</span><select value={value} onChange={e=>onChange(e.target.value)}>{site.pages.filter(p=>p.kind==='service').map(p=><option value={p.slug} key={p.slug}>{p.title}</option>)}</select></label>;
  if(typeof value==='string' && /^(image|coverImage)$/.test(name))return <ImageField value={value} label={label(name)} onChange={onChange}/>;
  if(typeof value==='boolean')return <label className="cms-check"><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)}/>{label(name)}</label>;
  if(typeof value==='string'||typeof value==='number')return <label className="cms-field"><span>{label(name)}</span>{name==='sector'?<select value={String(value)} onChange={e=>onChange(e.target.value)}>{['','Enterprise','Healthcare','Oil & Gas','Transport','Retail','Government'].map(v=><option key={v} value={v}>{v||'Choose sector'}</option>)}</select>:name==='kind'?<select value={String(value)} onChange={e=>onChange(e.target.value)}>{['company','service','directory','contact','portfolio'].map(v=><option key={v}>{v}</option>)}</select>:typeof value==='number'?<input type="number" value={value} onChange={e=>onChange(Number(e.target.value))}/>:value.length>90||/description|body|intro|summary|paragraph/i.test(path)?<textarea rows={4} value={value} onChange={e=>onChange(e.target.value)}/>:<input value={value} onChange={e=>onChange(e.target.value)}/>}</label>;
  if(Array.isArray(value))return <div className="cms-array">{value.map((item,index)=><details key={index} className="cms-item" open={typeof item!=='object'}><summary>{typeof item==='object' && item!==null && !Array.isArray(item)?String(item.title||item.name||item.step||item.label||`Item ${index+1}`):`Item ${index+1}`}</summary><div className="cms-item-body"><Field onSave={onSave} value={item} path={`${path}.${index}`} onChange={next=>onChange(value.map((old,i)=>i===index?next:old))}/><div className="cms-row">{onSave&&!path.includes('.')&&<button type="button" onClick={onSave}>Save</button>}<button type="button" disabled={index===0} onClick={()=>{const next=[...value];[next[index-1],next[index]]=[next[index],next[index-1]];onChange(next);}}>Move up</button><button type="button" onClick={()=>{if(confirm('Remove this item from the draft?'))onChange(value.filter((_,i)=>i!==index));}}>Remove</button></div></div></details>)}<button type="button" onClick={()=>{const sample=templates[path]??templates[name]??value[0]??'';const next=structuredClone(sample);if(next&&typeof next==='object'&&!Array.isArray(next)&&'id' in next)next.id=crypto.randomUUID();if(next&&typeof next==='object'&&!Array.isArray(next)&&'slug' in next)next.slug=String(next.slug)+'-'+crypto.randomUUID().slice(0,6);onChange([...value,next]);}}>+ Add {label(name)}</button></div>;
  if(value && typeof value==='object')return <div className="cms-fields">{Object.entries(value).map(([key,entry])=><div key={key}>{entry && typeof entry==='object'?<details className="cms-item"><summary>{label(key)}</summary><div className="cms-item-body"><Field onSave={onSave} value={entry} path={`${path}.${key}`} onChange={next=>onChange({...value,[key]:next})}/></div></details>:<Field onSave={onSave} value={entry} path={`${path}.${key}`} onChange={next=>onChange({...value,[key]:next})}/>}</div>)}</div>;
  return null;
}
