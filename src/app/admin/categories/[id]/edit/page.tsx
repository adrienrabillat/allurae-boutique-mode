import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await db.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">Modifier : {category.name}</h1>
      <CategoryForm category={JSON.parse(JSON.stringify(category))} />
    </div>
  );
}
