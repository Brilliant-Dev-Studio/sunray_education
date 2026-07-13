"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const cards = [
  {
    src: "/HeroSectionImages/8AxkYNsPmpX3TkZm21mGtYsXtyE.avif",
    className: "left-[6.5vw] top-[31vh] h-[13vw] w-[16.5vw]",
    restRotate: -6,
    from: { x: -280, y: -180, rotate: -35 },
    delay: 0.1,
  },
  {
    src: "/HeroSectionImages/WbU912byZzH51eUtzDeIFMzzDA.avif",
    className: "right-[9vw] top-[38vh] h-[10vw] w-[12vw]",
    restRotate: 6,
    from: { x: 280, y: -220, rotate: 35 },
    delay: 0.3,
  },
  {
    src: "/HeroSectionImages/uYxYmYvQtsp0fRbUzj5NYfVrL8.avif",
    className: "left-[54vw] top-[72vh] h-[11vw] w-[13vw]",
    restRotate: -4,
    from: { x: -60, y: 280, rotate: 20 },
    delay: 0.5,
  },
];

export default function HeroPhotos() {
  return (
    <>
      {cards.map((card) => (
        <motion.div
          key={card.src}
          className={`pointer-events-none absolute hidden overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 lg:block ${card.className}`}
          initial={{ opacity: 0, ...card.from }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: card.restRotate }}
          transition={{
            duration: 1.1,
            delay: card.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Image src={card.src} alt="" fill className="object-cover" />
        </motion.div>
      ))}
    </>
  );
}
