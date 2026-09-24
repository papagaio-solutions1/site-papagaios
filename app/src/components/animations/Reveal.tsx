"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Revela o conteúdo com fade-up quando entra na viewport (uma vez).
 *  Respeita prefers-reduced-motion: nesse caso renderiza o conteúdo visível,
 *  sem animação (e sem risco de ficar invisível). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" as const }}
    >
      {children}
    </motion.div>
  );
}
