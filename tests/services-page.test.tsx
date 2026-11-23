import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ServicesPage from "@/app/services/page";
import Services from "@/components/Services";
import { interestOptions, packageById, servicesPage } from "@/data/site";
import { emptyContact, prefillFromPackage, validateContact } from "@/lib/contact-schema";
import { projectPath, projects, proofProjects } from "@/lib/projects";

const html = renderToStaticMarkup(<ServicesPage />);
const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

describe("services page", () => {
  it("shows the three packages Alpha approved, each as quote-only", () => {
    expect(servicesPage.packages.map((p) => p.id)).toEqual(["web-app", "android-app", "security-review"]);
    for (const pkg of servicesPage.packages) {
      expect(html).toContain(`id="package-${pkg.id}"`);
      expect(text).toContain(pkg.title);
      for (const item of pkg.scope) expect(text).toContain(item.replace(/&/g, "&amp;"));
    }
    expect(text.split(servicesPage.price).length - 1).toBeGreaterThanOrEqual(servicesPage.packages.length);
  });

  it("publishes no prices, figures or fixed timelines (none are approved or quoted)", () => {
    const copy = JSON.stringify(servicesPage);
    expect(copy).not.toMatch(/\d/);
    expect(copy).not.toMatch(/[$€£]|\bbirr\b|\bETB\b|\bUSD\b/i);
    expect(copy).not.toMatch(/\b(days|weeks?|months?)\b/i);
  });

  it("cites only real project entries as proof, and links each one", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const pkg of servicesPage.packages) {
      expect(pkg.proof.length).toBeGreaterThan(0);
      for (const slug of pkg.proof) expect(slugs.has(slug), `${pkg.id} cites ${slug}`).toBe(true);
      for (const project of proofProjects(pkg.proof)) expect(html).toContain(`href="${projectPath(project)}"`);
    }
    expect(proofProjects(["no-such-project"])).toEqual([]);
  });

  it("links each package to the contact form with its id", () => {
    for (const pkg of servicesPage.packages) expect(html).toContain(`href="/?package=${pkg.id}#contact"`);
  });

  it("has one h1 and is linked from the home page's services section", () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html.match(/application\/ld\+json/g)).toHaveLength(1);
    expect(renderToStaticMarkup(<Services />)).toContain('href="/services"');
  });
});

describe("contact prefill from a package link", () => {
  it("maps every package to a listed interest", () => {
    for (const pkg of servicesPage.packages) expect(interestOptions).toContain(pkg.interest);
  });

  it("preselects the interest and starts the message, which then validates once the rest is filled", () => {
    const filled = prefillFromPackage(emptyContact, "security-review");
    expect(filled.interest).toBe("Security Assessment");
    expect(filled.message).toBe("I'd like a quote: Security review. ");
    const errors = validateContact({
      ...filled,
      name: "A",
      email: "a@example.com",
      phone: "+251 911 000000",
      budget: "Under $1,000",
      country: "Ethiopia",
    });
    expect(errors).toEqual({});
  });

  it("never overwrites what the visitor already chose or typed", () => {
    const typed = { ...emptyContact, interest: "AI & Retrieval Systems", message: "Hello there, a question." };
    expect(prefillFromPackage(typed, "web-app")).toEqual(typed);
  });

  it("ignores missing or unknown ids", () => {
    expect(prefillFromPackage(emptyContact, null)).toBe(emptyContact);
    expect(prefillFromPackage(emptyContact, "free-website")).toBe(emptyContact);
    expect(packageById("__proto__")).toBeUndefined();
  });
});
