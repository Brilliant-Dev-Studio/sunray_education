"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, logout } from "@/app/actions/auth";

type CurrentUser = { id: string; email: string; name: string };

export default function AccountMenu() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser().then((u) => {
      if (cancelled) return;
      setUser(u);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) return <div className="h-9 w-9" aria-hidden />;

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-bold text-primary-light hover:underline whitespace-nowrap"
      >
        Log In
      </Link>
    );
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-white text-sm font-bold">
        {initial}
      </span>
      <span className="text-sm font-bold text-foreground max-w-28 truncate">
        {user.name}
      </span>
      <form action={logout}>
        <button
          type="submit"
          className="text-xs font-semibold text-muted hover:text-primary-light transition"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
