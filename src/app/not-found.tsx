'use client';

import { Button } from 'components/ui/Button';
import { DecoderText } from 'components/ui/DecoderText';
import { Heading } from 'components/ui/Heading';
import { Text } from 'components/ui/Text';
import { Transition } from 'components/ui/Transition';
import { Fragment } from 'react';
import { classes } from 'utils/style';

export default function NotFound() {
  return (
    <section className={classes(
        'grid grid-cols-2 h-[100vh] pl-[140px]',
        'max-[1040px]:p-[80px] max-[1040px]:grid-cols-1 max-[1040px]:min-h-[100vh] max-[1040px]:h-auto',
        'max-[696px]:pl-0'
    )}>
      <Transition in>
        {(visible: boolean) => (
          <Fragment>
            <div className={classes(
                'w-full h-full overflow-hidden relative border-[var(--spacing-2xl)] border-transparent',
                'flex items-center justify-center p-[0_var(--spacing-xl)]',
                'max-[1680px]:border-l',
                'max-[1040px]:border-4xl',
                'max-[696px]:min-h-[240px] max-[696px]:row-start-1 max-[696px]:border-outer max-[696px]:border-t-0',
                'max-[696px]:row-start-2 max-[696px]:p-[0_var(--spacing-outer)]',
                'after:content-[""] after:bg-accent after:absolute after:inset-0 after:scale-x-0 after:origin-left after:z-20',
                'motion-safe:after:animate-[reveal_1.8s_var(--ease-fast-out-slow-in)]',
            )}>
              <div className="flex flex-col max-w-[480px] w-full">
                <Heading
                  className={classes(
                    'mb-m opacity-0 transition-opacity duration-xl ease-fast-out-slow-in delay-100',
                    'motion-safe:transition-[transform,opacity] motion-safe:translate-y-l',
                    visible && 'transform-none opacity-100'
                  )}
                  level={0}
                  weight="bold"
                >
                  404
                </Heading>
                <Heading
                  aria-hidden
                  className={classes(
                    'pb-l uppercase tracking-[0.04em] text-[rgb(var(--rgbText)/0.4)] opacity-0 transition-opacity duration-xl ease-fast-out-slow-in delay-200 max-w-full whitespace-nowrap overflow-hidden flex-none',
                    'max-[696px]:text-[calc((18/16)*1rem)]',
                    'motion-safe:transition-[transform,opacity] motion-safe:translate-y-l',
                    visible && 'transform-none opacity-100'
                  )}
                  as="h2"
                  level={3}
                >
                  <DecoderText text="Error:" start={visible} delay={300} />
                </Heading>
                <Text 
                    className={classes(
                        'pb-l opacity-0 transition-opacity duration-xl ease-fast-out-slow-in delay-300',
                        'motion-safe:transition-[transform,opacity] motion-safe:translate-y-l',
                        visible && 'transform-none opacity-100'
                    )} 
                    as="p"
                >
                  This page could not be found. It either doesn't exist or was deleted. Or
                  perhaps you don't exist.
                </Text>
                <Button
                  secondary
                  iconHoverShift
                  className={classes(
                    'opacity-0 transition-opacity duration-xl ease-fast-out-slow-in delay-m self-start pl-xxs',
                    'motion-safe:transition-[transform,opacity] motion-safe:translate-y-l',
                     visible && 'transform-none opacity-100'
                  )}
                  href="/"
                  icon="chevronRight"
                >
                  Back to homepage
                </Button>
              </div>
            </div>
          </Fragment>
        )}
      </Transition>
    </section>
  );
}
