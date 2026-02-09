'use client';

import profileImg from 'assets/profile.png';
import { Button } from 'components/ui/Button';
import { DecoderText } from 'components/ui/DecoderText';
import { Divider } from 'components/ui/Divider';
import { Heading } from 'components/ui/Heading';
import { Image } from 'components/ui/Image';
import { Link } from 'components/ui/Link';
import { Section } from 'components/ui/Section';
import { Text } from 'components/ui/Text';
import { Transition } from 'components/ui/Transition';
import { Fragment, useState } from 'react';
import { classes, media } from 'utils/style';

interface ProfileTextProps {
  visible: boolean;
  titleId: string;
}

const ProfileText = ({ visible, titleId }: ProfileTextProps) => (
  <Fragment>
    <Heading
      className={classes(
        'whitespace-nowrap mb-l opacity-0 transition-opacity duration-xl ease-linear delay-m',
        visible && 'opacity-100'
      )}
      data-visible={visible}
      level={3}
      id={titleId}
    >
      <DecoderText text="Hi," start={visible} delay={500} />
    </Heading>
    <Text
      className={classes(
        'mb-xl opacity-0 transition-opacity duration-xl ease-linear delay-l',
        visible && 'opacity-100 text-justify'
      )}
      data-visible={visible}
      size="l"
      as="p"
    >
      I&apos;m Alexis, currently I&apos;m web developer at Ultrō and a master&apos;s
      student in fullstack development at Ynov Lyon. You can see{' '}
      <Link href="/resume"> my resume</Link>.
    </Text>
  </Fragment>
);

interface ProfileProps {
  id: string;
  visible: boolean;
  sectionRef: React.RefObject<HTMLDivElement | HTMLElement>;
}

export const Profile = ({ id, visible, sectionRef }: ProfileProps) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={classes(
        'w-full min-h-screen mt-15 mb-10 pt-15 pb-10 flex justify-center outline-none focus:outline-none',
        'max-[1040px]:pt-12.5 max-[1040px]:pr-20 max-[1040px]:pl-40 max-[1040px]:h-auto max-[1040px]:mt-10 max-[1040px]:mb-5',
        'max-[696px]:mt-0 max-[696px]:pt-4xl max-[696px]:overflow-x-hidden',
        'max-[696px]:px-outer',
        'max-[820px]:max-h-[420px]:px-4xl'
      )}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={sectionRef as any}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {(visible: boolean) => (
          <div
            className={classes(
              'grid grid-cols-[1fr_50%] gap-x-2xl max-w-7xl w-full',
              'max-[1040px]:max-w-150 max-[1040px]:grid-cols-1'
            )}
          >
            <div className="relative flex flex-col items-start mb-10 translate-x-0 translate-y-0 translate-z-0">
              <div
                className={classes(
                  'mt-55 mb-10 grid grid-cols-[var(--space-4xl)_1fr] gap-3 items-center',
                  'max-[1040px]:mt-7.5'
                )}
                aria-hidden
              >
                <Divider
                  notchWidth="64px"
                  notchHeight="8px"
                  collapsed={!visible}
                  collapseDelay={1000}
                />
                <div
                  className={classes(
                    'text-body-s font-medium text-primary opacity-0 transition-opacity ease-fast-out-slow-in duration-m delay-[1.3s]',
                    'motion-safe:transition-[opacity,transform] motion-safe:-translate-x-m',
                    visible && 'translate-none opacity-100'
                  )}
                  data-visible={visible}
                >
                  About Me
                </div>
              </div>
              <ProfileText visible={visible} titleId={titleId} />
              <Button
                secondary
                className={classes(
                  'opacity-0 transition-opacity duration-xl ease-linear delay-l',
                  visible && 'opacity-100 translate-none'
                )}
                data-visible={visible}
                href="#contact"
                icon="send"
              >
                Send me a message
              </Button>
            </div>
            <div className="relative flex flex-col items-start mb-10 translate-x-0 translate-y-0 translate-z-0">
              {/* 
                  The second column in original CSS had NO styles for .column but shared the same class .column?
                  Wait, Profile.module.css:
                  .column { ... }
                  And JSX:
                  <div className={styles.column}> ... </div>
                  <div className={styles.column}> ... </div>
                  So yes, both columns have same styles.
                  Detailed styles: relative, flex, col, items-start, mb-40px, transform-0.
               */}
              <div
                className={classes(
                  'mt-55 mb-10 grid grid-cols-[var(--space-4xl)_1fr] gap-3 items-center',
                  'max-[1040px]:mt-7.5'
                )}
                aria-hidden
              ></div>
              <div className="relative w-full">
                <Image
                  reveal
                  delay={100}
                  placeholder={profileImg}
                  srcSet={[
                    { src: profileImg.src, width: 480 },
                    { src: profileImg.src, width: 960 },
                  ]}
                  sizes={`(max-width: ${media.mobile}px) 100vw, 480px`}
                  alt="Alexis Feron"
                  title="Alexis Feron"
                />
                <svg
                  aria-hidden="true"
                  width="135"
                  height="765"
                  viewBox="0 0 135 765"
                  className={classes(
                    'absolute right-0 bottom-0 translate-x-[50%] -translate-y-[20%] h-full z-30 opacity-0 transition-opacity duration-m ease-linear delay-l fill-text-title',
                    visible && 'opacity-100'
                  )}
                  data-visible={visible}
                ></svg>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
