import type {Metadata} from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Industries from '@/components/industries/Industries';
export const metadata:Metadata={title:'Industries we serve | Yellostack',description:'Explore Yellostack digital solutions for healthcare, energy, retail, logistics, travel, construction, manufacturing, education and public services.'};
export default function IndustriesPage(){return <><Navigation solid/><main><Industries/></main><Footer/></>;}
