"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  verifyCertificateCode,
  type VerifyCertificateResult,
} from "@/app/actions/verify-certificate";
import {
  UploadIcon,
  CameraIcon,
  QrIcon,
  XCircleIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from "@/app/level-test/icons";
import Confetti from "@/app/level-test/Confetti";
import { decodeQrFromImageElement } from "./decodeQr";

type Mode = "picker" | "camera";

function SecuritySeal({ tone = "gold" }: { tone?: "gold" | "red" }) {
  const reduceMotion = useReducedMotion();
  const ring = tone === "gold" ? "#c9962b" : "#ef3444";

  return (
    <div className="relative inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
      <span
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${ring}`,
          boxShadow: `0 0 0 4px ${ring}22, 0 8px 24px -6px ${ring}55`,
        }}
      />
      <div className="relative inline-flex items-center justify-center w-[82%] h-[82%] rounded-full bg-linear-to-br from-primary-light to-primary text-white overflow-hidden shadow-inner">
        <Image
          src="/laurel.png"
          alt=""
          width={140}
          height={121}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-auto opacity-40"
        />
        <ShieldCheckIcon className="relative w-9 h-9 sm:w-10 sm:h-10" />
        {!reduceMotion && (
          <motion.span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
}

export default function VerifyCertificateClient({
  initialResult,
}: {
  initialResult?: VerifyCertificateResult;
}) {
  const [mode, setMode] = useState<Mode>("picker");
  const [result, setResult] = useState<VerifyCertificateResult | null>(initialResult ?? null);
  const [loading, setLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  function stopCamera() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  useEffect(() => stopCamera, []);

  async function runVerify(raw: string) {
    setLoading(true);
    setScanError(null);
    try {
      const res = await verifyCertificateCode(raw);
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  async function handleFile(file: File) {
    setScanError(null);

    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const img = new window.Image();
    img.onload = () => {
      const data = decodeQrFromImageElement(img);
      if (data) {
        runVerify(data);
      } else {
        setScanError("No QR code found in that image. Try another photo.");
      }
    };
    img.onerror = () => {
      setScanError("Could not read that file. Try another photo.");
    };
    img.src = dataUrl;
  }

  async function startCamera() {
    setScanError(null);
    setMode("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const { default: jsQR } = await import("jsqr");
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      const tick = () => {
        if (!streamRef.current) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
          const scale = Math.min(1, 900 / Math.max(video.videoWidth, video.videoHeight));
          canvas.width = Math.round(video.videoWidth * scale);
          canvas.height = Math.round(video.videoHeight * scale);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });
          if (code?.data) {
            stopCamera();
            setMode("picker");
            runVerify(code.data);
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setScanError("Could not access camera. Check browser permissions, or upload a photo instead.");
      setMode("picker");
    }
  }

  function cancelCamera() {
    stopCamera();
    setMode("picker");
  }

  function reset() {
    setResult(null);
    setScanError(null);
    setManualCode("");
  }

  return (
    <div className="max-w-lg mx-auto py-10 sm:py-14">
      {result?.valid && (
        <div className="fixed inset-0 z-10 pointer-events-none">
          <Confetti />
        </div>
      )}
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center"
          >
            <div
              className={`absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl -z-10 ${
                result.valid ? "bg-emerald-400/20" : "bg-primary-light/15"
              }`}
            />

            {result.valid ? (
              <>
                <SecuritySeal tone="gold" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">
                  Authentic
                </p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-foreground">
                  {result.kind === "certificate" ? "Certificate Verified" : "Authenticity Verified"}
                </h2>

                <div className="mt-7 text-left rounded-2xl border border-foreground/10 bg-background shadow-lg overflow-hidden">
                  <div className="h-1.5 bg-linear-to-r from-primary-light via-[#c9962b] to-primary-light" />
                  <div className="p-6 space-y-3.5">
                    {result.kind === "certificate" ? (
                      <>
                        <Row label="Name" value={result.studentName} />
                        <Row label="Test" value={result.testName} />
                        <Row label="Level" value={`${result.levelCode} · ${result.levelName}`} />
                        <Row label="Score" value={`${result.percentage}%`} />
                      </>
                    ) : (
                      <>
                        <Row label="Name" value={result.studentName} />
                        <Row label="Roll No." value={result.rollNumber} />
                        <Row label="National ID" value={result.nationalId} />
                        <Row label="Course" value={result.courseTitle} />
                        <Row label="Batch" value={result.batch} />
                      </>
                    )}
                    <Row
                      label="Issued"
                      value={new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                        new Date(result.issuedAt)
                      )}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-primary-light"
                >
                  <XCircleIcon className="w-10 h-10" />
                </motion.div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-primary-light">
                  Verification Failed
                </p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-foreground">
                  Not Recognized
                </h2>
                <p className="mt-2.5 text-sm text-muted max-w-xs mx-auto">
                  This code doesn&apos;t match any issued Sunray Myanmar certificate or
                  authenticity record.
                </p>
              </>
            )}

            <button
              onClick={reset}
              className="mt-8 inline-flex items-center gap-1.5 rounded-md border border-foreground/20 text-muted hover:text-foreground hover:border-foreground/40 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Verify another
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="picker"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center mb-9">
              <SecuritySeal />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-primary-light">
                Certificate Verification
              </p>
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Scan or upload the QR code
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-muted">
                Found on a Sunray Myanmar certificate or student ID card
              </p>
            </div>

            <div className="rounded-3xl border border-foreground/10 bg-background/70 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="h-1 bg-linear-to-r from-transparent via-primary-light to-transparent" />
              <div className="p-5 sm:p-7">
                {mode === "camera" ? (
                  <div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-black">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-8 border-2 border-white/70 rounded-xl" />
                      <motion.div
                        className="absolute left-8 right-8 h-0.5 bg-primary-light shadow-[0_0_12px_2px_rgba(255,59,69,0.7)]"
                        initial={{ top: "8%" }}
                        animate={{ top: ["8%", "92%", "8%"] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <button
                      onClick={cancelCamera}
                      className="mt-4 w-full rounded-lg border border-foreground/20 text-muted hover:text-foreground px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFile(file);
                          e.target.value = "";
                        }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="group flex flex-col items-center gap-2.5 rounded-2xl bg-primary-light hover:opacity-90 disabled:opacity-60 text-white px-5 py-6 shadow-lg shadow-primary-light/25 transition"
                      >
                        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white/15 group-hover:scale-105 transition-transform">
                          <UploadIcon className="w-5 h-5" />
                        </span>
                        <span className="font-bold uppercase tracking-wide text-sm">
                          Upload Photo
                        </span>
                      </button>
                      <button
                        onClick={startCamera}
                        disabled={loading}
                        className="group flex flex-col items-center gap-2.5 rounded-2xl border-2 border-foreground/15 hover:border-primary-light text-foreground disabled:opacity-60 px-5 py-6 transition"
                      >
                        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-foreground/5 group-hover:scale-105 transition-transform">
                          <CameraIcon className="w-5 h-5" />
                        </span>
                        <span className="font-bold uppercase tracking-wide text-sm">
                          Scan Camera
                        </span>
                      </button>
                    </div>

                    {scanError && (
                      <p className="text-sm text-primary-light bg-primary/10 border border-primary/30 rounded-lg px-3.5 py-2.5">
                        {scanError}
                      </p>
                    )}

                    <div className="flex items-center gap-3 py-1">
                      <span className="h-px flex-1 bg-foreground/10" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                        or enter code
                      </span>
                      <span className="h-px flex-1 bg-foreground/10" />
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (manualCode.trim()) runVerify(manualCode.trim());
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="relative flex-1">
                        <QrIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value)}
                          placeholder="SR-XXXXXXXX"
                          className="w-full rounded-lg border border-foreground/15 bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !manualCode.trim()}
                        className="rounded-lg bg-foreground text-background hover:opacity-90 disabled:opacity-40 font-semibold px-5 py-2.5 text-sm transition"
                      >
                        {loading ? "..." : "Verify"}
                      </button>
                    </form>
                  </div>
                )}

                {loading && mode === "picker" && (
                  <p className="text-center text-sm text-muted mt-4">Verifying...</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
