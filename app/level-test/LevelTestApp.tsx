"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon, ArrowRightIcon, ArrowLeftIcon, SparkleIcon, MedalIcon } from "./icons";

type LevelSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  questionCount: number;
};

type TestSummary = {
  id: string;
  name: string;
  description: string | null;
};

type Stage = "pick" | "ready";

export default function LevelTestApp({
  test,
  levels,
}: {
  test: TestSummary;
  levels: LevelSummary[];
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("pick");
  const [selectedLevel, setSelectedLevel] = useState<LevelSummary | null>(null);
  const [navigating, setNavigating] = useState(false);

  function pickLevel(level: LevelSummary) {
    setSelectedLevel(level);
    setStage("ready");
  }

  function restart() {
    setStage("pick");
    setSelectedLevel(null);
  }

  function startTest() {
    if (!selectedLevel || navigating) return;
    setNavigating(true);
    router.push(`/level-test/${test.id}/${selectedLevel.id}`);
  }

  return (
    <div className="min-h-svh w-full bg-linear-to-b from-red-50/60 via-amber-50/30 to-background dark:from-primary-light/10 dark:via-background dark:to-background">
    <div className="flex flex-col sm:min-h-svh sm:justify-center mx-auto max-w-5xl px-6 py-6 sm:px-12 sm:py-14">
      <AnimatePresence mode="wait">
        {stage === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <p className="text-sm font-bold tracking-wide text-primary-light">
                CEFR LEVEL TEST
              </p>
              <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                {test.name}
              </h1>
              {test.description && (
                <p className="mt-3 max-w-xl mx-auto text-base leading-relaxed text-muted">
                  {test.description}
                </p>
              )}
              <p className="text-sm font-semibold uppercase tracking-wide text-muted mt-3">
                Pick a level to start practicing
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {levels.map((level) => (
                <div
                  key={level.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-32 w-full overflow-hidden bg-linear-to-br from-primary-light/20 via-primary-light/10 to-transparent flex items-center justify-center">
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "radial-gradient(currentColor 1px, transparent 1px)",
                        backgroundSize: "16px 16px",
                        color: "var(--primary-light)",
                        maskImage:
                          "radial-gradient(ellipse at center, black 0%, transparent 75%)",
                      }}
                    />
                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary-light/25 blur-2xl" />
                    <div className="absolute -bottom-10 -left-6 w-24 h-24 rounded-full bg-primary-light/20 blur-2xl" />

                    <SparkleIcon className="absolute top-4 left-5 w-4 h-4 text-primary-light/50 rotate-12" />
                    <MedalIcon className="absolute bottom-4 right-5 w-6 h-6 text-primary-light/30" />

                    <Image
                      src="/laurel.png"
                      alt=""
                      width={140}
                      height={121}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-auto opacity-70"
                    />
                    <span className="relative font-sans text-5xl font-extrabold tracking-tight text-primary-light/30 drop-shadow-sm [text-shadow:0_1px_0_rgba(255,255,255,0.4)]">
                      {level.code}
                    </span>

                    <span className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-background/95 backdrop-blur px-3 py-1 text-xs font-semibold text-primary-light shadow-sm ring-1 ring-primary-light/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                      {level.questionCount} question{level.questionCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="font-bold text-foreground">
                      {level.code} · {level.name}
                    </p>
                    {level.description && (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-2">
                        {level.description}
                      </p>
                    )}

                    <button
                      onClick={() => pickLevel(level)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-light hover:opacity-90 text-white font-bold uppercase tracking-wide text-sm py-2.5 transition"
                    >
                      Start {level.code} Test
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {stage === "ready" && selectedLevel && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-xl mx-auto"
          >
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-light">
              Level Selected
            </p>

            <div className="relative inline-flex items-center justify-center mt-4 sm:mt-5">
              <Image
                src="/laurel.png"
                alt=""
                width={200}
                height={173}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-44 h-auto opacity-90 drop-shadow-sm"
              />
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.5, 1.9] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-primary-light/40"
              />
              <motion.span
                initial={{ scale: 0.6, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.05 }}
                className="relative flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-primary-light to-primary-light/70 text-white font-extrabold text-xl sm:text-3xl shadow-xl shadow-primary-light/30"
              >
                {selectedLevel.code}
              </motion.span>
            </div>

            <h2 className="mt-4 sm:mt-5 font-sans text-2xl sm:text-4xl font-bold leading-tight text-foreground">
              {selectedLevel.name}
            </h2>
            {selectedLevel.description && (
              <p className="mt-2 sm:mt-3 max-w-md mx-auto text-sm sm:text-base leading-relaxed text-muted">
                {selectedLevel.description}
              </p>
            )}

            <hr className="mx-auto mt-4 sm:mt-5 w-16 border-t-2 border-primary-light" />

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-4 sm:mt-5 text-sm font-semibold text-foreground">
              <span className="inline-flex items-center gap-2">
                <MedalIcon className="w-4 h-4 text-primary-light" />
                {selectedLevel.questionCount} question
                {selectedLevel.questionCount === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-primary-light" />
                Timer starts on Start
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6 sm:mt-7">
              <button
                onClick={restart}
                className="inline-flex items-center gap-1.5 rounded-md border border-foreground/20 text-muted hover:text-foreground hover:border-foreground/40 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wide transition"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Change level
              </button>
              <button
                onClick={startTest}
                disabled={navigating}
                className="inline-flex items-center gap-2 rounded-md bg-primary-light hover:opacity-90 active:scale-95 disabled:opacity-70 text-white font-bold uppercase tracking-wide px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm shadow-lg shadow-primary-light/30 transition"
              >
                {navigating ? "Starting..." : "Start"}
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
