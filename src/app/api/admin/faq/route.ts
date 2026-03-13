import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const faqs = await db.faqQuestion.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error("Erreur récupération FAQ admin:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
