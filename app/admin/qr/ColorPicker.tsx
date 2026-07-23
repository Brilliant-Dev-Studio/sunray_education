"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
  }
}

const PRESETS = [
  "#ef3444",
  "#1a2025",
  "#ffffff",
  "#c9962b",
  "#0f766e",
  "#1d4ed8",
  "#7c3aed",
  "#db2777",
  "#16a34a",
  "#ea580c",
];

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function normalizeHex(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toLowerCase();
  }
  return `#${h}`.toLowerCase();
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const full = normalizeHex(hex);
  const r = parseInt(full.slice(1, 3), 16) / 255;
  const g = parseInt(full.slice(3, 5), 16) / 255;
  const b = parseInt(full.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return { h, s: s * 100, v: v * 100 };
}

function hsvToHex(h: number, s: number, v: number): string {
  const sat = s / 100;
  const val = v / 100;
  const c = val * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = val - c;

  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const containerRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function apply(next: { h: number; s: number; v: number }) {
    setHsv(next);
    const hex = hsvToHex(next.h, next.s, next.v);
    setHexInput(hex);
    onChange(hex);
  }

  function commitHex(raw: string) {
    const candidate = raw.startsWith("#") ? raw : `#${raw}`;
    if (HEX_RE.test(candidate)) {
      onChange(candidate);
      setHexInput(candidate);
      setHsv(hexToHsv(candidate));
    }
  }

  function pickFromPreset(preset: string) {
    onChange(preset);
    setHexInput(preset);
    setHsv(hexToHsv(preset));
  }

  async function pickWithEyedropper() {
    if (!window.EyeDropper) return;
    try {
      const result = await new window.EyeDropper().open();
      commitHex(result.sRGBHex);
    } catch {
      // user cancelled the eyedropper — ignore
    }
  }

  function handleSvPointer(e: React.PointerEvent<HTMLDivElement>) {
    const el = svRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);

    function update(clientX: number, clientY: number) {
      const rect = el!.getBoundingClientRect();
      const s = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
      const v = clamp(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100);
      apply({ h: hsv.h, s, v });
    }

    update(e.clientX, e.clientY);

    function onMove(ev: PointerEvent) {
      update(ev.clientX, ev.clientY);
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function handleHuePointer(e: React.PointerEvent<HTMLDivElement>) {
    const el = hueRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);

    function update(clientX: number) {
      const rect = el!.getBoundingClientRect();
      const h = clamp(((clientX - rect.left) / rect.width) * 360, 0, 360);
      apply({ h, s: hsv.s, v: hsv.v });
    }

    update(e.clientX);

    function onMove(ev: PointerEvent) {
      update(ev.clientX);
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const hueColor = hsvToHex(hsv.h, 100, 100);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 rounded-lg border border-gray-300 px-3 py-2.5 text-sm hover:border-gray-400 transition"
      >
        <span
          className="w-6 h-6 rounded-md border border-gray-200 shrink-0"
          style={{ backgroundColor: value }}
        />
        <span className="font-mono text-gray-600 uppercase">{value}</span>
      </button>

      {open && (
        <div className="absolute z-20 top-full mt-2 left-0 w-64 rounded-xl border border-gray-200 bg-white shadow-xl p-4">
          <div
            ref={svRef}
            onPointerDown={handleSvPointer}
            className="relative w-full h-36 rounded-lg cursor-crosshair touch-none"
            style={{
              backgroundColor: hueColor,
              backgroundImage:
                "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
            }}
          >
            <span
              className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow -translate-x-1/2 translate-y-1/2 pointer-events-none"
              style={{
                left: `${hsv.s}%`,
                bottom: `${hsv.v}%`,
                backgroundColor: value,
              }}
            />
          </div>

          <div
            ref={hueRef}
            onPointerDown={handleHuePointer}
            className="relative w-full h-3 rounded-full mt-3 cursor-pointer touch-none"
            style={{
              background:
                "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
            }}
          >
            <span
              className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: hueColor }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2 my-3">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => pickFromPreset(preset)}
                title={preset}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  value.toLowerCase() === preset.toLowerCase()
                    ? "border-[#ef3444] scale-110"
                    : "border-gray-200 hover:scale-105"
                }`}
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-9 h-9 rounded-lg border border-gray-200 shrink-0"
              style={{ backgroundColor: HEX_RE.test(hexInput) ? hexInput : "transparent" }}
            />
            <input
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={(e) => commitHex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitHex(hexInput);
              }}
              placeholder="#RRGGBB"
              className="flex-1 min-w-0 rounded-lg border border-gray-300 px-2.5 py-2 text-sm font-mono uppercase outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444]"
            />
            {typeof window !== "undefined" && window.EyeDropper && (
              <button
                type="button"
                onClick={pickWithEyedropper}
                title="Pick color from screen"
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:border-[#ef3444] hover:text-[#ef3444] transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                  <path d="m19.5 4.5-3-3-3.5 3.5 3 3 3.5-3.5Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m16 8-8.5 8.5-4 1.5 1.5-4L13.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
