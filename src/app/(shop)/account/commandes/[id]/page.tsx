export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";

const STATUS_STEPS = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente de paiement",
  PAID: "Paiement confirmé",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  PENDING: Clock,
  PAID: CheckCircle2,
  SHIPPED: Truck,
  DELIVERED: Package,
  CANCELLED: XCircle,
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-600",
  PAID: "text-green-600",
  SHIPPED: "text-blue-600",
  DELIVERED: "text-allurae-sage",
  CANCELLED: "text-red-500",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/signin?redirect=/account");
  }

  const order = await db.order.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: {
        include: { product: { select: { name: true, slug: true, imageUrl: true } } },
      },
    },
  });

  if (!order) notFound();

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";
  const StatusIcon = STATUS_ICONS[order.status] ?? Package;

  return (
    <div className="section-pad bg-allurae-sand min-h-screen">
      <div className="container-custom max-w-[720px]">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-allurae-muted hover:text-allurae-ink text-[13px] uppercase tracking-[1.5px] mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Mes commandes
        </Link>

        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="font-display text-[clamp(28px,4vw,40px)] text-allurae-ink font-light">
              Commande #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-allurae-muted text-[14px] mt-1">
              Passée le{" "}
              {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className={`flex items-center gap-2 text-[14px] font-medium ${STATUS_COLORS[order.status] ?? "text-allurae-muted"}`}>
            <StatusIcon size={18} strokeWidth={1.5} />
            {STATUS_LABELS[order.status] ?? order.status}
          </div>
        </div>

        {/* Progress tracker */}
        {!isCancelled && (
          <div className="bg-allurae-warmWhite border border-allurae-borderLight p-6 mb-6">
            <div className="flex items-center gap-0">
              {STATUS_STEPS.map((step, i) => {
                const done = currentStep >= i;
                const isLast = i === STATUS_STEPS.length - 1;
                return (
                  <div key={step} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          done
                            ? "bg-allurae-terracotta border-allurae-terracotta"
                            : "bg-white border-allurae-sandDark"
                        }`}
                      >
                        {done && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-[1px] whitespace-nowrap ${
                          done ? "text-allurae-ink" : "text-allurae-muted/50"
                        }`}
                      >
                        {step === "PENDING" ? "Attente" : step === "PAID" ? "Payée" : step === "SHIPPED" ? "Expédiée" : "Livrée"}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`flex-1 h-[1.5px] mx-1 mb-5 transition-all ${
                          currentStep > i ? "bg-allurae-terracotta" : "bg-allurae-sandDark"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="mt-5 pt-4 border-t border-allurae-borderLight">
                <p className="text-[13px] text-allurae-muted">
                  Numéro de suivi :{" "}
                  <span className="font-mono text-allurae-ink font-medium">
                    {order.trackingNumber}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Articles */}
        <div className="bg-allurae-warmWhite border border-allurae-borderLight mb-6">
          <div className="px-6 py-4 border-b border-allurae-borderLight">
            <h2 className="text-[11px] uppercase tracking-[2px] text-allurae-muted">
              Articles ({order.items.length})
            </h2>
          </div>
          <div className="divide-y divide-allurae-borderLight">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-14 h-18 bg-allurae-sandDark flex-shrink-0 overflow-hidden" style={{ height: "72px" }}>
                  {item.product.imageUrl ? (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      width={56}
                      height={72}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full product-placeholder" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/produits/${item.product.slug}`}
                    className="text-[14px] text-allurae-ink hover:text-allurae-terracotta transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-[12px] text-allurae-muted mt-0.5">
                    Qté : {item.quantity}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display text-[16px] text-allurae-ink">
                    {formatPrice(item.priceAtPurchase * item.quantity)}
                  </p>
                  <p className="text-[11px] text-allurae-muted">
                    {formatPrice(item.priceAtPurchase)} / unité
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Récapitulatif + livraison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {order.shippingAddress && (
            <div className="bg-allurae-warmWhite border border-allurae-borderLight p-5">
              <h3 className="text-[11px] uppercase tracking-[2px] text-allurae-muted mb-3">
                Adresse de livraison
              </h3>
              <p className="text-[13px] text-allurae-ink leading-[1.8] whitespace-pre-line">
                {order.shippingAddress}
              </p>
            </div>
          )}

          <div className="bg-allurae-warmWhite border border-allurae-borderLight p-5">
            <h3 className="text-[11px] uppercase tracking-[2px] text-allurae-muted mb-3">
              Récapitulatif
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[13px] text-allurae-muted">
                <span>Sous-total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-allurae-muted">
                <span>Livraison</span>
                <span>Incluse</span>
              </div>
              <div className="flex justify-between text-[15px] text-allurae-ink font-medium pt-2 border-t border-allurae-borderLight">
                <span>Total</span>
                <span className="font-display text-[18px]">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
