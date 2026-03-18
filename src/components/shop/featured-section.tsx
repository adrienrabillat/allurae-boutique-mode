"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function FeaturedSection() {
  return (
    <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
          alt="Plage tropicale turquoise"
          fill
          sizes="100vw"
          quality={70}
          loading="lazy"
          className="object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-allurae-ink/45" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-[560px] px-10 text-white"
      >
        <span className="text-white/70 text-[11px] tracking-[3px] uppercase font-medium mb-3 inline-block">
          Summer Vibes
        </span>
        <h2 className="font-display text-[clamp(32px,5vw,56px)] leading-[1.15] tracking-[-0.5px]">
          Du studio
          <br />à la plage
        </h2>
        <p className="text-white/80 text-[16px] leading-[1.7] mt-4 font-light">
          Des matières techniques et fluides, des teintes solaires. Portez-les partout.
        </p>
      </motion.div>
    </section>
  );
}
