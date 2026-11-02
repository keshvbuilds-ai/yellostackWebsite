import bundled from './published-work.json';
import type {SiteContent,WorkProject} from '@/lib/cms/types';
export const workServices=[
 {slug:'web-design',service:'website-design-company',title:'Web design & development',description:'Thoughtful design meets reliable engineering. We build clear, responsive websites that express your brand and make every interaction feel effortless.'},
 {slug:'mobile-apps',service:'mobile-application-development-company-saudi-arabia',title:'Mobile app development',description:'Useful, intuitive applications built around real people. Explore experiences for everyday essentials, learning, healthcare and on-demand services.'}
];
export const appCategories=[{slug:'grocery-delivery',title:'Grocery & delivery'},{slug:'education',title:'Education'},{slug:'healthcare',title:'Healthcare'},{slug:'custom-web-applications',title:'Custom web applications'},{slug:'booking-on-demand',title:'Booking & on-demand services'}];
/** Restore the category on legacy grocery examples; never overwrite an editor's selection. */
export function restoreProjectCategory(project:WorkProject):WorkProject{
 if(project?.service!=='mobile-application-development-company-saudi-arabia'||project.category)return project;
 const title=typeof project.title==='string'?project.title.trim().toLowerCase().replace(/\s+/g,' '):'';
 if(['grocery delivery','grocery delivery app','grocery delivery app - concept','grocery & delivery'].includes(title))return {...project,category:'grocery-delivery'};
 return project;
}
export function workProjects(content:SiteContent):WorkProject[]{return (content.workProjectsManaged?content.workProjects??[]:Array.from(new Map([...bundled,...(content.workProjects??[])].map(p=>[p.service+':'+p.title.trim().toLowerCase(),p])).values())).map(restoreProjectCategory);}
