"use client";
import { useState, useEffect } from "react";
import Component from "@/components/portfolio-hero";
import AboutSection from "@/components/about-section";
import { ProjectShowcase } from "@/components/project-showcase";
import { Component as ExperienceHero } from "@/components/experience-hero";
import { Skills } from "@/components/skills-showcase";
import { ContactPage } from "@/components/contact-page";

export default function Page() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <>
      <div id="home">
        <Component isDark={isDark} toggleTheme={toggleTheme} />
      </div>
      <div id="about">
        <AboutSection isDark={isDark} />
      </div>
      <div id="projects">
        <ProjectShowcase isDark={isDark} />
      </div>
      <div id="experience">
        <ExperienceHero isDark={isDark} />
      </div>
      <div id="skills" className="min-h-screen transition-colors duration-500 w-full" style={{ backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)" }}>
        <div className="min-h-screen flex flex-col items-center justify-center p-8 w-full">
          <Skills />
        </div>
      </div>
      <div id="contact">
        <ContactPage isDark={isDark} />
      </div>
    </>
  );
}
