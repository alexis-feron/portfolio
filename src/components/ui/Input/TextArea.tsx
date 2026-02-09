'use client';

import { ChangeEvent, CSSProperties, useEffect, useRef, useState } from 'react';
import { classes, cssProps } from 'utils/style';

interface TextAreaProps {
  className?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  value: string;
  onChange: (_event: ChangeEvent<HTMLTextAreaElement>) => void;
  minRows?: number;
  maxRows?: number;
  id?: string;
  name?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  style?: CSSProperties;
  autoFocus?: boolean;
  onBlur?: (_event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (_event: React.FocusEvent<HTMLTextAreaElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const TextArea = ({
  className,
  resize = 'none',
  value,
  onChange,
  minRows = 1,
  maxRows,
  ...rest
}: TextAreaProps) => {
  const [rows, setRows] = useState(minRows);
  const [textareaDimensions, setTextareaDimensions] = useState<{
    lineHeight: number;
    paddingHeight: number;
  }>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const style = getComputedStyle(textareaRef.current);
      const lineHeight = parseInt(style.lineHeight, 10);
      const paddingHeight =
        parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
      setTextareaDimensions({ lineHeight, paddingHeight });
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event);

    if (!textareaDimensions) return;

    const { lineHeight, paddingHeight } = textareaDimensions;
    const previousRows = event.target.rows;
    event.target.rows = minRows;

    const currentRows = ~~((event.target.scrollHeight - paddingHeight) / lineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (maxRows && currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    setRows(maxRows && currentRows > maxRows ? maxRows : currentRows);
  };

  return (
    <textarea
      className={classes('resize-(--resize)', className)}
      ref={textareaRef}
      onChange={handleChange}
      style={cssProps({ resize }, rest.style)}
      rows={rows}
      value={value}
      {...rest}
    />
  );
};
