'use client';

import { useTheme } from 'components/layout/ThemeProvider/useTheme';
import { Button } from 'components/ui/Button';
import { Icon } from 'components/ui/Icon/Icon';
import { useReducedMotion } from 'framer-motion';
import { useHasMounted, useInViewport } from 'hooks';
import { CSSProperties, Fragment, ReactEventHandler, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { resolveSrcFromSrcSet, srcSetToString } from 'utils/image';
import { classes, cssProps, numToMs } from 'utils/style';

interface ImageSrc {
  src: string;
  width: number;
  height?: number;
}

interface ImagePlaceholder {
  src: string;
  width: number;
  height: number;
}

interface ImageProps {
  className?: string;
  style?: CSSProperties;
  reveal?: boolean;
  delay?: number;
  raised?: boolean;
  src?: ImageSrc | string;
  srcSet?: ImageSrc[] | string;
  placeholder?: ImagePlaceholder;
  alt?: string;
  sizes?: string;
  play?: boolean;
  restartOnPause?: boolean;
  noPauseButton?: boolean;
  [key: string]: any;
}

export const Image = ({
  className,
  style,
  reveal,
  delay = 0,
  raised,
  src: baseSrc,
  srcSet,
  placeholder,
  ...rest
}: ImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const { themeId } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const src = baseSrc || (Array.isArray(srcSet) ? srcSet[0] : undefined);
  const inViewport = useInViewport(containerRef, !getIsVideo(src));

  const onLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className={classes(
        'relative transform-none grid grid-cols-[100%] isolate',
        raised && 'shadow-[0_50px_100px_-20px_rgb(var(--rgbBlack)/0.25),0_30px_60px_-30px_rgb(var(--rgbBlack)/0.3)]',
        reveal && 'transition-shadow duration-l ease-linear delay-[var(--revealDuration)/2] [--revealDuration:1.8s]',
        reveal && !loaded && !inViewport && 'shadow-none', // logic check: !visible -> inViewport || loaded
        // Logic check: original was &:not([data-visible='true']) { box-shadow: none; }
        // data-visible = inViewport || loaded
        reveal && !(inViewport || loaded) && 'shadow-none',
        
        // Before pseudo-element for reveal
        reveal && 'before:content-[""] before:bg-accent before:absolute before:inset-0 before:scale-x-0 before:origin-left before:will-change-transform before:z-20',
        
        // Reveal animation
        reveal && (inViewport || loaded) && 'motion-safe:before:animate-[reveal_var(--revealDuration)_var(--ease-fast-out-slow-in)_var(--delay)]',

        className
      )}
      data-visible={inViewport || loaded}
      data-reveal={reveal}
      data-raised={raised}
      data-theme={themeId}
      style={cssProps({ delay: numToMs(delay) }, style)}
      ref={containerRef}
    >
      <ImageElements
        delay={delay}
        onLoad={onLoad}
        loaded={loaded}
        inViewport={inViewport}
        reveal={reveal}
        src={src}
        alt={rest.alt}
        srcSet={srcSet}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

interface ImageElementsProps extends ImageProps {
  onLoad: ReactEventHandler<HTMLElement>;
  loaded: boolean;
  inViewport: boolean;
  src?: ImageSrc | string;
}

const ImageElements = ({
  onLoad,
  loaded,
  inViewport,
  srcSet,
  placeholder,
  delay = 0,
  src,
  alt,
  play = true,
  restartOnPause,
  reveal,
  sizes,
  noPauseButton,
  ...rest
}: ImageElementsProps) => {
  const reduceMotion = useReducedMotion();
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [playing, setPlaying] = useState(!reduceMotion);
  const [videoSrc, setVideoSrc] = useState<string>();
  const [videoInteracted, setVideoInteracted] = useState(false);
  const placeholderRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = getIsVideo(src);
  const showFullRes = inViewport;
  const srcSetString = srcSetToString(srcSet as any);
  const hasMounted = useHasMounted();

  useEffect(() => {
    const resolveVideoSrc = async () => {
      const resolvedVideoSrc = await resolveSrcFromSrcSet({ srcSet, sizes: sizes || '' });
      setVideoSrc(resolvedVideoSrc);
    };

    if (isVideo && srcSet) {
      resolveVideoSrc();
    } else if (isVideo && typeof src === 'string') {
      setVideoSrc(src);
    } else if (isVideo && typeof src === 'object') {
        setVideoSrc(src.src);
    }
  }, [isVideo, sizes, src, srcSet]);

  useEffect(() => {
    if (!videoRef.current || !videoSrc) return;

    const playVideo = () => {
      setPlaying(true);
      videoRef.current?.play();
    };

    const pauseVideo = () => {
      setPlaying(false);
      videoRef.current?.pause();
    };

    if (!play) {
      pauseVideo();

      if (restartOnPause && videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }

    if (videoInteracted) return;

    if (!inViewport) {
      pauseVideo();
    } else if (inViewport && !reduceMotion && play) {
      playVideo();
    }
  }, [inViewport, play, reduceMotion, restartOnPause, videoInteracted, videoSrc]);

  const togglePlaying = (event: SyntheticEvent) => {
    event.preventDefault();

    setVideoInteracted(true);
    
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      setPlaying(true);
      videoRef.current.play();
    } else {
      setPlaying(false);
      videoRef.current.pause();
    }
  };

  return (
    <div
      className={classes(
        'relative transform-none grid grid-cols-[100%] opacity-0 transition-none',
        reveal && 'opacity-0 transition-opacity duration-m ease-linear delay-[var(--delay)]',
        reveal && 'motion-reduce:delay-[calc(var(--delay)-1s)]',
        (inViewport || loaded) && 'opacity-100' // data-visible
      )}
      data-reveal={reveal}
      data-visible={inViewport || loaded}
      style={cssProps({ delay: numToMs(delay + 1000) })}
    >
      {isVideo && hasMounted && (
        <Fragment>
          <video
            muted
            loop
            playsInline
            className={classes(
                'w-full h-auto opacity-0 col-start-1 row-start-1 [image-rendering:-webkit-optimize-contrast]',
                loaded && 'opacity-100'
            )}
            data-loaded={loaded}
            autoPlay={!reduceMotion}
            role="img"
            onLoadStart={onLoad}
            src={videoSrc}
            aria-label={alt}
            ref={videoRef}
            {...rest}
          />
          {!noPauseButton && (
            <Button 
                className={classes(
                    'opacity-0 absolute top-m left-m h-[32px] text-white p-[0_8px_0_2px]',
                    'after:bg-[rgb(var(--rgbBlack)/0.8)]',
                    'group-hover:opacity-100 focus:opacity-100' // Assuming group on wrapper? Wrapper doesn't have group.
                    // The CSS was .elementWrapper:hover & -> so we need group on wrapper
                )} 
                onClick={togglePlaying}
            >
              <Icon icon={playing ? 'pause' : 'play'} />
              {playing ? 'Pause' : 'Play'}
            </Button>
          )}
        </Fragment>
      )}
      {!isVideo && (
        <img
          className={classes(
            'w-full h-auto opacity-0 col-start-1 row-start-1 [image-rendering:-webkit-optimize-contrast]',
            loaded && 'opacity-100'
          )}
          data-loaded={loaded}
          onLoad={onLoad}
          decoding="async"
          src={showFullRes && typeof src === 'object' ? src.src : (showFullRes && typeof src === 'string' ? src : undefined)} 
          srcSet={showFullRes ? srcSetString : undefined}
          width={Array.isArray(src) ? undefined : (typeof src === 'object' ? src.width : undefined)}
          height={Array.isArray(src) ? undefined : (typeof src === 'object' ? src.height : undefined)}
          alt={alt}
          sizes={sizes}
          {...rest}
        />
      )}
      {showPlaceholder && placeholder && (
        <img
          aria-hidden
          className={classes(
            'w-full h-auto transition-opacity duration-m ease-linear delay-[var(--delay)] pointer-events-none relative z-10 opacity-100 col-start-1 row-start-1',
            loaded && 'opacity-0'
          )}
          data-loaded={loaded}
          style={cssProps({ delay: numToMs(delay) })}
          ref={placeholderRef}
          src={placeholder.src}
          width={placeholder.width}
          height={placeholder.height}
          onTransitionEnd={() => setShowPlaceholder(false)}
          decoding="async"
          alt={alt}
          role="presentation"
        />
      )}
    </div>
  );
};

function getIsVideo(src: any) {
  return (typeof src === 'string' && src.endsWith('.mp4')) || (typeof src === 'object' && src?.src?.endsWith('.mp4'));
}
