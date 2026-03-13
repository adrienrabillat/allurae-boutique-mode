"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "./product-card";

interface Props {
  product: any;
  related: any[];
}

export function ProductDetail({ product, related }: Props) {
  // Build image list: use images array, fallback to single imageUrl
  const allImages: string[] =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const { addItem } = useCartStore();
  const inStock = product.stock > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: selectedSize ? `${product.id}-${selectedSize}` : product.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        salePrice: product.salePrice,
        imageUrl: allImages[0] || product.imageUrl,
        size: selectedSize,
      });
    }
  };

  return (
    <div className="bg-allurae-sand min-h-screen">
      <div className="container-custom py-8">
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 text-allurae-muted hover:text-allurae-ink text-[13px] uppercase tracking-[1.5px] mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Retour aux produits
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(32px,6vw,80px)]">
          {/* ─── IMAGE GALLERY ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main image */}
            <div
              className={`aspect-[3/4] overflow-hidden rounded-[2px] ${
                allImages.length === 0 ? "product-placeholder bg-allurae-sandDark" : ""
              }`}
            >
              {allImages.length > 0 ? (
                <Image
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[13px] tracking-[2px] uppercase text-allurae-muted/50">
                    Photo à venir
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {allImages.map((url: string, index: number) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-20 rounded-[2px] overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? "border-allurae-terracotta"
                        : "border-transparent hover:border-allurae-sandDark"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} ${index + 1}`}
                      width={64}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ─── INFO ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <span className="text-allurae-terracotta text-[11px] tracking-[3px] uppercase font-medium mb-2">
              {product.category.name}
            </span>

            <h1 className="font-display text-[clamp(32px,4vw,48px)] text-allurae-ink leading-[1.15] tracking-[-0.5px] mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              {product.salePrice ? (
                <>
                  <span className="font-display text-3xl text-allurae-terracotta">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-allurae-muted text-xl line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-display text-3xl text-allurae-ink">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-allurae-muted font-light leading-[1.8] text-[16px] mb-8">
                {product.description}
              </p>
            )}

            {/* Sizes */}
            {hasSizes && (
              <div className="mb-6">
                <span className="text-[11px] uppercase tracking-[2px] text-allurae-muted block mb-3">
                  Taille
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`min-w-[48px] h-10 px-3 border text-[13px] tracking-wider transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-allurae-ink text-white border-allurae-ink"
                          : "bg-transparent text-allurae-ink border-allurae-sandDark hover:border-allurae-ink"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-red-500 text-[12px] mt-2">
                    Veuillez sélectionner une taille
                  </p>
                )}
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <span className="text-[11px] uppercase tracking-[2px] text-allurae-muted block mb-3">
                  Couleurs disponibles
                </span>
                <div className="flex gap-2">
                  {product.colors.map((c: string, idx: number) => (
                    <span
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-allurae-sandDark cursor-pointer hover:border-allurae-terracotta transition-colors"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            {inStock ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-allurae-sandDark">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-allurae-sand transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-[14px]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-allurae-sand transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-allurae-terracotta hover:bg-allurae-terracottaDark text-white py-3.5 text-[12px] uppercase tracking-[2px] font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Ajouter au panier
                </button>
              </div>
            ) : (
              <div className="bg-allurae-sandDark py-3.5 text-center text-[12px] uppercase tracking-[2px] text-allurae-muted">
                Rupture de stock
              </div>
            )}

            <p className="text-allurae-muted/60 text-[12px] mt-4">
              {product.stock > 0 ? `${product.stock} en stock` : ""}
            </p>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-[clamp(60px,10vw,120px)]">
            <h2 className="font-display text-[clamp(24px,3vw,36px)] text-allurae-ink text-center mb-10">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[clamp(16px,3vw,32px)]">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
