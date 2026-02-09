import GothamBoldItalic from 'assets/fonts/gotham-bold-italic.woff2';
import GothamBold from 'assets/fonts/gotham-bold.woff2';
import GothamBookItalic from 'assets/fonts/gotham-book-italic.woff2';
import GothamBook from 'assets/fonts/gotham-book.woff2';
import GothamMediumItalic from 'assets/fonts/gotham-medium-italic.woff2';
import GothamMedium from 'assets/fonts/gotham-medium.woff2';
import { media } from 'utils/style';
import { theme, tokens } from './theme';

/**
 * Squeeze out spaces and newlines
 */
export function squish(styles: string): string {
  return styles.replace(/\s\s+/g, ' ');
}

/**
 * Transform theme token objects into CSS custom property strings
 */
export function createThemeProperties(themeObj: Record<string, string | number>): string {
  return squish(
    Object.keys(themeObj)
      .filter(key => key !== 'themeId')
      .map(key => `--${key}: ${themeObj[key]};`)
      .join('\n\n')
  );
}

/**
 * Transform theme tokens into a React CSSProperties object
 */
export function createThemeStyleObject(
  themeObj: Record<string, string | number>
): Record<string, string | number> {
  const style: Record<string, string | number> = {};

  for (const key of Object.keys(themeObj)) {
    if (key !== 'themeId') {
      style[`--${key}`] = themeObj[key];
    }
  }

  return style;
}

/**
 * Generate media queries for tokens
 */
export function createMediaTokenProperties(): string {
  return squish(
    Object.keys(media)
      .map(key => {
        return `
        @media (max-width: ${media[key as keyof typeof media]}px) {
          :root {
            ${createThemeProperties(tokens[key] as Record<string, string | number>)}
          }
        }
      `;
      })
      .join('\n')
  );
}

export const tokenStyles = squish(`
  :root {
    ${createThemeProperties(tokens.base as unknown as Record<string, string | number>)}
  }

  ${createMediaTokenProperties()}

  [data-theme='dark'] {
    ${createThemeProperties(theme.dark as unknown as Record<string, string | number>)}
  }

  [data-theme='light'] {
    ${createThemeProperties(theme.light as unknown as Record<string, string | number>)}
  }
`);

export const fontStyles = squish(`
  @font-face {
    font-family: Gotham;
    font-weight: 400;
    src: url(${GothamBook}) format('woff2');
    font-display: block;
    font-style: normal;
  }

  @font-face {
    font-family: Gotham;
    font-weight: 400;
    src: url(${GothamBookItalic}) format('woff2');
    font-display: block;
    font-style: italic;
  }

  @font-face {
    font-family: Gotham;
    font-weight: 500;
    src: url(${GothamMedium}) format('woff2');
    font-display: block;
    font-style: normal;
  }

  @font-face {
    font-family: Gotham;
    font-weight: 500;
    src: url(${GothamMediumItalic}) format('woff2');
    font-display: block;
    font-style: italic;
  }

  @font-face {
    font-family: Gotham;
    font-weight: 700;
    src: url(${GothamBold}) format('woff2');
    font-display: block;
    font-style: normal;
  }

  @font-face {
    font-family: Gotham;
    font-weight: 700;
    src: url(${GothamBoldItalic}) format('woff2');
    font-display: block;
    font-style: italic;
  }
`);
