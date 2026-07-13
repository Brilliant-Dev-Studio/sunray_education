import Image from "next/image";
import HeroPhotos from "./HeroPhotos";
import HeroText from "./HeroText";
import MobileNav from "./MobileNav";
import TestimonialCard from "./TestimonialCard";
import FAQ from "./FAQ";
import CampusOverview from "./CampusOverview";
import RotatingBadge from "./RotatingBadge";
import ContactCTA from "./ContactCTA";
import Reveal from "./Reveal";
import ParallaxImage from "./ParallaxImage";
import Logo from "./Logo";

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
      <section className="relative flex flex-col overflow-hidden sm:min-h-screen">
        {/* doodle icons */}
        <Image
          src="/HeroSectionImages/itemsvg2.svg"
          alt=""
          width={296}
          height={175}
          className="pointer-events-none absolute left-[21%] -top-4 z-0 w-20 opacity-70 sm:w-56"
        />
        <Image
          src="/HeroSectionImages/itemsvg1.svg"
          alt=""
          width={115}
          height={129}
          className="pointer-events-none absolute right-[10%] top-[265px] z-0 w-12 rotate-25 opacity-70 sm:right-[1%] sm:top-[9%] sm:rotate-0 sm:w-36"
        />

        {/* floating photo cards */}
        <HeroPhotos />

        <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-background px-6 py-[17px] sm:border-b-0 sm:bg-transparent sm:px-12 sm:py-6">
          <Logo crestClassName="h-10 sm:h-14" />
          <nav className="hidden items-center gap-10 text-base font-medium text-foreground/90 md:flex">
            <a
              href="/"
              className="text-primary-light transition-colors hover:text-primary-light"
            >
              Home
            </a>
            <a href="#" className="hover:text-primary-light transition-colors">
              About
            </a>
            <a
              href="/programs"
              className="hover:text-primary-light transition-colors"
            >
              Programs
            </a>
            <a
              href="/teachers"
              className="hover:text-primary-light transition-colors"
            >
              Teachers
            </a>
          </nav>
          <a
            href="mailto:info@sunray-edu.com"
            className="hidden text-base font-medium text-primary-light md:block"
          >
            info@sunray-edu.com
          </a>
          <MobileNav />
        </header>

        <main className="relative z-10 flex flex-1 flex-col items-center justify-start px-6 pt-19.5 pb-24 text-center sm:justify-center sm:pt-0">
          <HeroText />
        </main>
      </section>

      <section className="relative -mt-[26px] h-60 w-full overflow-hidden sm:-mt-7.5 sm:h-175">
        <Image
          src="/HeroSectionImages/heroMain.png"
          alt=""
          fill
          className="object-contain object-bottom"
        />
      </section>

      <Reveal>
        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-12 sm:gap-12 sm:px-12 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary-light">
              ABOUT OUR INSTITUTE
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-6xl">
              Welcome to{" "}
              <span className="text-primary-light">Sunray</span> Myanmar
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
              Our school &amp; college is dedicated to academic excellence,
              character development, and leadership growth. With experienced
              teachers and modern facilities, we ensure every learner reaches
              their full potential.
            </p>

            <hr className="mt-16 border-t border-primary-light/40" />

            <blockquote className="mt-8 max-w-xl text-base italic leading-relaxed text-foreground/90">
              &ldquo;We believe education is not just about books &mdash;
              it&apos;s about building confident, responsible, and capable
              individuals.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm tracking-wide text-muted">
              ALMOND D. DOWSON, PROFESSOR
            </p>
          </div>

          <ParallaxImage
            src="/HeroSectionImages/welcome.avif"
            alt="Sunray Myanmar campus"
            className="h-80 w-full rounded-3xl sm:h-120"
            strength={50}
          />
        </section>
      </Reveal>

      <Reveal>
        <div className="flex justify-center pt-12 sm:pt-24">
          <RotatingBadge />
        </div>
      </Reveal>

      <CampusOverview />

      <Reveal>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-12 sm:py-24">
          <p className="text-sm font-semibold tracking-wide text-primary-light">
            TESTIMONIALS
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-foreground sm:text-6xl">
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
          <p className="text-sm font-semibold tracking-wide text-primary-light">
            FAQ &amp; ANSWERS
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-6xl">
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
