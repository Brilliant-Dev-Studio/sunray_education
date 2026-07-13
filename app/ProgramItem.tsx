type Program = {
  title: string;
  audience: string;
  syllabus: string;
  use: string;
  isFirst?: boolean;
};

export default function ProgramItem({
  title,
  audience,
  syllabus,
  use,
  isFirst = false,
}: Program) {
  return (
    <div
      className={`py-8 ${isFirst ? "" : "border-t border-foreground/10"}`}
    >
      <h3 className="font-serif text-2xl text-foreground">{title}</h3>

      <dl className="mt-5 space-y-4">
        <div className="sm:flex sm:gap-6">
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light sm:w-40 sm:shrink-0">
            Target Audience
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-muted sm:mt-0">
            {audience}
          </dd>
        </div>
        <div className="sm:flex sm:gap-6">
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light sm:w-40 sm:shrink-0">
            Syllabus Context
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-muted sm:mt-0">
            {syllabus}
          </dd>
        </div>
        <div className="sm:flex sm:gap-6">
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light sm:w-40 sm:shrink-0">
            Career &amp; Life Use
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-muted sm:mt-0">
            {use}
          </dd>
        </div>
      </dl>
    </div>
  );
}
