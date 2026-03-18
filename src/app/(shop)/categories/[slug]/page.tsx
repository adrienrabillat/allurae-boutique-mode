export const revalidate = 60;

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductsGrid } from "@/components/shop/products-grid";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: `${category.name} — ALLURAE | Collection ${category.name}`,
    description: `Découvrez notre collection ${category.name} ALLURAE. Des pièces pensées entre confort et élégance, pour le yoga, le quotidien et l'été.`,
    openGraph: {
      title: `${category.name} — ALLURAE`,
      description: `Collection ${category.name} — vêtements yoga & summer essentials.`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await db.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await db.product.findMany({
    where: { categoryId: category.id, active: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="section-pad bg-allurae-sand min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-[clamp(32px,5vw,56px)]">
          <span className="text-allurae-terracotta text-[11px] tracking-[3px] uppercase font-medium inline-block mb-3">
            Collection
          </span>
          <h1 className="font-display text-[clamp(40px,6vw,64px)] text-allurae-ink tracking-[-0.5px] font-light">
            {category.name}
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
