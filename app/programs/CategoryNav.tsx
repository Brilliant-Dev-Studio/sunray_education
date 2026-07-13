"use client";

import { useEffect, useState } from "react";

type Category = { slug: string; shortLabel: string };

export default function CategoryNav({
  categories,
}: {
  categories: Category[];
}) {
  const [active, setActive] = useState(categories[0]?.slug);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.slug))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav className="sticky top-0 z-30 -mx-6 overflow-x-auto border-b border-foreground/10 bg-background/95 px-6 backdrop-blur sm:mx-0 sm:px-12">
      <div className="mx-auto flex max-w-4xl gap-8 whitespace-nowrap">
        {categories.map((category) => (
          <a
            key={category.slug}
            href={`#${category.slug}`}
            onClick={(e) => {
              e.preventDefault();
              const target = document.getElementById(category.slug);
              if (!target) return;
              if (window.__lenis) {
                window.__lenis.scrollTo(target, { offset: -88 });
              } else {
                target.scrollIntoView({ behavior: "smooth" });
              }
              history.pushState(null, "", `#${category.slug}`);
            }}
            className={`border-b-2 py-4 text-sm font-semibold uppercase tracking-[0.15em] transition-colors ${
              active === category.slug
                ? "border-primary-light text-primary-light"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {category.shortLabel}
          </a>
        ))}
      </div>
    </nav>
  );
}
