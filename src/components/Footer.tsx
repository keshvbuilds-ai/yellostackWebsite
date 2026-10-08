"use client";
import { CmsText } from "@/components/cms/ContentProvider";
import { CmsImage as Image } from "@/components/cms/ContentProvider";
import Link from "next/link";
import GoldenHorizon from "./animations/GoldenHorizon";
import FooterSignature from "./FooterSignature";
import DecryptedText from "./animations/DecryptedText";
import { useSiteData } from "@/components/cms/ContentProvider";
export default function Footer() {
  const yellostackData = useSiteData();
  return <><GoldenHorizon /><FooterSignature /><footer className="business-footer"><div className="footer-columns"><div><Image src="/logoyelostack.png" alt="Yellostack" width={160} height={50} className="w-auto h-10" /><p><CmsText id="Footer.text.0" fallback="Strategy, design and development for digital products built around people."/></p></div><div><h3><CmsText id="Footer.text.1" fallback="EXPLORE"/></h3>{[{label:"About",href:"/about-us"},{label:"Services",href:"/services"},{label:"Applications",href:"/portfolio"},{label:"Careers",href:"/careers"}].map(link=><Link key={link.label} href={link.href}><DecryptedText text={link.label} /></Link>)}</div><div><h3><CmsText id="Footer.text.2" fallback="CAPABILITIES"/></h3>{yellostackData.capabilities.map(item=><Link key={item.id} href="/#services">{item.title}</Link>)}</div><div><h3><CmsText id="Footer.text.3" fallback="GET IN TOUCH"/></h3><a href={`mailto:${yellostackData.contact.email}`}>{yellostackData.contact.email}</a><a href={yellostackData.contact.telephoneHref}>{yellostackData.contact.telephone}</a><p>{yellostackData.contact.address}</p></div></div><div className="footer-baseline"><span>© {new Date().getFullYear()} <CmsText id="Footer.text.4" fallback=" Yellostack"/></span><span><CmsText id="Footer.text.5" fallback="STRATEGY. DESIGN. DEVELOPMENT."/></span><a href="#top"><CmsText id="Footer.text.6" fallback="BACK TO TOP ↑"/></a></div></footer></>;
}
