'use client';

import { useTheme } from 'components/layout/ThemeProvider/useTheme';
import { Button } from 'components/ui/Button';
import { Divider } from 'components/ui/Divider';
import { Heading } from 'components/ui/Heading';
import { deviceModels } from 'components/ui/Model/deviceModels';
import { Section } from 'components/ui/Section';
import { Text } from 'components/ui/Text';
import { Transition } from 'components/ui/Transition';
import { useWindowSize } from 'hooks';
import React, { startTransition, Suspense, useEffect, useState } from 'react';
import { classes, cssProps, media } from 'utils/style';

const Model = React.lazy(() =>
  import('components/ui/Model/Model').then(module => ({ default: module.Model }))
);

interface ProjectModel {
  type: 'laptop' | 'phone';
  alt: string;
  textures: {
    srcSet: (string | { src: string; width: number })[];
    placeholder: { src: string };
  }[];
}

interface ProjectSummaryProps {
  id: string;
  visible: boolean;
  sectionRef: React.RefObject<HTMLDivElement | HTMLElement>;
  index: number;
  title: string;
  description: string;
  model: ProjectModel;
  buttonText: string;
  buttonLink: string;
  alternate?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const ProjectSummary = ({
  id,
  visible: sectionVisible,
  sectionRef,
  index,
  title,
  description,
  model,
  buttonText,
  buttonLink,
  alternate,
  ...rest
}: ProjectSummaryProps) => {
  const [focused, setFocused] = useState(false);
  const theme = useTheme();
  const { width } = useWindowSize();
  const titleId = `${id}-title`;
  const isMobile = width <= media.tablet;
  const svgOpacity = theme.themeId === 'light' ? 0.7 : 1;
  const indexText = index < 10 ? `0${index}` : index;
  const phoneSizes = `(max-width: ${media.tablet}px) 30vw, 20vw`;
  const laptopSizes = `(max-width: ${media.tablet}px) 80vw, 40vw`;

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [ModelComponent, setModelComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('components/ui/Model/Model').then(module => {
      setModelComponent(() => module.Model);
    });
  }, []);

  const renderKatakana = (device: string, visible: boolean) => (
    <svg
      aria-hidden="true"
      width="750"
      height="137"
      viewBox="0 0 750 137"
      data-visible={visible}
      data-light={theme.themeId === 'light'}
      style={cssProps({ opacity: svgOpacity })}
      className={classes(
        'opacity-0 transition-opacity duration-1200 ease-linear delay-1400 fill-text-title',
        visible && 'opacity-(--opacity)',

        device === 'laptop' &&
          'absolute w-full -right-[36%] bottom-[24%] translate-y-[50%]',
        device === 'laptop' &&
          'max-[1040px]:w-[80%] max-[1040px]:-right-[10%] max-[1040px]:bottom-[18%]',
        device === 'laptop' && 'max-[696px]:right-0',

        device === 'phone' && 'absolute bottom-[23%] translate-y-[50%] w-full delay-800',
        device === 'phone' && 'max-[1040px]:w-[80%] max-[1040px]:bottom-[23%]'
      )}
      data-device={device}
    ></svg>
  );

  const renderDetails = (visible: boolean) => (
    <div
      className={classes(
        'z-10 relative',
        'max-[1040px]:flex-none max-[1040px]:max-w-102.5 max-[1040px]:justify-self-center',
        'max-[1040px]:order-2'
      )}
    >
      <div
        aria-hidden
        className="relative grid grid-cols-[90px_1fr] gap-m items-center mb-xl"
      >
        <Divider
          notchWidth="64px"
          notchHeight="8px"
          collapsed={!visible}
          collapseDelay={1000}
        />
        <span
          className={classes(
            'text-body-s font-medium text-primary opacity-0 transition-opacity duration-m ease-fast-out-slow-in delay-[1.3s]',
            'motion-safe:transition-[transform,opacity] motion-safe:-translate-x-m',
            visible && 'translate-none opacity-100'
          )}
          data-visible={visible}
        >
          {indexText}
        </span>
      </div>
      <Heading
        level={3}
        as="h2"
        className={classes(
          'mb-l opacity-0 transition-opacity duration-xl ease-fast-out-slow-in delay-m',
          'motion-safe:transition-[transform,opacity] motion-safe:translate-y-l',
          visible && 'translate-none opacity-100'
        )}
        data-visible={visible}
        id={titleId}
      >
        {title}
      </Heading>
      <Text
        className={classes(
          'mb-xl opacity-0 transition-opacity duration-xl ease-fast-out-slow-in delay-l text-justify',
          'motion-safe:transition-[transform,opacity] motion-safe:translate-y-l',
          visible && 'translate-none opacity-100'
        )}
        data-visible={visible}
        as="p"
      >
        {description}
      </Text>
      <div
        className={classes(
          'opacity-0 transition-opacity duration-xl ease-fast-out-slow-in delay-xl translate-y-l',
          'motion-safe:transition-[transform,opacity] motion-safe:translate-y-l',
          visible && 'translate-none opacity-100'
        )}
        data-visible={visible}
      >
        <Button
          iconHoverShift
          href={buttonLink}
          iconEnd="arrowRight"
          title="project link"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );

