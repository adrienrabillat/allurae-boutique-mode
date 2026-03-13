"use client";

import { useRouter } from "next/navigation";

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer la catégorie "${name}" ? Cela ne fonctionnera que si elle ne contient aucun produit.`)) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700">
      Supprimer
    </button>
  );
}
