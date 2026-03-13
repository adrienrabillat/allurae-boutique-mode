"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle2, Trash2, XCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqQuestion = {
  id: string;
  author: string;
  email: string;
  question: string;
  answer: string | null;
  isPublished: boolean;
  createdAt: string;
};

export default function AdminFaqPage() {
  const [questions, setQuestions] = useState<FaqQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      // Create an endpoint to get all FAQs for admin
      const res = await fetch("/api/admin/faq");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReplySubmit(id: string) {
    try {
      const res = await fetch(`/api/admin/faq/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: replyText, isPublished: true }),
      });

      if (res.ok) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, answer: replyText, isPublished: true } : q))
        );
        setReplyingTo(null);
        setReplyText("");
      }
    } catch (error) {
      console.error("Failed to reply", error);
    }
  }

  async function handleTogglePublish(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/admin/faq/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (res.ok) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, isPublished: !currentStatus } : q))
        );
      }
    } catch (error) {
      console.error("Failed to toggle publish status", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Voulez-vous vraiment supprimer cette question ?")) return;
    
    try {
      const res = await fetch(`/api/admin/faq/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete question", error);
    }
  }

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ & Forum</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les questions posées par les utilisateurs</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {questions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucune question pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {questions.map((q) => (
              <div key={q.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900">{q.author}</span>
                      <span className="text-sm text-gray-500">{q.email}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">
                        {format(new Date(q.createdAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                      </span>
                      {q.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 size={12} />
                          Publié
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Search size={12} />
                          En attente
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 text-base font-medium mb-4">{q.question}</p>
                    
                    {q.answer && replyingTo !== q.id ? (
                      <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3 mt-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">Votre réponse :</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{q.answer}</p>
                        </div>
                      </div>
                    ) : null}

                    {replyingTo === q.id && (
                      <div className="mt-4 space-y-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Rédigez votre réponse ici..."
                          className="w-full text-sm border-gray-300 rounded-lg shadow-sm p-3 focus:ring-allurae-terracotta focus:border-allurae-terracotta"
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReplySubmit(q.id)}
                            className="px-4 py-2 bg-allurae-ink text-white text-sm rounded-lg hover:bg-allurae-terracotta transition-colors"
                          >
                            Enregistrer & Publier
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {replyingTo !== q.id && (
                      <button
                        onClick={() => {
                          setReplyingTo(q.id);
                          setReplyText(q.answer || "");
                        }}
                        className="p-2 text-allurae-ink hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                      >
                        {q.answer ? "Modifier réponse" : "Répondre"}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleTogglePublish(q.id, q.isPublished)}
                      className={cn(
                        "p-2 rounded-lg transition-colors text-sm font-medium",
                        q.isPublished 
                          ? "text-yellow-600 hover:bg-yellow-50" 
                          : "text-green-600 hover:bg-green-50"
                      )}
                    >
                      {q.isPublished ? "Masquer" : "Publier"}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
