"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const works = [
  {
    id: 1,
    title: "SMART WORLD",
    category: "PREMIUM RESIDENCES",
    src: "/sm.png",
    color: "text-blue-400",
    website: "/projects",
  },
  {
    id: 2,
    title: "M3M INDIA",
    category: "LUXURY PROJECTS",
    src: "/image copy 9.png",
    color: "text-orange-500",
    website: "/projects",
  },
  {
    id: 3,
    title: "DASNAC ARC",
    category: "COMMERCIAL SPACES",
    src: "/image copy 4.png",
    color: "text-yellow-500",
    website: "/projects",
  },
  {
    id: 4,
    title: "ATS GROUP",
    category: "RESIDENTIAL PROJECTS",
    src: "/image copy 12.png",
    color: "text-green-400",
    website: "/projects",
  },
  {
    id: 5,
    title: "MAX ESTATES",
    category: "PREMIUM LIVING",
    src: "/image copy 13.png",
    color: "text-purple-500",
    website: "/projects",
  },
];

// ── CarouselItem ────────────────────────────────────────────────────────────
function CarouselItem({
  work,
  index,
  rotation,
  total,
  isActive,
}: {
  work: (typeof works)[0];
  index: number;
  rotation: MotionValue<number>;
  total: number;
  isActive: boolean;
}) {
  const angleStep = 360 / total;
  const radius = 260;

  const theta = useTransform(rotation, (r) => (index - r) * angleStep);
  const x = useTransform(theta, (t) => radius * Math.sin(t * (Math.PI / 180)));
  const z = useTransform(theta, (t) => radius * Math.cos(t * (Math.PI / 180)));
  const rotateY = useTransform(theta, (t) => t);

  const opacity = useTransform(theta, (t) => {
    let norm = t % 360;
    if (norm > 180) norm -= 360;
    if (norm < -180) norm += 360;
    return Math.abs(norm) > 90 ? 0.6 : 1;
  });

  const scale = useTransform(theta, (t) => {
    let norm = t % 360;
    if (norm > 180) norm -= 360;
    if (norm < -180) norm += 360;
    const dist = Math.abs(norm);
    if (dist > 90) return 0.85;
    return 1.1 - (dist / 90) * 0.25;
  });

  return (
    <motion.div
      style={{ x, z, rotateY, opacity, scale }}
      suppressHydrationWarning
      className="absolute left-1/2 top-1/2 w-[220px] md:w-[280px] aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl -ml-[110px] -mt-[165px] md:-ml-[140px] md:-mt-[210px]"
      // preserve-3d via inline style to avoid Tailwind purge issues
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ style: { x, z, rotateY, opacity, scale, transformStyle: "preserve-3d", backgroundColor: '#1a2744' } } as any)}
    >
      <Link href={`/projects?highlight=${work.id}`} className="block w-full h-full">
        <div className="w-full h-full relative">
          <Image
            src={work.src}
            alt={work.title}
            fill
            className="object-cover"
            priority={isActive}
            sizes="(max-width: 768px) 220px, 280px"
          />

          {/* Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 ${
              isActive ? "opacity-60" : "opacity-80"
            }`}
          />

          {/* Title on active card */}
          <div
            className={`absolute bottom-6 left-0 w-full text-center transition-all duration-300 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tighter drop-shadow-2xl px-2">
              {work.title}
            </h2>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function FeaturedWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(works[0].id);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const rotationIndex = useTransform(
    smoothProgress,
    [0, 1],
    [0, works.length - 1]
  );

  useMotionValueEvent(rotationIndex, "change", (latest) => {
    const idx = Math.round(latest);
    const safe = Math.max(0, Math.min(idx, works.length - 1));
    if (works[safe].id !== activeId) setActiveId(works[safe].id);
  });

  const activeWork = works.find((w) => w.id === activeId) ?? works[0];

  return (
    /* Tall container — 200 vh gives scroll room */
    <div ref={containerRef} id="works" className="relative h-[200vh] z-10" style={{ backgroundColor: '#1a2744' }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">

        {/* Header */}
        <div className="absolute top-20 left-0 w-full flex flex-col items-center z-20 pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lime-400 text-lg font-light">¬</span>
            <span className="text-xs font-bold tracking-[0.3em] text-white/60 uppercase">
              TOP
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter select-none">
            PROJECT
          </h1>
        </div>

        {/* 3-D Carousel */}
        <div
          className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center z-10 mt-24"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {works.map((work, index) => (
              <CarouselItem
                key={work.id}
                work={work}
                index={index}
                rotation={rotationIndex}
                total={works.length}
                isActive={work.id === activeId}
              />
            ))}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="relative z-20 flex flex-col items-center gap-3 mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-5 py-1.5 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm"
            >
              <span className="text-xs font-medium text-white tracking-widest uppercase">
                {activeWork.category}
              </span>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeWork.website && (
              <motion.div
                key={`website-${activeWork.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-1"
              >
                <a
                  href={activeWork.website}
                  className="flex items-center gap-2 px-5 py-2 bg-white text-black rounded-full text-xs font-bold tracking-wider uppercase hover:bg-gray-200 transition-colors"
                >
                  <span>Visit Official Website</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <Link
            href="/projects"
            className="flex items-center gap-2 text-white/40 text-[10px] tracking-widest uppercase hover:text-white transition-colors group"
          >
            <span>Explore Projects</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
