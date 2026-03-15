export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { db } from "@/lib/db";
import { FaqForm } from "@/components/shop/faq-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ & Forum — ALLURAE | Vos questions, nos réponses",
  description:
    "Consultez les réponses aux questions les plus fréquentes sur nos collections, la livraison, les retours et l'entretien. Posez votre question à la communauté ALLURAE.",
  openGraph: {
    title: "FAQ & Forum — ALLURAE",
    description: "Consultez les réponses aux questions les plus fréquentes ou posez la vôtre.",
  },
};

export default async function FaqPage() {
  const publishedQuestions = await db.faqQuestion.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-allurae-sand min-h-screen">
      <div className="container-custom max-w-[900px] py-24 md:py-32">
        <div className="text-center mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-allurae-muted hover:text-allurae-ink text-[12px] uppercase tracking-[2px] mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Retour à l&apos;accueil
          </Link>
          <h1 className="font-display text-[clamp(40px,6vw,70px)] text-allurae-ink leading-[0.9] mb-6">
            FAQ <span className="italic font-light">& Forum</span>
          </h1>
          <p className="max-w-[500px] mx-auto text-allurae-muted font-light leading-relaxed text-[15px]">
            Retrouvez ici les questions fréquentes de notre communauté. Une interrogation sur une coupe, 
            une matière ou la livraison ? Cherchez ci-dessous ou posez-nous directement la question.
          </p>
        </div>

        {/* Existing FAQ List */}
        <div className="mb-24 space-y-6">
          {publishedQuestions.length === 0 ? (
            <div className="text-center text-allurae-muted font-light italic">
              Aucune question n&apos;a encore été posée. Soyez le premier !
            </div>
          ) : (
            publishedQuestions.map((q) => (
              <div key={q.id} className="bg-white p-8 border border-allurae-borderLight group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-2xl text-allurae-ink leading-tight pr-8">
                    {q.question}
                  </h3>
                </div>
                <div className="text-[12px] text-allurae-muted uppercase tracking-[1px] mb-6">
                  Posée par <span className="font-medium text-allurae-ink">{q.author}</span> le {new Date(q.createdAt).toLocaleDateString('fr-FR')}
                </div>
                
                {q.answer && (
                  <div className="bg-allurae-sand/50 p-6 border-l-2 border-allurae-terracotta">
                    <span className="block text-[11px] uppercase tracking-[2px] text-allurae-terracotta mb-2 font-medium">Réponse ALLURAE</span>
                    <p className="text-allurae-ink font-light leading-relaxed text-[15px] whitespace-pre-wrap">
                      {q.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Form Section */}
        <div id="poser-question">
          <FaqForm />
        </div>

      </div>
    </div>
  );
}
