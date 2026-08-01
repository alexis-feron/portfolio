"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type SplitTextProps = {
  text: string;
  className?: string;
  /** Delay between each word, in seconds. */
  stagger?: number;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

/**
 * Reveals a string word by word, each word sliding up from behind a mask.
 * The full string stays available to screen readers as a single label.
 */
export function SplitText({
  text,
  className,
  stagger = 0.045,
  delay = 0,
  as = "span",
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const word: Variants = {
    hidden: { y: reduced ? 0 : "110%", opacity: reduced ? 0 : 1 },
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: EASE } },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn("inline-block", className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {/* ARIA forbids `aria-label` on a plain <p>/<span>, so the readable copy
          is carried by a visually hidden twin instead and the animated words
          are hidden from the accessibility tree. */}
      <span className="sr-only">{text}</span>

      {words.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className={cn(
            "line-mask inline-block align-bottom",
            index < words.length - 1 && "mr-[0.24em]",
          )}
          aria-hidden
        >
          <motion.span className="inline-block" variants={word}>
            {value}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
