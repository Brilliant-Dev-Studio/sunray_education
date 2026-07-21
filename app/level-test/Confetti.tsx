"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["#ff3b45", "#ef3444", "#ffb648", "#22c55e", "#3b82f6", "#f5f4f2"];
const PIECE_COUNT = 60;

type Piece = {
  id: number;
  x: number;
  color: string;
  size: number;
  rotate: number;
  delay: number;
  duration: number;
  drift: number;
  round: boolean;
};

export default function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: PIECE_COUNT }, (_, id) => ({
        id,
        x: Math.random() * 100,
        color: COLORS[id % COLORS.length],
        size: 6 + Math.random() * 7,
        rotate: Math.random() * 360,
        delay: Math.random() * 0.35,
        duration: 1.7 + Math.random() * 1.1,
        drift: (Math.random() - 0.5) * 140,
        round: Math.random() > 0.5,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, top: "-5%", x: 0, rotate: 0 }}
          animate={{
            opacity: [1, 1, 0],
            top: "105%",
            x: p.drift,
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 0.45),
            backgroundColor: p.color,
            borderRadius: p.round ? "9999px" : "2px",
          }}
        />
      ))}
    </div>
  );
}
