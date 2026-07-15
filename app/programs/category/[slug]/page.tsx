import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "../../../Header";
import ProgramItem from "../../../ProgramItem";
import Reveal from "../../../Reveal";
import { categories } from "../../../programsData";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

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
          <h1 className="mx-auto mt-5 max-w-3xl font-sans text-4xl font-bold leading-tight text-white sm:text-6xl">
            {category.title}
          </h1>
          <hr className="mx-auto mt-10 w-16 border-t-2 border-primary-light" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28 pt-16 sm:px-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {category.programs.map((program, j) => (
            <Reveal key={program.slug} delay={Math.min(j, 4) * 0.05}>
              <ProgramItem {...program} />
            </Reveal>
          ))}
        </div>

        <a
          href="/programs"
          className="mt-14 inline-block text-sm font-semibold uppercase tracking-wide text-primary-light hover:underline"
        >
          ← Back to all programs
        </a>
      </section>
    </>
  );
}
