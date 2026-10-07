"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: .95,
            anchors: { offset: -90 },
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });
        lenis.on("scroll", ScrollTrigger.update);

        let frame = 0;
        function raf(time: number) {
            lenis.raf(time);
            frame = requestAnimationFrame(raf);
        }

        frame = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(frame);
            lenis.off("scroll", ScrollTrigger.update);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}

