'use client';

import { AnimatePresence, usePresence } from 'framer-motion';
import { MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react';

interface Timeout {
  enter: number;
  exit: number;
}

interface TransitionProps {
  children: (_visible: boolean, _status: string) => ReactNode;
  timeout?: number | Timeout;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  in?: boolean;
  unmount?: boolean;
}

/**
 * A Framer Motion AnimatePresence implementation of `react-transition-group`
 * to be used for vanilla css transitions
 */
export const Transition = ({
  children,
  timeout = 0,
  onEnter,
  onEntered,
  onExit,
  onExited,
  in: show,
  unmount,
}: TransitionProps) => {
  const enterTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const exitTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (show) {
      if (exitTimeout.current) clearTimeout(exitTimeout.current);
    } else {
      if (enterTimeout.current) clearTimeout(enterTimeout.current);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {(show || !unmount) && (
        <TransitionContent
          timeout={timeout}
          enterTimeout={enterTimeout}
          exitTimeout={exitTimeout}
          onEnter={onEnter}
          onEntered={onEntered}
          onExit={onExit}
          onExited={onExited}
          show={show}
        >
          {children}
        </TransitionContent>
      )}
    </AnimatePresence>
  );
};

interface TransitionContentProps extends Omit<TransitionProps, 'in' | 'unmount'> {
  show?: boolean;
  enterTimeout: MutableRefObject<NodeJS.Timeout | undefined>;
  exitTimeout: MutableRefObject<NodeJS.Timeout | undefined>;
}

const TransitionContent = ({
  children,
  timeout,
  enterTimeout,
  exitTimeout,
  onEnter,
  onEntered,
  onExit,
  onExited,
  show,
}: TransitionContentProps) => {
  const [status, setStatus] = useState('exited');
  const [isPresent, safeToRemove] = usePresence();
  const [hasEntered, setHasEntered] = useState(false);
  const splitTimeout = typeof timeout === 'object';

  useEffect(() => {
    if (hasEntered || !show) return;

    const actualTimeout = splitTimeout ? (timeout as Timeout).enter : (timeout as number);

    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    if (exitTimeout.current) clearTimeout(exitTimeout.current);

    setHasEntered(true);
    setStatus('entering');
    if (onEnter) onEnter();

    // Force strict 0 timeout to be instant
    if (actualTimeout === 0) {
      setStatus('entered');
      if (onEntered) onEntered();
    } else {
      enterTimeout.current = setTimeout(() => {
        setStatus('entered');
        if (onEntered) onEntered();
      }, actualTimeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEnter, onEntered, timeout, status, show]);

  useEffect(() => {
    if (isPresent && show) return;

    const actualTimeout = splitTimeout ? (timeout as Timeout).exit : (timeout as number);

    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    if (exitTimeout.current) clearTimeout(exitTimeout.current);

    setStatus('exiting');
    if (onExit) onExit();

    exitTimeout.current = setTimeout(() => {
      setStatus('exited');
      if (safeToRemove) safeToRemove();
      if (onExited) onExited();
    }, actualTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent, onExit, safeToRemove, timeout, onExited, show]);

  return <>{children(hasEntered && show ? isPresent : false, status)}</>;
};
