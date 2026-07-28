import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ContactForm from "@/components/ContactForm";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/your name/i), "Jane Doe");
  await user.type(screen.getByLabelText(/^email$/i), "jane@company.com");
  await user.type(screen.getByLabelText(/what's the work/i), "A short brief.");
  await user.click(screen.getByRole("button", { name: /send message/i }));
}

describe("ContactForm", () => {
  it("posts the fields and confirms on success", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });

    render(<ContactForm />);
    await fillAndSubmit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(JSON.parse(init.body)).toMatchObject({
      name: "Jane Doe",
      email: "jane@company.com",
      message: "A short brief.",
    });

    expect(await screen.findByRole("button", { name: /sent — thank you/i })).toBeInTheDocument();
  });

  it("shows the server's message and a mailto fallback on failure", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "That's a lot of messages." }),
    });

    render(<ContactForm />);
    await fillAndSubmit();

    expect(await screen.findByText(/that's a lot of messages/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /alphaguyasa@gmail\.com/i })).toHaveAttribute(
      "href",
      "mailto:alphaguyasa@gmail.com",
    );
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("recovers when the network throws", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));

    render(<ContactForm />);
    await fillAndSubmit();

    expect(await screen.findByText(/network trouble/i)).toBeInTheDocument();
  });
});
