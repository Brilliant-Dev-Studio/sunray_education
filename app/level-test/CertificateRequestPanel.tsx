"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  submitCertificateRequest,
  type SubmitCertificateState,
} from "@/app/actions/certificate";
import { UploadIcon, CheckCircleIcon, ArrowLeftIcon } from "./icons";

type PaymentMethod = "UAB_PAY" | "KBZ_PAY" | "WAVE_MONEY";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; logo: string }[] = [
  { value: "UAB_PAY", label: "UAB Pay", logo: "/payments/uabpay.jpg" },
  { value: "KBZ_PAY", label: "KBZ Pay", logo: "/payments/kbzpay.png" },
  { value: "WAVE_MONEY", label: "Wave Money", logo: "/payments/wavepay.jpg" },
];

const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB

type Step = "form" | "submitting" | "done";

export default function CertificateRequestPanel({
  testId,
  levelCode,
  levelName,
  score,
  total,
  percentage,
  onBack,
}: {
  testId: string;
  levelCode: string;
  levelName: string;
  score: number;
  total: number;
  percentage: number;
  onBack: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [preview, setPreview] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Upload an image file (screenshot of your payment).");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("Image is too large. Max 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setInvoiceData(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      setError("Enter your email address.");
      return;
    }
    if (!method) {
      setError("Choose a payment method.");
      return;
    }
    if (!invoiceData) {
      setError("Upload your payment invoice screenshot.");
      return;
    }

    setError(null);
    setStep("submitting");

    const result: SubmitCertificateState = await submitCertificateRequest({
      testId,
      levelCode,
      levelName,
      score,
      total,
      percentage,
      contactEmail: email,
      paymentMethod: method,
      invoiceImage: invoiceData,
    });

    if (!result || "error" in result) {
      setError(result?.error ?? "Could not submit request. Try again.");
      setStep("form");
      return;
    }

    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <CheckCircleIcon className="w-10 h-10 text-emerald-600 mx-auto" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">Request submitted</h2>
        <p className="text-sm text-muted mt-2">
          Our admin will verify your payment and send your certificate to your email soon.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background hover:border-primary-light hover:text-primary-light px-6 py-3 text-sm font-semibold uppercase tracking-wide transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to results
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-md border border-foreground/20 bg-background hover:border-primary-light hover:text-primary-light px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wide transition"
      >
        <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        Back to results
      </button>

      <h2 className="mt-3 sm:mt-4 text-lg font-semibold text-foreground">Request Certificate</h2>
      <p className="text-sm text-muted mt-1">
        Fill in your details below. We&apos;ll email your certificate once your payment is
        verified.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="cert-email" className="block text-sm font-medium text-foreground mb-1.5">
            Email
          </label>
          <input
            id="cert-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-foreground/15 bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {PAYMENT_METHODS.map((pm) => (
              <button
                key={pm.value}
                type="button"
                onClick={() => setMethod(pm.value)}
                className={`flex flex-col items-center gap-1 rounded-lg border bg-background px-2 py-2 sm:py-3 text-xs font-medium transition ${
                  method === pm.value
                    ? "border-primary-light bg-primary/5"
                    : "border-foreground/15 hover:border-foreground/30"
                }`}
              >
                <span className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden bg-white border border-foreground/10">
                  <Image src={pm.logo} alt={pm.label} fill className="object-cover" />
                </span>
                <span className="text-foreground">{pm.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Invoice Screenshot
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-foreground/25 bg-background hover:border-primary-light/50 px-4 py-2.5 text-sm text-muted transition"
          >
            <UploadIcon className="w-4 h-4" />
            {preview ? "Change screenshot" : "Upload screenshot"}
          </button>
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Invoice preview"
              className="mt-2 max-h-40 w-full rounded-lg object-contain border border-foreground/10"
            />
          )}
        </div>

        {error && (
          <p className="text-sm text-primary-light bg-primary/10 border border-primary/30 rounded-lg px-3.5 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={step === "submitting"}
          className="w-full rounded-lg bg-primary-light hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm transition"
        >
          {step === "submitting" ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
