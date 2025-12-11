# ⚽ FootPredict AI

Plateforme d'analyses de matchs de football propulsée par l'intelligence artificielle.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ et npm/yarn/pnpm
- Compte Supabase (gratuit)
- Clé API Anthropic Claude
- Clé API Football (RapidAPI ou Football-Data.org)

### Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Configuration Supabase**

a. Créer un projet sur [Supabase](https://supabase.com)

b. Exécuter le schéma SQL fourni dans `database-schema.sql` dans l'éditeur SQL de Supabase

c. Copier les clés API :
   - Settings → API → Project URL
   - Settings → API → anon/public key
   - Settings → API → service_role key

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
# Éditer .env.local avec vos clés
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📂 Structure du Projet

```
footpredict-ai/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Routes d'authentification
│   ├── (app)/               # Routes de l'application
│   ├── api/                 # API routes
│   └── layout.tsx
├── components/              # Composants React
│   ├── ui/                  # Composants Shadcn
│   ├── layout/              # Header, Footer, etc.
│   ├── landing/             # Page d'accueil
│   └── matches/             # Composants matchs
├── lib/                     # Utilitaires et logique
│   ├── supabase/           # Client Supabase
│   ├── api/                # Clients API externes
│   └── utils/              # Fonctions utilitaires
└── hooks/                   # Custom React hooks
```

## 🔑 Configuration des APIs

### 1. Supabase

- Créer un projet sur supabase.com
- Exécuter les migrations SQL
- Activer l'authentification par email

### 2. Anthropic Claude

- S'inscrire sur console.anthropic.com
- Créer une clé API
- Ajouter dans .env.local

### 3. Football API

**Option A : API-Football (RapidAPI)**
- S'inscrire sur rapidapi.com
- S'abonner à API-Football (plan gratuit : 100 req/jour)
- Récupérer la clé

**Option B : Football-Data.org**
- S'inscrire sur football-data.org
- Plan gratuit : 10 appels/minute
- Meilleur pour débuter

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les env variables sur vercel.com
```

## 📄 Licence

MIT

---

**Créé avec ❤️ et ⚡ par l'équipe FootPredict AI**

