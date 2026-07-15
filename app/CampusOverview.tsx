import Image from "next/image";

export default function CampusOverview() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-12 sm:gap-12 sm:px-12 sm:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      <div className="relative h-96 w-full sm:h-120">
        <Image
          src="/review/viber_image_2026-07-15_14-46-36-536.jpg"
          alt="Naing Wai Yan, Director of Sunray Myanmar"
          fill
          className="object-contain"
        />
      </div>

      <div className="text-center lg:text-left">
        <p className="text-sm font-semibold tracking-wide text-primary-light">
          CAMPUS OVERVIEW
        </p>
        <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
          To provide quality education that{" "}
          <span className="text-primary-light">develops</span> knowledge,
          skills
        </h2>
      </div>
    </section>
  );
}
