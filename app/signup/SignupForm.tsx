"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/app/AuthIcons";

export default function SignupForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Aung Aung"
            className="w-full rounded-lg border border-foreground/15 bg-background pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition"
          />
        </div>
      </div>

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
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="At least 6 characters"
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
        {pending ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="text-primary-light font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
