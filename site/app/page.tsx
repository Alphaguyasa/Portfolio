import About from "@/components/About";
import Contact from "@/components/Contact";
import Craft from "@/components/Craft";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import Record from "@/components/Record";
import Work from "@/components/Work";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <Work />
        <About />
        <Craft />
        <Record />
        <Contact />
      </main>
    </div>
  );
}
