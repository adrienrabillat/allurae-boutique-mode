import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Produits</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-allurae-terracotta text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium hover:bg-allurae-terracottaDark transition-colors"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nouveau produit</span>
          <span className="sm:hidden">Nouveau</span>
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Produit</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Prix</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-allurae-sandDark rounded overflow-hidden flex-shrink-0">
                      {product.imageUrl && (
                        <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.salePrice ? (
                    <span>
                      <span className="text-allurae-terracotta">{formatPrice(product.salePrice)}</span>
                      <span className="line-through text-gray-400 ml-1">{formatPrice(product.price)}</span>
                    </span>
                  ) : (
                    formatPrice(product.price)
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={product.stock <= 5 ? "text-red-600 font-medium" : "text-gray-600"}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {product.active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-sm text-allurae-terracotta hover:text-allurae-terracottaDark"
                  >
                    Modifier
                  </Link>
                  <DeleteProductButton id={product.id} name={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-allurae-sandDark rounded-lg overflow-hidden flex-shrink-0">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                    product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {product.active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{product.category.name}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm font-medium text-gray-900">
                    {product.salePrice ? (
                      <>
                        <span className="text-allurae-terracotta">{formatPrice(product.salePrice)}</span>
                        <span className="line-through text-gray-400 ml-1 text-xs">{formatPrice(product.price)}</span>
                      </>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </span>
                  <span className={`text-xs ${product.stock <= 5 ? "text-red-600 font-medium" : "text-gray-500"}`}>
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="text-sm text-allurae-terracotta hover:text-allurae-terracottaDark font-medium"
              >
                Modifier
              </Link>
              <DeleteProductButton id={product.id} name={product.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
