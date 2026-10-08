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
  posts: blogPosts.map(post=>({...post,coverImage:''})), roles: [], clients: [], copy: {...copy,...Object.fromEntries(Object.entries(arabic).map(([key,value])=>['ar:'+key,value]))},
  media: {
    ...Object.fromEntries(Object.values(stockMedia).map(item=>[item.src,item.src])),
    'studio.video':studioFilm.src,
    '/logoyelostack.png': '/logoyelostack.png', '/StackLogo.jpeg': '/StackLogo.jpeg',
    '/layer-experience.svg': '/layer-experience.svg', '/layer-intelligence.svg': '/layer-intelligence.svg', '/layer-operations.svg': '/layer-operations.svg',
  },
};
