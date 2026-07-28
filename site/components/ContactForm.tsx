"use client";

import { FormEvent, useState } from "react";
import { EMAIL } from "@/lib/data";

const labelClass = "font-mono text-[11px] tracking-[0.12em] uppercase text-bg/70";

const fieldClass =
  "border-0 border-b border-bg/50 bg-transparent px-[2px] py-[10px] text-[17px] text-bg outline-none transition-colors duration-240 placeholder:text-bg/50 focus:border-accent disabled:opacity-50";

type Status = "idle" | "sending" | "sent" | "error";

const buttonLabel: Record<Status, string> = {
  idle: "Send message",
  sending: "Sending…",
  sent: "Sent — thank you",
  error: "Try again",
};

/** POSTs to /api/contact, which sends the mail through Resend. */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error ?? "Could not send that.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError("Network trouble — nothing was sent.");
      setStatus("error");
    }
  }

  const busy = status === "sending";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[14px]">
      <label className="flex flex-col gap-[7px]">
        <span className={labelClass}>Your name</span>
        <input name="name" required disabled={busy} placeholder="Jane Doe" className={fieldClass} />
      </label>

      <label className="flex flex-col gap-[7px]">
        <span className={labelClass}>Email</span>
        <input
          name="email"
          type="email"
          required
          disabled={busy}
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
          disabled={busy}
          placeholder="A short brief, a role, or a question."
          className={`${fieldClass} resize-y`}
        />
      </label>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      <button
        type="submit"
        disabled={busy}
        className="mt-2 cursor-pointer rounded-[2px] border-0 bg-accent px-[18px] py-[15px] text-[15px] font-semibold tracking-[0.01em] text-on-accent transition-[filter] duration-240 hover:brightness-108 disabled:cursor-wait disabled:opacity-70"
      >
        {buttonLabel[status]}
      </button>

      <p
        aria-live="polite"
        className="font-mono text-[11px] leading-[1.6] tracking-[0.06em] text-bg/70"
      >
        {status === "sent" ? (
          `That's landed in Alpha's inbox. You'll hear back within a day.`
        ) : status === "error" ? (
          <>
            {error} Write to{" "}
            <a href={`mailto:${EMAIL}`} className="underline hover:text-accent">
              {EMAIL}
            </a>{" "}
            instead.
          </>
        ) : (
          "Goes straight to alphaguyasa@gmail.com. No newsletter, no tracking."
        )}
      </p>
    </form>
  );
}
