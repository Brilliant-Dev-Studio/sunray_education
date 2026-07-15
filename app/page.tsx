import Image from "next/image";
import FAQ from "./FAQ";
import CampusOverview from "./CampusOverview";
import RotatingBadge from "./RotatingBadge";
import ContactCTA from "./ContactCTA";
import Reveal from "./Reveal";
import Header from "./Header";
import HeroSlideshow from "./HeroSlideshow";
import StatsSection from "./StatsSection";

const testimonials = [
  { name: "Ma Myo Thu Aye", photo: "/review/review1.jpg" },
  { name: "Ma Nadi Win", photo: "/review/review2.jpg" },
  { name: "Mg Hein Lin Aung", photo: "/review/review3.jpg" },
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
            STUDENT&apos;S FEEDBACK
          </p>
          <h2 className="mt-4 max-w-2xl font-sans text-3xl font-semibold leading-tight text-foreground sm:text-6xl">
            What Students Are Saying About{" "}
            <span className="text-primary-light">Sunray</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <Reveal key={testimonial.name} delay={i * 0.1}>
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.name}
                    fill
                    className="object-contain"
                  />
                </div>
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
