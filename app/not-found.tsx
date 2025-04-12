'use client';

import { Button } from '@/components/Button';
import { Heading } from '@/components/Heading';
import { Meta } from '@/components/Meta';
import { Text } from '@/components/Text';
import { Transition } from '@/components/Transition';
import { DecoderText } from '@/features/DecoderText';
import { Fragment } from 'react';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <section className={styles.page}>
      <Meta
        title="404 Not Found"
        description="404 page not found. This page doesn't exist"
      />
      <Transition
        in
        timeout={300}
        onEnter={() => {}}
        onEntered={() => {}}
        onExit={() => {}}
        onExited={() => {}}
        unmount={false}
      >
        {visible => (
          <Fragment>
            <div className={styles.details}>
              <div className={styles.text}>
                <Heading
                  className={styles.title}
                  data-visible={visible}
                  level={0}
                  weight="bold"
                  as="h1"
                >
                  404
                </Heading>
                <Heading
                  aria-hidden
                  className={styles.subheading}
                  data-visible={visible}
                  as="h2"
                  level={3}
                >
                  <DecoderText text="Error:" start={visible} delay={300} />
                </Heading>
                <Text
                  secondary
                  className={styles.description}
                  data-visible={visible}
                  as="p"
                >
                  This page could not be found. It either doesn’t exist or was deleted. Or
                  perhaps you don’t exist.
                </Text>
                <Button
                  secondary
                  iconHoverShift
                  className={styles.button}
                  data-visible={visible}
                  href="/"
                  icon="chevronRight"
                  label="Back to homepage"
                />
              </div>
            </div>
          </Fragment>
        )}
      </Transition>
    </section>
  );
}
