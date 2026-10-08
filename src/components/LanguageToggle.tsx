'use client';
import { useState } from 'react';
import { useLocale } from './cms/ContentProvider';
export default function LanguageToggle(){
 const locale=useLocale();const [busy,setBusy]=useState(false);const [error,setError]=useState(false);
 return <div className="ys-language"><button type="button" disabled={busy} lang={locale==='en'?'ar':'en'} aria-label={locale==='en'?'Switch to Arabic':'التبديل إلى الإنجليزية'} onClick={async()=>{setBusy(true);setError(false);try{const response=await fetch('/api/locale',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale:locale==='en'?'ar':'en'})});if(!response.ok)throw new Error();window.location.reload();}catch{setError(true);setBusy(false);}}}>{busy?'…':locale==='en'?'العربية':'English'}</button>{error&&<span role="status">{locale==='en'?'Please try again.':'يرجى المحاولة مجدداً.'}</span>}</div>;
}
