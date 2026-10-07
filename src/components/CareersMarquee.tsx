"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function CareersMarquee() {
    useEffect(() => {
        gsap.to(".marquee-inner", {
            xPercent: -50,
            ease: "none",
            duration: 20,
            repeat: -1,
        });
    }, []);

    return (
        <div className="w-full overflow-hidden bg-yello text-black py-6 md:py-10 my-20 flex flex-col justify-center border-y border-yello/20">
            <div className="marquee-wrapper flex w-[200%]">
                <div className="marquee-inner flex items-center pr-10 whitespace-nowrap">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            <span className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase leading-none px-8">
                                Join the Team
                            </span>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mx-4 md:mx-8">
                                <circle cx="20" cy="20" r="20" fill="black" />
                                <path d="M12 20h16M28 20l-6 6M28 20l-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
