import {oracleApexPage} from '@/content/oracle-apex';
import type {InnerPage} from '@/content/inner-pages';
export function withOracleApex(pages:InnerPage[]):InnerPage[]{return pages.some(page=>page.slug===oracleApexPage.slug)?pages:[...pages,structuredClone(oracleApexPage)];}
