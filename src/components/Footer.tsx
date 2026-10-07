"use client";
import Image from "next/image";
import Link from "next/link";
import FooterSignature from "./FooterSignature";
import DecryptedText from "./animations/DecryptedText";
import { yellostackData } from "@/content/yellostack";
export default function Footer() {
  return <><FooterSignature /><footer className="business-footer"><div className="footer-columns"><div><Image src="/logoyelostack.png" alt="Yellostack" width={160} height={50} className="w-auto h-10" /><p>Strategy, design and development for digital products built around people.</p></div><div><h3>EXPLORE</h3>{[{label:"About",href:"/#about"},{label:"Services",href:"/#services"},{label:"Applications",href:"/#work"},{label:"Careers",href:"/careers"}].map(link=><Link key={link.label} href={link.href}><DecryptedText text={link.label} /></Link>)}</div><div><h3>CAPABILITIES</h3>{yellostackData.capabilities.map(item=><Link key={item.id} href="/#services">{item.title}</Link>)}</div><div><h3>GET IN TOUCH</h3><a href={`mailto:${yellostackData.contact.email}`}>{yellostackData.contact.email}</a><a href={yellostackData.contact.telephoneHref}>{yellostackData.contact.telephone}</a><p>{yellostackData.contact.address}</p></div></div><div className="footer-baseline"><span>© {new Date().getFullYear()} Yellostack</span><span>STRATEGY. DESIGN. DEVELOPMENT.</span><a href="#top">BACK TO TOP ↑</a></div></footer></>;
}
