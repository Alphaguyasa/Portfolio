import type { Metadata } from "next";
import { Archivo, Newsreader, IBM_Plex_Mono } from "next/font/google";
import RevealObserver from "@/components/RevealObserver";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alpha Guyasa — Frontend & Full-Stack Engineer",
  description:
    "Alpha Guyasa is a frontend and full-stack engineer in Ethiopia. BSc Computer Science, Haramaya University. First place, HU x INSA Capture-the-Flag. Leader of the Haramaya University Cyber Club.",
  openGraph: {
    title: "Alpha Guyasa — Frontend & Full-Stack Engineer",
    description:
      "Interfaces built with a security engineer's instincts. BSc Computer Science, Haramaya University.",
    type: "website",
  },
};

/**
 * Runs before paint so a saved dark theme never flashes light.
 * Mirrors the toggle in components/ThemeToggle.tsx.
 */
const noFlashTheme = `(function(){try{var t=localStorage.getItem("ag-theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light")}catch(e){document.documentElement.setAttribute("data-theme","light")}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
      </head>
      <body className="m-0 font-sans">
        <RevealObserver />
        {children}
      </body>
    </html>
  );
}
