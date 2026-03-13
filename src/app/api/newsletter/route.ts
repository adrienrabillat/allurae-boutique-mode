import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Save to newsletter table
    await db.newsletter.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Send welcome email
    await resend.emails.send({
      from: "ALLURAE <onboarding@resend.dev>",
      to: email,
      subject: "Bienvenue chez ALLURAE ✦",
      html: `
        <div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center;">
          <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 300; color: #1A1A1A; letter-spacing: 8px; margin-bottom: 32px;">ALLURAE</h1>
          <h2 style="font-size: 24px; font-weight: 300; color: #1A1A1A;">Merci de nous rejoindre</h2>
          <p style="color: #8A8580; font-weight: 300; line-height: 1.7;">Vous serez parmi les premières à découvrir nos nouvelles collections et offres exclusives.</p>
          <p style="color: #8A8580; font-weight: 300; font-size: 14px; margin-top: 32px;">© 2026 ALLURAE</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
