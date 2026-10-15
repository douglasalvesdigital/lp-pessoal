import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Base para URLs absolutas (canonical, og:image, sitemap)
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: "JEDTEC",
  authors: [{ name: site.name, url: site.linkedin }],
  creator: site.name,
  keywords: [
    "desenvolvedor full stack",
    "desenvolvedor Next.js",
    "desenvolvedor React",
    "desenvolvedor WordPress",
    "WordPress headless",
    "ACF",
    "integrações e APIs",
    "automação com IA",
    "landing page",
    "Jedson Santos",
    "JEDTEC",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "JEDTEC",
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#030303",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
