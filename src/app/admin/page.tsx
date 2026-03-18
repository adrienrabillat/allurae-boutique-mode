import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const [productCount, orderCount, paidOrders, userCount] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.order.findMany({ where: { status: "PAID" } }),
    db.user.count(),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const recentOrders = await db.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Produits", value: productCount, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Commandes", value: orderCount, icon: ShoppingCart, color: "bg-green-50 text-green-600" },
    { label: "Chiffre d'affaires", value: formatPrice(revenue), icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
    { label: "Clients", value: userCount, icon: Users, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} className="sm:hidden" />
                <stat.icon size={20} className="hidden sm:block" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Commandes récentes</h2>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">#{order.id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === "PAID" ? "bg-green-100 text-green-700" :
                      order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                      order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                    Aucune commande pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-100">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-600">#{order.id.slice(-8)}</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.status === "PAID" ? "bg-green-100 text-green-700" :
                  order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                  order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{order.user.name}</span>
                <span className="text-sm font-medium text-gray-900">{formatPrice(order.totalAmount)}</span>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              Aucune commande pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
