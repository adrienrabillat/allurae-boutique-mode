import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Package, ArrowRight } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
  SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
  DELIVERED: "bg-allurae-sage/20 text-allurae-ink border-allurae-sage/30",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

export const metadata = {
  title: "Mon compte — ALLURAE",
};

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/signin?redirect=/account");
  }

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: { select: { name: true, imageUrl: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="section-pad bg-allurae-sand min-h-screen">
      <div className="container-custom max-w-[800px]">
        {/* Header */}
        <div className="mb-10">
          <span className="text-allurae-terracotta text-[11px] tracking-[3px] uppercase font-medium inline-block mb-3">
            Mon compte
          </span>
          <h1 className="font-display text-[clamp(36px,5vw,52px)] text-allurae-ink font-light">
            Bonjour, {session.user.name?.split(" ")[0] ?? "vous"}
          </h1>
          <p className="text-allurae-muted text-[14px] mt-2">{session.user.email}</p>
        </div>

        {/* Orders */}
        <h2 className="text-[11px] uppercase tracking-[2.5px] text-allurae-muted mb-5">
          Mes commandes ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="bg-allurae-warmWhite border border-allurae-borderLight p-12 text-center">
            <Package size={48} strokeWidth={1} className="text-allurae-sandDark mx-auto mb-4" />
            <p className="text-allurae-muted font-light text-[15px] mb-6">
              Vous n&apos;avez pas encore de commande.
            </p>
            <Link
              href="/produits"
              className="inline-block bg-allurae-terracotta hover:bg-allurae-terracottaDark text-white px-8 py-3 text-[12px] uppercase tracking-[2px] transition-all duration-300"
            >
              Découvrir la collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/commandes/${order.id}`}
                className="group block bg-allurae-warmWhite border border-allurae-borderLight hover:border-allurae-terracotta/40 transition-all duration-300 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-[13px] text-allurae-ink">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[11px] uppercase tracking-[1px] border font-medium ${
                          STATUS_COLORS[order.status] ?? "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                      {order.trackingNumber && (
                        <span className="text-[11px] text-allurae-muted">
                          Suivi : {order.trackingNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-allurae-muted mb-3">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {" · "}
                      {order.items.length} article{order.items.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {order.items.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className="text-[12px] text-allurae-muted bg-allurae-sand px-2 py-0.5"
                        >
                          {item.product.name}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-[12px] text-allurae-muted">
                          +{order.items.length - 3} autre{order.items.length - 3 > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-display text-[20px] text-allurae-ink">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <span className="text-allurae-terracotta text-[12px] group-hover:underline flex items-center gap-1 justify-end mt-1">
                      Voir <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
