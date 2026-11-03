'use client';
import type {SiteContent} from '@/lib/cms/types';
import {generalSettings} from '@/lib/cms/general';
import {whatsappLink} from '@/lib/whatsapp';
import ImageField from './ImageField';
import SmtpSettings from './SmtpSettings';
export default function GeneralSettings({content,onChange}:{content:SiteContent;onChange:(c:SiteContent)=>void}){
 const g=generalSettings(content),contact=content.site.contact;
 const whatsappUrl=whatsappLink(contact.whatsappNumber);
 const change=(key:keyof typeof g,value:string|number|boolean)=>onChange({...content,general:{...g,[key]:value}});
 const contactChange=(key:keyof typeof contact,value:string)=>onChange({...content,site:{...content.site,contact:{...contact,[key]:value,...(key==='telephone'?{telephoneHref:'tel:'+value.replace(/[^+\d]/g,'')}:{})}}});
 return <div className="cms-general">
 <h3>Brand identity</h3><ImageField label="Website logo — use a transparent image" value={content.media['/logoyelostack.png']||'/logoyelostack.png'} onChange={value=>onChange({...content,media:{...content.media,'/logoyelostack.png':value}})}/>
 <h3>Contact & office</h3>{(['email','telephone','whatsappNumber','address'] as const).map(key=><label className="cms-field" key={key}><span>{({email:'Public contact email',telephone:'Office telephone',whatsappNumber:'WhatsApp number (country code; blank hides button)',address:'Office address'})[key]}</span><input type={key==='email'?'email':'text'} value={contact[key]??''} onChange={e=>contactChange(key,e.target.value)}/></label>)}
 <label className="cms-field"><span>WhatsApp link (generated from the number above)</span><input readOnly value={whatsappUrl} placeholder="Enter a WhatsApp number with country code" onFocus={e=>e.target.select()}/></label>
 {whatsappUrl?<p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp to check this number ?</a><br/>Publish your changes to update the website WhatsApp button.</p>:<p>{contact.whatsappNumber?'Enter a valid number including country code to enable WhatsApp.':'The WhatsApp button is hidden when its number is blank.'}</p>}
 {(['salesEmail' ,'salesPhone','mapUrl'] as const).map(key=><label className="cms-field" key={key}><span>{({salesEmail:'Sales email — receives contact and offer notifications',salesPhone:'Sales telephone',mapUrl:'Google Maps link (HTTPS)'})[key]}</span><input type={key==='salesEmail'?'email':key==='mapUrl'?'url':'text'} value={g[key]} onChange={e=>change(key,e.target.value)}/></label>)}
 <h3>Easter egg offer</h3><label className="cms-field"><span>Enable offer claims</span><input type="checkbox" checked={g.offerEnabled} onChange={e=>change('offerEnabled',e.target.checked)}/></label>
 <label className="cms-field"><span>Discount percentage (1–100)</span><input type="number" min={1} max={100} value={g.offerPercent} onChange={e=>change('offerPercent',Number(e.target.value))}/></label>
 <label className="cms-field"><span>Coupon code</span><input maxLength={32} value={g.offerCode} onChange={e=>change('offerCode',e.target.value.toUpperCase())}/></label>
 <label className="cms-field"><span>Expiry date (UTC; blank means no expiry)</span><input type="date" value={g.offerExpires} onChange={e=>change('offerExpires',e.target.value)}/></label>
 <label className="cms-field"><span>Offer terms</span><textarea value={g.offerTerms} maxLength={2000} onChange={e=>change('offerTerms',e.target.value)}/></label>
 <p>Save draft, then Publish to activate these settings. Claims retain the coupon and percentage that applied when submitted. Names, contact details and messages are saved in the inbox.</p>
 <SmtpSettings/>
 </div>;
}
