import { getLocalizedContent, getLocale } from '@/lib/locale-server';
import SiteReveals from '@/components/animations/SiteReveals';
import './locale.css';
import { ContentProvider } from '@/components/cms/ContentProvider';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./media.css";

const geistSans = localFont({
  src: [
    { path: "../../public/fonts/geist-regular.ttf", weight: "400" },
    { path: "../../public/fonts/geist-medium.ttf", weight: "500" },
    { path: "../../public/fonts/geist-semibold.ttf", weight: "600" },
    { path: "../../public/fonts/geist-bold.ttf", weight: "700" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../../public/fonts/geist-mono.ttf",
  variable: "--font-geist-mono",
  display: "swap",
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Yellostack — Digital experiences that move business forward",
  description: "Strategy, design, and development for websites, apps, and digital products. Build your next digital experience with Yellostack.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getLocalizedContent();
  const locale=await getLocale();
  return (
    <html lang={locale} dir={locale==='ar'?'rtl':'ltr'} className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body id="top" className="bg-black text-white selection:bg-yello selection:text-black">
        <ContentProvider content={content} locale={locale}><SiteReveals/>{children}</ContentProvider>
      </body>
    </html>
  );
}
