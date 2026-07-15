"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  cubicBezier,
  type MotionValue,
} from "framer-motion";

const premiumEase = cubicBezier(0.16, 1, 0.3, 1);

type TileData = {
  src: string;
  from: { x: number; y: number; scale: number };
  range: [number, number];
};

function CampusTile({
  tile,
  progress,
  square = true,
}: {
  tile: TileData;
  progress: MotionValue<number>;
  square?: boolean;
}) {
  const [start, end] = tile.range;
  const ease = { ease: premiumEase };
  const x = useTransform(progress, [start, end], [tile.from.x, 0], ease);
  const y = useTransform(progress, [start, end], [tile.from.y, 0], ease);
  const scale = useTransform(
    progress,
    [start, end],
    [tile.from.scale, 1],
    ease,
  );
  const opacity = useTransform(progress, [start, end], [0, 1], ease);
  const blur = useTransform(progress, [start, end], [10, 0], ease);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.div
      style={{
        x,
        y,
        scale,
        opacity,
        filter,
        willChange: "transform, opacity, filter",
      }}
      className={`relative w-full overflow-hidden ${
        square ? "aspect-square" : "aspect-[4/5]"
      }`}
    >
      <Image
        src={tile.src}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 640px) 40vw, 16vw"
      />
    </motion.div>
  );
}

export default function CampusOverview() {
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.9", "end 0.3"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.7,
  });

  const lib: TileData = {
    src: "/HeroSectionImages/8AxkYNsPmpX3TkZm21mGtYsXtyE.avif",
    from: { x: -50, y: -50, scale: 0.92 },
    range: [0, 0.75],
  };
  const chairs: TileData = {
    src: "/HeroSectionImages/WbU912byZzH51eUtzDeIFMzzDA.avif",
    from: { x: -50, y: 50, scale: 0.92 },
    range: [0.06, 0.81],
  };
  const students: TileData = {
    src: "/HeroSectionImages/uYxYmYvQtsp0fRbUzj5NYfVrL8.avif",
    from: { x: -35, y: -50, scale: 0.92 },
    range: [0.12, 0.87],
  };
  const shelf: TileData = {
    src: "/HeroSectionImages/welcome.avif",
    from: { x: -35, y: 50, scale: 0.92 },
    range: [0.06, 0.81],
  };
  const building: TileData = {
    src: "/HeroSectionImages/8AxkYNsPmpX3TkZm21mGtYsXtyE.avif",
    from: { x: 0, y: 70, scale: 0.88 },
    range: [0.18, 1],
  };
  const grad: TileData = {
    src: "/HeroSectionImages/WbU912byZzH51eUtzDeIFMzzDA.avif",
    from: { x: 35, y: -50, scale: 0.92 },
    range: [0.12, 0.87],
  };
  const trees: TileData = {
    src: "/HeroSectionImages/uYxYmYvQtsp0fRbUzj5NYfVrL8.avif",
    from: { x: 35, y: 50, scale: 0.92 },
    range: [0.06, 0.81],
  };
  const stair: TileData = {
    src: "/HeroSectionImages/welcome.avif",
    from: { x: 50, y: -50, scale: 0.92 },
    range: [0, 0.75],
  };
  const audi: TileData = {
    src: "/HeroSectionImages/8AxkYNsPmpX3TkZm21mGtYsXtyE.avif",
    from: { x: 50, y: 50, scale: 0.92 },
    range: [0.06, 0.81],
  };

  return (
    <section
      ref={trackRef}
      className="mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-12 sm:py-24"
    >
      {/* mobile layout */}
      <div className="text-center sm:hidden">
        <p className="text-sm font-semibold tracking-wide text-primary-light">
          CAMPUS OVERVIEW
        </p>
        <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-foreground">
          To provide quality education that{" "}
          <span className="text-primary-light">develops</span> knowledge,
          skills
        </h2>

        <div className="mt-8">
          <CampusTile tile={building} progress={progress} square={false} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <CampusTile tile={lib} progress={progress} />
          <CampusTile tile={students} progress={progress} />
          <CampusTile tile={chairs} progress={progress} />
          <CampusTile tile={shelf} progress={progress} />
          <CampusTile tile={grad} progress={progress} />
          <CampusTile tile={stair} progress={progress} />
          <CampusTile tile={trees} progress={progress} />
          <CampusTile tile={audi} progress={progress} />
        </div>
      </div>

      {/* desktop bento layout */}
      <div className="hidden items-start gap-5 sm:flex">
        {/* col 1 */}
        <div className="flex w-[11%] flex-col gap-3 sm:gap-5">
          <CampusTile tile={lib} progress={progress} />
          <CampusTile tile={chairs} progress={progress} />
        </div>

        {/* col 2 — offset down */}
        <div className="mt-16 flex w-[12%] flex-col gap-3 sm:mt-24 sm:gap-5">
          <CampusTile tile={students} progress={progress} />
          <CampusTile tile={shelf} progress={progress} />
        </div>

        {/* center */}
        <div className="flex min-w-0 flex-1 flex-col items-center text-center">
          <p className="text-sm font-semibold tracking-wide text-primary-light">
            CAMPUS OVERVIEW
          </p>
          <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            To provide quality education that{" "}
            <span className="text-primary-light">develops</span> knowledge,
            skills
          </h2>

          <div className="mt-8 w-full">
            <CampusTile tile={building} progress={progress} square={false} />
          </div>
        </div>

        {/* col 5 — offset down */}
        <div className="mt-16 flex w-[12%] flex-col gap-3 sm:mt-24 sm:gap-5">
          <CampusTile tile={grad} progress={progress} />
          <CampusTile tile={trees} progress={progress} />
        </div>

        {/* col 6 */}
        <div className="flex w-[11%] flex-col gap-3 sm:gap-5">
          <CampusTile tile={stair} progress={progress} />
          <CampusTile tile={audi} progress={progress} />
        </div>
      </div>
    </section>
  );
}
