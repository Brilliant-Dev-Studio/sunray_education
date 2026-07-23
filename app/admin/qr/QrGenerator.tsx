"use client";

import { useEffect, useRef, useState } from "react";
import type QRCodeStylingType from "qr-code-styling";
import ColorPicker from "./ColorPicker";
import { contrastRatio, MIN_SCANNABLE_CONTRAST } from "./contrast";

type DotType = "square" | "dots" | "rounded" | "classy" | "classy-rounded" | "extra-rounded";

const DOT_TYPES: { value: DotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rounded" },
  { value: "extra-rounded", label: "Extra Rounded" },
];

export default function QrGenerator({
  verifyUrl,
  code,
  title,
  subtitle,
  fileNamePrefix = "verify",
}: {
  verifyUrl: string;
  code: string;
  title: string;
  subtitle?: string;
  fileNamePrefix?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStylingType | null>(null);

  const [fgColor, setFgColor] = useState("#ef3444");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dotType, setDotType] = useState<DotType>("rounded");
  const [showLogo, setShowLogo] = useState(true);
  const [generating, setGenerating] = useState(false);

  const contrast = contrastRatio(fgColor, bgColor);
  const lowContrast = contrast < MIN_SCANNABLE_CONTRAST;

  useEffect(() => {
    let cancelled = false;

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled || !containerRef.current) return;
      const qr = new QRCodeStyling({
        width: 400,
        height: 400,
        data: verifyUrl,
        margin: 12,
        image: showLogo ? "/letterLogo.png" : undefined,
        imageOptions: { crossOrigin: "anonymous", margin: 8, imageSize: 0.35 },
        dotsOptions: { color: fgColor, type: dotType },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { color: fgColor, type: "extra-rounded" },
        cornersDotOptions: { color: fgColor, type: "dot" },
      });
      containerRef.current.innerHTML = "";
      qr.append(containerRef.current);
      qrRef.current = qr;
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyUrl]);

  useEffect(() => {
    qrRef.current?.update({
      image: showLogo ? "/letterLogo.png" : undefined,
      imageOptions: { crossOrigin: "anonymous", margin: 8, imageSize: 0.35 },
      dotsOptions: { color: fgColor, type: dotType },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: fgColor, type: "extra-rounded" },
      cornersDotOptions: { color: fgColor, type: "dot" },
    });
  }, [fgColor, bgColor, dotType, showLogo]);

  async function downloadPdf() {
    if (!qrRef.current) return;
    setGenerating(true);
    try {
      const blob = (await qrRef.current.getRawData("png")) as Blob | null;
      if (!blob) return;

      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: [90, 110] });

      doc.setFillColor(bgColor);
      doc.rect(0, 0, 90, 110, "F");
      doc.addImage(dataUrl, "PNG", 15, 12, 60, 60);

      let y = 82;
      doc.setFontSize(11);
      doc.setTextColor(26, 32, 37);
      doc.text(title, 45, y, { align: "center" });
      y += 6;

      if (subtitle) {
        doc.setFontSize(8);
        doc.setTextColor(107, 111, 117);
        doc.text(subtitle, 45, y, { align: "center" });
        y += 6;
      }

      doc.setFontSize(9);
      doc.setTextColor(107, 111, 117);
      doc.text(code, 45, y, { align: "center" });
      y += 8;

      doc.setFontSize(7);
      doc.text("Scan to verify at sunraymyanmar.com", 45, y, { align: "center" });

      doc.save(`${fileNamePrefix}-${code}.pdf`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start">
      <div className="order-2 lg:order-1 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[#1a2025] mb-4">Customize</h2>
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker label="QR Color" value={fgColor} onChange={setFgColor} />
            <ColorPicker label="Background" value={bgColor} onChange={setBgColor} />
          </div>
          {lowContrast && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-800">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0 mt-0.5">
                <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a1.5 1.5 0 0 0 1.3 2.3h17.8a1.5 1.5 0 0 0 1.3-2.3L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                Low contrast ({contrast.toFixed(1)}:1) — scanners may struggle to
                read this QR. Pick colors with more contrast between them.
              </span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Pattern Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DOT_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setDotType(t.value)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  dotType === t.value
                    ? "border-[#ef3444] bg-red-50 text-[#ef3444]"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={showLogo}
            onChange={(e) => setShowLogo(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-[#ef3444]"
          />
          Show Sunray logo in center
        </label>

        <button
          onClick={downloadPdf}
          disabled={generating}
          className="w-full lg:w-auto rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] disabled:opacity-60 text-white font-semibold px-8 py-3.5 text-sm transition"
        >
          {generating ? "Preparing PDF..." : "Download PDF"}
        </button>
      </div>

      <div className="order-1 lg:order-2 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-8 mx-auto lg:mx-0">
        <div ref={containerRef} className="rounded-xl overflow-hidden shadow-md" />
        <p className="mt-4 text-sm font-mono text-gray-500 tracking-wide">{code}</p>
      </div>
    </div>
  );
}
