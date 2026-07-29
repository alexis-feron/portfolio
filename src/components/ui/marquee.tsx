import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
  separator?: string;
  reverse?: boolean;
};

/**
 * Edge-to-edge scrolling band. The list is rendered twice so the CSS animation
 * can loop seamlessly at -50%.
 */
export function Marquee({
  items,
  duration = 32,
  className,
  separator = "✦",
  reverse = false,
}: MarqueeProps) {
  const sequence = [...items, ...items];

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden select-none",
        className,
      )}
      aria-hidden
    >
      <div
        className="animate-marquee flex w-max shrink-0 items-center gap-8 pr-8"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {sequence.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-8 whitespace-nowrap"
          >
            <span>{item}</span>
            <span className="text-highlight opacity-70">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
