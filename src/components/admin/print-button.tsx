"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
    >
      Imprimer l'étiquette
    </button>
  );
}
