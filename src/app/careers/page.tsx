import InnerHero from "@/components/inner/InnerHero";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CareersList from "@/components/CareersList";
import CareersMarquee from "@/components/CareersMarquee";

export default function CareersPage() {
    return (
        <SmoothScroll>
            <Navigation solid />
            <main className="flex flex-col min-h-screen bg-black">
                <InnerHero title="Build what comes next." eyebrow="Careers at Yellostack" intro="Bring your curiosity, craft and ideas. Help us create digital experiences that connect people and business." />

                <CareersMarquee />

                <div className="max-w-7xl mx-auto w-full">
                    <CareersList />
                </div>
            </main>
            <Footer />
        </SmoothScroll>
    );
}
