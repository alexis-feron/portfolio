export {};

declare global {
  interface Window {
    turnstile?: {
      render: (
        _container: HTMLElement | string,
        _params: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact';
          callback?: (_token: string) => void;
          'error-callback'?: () => void;
        }
      ) => string;
      remove: (_widgetId: string) => void;
    };
  }
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default content;
}

declare module '*.png' {
  const content: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default content;
}

declare module '*.glsl' {
  const value: string;
  export default value;
}

declare module '*.glb' {
  const value: string;
  export default value;
}
