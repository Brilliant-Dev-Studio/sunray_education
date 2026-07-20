type IconProps = { className?: string };

const base = "w-5 h-5";

export function ClockIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrophyIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13v3m-3 4h6m-3-4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon({ className = base, filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      className={className}
    >
      <path
        d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckCircleIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.3 2.3L16 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function XCircleIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5l5 5m0-5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlameIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path
        d="M12 3s4 3.5 4 8a4 4 0 0 1-8 0c0-1 .3-1.8.8-2.6.4.9 1.2 1.4 1.2 1.4-.3-2 .5-4 2-6.8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 15a3 3 0 0 0 6 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparkleIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c.6 3.2 1.6 5.2 3 6.5 1.4 1.3 3.4 2.1 6 2.5-2.6.4-4.6 1.2-6 2.5-1.4 1.3-2.4 3.3-3 6.5-.6-3.2-1.6-5.2-3-6.5-1.4-1.3-3.4-2.1-6-2.5 2.6-.4 4.6-1.2 6-2.5 1.4-1.3 2.4-3.3 3-6.5Z" />
    </svg>
  );
}

export function MedalIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="15" r="6" />
      <path d="m9 9.5-3-6M15 9.5l3-6M9.5 15.5 11 17l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AwardIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="8" r="5.5" />
      <path d="M8.5 13 7 21l5-2.5L17 21l-1.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UploadIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M12 15V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WalletIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 14.5h2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 6V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShareIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" strokeLinecap="round" />
    </svg>
  );
}

export function FacebookIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.6-1.5h1.6V4.2C16.4 4.1 15.4 4 14.3 4c-2.4 0-4 1.5-4 4.1v2.3H7.7v3h2.6V21h3.2Z" />
    </svg>
  );
}

export function TwitterIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.5 3h3l-6.6 7.5L21.5 21h-6.1l-4.8-6.3L4.9 21H1.9l7.1-8.1L2 3h6.3l4.4 5.8L17.5 3Zm-1.1 16.2h1.7L7.7 4.7H5.9l10.5 14.5Z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.5A9.5 9.5 0 0 0 3.8 17l-1.3 4.5 4.6-1.3A9.5 9.5 0 1 0 12 2.5Zm0 17.2a7.6 7.6 0 0 1-3.9-1.1l-.3-.2-2.7.8.8-2.6-.2-.3A7.7 7.7 0 1 1 12 19.7Zm4.2-5.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4L9 8.9c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 3.9 3.4.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

export function TelegramIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.5 3.5 2.7 10.9c-1 .4-1 1.6.1 1.9l4.5 1.4 1.7 5.4c.2.7 1 .9 1.6.4l2.4-2.1 4.4 3.3c.7.5 1.7.1 1.9-.7l3-17.2c.2-1-.8-1.7-1.8-1.4Zm-3.1 3.6L9.2 14l-.4 3.4-1.3-4.2 10.9-6.6c.2-.1.4.2.2.3l-3.2 3.2c.1.1 0 0 0 0Z" />
    </svg>
  );
}

export function LinkIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path
        d="M9.5 14.5 14.5 9.5M8 16l-2 2a3 3 0 0 1-4.2-4.2l3.4-3.4A3 3 0 0 1 9.5 10M16 8l2-2a3 3 0 0 1 4.2 4.2l-3.4 3.4A3 3 0 0 1 14.5 14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
