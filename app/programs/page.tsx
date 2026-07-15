import Image from "next/image";
import Header from "../Header";
import Reveal from "../Reveal";
import { categories } from "../programsData";

export default function ProgramsPage() {
  return (
    <>
      <Header />

      <section className="relative flex h-[50vh] min-h-[380px] w-full items-center justify-center overflow-hidden">
        <Image
          src="/HeroImages/photo1.avif"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-light">
            Programs
          </p>
          <h1 className="mt-5 font-sans text-4xl font-bold leading-tight text-white sm:text-6xl">
            Courses Built For{" "}
            <span className="text-primary-light">Real</span> Growth
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80">
            From language mastery to leadership and modern teaching, explore
            Sunray&apos;s full catalogue of programs designed for students,
            educators, and working professionals.
          </p>
          <hr className="mx-auto mt-10 w-16 border-t-2 border-primary-light" />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16 sm:px-12 sm:py-24">
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category, i) => (
            <Reveal key={category.slug} delay={i * 0.1}>
              <a
                href={`/programs/category/${category.slug}`}
                className="group relative flex h-auto w-full max-w-159.75 flex-col justify-between overflow-hidden rounded-2xl border-t-4 border-primary-light bg-foreground/3 p-8 shadow-md transition-transform hover:-translate-y-1 sm:h-92.25"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--foreground)_1.5px,transparent_1.5px)] bg-size-[18px_18px] opacity-7"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-10 -right-4 select-none font-serif text-[10rem] font-bold leading-none text-primary-light/10"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <h2 className="text-2xl font-bold leading-snug text-foreground">
                    {category.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    {category.description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-primary-light">
                    {category.programs.length} programs
                  </p>
                </div>
                <span className="relative mt-6 inline-flex w-fit items-center gap-2 self-end border border-primary-light bg-background px-5 py-2.5 text-sm font-semibold text-primary-light transition-transform group-hover:translate-x-1">
                  View Programs →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
