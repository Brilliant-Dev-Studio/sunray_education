"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ParallaxImage from "./ParallaxImage";

const easeOut = [0.16, 1, 0.3, 1] as const;

const contactRows = [
  { label: "PHONE NUMBER", value: "+95 9 123 456 789" },
  { label: "EMAIL ADDRESS", value: "info@sunray-edu.com" },
  {
    label: "OPENING HOURS",
    value: (
      <>
        9 AM – 5 PM
        <br />
        Monday – Saturday
      </>
    ),
  },
];

export default function ContactCTA() {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-16 sm:px-12 sm:py-24">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-8"
      >
        <div>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="text-sm font-semibold tracking-wide text-primary-light"
          >
            JOIN LEARN GROW
          </motion.p>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
            className="mt-4 font-serif text-4xl leading-tight text-foreground sm:text-6xl"
          >
            Knowledge that{" "}
            <span className="text-primary-light">builds</span> leaders
          </motion.h2>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.95 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.25 }}
            className="relative mt-16 h-64 w-full overflow-hidden rounded-2xl"
          >
            <ParallaxImage
              src="/HeroSectionImages/welcome.avif"
              alt="Sunray Myanmar campus"
              className="h-full w-full"
              strength={30}
            />
          </motion.div>
        </div>

        <div className="hidden justify-center md:flex">
          <div className="relative h-full w-full max-w-32 translate-x-8">
            <motion.svg
              viewBox="0 0 109 693"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              fill="none"
            >
              <motion.path
                stroke="#414B53"
                strokeWidth="2"
                d="M61.845.153c1.5 9.707 3.818 23.883 7.018 24.745 3.2.863 13.334 6.112 18 8.629l5.5 19.952c-3.333 3.775-10 12.295-10 16.178 0 4.853-6.5 9.707-6.5 14.02 0 4.315 6.5 15.64 6.5 23.189 0 7.55 25 18.874 25 24.806 0 5.932-15 11.324-15 17.256 0 4.746-11 15.998-16.5 21.031v23.728l-14 10.246 16 13.481v6.472l-4 4.853c.834-2.517 2-5.285 0 3.775-2 9.059 4.834 14.56 8.5 16.178v2.696l-4.5 29.659-17.5 55.005-35 18.335 43.5 47.455-7 55.004c-4.833 4.674-15.1 15.746-17.5 22.649-3 8.628-19 12.942-19 22.649s6 32.356 0 38.827c-4.8 5.177 6 40.264 12 57.161 2.334 2.517 7 8.844 7 14.021 0 5.177-16.666 20.852-25 28.042L.943 692.609"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.6, ease: easeOut, delay: 0.4 }}
              />
            </motion.svg>

            {/* positioned at the path's actual endpoint coordinates (61.845/109, 0.943/109) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.3 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: "56.7%", top: "0%" }}
            >
              <Image src="/pin.svg" alt="" width={40} height={40} />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.4 },
                show: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.5, ease: easeOut, delay: 1.9 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: "0.9%", top: "100%" }}
            >
              <Image src="/location.svg" alt="" width={60} height={60} />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col gap-10 md:items-end md:text-right">
          {contactRows.map((row) => (
            <motion.div
              key={row.label}
              variants={{
                hidden: { opacity: 0, x: 30 },
                show: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              <p className="text-sm font-semibold tracking-wide text-primary-light">
                {row.label}
              </p>
              <p className="mt-3 text-lg leading-snug text-foreground">
                {row.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
