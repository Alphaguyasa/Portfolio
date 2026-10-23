import { formatContactBody, type ContactErrors, type ContactFields } from "@/lib/contact-schema";

export type ContactOutcome =
  | { kind: "fieldErrors"; errors: ContactErrors }
  | { kind: "error"; notice: string }
  | { kind: "mailto"; notice: string }
  | { kind: "sent"; notice: string };

type ContactResponseBody = { errors?: ContactErrors; error?: string; delivery?: string };

export const sentNotice = "Thanks — your message is on its way. I usually reply the same day.";
export const mailtoNotice = "Your mail app should be opening with the message ready to send.";
export const rateLimitedNotice = "Too many messages just now — please try again shortly.";

export function failureNotice(email: string) {
  return `Something went wrong sending that. Email me directly at ${email}.`;
}

/**
 * Maps the /api/contact reply to what the form shows. Pure, so every state the
 * form can reach is tested without a DOM (tests/contact-outcome.test.ts).
 * `body` is whatever the reply parsed to; a non-JSON reply arrives as `{}`.
 */
export function contactOutcome(status: number, body: unknown, email: string): ContactOutcome {
  const data: ContactResponseBody = body && typeof body === "object" ? body : {};

  if (status === 422 && data.errors) return { kind: "fieldErrors", errors: data.errors };
  if (status === 429) return { kind: "error", notice: data.error ?? rateLimitedNotice };
  if (status < 200 || status > 299) return { kind: "error", notice: failureNotice(email) };
  // No mail provider wired up yet: hand the visitor a prefilled email rather
  // than silently dropping their message.
  if (data.delivery === "unconfigured") return { kind: "mailto", notice: mailtoNotice };
  return { kind: "sent", notice: sentNotice };
}

export function contactMailto(values: ContactFields, email: string) {
  const subject = `Portfolio enquiry — ${values.name}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    formatContactBody(values),
  )}`;
}
