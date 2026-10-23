"use client";

import { useId, useState } from "react";
import { budgetOptions, interestOptions, site } from "@/data/site";
import {
  emptyContact,
  validateContact,
  type ContactErrors,
  type ContactFields,
} from "@/lib/contact-schema";
import { contactMailto, contactOutcome, failureNotice } from "@/lib/contact-outcome";

const fieldClass =
  "w-full rounded-xl bg-white px-5 py-4.5 font-sans text-[17px] text-ink outline-none";
const labelClass = "mb-2.5 block font-sans text-base font-semibold xl:text-[17px]";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 font-sans text-[15px] text-accent">
      {message}
    </p>
  );
}

export default function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<ContactFields>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [notice, setNotice] = useState("");
  // Honeypot: people never see or reach this field, form-filling bots usually fill it.
  const [company, setCompany] = useState("");

  const set = (key: keyof ContactFields) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const describedBy = (key: keyof ContactFields) =>
    errors[key] ? `${uid}-${key}-error` : undefined;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateContact(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus("idle");
      // Move focus to the first problem so keyboard and screen-reader users land on it.
      const firstKey = Object.keys(found)[0];
      document.getElementById(`${uid}-${firstKey}`)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company }),
      });
      const data: unknown = await response.json().catch(() => ({}));
      const outcome = contactOutcome(response.status, data, site.email);

      if (outcome.kind === "fieldErrors") {
        setErrors(outcome.errors);
        setStatus("idle");
        return;
      }
      if (outcome.kind === "error") {
        setStatus("error");
        setNotice(outcome.notice);
        return;
      }
      if (outcome.kind === "mailto") {
        window.location.href = contactMailto(values, site.email);
      } else {
        setValues(emptyContact);
      }
      setStatus("sent");
      setNotice(outcome.notice);
    } catch {
      setStatus("error");
      setNotice(failureNotice(site.email));
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-[22px] bg-white p-10 text-center xl:p-14"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent font-display text-2xl text-white">
          ✓
        </span>
        <p className="mt-5 font-display text-2xl font-bold">Message sent</p>
        <p className="mx-auto mt-3 max-w-[420px] font-sans text-base leading-[1.6] text-muted">
          {notice}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setNotice("");
          }}
          className="mt-6 rounded-[40px] bg-ink px-7 py-3.5 font-sans text-base font-semibold text-white"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative">
      <div className="grid gap-5.5 sm:grid-cols-2 sm:gap-x-6.5">
        <div>
          <label className={labelClass} htmlFor={`${uid}-name`}>
            Your Name *
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ex. John Doe"
            className={fieldClass}
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
          />
          <FieldError id={`${uid}-name-error`} message={errors.name} />
        </div>

        <div>
          <label className={labelClass} htmlFor={`${uid}-email`}>
            Email *
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            className={fieldClass}
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
          />
          <FieldError id={`${uid}-email-error`} message={errors.email} />
        </div>

        <div>
          <label className={labelClass} htmlFor={`${uid}-phone`}>
            Phone *
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Enter Phone Number"
            className={fieldClass}
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
          />
          <FieldError id={`${uid}-phone-error`} message={errors.phone} />
        </div>

        <div>
          <label className={labelClass} htmlFor={`${uid}-interest`}>
            I’m Interested in *
          </label>
          <select
            id={`${uid}-interest`}
            name="interest"
            className={`${fieldClass} appearance-none ${values.interest ? "" : "text-[#8A8A8A]"}`}
            value={values.interest}
            onChange={(e) => set("interest")(e.target.value)}
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={describedBy("interest")}
          >
            <option value="">Select</option>
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id={`${uid}-interest-error`} message={errors.interest} />
        </div>

        <div>
          <label className={labelClass} htmlFor={`${uid}-budget`}>
            Budget Range (USD) *
          </label>
          <select
            id={`${uid}-budget`}
            name="budget"
            className={`${fieldClass} appearance-none ${values.budget ? "" : "text-[#8A8A8A]"}`}
            value={values.budget}
            onChange={(e) => set("budget")(e.target.value)}
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={describedBy("budget")}
          >
            <option value="">Select Range</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id={`${uid}-budget-error`} message={errors.budget} />
        </div>

        <div>
          <label className={labelClass} htmlFor={`${uid}-country`}>
            Country *
          </label>
          <input
            id={`${uid}-country`}
            name="country"
            type="text"
            autoComplete="country-name"
            placeholder="Select Country"
            className={fieldClass}
            value={values.country}
            onChange={(e) => set("country")(e.target.value)}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={describedBy("country")}
          />
          <FieldError id={`${uid}-country-error`} message={errors.country} />
        </div>
      </div>

      <div className="mt-5.5">
        <label className={labelClass} htmlFor={`${uid}-message`}>
          Your Message *
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          placeholder="Enter here.."
          className={`${fieldClass} resize-y`}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
        />
        <FieldError id={`${uid}-message-error`} message={errors.message} />
      </div>

      <div aria-hidden className="absolute -left-[10000px] size-px overflow-hidden">
        <label htmlFor={`${uid}-company`}>Company (leave this empty)</label>
        <input
          id={`${uid}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 rounded-[40px] bg-accent px-8.5 py-4 font-sans text-base font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 xl:text-[17px]"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      {status === "error" && (
        <p role="alert" className="mt-4 font-sans text-base text-accent">
          {notice}
        </p>
      )}
    </form>
  );
}
