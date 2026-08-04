import { budgetOptions, interestOptions } from "@/data/site";

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  budget: string;
  country: string;
  message: string;
};

export const emptyContact: ContactFields = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  budget: "",
  country: "",
  message: "",
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

// Deliberately permissive: enough to catch typos, not enough to reject valid addresses.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the form and the API route so the client can never post past validation. */
export function validateContact(values: ContactFields): ContactErrors {
  const errors: ContactErrors = {};

  if (!values.name.trim()) errors.name = "Please tell me your name.";
  else if (values.name.trim().length > 120) errors.name = "That name is too long.";

  if (!values.email.trim()) errors.email = "An email address is required.";
  else if (!emailPattern.test(values.email.trim()))
    errors.email = "That doesn’t look like a valid email address.";

  if (!values.phone.trim()) errors.phone = "A phone number is required.";
  else if (values.phone.trim().length < 6)
    errors.phone = "That phone number looks too short.";

  if (!values.interest) errors.interest = "Pick what you’re interested in.";
  else if (!interestOptions.includes(values.interest as never))
    errors.interest = "Pick one of the listed options.";

  if (!values.budget) errors.budget = "Pick a budget range.";
  else if (!budgetOptions.includes(values.budget as never))
    errors.budget = "Pick one of the listed ranges.";

  if (!values.country.trim()) errors.country = "Which country are you in?";

  if (!values.message.trim()) errors.message = "Tell me a little about the project.";
  else if (values.message.trim().length < 10)
    errors.message = "A sentence or two would help.";
  else if (values.message.length > 5000)
    errors.message = "That message is too long — please trim it a little.";

  return errors;
}

/** Plain-text body used for both the sent email and the mailto fallback. */
export function formatContactBody(values: ContactFields) {
  return [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone}`,
    `Interested in: ${values.interest}`,
    `Budget: ${values.budget}`,
    `Country: ${values.country}`,
    "",
    values.message,
  ].join("\n");
}
