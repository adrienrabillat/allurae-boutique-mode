"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "order",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.message) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", subject: "order", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-allurae-warmWhite p-8 md:p-12 border border-allurae-borderLight text-center py-16">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-6" strokeWidth={1.5} />
        <h2 className="font-display text-2xl text-allurae-ink mb-4">Message envoyé</h2>
        <p className="text-allurae-muted font-light leading-relaxed text-[15px] mb-8">
          Merci pour votre message. Nous vous répondrons dans les plus brefs délais,
          généralement sous 24 à 48 heures ouvrées.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="inline-block border-b border-allurae-ink pb-1 text-[13px] uppercase tracking-[2px] text-allurae-ink hover:text-allurae-terracotta hover:border-allurae-terracotta transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-allurae-warmWhite p-8 md:p-12 border border-allurae-borderLight">
      <h2 className="font-display text-2xl text-allurae-ink mb-8">Nous écrire</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-[11px] uppercase tracking-[2px] text-allurae-ink">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full bg-allurae-sand p-3 border border-transparent focus:border-allurae-sandDark outline-none transition-colors text-sm"
                placeholder="Jane"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-[11px] uppercase tracking-[2px] text-allurae-ink">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full bg-allurae-sand p-3 border border-transparent focus:border-allurae-sandDark outline-none transition-colors text-sm"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-[11px] uppercase tracking-[2px] text-allurae-ink">
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-allurae-sand p-3 border border-transparent focus:border-allurae-sandDark outline-none transition-colors text-sm"
              placeholder="jane@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-[11px] uppercase tracking-[2px] text-allurae-ink">
              Sujet
            </label>
            <select
              id="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-allurae-sand p-3 border border-transparent focus:border-allurae-sandDark outline-none transition-colors text-sm appearance-none rounded-none"
            >
              <option value="order">Ma commande</option>
              <option value="product">Un produit / taille</option>
              <option value="return">Retour & Échange</option>
              <option value="other">Autre demande</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-[11px] uppercase tracking-[2px] text-allurae-ink">
              Message *
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-allurae-sand p-3 border border-transparent focus:border-allurae-sandDark outline-none transition-colors text-sm resize-none"
              placeholder="Comment pouvons-nous vous aider ?"
            />
          </div>
        </div>

        {status === "error" && (
          <div className="flex items-center gap-3 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>Une erreur est survenue. Veuillez réessayer.</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-allurae-ink hover:bg-allurae-terracotta text-white py-4 text-[13px] uppercase tracking-[2px] font-medium transition-colors duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {status === "sending" ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Envoi en cours…
            </>
          ) : (
            <>
              <Send size={16} strokeWidth={1.5} />
              Envoyer le message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
