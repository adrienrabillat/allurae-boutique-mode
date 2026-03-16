export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PrintButton } from "@/components/admin/print-button";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderLabelPage({ params }: PageProps) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } } },
  });

  if (!order) {
    notFound();
  }

  // If we have a real Boxtal label URL, display it in an iframe
  if (order.labelUrl && order.labelUrl.startsWith("http")) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 print:bg-white print:p-0">
        <div className="w-full max-w-4xl mb-4 flex items-center justify-between print:hidden">
          <Link
            href={`/admin/orders/${id}`}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Retour à la commande
          </Link>
          <div className="flex gap-3">
            <a
              href={order.labelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Ouvrir le PDF
            </a>
            <PrintButton />
          </div>
        </div>
        <iframe
          src={order.labelUrl}
          className="w-full max-w-4xl h-[80vh] bg-white shadow-xl rounded-lg border border-gray-200 print:shadow-none print:border-none print:h-full print:max-w-none"
          title="Étiquette d'expédition"
        />
      </div>
    );
  }

  // Fallback: show order info for manual label creation
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-2xl">
        <Link
          href={`/admin/orders/${id}`}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6 inline-block print:hidden"
        >
          ← Retour à la commande
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Étiquette d&apos;expédition
            </h1>
            {order.trackingNumber && (
              <p className="text-sm text-gray-500 mt-1 font-mono">
                Suivi : {order.trackingNumber}
              </p>
            )}
          </div>

          {/* If API was unavailable, show manual instructions */}
          {(!order.labelUrl ||
            order.trackingNumber?.startsWith("ALLURAE-")) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm font-medium mb-2">
                Étiquette générée en mode fallback
              </p>
              <p className="text-amber-700 text-sm">
                L&apos;API Boxtal n&apos;a pas pu générer l&apos;étiquette
                automatiquement. Rendez-vous sur{" "}
                <a
                  href="https://www.boxtal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  boxtal.com
                </a>{" "}
                pour créer l&apos;étiquette manuellement avec les informations
                ci-dessous.
              </p>
            </div>
          )}

          {/* Shipping info summary for manual label creation */}
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Expéditeur
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">ALLURAE</p>
                <p>1 Rue de la Paix</p>
                <p>75001 Paris, France</p>
                <p>contact@allurae.fr</p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Destinataire
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">
                  {order.shippingName || order.user.name}
                </p>
                <p>{order.shippingAddress}</p>
                <p>
                  {order.shippingZip} {order.shippingCity},{" "}
                  {order.shippingCountry || "FR"}
                </p>
                {order.shippingPhone && <p>Tél: {order.shippingPhone}</p>}
                <p>{order.user.email}</p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Colis
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  {order.items.length} article(s) —{" "}
                  {order.items.reduce((s, i) => s + i.quantity, 0)} pièce(s)
                </p>
                <p>
                  Poids estimé :{" "}
                  {Math.max(
                    order.items.reduce((s, i) => s + i.quantity * 0.3, 0),
                    0.5
                  ).toFixed(1)}{" "}
                  kg
                </p>
                <p>Montant : {order.totalAmount.toFixed(2)} €</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 print:hidden">
            <a
              href="https://www.boxtal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Créer sur Boxtal.com
            </a>
            <PrintButton />
          </div>
        </div>
      </div>
    </div>
  );
}
