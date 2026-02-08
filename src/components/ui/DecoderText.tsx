'use client';

import { VisuallyHidden } from 'components/ui/VisuallyHidden';
import { useReducedMotion, useSpring } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';
import { delay } from 'utils/delay';
import { classes } from 'utils/style';

// prettier-ignore
const glyphs = [
  '◜','◝','◞','◟','◠','◡',
];

const CharType = {
  Glyph: 'glyph',
  Value: 'value',
};

interface Char {
  type: string;
  value: string;
}

function shuffle(content: string[], output: Char[], position: number) {
  return content.map((value, index) => {
    if (index < position) {
      return { type: CharType.Value, value };
    }

    if (position % 1 < 0.5) {
      const rand = Math.floor(Math.random() * glyphs.length);
      return { type: CharType.Glyph, value: glyphs[rand] };
    }

    return { type: CharType.Glyph, value: output[index]?.value || '' };
  });
}

interface DecoderTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  start?: boolean;
  delay?: number;
  className?: string;
}

export const DecoderText = memo(
  ({ text, start = true, delay: startDelay = 0, className, ...rest }: DecoderTextProps) => {
    const output = useRef<Char[]>([{ type: CharType.Glyph, value: '' }]);
    const container = useRef<HTMLSpanElement>(null);
    const reduceMotion = useReducedMotion();
    const decoderSpring = useSpring(0, { stiffness: 8, damping: 5 });

    useEffect(() => {
      const containerInstance = container.current;
      const content = text.split('');
      let animation: any;

      const renderOutput = () => {
        const characterMap = output.current.map(item => {
          return `<span class="decoder-text-${item.type}">${item.value}</span>`;
        });

        if (containerInstance) {
          containerInstance.innerHTML = characterMap.join('');
        }
      };

      const unsubscribeSpring = decoderSpring.on('change', value => {
        output.current = shuffle(content, output.current, value);
        renderOutput();
      });

      const startSpring = async () => {
        await delay(startDelay);
        decoderSpring.set(content.length);
      };

      if (start && !animation && !reduceMotion) {
        startSpring();
      }

      if (reduceMotion) {
        output.current = content.map((value, index) => ({
          type: CharType.Value,
          value: content[index],
        }));
        renderOutput();
      }

      return () => {
        unsubscribeSpring?.();
      };
    }, [decoderSpring, reduceMotion, start, startDelay, text]);

    return (
      <span className={classes('block', className)} {...rest}>
        <VisuallyHidden className="sr-only">{text}</VisuallyHidden>
        <span aria-hidden className="relative after:content-['_'] after:invisible" ref={container} />
      </span>
    );
  }
);

DecoderText.displayName = 'DecoderText';
