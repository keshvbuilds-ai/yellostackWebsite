import {ContentProvider} from '@/components/cms/ContentProvider';
import {getSiteContent} from '@/lib/cms/server';
import AdminPanel from '@/components/cms/AdminPanel';
export const metadata={title:'Content studio | Yellostack',robots:{index:false,follow:false}};
export default async function AdminPage(){return <ContentProvider content={await getSiteContent()} locale="en"><AdminPanel/></ContentProvider>;}
