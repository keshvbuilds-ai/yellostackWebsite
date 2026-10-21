import {notFound} from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProjectCollection from '@/components/work/ProjectCollection';
import {appCategories,workServices} from '@/content/work-catalogue';
type Props={params:Promise<{collection:string[]}>};
export async function generateMetadata({params}:Props){const [service,category]= (await params).collection;return {title:`${appCategories.find(c=>c.slug===category)?.title??workServices.find(s=>s.slug===service)?.title??'Projects'} | YelloStack`};}
export default async function Page({params}:Props){const parts=(await params).collection;const [collection,category]=parts;if(parts.length>2||!workServices.some(s=>s.slug===collection)||(category&&(collection!=='mobile-apps'||!appCategories.some(c=>c.slug===category))))notFound();return <><Navigation solid/><ProjectCollection collection={collection} category={category}/><Footer/></>;}
