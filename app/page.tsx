import Image from "next/image";
import TestimonialCard from "./TestimonialCard";
import FAQ from "./FAQ";
import CampusOverview from "./CampusOverview";
import RotatingBadge from "./RotatingBadge";
import ContactCTA from "./ContactCTA";
import Reveal from "./Reveal";
import Header from "./Header";
import HeroSlideshow from "./HeroSlideshow";
import StatsSection from "./StatsSection";

const testimonials = [
  {
    name: "Daw Aye Aye Mon, Parent",
    quote:
      "This institution has helped my child grow in confidence and academic performance.",
    photo: "/HeroSectionImages/8AxkYNsPmpX3TkZm21mGtYsXtyE.avif",
  },
  {
    name: "U Zaw Min Htet, Parent",
    quote:
      "My child has developed strong confidence and achieved better academic results here.",
    photo: "/HeroSectionImages/uYxYmYvQtsp0fRbUzj5NYfVrL8.avif",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <HeroSlideshow />

      <Reveal>
        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-12 sm:gap-12 sm:px-12 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary-light">
              ABOUT US
            </p>
            <h2 className="mt-4 font-sans text-xl font-bold leading-snug text-foreground sm:text-2xl">
              <span className="text-primary-light">Sunray</span> Myanmar — The
              First and Largest Free Education Organization in Myanmar
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
              We believe that financial limitations should never stand in the
              way of a bright future and quality education. As
              Myanmar&apos;s pioneer and largest free education network,
              Sunray Myanmar bridges the gap by collaborating with industry
              experts and professionals across languages, vocational skills,
              and professional development.
            </p>
            <a
              href="/about"
              className="mt-6 inline-block text-sm font-semibold uppercase tracking-wide text-primary-light hover:underline"
            >
              Learn more about us →
            </a>
          </div>

          <div className="relative h-80 w-full sm:h-120">
            <Image
              src="/HeroSectionImages/heroMain.png"
              alt="Sunray Myanmar campus"
              fill
              className="object-contain"
            />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <StatsSection />
      </Reveal>

      <Reveal>
        <div className="flex justify-center pt-12 sm:pt-24">
          <RotatingBadge />
        </div>
      </Reveal>

      <CampusOverview />

      <Reveal>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-12 sm:py-24">
          <p className="text-sm font-bold tracking-wide text-primary-light">
            TESTIMONIALS
          </p>
          <h2 className="mt-4 max-w-2xl font-sans text-3xl font-semibold leading-tight text-foreground sm:text-6xl">
            What Parents Are Saying About{" "}
            <span className="text-primary-light">Sunray</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12">
            {testimonials.map((testimonial, i) => (
              <Reveal key={testimonial.name} delay={i * 0.1}>
                <TestimonialCard {...testimonial} />
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-12 sm:py-24">
          <p className="text-sm font-bold tracking-wide text-primary-light">
            FAQ &amp; ANSWERS
          </p>
          <h2 className="mt-4 font-sans text-3xl font-semibold leading-tight text-foreground sm:text-6xl">
            Common Questions From{" "}
            <span className="text-primary-light">Parents</span> &amp; Students
          </h2>

          <FAQ />
        </section>
      </Reveal>

      <ContactCTA />
    </>
  );
}
