import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">Nouveau produit</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
