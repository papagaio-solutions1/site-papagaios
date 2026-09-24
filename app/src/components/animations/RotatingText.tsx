"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Mostra uma palavra por vez, em rotação, no mesmo lugar (sem reflow).
 *  Respeita prefers-reduced-motion (mostra a primeira palavra fixa). */
export function RotatingText({
  words,
  className,
  interval = 2200,
  wrapperClassName = "justify-items-center",
}: {
  words: string[];
  className?: string;
  interval?: number;
  wrapperClassName?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setIndex((p) => (p + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [words.length, interval, reduce]);

  return (
    <span className={`grid ${wrapperClassName}`}>
      {words.map((word, i) => (
        <motion.span
          key={word}
          aria-hidden={i !== index}
          className={`col-start-1 row-start-1 ${className ?? ""}`}
          initial={false}
          animate={
            reduce
              ? { opacity: i === 0 ? 1 : 0 }
              : { opacity: i === index ? 1 : 0, y: i === index ? 0 : 10 }
          }
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
