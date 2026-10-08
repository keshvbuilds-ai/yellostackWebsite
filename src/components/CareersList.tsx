"use client";
import { CmsText } from "@/components/cms/ContentProvider";
import DecryptedText from "./animations/DecryptedText";
import { useSiteData } from "@/components/cms/ContentProvider";
import { useContent } from "@/components/cms/ContentProvider";
export default function CareersList() {
  const yellostackData = useSiteData();
  const roles = useContent().roles.filter(role => role.open);
  if (roles.length) return <section className="business-section"><div className="section-heading"><span className="section-index"><CmsText id="CareersList.text.0" fallback="CAREERS / OPEN ROLES"/></span><h2><CmsText id="CareersList.text.1" fallback="Find your"/><br /><em><CmsText id="CareersList.text.2" fallback="next chapter."/></em></h2></div><div className="grid gap-5">{roles.map(role=><article key={role.id} className="rounded-xl border border-white/20 p-6 md:p-10"><div className="flex flex-wrap items-center justify-between gap-6"><div><p className="mb-3 font-mono text-xs text-[#ffcf00]">{role.location} · {role.type}</p><h3 className="text-3xl tracking-tight">{role.title}</h3></div><a href={`mailto:${role.applyEmail}?subject=${encodeURIComponent('Application: '+role.title)}`} className="rounded bg-[#ffcf00] px-7 py-4 font-mono text-xs text-black"><CmsText id="CareersList.text.3" fallback="APPLY FOR THIS ROLE ↗"/></a></div><p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-8 text-white/70">{role.description}</p></article>)}</div></section>;
  return <section className="business-section"><div className="section-heading"><span className="section-index"><CmsText id="CareersList.text.4" fallback="CAREERS / GET IN TOUCH"/></span><h2><CmsText id="CareersList.text.5" fallback="Start a"/><br /><em><CmsText id="CareersList.text.6" fallback="conversation."/></em></h2><p><CmsText id="CareersList.text.7" fallback="Contact Yellostack directly to ask about current opportunities."/></p></div><a className="contact-main" href={`mailto:${yellostackData.contact.email}?subject=Career%20enquiry`}><DecryptedText text={yellostackData.contact.email} /><span aria-hidden="true">↗</span></a></section>;
}
