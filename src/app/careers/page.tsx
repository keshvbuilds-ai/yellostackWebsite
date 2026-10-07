import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CareersList from "@/components/CareersList";
import CareersMarquee from "@/components/CareersMarquee";

export default function CareersPage() {
    return (
        <SmoothScroll>
            <Navigation />
            <main className="flex flex-col min-h-screen bg-black pt-32">
                <section className="px-6 lg:px-12 py-20">
                    <div className="max-w-4xl">
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-8">
                            Build <br /><span className="text-neutral-500">The Future.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl leading-snug font-light">
                            We are looking for visionary engineers, designers, and strategists to help us architect the next generation of digital infrastructure.
                        </p>
                    </div>
                </section>

                <CareersMarquee />

                <div className="max-w-7xl mx-auto w-full">
                    <CareersList />
                </div>
            </main>
            <Footer />
        </SmoothScroll>
    );
}
