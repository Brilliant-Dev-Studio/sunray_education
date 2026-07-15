import { allPrograms, categories } from "./programsData";

const TEACHER_COUNT = 7;

const stats = [
  {
    value: allPrograms.length,
    label: "Free Programs Offered",
    icon: (
      <path d="M4 6a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm10-2v5a1 1 0 0 0 1 1h5" />
    ),
  },
  {
    value: TEACHER_COUNT,
    label: "Expert Instructors",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" />
      </>
    ),
  },
  {
    value: categories.length,
    label: "Program Categories",
    icon: (
      <>
        <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
      </>
    ),
  },
];

export default function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-12 sm:pb-24">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-2xl bg-foreground/5 px-8 py-10 text-center"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary-light"
            >
              {stat.icon}
            </svg>
            <p className="mt-4 text-4xl font-bold text-foreground">
              {stat.value}
              <span className="text-primary-light">+</span>
            </p>
            <hr className="mt-3 w-8 border-t-2 border-foreground/20" />
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
