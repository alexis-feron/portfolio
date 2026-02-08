'use client';

import { tokens } from 'components/layout/ThemeProvider/theme';
import { useTheme } from 'components/layout/ThemeProvider/useTheme';
import { DecoderText } from 'components/ui/DecoderText';
import { Heading } from 'components/ui/Heading';
import { Section } from 'components/ui/Section';
import { Transition } from 'components/ui/Transition';
import { VisuallyHidden } from 'components/ui/VisuallyHidden';
import { useScrollToHash } from 'hooks';
import dynamic from 'next/dynamic';
import RouterLink from 'next/link';
import { Fragment, MouseEvent, ReactElement } from 'react';
import { classes, cssProps } from 'utils/style';

const ArrowDown = dynamic<{ className?: string; 'aria-hidden'?: boolean }>(
  () => import('assets/arrow-down.svg').then(mod => mod.default),
  { ssr: false }
);

const Background = dynamic(
  () => import('components/sections/Background').then(mod => mod.Background),
  { ssr: false }
);

interface IntroProps {
  id: string;
  sectionRef: React.RefObject<HTMLDivElement | HTMLElement>;
  scrollIndicatorHidden: boolean;
  [key: string]: any;
}

export function Intro({ id, sectionRef, scrollIndicatorHidden, ...rest }: IntroProps) {
  const theme = useTheme();
  const titleId = `${id}-title`;
  const scrollToHash = useScrollToHash();

  const handleScrollClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToHash(event.currentTarget.href);
  };

  return (
    <Section
      className="h-[100vh] flex items-center justify-center flex-col outline-none focus:outline-none"
      as="section"
      ref={sectionRef as any}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      <Transition in key={theme.themeId} timeout={1000}>
        {(visible: boolean, status: string) => (
          <Fragment>
            <Background />
            <header className={classes(
                'max-w-[1024px] w-full relative -top-l',
                'max-[2080px]:max-w-[920px]',
                'max-[1680px]:max-w-[780px]',
                'max-[696px]:-top-3xl',
                'max-[400px]:-top-xl',
                'max-[820px]:max-h-[420px]:-top-m'
            )}>
              <h1 
                className={classes(
                    'uppercase text-[calc((24/16)*1rem)] tracking-[0.3em] text-[var(--colorTextBody)] mb-2xl mt-0 font-medium leading-none opacity-0 transition-opacity duration-l ease-fast-out-slow-in delay-[0.2s]',
                    'max-[1680px]:text-[calc((22/16)*1rem)] max-[1680px]:mb-xl',
                    'max-[1040px]:text-[calc((18/16)*1rem)]',
                    'max-[696px]:mb-l max-[696px]:tracking-[0.2em] max-[696px]:whitespace-nowrap max-[696px]:overflow-hidden',
                    'max-[820px]:max-h-[420px]:mb-xl',
                    visible && 'opacity-100'
                )} 
                data-visible={visible} 
                id={titleId}
              >
                <DecoderText text="Alexis Feron" delay={300} />
              </h1>
              <Heading level={0} as="h2" className={classes(
                  'flex flex-col text-[calc((140/16)*1rem)] tracking-[-0.005em]',
                  'max-[2080px]:text-[calc((120/16)*1rem)]',
                  'max-[1680px]:text-[calc((100/16)*1rem)]',
                  'max-[860px]:text-[calc((80/16)*1rem)]',
                  'max-[696px]:text-[calc((56/16)*1rem)]',
                  'max-[400px]:text-[calc((42/16)*1rem)]'
              )}>
                <VisuallyHidden className="sr-only">
                  {`Web Developer`}
                </VisuallyHidden>
                <span aria-hidden className={classes('flex flex-row items-center relative', status === 'hidden' && 'opacity-0')}>
                  <span
                    className={classes(
                        'relative flex items-center leading-none animate-[1.5s_var(--ease-fast-out-slow-in)_var(--delay)_forwards] text-[rgb(var(--rgbText)/0)] transition-opacity duration-m ease-linear isolate',
                        
                        // After element
                        'after:content-[""] after:bg-accent after:animate-[1.5s_var(--ease-fast-out-slow-in)_var(--delay)_forwards] after:origin-left after:scale-x-0 after:absolute after:inset-[0_-0.02em_0_0] after:z-10 after:will-change-transform',
                        
                        // Modifier data-plus (not used in current code but in CSS)
                        // data-status entering
                        status === 'entering' && 'animate-[introTextReveal_1.5s_var(--ease-fast-out-slow-in)_var(--delay)_forwards]',
                        status === 'entering' && 'motion-safe:after:animate-[reveal_1.5s_var(--ease-fast-out-slow-in)_var(--delay)_forwards]',

                        // data-status entered
                        status === 'entered' && 'text-[var(--colorTextTitle)]',
                        status === 'entered' && 'after:opacity-100 after:scale-x-0 after:origin-right',
                        
                        // data-status exiting
                        status === 'exiting' && 'text-[var(--colorTextTitle)] opacity-0 absolute top-0 z-0'
                    )}
                    data-status={status}
                    style={cssProps({ delay: tokens.base.durationXS })}
                  >
                    Web Developer
                  </span>
                  <span 
                    className={classes(
                        'content-[""] h-[2px] bg-[rgb(var(--rgbText)/0.3)] w-[120%] flex ml-[20px] animate-[0.8s_var(--ease-fast-out-slow-in)_1s_forwards] origin-left opacity-0 relative top-[0.05em]',
                        status === 'entering' && 'animate-[fadeIn_0.8s_var(--ease-fast-out-slow-in)_1s_forwards]',
                        status === 'entering' && 'motion-safe:animate-[introLine_0.8s_var(--ease-fast-out-slow-in)_1s_forwards]',
                        status === 'entered' && 'scale-x-100 opacity-100'
                    )} 
                    data-status={status} 
                  />
                </span>
              </Heading>
            </header>

            <RouterLink
              href="/#details"
              className={classes(
                  'border-[2px] border-[rgb(var(--rgbText)/0.4)] rounded-[20px] w-[26px] h-[38px] fixed bottom-[64px] transition-opacity duration-l ease-linear opacity-0',
                  
                  // Before element (scroller)
                  'before:content-[""] before:h-[7px] before:w-[2px] before:bg-[rgb(var(--rgbText)/0.4)] before:rounded-[4px] before:absolute before:top-[6px] before:left-1/2 before:-translate-x-[1px]',
                  
                  'motion-safe:transition-[opacity,transform]', 
                  'motion-safe:before:animate-[introScrollIndicator_2s_ease_infinite]',
                  
                  status === 'entered' && 'opacity-100',
                  
                  scrollIndicatorHidden && '!opacity-0 motion-safe:translate-y-[20px]',
                  
                  'pointer-coarse:hidden',
                  'focus-visible:opacity-100'
              )}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
              title="Scroll to projects"
            >
              <VisuallyHidden>Scroll to projects</VisuallyHidden>
            </RouterLink>

            <RouterLink
              href="/#details"
              className={classes(
                  'fixed bottom-10 opacity-0 animate-[1.5s_infinite] transition-opacity duration-m cubic-bezier-[0.8,0.1,0.27,1] p-[20px]',
                  'motion-safe:animate-[introMobileScrollIndicator_1.5s_infinite] motion-safe:transition-[opacity,transform] motion-safe:translate-y-[20px]',
                  
                  status === 'entered' && 'opacity-100 motion-safe:translate-y-0',
                  
                  scrollIndicatorHidden && '!opacity-0 motion-safe:translate-y-[20px]',

                  'pointer-fine:hidden',
                  '[&_svg]:stroke-[rgb(var(--rgbText)/0.5)]',
                  'focus-visible:opacity-100'
              )}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
              title="Scroll to projects"
            >
              <VisuallyHidden>Scroll to projects</VisuallyHidden>
              <ArrowDown aria-hidden />
            </RouterLink>
          </Fragment>
        )}
      </Transition>
    </Section>
  );
}
