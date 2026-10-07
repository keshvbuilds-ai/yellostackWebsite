"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import DecryptedText from "./animations/DecryptedText";

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const navLinks = [
        { name: "Services", href: "/#services" },
        { name: "Work", href: "/#work" },
        { name: "About", href: "/#about" },
        { name: "Careers", href: "/careers" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: .3 }}
                className={`site-navigation fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"
                    }`}
            >
                <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
                    <Link href="/" className="relative z-50">
                        <Image
                            src="/logoyelostack.png"
                            alt="Yellostack Logo"
                            width={140}
                            height={40}
                            className="w-auto h-8 lg:h-10"
                            priority
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-8 bg-[#171710]/90 rounded-md px-7 py-5 backdrop-blur-md">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[11px] uppercase font-mono text-neutral-300 hover:text-yello transition-colors"
                            >
                                <DecryptedText text={link.name} />
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/#contact"
                            className="bg-yello text-black px-6 py-5 hover:bg-white rounded-md text-[11px] font-mono uppercase transition-colors"
                        >
                            <DecryptedText text="Let’s talk" /> <span aria-hidden="true">↗</span>
                        </Link>
                    </div>

                    <button
                        aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
                        aria-expanded={mobileMenuOpen}
                        className="md:hidden relative z-50 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-30 bg-black flex flex-col justify-center items-center gap-8"
                    >
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <Link
                                    href={link.href}
                                    className="text-3xl font-semibold text-white/80 hover:text-white"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <DecryptedText text={link.name} />
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <Link
                                href="/#contact"
                                className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-yello transition-colors mt-4"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <DecryptedText text="Get in touch" />
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
