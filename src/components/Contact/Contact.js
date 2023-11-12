import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'components/Link';
import { Text } from 'components/Text';
import { classes } from 'utils/style';
import styles from './Contact.module.css';

export function Contact({ id, sectionRef, className }) {
  /*const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);*/

  return (
    <section
      className={classes(styles.contact, className)}
      as="section"
      ref={sectionRef}
      id={id}
    >
      <Text>
        You can contact me <Link href="mailto:alexisferon081@gmail.com">here.</Link>
      </Text>
    </section>
  );
}

/*
<form onSubmit={handleSubmit(onSubmit)}>
  <input
    type="text"
    placeholder="Name"
    {...register('Name', { required: true, maxLength: 100 })}
  />
  <input
    type="email"
    placeholder="Email"
    {...register('Email', { maxLength: 100 })}
  />
  <input type="text" placeholder="Title" {...register('Title', { maxLength: 150 })} />
  <input
    type="text"
    placeholder="Message"
    {...register('Message', { maxLength: 500 })}
  />

  <input type="submit" />
</form>
*/
