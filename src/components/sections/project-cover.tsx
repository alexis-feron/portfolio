"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { accentVars, type ProjectAccent } from "@/content/projects";

export function ProjectCover({
  src,
  alt,
  accent,
}: {
  src: string;
  alt: string;
  accent: ProjectAccent;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.05]);

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(12% 8% 12% 8%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={accentVars(accent)}
      className="project-accent relative aspect-video w-full overflow-hidden rounded-lg bg-surface"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          background: `radial-gradient(80% 60% at 50% 0%, var(--project-accent), transparent 70%)`,
        }}
      />
    </motion.div>
  );
}
