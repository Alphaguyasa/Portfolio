import { describe, expect, it } from "vitest";
import {
  contactMailto,
  contactOutcome,
  failureNotice,
  mailtoNotice,
  rateLimitedNotice,
  sentNotice,
} from "@/lib/contact-outcome";
import { formatContactBody, type ContactFields } from "@/lib/contact-schema";

const EMAIL = "me@example.com";

const values: ContactFields = {
  name: "Abebe & Sons",
  email: "abebe@example.com",
  phone: "+251 911 000000",
  interest: "Web app",
  budget: "$1k–5k",
  country: "Ethiopia",
  message: "We need a shop site?\nWith an ordering form.",
};

describe("contactOutcome", () => {
  it("shows the sent state when the message was delivered", () => {
    expect(contactOutcome(200, { delivery: "sent" }, EMAIL)).toEqual({
      kind: "sent",
      notice: sentNotice,
    });
  });

  it("falls back to mailto when no mail provider is configured", () => {
    expect(contactOutcome(200, { delivery: "unconfigured" }, EMAIL)).toEqual({
      kind: "mailto",
      notice: mailtoNotice,
    });
  });

  it("puts the server's field errors back on the fields", () => {
    const errors = { email: "That doesn’t look like a valid email address." };
    expect(contactOutcome(422, { errors }, EMAIL)).toEqual({ kind: "fieldErrors", errors });
  });

  it("treats a 422 without field errors as a failure", () => {
    expect(contactOutcome(422, {}, EMAIL)).toEqual({ kind: "error", notice: failureNotice(EMAIL) });
  });

  it("shows the rate-limit message, with a default when the server gives none", () => {
    expect(contactOutcome(429, { error: "Slow down." }, EMAIL)).toEqual({
      kind: "error",
      notice: "Slow down.",
    });
    expect(contactOutcome(429, {}, EMAIL)).toEqual({ kind: "error", notice: rateLimitedNotice });
  });

  it("points to the email address on any other failure, never at raw server text", () => {
    for (const status of [400, 403, 413, 500, 502]) {
      const outcome = contactOutcome(status, { error: "Resend rejected the message." }, EMAIL);
      expect(outcome).toEqual({ kind: "error", notice: failureNotice(EMAIL) });
    }
    expect(failureNotice(EMAIL)).toContain(EMAIL);
  });

  it("copes with a reply that is not a JSON object", () => {
    expect(contactOutcome(200, null, EMAIL).kind).toBe("sent");
    expect(contactOutcome(502, "Bad gateway", EMAIL).kind).toBe("error");
  });
});

describe("contactMailto", () => {
  it("addresses the site email with the whole message, encoded", () => {
    const href = contactMailto(values, EMAIL);
    const url = new URL(href);
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe(EMAIL);
    expect(url.searchParams.get("subject")).toBe("Portfolio enquiry — Abebe & Sons");
    expect(url.searchParams.get("body")).toBe(formatContactBody(values));
    // A raw "&" or "?" in the fields must not split the query.
    expect([...url.searchParams.keys()]).toEqual(["subject", "body"]);
  });
});
