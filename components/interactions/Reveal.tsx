"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** px to travel */
  y?: number;
  once?: boolean;
  as?: "div" | "li" | "span";
}

/** Scroll reveal: fade + short rise. Becomes a plain wrapper under reduced motion. */
export function Reveal({ children, className, delay = 0, y = 18, once = true, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const M = as === "li" ? motion.li : as === "span" ? motion.span : motion.div;
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <M
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}
