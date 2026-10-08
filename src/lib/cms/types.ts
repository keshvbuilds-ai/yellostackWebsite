import type { yellostackData } from '@/content/yellostack';
import type { InnerPage } from '@/content/inner-pages';
import type { BlogPost } from '@/content/blog';
export type Role = { id: string; title: string; location: string; type: string; description: string; applyEmail: string; open: boolean };
export type ClientLogo = { id: string; name: string; image: string; url: string };
export type SiteContent = {
  site: typeof yellostackData;
  pages: InnerPage[];
  posts: BlogPost[];
  roles: Role[];
  clients: ClientLogo[];
  copy: Record<string, string>;
  media: Record<string, string>;
};
