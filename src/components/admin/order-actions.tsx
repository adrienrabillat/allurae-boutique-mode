"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Package } from "lucide-react";

interface Props {
  order: any;
}

export function OrderActions({ order }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shippingResult, setShippingResult] = useState<string | null>(null);

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateShippingLabel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/shipping`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setShippingResult("Étiquette générée avec succès !");
        if (data.labelUrl) {
          window.open(data.labelUrl, "_blank");
        }
        router.refresh();
      } else {
        setShippingResult(data.error || "Erreur lors de la génération");
      }
    } catch {
      setShippingResult("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>

      <div className="flex flex-wrap gap-3">
        {order.status === "PAID" && (
          <>
            <button
              onClick={() => updateStatus("SHIPPED")}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Truck size={16} />
              Marquer expédié
            </button>
            <button
              onClick={generateShippingLabel}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-allurae-terracotta text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-allurae-terracottaDark transition-colors disabled:opacity-50"
            >
              <Package size={16} />
              Générer Étiquette (Boxtal)
            </button>
          </>
        )}

        {order.status === "SHIPPED" && (
          <button
            onClick={() => updateStatus("DELIVERED")}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            Marquer livré
          </button>
        )}

        {order.status === "PENDING" && (
          <button
            onClick={() => updateStatus("CANCELLED")}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
        )}
      </div>

      {order.trackingNumber && (
        <p className="text-sm text-gray-600 mt-4">
          N° de suivi : <span className="font-mono font-medium">{order.trackingNumber}</span>
        </p>
      )}

      {shippingResult && (
        <p className="text-sm mt-4 text-allurae-terracotta">{shippingResult}</p>
      )}
    </div>
  );
}
