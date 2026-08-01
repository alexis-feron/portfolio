"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Turnstile } from "@/components/ui/turnstile";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error" | "captcha";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Contact({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [status, setStatus] = useState<Status>("idle");
  /**
   * Turnstile can be unreachable (offline, blocked by an extension). Losing the
   * captcha must not lock a genuine visitor out of the form, so the submit path
   * degrades to the honeypot alone.
   */
  const [captchaDown, setCaptchaDown] = useState(false);
  /** Anyone about to send a message has focused a field first. */
  const [engaged, setEngaged] = useState(false);
  /** Drives nothing but the widget's visibility - the token lives in the ref. */
  const [verified, setVerified] = useState(false);
  const tokenRef = useRef("");

  const handleVerify = useCallback((token: string) => {
    tokenRef.current = token;
    setVerified(true);
    // Clear the "solve the captcha first" nudge as soon as it is solved.
    setStatus((current) => (current === "captcha" ? "idle" : current));
  }, []);

  const handleExpire = useCallback(() => {
    tokenRef.current = "";
    setVerified(false);
  }, []);

  const handleUnavailable = useCallback(() => setCaptchaDown(true), []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never fill this hidden field.
    if (data.get("company")) return;

    if (!tokenRef.current && !captchaDown) {
      setStatus("captcha");
      return;
    }

    if (tokenRef.current) {
      data.append("cf-turnstile-response", tokenRef.current);
    }

    setStatus("sending");

    try {
      const response = await fetch(site.contactFormAction, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      // A token is single-use; force a fresh challenge for the next message.
      tokenRef.current = "";
      setVerified(false);
      window.turnstile?.reset();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
  }

  const feedback =
    status === "success"
      ? dict.contact.form.success
      : status === "error"
        ? dict.contact.form.error
        : status === "captcha"
          ? dict.contact.form.captchaRequired
          : null;

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
            onFocusCapture={() => setEngaged(true)}
            onPointerDownCapture={() => setEngaged(true)}
            className="flex flex-col gap-8"
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

            {/* Dropped from the DOM entirely once the captcha is unreachable,
                so an empty frame never reads as a broken widget.

                Once solved it is only *hidden*, never unmounted: unmounting
                would destroy the widget along with the token it just issued,
                and `turnstile.reset()` after a send needs it back. */}
            {!captchaDown && (
              <div className={cn(verified && "hidden")}>
                <Turnstile
                  siteKey={site.turnstileSiteKey}
                  active={engaged}
                  language={locale}
                  onVerify={handleVerify}
                  onExpire={handleExpire}
                  onUnavailable={handleUnavailable}
                  className="min-h-[65px] w-full max-w-sm"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6">
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending"
                  ? dict.contact.form.sending
                  : dict.contact.form.submit}
                <span aria-hidden>→</span>
              </Button>

              <AnimatePresence mode="wait">
                {feedback && (
                  <motion.p
                    key={status}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    role="status"
                    className={cn(
                      "text-sm",
                      status === "success" ? "text-success" : "text-danger",
                    )}
                  >
                    {feedback}
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
