"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions/auth";
import { LockIcon } from "@/app/admin/icons";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@sunray.edu"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[#1a2025] placeholder:text-gray-400 outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444] transition"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[#1a2025] placeholder:text-gray-400 outline-none focus:border-[#ef3444] focus:ring-1 focus:ring-[#ef3444] transition"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-[#ef3444] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#ef3444] hover:bg-[#ff3b45] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 transition"
      >
        <LockIcon className="w-4 h-4" />
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
