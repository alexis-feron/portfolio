/**
 * HTTP content negotiation between the two representations every page has:
 * the HTML the browser renders, and the Markdown agents ask for with
 * `Accept: text/markdown` (https://acceptmarkdown.com).
 */
export type Representation = "html" | "markdown";

export const MEDIA_TYPES: Record<Representation, string> = {
  html: "text/html",
  markdown: "text/markdown",
};

type MediaRange = { type: string; subtype: string; q: number };

function parseAccept(header: string): MediaRange[] {
  return header
    .split(",")
    .map((part) => {
      const [range, ...params] = part.trim().split(";");
      const [type, subtype] = range.trim().toLowerCase().split("/");
      let q = 1;
      for (const param of params) {
        const [key, value] = param.trim().split("=");
        if (key.trim().toLowerCase() === "q") {
          const parsed = Number(value);
          // A malformed weight is ignored rather than allowed to veto a type.
          if (!Number.isNaN(parsed)) q = Math.min(Math.max(parsed, 0), 1);
        }
      }
      return { type, subtype, q };
    })
    .filter((range) => range.type && range.subtype);
}

/**
 * The weight a media type gets from a parsed header, and how specifically it
 * was named. RFC 9110 §12.5.1: the most specific matching range wins, so
 * `text/markdown;q=0` still refuses Markdown even next to `*\/*`.
 */
function weigh(ranges: MediaRange[], mediaType: string) {
  const [type, subtype] = mediaType.split("/");
  let best: { q: number; specificity: number } = { q: 0, specificity: -1 };

  for (const range of ranges) {
    const specificity =
      range.type === type && range.subtype === subtype
        ? 2
        : range.type === type && range.subtype === "*"
          ? 1
          : range.type === "*" && range.subtype === "*"
            ? 0
            : -1;
    if (specificity > best.specificity) best = { q: range.q, specificity };
  }

  return best;
}

/**
 * Picks the representation for an `Accept` header, or `null` when the client
 * accepts neither - the caller answers 406.
 *
 * HTML stays the default: no header, `*\/*` or a browser's usual list all get
 * HTML. Markdown is served only to a client that names `text/markdown`
 * explicitly and weighs it at least as high as HTML - browsers never do, so
 * a tie can only come from a client that wants Markdown.
 */
export function negotiate(accept: string | null): Representation | null {
  if (!accept?.trim()) return "html";

  const ranges = parseAccept(accept);
  if (ranges.length === 0) return "html";

  const markdown = weigh(ranges, MEDIA_TYPES.markdown);
  const html = weigh(ranges, MEDIA_TYPES.html);

  if (markdown.q > 0 && markdown.specificity === 2 && markdown.q >= html.q) {
    return "markdown";
  }
  if (html.q > 0) return "html";
  if (markdown.q > 0) return "markdown";
  return null;
}
