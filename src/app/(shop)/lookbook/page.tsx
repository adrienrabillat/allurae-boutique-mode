import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lookbook Été 2026 — ALLURAE | Collection Yoga & Summer",
  description: "Explorez le lookbook Été 2026 d'ALLURAE : des pièces entre flow et lumière d'été. Vêtements de yoga et essentiels d'été conçus avec intention.",
  openGraph: {
    title: "Lookbook Été 2026 — ALLURAE",
    description: "Des pièces pensées entre flow et lumière d'été.",
    images: [{ url: "/lookbook1.png", width: 1200, height: 630, alt: "ALLURAE Lookbook Été 2026" }],
  },
};

export default function LookbookPage() {
  return (
    <div className="bg-allurae-sand min-h-screen pb-24">
      {/* Header section */}
      <div className="section-pad pt-32 pb-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-allurae-muted hover:text-allurae-ink text-[12px] uppercase tracking-[2px] mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>
        <h1 className="font-display text-[clamp(40px,8vw,80px)] text-allurae-ink leading-[0.9] mb-6">
          Lookbook<br />
          <span className="italic font-light">Été 2026</span>
        </h1>
        <p className="max-w-[500px] mx-auto text-allurae-muted font-light leading-relaxed text-[16px]">
          Une collection où le mouvement rencontre l&apos;élégance. Des coupes étudiées pour 
          le studio et pensées pour la ville. Laissez-vous inspirer par la lumière d&apos;été.
        </p>
      </div>

      {/* Editorial Grid */}
      <div className="container-custom max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8 md:gap-y-24 items-center">
          
          {/* Row 1 — Ensemble fluide, architecture méditerranéenne, mouvement */}
          <div className="md:col-span-7 aspect-[4/5] relative overflow-hidden group">
            <Image
              src="/lookbook1.png"
              alt="ALLURAE Lookbook — Ensemble fluide terracotta et sable porté en mouvement dans un décor architectural méditerranéen"
              priority
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              quality={75}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
            <div className="absolute bottom-8 left-8 text-white p-4">
              <span className="text-[11px] uppercase tracking-[3px] block mb-2">01 — Le Mouvement</span>
              <h2 className="font-display text-3xl">Ensemble Terre &amp; Lumière</h2>
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9 space-y-8">
            <div className="text-allurae-ink font-light text-[18px] leading-[1.6]">
              <span className="font-display text-4xl block mb-6 text-allurae-terracotta">&ldquo;</span>
              Des silhouettes qui accompagnent chaque pas. Des matières qui respirent sous la lumière d&apos;été, entre arches de pierre et horizons ouverts.
            </div>
            <Link
              href="/produits"
              className="inline-block border-b border-allurae-ink pb-1 text-[13px] uppercase tracking-[2px] text-allurae-ink hover:text-allurae-terracotta hover:border-allurae-terracotta transition-colors"
            >
              Découvrir les pièces
            </Link>
          </div>

          {/* Row 2 — Robe lin terracotta, studio, pose contemplative */}
          <div className="md:col-span-5 aspect-[3/4] relative overflow-hidden group mt-12 md:mt-0">
            <div className="absolute -inset-10 bg-allurae-sandDark -z-10" />
            <div className="p-8 md:p-12 absolute inset-0 flex flex-col justify-center">
              <span className="text-allurae-terracotta text-[12px] uppercase tracking-[3px] mb-6">Inspiration</span>
              <h3 className="font-display text-[clamp(32px,4vw,48px)] text-allurae-ink leading-[1.1] mb-6">
                Le luxe <br />du calme.
              </h3>
              <p className="text-allurae-muted font-light leading-relaxed">
                Des coupes amples qui sculptent sans contraindre. Un lin terracotta qui tombe avec grâce, une présence sereine. La mode comme un état d&apos;esprit.
              </p>
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7 aspect-square md:aspect-[4/5] relative overflow-hidden group">
            <Image
              src="/lookbook2.png"
              alt="ALLURAE Lookbook — Robe longue en lin terracotta, pose contemplative en studio sur fond neutre"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={75}
              loading="lazy"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
            <div className="absolute bottom-8 left-8 text-white p-4">
              <span className="text-[11px] uppercase tracking-[3px] block mb-2">02 — La Sérénité</span>
              <h2 className="font-display text-3xl">Robe Lin Terracotta</h2>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-32 text-center">
          <h3 className="font-display text-4xl text-allurae-ink mb-8">Adoptez l&apos;allure.</h3>
          <Link
            href="/produits"
            className="inline-block bg-allurae-ink hover:bg-allurae-terracotta text-white px-10 py-4 text-[13px] font-medium uppercase tracking-[2px] transition-colors duration-300"
          >
            Découvrir tous les produits
          </Link>
        </div>
      </div>
    </div>
  );
}
