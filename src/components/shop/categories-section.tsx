"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  { title: "Vêtements", count: "18 pièces", img: "/images/vetemen.jpg", href: "/produits" },
  { title: "Accessoires", count: "8 pièces", img: "/images/accessoire.jpg", href: "/categories/accessoires" },
];

export function CategoriesSection() {
  return (
    <section className="section-pad bg-allurae-sand" id="collection">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-[clamp(40px,6vw,64px)]"
        >
          <span className="text-allurae-terracotta text-[11px] tracking-[4px] uppercase font-medium inline-block mb-4">
            Collections
          </span>
          <h2 className="font-display text-[clamp(40px,6vw,64px)] text-allurae-ink tracking-[-0.5px] font-light">
            Explorer par univers
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(16px,3vw,32px)]">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
            >
              <Link
                href={cat.href}
                className="group relative overflow-hidden aspect-[1.15/1] md:aspect-[1.25/1] flex flex-col justify-end block"
              >
                <div className="absolute inset-0">
                  <Image
                    src={cat.img}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-allurae-ink/80 via-allurae-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                </div>

                <div className="relative z-10 p-[clamp(24px,4vw,40px)] flex flex-col gap-2">
                  <h3 className="font-display text-[clamp(32px,4vw,48px)] text-allurae-warmWhite font-light tracking-wide">
                    {cat.title}
                  </h3>
                  <span className="text-white/60 text-[11px] tracking-[1.5px] uppercase font-light">
                    {cat.count}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
