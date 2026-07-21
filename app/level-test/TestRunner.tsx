"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllTestQuestions,
  getAnswerKey,
  submitLevelTestAttempt,
  type PublicQuestion,
  type SubmitLevelTestResult,
} from "@/app/actions/level-test";
import {
  ClockIcon,
  TrophyIcon,
  StarIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  FlameIcon,
  AwardIcon,
} from "./icons";
import CertificateRequestPanel from "./CertificateRequestPanel";
import ShareResultButton from "./ShareResultButton";
import Confetti from "./Confetti";

type TestSummary = {
  id: string;
  name: string;
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Stage = "loading" | "quiz" | "submitting" | "result" | "certificate";

const CERTIFICATE_ELIGIBLE_PERCENTAGE = 40;

export default function TestRunner({
  test,
  questionCount,
}: {
  test: TestSummary;
  questionCount: number;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<SubmitLevelTestResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [ineligibleMsg, setIneligibleMsg] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getAllTestQuestions(test.id)
      .then((qs) => {
        if (cancelled) return;
        if (qs.length === 0) {
          setErrorMsg("This test has no questions yet.");
          setStage("result");
          return;
        }
        setQuestions(qs);
        setAnswers({});
        setCurrentIndex(0);
        setStage("quiz");
      })
      .catch(() => {
        if (cancelled) return;
        setErrorMsg("Could not load questions. Please try again.");
        setStage("result");
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, test.id]);

  useEffect(() => {
    if (stage !== "quiz") return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, startedAt]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswered = currentQuestion ? Boolean(answers[currentQuestion.id]) : false;

  function selectAnswer(optionId: string) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  }

  async function autofillCorrectAnswers() {
    const key = await getAnswerKey(test.id);
    if (!key) return;
    setAnswers(key);
    setCurrentIndex(questions.length - 1);
  }

  function goNext() {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  useEffect(() => {
    if (stage !== "quiz" || !currentQuestion) return;

    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      const option = currentQuestion!.options.find((o) => o.label === key);
      if (option) {
        e.preventDefault();
        selectAnswer(option.id);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (isLastQuestion) {
          if (answeredCount === questions.length) submit();
        } else if (currentAnswered) {
          goNext();
        }
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, currentQuestion, currentAnswered, isLastQuestion, answeredCount]);

  async function submit() {
    setStage("submitting");
    const timeTakenSeconds = Math.floor((Date.now() - startedAt) / 1000);
    const res = await submitLevelTestAttempt({
      testId: test.id,
      timeTakenSeconds,
      answers: Object.entries(answers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      })),
    });
    setResult(res);
    setStage("result");
  }

  function retrySameLevel() {
    setResult(null);
    setErrorMsg(null);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setStage("loading");
    setStartedAt(Date.now());
    setElapsed(0);
    setAttempt((a) => a + 1);
  }

  function backToLevels() {
    router.push("/level-test");
  }

  function openCertificateFlow() {
    if (!result || "error" in result) return;
    if (result.percentage < CERTIFICATE_ELIGIBLE_PERCENTAGE) {
      setIneligibleMsg(true);
      return;
    }
    setIneligibleMsg(false);
    setStage("certificate");
  }

  const stars = useMemo(() => {
    if (!result || "error" in result) return 0;
    if (result.percentage >= 90) return 3;
    if (result.percentage >= 70) return 2;
    if (result.percentage >= 40) return 1;
    return 0;
  }, [result]);

  const isSuccess = stage === "result" && Boolean(result) && !(result && "error" in result);

  return (
    <div className="relative sm:min-h-svh w-full overflow-x-hidden bg-background">
      <Image
        src="/HeroImages/photo4.avif"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isSuccess
            ? "bg-linear-to-b from-emerald-50/95 via-amber-50/85 to-background/95 dark:from-emerald-950/90 dark:via-amber-950/85 dark:to-background/95"
            : "bg-linear-to-b from-red-50/95 via-amber-50/85 to-background/95 dark:from-primary-light/20 dark:via-background/90 dark:to-background/95"
        }`}
      />
      {isSuccess && <Confetti />}
    <div
      className={`relative flex flex-col sm:justify-center mx-auto max-w-5xl px-4 pt-20 pb-8 sm:px-12 ${
        stage === "result"
          ? "sm:h-svh sm:overflow-y-auto sm:pt-24 sm:pb-6"
          : "sm:min-h-svh sm:py-14"
      }`}
    >
      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-24"
          >
            <div className="inline-block w-10 h-10 border-4 border-foreground/10 border-t-primary-light rounded-full animate-spin" />
            <p className="text-muted mt-4 text-sm">
              Loading {questionCount} question{questionCount === 1 ? "" : "s"}...
            </p>
          </motion.div>
        )}

        {stage === "quiz" && currentQuestion && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="max-w-3xl mx-auto w-full"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-5">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted">
                <FlameIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-light" />
                Question {currentIndex + 1} / {questions.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={autofillCorrectAnswers}
                  className="rounded-full border border-dashed border-primary-light/50 text-primary-light px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide hover:bg-primary-light/10 transition"
                >
                  Autofill
                </button>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground bg-foreground/5 rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5">
                  <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {formatTime(elapsed)}
                </div>
              </div>
            </div>

            <div className="w-full h-1.5 sm:h-2.5 rounded-full bg-foreground/10 overflow-hidden mb-4 sm:mb-8">
              <motion.div
                className="h-full bg-primary-light"
                initial={false}
                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="rounded-2xl sm:rounded-3xl border-t-4 border-primary-light bg-background p-4 sm:p-10 shadow-xl">
              <p className="text-base sm:text-2xl font-semibold leading-snug text-foreground mb-4 sm:mb-8">
                {currentQuestion.text}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => selectAnswer(option.id)}
                      className={`flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border-2 px-3.5 sm:px-5 py-2.5 sm:py-4 text-left transition active:scale-[0.98] ${
                        isSelected
                          ? "border-primary-light bg-primary/10 shadow-md shadow-primary-light/10"
                          : "border-foreground/10 bg-background hover:border-foreground/25 hover:-translate-y-0.5"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-bold shrink-0 transition ${
                          isSelected
                            ? "bg-primary-light text-white"
                            : "bg-foreground/10 text-muted"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="text-sm sm:text-base text-foreground leading-snug">
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="hidden sm:block mt-6 text-xs text-muted">
                Tip: press <span className="font-semibold text-foreground">A–D</span> to
                answer, <span className="font-semibold text-foreground">→</span> to continue
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 sm:mt-8">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 rounded-md border border-foreground/20 text-muted disabled:opacity-30 disabled:cursor-not-allowed hover:text-foreground px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wide transition"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Previous
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-muted">
                <span className="text-foreground">{answeredCount}</span>
                <span>/</span>
                <span>{questions.length}</span>
                <span className="ml-1">answered</span>
              </div>

              {isLastQuestion ? (
                <button
                  onClick={submit}
                  disabled={answeredCount !== questions.length}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary-light hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wide px-5 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm shadow-lg shadow-primary-light/25 transition"
                >
                  Submit
                  <TrophyIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={goNext}
                  disabled={!currentAnswered}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary-light hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wide px-5 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm shadow-lg shadow-primary-light/25 transition"
                >
                  Next
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {stage === "submitting" && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-24"
          >
            <div className="inline-block w-10 h-10 border-4 border-foreground/10 border-t-primary-light rounded-full animate-spin" />
            <p className="text-muted mt-4 text-sm">Grading your answers...</p>
          </motion.div>
        )}

        {stage === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-2xl mx-auto"
          >
            <div
              className={`absolute -top-8 -left-8 sm:-top-12 sm:-left-12 w-32 h-32 sm:w-52 sm:h-52 rounded-full blur-3xl ${
                isSuccess ? "bg-emerald-400/20" : "bg-primary-light/15"
              }`}
            />
            <div
              className={`absolute -bottom-8 -right-8 sm:-bottom-12 sm:-right-12 w-32 h-32 sm:w-52 sm:h-52 rounded-full blur-3xl ${
                isSuccess ? "bg-amber-300/25" : "bg-primary-light/15"
              }`}
            />
            <div className="relative text-center rounded-3xl border border-foreground/10 bg-background p-6 sm:p-8 shadow-xl">
              {errorMsg || !result || "error" in result ? (
                <>
                  <p className="text-primary-light font-medium">
                    {errorMsg || (result && "error" in result ? result.error : "Something went wrong.")}
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <button
                      onClick={backToLevels}
                      className="inline-flex items-center gap-1.5 rounded-md border border-foreground/20 text-muted hover:text-foreground px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      Back to Start
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-primary-light"
                  >
                    Test Complete
                  </motion.p>

                  <div className="relative inline-flex items-center justify-center mt-3 sm:mt-3">
                    <motion.span
                      initial={{ opacity: 0.6, scale: 0.8 }}
                      animate={{ opacity: [0.5, 0, 0.5], scale: [0.9, 1.5, 0.9] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-primary-light/40 blur-sm"
                    />
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
                      className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-primary-light to-primary-light/70 text-white shadow-xl shadow-primary-light/40 mx-auto"
                    >
                      <TrophyIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-3 sm:mt-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.15 }}
                      >
                        <StarIcon
                          className={`w-6 h-6 sm:w-7 sm:h-7 ${
                            i < stars ? "text-primary-light" : "text-foreground/15"
                          }`}
                          filled={i < stars}
                        />
                      </motion.span>
                    ))}
                  </div>

                  <h2 className="mt-3 sm:mt-3 font-sans text-2xl sm:text-3xl font-bold text-foreground">
                    {result.score} / {result.total} correct
                  </h2>
                  <p className="text-muted text-base sm:text-base mt-1 sm:mt-1">{result.percentage}% score</p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.25 }}
                    className="inline-flex items-center gap-3 sm:gap-3 mt-4 sm:mt-4 rounded-2xl bg-linear-to-br from-primary-light to-primary px-6 sm:px-6 py-3.5 sm:py-3 shadow-lg shadow-primary-light/30"
                  >
                    <span className="text-3xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {result.level.code}
                    </span>
                    <span className="h-8 sm:h-8 w-px bg-white/30" />
                    <span className="text-left">
                      <span className="block text-[10px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                        Your Level
                      </span>
                      <span className="block text-sm sm:text-sm font-bold text-white">
                        {result.level.name}
                      </span>
                    </span>
                  </motion.div>

                  <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-3 text-sm sm:text-sm text-muted">
                    <ClockIcon className="w-4 h-4 sm:w-4 sm:h-4" />
                    {formatTime(result.timeTakenSeconds)}
                  </div>

                  {result.level.description && (
                    <p className="text-sm sm:text-sm text-muted mt-3 sm:mt-3 max-w-lg mx-auto line-clamp-2 sm:line-clamp-none">
                      {result.level.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-2.5 mt-5 sm:mt-5">
                    <button
                      onClick={retrySameLevel}
                      className="inline-flex items-center gap-1.5 rounded-md border border-foreground/20 text-muted hover:text-foreground px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wide transition"
                    >
                      Retry test
                    </button>
                    <button
                      onClick={backToLevels}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary-light hover:opacity-90 text-white font-bold uppercase tracking-wide px-5 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm transition"
                    >
                      Back to Start
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                    <ShareResultButton
                      score={result.score}
                      total={result.total}
                      percentage={result.percentage}
                      levelCode={result.level.code}
                      testName={test.name}
                    />
                  </div>

                  <button
                    onClick={openCertificateFlow}
                    className="mt-5 sm:mt-5 inline-flex items-center gap-2 rounded-md bg-primary-light hover:opacity-90 active:scale-95 text-white font-bold uppercase tracking-wide px-5 sm:px-7 py-2.5 sm:py-2.5 text-sm sm:text-base shadow-lg shadow-primary-light/30 transition"
                  >
                    <AwardIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    Get Certificate
                  </button>

                  {ineligibleMsg && (
                    <p className="mt-3 text-sm text-primary-light bg-primary/10 border border-primary/30 rounded-lg px-4 py-2.5 max-w-sm mx-auto">
                      You need at least {CERTIFICATE_ELIGIBLE_PERCENTAGE}% to request a
                      certificate. Retry this level to try again.
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}

        {stage === "certificate" && result && !("error" in result) && (
          <motion.div
            key="certificate"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="max-w-2xl mx-auto w-full"
          >
            <CertificateRequestPanel
              testId={test.id}
              levelCode={result.level.code}
              levelName={result.level.name}
              score={result.score}
              total={result.total}
              percentage={result.percentage}
              onBack={() => setStage("result")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
