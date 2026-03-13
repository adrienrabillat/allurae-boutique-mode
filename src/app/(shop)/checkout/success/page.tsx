"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="section-pad bg-allurae-sand min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-[500px]">
        <CheckCircle size={64} className="text-allurae-sage mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="font-display text-[clamp(32px,5vw,48px)] text-allurae-ink mb-4">
          Merci pour votre commande !
        </h1>
        <p className="text-allurae-muted font-light text-[16px] leading-[1.7] mb-8">
          Votre commande a bien été confirmée. Vous recevrez un email de confirmation avec les détails de votre achat.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account"
            className="inline-block border border-allurae-ink text-allurae-ink hover:bg-allurae-ink hover:text-white px-9 py-3.5 text-xs font-medium uppercase tracking-[2px] transition-all duration-300"
          >
            Voir mes commandes
          </Link>
          <Link
            href="/produits"
            className="inline-block bg-allurae-terracotta hover:bg-allurae-terracottaDark text-white px-9 py-3.5 text-xs font-medium uppercase tracking-[2px] transition-all duration-300"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}
