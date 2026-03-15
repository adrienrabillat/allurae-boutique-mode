export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Hero } from "@/components/shop/hero";
import { BrandStory } from "@/components/shop/brand-story";
import { CategoriesSection } from "@/components/shop/categories-section";
import { FeaturedSection } from "@/components/shop/featured-section";
import { ProductsSection } from "@/components/shop/products-section";
import { Lookbook } from "@/components/shop/lookbook";
import { NewsletterSection } from "@/components/shop/newsletter-section";

export default async function HomePage() {
  const products = await db.product.findMany({
    where: { active: true, featured: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <Hero />
      <BrandStory />
      <CategoriesSection />
      <FeaturedSection />
      <ProductsSection products={JSON.parse(JSON.stringify(products))} />
      <Lookbook />
      <NewsletterSection />
    </>
  );
}
