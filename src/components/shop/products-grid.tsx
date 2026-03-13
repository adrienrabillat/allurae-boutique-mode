"use client";

import { useState } from "react";
import { ProductCard } from "./product-card";

interface Props {
  products: any[];
  categories: { id: string; name: string; slug: string }[];
}

export function ProductsGrid({ products, categories }: Props) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? products
      : products.filter((p) => p.category.slug === filter);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
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
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setFilter(cat.slug)}
            className={`px-5 py-2 text-[12px] uppercase tracking-[1.5px] border transition-all duration-300 font-body ${
              filter === cat.slug
                ? "bg-allurae-ink text-white border-allurae-ink"
                : "border-allurae-sandDark text-allurae-muted hover:bg-allurae-ink hover:text-white hover:border-allurae-ink bg-transparent"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[clamp(16px,3vw,32px)]">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-allurae-muted text-[15px] font-light py-20">
          Aucun produit trouvé dans cette catégorie.
        </p>
      )}
    </>
  );
}
