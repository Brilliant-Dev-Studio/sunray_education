"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ClockIcon, ArrowRightIcon, MedalIcon } from "./icons";

type LevelSummary = {
  code: string;
  name: string;
};

type TestSummary = {
  id: string;
  name: string;
  description: string | null;
};

// Decorative rung width, longest at the top (hardest) — encodes the real
// A1 -> C2 difficulty order, not an arbitrary index.
function rungWidth(index: number, total: number) {
  if (total <= 1) return 100;
  return 46 + (index / (total - 1)) * 54;
}

export default function LevelTestApp({
  test,
  levels,
  questionCount,
}: {
  test: TestSummary;
  levels: LevelSummary[];
  questionCount: number;
}) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);
  const reduceMotion = useReducedMotion();

  function startTest() {
    if (navigating) return;
    setNavigating(true);
    router.push(`/level-test/${test.id}`);
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#FFF9F2] dark:bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          color: "var(--primary-light)",
          maskImage: "radial-gradient(ellipse 60% 50% at 85% 15%, black 0%, transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-light/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary-light/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          {/* Left: pitch + CTA */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-primary-light">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-light" />
              CEFR Level Test
            </div>

            <h1 className="mt-4 font-sans text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              {test.name}
            </h1>

            {test.description && (
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                {test.description}
              </p>
            )}

            <p className="mt-6 max-w-lg text-sm font-semibold uppercase tracking-wide text-foreground/70">
              No level picking. Answer honestly — your CEFR level is calculated from
              the result.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-bold text-foreground">
              <span className="inline-flex items-center gap-2">
                <MedalIcon className="w-4 h-4 text-primary-light" />
                {questionCount} question{questionCount === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-primary-light" />
                Timer starts on Start
              </span>
            </div>

            <button
              onClick={startTest}
              disabled={navigating}
              className="mt-10 inline-flex items-center gap-2.5 rounded-xl bg-primary-light px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-primary-light/30 transition hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {navigating ? "Starting..." : "Start Test"}
              <ArrowRightIcon className="w-4 h-4" />
            </button>

            <p className="mt-3 text-xs text-muted">
              Results, and your certificate eligibility, are calculated the moment
              you submit.
            </p>
          </motion.div>

          {/* Right: the climb — signature CEFR ladder */}
          {levels.length > 0 && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl border border-foreground/10 bg-background/70 backdrop-blur-sm p-6 sm:p-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">
                  The Climb
                </p>
                <Image
                  src="/laurel.png"
                  alt=""
                  width={28}
                  height={24}
                  className="opacity-60"
                />
              </div>

              <div className="flex flex-col-reverse gap-2.5">
                {levels.map((level, i) => {
                  const isTop = i === levels.length - 1;
                  return (
                    <motion.div
                      key={level.code}
                      initial={reduceMotion ? false : { opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: reduceMotion ? 0 : 0.25 + i * 0.09,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-9 shrink-0 text-right text-xs font-extrabold tracking-wide text-foreground/80">
                        {level.code}
                      </span>
                      <div className="flex-1 h-8 rounded-md bg-foreground/[0.05] overflow-hidden">
                        <div
                          className={`h-full rounded-md flex items-center px-3 text-[11px] font-semibold truncate transition-colors ${
                            isTop
                              ? "bg-linear-to-r from-primary-light to-[#ffb648] text-white"
                              : "bg-primary-light/25 text-foreground/70"
                          }`}
                          style={{ width: `${rungWidth(i, levels.length)}%` }}
                        >
                          <span className="truncate">{level.name}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-light" />
                </span>
                Your starting point is unknown until you finish
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
