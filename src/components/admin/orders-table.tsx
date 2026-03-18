"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Search, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  user: { name: string | null; email: string };
  items: any[];
};

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order | "userName" | "userEmail" | "itemsCount"; direction: "asc" | "desc" } | null>({ key: "createdAt", direction: "desc" });

  const handleSort = (key: keyof Order | "userName" | "userEmail" | "itemsCount") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = initialOrders;

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(lowerSearch) ||
          order.user.email.toLowerCase().includes(lowerSearch) ||
          (order.user.name && order.user.name.toLowerCase().includes(lowerSearch))
      );
    }

    if (sortConfig !== null) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case "id":
            aValue = a.id;
            bValue = b.id;
            break;
          case "userName":
            aValue = a.user.name || "";
            bValue = b.user.name || "";
            break;
          case "userEmail":
            aValue = a.user.email;
            bValue = b.user.email;
            break;
          case "itemsCount":
            aValue = a.items.length;
            bValue = b.items.length;
            break;
          case "totalAmount":
            aValue = a.totalAmount;
            bValue = b.totalAmount;
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            aValue = a[sortConfig.key as keyof Order];
            bValue = b[sortConfig.key as keyof Order];
            break;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [initialOrders, search, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={14} className="opacity-40" />;
    return sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-700";
      case "SHIPPED": return "bg-blue-100 text-blue-700";
      case "DELIVERED": return "bg-purple-100 text-purple-700";
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      default: return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-allurae-terracotta focus:ring-1 focus:ring-allurae-terracotta text-sm"
            placeholder="Rechercher par N° ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 text-right sm:text-left flex-shrink-0">
          {filteredAndSortedOrders.length} commande(s)
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th
                className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none group"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-1">Commande <SortIcon columnKey="id" /></div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none group"
                onClick={() => handleSort("userEmail")}
              >
                <div className="flex items-center gap-1">Client <SortIcon columnKey="userEmail" /></div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none group"
                onClick={() => handleSort("itemsCount")}
              >
                <div className="flex items-center gap-1">Articles <SortIcon columnKey="itemsCount" /></div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none group"
                onClick={() => handleSort("totalAmount")}
              >
                <div className="flex items-center gap-1">Montant <SortIcon columnKey="totalAmount" /></div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none group"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">Statut <SortIcon columnKey="status" /></div>
              </th>
              <th
                className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none group"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">Date <SortIcon columnKey="createdAt" /></div>
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono text-gray-600">
                  #{order.id.slice(-8)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                  <div className="text-xs text-gray-500">{order.user.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.items.length} article{order.items.length > 1 ? "s" : ""}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-sm text-allurae-terracotta hover:text-allurae-terracottaDark"
                  >
                    Détails
                  </Link>
                </td>
              </tr>
            ))}
            {filteredAndSortedOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                  {search ? "Aucune commande trouvée pour cette recherche." : "Aucune commande pour le moment."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-gray-100">
        {filteredAndSortedOrders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="block p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono text-gray-600">#{order.id.slice(-8)}</span>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{order.user.name}</p>
                <p className="text-xs text-gray-500 truncate">{order.user.email}</p>
              </div>
              <span className="text-sm font-semibold text-gray-900 ml-3 flex-shrink-0">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">
                {order.items.length} article{order.items.length > 1 ? "s" : ""}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </Link>
        ))}
        {filteredAndSortedOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            {search ? "Aucune commande trouvée pour cette recherche." : "Aucune commande pour le moment."}
          </div>
        )}
      </div>
    </div>
  );
}
