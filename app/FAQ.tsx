"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    question: "What programs do you offer?",
    answer:
      "We offer language courses, management and leadership training, education and pedagogy programs, and applied sciences and technical workplace skills — see the full catalogue on our Programs page.",
  },
  {
    question: "What is the admission process?",
    answer:
      "Reach out to us by email or phone, and our team will guide you through course selection, schedules, and enrollment requirements.",
  },
  {
    question: "Do you offer scholarships?",
    answer:
      "As a non-profit education group, we offer reduced-fee and sponsored seats for eligible students. Contact us to check current availability.",
  },
  {
    question: "Who teaches the courses?",
    answer:
      "Our faculty is made up of experienced lecturers and subject specialists — meet them on our Teachers page.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-12 border-t border-foreground/10">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.question} className="border-b border-foreground/10">
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="flex w-full items-center gap-4 py-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-sans text-base font-semibold text-primary-light sm:text-lg">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span className="flex-1 font-sans text-base font-semibold text-foreground sm:text-xl md:text-2xl">
                {faq.question}
              </span>
              <span
                className={`text-xl text-foreground transition-transform duration-300 sm:text-2xl ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 pl-9 text-left text-sm leading-relaxed text-muted sm:pl-10">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
