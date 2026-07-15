"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const photos = [1, 2, 3, 4, 5].map((n) => `/HeroImages/photo${n}.avif`);

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % photos.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[55vh] min-h-95 w-full overflow-hidden sm:h-[80vh] sm:min-h-130">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={photos[index]}
            alt=""
            fill
            priority={index === 0}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

      <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-12 sm:pb-20">
        <p className="text-lg font-extrabold uppercase tracking-wide text-white sm:text-3xl">
          Welcome To
        </p>
        <h1 className="mt-1 max-w-3xl text-2xl font-extrabold uppercase leading-tight text-white sm:text-5xl">
          Sunray Education Group
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:mt-6 sm:text-base">
          Our school &amp; college is dedicated to academic excellence,
          character development, and leadership growth. With experienced
          teachers and modern facilities, we ensure every learner reaches
          their full potential.
        </p>

        <div className="mt-4 flex gap-2 sm:mt-8">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-primary-light" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
