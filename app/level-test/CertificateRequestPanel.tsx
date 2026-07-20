"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  submitCertificateRequest,
  type SubmitCertificateState,
} from "@/app/actions/certificate";
import {
  getActivePaymentOptions,
  type PublicPaymentOption,
} from "@/app/actions/paymentOptions";
import { getCertificatePrice } from "@/app/actions/settings";
import { UploadIcon, CheckCircleIcon, ArrowLeftIcon, XCircleIcon } from "./icons";

type PaymentMethod = "UAB_PAY" | "KBZ_PAY" | "WAVE_MONEY";

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
  const [qrLightboxOpen, setQrLightboxOpen] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<PublicPaymentOption[] | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    getActivePaymentOptions().then((options) => {
      if (!cancelled) setPaymentOptions(options);
    });
    getCertificatePrice().then((p) => {
      if (!cancelled) setPrice(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedOption = paymentOptions?.find((p) => p.code === method);

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

      {price !== null && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-primary-light/30 bg-primary/5 px-4 py-3">
          <span className="text-sm text-foreground font-medium">Certificate Price</span>
          <span className="text-lg font-semibold text-primary-light">
            {price.toLocaleString()} MMK
          </span>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-foreground/15 bg-foreground/5 px-4 py-3 text-xs text-muted leading-relaxed">
        Certificates are delivered to your email after payment verification — please
        allow some processing time. Having an issue? Contact our support line at{" "}
        <a href="tel:09693016568" className="text-primary-light font-semibold hover:underline">
          09693016568
        </a>
        .
      </div>

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
          {paymentOptions === null ? (
            <div className="flex items-center gap-2 text-sm text-muted py-2">
              <div className="w-4 h-4 border-2 border-foreground/10 border-t-primary-light rounded-full animate-spin" />
              Loading payment methods...
            </div>
          ) : paymentOptions.length === 0 ? (
            <p className="text-sm text-muted">
              No payment methods are available right now. Contact support.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {paymentOptions.map((pm) => (
                <button
                  key={pm.code}
                  type="button"
                  onClick={() => setMethod(pm.code)}
                  className={`flex flex-col items-center gap-1 rounded-lg border bg-background px-2 py-2 sm:py-3 text-xs font-medium transition ${
                    method === pm.code
                      ? "border-primary-light bg-primary/5"
                      : "border-foreground/15 hover:border-foreground/30"
                  }`}
                >
                  <span className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden bg-white border border-foreground/10">
                    <Image src={pm.logoUrl} alt={pm.label} fill className="object-cover" />
                  </span>
                  <span className="text-foreground">{pm.label}</span>
                </button>
              ))}
            </div>
          )}

          {selectedOption && (
            <div className="mt-3 flex flex-col items-center rounded-lg border border-foreground/15 bg-background p-4">
              <p className="text-xs text-muted mb-2">
                Scan with {selectedOption.label} to pay
                {" · "}
                <span className="text-primary-light">tap to enlarge</span>
              </p>
              <button
                type="button"
                onClick={() => setQrLightboxOpen(true)}
                className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-md overflow-hidden border border-foreground/10 cursor-zoom-in transition hover:opacity-90"
              >
                <Image
                  src={selectedOption.qrUrl}
                  alt={`${selectedOption.label} QR code`}
                  fill
                  className="object-contain"
                />
              </button>
            </div>
          )}
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

      {qrLightboxOpen && selectedOption && (
        <div
          onClick={() => setQrLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
        >
          <button
            type="button"
            onClick={() => setQrLightboxOpen(false)}
            aria-label="Close"
            className="absolute top-5 right-5 text-white/80 hover:text-white transition"
          >
            <XCircleIcon className="w-8 h-8" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-white shadow-2xl"
          >
            <Image
              src={selectedOption.qrUrl}
              alt={`${selectedOption.label} QR code`}
              width={800}
              height={1200}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
