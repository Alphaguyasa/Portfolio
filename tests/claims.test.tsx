import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Notes from "@/components/Notes";
import Testimonials from "@/components/Testimonials";
import Tools, { projectsUsing } from "@/components/Tools";
import { confirmedTestimonials, footerNav, navLinks, notes, publishedNotes, testimonials, tools } from "@/data/site";
import AboutPage from "@/app/about/page";
import Home from "@/app/page";
import { projects } from "@/lib/projects";
import { buildCopy } from "../scripts/lib/copy.mjs";
import syncData from "../data/sync/index.json";

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

// Alpha's decision (2026-10-18): the site and the copy describe how he plans, tests
// and ships, never that his code is written with AI tools or prompts. "AI retrieval"
// is a kind of system he builds, so it is allowed.
const AI_CODING = /AI[- ]assist|AI assistance|with AI|built by AI|AI[- ]generated|AI[- ]written|prompts?\b|CLAUDE\.md|\bClaude\b|Copilot|ChatGPT|Cursor|vibe[- ]cod/i;

describe("how Alpha works", () => {
  // Visible text only: class names such as "cursor-pointer" are not copy.
  const visible = (html: string) => html.replace(/<[^>]+>/g, " ");

  it("is never described as AI-assisted coding, on any page or in the copy", () => {
    expect(visible(renderToStaticMarkup(<Home />))).not.toMatch(AI_CODING);
    expect(visible(renderToStaticMarkup(<AboutPage />))).not.toMatch(AI_CODING);
    expect(buildCopy(projects, syncData)).not.toMatch(AI_CODING);
    expect(readFileSync("PORTFOLIO_COPY.md", "utf8")).not.toMatch(AI_CODING);
  });

  it("still allows AI retrieval as a skill", () => {
    expect("AI retrieval that cites its sources").not.toMatch(AI_CODING);
  });
});
