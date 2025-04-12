// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

const lightTheme = {
  rgbBackground: '242 242 242',
  rgbBackgroundLight: '255 255 255',
  rgbPrimary: '0 0 0',
  rgbAccent: '0 229 255',
  rgbText: '0 0 0',
  rgbError: '255 0 60',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Gotham', ...defaultTheme.fontFamily.sans],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        rotate: 'rotate 20s linear infinite', // fallback générique
      },
      colors: {
        background: `rgb(${lightTheme.rgbBackground})`,
        backgroundLight: `rgb(${lightTheme.rgbBackgroundLight})`,
        text: `rgb(${lightTheme.rgbText})`,
        primary: `rgb(${lightTheme.rgbPrimary})`,
        accent: `rgb(${lightTheme.rgbAccent} )`,
        error: `rgb(${lightTheme.rgbError})`,
      },
      fill: theme => ({
        accent: theme('colors.accent'),
        text: theme('colors.text'),
        background: theme('colors.background'),
        backgroundLight: theme('colors.backgroundLight'),
        primary: theme('colors.primary'),
        error: theme('colors.error'),
      }),
      fontSize: {
        h0: '8.75rem', // 140px
        h1: '6.25rem', // 100px
        h2: '3.625rem', // 58px
        h3: '2.375rem', // 38px
        h4: '1.75rem', // 28px
        h5: '1.5rem', // 24px
        bodyxl: '1.375rem', // 22px
        bodyl: '1.25rem', // 20px
        bodym: '1.125rem', // 18px
        bodys: '1rem', // 16px
        bodyxs: '0.875rem', // 14px
      },
      maxWidth: {
        s: '540px',
        m: '720px',
        l: '1096px',
        xl: '1680px',
      },
      spacing: {
        outer: '64px',
        xs: '4px',
        s: '8px',
        m: '16px',
        l: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
        '5xl': '128px',
      },
      zIndex: {
        0: '0',
        1: '4',
        2: '8',
        3: '16',
        4: '32',
        5: '64',
      },
      transitionTimingFunction: {
        'fast-out-slow-in': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      transitionDuration: {
        xs: '100ms',
        s: '150ms',
        m: '200ms',
        l: '300ms',
        xl: '400ms',
      },
    },
  },
  plugins: [],
};
