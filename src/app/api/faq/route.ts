import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author, email, question } = body;

    if (!author || !email || !question) {
      return NextResponse.json(
        { error: "Tous les champs (nom, email, question) sont obligatoires." },
        { status: 400 }
      );
    }

    const newFaq = await db.faqQuestion.create({
      data: {
        author,
        email,
        question,
        isPublished: false, // Must be approved by admin
      },
    });

    return NextResponse.json({ success: true, data: newFaq });
  } catch (error) {
    console.error("FAQ creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la question." },
      { status: 500 }
    );
  }
}
