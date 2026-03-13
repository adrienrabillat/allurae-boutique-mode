"use client";

import { useRouter } from "next/navigation";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${name}" ?`)) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-500 hover:text-red-700"
    >
      Supprimer
    </button>
  );
}
