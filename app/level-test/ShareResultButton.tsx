"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShareIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsAppIcon,
  TelegramIcon,
  LinkIcon,
  CheckCircleIcon,
} from "./icons";

export default function ShareResultButton({
  score,
  total,
  percentage,
  levelCode,
  testName,
}: {
  score: number;
  total: number;
  percentage: number;
  levelCode: string;
  testName: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/level-test` : "";
  const shareText = `I scored ${score}/${total} (${percentage}%) at level ${levelCode} on the ${testName}! Test your English level too:`;

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "My CEFR Level Test Result", text: shareText, url: shareUrl });
      } catch {
        // user cancelled, ignore
      }
      return;
    }
    setOpen((v) => !v);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable, ignore
    }
  }

  const links = [
    {
      label: "Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      bg: "bg-[#1877F2]",
    },
    {
      label: "X",
      icon: TwitterIcon,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      bg: "bg-black",
    },
    {
      label: "WhatsApp",
      icon: WhatsAppIcon,
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      bg: "bg-[#25D366]",
    },
    {
      label: "Telegram",
      icon: TelegramIcon,
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      bg: "bg-[#26A5E4]",
    },
  ];

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-1.5 rounded-md border border-foreground/20 text-foreground hover:border-primary-light hover:text-primary-light px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wide transition"
      >
        <ShareIcon className="w-4 h-4" />
        Share
      </button>

      {open && (
        <div className="absolute z-20 top-full mt-2 left-1/2 -translate-x-1/2 w-64 rounded-2xl border border-foreground/10 bg-background shadow-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3 text-center">
            Share your result
          </p>
          <div className="grid grid-cols-4 gap-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group"
              >
                <span
                  className={`flex items-center justify-center w-11 h-11 rounded-full text-white ${l.bg} transition-transform group-hover:scale-105`}
                >
                  <l.icon className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-muted">{l.label}</span>
              </a>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-lg border border-foreground/15 hover:border-primary-light/50 px-3 py-2 text-xs font-medium text-foreground transition"
          >
            {copied ? (
              <>
                <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <LinkIcon className="w-3.5 h-3.5" />
                Copy link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
