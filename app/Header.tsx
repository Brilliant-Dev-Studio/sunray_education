"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import MobileNav from "./MobileNav";
import Logo from "./Logo";
import SubHeader from "./SubHeader";
import ProgramsDropdown from "./ProgramsDropdown";
import AccountMenu from "./AccountMenu";

const FULL_HEIGHT = 86;
const SHRUNK_HEIGHT = 76;

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <a
      href={href}
      className={`pb-1 transition-colors hover:text-primary-light ${
        isActive
          ? "border-b-2 border-primary-light text-primary-light"
          : "border-b-2 border-transparent"
      }`}
    >
      {label}
    </a>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsFixed(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <SubHeader />
      <motion.header
        animate={{ height: isFixed ? SHRUNK_HEIGHT : FULL_HEIGHT }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`z-50 flex items-center justify-between border-t border-foreground/80 bg-background px-6 shadow-md sm:px-12 ${
          isFixed ? "fixed top-0 left-0 right-0" : "relative"
        }`}
      >
        <Logo crestClassName="h-8 sm:h-10" />
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-8 text-base font-bold text-foreground">
            <NavLink
              href="/"
              label="Home"
              isActive={pathname === "/"}
            />
            <NavLink
              href="/about"
              label="About"
              isActive={pathname === "/about"}
            />
            <ProgramsDropdown isActive={pathname.startsWith("/programs")} />
            <NavLink
              href="/teachers"
              label="Teachers"
              isActive={pathname === "/teachers"}
            />
            <NavLink
              href="/level-test"
              label="Test Level"
              isActive={pathname.startsWith("/level-test")}
            />
          </nav>
          <AccountMenu />
        </div>
        <MobileNav />
      </motion.header>
      {isFixed && <div style={{ height: SHRUNK_HEIGHT }} />}
    </>
  );
}
