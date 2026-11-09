import {notFound} from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProjectCollection from '@/components/work/ProjectCollection';
import AppProject from '@/components/work/AppProject';
import {appCategories,workServices,workProjects} from '@/content/work-catalogue';
import {getSiteContent} from '@/lib/cms/server';
type Props={params:Promise<{collection:string[]}>};
async function resolve(parts:string[]){
 const [collection,category,id]=parts;
 if(collection==='mobile-apps'&&category==='app'&&parts.length===3){const project=workProjects(await getSiteContent()).find(p=>p.id===id&&p.service===workServices[1].service);if(!project)notFound();return {collection,project};}
 if(parts.length>2||!workServices.some(s=>s.slug===collection)||(category&&(collection!=='mobile-apps'||!appCategories.some(c=>c.slug===category))))notFound();
 return {collection,category};
}
export async function generateMetadata({params}:Props){const result=await resolve((await params).collection);return {title:`${result.project?.title??appCategories.find(c=>c.slug===result.category)?.title??workServices.find(s=>s.slug===result.collection)?.title} | YelloStack`};}
export default async function Page({params}:Props){const result=await resolve((await params).collection);return <><Navigation solid/>{result.project?<AppProject id={result.project.id}/>:<ProjectCollection collection={result.collection} category={result.category}/>}<Footer/></>;}
