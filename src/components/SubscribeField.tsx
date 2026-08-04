"use client";

import { useState } from "react";
import { PaperPlane } from "@/components/icons";
import { site } from "@/data/site";

/**
 * There is no mailing-list backend, so rather than pretend, this hands the address
 * straight to a prefilled email. Swap the submit handler for a real POST when a
 * list provider exists.
 */
export default function SubscribeField() {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.trim()) return;
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
          "Subscribe to updates",
        )}&body=${encodeURIComponent(`Please add ${email.trim()} to your updates list.`)}`;
      }}
      className="mt-4.5 flex items-center gap-2.5 rounded-[40px] bg-surface-alt py-1.5 pl-5.5 pr-1.5"
    >
      <label htmlFor="subscribe-email" className="sr-only">
        Email address for updates
      </label>
      <input
        id="subscribe-email"
        type="email"
        required
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="min-w-0 flex-1 bg-transparent py-3 font-sans text-base outline-none"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-accent transition-transform duration-200 hover:scale-105"
      >
        <PaperPlane size={18} />
      </button>
    </form>
  );
}
