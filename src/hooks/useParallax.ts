import { useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

export function useParallax(
  multiplier: number,
  onChange: (value: number) => void
): void {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    let animationFrame: number | null = null;

    const animate = () => {
      const { innerHeight } = window;
      const offsetValue = Math.max(0, window.scrollY) * multiplier;
      const clampedOffsetValue = Math.max(
        -innerHeight,
        Math.min(innerHeight, offsetValue)
      );
      onChange(clampedOffsetValue);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (!reduceMotion) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [multiplier, onChange, reduceMotion]);
}
