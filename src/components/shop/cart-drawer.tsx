"use client";

import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[70] backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-allurae-warmWhite z-[80] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-allurae-borderLight">
          <h2 className="font-display text-2xl text-allurae-ink">Votre Panier</h2>
          <button
            onClick={closeCart}
            className="text-allurae-muted hover:text-allurae-ink transition-colors"
            aria-label="Fermer le panier"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} strokeWidth={1} className="text-allurae-sandDark mb-4" />
              <p className="text-allurae-muted text-[15px] font-light">
                Votre panier est vide
              </p>
              <button
                onClick={closeCart}
                className="mt-6 text-[12px] uppercase tracking-[2px] text-allurae-terracotta hover:text-allurae-terracottaDark transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-24 bg-allurae-sandDark rounded-[2px] overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={80}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full product-placeholder flex items-center justify-center">
                        <span className="text-[9px] uppercase tracking-wider text-allurae-muted/50">
                          Photo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-[16px] text-allurae-ink truncate">
                      {item.name}
                    </h3>
                    <p className="text-allurae-muted text-[14px] mt-0.5">
                      {formatPrice(item.salePrice ?? item.price)}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 border border-allurae-sandDark flex items-center justify-center hover:bg-allurae-sand transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-[14px] w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 border border-allurae-sandDark flex items-center justify-center hover:bg-allurae-sand transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-allurae-muted/50 hover:text-allurae-ink transition-colors self-start"
                    aria-label="Supprimer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-allurae-borderLight space-y-4">
            <div className="flex justify-between text-[16px]">
              <span className="text-allurae-muted">Total</span>
              <span className="font-display text-xl text-allurae-ink">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <Link
              href="/panier"
              onClick={closeCart}
              className="block w-full bg-allurae-ink text-white text-center py-3.5 text-[12px] uppercase tracking-[2px] font-medium hover:bg-allurae-charcoal transition-colors"
            >
              Voir le panier
            </Link>
            <button
              onClick={async () => {
                closeCart();
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

                  if (res.status === 401) {
                    window.location.href = "/auth/signin?redirect=/panier";
                    return;
                  }

                  const data = await res.json();
                  if (data.url) {
                    window.location.href = data.url;
                  }
                } catch (error) {
                  console.error("Checkout error:", error);
                }
              }}
              className="block w-full bg-allurae-terracotta text-white text-center py-3.5 text-[12px] uppercase tracking-[2px] font-medium hover:bg-allurae-terracottaDark transition-colors"
            >
              Commander
            </button>
          </div>
        )}
      </div>
    </>
  );
}
