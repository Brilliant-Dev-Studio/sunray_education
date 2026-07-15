import Image from "next/image";
import Header from "../Header";
import Reveal from "../Reveal";
import ParallaxImage from "../ParallaxImage";

const pillars = [
  {
    title: "Languages",
    description:
      "From everyday conversation to professional fluency, our language programs unlock global communication opportunities and open doors to study, work, and connect beyond Myanmar's borders.",
    photo: "/HeroImages/photo2.avif",
  },
  {
    title: "Vocational Skills",
    description:
      "Hands-on, practical training that turns ability into employability — equipping students with the real-world expertise that industries are actively looking for.",
    photo: "/HeroImages/photo3.avif",
  },
  {
    title: "Professional Development",
    description:
      "We prepare young people not just to find a job, but to grow in one — building the workplace skills, confidence, and judgment that careers are built on.",
    photo: "/HeroImages/photo4.avif",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <section className="relative flex h-[50vh] min-h-[380px] w-full items-center justify-center overflow-hidden">
        <Image
          src="/HeroImages/photo5.avif"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-light">
            About Us
          </p>
          <h1 className="mt-5 font-sans text-4xl font-bold leading-tight text-white sm:text-6xl">
            Who We Are
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80">
            Myanmar&apos;s pioneer and largest free education network,
            dedicated to opening doors to a brighter future.
          </p>
          <hr className="mx-auto mt-10 w-16 border-t-2 border-primary-light" />
        </div>
      </section>

      <Reveal>
        <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-12 sm:py-24">
          <p className="text-sm font-semibold tracking-wide text-primary-light">
            OUR STORY
          </p>
          <h2 className="mt-4 font-sans text-2xl font-bold leading-snug text-foreground sm:text-4xl">
            We believe a bright future shouldn&apos;t come with a price tag.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Financial limitations should never stand in the way of quality
            education. That belief is why Sunray Myanmar exists — as the
            country&apos;s pioneer and largest free education network,
            bridging the gap between ambition and opportunity by
            collaborating with industry experts and professionals to deliver
            training that actually prepares students for what comes next.
          </p>
        </section>
      </Reveal>

      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        {pillars.map((pillar, i) => (
          <Reveal key={pillar.title}>
            <section
              className={`grid grid-cols-1 items-center gap-8 py-12 sm:gap-12 sm:py-16 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <ParallaxImage
                src={pillar.photo}
                alt={pillar.title}
                className="h-72 w-full sm:h-96"
                strength={30}
              />
              <div>
                <p className="text-sm font-semibold tracking-wide text-primary-light">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-sans text-2xl font-semibold text-foreground sm:text-4xl">
                  {pillar.title}
                </h3>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
                  {pillar.description}
                </p>
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-12 sm:py-24">
          <h2 className="font-sans text-2xl font-bold leading-snug text-foreground sm:text-4xl">
            Ready to start your journey with{" "}
            <span className="text-primary-light">Sunray</span>?
          </h2>
          <a
            href="/programs"
            className="mt-8 inline-block rounded-full bg-primary-light px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-105"
          >
            Explore Our Programs
          </a>
        </section>
      </Reveal>
    </>
  );
}
