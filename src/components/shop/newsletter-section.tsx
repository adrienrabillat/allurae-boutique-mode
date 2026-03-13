"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-[clamp(60px,10vw,120px)] bg-allurae-sand text-center" id="contact">
      <div className="container-custom max-w-[540px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-allurae-terracotta text-[11px] tracking-[3px] uppercase block mb-3 font-medium">
            Restez connectée
          </span>
          <h2 className="font-display text-[clamp(32px,5vw,56px)] text-allurae-ink mb-3 tracking-[-0.5px]">
            Soyez les premières informées
          </h2>
          <p className="text-allurae-muted font-light mb-[28px] text-[15px] leading-[1.7]">
            Inscrivez-vous pour recevoir nos nouvelles collections et offres exclusives.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-[460px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="bg-allurae-warmWhite border border-allurae-sandDark sm:border-r-0 px-5 py-3.5 outline-none text-allurae-ink text-[14px] w-full focus:border-allurae-terracotta transition-colors font-light"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-allurae-terracotta border border-allurae-terracotta hover:bg-allurae-terracottaDark text-white px-9 py-3.5 text-xs font-medium uppercase tracking-[2px] transition-all duration-400 whitespace-nowrap mt-2 sm:mt-0 disabled:opacity-50"
            >
              {status === "loading" ? "..." : "S'inscrire"}
            </button>
          </form>

          {status === "success" && (
            <p className="text-allurae-sage text-[14px] mt-4 font-light">
              Merci ! Vous êtes inscrite.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-500 text-[14px] mt-4 font-light">
              Une erreur est survenue. Réessayez.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
