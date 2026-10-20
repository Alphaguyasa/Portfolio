import { Suspense } from "react";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import Notes from "@/components/Notes";
import Portfolio from "@/components/Portfolio";
import Pricing from "@/components/Pricing";
import RecentlyShipped from "@/components/RecentlyShipped";
import Recognitions from "@/components/Recognitions";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Tools from "@/components/Tools";
import { marquees } from "@/data/site";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee items={marquees.disciplines} />
        {/* Nothing below the first screen suspends; the boundaries let React hydrate
            each section as its own short task instead of one long one, which cuts
            the page's blocking time on phones. */}
        <Suspense><Services /></Suspense>
        <Suspense><About /></Suspense>
        <Suspense><Tools /></Suspense>
        <Suspense><Marquee items={marquees.stack} /></Suspense>
        <Suspense><Education /></Suspense>
        <Suspense><Marquee items={marquees.projects} /></Suspense>
        <Suspense><Portfolio /></Suspense>
        <Suspense><RecentlyShipped /></Suspense>
        <Suspense><Recognitions /></Suspense>
        <Suspense><Pricing /></Suspense>
        <Suspense><Marquee items={marquees.availability} /></Suspense>
        <Suspense><Contact /></Suspense>
        <Suspense><Marquee items={marquees.disciplinesShort} /></Suspense>
        <Suspense><Testimonials /></Suspense>
        <Suspense><Notes /></Suspense>
        <Suspense><Faq /></Suspense>
        <Suspense><Marquee items={marquees.closing} /></Suspense>
      </main>
      <Footer />
    </>
  );
}
