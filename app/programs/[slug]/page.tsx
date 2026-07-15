import { notFound } from "next/navigation";
import Header from "../../Header";
import Reveal from "../../Reveal";
import { allPrograms, getProgramBySlug } from "../../programsData";

export function generateStaticParams() {
  return allPrograms.map((program) => ({ slug: program.slug }));
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) notFound();

  return (
    <>
      <Header />

      <Reveal>
        <section className="px-6 pb-4 pt-16 text-center sm:px-12 sm:pt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-light">
            {program.categoryTitle}
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl font-serif text-3xl leading-tight text-foreground sm:text-5xl">
            {program.title}
          </h1>
          <hr className="mx-auto mt-10 w-16 border-t-2 border-primary-light" />
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-3xl px-6 pb-28 pt-8 sm:px-12">
          <div className="space-y-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-light">
                Target Audience
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {program.audience}
              </p>
            </div>
            <div className="border-t border-foreground/10 pt-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-light">
                Syllabus Context
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {program.syllabus}
              </p>
            </div>
            <div className="border-t border-foreground/10 pt-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-light">
                Career &amp; Life Use
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {program.use}
              </p>
            </div>
          </div>

          <a
            href="/programs"
            className="mt-14 inline-block text-sm font-semibold uppercase tracking-wide text-primary-light hover:underline"
          >
            ← Back to all programs
          </a>
        </section>
      </Reveal>
    </>
  );
}
