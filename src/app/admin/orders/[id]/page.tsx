import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { OrderActions } from "@/components/admin/order-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Commande #{order.id.slice(-8)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Passée le {new Date(order.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium self-start ${
            order.status === "PAID"
              ? "bg-green-100 text-green-700"
              : order.status === "SHIPPED"
              ? "bg-blue-100 text-blue-700"
              : order.status === "PENDING"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Client info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Client</h3>
          <p className="text-gray-900 font-medium">{order.user.name}</p>
          <p className="text-gray-600 text-sm break-all">{order.user.email}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Livraison</h3>
          {order.shippingName ? (
            <>
              <p className="text-gray-900 font-medium">{order.shippingName}</p>
              <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
              <p className="text-gray-600 text-sm">
                {order.shippingZip} {order.shippingCity}, {order.shippingCountry}
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Non renseignée</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 sm:mb-8">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Articles</h3>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="w-full">
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{item.product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">x{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatPrice(item.priceAtPurchase)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    {formatPrice(item.priceAtPurchase * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 text-lg font-semibold text-allurae-terracotta text-right">
                  {formatPrice(order.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile list */}
        <div className="sm:hidden divide-y divide-gray-50">
          {order.items.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                <p className="text-xs text-gray-500">
                  {formatPrice(item.priceAtPurchase)} x {item.quantity}
                </p>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatPrice(item.priceAtPurchase * item.quantity)}
              </span>
            </div>
          ))}
          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Total</span>
            <span className="text-lg font-semibold text-allurae-terracotta">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <OrderActions order={JSON.parse(JSON.stringify(order))} />
    </div>
  );
}
