import 'server-only';
import { cookies } from 'next/headers';
import { getSiteContent } from './cms/server';
import { localizeContent, type Locale } from './i18n';
export async function getLocale():Promise<Locale>{return (await cookies()).get('ys-locale')?.value==='ar'?'ar':'en';}
export async function getLocalizedContent(){return localizeContent(await getSiteContent(),await getLocale());}
