import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Notes from "@/components/Notes";
import Testimonials from "@/components/Testimonials";
import Tools, { projectsUsing } from "@/components/Tools";
import { confirmedTestimonials, footerNav, navLinks, notes, publishedNotes, testimonials, tools } from "@/data/site";
import { projects } from "@/lib/projects";

describe("tools", () => {
  it("carry no skill percentages or other self-scored numbers", () => {
    for (const tool of tools) expect(Object.keys(tool)).not.toContain("pct");
    expect(renderToStaticMarkup(<Tools />)).not.toMatch(/\d+%/);
  });

  it("show only project counts derived from data/projects.json", () => {
    const kotlin = projects.filter((p) => p.stack.some((s) => s.toLowerCase().includes("kotlin"))).length;
    expect(projectsUsing(["Kotlin"])).toBe(kotlin);
    expect(renderToStaticMarkup(<Tools />)).toContain(`${kotlin} listed projects`);
  });
});

describe("testimonials", () => {
  it("publishes only quotes the person confirmed", () => {
    expect(confirmedTestimonials).toEqual(testimonials.filter((t) => t.confirmed));
    const html = renderToStaticMarkup(<Testimonials />);
    for (const t of testimonials) {
      if (t.confirmed) expect(html).toContain(t.name);
      else expect(html).not.toContain(t.quote);
    }
  });

  it("does not call anyone a client", () => {
    expect(renderToStaticMarkup(<Testimonials />)).not.toMatch(/client/i);
  });
});

describe("notes", () => {
  it("lists only published posts, with links, and no images", () => {
    const html = renderToStaticMarkup(<Notes />);
    for (const n of notes) {
      if (n.href) expect(html).toContain(n.href);
      else expect(html).not.toContain(n.title);
    }
    expect(html).not.toContain("<img");
  });
});

describe("navigation", () => {
  it("never links to a section that is not rendered", () => {
    const hrefs = [...navLinks, ...footerNav].map((l) => l.href);
    if (publishedNotes.length === 0) expect(hrefs).not.toContain("#blogs");
    if (confirmedTestimonials.length === 0) expect(hrefs).not.toContain("#testimonials");
  });
});
