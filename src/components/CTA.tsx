"use client";
import DecryptedText from "./animations/DecryptedText";
import { yellostackData } from "@/content/yellostack";
export default function CTA() {
  return <section id="contact" className="business-contact"><div><span className="section-index">LET'S WORK TOGETHER</span><h2>Your next project<br />starts with a <em>conversation.</em></h2><a className="contact-main" href={`mailto:${yellostackData.contact.email}`}><DecryptedText text="hello@yellostack.com" /><span aria-hidden="true">↗</span></a></div><div className="contact-details"><span>YELLOSTACK / SAUDI ARABIA</span><p>{yellostackData.contact.address}</p><a href={yellostackData.contact.telephoneHref}>{yellostackData.contact.telephone}</a><a href="https://www.yellostack.com/contact" target="_blank" rel="noreferrer">CONTACT DETAILS ↗</a></div></section>;
}
