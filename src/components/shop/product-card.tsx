"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    imageUrl?: string | null;
    colors: string[];
    stock: number;
    category: { name: string; slug: string };
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const inStock = product.stock > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer relative"
    >
      <Link href={`/produits/${product.slug}`}>
        <div
          className={`relative aspect-[3/4] overflow-hidden bg-allurae-sandDark mb-4 rounded-[2px] ${
            !product.imageUrl ? "product-placeholder" : ""
          }`}
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
              className="object-cover transition-transform duration-600 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] tracking-[2px] uppercase text-allurae-muted opacity-50">
                Photo à venir
              </span>
            </div>
          )}

          {!inStock && (
            <span className="absolute top-3 left-3 bg-allurae-ink/85 backdrop-blur-[8px] text-white px-3 py-1.5 text-[10px] uppercase tracking-[1.5px] font-medium z-10">
              Rupture de stock
            </span>
          )}

          {product.salePrice && (
            <span className="absolute top-3 right-3 bg-allurae-terracotta text-white px-3 py-1.5 text-[10px] uppercase tracking-[1.5px] font-medium z-10">
              Soldé
            </span>
          )}

          {inStock && (
            <div className="absolute inset-0 bg-allurae-warmWhite/35 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center z-[5]">
              <span className="bg-allurae-ink/90 text-white px-[24px] py-[10px] text-[11px] uppercase tracking-[2px] font-medium">
                Voir le produit
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="px-1 pb-2">
        <span className="text-[10px] uppercase tracking-[1.5px] text-allurae-terracotta font-medium block mb-1">
          {product.category.name}
        </span>
        <Link href={`/produits/${product.slug}`}>
          <h3 className="font-display text-[20px] text-allurae-ink font-normal hover:text-allurae-terracotta transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          {product.salePrice ? (
            <>
              <p className="text-allurae-terracotta text-[14px] font-medium">
                {formatPrice(product.salePrice)}
              </p>
              <p className="text-allurae-muted text-[13px] line-through">
                {formatPrice(product.price)}
              </p>
            </>
          ) : (
            <p className="text-allurae-muted text-[14px]">{formatPrice(product.price)}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex gap-[6px]">
            {product.colors?.map((c, idx) => (
              <span
                key={idx}
                className="w-[14px] h-[14px] rounded-full border-[1.5px] border-allurae-sandDark"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {inStock && (
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  salePrice: product.salePrice,
                  imageUrl: product.imageUrl,
                });
              }}
              className="p-2 text-allurae-muted hover:text-allurae-terracotta transition-colors"
              aria-label="Ajouter au panier"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
