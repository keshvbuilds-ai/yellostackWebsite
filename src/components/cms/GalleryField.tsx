'use client';
import {useState} from 'react';
import ImageField from './ImageField';
type GalleryImage={image:string;imageAlt:string};
export default function GalleryField({value,onChange}:{value:GalleryImage[];onChange:(value:GalleryImage[])=>void}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 return <div className="cms-array"><p>Optional article gallery: up to 12 images at the end of the article.</p><fieldset disabled={busy}>
 {value.map((item,index)=><div className="cms-item-body" key={index}>
 <ImageField value={item.image} label={`Gallery image ${index+1}`} onChange={image=>onChange(value.map((old,i)=>i===index?{...old,image}:old))}/>
 <label className="cms-field"><span>Image description</span><input value={item.imageAlt} onChange={e=>onChange(value.map((old,i)=>i===index?{...old,imageAlt:e.target.value}:old))}/></label>
 <div className="cms-row"><button type="button" disabled={index===0} onClick={()=>{const next=[...value];[next[index-1],next[index]]=[next[index],next[index-1]];onChange(next);}}>Move up</button><button type="button" onClick={()=>onChange(value.filter((_,i)=>i!==index))}>Remove image</button></div>
 </div>)}
 <label className="cms-image-upload">{busy?'Uploading images...':'Upload gallery images'}
 <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/avif" disabled={value.length>=12} onChange={async e=>{
 const files=Array.from(e.target.files??[]);e.target.value='';if(!files.length)return;
 if(value.length+files.length>12){setMessage('Choose no more than 12 images in total.');return;}
 setBusy(true);setMessage('');const added:GalleryImage[]=[];
 try{for(const file of files){const form=new FormData();form.append('file',file);const response=await fetch('/api/cms/upload',{method:'POST',body:form});const result=await response.json();if(!response.ok)throw new Error(result.error||'Image upload failed');added.push({image:result.url,imageAlt:''});}setMessage('Images uploaded. Save your draft when ready.');}
 catch(error){setMessage((error as Error).message);}
 finally{if(added.length)onChange([...value,...added]);setBusy(false);}
 }}/></label>
 <button type="button" disabled={value.length>=12} onClick={()=>onChange([...value,{image:'',imageAlt:''}])}>+ Add image by URL</button></fieldset>
 {message&&<p role="status">{message}</p>}</div>;
}
