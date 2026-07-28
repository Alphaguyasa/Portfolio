"use client";

import { FormEvent, useState } from "react";
import { EMAIL } from "@/lib/data";

const labelClass =
  "font-mono text-[11px] tracking-[0.12em] uppercase text-bg/60";

const fieldClass =
  "border-0 border-b border-bg/30 bg-transparent px-[2px] py-[10px] text-[17px] text-bg outline-none transition-colors duration-240 placeholder:text-bg/35 focus:border-accent";

/**
 * No backend: composes a mailto: draft from the fields and hands off to the
 * user's mail client. Swap for an API route / Resend call if a server is added.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    const subject = encodeURIComponent(`Portfolio enquiry — ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);

    setSent(true);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[14px]">
      <label className="flex flex-col gap-[7px]">
        <span className={labelClass}>Your name</span>
        <input name="name" required placeholder="Jane Doe" className={fieldClass} />
      </label>

      <label className="flex flex-col gap-[7px]">
        <span className={labelClass}>Email</span>
        <input
          name="email"
          type="email"
          required
          placeholder="jane@company.com"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-[7px]">
        <span className={labelClass}>What&apos;s the work?</span>
        <textarea
          name="message"
          rows={4}
          required
          placeholder="A short brief, a role, or a question."
          className={`${fieldClass} resize-y`}
        />
      </label>

      <button
        type="submit"
        className="mt-2 cursor-pointer rounded-[2px] border-0 bg-accent px-[18px] py-[15px] text-[15px] font-semibold tracking-[0.01em] text-on-accent transition-[filter] duration-240 hover:brightness-108"
      >
        {sent ? "Opening your mail app…" : "Send message"}
      </button>

      <p
        aria-live="polite"
        className="font-mono text-[11px] leading-[1.6] tracking-[0.06em] text-bg/55"
      >
        {sent
          ? "Your draft is ready in your mail client. If nothing opened, write to alphaguyasa@gmail.com directly."
          : "Goes straight to alphaguyasa@gmail.com. No newsletter, no tracking."}
      </p>
    </form>
  );
}
