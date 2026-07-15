"use client";

import { useState } from "react";
import { categories } from "./programsData";

export default function ProgramsDropdown({ isActive }: { isActive: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href="/programs"
        className={`pb-1 transition-colors hover:text-primary-light ${
          isActive
            ? "border-b-2 border-primary-light text-primary-light"
            : "border-b-2 border-transparent"
        }`}
      >
        Programs
      </a>

      {open && (
        <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3">
          <div className="rounded-2xl border border-foreground/10 bg-background p-3 shadow-xl">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`/programs/category/${category.slug}`}
                className="block rounded-lg px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5 hover:text-primary-light"
              >
                {category.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
