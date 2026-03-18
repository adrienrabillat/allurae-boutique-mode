"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Upload, X, ImageIcon, Loader2, GripVertical } from "lucide-react";
import Image from "next/image";

const AVAILABLE_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"];

interface Props {
  categories: { id: string; name: string; slug: string }[];
  product?: any;
}

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    salePrice: product?.salePrice?.toString() || "",
    stock: product?.stock?.toString() || "0",
    categoryId: product?.categoryId || categories[0]?.id || "",
    imageUrl: product?.imageUrl || "",
    images: (product?.images as string[]) || [],
    sizes: (product?.sizes as string[]) || [],
    colors: product?.colors?.join(", ") || "",
    featured: product?.featured || false,
    active: product?.active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: isEdit ? f.slug : slugify(name),
    }));
  };

  const handleImageUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) {
      setError("Les fichiers doivent être des images (JPG, PNG, WebP)");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload/direct", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Upload échoué");
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      setForm((f) => {
        const newImages = [...f.images, ...uploadedUrls];
        return {
          ...f,
          images: newImages,
          imageUrl: f.imageUrl || newImages[0] || "",
        };
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "L'upload a échoué.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleImageUpload(e.dataTransfer.files);
      }
    },
    [handleImageUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleImageUpload(e.target.files);
      }
    },
    [handleImageUpload]
  );

  const removeImage = (index: number) => {
    setForm((f) => {
      const newImages = f.images.filter((_: string, i: number) => i !== index);
      return {
        ...f,
        images: newImages,
        imageUrl: newImages[0] || "",
      };
    });
  };

  const setMainImage = (index: number) => {
    setForm((f) => {
      const newImages = [...f.images];
      const [moved] = newImages.splice(index, 1);
      newImages.unshift(moved);
      return {
        ...f,
        images: newImages,
        imageUrl: newImages[0],
      };
    });
  };

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s: string) => s !== size)
        : [...f.sizes, size],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      ...form,
      price: parseFloat(form.price),
      salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
      stock: parseInt(form.stock),
      colors: form.colors
        .split(",")
        .map((c: string) => c.trim())
        .filter(Boolean),
    };

    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de la sauvegarde");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-8 max-w-2xl space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta focus:ring-1 focus:ring-allurae-terracotta outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta focus:ring-1 focus:ring-allurae-terracotta outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta focus:ring-1 focus:ring-allurae-terracotta outline-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta focus:ring-1 focus:ring-allurae-terracotta outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix soldé (€)</label>
          <input
            type="number"
            step="0.01"
            value={form.salePrice}
            onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta focus:ring-1 focus:ring-allurae-terracotta outline-none"
            placeholder="Optionnel"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta focus:ring-1 focus:ring-allurae-terracotta outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
        <select
          value={form.categoryId}
          onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta focus:ring-1 focus:ring-allurae-terracotta outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* ─── TAILLES ─── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tailles disponibles</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-4 py-2 text-sm border rounded-lg transition-all duration-200 ${
                form.sizes.includes(size)
                  ? "bg-allurae-terracotta text-white border-allurae-terracotta"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {form.sizes.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Sélectionnées : {form.sizes.join(", ")}
          </p>
        )}
      </div>

      {/* ─── IMAGES MULTIPLES ─── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images du produit
          {form.images.length > 0 && (
            <span className="text-gray-400 font-normal ml-2">({form.images.length} image{form.images.length > 1 ? "s" : ""})</span>
          )}
        </label>

        {/* Preview grid */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
            {form.images.map((url: string, index: number) => (
              <div key={`${url}-${index}`} className="relative group">
                <div
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 bg-gray-50 cursor-pointer transition-all ${
                    index === 0 ? "border-allurae-terracotta" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setMainImage(index)}
                  title={index === 0 ? "Image principale" : "Cliquer pour définir comme image principale"}
                >
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-allurae-terracotta text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                  title="Supprimer"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            dragOver
              ? "border-allurae-terracotta bg-allurae-terracotta/5"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={32} className="text-allurae-terracotta animate-spin" />
              <p className="text-sm text-gray-600">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-allurae-terracotta/10 flex items-center justify-center">
                <ImageIcon size={24} className="text-allurae-terracotta" />
              </div>
              <p className="text-sm text-gray-700 font-medium">
                Glissez vos images ici ou cliquez pour parcourir
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG ou WebP — Plusieurs images possibles — Aucune limite de taille
              </p>
            </div>
          )}
        </div>

        {/* Fallback: champ URL manuel */}
        <details className="mt-3">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
            Ou coller une URL manuellement
          </summary>
          <div className="flex gap-2 mt-2">
            <input
              type="url"
              id="manual-url-input"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta focus:ring-1 focus:ring-allurae-terracotta outline-none"
              placeholder="https://utfs.io/..."
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById("manual-url-input") as HTMLInputElement;
                if (input?.value) {
                  setForm((f) => {
                    const newImages = [...f.images, input.value];
                    return {
                      ...f,
                      images: newImages,
                      imageUrl: f.imageUrl || newImages[0],
                    };
                  });
                  input.value = "";
                }
              }}
              className="px-4 py-2 bg-allurae-terracotta text-white text-sm rounded-lg hover:bg-allurae-terracottaDark transition-colors"
            >
              Ajouter
            </button>
          </div>
        </details>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Couleurs (hex, séparées par des virgules)</label>
        <input
          type="text"
          value={form.colors}
          onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-allurae-terracotta focus:ring-1 focus:ring-allurae-terracotta outline-none"
          placeholder="#2C2C2C, #8B9E82, #C4886B"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="rounded border-gray-300"
          />
          Produit vedette
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="rounded border-gray-300"
          />
          Actif (visible sur le site)
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-allurae-terracotta text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-allurae-terracottaDark transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer le produit"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors w-full sm:w-auto"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
