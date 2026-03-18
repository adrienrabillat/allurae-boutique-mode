export const revalidate = 60;

import { db } from "@/lib/db";
import { ProductsGrid } from "@/components/shop/products-grid";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Pièces — ALLURAE | Vêtements Yoga, Summer & Lounge",
  description:
    "Explorez toute la collection ALLURAE : vêtements de yoga, essentiels d'été, pièces lounge et accessoires. Mode féminine entre confort et élégance.",
  openGraph: {
    title: "Nos Pièces — ALLURAE",
    description: "Vêtements de yoga, essentiels d'été et pièces lounge conçus avec intention.",
  },
};

export default async function ProductsPage() {
  const products = await db.product.findMany({
    where: { active: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="section-pad bg-allurae-sand min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-[clamp(32px,5vw,56px)]">
          <span className="text-allurae-terracotta text-[11px] tracking-[3px] uppercase font-medium inline-block mb-3">
            Catalogue
          </span>
          <h1 className="font-display text-[clamp(40px,6vw,64px)] text-allurae-ink tracking-[-0.5px] font-light">
            Toutes nos pièces
          </h1>
        </div>
        <ProductsGrid
          products={JSON.parse(JSON.stringify(products))}
          categories={categories}
        />
      </div>
    </div>
  );
}
