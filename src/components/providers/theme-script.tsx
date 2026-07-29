"use client";

/**
 * Applies the stored (or system) theme to <html> before first paint, so there
 * is no flash of the wrong colour scheme.
 *
 * The guard is the whole point: React refuses to *create* a <script> element
 * during a client render and logs an error when it sees one. Switching locale
 * re-renders this layout in the browser, which is exactly that situation. So
 * the tag is emitted during the server render only - by then it has already
 * run, and the client tree simply never contains it.
 */
const script = `(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='light'||s==='dark'?s:(m?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.dataset.theme=t;}catch(e){}})();`;

export function ThemeScript() {
  if (typeof window !== "undefined") return null;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
