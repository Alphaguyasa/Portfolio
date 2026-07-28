import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EMAIL } from "@/lib/data";
import { clientKey, rateLimit } from "@/lib/rateLimit";

/**
 * Sends the contact form through Resend.
 *
 * Env:
 *   RESEND_API_KEY  required
 *   CONTACT_FROM    optional — defaults to Resend's shared sender, which can
 *                   only deliver to the address that owns the Resend account.
 *                   Set this to something on a verified domain to lift that.
 */

const FROM = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";

const MAX = { name: 120, email: 200, message: 5000 };

const RATE = { limit: 5, windowMs: 15 * 60 * 1000 };

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("contact: RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email is not configured." }, { status: 500 });
  }

  const { allowed, retryAfter } = rateLimit(clientKey(request), RATE.limit, RATE.windowMs);
  if (!allowed) {
    return NextResponse.json(
      { error: "That's a lot of messages. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;

  // Honeypot: real people never fill this in, bots fill in everything.
  if (clean(body.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const message = clean(body.message, MAX.message);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email address looks wrong." }, { status: 400 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: EMAIL,
      replyTo: email,
      subject: `Portfolio enquiry — ${name}`,
      text: `From: ${name} (${email})\n\n${message}`,
    });

    if (error) {
      console.error("contact: resend rejected the send", error);
      return NextResponse.json({ error: "Could not send that. Try email instead." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error("contact: send threw", cause);
    return NextResponse.json({ error: "Could not send that. Try email instead." }, { status: 502 });
  }
}
