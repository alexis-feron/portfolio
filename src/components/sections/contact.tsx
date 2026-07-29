"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/content/site";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Contact({ dict }: { dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never fill this hidden field.
    if (data.get("company")) return;

    setStatus("sending");

    try {
      const response = await fetch(site.contactFormAction, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
  }

  return (
    <section
      id="contact"
      className="container-gutter py-28 md:py-40"
      aria-labelledby="contact-title"
    >
      <div className="flex items-center gap-4">
        <span className="h-px w-12 bg-fg" />
        <p className="eyebrow text-muted">{dict.contact.eyebrow}</p>
      </div>

      <div className="mt-12 grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <h2 id="contact-title" className="display-l text-gradient">
            {dict.contact.title}
          </h2>

          <p className="mt-8 max-w-md text-base leading-relaxed text-muted">
            {dict.contact.description}
          </p>
        </div>

        {/* The heading's cap height sits well below the top of its box, so the
            form needs a nudge upwards to read as aligned with it. */}
        <Reveal className="lg:col-span-7 lg:-mt-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
            noValidate={false}
          >
            <Field
              id="name"
              name="Name"
              label={dict.contact.form.name}
              autoComplete="name"
            />
            <Field
              id="email"
              name="Email"
              type="email"
              label={dict.contact.form.email}
              autoComplete="email"
            />
            <Field
              id="message"
              name="Message"
              label={dict.contact.form.message}
              multiline
              autoComplete="off"
            />

            {/* Honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="pointer-events-none absolute size-0 opacity-0"
            />

            <div className="flex flex-wrap items-center gap-6">
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending"
                  ? dict.contact.form.sending
                  : dict.contact.form.submit}
                <span aria-hidden>→</span>
              </Button>

              <AnimatePresence mode="wait">
                {(status === "success" || status === "error") && (
                  <motion.p
                    key={status}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    role="status"
                    className={cn(
                      "text-sm",
                      status === "success" ? "text-highlight" : "text-red-500",
                    )}
                  >
                    {status === "success"
                      ? dict.contact.form.success
                      : dict.contact.form.error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
};

/** Underlined field with a label that floats up once filled or focused. */
function Field({
  id,
  name,
  label,
  type = "text",
  multiline,
  autoComplete,
}: FieldProps) {
  const shared =
    "peer w-full border-b border-line bg-transparent pt-6 pb-2 text-base outline-none transition-colors duration-400 placeholder-transparent focus:border-fg";

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          required
          maxLength={4096}
          placeholder={label}
          autoComplete={autoComplete}
          className={cn(shared, "resize-none")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required
          maxLength={512}
          placeholder={label}
          autoComplete={autoComplete}
          className={shared}
        />
      )}
      <label
        htmlFor={id}
        className="absolute top-0 left-0 text-xs tracking-[0.16em] text-muted uppercase transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-0 peer-focus:text-xs peer-focus:tracking-[0.16em] peer-focus:uppercase"
      >
        {label}
      </label>
    </div>
  );
}
