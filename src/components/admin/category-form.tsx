"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

interface Props {
  category?: { id: string; name: string; slug: string; image?: string | null };
}

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const isEdit = !!category;

  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    image: category?.image || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/categories/${category.id}` : "/api/categories";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Erreur");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 max-w-lg space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm((f) => ({ ...f, name: e.target.value, slug: isEdit ? f.slug : slugify(e.target.value) }))
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optionnel)</label>
        <input
          type="url"
          value={form.image}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta outline-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-allurae-terracotta text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-allurae-terracottaDark transition-colors disabled:opacity-50"
        >
          {loading ? "..." : isEdit ? "Mettre à jour" : "Créer"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg text-sm text-gray-600 border border-gray-300 hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
