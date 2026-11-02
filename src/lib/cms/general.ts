import type {SiteContent} from './types';
export const generalDefaults:NonNullable<SiteContent['general']>={salesEmail:'hello@yellostack.com',salesPhone:'+966 53 041 5576',mapUrl:'https://maps.app.goo.gl/iGRL6YcqFj23Xgux6',offerEnabled:true,offerPercent:10,offerCode:'YELLO10',offerTerms:'Valid on eligible new projects. Subject to scope review and confirmation by our sales team. Cannot be combined with other offers.',offerExpires:''};
export const generalSettings=(content:SiteContent)=>({...generalDefaults,...content.general});
export const offerActive=(g:typeof generalDefaults)=>g.offerEnabled&&(!g.offerExpires||Date.now()<=Date.parse(g.offerExpires+'T23:59:59Z'));
