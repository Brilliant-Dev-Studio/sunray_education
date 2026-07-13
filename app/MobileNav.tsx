"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = ["Home", "About", "Programs", "Teachers"];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="relative z-20 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-0.5 w-6 bg-foreground transition-transform ${
            open ? "translate-y-1 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-foreground transition-transform ${
            open ? "-translate-y-1 -rotate-45" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full z-20 mx-6 rounded-2xl border border-primary/40 bg-background px-6 py-6"
          >
            <nav className="flex flex-col gap-5 text-base font-medium text-foreground/90">
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setOpen(false)}
                  className="hover:text-primary-light transition-colors"
                >
                  {link}
                </a>
              ))}
              <a
                href="mailto:info@sunray-edu.com"
                className="text-primary-light"
              >
                info@sunray-edu.com
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
