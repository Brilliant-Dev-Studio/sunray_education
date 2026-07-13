"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function RotatingBadge() {
  return (
    <div className="relative mx-auto h-40 w-40 sm:h-44 sm:w-44">
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="badge-circle"
            d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
          />
        </defs>
        <text
          className="fill-muted text-[13px] font-semibold uppercase tracking-[0.25em]"
        >
          <textPath href="#badge-circle" startOffset="0%">
            Since 1990 — Start Building Your Future Today —
          </textPath>
        </text>
      </motion.svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <Image src="/book.svg" alt="" width={56} height={56} />
      </div>
    </div>
  );
}
