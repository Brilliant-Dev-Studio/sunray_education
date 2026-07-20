"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/app/AuthIcons";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
          Email
        </label>
        <div className="relative">
          <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-foreground/15 bg-background pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
          Password
        </label>
        <div className="relative">
          <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full rounded-lg border border-foreground/15 bg-background pl-10 pr-10 py-2.5 text-foreground placeholder:text-muted outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition"
          >
            {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-primary-light bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary-light hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wide py-2.5 transition"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
          className="text-primary-light font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
