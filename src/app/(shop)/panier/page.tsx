"use client";

import { Minus, Plus, X, ArrowLeft, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleCheckout = async () => {
    if (!session) {
      window.location.href = "/auth/signin?redirect=/panier";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.salePrice ?? item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="section-pad bg-allurae-sand min-h-[60vh] flex flex-col items-center justify-center text-center">
        <ShoppingBag size={64} strokeWidth={1} className="text-allurae-sandDark mb-6" />
        <h1 className="font-display text-[clamp(32px,5vw,48px)] text-allurae-ink mb-4">
          Votre panier est vide
        </h1>
        <p className="text-allurae-muted font-light mb-8 text-[16px]">
          Découvrez nos collections et trouvez vos pièces favorites.
        </p>
        <Link
          href="/produits"
          className="inline-block bg-allurae-terracotta hover:bg-allurae-terracottaDark text-white px-9 py-3.5 text-xs font-medium uppercase tracking-[2px] transition-all duration-300"
        >
          Découvrir la collection
        </Link>
      </div>
    );
  }

  return (
    <div className="section-pad bg-allurae-sand min-h-screen">
      <div className="container-custom max-w-[960px]">
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 text-allurae-muted hover:text-allurae-ink text-[13px] uppercase tracking-[1.5px] mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Continuer mes achats
        </Link>

        <h1 className="font-display text-[clamp(32px,5vw,48px)] text-allurae-ink mb-10">
          Votre Panier
        </h1>

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-5 bg-allurae-warmWhite p-4 border border-allurae-borderLight"
            >
              <div className="w-24 h-32 bg-allurae-sandDark rounded-[2px] overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={96}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full product-placeholder" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <Link href={`/produits/${item.slug}`}>
                    <h3 className="font-display text-[18px] text-allurae-ink hover:text-allurae-terracotta transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-allurae-muted/50 hover:text-allurae-ink transition-colors"
                    aria-label="Supprimer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-allurae-muted text-[14px] mt-1">
                  {formatPrice(item.salePrice ?? item.price)}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 border border-allurae-sandDark flex items-center justify-center hover:bg-allurae-sand transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-[14px] w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border border-allurae-sandDark flex items-center justify-center hover:bg-allurae-sand transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="text-right self-end">
                <span className="font-display text-[18px] text-allurae-ink">
                  {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-10 bg-allurae-warmWhite p-8 border border-allurae-borderLight">
          <div className="flex justify-between items-center mb-6">
            <span className="text-allurae-muted text-[16px]">Total</span>
            <span className="font-display text-3xl text-allurae-ink">
              {formatPrice(totalPrice())}
            </span>
          </div>
          <p className="text-allurae-muted/60 text-[13px] mb-6">
            Taxes et frais de livraison calculés à l&apos;étape suivante.
          </p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-allurae-terracotta hover:bg-allurae-terracottaDark text-white py-4 text-[13px] uppercase tracking-[2px] font-medium transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Redirection..." : "Procéder au paiement"}
          </button>
        </div>
      </div>
    </div>
  );
}
