import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Heading } from '@/components/Heading';
import { Input } from '@/components/Input';
import { DecoderText } from '@/features/DecoderText';
import { classes } from '@/lib/style';
import { useFormInput } from 'hooks';
import React, { useState } from 'react';
import styles from './Contact.module.css';

export function Contact({ id, sectionRef, className }) {
  const name = useFormInput('');
  const email = useFormInput('');
  const message = useFormInput('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
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
      setTimeout(() => setSubmitted(false), 5000);
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
        <Button
          type="submit"
          className={submitted ? styles.success : ''}
          secondary={submitted}
          disabled={submitted}
        >
          {submitted ? 'Submitted' : 'Submit'}
        </Button>
      </form>
    </section>
  );
}
