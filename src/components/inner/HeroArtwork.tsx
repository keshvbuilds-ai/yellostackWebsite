'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';

export function bannerTheme(slug:string){
 if(/mobile/.test(slug))return 'mobile';
 if(/medical/.test(slug))return 'medical';
 if(/cloud|sharepoint|erp|dynamic|facilit/.test(slug))return 'systems';
 if(/ecommerce/.test(slug))return 'commerce';
 if(/design|branding|marketing|search/.test(slug))return 'design';
 if(/software|intelligence/.test(slug))return 'code';
 if(/blog/.test(slug))return 'journal';
 if(/contact/.test(slug))return 'contact';
 if(/career|team|about|clients/.test(slug))return 'people';
 return 'portfolio';
}
/** Crisp, locally rendered editorial artwork tailored to the page subject. */
export default function HeroArtwork({slug}:{slug:string}){
 const theme=bannerTheme(slug);const reduce=useReducedMotion();const id=useId().replace(/:/g,'');
 return <motion.div className={'ys-hero-art ys-art-'+theme} aria-hidden="true" animate={reduce?{}:{y:[0,-10,0]}} transition={{duration:8,repeat:Infinity,ease:'easeInOut'}}>
  <svg viewBox="0 0 600 500" fill="none"><defs><linearGradient id={id} x1="120" y1="40" x2="480" y2="460" gradientUnits="userSpaceOnUse"><stop stopColor="#fff3a0"/><stop offset=".55" stopColor="#ffcf00"/><stop offset="1" stopColor="#926a00"/></linearGradient><pattern id={id+'grid'} width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0V35" stroke="#ffcf00" strokeOpacity=".09"/></pattern></defs>
  <rect width="600" height="500" fill={'url(#'+id+'grid)'}/><ellipse cx="300" cy="390" rx="220" ry="55" stroke="#ffcf00" strokeOpacity=".25"/><circle cx="310" cy="230" r="175" stroke="#ffcf00" strokeOpacity=".12" strokeDasharray="3 12"/>
  {theme==='mobile'?<g transform="translate(150 60) rotate(-10 140 200)"><rect x="115" y="45" width="165" height="315" rx="26" fill="#292e34" stroke="#85856c"/><rect width="195" height="360" rx="30" fill={'url(#'+id+')'}/><rect x="10" y="10" width="175" height="340" rx="24" fill="#101720"/><rect x="65" y="20" width="65" height="9" rx="5" fill="#4a5052"/><rect x="26" y="75" width="143" height="110" rx="15" fill="#ffcf00"/><path d="m70 131 19 19 35-37" stroke="#101720" strokeWidth="9"/>{[220,246,272].map(y=><rect key={y} x="26" y={y} width={y===272?85:143} height="10" rx="5" fill="#626e73"/>)}</g>:
  theme==='systems'?<g transform="translate(125 65)">{[0,1,2].map(i=><g key={i} transform={'translate('+i*30+' '+i*100+')'}><path d="m0 40 220-40 110 45-220 45Z" fill={'url(#'+id+')'}/><path d="m0 40 110 50 220-45v55l-220 45L0 95Z" fill="#252d32" stroke="#706731"/><circle cx="35" cy="76" r="5" fill="#ffcf00"/><path d="m145 107 125-25" stroke="#687375" strokeWidth="8"/></g>)}</g>:
  theme==='medical'?<g transform="translate(130 85)"><rect width="320" height="300" rx="25" fill="#192229" stroke="#727d74"/><rect x="-25" y="-25" width="140" height="130" rx="22" fill={'url(#'+id+')'}/><path d="M45 5v70M10 40h70" stroke="#182126" strokeWidth="22"/><path d="M30 200h50l30-60 40 100 35-65 20 25h80" stroke="#ffcf00" strokeWidth="5" strokeLinejoin="round"/><path d="M155 35h115M155 55h75M30 265h250" stroke="#5b696e" strokeWidth="9"/></g>:
  theme==='commerce'?<g transform="translate(130 90) rotate(-6 150 150)"><path d="M25 90h250l25 240H0Z" fill={'url(#'+id+')'}/><path d="M90 100V55a60 60 0 0 1 120 0v45" stroke="#f5e29c" strokeWidth="15"/><rect x="180" y="145" width="130" height="85" rx="12" fill="#172027" stroke="#7a8180"/><circle cx="277" cy="183" r="12" fill="#ffcf00"/><path d="M202 207h47" stroke="#c8d0c9" strokeWidth="5"/></g>:
  theme==='contact'||theme==='people'?<g transform="translate(105 90)">{[0,1,2].map(i=><g key={i} transform={'translate('+i*112+' '+(i===1?0:70)+')'}><rect width="135" height="205" rx="25" fill={i===1?'url(#'+id+')':'#222d33'} stroke="#727b68"/><circle cx="67" cy="68" r="28" fill={i===1?'#253038':'#ffcf00'}/><path d="M27 159v-13a40 40 0 0 1 80 0v13" fill={i===1?'#253038':'#5d696a'}/></g>)}<path d="M55 325h290" stroke="#ffcf00" strokeDasharray="4 8"/></g>:
  theme==='journal'?<g transform="translate(130 70) rotate(-8 150 160)"><rect x="35" y="25" width="290" height="335" rx="14" fill="#444b44"/><rect width="290" height="335" rx="14" fill="#eeeede"/><rect x="25" y="30" width="240" height="115" rx="6" fill={'url(#'+id+')'}/>{[180,207,234,280].map((y,i)=><path key={y} d={'M25 '+y+'h'+(i===3?120:240)} stroke="#626b5e" strokeWidth={i===0?14:8}/>)}</g>:
  <g transform="translate(95 80) rotate(-5 190 160)"><rect x="30" y="30" width="390" height="275" rx="18" fill="#343c37" stroke="#727d65"/><rect width="390" height="275" rx="18" fill="#182229" stroke="#87907d"/><path d="M0 40h390" stroke="#63706b"/><circle cx="25" cy="20" r="5" fill="#ffcf00"/><circle cx="43" cy="20" r="5" fill="#57676b"/>{theme==='code'?<><path d="m115 105-45 40 45 40m160-80 45 40-45 40m-56-100-37 120" stroke="#ffcf00" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/><path d="M125 235h145" stroke="#64716a" strokeWidth="6"/></>:<><rect x="25" y="65" width="160" height="130" rx="9" fill={'url(#'+id+')'}/><circle cx="105" cy="130" r="38" stroke="#172127" strokeWidth="12"/><rect x="210" y="65" width="150" height="25" rx="5" fill="#c3ccc2"/><path d="M210 118h130m-130 25h105m-105 25h145M25 230h335" stroke="#63716d" strokeWidth="9"/></>}</g>}
  </svg>
 </motion.div>;
}
