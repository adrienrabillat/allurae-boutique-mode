"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function BrandStory() {
  return (
    <section className="section-pad bg-allurae-sand" id="about">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-[clamp(32px,6vw,80px)] items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 md:order-1"
        >
          <span className="text-allurae-terracotta text-[11px] tracking-[3px] uppercase font-medium inline-block mb-3">
            Notre philosophie
          </span>
          <h2 className="font-display text-[clamp(32px,5vw,56px)] text-allurae-ink mb-6 leading-[1.15] tracking-[-0.5px]">
            Entre studio
            <br />& rivage
          </h2>
          <p className="text-allurae-muted font-light leading-[1.8] text-[16px] max-w-[440px]">
            Allurae est né de cette dualité : la discipline d&apos;un flow matinal et la liberté d&apos;un été sans fin. Chaque pièce est conçue pour accompagner votre mouvement, du tapis de yoga aux ruelles ensoleillées.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 md:order-2 overflow-hidden rounded-[2px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
            alt="Femme en posture de yoga"
            width={800}
            height={1067}
            className="w-full aspect-[3/4] object-cover hover:scale-[1.03] transition-transform duration-[800ms] ease-out"
          />
        </motion.div>
      </div>
    </section>
  );
}
