# ALLURAE E-Commerce — Guide d'installation

## Prérequis
- Node.js 18+
- npm ou pnpm

## Installation

```bash
# 1. Entrer dans le projet
cd allurae-ecommerce

# 2. Installer les dépendances
npm install

# 3. Générer le client Prisma
npx prisma generate

# 4. Pousser le schéma vers la base Neon
npx prisma db push

# 5. Seeder la base avec les produits
npx tsx prisma/seed.ts

# 6. Lancer le serveur de développement
npm run dev
```

## Créer un compte Admin

Après le premier lancement, créez un compte via `/auth/signup`, puis promouvez-le en admin :

```sql
-- Via Prisma Studio (npx prisma studio) ou directement dans Neon Console
UPDATE "User" SET role = 'ADMIN' WHERE email = 'votre@email.com';
```

## Stripe Webhooks (développement local)

```bash
# Dans un terminal séparé
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Structure du projet

```
allurae-ecommerce/
├── prisma/
│   ├── schema.prisma    # Schéma BDD complet
│   └── seed.ts          # Données initiales (12 produits, 4 catégories)
├── src/
│   ├── app/
│   │   ├── (shop)/      # Pages publiques (accueil, produits, panier, checkout)
│   │   ├── admin/       # Panel admin protégé (CRUD produits, catégories, commandes)
│   │   ├── auth/        # Pages connexion / inscription
│   │   └── api/         # Routes API (auth, stripe, newsletter, CRUD, shipping)
│   ├── components/
│   │   ├── admin/       # Composants admin (sidebar, formulaires, actions)
│   │   ├── layout/      # Layout partagé (navbar, footer, announcement bar)
│   │   └── shop/        # Composants boutique (hero, products, cart drawer...)
│   ├── lib/             # Configurations (db, auth, stripe, resend, uploadthing)
│   ├── store/           # Zustand (panier persisté)
│   └── types/           # Types TypeScript
├── .env.local           # Variables d'environnement (toutes les clés)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## Pages publiques
- `/` — Accueil (hero, brand story, catégories, featured, produits vedettes, lookbook, newsletter)
- `/produits` — Catalogue complet avec filtres par catégorie
- `/produits/[slug]` — Page produit détaillée
- `/categories/[slug]` — Produits par catégorie
- `/panier` — Panier avec récapitulatif et bouton checkout
- `/checkout/success` — Confirmation de commande
- `/auth/signin` — Connexion
- `/auth/signup` — Inscription

## Panel Admin (`/admin`)
- Dashboard avec KPIs (produits, commandes, CA, clients)
- CRUD Produits (créer, modifier, supprimer, gérer stock et prix soldé)
- CRUD Catégories
- Gestion des commandes (détails, statuts, génération étiquette Boxtal)

## Intégrations
- **Stripe Checkout** : Redirection sécurisée, webhook pour validation
- **Resend** : Emails de confirmation de commande + newsletter
- **Uploadthing** : Upload d'images produits (admin)
- **Boxtal** : Génération d'étiquettes d'expédition (admin)
- **Better Auth** : Authentification email/mot de passe avec rôles USER/ADMIN
- **Zustand** : Panier persisté dans localStorage
