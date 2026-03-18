import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">Nouvelle catégorie</h1>
      <CategoryForm />
    </div>
  );
}
