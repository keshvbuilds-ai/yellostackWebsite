"use client";
import DecryptedText from "./animations/DecryptedText";
import { yellostackData } from "@/content/yellostack";
export default function CareersList() {
  return <section className="business-section"><div className="section-heading"><span className="section-index">CAREERS / GET IN TOUCH</span><h2>Start a<br /><em>conversation.</em></h2><p>Contact Yellostack directly to ask about current opportunities.</p></div><a className="contact-main" href={`mailto:${yellostackData.contact.email}?subject=Career%20enquiry`}><DecryptedText text={yellostackData.contact.email} /><span aria-hidden="true">↗</span></a></section>;
}
