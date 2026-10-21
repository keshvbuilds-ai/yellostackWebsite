import type {SiteContent} from './types';
/** Accept ordinary domain entry without relaxing URL scheme validation. */
export function normalizeContentLinks(content:SiteContent):SiteContent{
 const link=(value:string)=>{const clean=value.trim();return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?::[0-9]+)?(?:[/?#][^\s]*)?$/i.test(clean)?`https://${clean}`:clean;};
 return {...content,workProjects:content.workProjects?.map(project=>({...project,url:typeof project.url==='string'?link(project.url):project.url}))};
}
