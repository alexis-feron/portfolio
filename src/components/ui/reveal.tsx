"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Vertical offset in pixels the element travels from. */
  y?: number;
  once?: boolean;
};

/** Fade + rise as the element enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: EASE, delay },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/** Same idea, but the content is masked and slides up from behind a line. */
export function RevealMask({ children, className, delay = 0 }: RevealProps) {
  const reduced = useReducedMotion();

  const inner: Variants = {
    hidden: { y: reduced ? 0 : "110%" },
    visible: { y: 0, transition: { duration: 1, ease: EASE, delay } },
  };

  return (
    // The viewport observer has to sit on the mask, never on the element that
    // moves: the inner span starts 110% of its own height lower, and the mask
    // clips it away entirely once the text wraps past two lines. Observing it
    // there would report "never in view", so the title would stay hidden for
    // exactly the longest titles.
    <motion.span
      className={cn("line-mask block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      <motion.span className="block" variants={inner}>
        {children}
      </motion.span>
    </motion.span>
  );
}
