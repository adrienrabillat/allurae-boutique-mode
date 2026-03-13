import { db } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Catégories</h1>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-allurae-terracotta text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-allurae-terracottaDark transition-colors"
        >
          <Plus size={18} />
          Nouvelle catégorie
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Produits</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{cat.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{cat._count.products}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/categories/${cat.id}/edit`} className="text-sm text-allurae-terracotta hover:text-allurae-terracottaDark">
                    Modifier
                  </Link>
                  <DeleteCategoryButton id={cat.id} name={cat.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
