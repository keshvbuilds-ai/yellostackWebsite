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
  pages: innerPages.map(page=>({...page,sections:page.sections.map(section=>({...section,image:'',imageAlt:''}))})),
  posts: blogPosts.map(post=>({...post,coverImage:''})), roles: [], clients: [{"id":"profile-halliburton","name":"Halliburton","image":"/clients/halliburton.png","url":""},{"id":"profile-municipal-rural-affairs","name":"Ministry of Municipal and Rural Affairs","image":"/clients/municipal-rural-affairs.png","url":""},{"id":"profile-east-pipes","name":"East Pipes","image":"/clients/east-pipes.png","url":""},{"id":"profile-arabian-transformers","name":"Arabian Transformers","image":"/clients/arabian-transformers.png","url":""},{"id":"profile-juman","name":"Juman Saudi Industrial Investment","image":"/clients/juman.png","url":""},{"id":"profile-saad-alotaibi","name":"Saad Bin Soliab Alotaibi & Sons Holding Co.","image":"/clients/saad-alotaibi.png","url":""},{"id":"profile-meirc","name":"MEIRC","image":"/clients/meirc.png","url":""},{"id":"profile-aramco","name":"Aramco","image":"/clients/aramco.png","url":""},{"id":"profile-arabian-delta","name":"Arabian Delta","image":"/clients/arabian-delta.png","url":""},{"id":"profile-al-howail","name":"Al-Howail","image":"/clients/al-howail.png","url":""},{"id":"profile-israf","name":"La Israf","image":"/clients/israf.png","url":""},{"id":"profile-al-dawaa","name":"Al-Dawaa","image":"/clients/al-dawaa.png","url":""},{"id":"profile-proceed","name":"Proceed Healthcare Logistics","image":"/clients/proceed.png","url":""},{"id":"profile-maaden","name":"Ma’aden","image":"/clients/maaden.png","url":""},{"id":"profile-delmon","name":"Delmon Poultry Company","image":"/clients/delmon.png","url":""},{"id":"profile-al-khobar","name":"Al Khobar Municipality","image":"/clients/al-khobar.png","url":""}], copy: {...copy,...Object.fromEntries(Object.entries(arabic).map(([key,value])=>['ar:'+key,value]))},
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
