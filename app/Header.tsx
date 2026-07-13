"use client";

import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import Logo from "./Logo";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "#" },
  { label: "Programs", href: "/programs" },
  { label: "Teachers", href: "/teachers" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-background px-6 py-[17px] sm:px-12 sm:py-6">
      <Logo crestClassName="h-10 sm:h-14" />
      <nav className="hidden items-center gap-10 text-base font-medium text-foreground/90 md:flex">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`transition-colors hover:text-primary-light ${
              pathname === link.href ? "text-primary-light" : ""
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <a
        href="mailto:info@sunray-edu.com"
        className="hidden text-base font-medium text-primary-light md:block"
      >
        info@sunray-edu.com
      </a>
      <MobileNav />
    </header>
  );
}
