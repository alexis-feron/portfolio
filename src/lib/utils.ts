import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number between two bounds. */
export function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

/** Zero-padded index, e.g. 1 -> "01". */
export function pad(n: number, size = 2) {
  return String(n).padStart(size, "0");
}
