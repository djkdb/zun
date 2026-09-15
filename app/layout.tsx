import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/interactions/CustomCursor";
import { Navbar } from "@/components/navigation/Navbar";

const sans = Space_Grotesk({
  variable: "--font-sans-src",
  subsets: ["latin"],
  display: "swap",
});
const mono = JetBrains_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  display: "swap",
});
const pixel = Silkscreen({
  variable: "--font-pixel-src",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: "ZUN — Software × AI × Product",
    template: "%s · ZUN",
  },
  description: profile.description,
  keywords: profile.keywords,
  authors: [{ name: "ZUN" }],
  creator: "ZUN",
  openGraph: {
    type: "website",
    title: "ZUN — Software × AI × Product",
    description: profile.description,
    siteName: "ZUN",
    locale: "ko_KR",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZUN — Software × AI × Product",
    description: profile.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#070b18",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${sans.variable} ${mono.variable} ${pixel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-3 focus:py-2 focus:text-bg focus:font-mono focus:text-sm"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
        <CustomCursor />
      </body>
    </html>
  );
}
