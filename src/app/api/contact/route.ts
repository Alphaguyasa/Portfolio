import { NextResponse } from "next/server";
import {
  formatContactBody,
  validateContact,
  type ContactFields,
} from "@/lib/contact-schema";
import { clientKey, rateLimit } from "@/lib/rateLimit";
import { MAX_BODY_BYTES, readCapped } from "@/lib/read-capped";
import { site } from "@/data/site";

export const runtime = "nodejs";

const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Accepts the contact form and emails it on via Resend.
 *
 * If RESEND_API_KEY is not configured the route reports `delivery: "unconfigured"`
 * and the client falls back to opening a prefilled mail client, so the form is never
 * a dead end. Set RESEND_API_KEY (and optionally CONTACT_FROM, which must be an
 * address on a domain verified in Resend) to switch on real delivery.
 *
 * A filled-in `company` field is the form's hidden honeypot: the post is answered as
 * if it were sent, so a bot learns nothing, and nothing is delivered.
 */
export async function POST(request: Request) {
  // Keeps one script from hammering the form and burning the Resend quota.
  const { allowed, retryAfter } = rateLimit(
    clientKey(request),
    MAX_PER_WINDOW,
    WINDOW_MS,
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages from this address. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const text = await readCapped(request, MAX_BODY_BYTES);
  if (text === null) {
    return NextResponse.json({ error: "The message is too long." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const values = payload as ContactFields;
  if (typeof values !== "object" || values === null) {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const { company } = payload as { company?: unknown };
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ delivery: "sent" }, { status: 200 });
  }

  const errors = validateContact({
    name: String(values.name ?? ""),
    email: String(values.email ?? ""),
    phone: String(values.phone ?? ""),
    interest: String(values.interest ?? ""),
    budget: String(values.budget ?? ""),
    country: String(values.country ?? ""),
    message: String(values.message ?? ""),
  });

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ delivery: "unconfigured" }, { status: 200 });
  }

  const body = formatContactBody(values);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Resend's shared sender works without a verified domain; override with
        // CONTACT_FROM once a domain is set up.
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [site.email],
        reply_to: values.email,
        subject: `Portfolio enquiry — ${values.name} (${values.interest})`,
        text: body,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend rejected the message:", response.status, detail);
      return NextResponse.json(
        { error: "The message could not be sent." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Contact delivery failed:", err);
    return NextResponse.json(
      { error: "The message could not be sent." },
      { status: 502 },
    );
  }

  return NextResponse.json({ delivery: "sent" }, { status: 200 });
}
