export const revalidate = 60;

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/product-detail";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://allurae.fr";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) return {};

  const images = (product as any).images?.length > 0
    ? (product as any).images
    : product.imageUrl
      ? [product.imageUrl]
      : [];

  return {
    title: `${product.name} — ALLURAE`,
    description:
      product.description ||
      `Découvrez ${product.name} par ALLURAE. ${product.category.name} — vêtements yoga & summer essentials.`,
    openGraph: {
      title: `${product.name} — ALLURAE`,
      description: product.description || `Découvrez ${product.name} par ALLURAE`,
      url: `${siteUrl}/produits/${product.slug}`,
      images: images.length > 0 ? images.map((img: string) => ({ url: img })) : undefined,
      type: "website",
    },
    alternates: {
      canonical: `${siteUrl}/produits/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  // Related products (same category)
  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      active: true,
    },
    include: { category: { select: { name: true, slug: true } } },
    take: 4,
  });

  // JSON-LD structured data for product
  const images = (product as any).images?.length > 0
    ? (product as any).images
    : product.imageUrl
      ? [product.imageUrl]
      : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} par ALLURAE`,
    image: images,
    brand: {
      "@type": "Brand",
      name: "ALLURAE",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/produits/${product.slug}`,
      priceCurrency: "EUR",
      price: product.salePrice ?? product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "ALLURAE",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail
        product={JSON.parse(JSON.stringify(product))}
        related={JSON.parse(JSON.stringify(related))}
      />
    </>
  );
}
