'use client';

import { tokens } from 'components/layout/ThemeProvider/theme';
import { Icon } from 'components/ui/Icon/Icon';
import { Transition } from 'components/ui/Transition';
import { ChangeEvent, CSSProperties, FocusEvent, useId, useRef, useState } from 'react';
import { classes, cssProps, msToNum } from 'utils/style';
import { TextArea } from './TextArea';

interface InputProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  multiline?: boolean;
  className?: string;
  style?: CSSProperties;
  error?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  type?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  minRows?: number;
  maxRows?: number;
  [key: string]: any;
}

export const Input = ({
  id,
  name,
  label,
  value,
  multiline,
  className,
  style,
  error,
  onBlur,
  autoComplete,
  required,
  maxLength,
  type,
  onChange,
  ...rest
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const generatedId = useId();
  const errorRef = useRef<HTMLDivElement>(null);
  const inputId = id || `${generatedId}input`;
  const labelId = `${inputId}-label`;
  const errorId = `${inputId}-error`;
  const InputElement = multiline ? TextArea : 'input';

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(false);

    if (onBlur) {
      onBlur(event);
    }
  };

  return (
    <div
      className={classes(
        'relative flex flex-col',
        '--inputFontSize:var(--text-body-s)',
        '--inputFocusColor:rgb(var(--rgbPrimary))',
        '--inputUnderlineColor:rgb(var(--rgbText)/0.2)',
        error && '--inputUnderlineColor:var(--color-error)',
        className
      )}
      data-error={!!error}
      style={style}
      {...rest}
    >
      <div className="relative flex group">
        <label
          className={classes(
            'absolute top-l left-0 block cursor-text origin-top-left transition-[color] duration-m ease-linear',
            'text-[rgb(var(--rgbText)/0.8)]',
            'motion-reduce:transition-[transform,color] motion-reduce:duration-m',
            (focused || !!value) && 'text-[rgb(var(--rgbText)/0.54)] scale-75 -translate-y-l'
          )}
          data-focused={focused}
          data-filled={!!value}
          id={labelId}
          htmlFor={inputId}
        >
          {label}
        </label>
        <InputElement
          className={classes(
            'block w-full text-[length:var(--inputFontSize)] leading-[var(--lineHeightBody)] text-[var(--colorTextBody)]',
            'p-0 py-l pb-m bg-transparent border-b-[2px] border-[var(--inputUnderlineColor)] rounded-none appearance-none outline-none',
            // 'shadow-[inset_0_-2px_0_0_var(--inputUnderlineColor)]', // Removed shadow in favor of border
            'transition-[background-color] duration-[5000s] ease-linear delay-[0s]', // Autofill fix hack
            'overflow-x-hidden',
            // Autofill styles
            '[&:-webkit-autofill]:shadow-[0_0_0_1000px_rgb(var(--rgbText)/0.1)_inset]',
            '[&:-webkit-autofill]:-webkit-text-fill-color:var(--colorTextBody)',
            '[&::-webkit-contacts-auto-fill-button]:hover:bg-primary'
          )}
          id={inputId}
          aria-labelledby={labelId}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          maxLength={maxLength}
          type={type}
          name={name}
        />
        <div
            className={classes(
                'absolute bottom-0 w-full h-[2px] bg-primary origin-left scale-x-0 z-10',
                'transition-transform duration-m ease-fast-out-slow-in',
                'motion-safe:transition-transform motion-safe:duration-m motion-safe:ease-fast-out-slow-in',
                focused && '!scale-x-100'
            )}
            data-focused={focused} 
        />
      </div>
      <Transition unmount in={!!error} timeout={msToNum(tokens.base.durationM)}>
        {(visible: boolean) => (
          <div
            className={classes(
                'opacity-0 transition-opacity duration-m ease-fast-out-slow-in h-[var(--height)]',
                'motion-reduce:transition-[height,opacity]',
                visible && 'opacity-100'
            )}
            data-visible={visible}
            id={errorId}
            role="alert"
            style={cssProps({
              height: visible ? errorRef.current?.getBoundingClientRect().height : 0,
            })}
          >
            <div className="grid grid-cols-[auto_1fr] items-center gap-xs pt-s text-error" ref={errorRef}>
              <Icon icon="error" />
              {error}
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
};
