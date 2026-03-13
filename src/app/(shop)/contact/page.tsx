import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/shop/contact-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — ALLURAE | Service Client & Questions",
  description:
    "Contactez l'équipe ALLURAE pour toute question sur nos collections, votre commande ou la livraison. Réponse sous 24h.",
  openGraph: {
    title: "Contact — ALLURAE",
    description: "Contactez l'équipe ALLURAE. Réponse sous 24h.",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-allurae-sand min-h-screen">
      <div className="container-custom max-w-[1200px] py-32 md:py-48">
        <div className="text-center mb-24">
          <h1 className="font-display text-[clamp(40px,8vw,80px)] text-allurae-ink leading-[0.9] mb-6">
            Contact
          </h1>
          <p className="max-w-[400px] mx-auto text-allurae-muted font-light leading-relaxed text-[16px]">
            Une question sur une pièce ? Un conseil sur les tailles ?
            Nous sommes là pour vous accompagner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 lg:gap-32 max-w-[1000px] mx-auto">

          {/* Contact Form */}
          <div className="order-2 md:order-1">
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="order-1 md:order-2 space-y-12 pt-4">
            <div>
              <h3 className="text-[11px] uppercase tracking-[3px] text-allurae-muted mb-8">Informations</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Mail className="text-allurae-terracotta mt-1 w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h4 className="font-display text-lg text-allurae-ink mb-1">Email</h4>
                    <a href="mailto:contact@allurae.com" className="text-allurae-muted hover:text-allurae-ink transition-colors font-light text-[15px]">
                      contact@allurae.com
                    </a>
                    <p className="text-[13px] text-allurae-muted/60 mt-1">Nous répondons sous 24h à 48h ouvrées.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="text-allurae-terracotta mt-1 w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h4 className="font-display text-lg text-allurae-ink mb-1">Téléphone</h4>
                    <p className="text-allurae-muted font-light text-[15px]">+33 (0)1 23 45 67 89</p>
                    <p className="text-[13px] text-allurae-muted/60 mt-1">Du Lundi au Vendredi, de 10h à 18h.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-allurae-terracotta mt-1 w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h4 className="font-display text-lg text-allurae-ink mb-1">Studio</h4>
                    <p className="text-allurae-muted font-light text-[15px] leading-relaxed">
                      12 Rue du Mouvement<br />
                      75003 Paris<br />
                      France
                    </p>
                    <p className="text-[13px] text-allurae-muted/60 mt-1">Sur rendez-vous uniquement.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-allurae-borderLight">
              <h3 className="text-[11px] uppercase tracking-[3px] text-allurae-ink mb-4">FAQ</h3>
              <p className="text-allurae-muted font-light text-[15px] mb-4">
                Retrouvez les réponses aux questions les plus fréquentes concernant les livraisons, retours et entretiens de nos pièces.
              </p>
              <Link
                href="/faq"
                className="inline-block border-b border-allurae-ink pb-1 text-[13px] uppercase tracking-[2px] text-allurae-ink hover:text-allurae-terracotta hover:border-allurae-terracotta transition-colors"
              >
                Consulter la FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
