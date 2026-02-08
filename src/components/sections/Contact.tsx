'use client';

import { Button } from 'components/ui/Button';
import { DecoderText } from 'components/ui/DecoderText';
import { Divider } from 'components/ui/Divider';
import { Heading } from 'components/ui/Heading';
import { Input } from 'components/ui/Input/Input';
import { useFormInput } from 'hooks';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { classes } from 'utils/style';

interface ContactProps {
  id?: string;
  sectionRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  visible?: boolean;
}

export function Contact({ id, sectionRef, className }: ContactProps) {
  const name = useFormInput('');
  const email = useFormInput('');
  const message = useFormInput('');
  const [submitted, setSubmitted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const renderTurnstile = () => {
      if (window.turnstile && turnstileRef.current && !isVerified && !submitted) {
        try {
          if (widgetIdRef.current !== null) {
            window.turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = null;
          }

          widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
            sitekey: '0x4AAAAAACFRs-sb0x1qu5N9', 
            theme: 'dark',
            size: 'normal',
            callback: function (token: string) {
              setTurnstileToken(token);
              setIsVerified(true);
            },
          });
        } catch (error) {
          console.error('Error rendering Turnstile:', error);
        }
      }
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const handleLoad = () => renderTurnstile();
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [isVerified, submitted]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);

    if (turnstileToken) {
      formData.append('cf-turnstile-response', turnstileToken);
    }

    try {
      const response = await fetch(target.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const resetEvent = { target: { value: '' } } as ChangeEvent<HTMLInputElement>;
      name.onChange(resetEvent);
      email.onChange(resetEvent);
      message.onChange({ target: { value: '' } } as ChangeEvent<HTMLTextAreaElement>);
      
      setSubmitted(true);
      setTurnstileToken('');

      setTimeout(() => {
        setSubmitted(false);
        setIsVerified(false);
      }, 5000);
    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  };

  return (
    <section
      className={classes(
          'flex flex-wrap items-baseline justify-center py-3xl px-l z-20 relative',
          '[--lineHeightBody:1.1]',
          className
      )}
      ref={sectionRef}
      id={id}
    >
      <form
        className="w-[80vh] mx-auto my-0"
        name="contact-form"
        acceptCharset="utf-8"
        action="https://formspree.io/f/moqoegjz"
        method="post"
        onSubmit={handleSubmit}
      >
        <Heading level={3} as="h1">
          <DecoderText text="Get in Contact!" />
        </Heading>
        <br />
        <Divider />
        <br />
        <Input
          type="text"
          name="Name"
          id="full-name"
          label="Your Name"
          required
          autoComplete="name"
          maxLength={512}
          {...name}
        />
        <br />
        <Input
          type="email"
          name="Email"
          id="email-address"
          label="Your Email"
          required
          autoComplete="email"
          maxLength={512}
          {...email}
        />
        <br />
        <Input
          name="Message"
          id="message"
          label="Message"
          required
          multiline
          autoComplete="off"
          maxLength={4096}
          {...message}
        />
        {!isVerified && !submitted ? (
          <div 
            ref={turnstileRef} 
            className={classes(
                'mt-[32px] flex justify-start animate-fadeIn rounded-lg bg-[rgba(var(--rgbPrimary),0.05)] border border-[rgba(var(--rgbAccent),0.2)] transition-all duration-300 ease-linear',
                'hover:bg-[rgba(var(--rgbPrimary),0.08)] hover:border-[rgba(var(--rgbAccent),0.3)] hover:shadow-[0_4px_12px_rgba(var(--rgbAccent),0.1)]'
            )} 
          />
        ) : (
          <Button
            type="submit"
            className={classes(
                'mt-[32px] animate-fadeIn',
                submitted && 'mb-[12px] ml-[5px]'
            )}
            disabled={submitted}
          >
            {submitted ? 'Submitted' : 'Submit'}
          </Button>
        )}
      </form>
    </section>
  );
}
