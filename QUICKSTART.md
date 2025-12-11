# ⚽ FootPredict AI - Guide de Démarrage Rapide

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration des variables d'environnement

Copiez le fichier `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

Puis éditez `.env.local` avec vos clés API :

#### Supabase
1. Créez un projet sur [Supabase](https://supabase.com)
2. Allez dans Settings → API
3. Copiez :
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

#### Anthropic Claude
1. Créez un compte sur [console.anthropic.com](https://console.anthropic.com/)
2. Générez une clé API
3. Ajoutez-la à `ANTHROPIC_API_KEY`

#### API Football (RapidAPI)
1. Créez un compte sur [RapidAPI](https://rapidapi.com)
2. Abonnez-vous à [API-Football](https://rapidapi.com/api-sports/api/api-football)
3. Copiez votre clé API → `FOOTBALL_API_KEY`

### 3. Configuration de la base de données

1. Ouvrez votre projet Supabase
2. Allez dans SQL Editor
3. Exécutez le contenu du fichier `database-schema.sql`
4. Vérifiez que toutes les tables sont créées

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du Projet

```
MatchInsight/
├── app/                    # Next.js App Router
│   ├── api/               # Routes API
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout racine
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/               # Composants Shadcn/ui
│   └── landing/          # Composants de la landing page
├── lib/                  # Utilitaires et logique métier
│   ├── api/              # Clients API (Football, Anthropic)
│   ├── supabase/         # Clients Supabase
│   ├── types/            # Types TypeScript
│   └── utils.ts          # Fonctions utilitaires
├── database-schema.sql    # Schéma de base de données
└── package.json          # Dépendances
```

## 🎯 Prochaines Étapes

1. **Tester la landing page** : Visitez http://localhost:3000
2. **Créer des routes d'authentification** : `/app/(auth)/login` et `/app/(auth)/signup`
3. **Créer la page des matchs** : `/app/(app)/matches`
4. **Intégrer l'API Football** : Importer les matchs depuis l'API
5. **Tester les prédictions** : Utiliser l'endpoint `/api/predictions`

## 🔧 Commandes Disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Vérification ESLint
- `npm run type-check` - Vérification TypeScript

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Anthropic Claude Docs](https://docs.anthropic.com)
- [API-Football Docs](https://www.api-football.com/documentation-v3)
- [Shadcn/ui Docs](https://ui.shadcn.com)

## ⚠️ Notes Importantes

- Ne commitez jamais le fichier `.env.local` (déjà dans `.gitignore`)
- Les clés API doivent rester secrètes
- Le middleware Supabase protège les routes par défaut
- Les prédictions consomment des crédits utilisateur (déduits automatiquement)

## 🐛 Dépannage

### Erreur "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur de connexion Supabase
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que le projet Supabase est actif

### Erreur API Football
- Vérifiez votre quota RapidAPI
- Vérifiez que la clé API est correcte

---

Bon développement ! 🚀

