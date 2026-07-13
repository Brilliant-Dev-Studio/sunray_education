"use client";

import { motion } from "framer-motion";

export default function HeroText() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl font-serif text-7xl font-semibold leading-tight text-foreground sm:text-8xl lg:text-[10rem]"
      >
        Sunray
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mt-1 whitespace-nowrap font-[family-name:var(--font-montserrat)] text-[14px] font-light tracking-wide text-primary-light sm:mt-2 sm:text-[22px]"
      >
        Shaping bright futures through quality education
      </motion.p>
    </>
  );
}
