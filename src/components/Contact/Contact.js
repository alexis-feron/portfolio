import { Button } from 'components/Button';
import { DecoderText } from 'components/DecoderText';
import { Divider } from 'components/Divider';
import { Heading } from 'components/Heading';
import { Input } from 'components/Input';
import { useFormInput } from 'hooks';
import React, { useEffect, useRef, useState } from 'react';
import { classes } from 'utils/style';
import styles from './Contact.module.css';

export function Contact({ id, sectionRef, className }) {
  const name = useFormInput('');
  const email = useFormInput('');
  const message = useFormInput('');
  const [submitted, setSubmitted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const renderTurnstile = () => {
      if (window.turnstile && turnstileRef.current && !isVerified && !submitted) {
        try {
          // Remove old widget if exists
          if (widgetIdRef.current !== null) {
            window.turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = null;
          }

          widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
            sitekey: '0x4AAAAAACFRs-sb0x1qu5N9',
            theme: 'dark',
            size: 'normal',
            callback: function (token) {
              console.log('Turnstile verification successful');
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

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Add Turnstile token to form data
    if (turnstileToken) {
      formData.append('cf-turnstile-response', turnstileToken);
    }

    try {
      const response = await fetch(event.target.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      name.onChange({ target: { value: '' } });
      email.onChange({ target: { value: '' } });
      message.onChange({ target: { value: '' } });
      setSubmitted(true);
      setTurnstileToken('');

      // Reset after showing success message
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
      className={classes(styles.contact, className)}
      as="section"
      ref={sectionRef}
      id={id}
    >
      <form
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
        <Divider className={styles.divider} />
        <br />
        <Input
          type="text"
          name="Name"
          id="full-name"
          label="Your Name"
          required
          className={styles.input}
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
          className={styles.input}
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
          className={styles.input}
          autoComplete="off"
          maxLength={4096}
          {...message}
        />
        {!isVerified && !submitted ? (
          <div ref={turnstileRef} className={styles.turnstile} />
        ) : (
          <Button
            type="submit"
            className={submitted ? styles.success : ''}
            secondary={submitted}
            disabled={submitted}
          >
            {submitted ? 'Submitted' : 'Submit'}
          </Button>
        )}
      </form>
    </section>
  );
}
