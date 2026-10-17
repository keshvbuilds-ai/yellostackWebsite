'use client';
import {ArrowUp,ArrowDown} from 'lucide-react';
import {usePathname} from 'next/navigation';
import {useTranslate} from './cms/ContentProvider';
import './page-jump-controls.css';
export default function PageJumpControls(){const pathname=usePathname();const t=useTranslate();if(pathname.startsWith('/admin'))return null;
 function jump(target:'top'|'footer'){const footer=document.querySelector('.business-footer');const y=target==='top'?0:Math.max(0,(footer?.getBoundingClientRect().top??0)+window.scrollY-110);const event=new CustomEvent('ys:page-jump',{detail:{y},cancelable:true});if(window.dispatchEvent(event))window.scrollTo({top:y,behavior:'instant'});}
 return <div className="ys-page-jumps" role="group" aria-label={t('Page navigation')}><button onClick={()=>jump('top')} aria-label={t('Go to page banner')} title={t('Go to page banner')}><ArrowUp size={19}/></button><span/><button onClick={()=>jump('footer')} aria-label={t('Go to footer')} title={t('Go to footer')}><ArrowDown size={19}/></button></div>;
}
