type Program = {
  title: string;
  slug: string;
  audience: string;
  syllabus: string;
  use: string;
};

export default function ProgramItem({
  title,
  slug,
  audience,
  syllabus,
  use,
}: Program) {
  return (
    <a
      href={`/programs/${slug}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl border-t-4 border-primary-light bg-foreground/3 p-8 shadow-md transition-transform hover:-translate-y-1"
    >
      <h3 className="text-xl font-bold leading-snug text-foreground">
        {title}
      </h3>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-light">
            Target Audience
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {audience}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-light">
            Syllabus Context
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {syllabus}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-light">
            Career &amp; Life Use
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{use}</p>
        </div>
      </div>
    </a>
  );
}
