"use client";
import { CmsText } from "@/components/cms/ContentProvider";
import DecryptedText from "./animations/DecryptedText";
import { useSiteData } from "@/components/cms/ContentProvider";
export default function CTA() {
  const yellostackData = useSiteData();
  return <section id="contact" className="business-contact"><div><span className="section-index"><CmsText id="CTA.text.0" fallback="LET'S WORK TOGETHER"/></span><h2><CmsText id="CTA.text.1" fallback="Your next project"/><br /><CmsText id="CTA.text.2" fallback="starts with a "/><em><CmsText id="CTA.text.3" fallback="conversation."/></em></h2><a className="contact-main" href={`mailto:${yellostackData.contact.email}`}><DecryptedText text="hello@yellostack.com" /><span aria-hidden="true">↗</span></a></div><div className="contact-details"><span><CmsText id="CTA.text.4" fallback="YELLOSTACK / SAUDI ARABIA"/></span><p>{yellostackData.contact.address}</p><a href={yellostackData.contact.telephoneHref}>{yellostackData.contact.telephone}</a><a href="https://www.yellostack.com/contact" target="_blank" rel="noreferrer"><CmsText id="CTA.text.5" fallback="CONTACT DETAILS ↗"/></a></div></section>;
}
