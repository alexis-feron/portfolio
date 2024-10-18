import { DecoderText } from 'components/DecoderText';
import { Heading } from 'components/Heading';
import { Section } from 'components/Section';
import { useTheme } from 'components/ThemeProvider';
import { tokens } from 'components/ThemeProvider/theme';
import { Transition } from 'components/Transition';
import { VisuallyHidden } from 'components/VisuallyHidden';
import { useScrollToHash } from 'hooks';
import dynamic from 'next/dynamic';
import RouterLink from 'next/link';
import { Fragment } from 'react';
import { cssProps } from 'utils/style';
import styles from './Intro.module.css';

const ArrowDown = dynamic(
  () => import('assets/arrow-down.svg').then(mod => mod.ArrowDown),
  { ssr: false }
);

const Background = dynamic(
  () => import('layouts/Home/Background').then(mod => mod.Background),
  { ssr: false }
);

export function Intro({ id, sectionRef, scrollIndicatorHidden, ...rest }) {
  const theme = useTheme();
  const titleId = `${id}-title`;
  const scrollToHash = useScrollToHash();

  const handleScrollClick = event => {
    event.preventDefault();
    scrollToHash(event.currentTarget.href);
  };

  return (
    <Section
      className={styles.intro}
      as="section"
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      <Transition in key={theme.themeId} timeout={1000}>
        {(visible, status) => (
          <Fragment>
            <Background />
            <header className={styles.text}>
              <h1 className={styles.name} data-visible={visible} id={titleId}>
                <DecoderText text="Alexis Feron" delay={300} />
              </h1>
              <Heading level={0} as="h2" className={styles.title}>
                <VisuallyHidden className={styles.label}>
                  {`Web Developer`}
                </VisuallyHidden>
                <span aria-hidden className={styles.row}>
                  <span
                    className={styles.word}
                    data-status={status}
                    style={cssProps({ delay: tokens.base.durationXS })}
                  >
                    Web Developer
                  </span>
                  <span className={styles.line} data-status={status} />
                </span>
              </Heading>
            </header>
            <RouterLink href="/#details">
              <a
                className={styles.scrollIndicator}
                data-status={status}
                data-hidden={scrollIndicatorHidden}
                onClick={handleScrollClick}
                title="Scroll to projects"
              >
                <VisuallyHidden>Scroll to projects</VisuallyHidden>
              </a>
            </RouterLink>
            <RouterLink href="/#details">
              <a
                className={styles.mobileScrollIndicator}
                data-status={status}
                data-hidden={scrollIndicatorHidden}
                onClick={handleScrollClick}
                title="Scroll to projects"
              >
                <VisuallyHidden>Scroll to projects</VisuallyHidden>
                <ArrowDown aria-hidden />
              </a>
            </RouterLink>
          </Fragment>
        )}
      </Transition>
    </Section>
  );
}
