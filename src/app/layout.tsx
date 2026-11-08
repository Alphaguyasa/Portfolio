import type { Metadata, Viewport } from "next";
import { Archivo, DM_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

// next/font self-hosts these at build time — no Google Fonts request at runtime.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  // Variable font: one file per style covers every heading weight.
  style: ["normal", "italic"],
  // Preloaded so it is ready before first paint on every visit, not only after a
  // refresh. If it is ever late, "swap" brings it in over a size-matched Arial
  // fallback (next/font adjustFontFallback), so the headings keep their metrics.
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

const description =
  "Full stack engineer in Addis Ababa. Offline-first systems, Android apps, and AI retrieval that cites its sources.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Alpha Guyasa — Full Stack Engineer",
    template: "%s · Alpha Guyasa",
  },
  description,
  keywords: [
    "Alpha Guyasa",
    "full stack engineer",
    "Addis Ababa",
    "offline-first",
    "Next.js",
    "Kotlin",
    "Jetpack Compose",
    "Flutter",
    "AI retrieval",
    "Ethiopia developer",
  ],
  authors: [{ name: "Alpha Guyasa", url: site.url }],
  creator: "Alpha Guyasa",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: "Alpha Guyasa",
    title: "Alpha Guyasa — Full Stack Engineer",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Guyasa — Full Stack Engineer",
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#c2410c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-6 focus:py-3 focus:font-sans focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
