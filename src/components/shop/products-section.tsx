"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  imageUrl: string | null;
  colors: string[];
  stock: number;
  category: { name: string; slug: string };
}

export function ProductsSection({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("all");

  const categories = Array.from(new Set(products.map((p) => p.category.slug)));
  const filtered =
    filter === "all" ? products : products.filter((p) => p.category.slug === filter);

  return (
    <section id="pieces" className="section-pad bg-allurae-sand">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-[clamp(32px,5vw,56px)]"
        >
          <span className="text-allurae-terracotta text-[11px] tracking-[3px] uppercase font-medium inline-block mb-3">
            Sélection
          </span>
          <h2 className="font-display text-[clamp(32px,5vw,56px)] text-allurae-ink tracking-[-0.5px]">
            Nos pépites
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2 text-[12px] uppercase tracking-[1.5px] border transition-all duration-300 font-body ${
                filter === "all"
                  ? "bg-allurae-ink text-white border-allurae-ink"
                  : "border-allurae-sandDark text-allurae-muted hover:bg-allurae-ink hover:text-white hover:border-allurae-ink bg-transparent"
              }`}
            >
              Tout
            </button>
            {categories.map((slug) => (
              <button
                key={slug}
                onClick={() => setFilter(slug)}
                className={`px-5 py-2 text-[12px] uppercase tracking-[1.5px] border transition-all duration-300 font-body ${
                  filter === slug
                    ? "bg-allurae-ink text-white border-allurae-ink"
                    : "border-allurae-sandDark text-allurae-muted hover:bg-allurae-ink hover:text-white hover:border-allurae-ink bg-transparent"
                }`}
              >
                {slug}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[clamp(16px,3vw,32px)]">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
