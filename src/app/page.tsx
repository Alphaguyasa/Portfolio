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
        <Services />
        <About />
        <Tools />
        <Marquee items={marquees.stack} />
        <Education />
        <Marquee items={marquees.projects} />
        <Portfolio />
        <RecentlyShipped />
        <Recognitions />
        <Pricing />
        <Marquee items={marquees.availability} />
        <Contact />
        <Marquee items={marquees.disciplinesShort} />
        <Testimonials />
        <Notes />
        <Faq />
        <Marquee items={marquees.closing} />
      </main>
      <Footer />
    </>
  );
}
