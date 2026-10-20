import publishedWork from '@/content/published-work.json';
import {industries} from '@/content/industries';
import { serviceBanners } from '@/content/service-banners';
import { stockMedia, studioFilm } from '@/content/media';
import arabic from '@/content/arabic.json';
import { yellostackData } from '@/content/yellostack';
import { innerPages } from '@/content/inner-pages';
import { blogPosts } from '@/content/blog';
import copy from '@/content/cms-copy.json';
import type { SiteContent } from './types';
export const defaultContent: SiteContent = {
  site: yellostackData,
  products:[],workProjects:publishedWork,industryEntries:industries,
  teamMembers:[
    {id:'hassan',name:'Hassan Majrashi',role:'General Manager',bio:'Leading YelloStack mission to build intelligent technology from Saudi Arabia for a connected digital future.',image:'/team/hassan-majrashi.png',demo:false},
    {id:'faisal',name:'Faisal Al-Qahtani',role:'Technology Lead',bio:'Sample profile: bringing software engineering and thoughtful problem-solving together.',image:'/team/placeholder-saudi.svg',demo:true},
    {id:'omar',name:'Omar Al-Harbi',role:'AI Solutions Specialist',bio:'Sample profile: exploring practical AI applications that help people work more effectively.',image:'/team/placeholder-saudi.svg',demo:true}
  ],
  pages: innerPages.map(page=>({...page,sections:page.sections.map(section=>({...section,image:'',imageAlt:''}))})),
  posts: blogPosts.map(post=>({...post,coverImage:'',galleryImages:[]})), roles: [], clients: [{"id":"profile-halliburton","name":"Halliburton","image":"/clients/halliburton.png","url":""},{"id":"profile-municipal-rural-affairs","name":"Ministry of Municipal and Rural Affairs","image":"/clients/municipal-rural-affairs.png","url":""},{"id":"profile-east-pipes","name":"East Pipes","image":"/clients/east-pipes.png","url":""},{"id":"profile-arabian-transformers","name":"Arabian Transformers","image":"/clients/arabian-transformers.png","url":""},{"id":"profile-juman","name":"Juman Saudi Industrial Investment","image":"/clients/juman.png","url":""},{"id":"profile-saad-alotaibi","name":"Saad Bin Soliab Alotaibi & Sons Holding Co.","image":"/clients/saad-alotaibi.png","url":""},{"id":"profile-meirc","name":"MEIRC","image":"/clients/meirc.png","url":""},{"id":"profile-aramco","name":"Aramco","image":"/clients/aramco.png","url":""},{"id":"profile-arabian-delta","name":"Arabian Delta","image":"/clients/arabian-delta.png","url":""},{"id":"profile-al-howail","name":"Al-Howail","image":"/clients/al-howail.png","url":""},{"id":"profile-israf","name":"La Israf","image":"/clients/israf.png","url":""},{"id":"profile-al-dawaa","name":"Al-Dawaa","image":"/clients/al-dawaa.png","url":""},{"id":"profile-proceed","name":"Proceed Healthcare Logistics","image":"/clients/proceed.png","url":""},{"id":"profile-maaden","name":"Ma’aden","image":"/clients/maaden.png","url":""},{"id":"profile-delmon","name":"Delmon Poultry Company","image":"/clients/delmon.png","url":""},{"id":"profile-al-khobar","name":"Al Khobar Municipality","image":"/clients/al-khobar.png","url":""}].map(client=>({...client,sector:({'profile-halliburton':'Oil & Gas','profile-aramco':'Oil & Gas','profile-municipal-rural-affairs':'Government','profile-al-khobar':'Government','profile-al-dawaa':'Healthcare','profile-proceed':'Transport','profile-delmon':'Retail'} as Record<string,string>)[client.id]||'Enterprise',recent:false,projectSummary:''})), copy: {...copy,...Object.fromEntries(Object.entries(arabic).map(([key,value])=>['ar:'+key,value]))},
  media: {
    '/team/hassan-majrashi.png':'/team/hassan-majrashi.png',
    '/banners/vision-inspection.svg':'/banners/vision-inspection.svg',
    '/banners/learning-model.svg':'/banners/learning-model.svg',
    '/banners/knowledge-search.svg':'/banners/knowledge-search.svg',
    ...Object.fromEntries(Object.values(serviceBanners).map(src=>[src,src])),
    ...Object.fromEntries(Object.values(stockMedia).map(item=>[item.src,item.src])),
    'studio.video':studioFilm.src,
    '/logoyelostack.png': '/logoyelostack.png', '/StackLogo.jpeg': '/StackLogo.jpeg',
    '/layer-experience.svg': '/layer-experience.svg', '/layer-intelligence.svg': '/layer-intelligence.svg', '/layer-operations.svg': '/layer-operations.svg',
  },
};
