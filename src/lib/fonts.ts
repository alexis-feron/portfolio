import { Josefin_Sans } from "next/font/google";
import localFont from "next/font/local";

/** Body copy (Light 300) and subtitles (Bold 700). */
export const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-josefin",
  display: "swap",
});

/** Display face used for every heading. */
export const dirtyline = localFont({
  src: [
    {
      path: "../../public/fonts/dirtyline.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/dirtyline.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-dirtyline",
  display: "swap",
  // Dirtyline is a display face with a limited glyph set - fall back gracefully.
  fallback: ["Josefin Sans", "system-ui", "sans-serif"],
});
