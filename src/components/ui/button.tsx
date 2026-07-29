import Link from "next/link";

import { cn } from "@/lib/utils";

type Variant = "solid" | "outline";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
};

const base =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-4 text-xs font-bold tracking-[0.16em] uppercase transition-colors duration-500 ease-out-expo disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // The solid button carries a border in its own colour: invisible at rest,
  // it becomes the outline once the wipe fills the button with the page
  // background - without it the button would vanish against the page.
  solid: "border border-fg bg-fg text-bg hover:text-fg",
  outline: "border border-line text-fg hover:border-fg hover:text-bg",
};

/**
 * Hover is a curved wipe: the fill rises from below with a rounded crest that
 * flattens as it lands, and the label swaps for an identical copy sliding in
 * behind it. Two shapes moving on the same easing read as one gesture.
 */
function Inner({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: Variant;
}) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-full rounded-[50%_50%_0_0/45%_45%_0_0]",
          "transition-[transform,border-radius] duration-600 ease-out-expo",
          "group-hover:translate-y-0 group-hover:rounded-[0_0_0_0/0_0_0_0]",
          variant === "solid" ? "bg-bg" : "bg-fg",
        )}
      />

      {/* Label wrapper: caps have no descenders, so clipping here is safe. */}
      <span className="relative z-10 block overflow-hidden">
        <span className="flex items-center gap-2.5 transition-transform duration-500 ease-out-expo group-hover:translate-y-[-140%]">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 flex translate-y-[140%] items-center justify-center gap-2.5 transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
    </>
  );
}

export function Button({
  children,
  className,
  variant = "solid",
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  variant = "solid",
  href,
  external,
  ...props
}: CommonProps & {
  href: string;
  external?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(base, variants[variant], className)}
        {...props}
      >
        <Inner variant={variant}>{children}</Inner>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
}