  const renderPreview = (visible: boolean) => (
    <div className="relative flex items-center justify-self-center justify-center h-[90%] w-[90%] z-20 max-[1040px]:order-1">
      {model.type === 'laptop' && (
        <Suspense fallback={<div>Loading...</div>}>
          {renderKatakana('laptop', visible)}
          <div
            className={classes(
              'min-w-[180%] aspect-12/10 grid relative top-[6%] left-[14%]',
              'max-[2080px]:min-w-[180%]',
              'max-[1040px]:min-w-[140%] max-[1040px]:top-[10%] max-[1040px]:left-0'
            )}
            data-device="laptop"
          >
            {ModelComponent && (
              <Model
                alt={model.alt}
                cameraPosition={{ x: 0, y: 0, z: 8 }}
                showDelay={100}
                show={visible}
                models={[
                  {
                    ...deviceModels.laptop,
                    texture: {
                      ...model.textures[0],
                      sizes: laptopSizes,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any, // Verify Type compatibility
                  },
                ]}
              />
            )}
          </div>
        </Suspense>
      )}
      {model.type === 'phone' && (
        <Suspense fallback={<div>Loading...</div>}>
          {renderKatakana('phone', visible)}
          <div
            className={classes(
              'min-w-[116%] aspect-7/10 grid relative top-[5%] -left-[10%]',
              'max-[2080px]:min-w-[108%] max-[2080px]:left-0',
              'max-[1040px]:min-w-[108%] max-[1040px]:left-0 max-[1040px]:max-h-[60vh]',
              'max-[696px]:min-w-[108%] max-[696px]:left-0 max-[696px]:max-h-none'
            )}
            data-device="phone"
          >
            {ModelComponent && (
              <Model
                alt={model.alt}
                cameraPosition={{ x: 0, y: 0, z: 11.5 }}
                showDelay={100}
                show={visible}
                models={[
                  {
                    ...deviceModels.phone,
                    position: { x: -0.6, y: 1.1, z: 0 },
                    texture: {
                      ...model.textures[0],
                      sizes: phoneSizes,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any,
                  },
                  {
                    ...deviceModels.phone,
                    position: { x: 0.6, y: -0.5, z: 0.3 },
                    texture: {
                      ...model.textures[1],
                      sizes: phoneSizes,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any,
                  },
                ]}
              />
            )}
          </div>
        </Suspense>
      )}
    </div>
  );

  return (
    <Section
      className={classes(
        'h-screen w-full max-h-270 pb-l my-30 relative flex items-center justify-center outline-none focus:outline-none',
        'max-[2080px]:my-2xl',
        'max-[1040px]:h-auto max-[1040px]:my-3xl',
        'max-[696px]:pb-4xl max-[696px]:mb-0',
        index === 1 && 'mt-0 max-[1040px]:mt-0' // data-first
      )}
      data-alternate={alternate}
      data-first={index === 1}
      onFocus={() => isHydrated && startTransition(() => setFocused(true))}
      onBlur={() => isHydrated && startTransition(() => setFocused(false))}
      as="section"
      aria-labelledby={titleId}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={sectionRef as any}
      id={id}
      tabIndex={-1}
      {...rest}
    >
      <div
        className={classes(
          'w-full max-w-7xl items-center justify-center grid grid-cols-[36%_1fr] gap-x-2xl',
          alternate && 'grid-cols-[1fr_36%]',
          'max-[1680px]:grid-cols-[40%_1fr]',
          alternate && 'max-[1680px]:grid-cols-[1fr_40%]',

          'max-[1040px]:grid-cols-1 max-[1040px]:flex-col max-[1040px]:flex max-[1040px]:h-auto',
          // Note: flex-col-reverse on grid wrapper? Original CSS used grid-template-columns: 100% and flex-direction: column-reverse
          // (but display was grid? Wait. flex-direction only applies to flex containers. module.css says display: grid.
          // Wait, module.css:
          // .content { display: grid ... }
          // @media (max-width: 1040px) { grid-template-columns: 100%; flex-direction: column-reverse; height: auto; }
          // If it's still display:grid, flex-direction does nothing.
          // Likely the original CSS intended to switch to flex or relying on source order?
          // BUT if it's grid, we can just swap rows.
          // Or maybe it was display: flex in mobile?
          // Let's assume it should be flex in mobile for column-reverse to work, OR use row-start/row-end to reorder grid items.
          // The CSS says: .details { grid-row: 2; } in mobile. .preview is implicitly row 1?
          // If I use flex flex-col-reverse, I need to set display: flex.
          // Tailwind `flex` sets display:flex. So `max-[1040px]:flex max-[1040px]:flex-col-reverse` works.

          // And handling alternate in mobile:
          alternate && 'max-[1040px]:grid-cols-1'
        )}
      >
        <Transition in={sectionVisible || focused}>
          {(visible: boolean) => (
            <>
              {!alternate && !isMobile && (
                <>
                  {renderDetails(visible)}
                  {renderPreview(visible)}
                </>
              )}
              {(alternate || isMobile) && (
                <>
                  {renderPreview(visible)}
                  {renderDetails(visible)}
                </>
              )}
            </>
          )}
        </Transition>
      </div>
    </Section>
  );
};
