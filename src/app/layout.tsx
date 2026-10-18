import type { Metadata, Viewport } from "next";
import { DM_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

// next/font self-hosts these at build time — no Google Fonts request at runtime.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
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

// Helps search engines resolve the person behind the site.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alpha Guyasa",
  jobTitle: "Full Stack Engineer",
  email: `mailto:${site.email}`,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Addis Ababa",
    addressCountry: "ET",
  },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Haramaya University" },
  sameAs: [site.linkedin, site.github, site.leetcode],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-6 focus:py-3 focus:font-sans focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          // Static, author-controlled payload.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
