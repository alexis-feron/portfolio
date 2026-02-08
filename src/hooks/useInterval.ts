import { useEffect, useRef } from 'react';

export function useInterval(
  callback: () => void,
  delay: number | null,
  reset?: unknown
): void {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, reset]);
}
