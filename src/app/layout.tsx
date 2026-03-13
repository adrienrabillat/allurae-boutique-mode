import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://allurae.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ALLURAE — Vêtements Yoga & Summer Essentials | Mode Éco-responsable",
    template: "%s | ALLURAE",
  },
  description:
    "ALLURAE : marque française de vêtements entre yoga et lifestyle. Des pièces pensées pour le mouvement et l'élégance, conçues avec des matières nobles. Collection Été 2026.",
  keywords: [
    "ALLURAE",
    "vêtements yoga",
    "mode yoga femme",
    "summer essentials",
    "vêtements été",
    "mode éco-responsable",
    "yoga lifestyle",
    "vêtements lounge",
    "collection été 2026",
    "marque française",
    "mode minimaliste",
    "luxe discret",
  ],
  authors: [{ name: "ALLURAE" }],
  creator: "ALLURAE",
  icons: {
    icon: "/favicon.png?v=4",
    apple: "/apple-icon.png?v=4",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "ALLURAE",
    title: "ALLURAE — Vêtements Yoga & Summer Essentials",
    description:
      "Des pièces pensées entre flow et lumière d'été. Vêtements de yoga et essentiels d'été conçus avec intention.",
    images: [
      {
        url: "/lookbook1.png",
        width: 1200,
        height: 630,
        alt: "ALLURAE — Collection Été 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALLURAE — Yoga & Summer Essentials",
    description: "Des pièces pensées entre flow et lumière d'été. Collection Été 2026.",
    images: ["/lookbook1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
