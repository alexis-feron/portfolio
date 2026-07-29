/** Space left between the bottom of the fixed navbar and a section's heading. */
const NAV_CLEARANCE = 112;

/**
 * Absolute scroll position that brings a section's heading just below the
 * navbar.
 *
 * Scrolling to the section's own top is not enough: every section carries a
 * large internal `padding-top` (160px on desktop), so the heading would land
 * far down the viewport with a band of nothing above it. Measuring from the
 * first child instead makes the landing independent of that padding — and of
 * the breakpoint it changes at.
 *
 * Do not add `scroll-mt-*` to a section on top of this: Lenis honours
 * `scroll-margin-top` too, and the two offsets would stack silently.
 */
export function sectionScrollTop(section: Element): number {
  const heading = section.firstElementChild ?? section;
  return heading.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE;
}

/** Same, from a selector. Returns `null` when the target isn't in the DOM. */
export function sectionScrollTopFor(hash: string): number | null {
  const section = document.querySelector(hash);
  return section ? sectionScrollTop(section) : null;
}
