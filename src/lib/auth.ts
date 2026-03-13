import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await resend.emails.send({
              from: "ALLURAE <onboarding@resend.dev>",
              to: user.email,
              subject: "Bienvenue chez ALLURAE",
              html: `
                <div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                  <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 300; color: #1A1A1A; text-align: center; letter-spacing: 8px; margin-bottom: 32px;">ALLURAE</h1>
                  <h2 style="font-size: 24px; font-weight: 300; color: #1A1A1A; margin-bottom: 16px;">Bienvenue ${user.name} !</h2>
                  <p style="color: #8A8580; font-weight: 300; line-height: 1.7;">
                    Nous sommes ravis de vous compter parmi nous.<br/><br/>
                    Votre compte a bien été créé. Vous pouvez dès à présent explorer notre collection et retrouver toutes vos commandes dans votre espace.
                  </p>
                  <p style="color: #8A8580; font-weight: 300; font-size: 14px; text-align: center; margin-top: 32px;">
                    © 2026 ALLURAE. Tous droits réservés.
                  </p>
                </div>
              `,
            });
            console.log(`✅ Welcome email sent to ${user.email}`);
          } catch (error) {
            console.error("Failed to send welcome email:", error);
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
