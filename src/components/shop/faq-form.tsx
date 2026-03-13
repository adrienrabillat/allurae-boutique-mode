"use client";

import { useState } from "react";

export function FaqForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const author = formData.get("author") as string;
    const email = formData.get("email") as string;
    const question = formData.get("question") as string;

    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, email, question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 md:p-12 border border-allurae-borderLight">
      <h3 className="font-display text-2xl text-allurae-ink mb-2">Posez votre question</h3>
      <p className="text-allurae-muted font-light text-[14px] mb-8">
        Si vous ne trouvez pas la réponse à votre question, n&apos;hésitez pas à nous la poser directement. Nous y répondrons publiquement ou par e-mail.
      </p>

      {success && (
        <div className="bg-allurae-sand text-allurae-ink p-4 text-[14px] mb-6 font-light border border-allurae-sandDark">
          Merci pour votre question ! Elle a été envoyée à notre équipe et sera publiée une fois validée.
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 text-[14px] mb-6 font-light border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="author" className="block text-[11px] uppercase tracking-[2px] text-allurae-ink">
              Nom
            </label>
            <input
              type="text"
              id="author"
              name="author"
              required
              className="w-full border-b border-allurae-borderLight bg-transparent py-3 text-[14px] text-allurae-ink placeholder:text-allurae-muted/40 focus:border-allurae-terracotta focus:outline-none transition-colors"
              placeholder="Votre nom"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-[11px] uppercase tracking-[2px] text-allurae-ink">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full border-b border-allurae-borderLight bg-transparent py-3 text-[14px] text-allurae-ink placeholder:text-allurae-muted/40 focus:border-allurae-terracotta focus:outline-none transition-colors"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="question" className="block text-[11px] uppercase tracking-[2px] text-allurae-ink">
            Votre question
          </label>
          <textarea
            id="question"
            name="question"
            required
            rows={4}
            className="w-full border border-allurae-borderLight bg-transparent p-4 text-[14px] text-allurae-ink placeholder:text-allurae-muted/40 focus:border-allurae-terracotta focus:outline-none transition-colors resize-none mt-2"
            placeholder="Écrivez votre question ici..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-allurae-ink text-white py-4 text-[12px] uppercase tracking-[2px] hover:bg-allurae-terracotta transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Envoi en cours..." : "Poser ma question"}
        </button>
      </form>
    </div>
  );
}
