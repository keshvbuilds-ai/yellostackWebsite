import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { defaultContent } from './defaults';
import type { SiteContent } from './types';
import { validateContent } from './validate';
export const sessionCookie = 'ys-cms-session';
export function cmsConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}
export async function supabase(path: string, init: RequestInit = {}, token?: string) {
  const config = cmsConfig();
  if (!config) throw new Error('CMS is not configured. Follow docs/CMS-DEPLOYMENT.md.');
  const headers = new Headers(init.headers);
  headers.set('apikey', config.key);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  else headers.set('Authorization', `Bearer ${config.key}`);
  return fetch(`${config.url}${path}`, { ...init, headers, cache: 'no-store', signal: AbortSignal.timeout(12000) });
}
export async function requireEditor() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) throw new Error('Unauthorized');
  const userResponse = await supabase('/auth/v1/user', {}, token);
  if (!userResponse.ok) throw new Error('Unauthorized');
  const user = await userResponse.json();
  const editor = await supabase(`/rest/v1/cms_editors?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`, {}, token);
  if (!editor.ok || !(await editor.json()).length) throw new Error('Forbidden');
  return { token, email: user.email as string };
}
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  if (!cmsConfig()) return defaultContent;
  try {
    const response = await supabase('/rest/v1/cms_public?id=eq.site&select=content');
    if (!response.ok) return defaultContent;
    const rows = await response.json();
    if (!rows[0]?.content) return defaultContent;
    const content = { ...defaultContent, ...rows[0].content, copy: { ...defaultContent.copy, ...rows[0].content.copy }, media: { ...defaultContent.media, ...rows[0].content.media } };
    validateContent(content);
    return content;
  } catch { return defaultContent; }
});
