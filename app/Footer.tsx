import BackToTop from "./BackToTop";

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-md bg-primary-light px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
      {children}
    </span>
  );
}

const socials = [
  {
    name: "Facebook: Sunray Education Group Myanmar",
    href: "https://www.facebook.com/search/top?q=Sunray%20Education%20Group%20Myanmar",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12",
  },
  {
    name: "TikTok: Sunray Non Profit Education",
    href: "https://www.tiktok.com/search?q=Sunray%20Non%20Profit%20Education",
    path: "M16.6 5.82c-.97-.86-1.6-2.02-1.72-3.3h-3.13v13.66c0 1.62-1.31 2.94-2.94 2.94a2.94 2.94 0 0 1-2.94-2.94 2.94 2.94 0 0 1 2.94-2.94c.27 0 .53.04.78.11v-3.19a6.1 6.1 0 0 0-.78-.05C4.88 10.11 2 12.99 2 16.83S4.88 23.55 8.71 23.55s6.71-2.88 6.71-6.72V9.4a9.5 9.5 0 0 0 5.58 1.79V8.07a6.1 6.1 0 0 1-4.4-2.25",
  },
];

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Teachers", href: "/teachers" },
];

export default function Footer() {
  return (
    <footer className="bg-black px-6 py-10 sm:px-12 sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-14 lg:grid-cols-3 lg:gap-10">
        <div className="lg:border-r lg:border-white/10 lg:pr-10">
          <SectionLabel>About Us</SectionLabel>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60 sm:mt-6">
            Sunray Myanmar is the country&apos;s pioneer and largest free
            education network, dedicated to providing quality education and
            a nurturing environment for students to grow academically,
            socially, and personally.
          </p>

          <div className="mt-6 sm:mt-10">
            <SectionLabel>Quick Links</SectionLabel>
            <ul className="mt-4 space-y-2 text-sm text-white/60 sm:mt-6 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-primary-light"
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-primary-light"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:border-r lg:border-white/10 lg:pr-10">
          <SectionLabel>Explore Us</SectionLabel>
          <ul className="mt-4 space-y-2 text-sm text-white/60 sm:mt-6 sm:space-y-3">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-primary-light"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 sm:mt-10">
            <SectionLabel>Contact Us</SectionLabel>
            <ul className="mt-4 space-y-2 text-sm text-white/60 sm:mt-6 sm:space-y-3">
              <li className="flex items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0 text-primary-light"
                >
                  <path d="M6.6 10.8c1.44 2.83 3.77 5.15 6.6 6.6l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4.5a1 1 0 0 1 1-1h3.47a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.02z" />
                </svg>
                09693016568{" "}
                <span className="text-white/40">(9 AM – 5 PM)</span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0 text-primary-light"
                >
                  <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5zm2.4.5 7.6 5.7L19.6 6zM20 8.2l-7.4 5.55a1 1 0 0 1-1.2 0L4 8.2V18h16z" />
                </svg>
                <a
                  href="mailto:info@sunray-edu.com"
                  className="underline underline-offset-2 transition-colors hover:text-primary-light"
                >
                  info@sunray-edu.com
                </a>
              </li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-all hover:-translate-y-0.5 hover:bg-primary-light hover:text-white sm:h-10 sm:w-10"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 sm:h-4.5 sm:w-4.5"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>Locate Us</SectionLabel>
          <div className="mt-4 overflow-hidden rounded-2xl bg-white/5 sm:mt-6">
            <div className="p-5 sm:p-6">
              <p className="flex items-center gap-2 font-bold text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0 text-primary-light"
                >
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5" />
                </svg>
                Sunray Myanmar
              </p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
                Yangon, Myanmar
              </p>
            </div>
            <iframe
              title="Sunray Myanmar location map"
              src="https://www.google.com/maps?q=Yangon,+Myanmar&output=embed"
              loading="lazy"
              className="h-48 w-full grayscale invert"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 sm:mt-16 sm:pt-8">
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} Sunray Myanmar. All rights reserved.
        </p>
      </div>

      <BackToTop />
    </footer>
  );
}
