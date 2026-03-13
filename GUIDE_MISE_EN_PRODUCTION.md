# Guide de mise en production — ALLURAE sur Netlify

---

## Prérequis

- Nom de domaine (ex: allurae.fr) déjà acheté
- Compte Netlify
- Compte GitHub (pour le déploiement auto)
- Base de données Neon déjà en place (elle reste la même)

---

## Étape 1 : Préparer le repo Git

Pousse ton projet sur GitHub si ce n'est pas déjà fait :

```bash
git init
git add .
git commit -m "Initial commit — ALLURAE production ready"
git branch -M main
git remote add origin https://github.com/TON_USER/allurae.git
git push -u origin main
```

---

## Étape 2 : Installer le plugin Next.js sur Netlify

Netlify a besoin d'un plugin spécial pour Next.js 15 (App Router, SSR, API routes).

Crée un fichier `netlify.toml` à la racine du projet :

```toml
[build]
  command = "npx prisma generate && npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Puis installe le plugin :

```bash
npm install -D @netlify/plugin-nextjs
```

---

## Étape 3 : Configurer Netlify

1. Va sur **app.netlify.com** → "Add new site" → "Import an existing project"
2. Connecte ton repo GitHub
3. Netlify détectera automatiquement Next.js
4. Build command : `npx prisma generate && npm run build`
5. Publish directory : `.next`

---

## Étape 4 : Variables d'environnement (CRITIQUE)

Dans **Netlify → Site settings → Environment variables**, ajoute TOUTES ces variables.

### Variables à CHANGER pour la production :

| Variable | Valeur production | Notes |
|----------|-------------------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://allurae.fr` | Ton nom de domaine AVEC https |
| `BETTER_AUTH_URL` | `https://allurae.fr` | Même chose |
| `BETTER_AUTH_SECRET` | **Génère une nouvelle clé** | `openssl rand -base64 32` |

### Variables Stripe — PASSER EN MODE LIVE :

| Variable | Action |
|----------|--------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Remplacer `pk_test_...` par `pk_live_...` (depuis dashboard.stripe.com → Developers → API keys, en mode LIVE) |
| `STRIPE_SECRET_KEY` | Remplacer `sk_test_...` par `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Créer un nouveau webhook en prod (voir étape 5) |

### Variables à GARDER telles quelles :

| Variable | Pourquoi |
|----------|----------|
| `DATABASE_URL` | Ta base Neon fonctionne déjà en prod |
| `RESEND_API_KEY` | Fonctionne partout |
| `UPLOADTHING_TOKEN` | Fonctionne partout |
| `UPLOADTHING_SECRET` | Fonctionne partout |
| `UPLOADTHING_APP_ID` | Fonctionne partout |
| `BOXTAL_ACCESS_KEY` | Fonctionne partout |
| `BOXTAL_SECRET_KEY` | Fonctionne partout |

### Variables Google OAuth — METTRE À JOUR :

| Variable | Action |
|----------|--------|
| `GOOGLE_CLIENT_ID` | Garder le même |
| `GOOGLE_CLIENT_SECRET` | Garder le même |

Mais dans la **Google Cloud Console**, ajouter l'URI de redirection de production :
```
https://allurae.fr/api/auth/callback/google
```

---

## Étape 5 : Configurer Stripe en production

### 5a. Activer le mode Live

1. Va sur **dashboard.stripe.com**
2. Clique sur "Developers" en haut
3. Désactive le mode Test (toggle en haut à droite)
4. Copie tes clés **Live** (pk_live_... et sk_live_...)

### 5b. Créer le webhook de production

1. Stripe Dashboard → Developers → Webhooks
2. "Add endpoint"
3. URL : `https://allurae.fr/api/stripe/webhook`
4. Événements à écouter : `checkout.session.completed`
5. Copie le "Signing secret" → c'est ton nouveau `STRIPE_WEBHOOK_SECRET`

### 5c. Compléter ton compte Stripe

Pour recevoir de vrais paiements, Stripe te demandera de compléter ton profil :
- Informations d'entreprise (ou auto-entrepreneur)
- Coordonnées bancaires (IBAN pour les virements)
- Pièce d'identité

---

## Étape 6 : Configurer le domaine personnalisé

1. Netlify → Site settings → Domain management → "Add custom domain"
2. Entre `allurae.fr`
3. Netlify te donnera des serveurs DNS ou un enregistrement CNAME

### Option A — DNS Netlify (recommandé) :
Chez ton registrar (OVH, Gandi, etc.), change les nameservers vers ceux de Netlify.

### Option B — CNAME :
Ajoute un enregistrement CNAME :
```
www  →  ton-site.netlify.app
```
Et un enregistrement A pour le domaine nu :
```
@  →  75.2.60.5  (IP Netlify)
```

4. Active le HTTPS : Netlify → Domain settings → HTTPS → "Verify DNS" → Let's Encrypt automatique

---

## Étape 7 : Configurer Google OAuth en production

1. Google Cloud Console → APIs & Services → Credentials
2. Ouvre ton OAuth 2.0 Client ID
3. Dans "Authorized JavaScript origins", ajoute :
   ```
   https://allurae.fr
   ```
4. Dans "Authorized redirect URIs", ajoute :
   ```
   https://allurae.fr/api/auth/callback/google
   ```
5. Sauvegarde

---

## Étape 8 : Configurer Resend (emails) en production

1. Va sur **resend.com** → Domains
2. Ajoute `allurae.fr` comme domaine vérifié
3. Ajoute les enregistrements DNS (DKIM, SPF) fournis par Resend
4. Une fois vérifié, change le `from` dans ton code d'envoi d'emails :
   - Actuellement : `ALLURAE <onboarding@resend.dev>`
   - Production : `ALLURAE <contact@allurae.fr>`

---

## Étape 9 : Appliquer les migrations Prisma

Depuis ta machine locale, lance :

```bash
npx prisma db push
```

Cela mettra à jour ta base Neon avec les nouveaux champs (images[], sizes[], etc.).

---

## Étape 10 : Déployer

```bash
git add .
git commit -m "Production ready"
git push origin main
```

Netlify déploie automatiquement à chaque push sur main.

---

## Checklist finale avant de lancer

- [ ] Variables d'environnement Netlify toutes remplies
- [ ] `NEXT_PUBLIC_APP_URL` et `BETTER_AUTH_URL` = `https://allurae.fr`
- [ ] Nouveau `BETTER_AUTH_SECRET` généré
- [ ] Clés Stripe en mode **Live** (pk_live_..., sk_live_...)
- [ ] Webhook Stripe créé avec URL de prod
- [ ] Google OAuth : redirect URI de prod ajoutée
- [ ] Domaine configuré + HTTPS actif
- [ ] Resend : domaine vérifié + emails envoyés depuis @allurae.fr
- [ ] `npx prisma db push` exécuté
- [ ] Test : créer un compte, ajouter un produit, passer une commande test
- [ ] Vérifier que le sitemap est accessible : `https://allurae.fr/sitemap.xml`
- [ ] Vérifier robots.txt : `https://allurae.fr/robots.txt`
- [ ] Soumettre le sitemap à Google Search Console

---

## Après le lancement

1. **Google Search Console** : ajoute ton site et soumets le sitemap
2. **Google Analytics** : installe GA4 pour le suivi des visites
3. **Test de performance** : Lance PageSpeed Insights sur tes pages clés
4. **Monitoring** : Vérifie les logs Netlify pour les erreurs
