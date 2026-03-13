import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, subject, message } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email et message sont obligatoires." },
        { status: 400 }
      );
    }

    const subjectLabels: Record<string, string> = {
      order: "Ma commande",
      product: "Un produit / taille",
      return: "Retour & Échange",
      other: "Autre demande",
    };

    const subjectLabel = subjectLabels[subject] || "Autre demande";
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Anonyme";

    await resend.emails.send({
      from: "ALLURAE Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `[ALLURAE] ${subjectLabel} — ${fullName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-size: 24px; letter-spacing: 6px; color: #1a1a1a; font-weight: 300; margin: 0;">ALLURAE</h1>
            <p style="font-size: 12px; color: #999; margin: 8px 0 0; text-transform: uppercase; letter-spacing: 2px;">Nouveau message de contact</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; width: 120px; vertical-align: top;">Nom</td>
              <td style="padding: 8px 0; color: #1a1a1a; font-size: 15px;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Email</td>
              <td style="padding: 8px 0; color: #1a1a1a; font-size: 15px;"><a href="mailto:${email}" style="color: #C17A56;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Sujet</td>
              <td style="padding: 8px 0; color: #1a1a1a; font-size: 15px;">${subjectLabel}</td>
            </tr>
          </table>

          <div style="background: #f8f6f3; padding: 24px; margin-bottom: 30px;">
            <p style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Message</p>
            <p style="color: #1a1a1a; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="font-size: 12px; color: #ccc; text-align: center; margin-top: 40px;">
            Ce message a été envoyé depuis le formulaire de contact allurae.fr
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
