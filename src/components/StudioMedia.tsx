'use client';
import MediaPanel from './MediaPanel';
import { LocalText } from './cms/ContentProvider';
export default function StudioMedia(){return <section className="ys-studio-section"><header data-site-reveal><p><LocalText text="STUDIO NOTES"/></p><h2><LocalText text="A closer look at how ideas become products."/></h2></header><MediaPanel topic="custom-software-development" film/><div className="ys-studio-grid"><MediaPanel topic="branding"/><MediaPanel topic="cloud-migration"/></div></section>;}
