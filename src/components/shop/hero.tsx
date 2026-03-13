"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative h-[100vh] min-h-[600px] max-h-[1000px] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80"
          alt="Yoga au lever du soleil sur la plage"
          fill
          className="object-cover object-[center_30%] animate-fade-up"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-allurae-ink/70 via-allurae-ink/20 to-allurae-ink/5" />
      </div>

      <div className="relative z-10 container-custom pb-[clamp(40px,8vw,80px)] max-w-[680px]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-white"
        >
          <span className="inline-block text-[11px] tracking-[3.5px] uppercase mb-4 font-medium bg-allurae-terracotta/25 border border-allurae-terracotta/40 backdrop-blur-sm px-5 py-2 rounded-sm text-allurae-sand">
            Summer 2026
          </span>
          <h1 className="font-display text-[clamp(48px,8vw,96px)] leading-[1.05] mb-5 font-light tracking-[-1px]">
            Breathe.
            <br />
            Move.
            <br />
            Glow.
          </h1>
          <p className="text-[clamp(15px,2vw,18px)] font-light text-white/80 mb-8 max-w-[400px]">
            Des pièces pensées entre flow et lumière d&apos;été.
          </p>
          <Link
            href="/produits"
            className="inline-block bg-allurae-terracotta hover:bg-allurae-terracottaDark hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(196,136,107,0.3)] text-white px-9 py-3.5 text-xs font-medium uppercase tracking-[2px] transition-all duration-300"
          >
            Découvrir la collection
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-12 flex-col items-center gap-2 text-white/50 z-10 hidden md:flex">
        <span className="text-[10px] tracking-[2px] uppercase writing-vertical-rl">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30 animate-scroll-line" />
      </div>
    </section>
  );
}
