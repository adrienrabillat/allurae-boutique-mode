# Allurae — boutique e-commerce de mode

Boutique en ligne complète pour une marque de mode : du catalogue jusqu'à l'étiquette d'expédition.

## Fonctionnalités

**Côté client**
- Catalogue par catégories, fiches produit, lookbook
- Panier persistant, paiement Stripe, suivi des commandes depuis le compte client
- Inscription et connexion (e-mail ou Google), newsletter, FAQ, formulaire de contact

**Côté administration**
- Gestion des produits, catégories et FAQ, avec upload d'images
- Suivi des commandes, génération des étiquettes de livraison via l'API Boxtal
- E-mails transactionnels via Resend : bienvenue, confirmation de commande, formulaire de contact

## Stack

Next.js 15 (App Router), TypeScript, Prisma + PostgreSQL (Neon), Better Auth, Stripe, UploadThing, Resend, Zustand, Tailwind CSS, Radix UI.

## Modèle de données

`User`, `Session`, `Account`, `Category`, `Product`, `Order`, `OrderItem`, `Newsletter`, `FaqQuestion` (voir `prisma/schema.prisma`).

## Lancer en local

```bash
cp .env.example .env    # puis renseigner les clés (Stripe en mode test)
npm install
npx prisma generate && npx prisma db push
npx tsx prisma/seed.ts  # produits de démonstration
npm run dev
```

Guides détaillés : [SETUP.md](SETUP.md) et [GUIDE_MISE_EN_PRODUCTION.md](GUIDE_MISE_EN_PRODUCTION.md).
