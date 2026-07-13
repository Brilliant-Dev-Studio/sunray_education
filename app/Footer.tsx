import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative overflow-x-hidden px-6 pb-0 pt-16 sm:px-12">
      <div className="mx-auto max-w-6xl rounded-xl border border-primary-light/60 px-8 py-14 sm:rounded-3xl sm:border-3 sm:px-14">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <Logo crestClassName="h-12" />
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Sunray Myanmar is dedicated to providing quality education and
              a nurturing environment for students to grow academically,
              socially, and personally.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-20">
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-primary-light">
                ESSENTIAL PAGES
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-foreground/90">
                <li>
                  <a href="/" className="hover:text-primary-light transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/programs" className="hover:text-primary-light transition-colors">
                    Programs
                  </a>
                </li>
                <li>
                  <a href="/teachers" className="hover:text-primary-light transition-colors">
                    Teachers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wide text-primary-light">
                CONTACT
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-foreground/90">
                <li>info@sunray-edu.com</li>
                <li>+95 9 123 456 789</li>
                <li>Yangon, Myanmar</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-16 text-center text-sm text-muted">
          © {new Date().getFullYear()} Sunray Myanmar. All rights reserved.
        </p>
      </div>

      <div
        aria-hidden
        className="pointer-events-none mt-4 select-none whitespace-nowrap text-center font-serif text-6xl font-bold leading-[1.15] sm:text-[12rem] lg:text-[18rem]"
        style={{
          WebkitTextStroke: "1px var(--primary-light)",
          color: "var(--primary-light)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 20%, black 85%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 20%, black 85%)",
        }}
      >
        SUNRAY
      </div>
    </footer>
  );
}
