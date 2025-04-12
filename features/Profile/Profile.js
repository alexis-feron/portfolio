'use client';

import profileImg from '@/assets/profile.jpg';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Heading } from '@/components/Heading';
import { Image } from '@/components/Image';
import { Link } from '@/components/Link';
import { Section } from '@/components/Section';
import { Text } from '@/components/Text';
import { Transition } from '@/components/Transition';
import { DecoderText } from '@/features/DecoderText';
import { Fragment, useState } from 'react';

const ProfileText = ({ visible, titleId }) => (
  <Fragment>
    <Heading
      className={`opacity-0 mb-6 whitespace-nowrap transition-opacity duration-1000 ease-in-out delay-500 ${visible ? 'opacity-100' : ''}`}
      level={3}
      id={titleId}
    >
      <DecoderText text="Hi," start={visible} delay={500} />
    </Heading>
    <Text
      className={`mb-8 opacity-0 transition-opacity duration-1000 ease-in-out delay-700 ${visible ? 'opacity-100 text-justify' : ''}`}
      size="l"
      as="p"
    >
      I'm Alexis, currently I'm web developer at Ultrō and student in the University
      Bachelor of Technology in Computer Science of Clermont-Ferrand in France. You can
      see <Link href="/resume"> my resume</Link>.
    </Text>
  </Fragment>
);

export const Profile = ({ id, visible, sectionRef }) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className="w-screen min-h-screen mt-16 mb-10 pt-16 pb-10 flex justify-center md:pt-12 md:pr-20
                md:pl-40 md:h-auto md:mt-10 md:mb-5 sm:mt-0 sm:pt-16 sm:overflow-x-hidden 
                sm:px-4 lg:max-h-screen"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {visible => (
          <div className="grid grid-cols-2 gap-8 max-w-6xl w-full md:grid-cols-1 md:max-w-xl">
            <div className="relative flex flex-col items-start mb-10 transform translate-z-0">
              <ProfileText visible={visible} titleId={titleId} />
              <Button
                secondary
                className={`opacity-0 transition-opacity duration-1000 ease-in-out delay-700 ${visible ? 'opacity-100' : ''}`}
                href="#contact"
                icon="send"
              >
                Send me a message
              </Button>
            </div>
            <div className="relative flex flex-col items-start mb-10 transform translate-z-0">
              <div
                className="mt-56 mb-10 grid grid-cols-[4rem,1fr] gap-3 items-center md:mt-8"
                aria-hidden
              >
                <Divider
                  notchWidth="64px"
                  notchHeight="8px"
                  collapsed={!visible}
                  collapseDelay={1000}
                />
                <div
                  className={`text-sm font-medium text-primary opacity-0 transition-all duration-500 ease-in-out delay-1300 
                              ${visible ? 'opacity-100 transform-none' : 'transform -translate-x-4'}`}
                >
                  About Me
                </div>
              </div>
              <div className="relative w-full">
                <Image
                  reveal
                  delay={100}
                  placeholder={profileImg}
                  srcSet={[profileImg, profileImg]}
                  sizes={`(max-width: 696px) 100vw, 480px`}
                  alt="Alexis Feron"
                  title="Alexis Feron"
                />
                <svg
                  aria-hidden="true"
                  width="135"
                  height="765"
                  viewBox="0 0 135 765"
                  className={`absolute right-0 bottom-0 transform translate-x-1/2 -translate-y-1/5 h-full z-10 opacity-0 
                            transition-opacity duration-500 ease-in-out delay-700 fill-current text-title
                            ${visible ? 'opacity-100' : ''}`}
                ></svg>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
