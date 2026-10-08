"use client"
import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Hero from "@/components/hero/Hero";
import IntroSequence from "@/components/intro/IntroSequence";
import ScrollAssembly from "@/components/ScrollAssembly";
import LayerGallery from "@/components/LayerGallery";
import StudioMedia from "@/components/StudioMedia";
import Introduction from "@/components/Introduction";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import WhyYellostack from "@/components/WhyYellostack";

import CTA from "@/components/CTA";
import Blogs from "@/components/Blogs";
import Footer from "@/components/Footer";
import { AnimatePresence } from "framer-motion";
import HomeChoreography from "@/components/animations/HomeChoreography";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <SmoothScroll>
      <AnimatePresence>
        {!introDone && <IntroSequence onComplete={() => setIntroDone(true)} />}
      </AnimatePresence>

      <Navigation />
      <HomeChoreography>
      <main className="flex flex-col min-h-screen">
        <Hero isIntroDone={introDone} />
        <Services />
        <ScrollAssembly />
        <LayerGallery />

        <Introduction />
        <StudioMedia />
        <Portfolio />
        <WhyYellostack />
        <Blogs />
        <CTA />
      </main>
      <Footer />
      </HomeChoreography>
    </SmoothScroll>
  );
}






