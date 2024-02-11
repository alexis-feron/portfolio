import React from 'react';
import { classes } from 'utils/style';
import styles from './Contact.module.css';
import { Input } from 'components/Input';
import { Button } from 'components/Button';
import { Divider } from 'components/Divider';
import { Heading } from 'components/Heading';
import { DecoderText } from 'components/DecoderText';
import { useFormInput } from 'hooks';

export function Contact({ id, sectionRef, className }) {
  const name = useFormInput('');
  const email = useFormInput('');
  const message = useFormInput('');
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
      >
        <Heading level={3} as="h1">
          <DecoderText text="Get in Contact!" />
        </Heading>
        <br />
        <Divider className={styles.divider} />
        <br />
        <Input
          type="text"
          name="name"
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
          name="_replyto"
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
          name="message"
          id="message"
          label="Message"
          required
          multiline
          className={styles.input}
          autoComplete="off"
          maxLength={4096}
          {...message}
        />
        <Button type="submit">Submit</Button>
      </form>
    </section>
  );
}
