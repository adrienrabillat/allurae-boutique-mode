"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  { src: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&q=80", alt: "Femme stretching yoga studio", className: "md:row-span-2" },
  { src: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&q=80", alt: "Yoga studio lumière naturelle", className: "" },
  { src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80", alt: "Méditation plage coucher soleil", className: "" },
  { src: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=900&q=80", alt: "Yoga groupe plein air été", className: "md:col-span-2" },
];

export function Lookbook() {
  return (
    <section className="section-pad bg-allurae-warmWhite pt-0" id="lookbook">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-[clamp(32px,5vw,56px)]"
        >
          <span className="text-allurae-terracotta text-[11px] tracking-[3px] uppercase font-medium inline-block mb-3">
            Lookbook
          </span>
          <h2 className="font-display text-[clamp(32px,5vw,56px)] text-allurae-ink tracking-[-0.5px]">
            Été en mouvement
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(16px,3vw,32px)] auto-rows-[260px]">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`${img.className} overflow-hidden rounded-[2px] relative group h-full`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
