import bundled from './published-work.json';
import type {SiteContent,WorkProject} from '@/lib/cms/types';
export const workServices=[
 {slug:'web-design',service:'website-design-company',title:'Web design & development',description:'Thoughtful design meets reliable engineering. We build clear, responsive websites that express your brand and make every interaction feel effortless.'},
 {slug:'mobile-apps',service:'mobile-application-development-company-saudi-arabia',title:'Mobile app development',description:'Useful, intuitive applications built around real people. Explore experiences for everyday essentials, learning, healthcare and on-demand services.'}
];
export const appCategories=[{slug:'grocery-delivery',title:'Grocery & delivery'},{slug:'education',title:'Education'},{slug:'healthcare',title:'Healthcare'},{slug:'custom-web-applications',title:'Custom web applications'},{slug:'booking-on-demand',title:'Booking & on-demand services'}];
export function workProjects(content:SiteContent):WorkProject[]{return content.workProjectsManaged?content.workProjects??[]:Array.from(new Map([...bundled,...(content.workProjects??[])].map(p=>[p.service+':'+p.title.trim().toLowerCase(),p])).values());}
