# 📋 Plan de Développement Complet - FootPredict AI

## 🎯 Vue d'ensemble

Ce document détaille le plan de développement complet pour l'application FootPredict AI, incluant l'authentification Supabase, la sauvegarde de projets, et toutes les fonctionnalités principales.

---

## 📦 Phase 1 : Authentification Complète (Priorité: HAUTE)

### 1.1 Correction du Middleware
**Status**: ⚠️ À corriger
- [x] Middleware de base créé
- [ ] Corriger le bug ligne 71 dans `lib/supabase/middleware.ts`
- [ ] Tester la redirection des routes protégées

**Fichiers à modifier**:
- `lib/supabase/middleware.ts` (ligne 71 - syntaxe incorrecte)

### 1.2 Pages d'Authentification
**Status**: ❌ À créer

#### 1.2.1 Page de Connexion (`/app/(auth)/login/page.tsx`)
- [ ] Formulaire de connexion (email + password)
- [ ] Gestion des erreurs (email invalide, mot de passe incorrect)
- [ ] Lien vers inscription
- [ ] Redirection après connexion réussie
- [ ] "Se souvenir de moi" optionnel
- [ ] Lien "Mot de passe oublié"

**Composants nécessaires**:
- `components/auth/LoginForm.tsx`
- `components/auth/AuthLayout.tsx`

#### 1.2.2 Page d'Inscription (`/app/(auth)/signup/page.tsx`)
- [ ] Formulaire d'inscription (email, password, full_name)
- [ ] Validation des champs (Zod)
- [ ] Confirmation par email (optionnel)
- [ ] Redirection après inscription
- [ ] Gestion des erreurs (email déjà utilisé, etc.)

**Composants nécessaires**:
- `components/auth/SignupForm.tsx`

#### 1.2.3 Page de Réinitialisation (`/app/(auth)/reset-password/page.tsx`)
- [ ] Formulaire de demande de réinitialisation
- [ ] Page de confirmation
- [ ] Formulaire de nouveau mot de passe

**Composants nécessaires**:
- `components/auth/ResetPasswordForm.tsx`

### 1.3 Server Actions pour l'Authentification
**Status**: ❌ À créer

#### 1.3.1 Actions d'Authentification (`/app/actions/auth.ts`)
```typescript
// Fonctions à créer:
- signUp(email, password, fullName)
- signIn(email, password)
- signOut()
- resetPassword(email)
- updatePassword(newPassword)
- resendConfirmationEmail(email)
```

**Fonctionnalités**:
- [ ] Validation avec Zod
- [ ] Gestion des erreurs Supabase
- [ ] Messages d'erreur en français
- [ ] Création automatique du profil (via trigger)

### 1.4 Gestion de Session
**Status**: ⚠️ Partiel

#### 1.4.1 Hook de Session (`/hooks/useAuth.ts`)
- [ ] Hook React pour accéder à la session utilisateur
- [ ] État de chargement
- [ ] Rafraîchissement automatique de session
- [ ] Gestion des erreurs

#### 1.4.2 Provider d'Authentification (`/components/providers/AuthProvider.tsx`)
- [ ] Context React pour l'authentification
- [ ] Partage de l'état utilisateur global
- [ ] Écoute des changements d'auth

### 1.5 Routes Protégées
**Status**: ⚠️ Partiel

#### Routes à protéger:
- [ ] `/app/(app)/dashboard` - Tableau de bord
- [ ] `/app/(app)/matches` - Liste des matchs
- [ ] `/app/(app)/matches/[id]` - Détail d'un match
- [ ] `/app/(app)/predictions` - Mes prédictions
- [ ] `/app/(app)/profile` - Profil utilisateur
- [ ] `/app/(app)/settings` - Paramètres

**Middleware**: Déjà en place, à tester

---

## 💾 Phase 2 : Sauvegarde de Projets/Prédictions (Priorité: HAUTE)

### 2.1 Structure de Données
**Status**: ✅ Tables créées

**Tables existantes**:
- ✅ `predictions` - Prédictions IA
- ✅ `user_favorites` - Favoris utilisateurs
- ✅ `credit_transactions` - Transactions

### 2.2 API Routes pour les Prédictions
**Status**: ⚠️ Partiel

#### 2.2.1 Routes existantes à améliorer
- [x] `POST /api/predictions` - Créer une prédiction
- [ ] `GET /api/predictions` - Lister les prédictions de l'utilisateur
- [ ] `GET /api/predictions/[id]` - Récupérer une prédiction
- [ ] `PUT /api/predictions/[id]` - Mettre à jour une prédiction
- [ ] `DELETE /api/predictions/[id]` - Supprimer une prédiction

#### 2.2.2 Fonctionnalités à ajouter
- [ ] Pagination des prédictions
- [ ] Filtrage par date, match, statut
- [ ] Tri (date, confiance, etc.)
- [ ] Recherche de prédictions
- [ ] Export des prédictions (JSON, CSV)

### 2.3 Sauvegarde de Projets Personnalisés
**Status**: ❌ À créer

#### 2.3.1 Nouvelle Table: `user_projects`
```sql
CREATE TABLE user_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  predictions JSONB, -- Array de prediction IDs
  settings JSONB, -- Paramètres du projet
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fonctionnalités**:
- [ ] Créer un projet
- [ ] Ajouter des prédictions à un projet
- [ ] Partager un projet (lien public)
- [ ] Dupliquer un projet
- [ ] Archiver un projet

#### 2.3.2 API Routes pour Projets
- [ ] `POST /api/projects` - Créer un projet
- [ ] `GET /api/projects` - Lister les projets
- [ ] `GET /api/projects/[id]` - Récupérer un projet
- [ ] `PUT /api/projects/[id]` - Mettre à jour
- [ ] `DELETE /api/projects/[id]` - Supprimer
- [ ] `POST /api/projects/[id]/share` - Générer lien de partage

---

## 👤 Phase 3 : Gestion du Profil Utilisateur (Priorité: MOYENNE)

### 3.1 Page de Profil (`/app/(app)/profile/page.tsx`)
**Status**: ❌ À créer

**Fonctionnalités**:
- [ ] Affichage des informations du profil
- [ ] Édition du nom complet
- [ ] Upload d'avatar (Supabase Storage)
- [ ] Affichage des statistiques (prédictions, crédits, etc.)
- [ ] Historique des transactions de crédits
- [ ] Gestion de l'abonnement

**Composants**:
- `components/profile/ProfileHeader.tsx`
- `components/profile/ProfileForm.tsx`
- `components/profile/AvatarUpload.tsx`
- `components/profile/StatsCard.tsx`
- `components/profile/CreditHistory.tsx`

### 3.2 Paramètres (`/app/(app)/settings/page.tsx`)
**Status**: ❌ À créer

**Sections**:
- [ ] Compte (email, mot de passe)
- [ ] Notifications
- [ ] Préférences (langue, thème)
- [ ] Abonnement
- [ ] Danger zone (suppression de compte)

### 3.3 Server Actions pour Profil
**Status**: ❌ À créer

**Fichier**: `/app/actions/profile.ts`
- [ ] `updateProfile(data)`
- [ ] `uploadAvatar(file)`
- [ ] `updatePassword(newPassword)`
- [ ] `deleteAccount()`

---

## 🏠 Phase 4 : Dashboard et Navigation (Priorité: HAUTE)

### 4.1 Layout Principal (`/app/(app)/layout.tsx`)
**Status**: ❌ À créer

**Composants**:
- [ ] `components/layout/Header.tsx` - Navigation principale
- [ ] `components/layout/Sidebar.tsx` - Menu latéral (mobile)
- [ ] `components/layout/UserMenu.tsx` - Menu utilisateur
- [ ] `components/layout/NotificationBell.tsx` - Notifications

### 4.2 Dashboard (`/app/(app)/dashboard/page.tsx`)
**Status**: ❌ À créer

**Sections**:
- [ ] Statistiques rapides (prédictions, crédits, précision)
- [ ] Prédictions récentes
- [ ] Matchs à venir favoris
- [ ] Graphiques de performance
- [ ] Suggestions de matchs

**Composants**:
- `components/dashboard/StatsGrid.tsx`
- `components/dashboard/RecentPredictions.tsx`
- `components/dashboard/UpcomingMatches.tsx`
- `components/dashboard/PerformanceChart.tsx`

---

## ⚽ Phase 5 : Gestion des Matchs (Priorité: HAUTE)

### 5.1 Liste des Matchs (`/app/(app)/matches/page.tsx`)
**Status**: ❌ À créer

**Fonctionnalités**:
- [ ] Liste des matchs à venir
- [ ] Filtres (ligue, date, équipe)
- [ ] Recherche
- [ ] Pagination
- [ ] Tri (date, ligue)
- [ ] Favoris (marquer/démarquer)

**Composants**:
- `components/matches/MatchList.tsx`
- `components/matches/MatchCard.tsx`
- `components/matches/MatchFilters.tsx`
- `components/matches/MatchSearch.tsx`

### 5.2 Détail d'un Match (`/app/(app)/matches/[id]/page.tsx`)
**Status**: ❌ À créer

**Sections**:
- [ ] Informations du match (équipes, date, lieu)
- [ ] Statistiques des équipes
- [ ] Forme récente
- [ ] Confrontations directes
- [ ] Bouton "Générer prédiction"
- [ ] Prédictions précédentes (si existantes)

**Composants**:
- `components/matches/MatchHeader.tsx`
- `components/matches/TeamStats.tsx`
- `components/matches/HeadToHead.tsx`
- `components/matches/PredictionButton.tsx`

### 5.3 Synchronisation avec API Football
**Status**: ⚠️ Partiel

**Fonctionnalités**:
- [ ] Cron job pour importer les matchs (Vercel Cron)
- [ ] Mise à jour automatique des scores
- [ ] Cache des données (1 heure)
- [ ] Gestion des erreurs API

**Fichiers**:
- `app/api/cron/sync-matches/route.ts`
- `lib/api/football-sync.ts`

---

## 🤖 Phase 6 : Système de Prédictions IA (Priorité: HAUTE)

### 6.1 Génération de Prédictions
**Status**: ⚠️ Partiel

**Améliorations**:
- [ ] Cache des prédictions (1 heure)
- [ ] Gestion des erreurs Anthropic
- [ ] Retry logic
- [ ] Rate limiting
- [ ] Validation des données avant prédiction

### 6.2 Affichage des Prédictions
**Status**: ❌ À créer

**Composants**:
- `components/predictions/PredictionCard.tsx`
- `components/predictions/ConfidenceScore.tsx`
- `components/predictions/ProbabilityChart.tsx`
- `components/predictions/KeyFactors.tsx`
- `components/predictions/AnalysisText.tsx`

### 6.3 Historique et Performance
**Status**: ❌ À créer

**Fonctionnalités**:
- [ ] Calcul de la précision des prédictions
- [ ] Graphiques de performance
- [ ] Comparaison avec les résultats réels
- [ ] Statistiques détaillées

---

## 💳 Phase 7 : Système de Crédits (Priorité: MOYENNE)

### 7.1 Gestion des Crédits
**Status**: ✅ Table créée

**Fonctionnalités**:
- [x] Déduction automatique (via trigger)
- [ ] Affichage des crédits dans le header
- [ ] Achat de crédits (Stripe - futur)
- [ ] Historique des transactions
- [ ] Notifications de crédits faibles

### 7.2 API Routes
- [ ] `GET /api/credits` - Récupérer les crédits
- [ ] `GET /api/credits/transactions` - Historique
- [ ] `POST /api/credits/purchase` - Achat (futur)

---

## 🔔 Phase 8 : Notifications (Priorité: BASSE)

### 8.1 Système de Notifications
**Status**: ❌ À créer

**Types de notifications**:
- [ ] Nouvelle prédiction disponible
- [ ] Match commencé (pour favoris)
- [ ] Résultat d'un match prédit
- [ ] Crédits faibles
- [ ] Nouveau match favori

**Implémentation**:
- [ ] Table `notifications` dans Supabase
- [ ] Real-time subscriptions (Supabase Realtime)
- [ ] Badge de notifications
- [ ] Centre de notifications

---

## 🎨 Phase 9 : UI/UX et Composants (Priorité: MOYENNE)

### 9.1 Composants Shadcn manquants
- [ ] `toast` - Notifications toast
- [ ] `dialog` - Modales
- [ ] `dropdown-menu` - Menus déroulants
- [ ] `select` - Sélecteurs
- [ ] `tabs` - Onglets
- [ ] `avatar` - Avatars
- [ ] `skeleton` - Loading states
- [ ] `badge` - Badges
- [ ] `progress` - Barres de progression

### 9.2 Composants Custom
- [ ] `MatchCard` - Carte de match
- [ ] `PredictionCard` - Carte de prédiction
- [ ] `TeamLogo` - Logo d'équipe
- [ ] `ConfidenceMeter` - Indicateur de confiance
- [ ] `LoadingSpinner` - Spinner de chargement
- [ ] `ErrorBoundary` - Gestion d'erreurs

### 9.3 Responsive Design
- [ ] Mobile-first approach
- [ ] Tablette optimisée
- [ ] Desktop amélioré

---

## 🧪 Phase 10 : Tests et Qualité (Priorité: MOYENNE)

### 10.1 Tests Unitaires
- [ ] Tests des utilitaires
- [ ] Tests des Server Actions
- [ ] Tests des composants (React Testing Library)

### 10.2 Tests d'Intégration
- [ ] Tests des API routes
- [ ] Tests de l'authentification
- [ ] Tests des prédictions

### 10.3 E2E Tests
- [ ] Flow d'inscription/connexion
- [ ] Création de prédiction
- [ ] Gestion du profil

---

## 🚀 Phase 11 : Déploiement et Production (Priorité: HAUTE)

### 11.1 Configuration Vercel
- [ ] Variables d'environnement
- [ ] Domain personnalisé
- [ ] SSL/HTTPS

### 11.2 Optimisations
- [ ] Images optimisées (Next.js Image)
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Cache stratégies

### 11.3 Monitoring
- [ ] Vercel Analytics
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

---

## 📊 Priorisation et Timeline

### Sprint 1 (Semaine 1-2) - MVP Authentification
1. ✅ Correction middleware
2. ✅ Pages login/signup
3. ✅ Server Actions auth
4. ✅ Gestion de session
5. ✅ Routes protégées

### Sprint 2 (Semaine 3-4) - Core Features
1. ✅ Dashboard
2. ✅ Liste des matchs
3. ✅ Détail d'un match
4. ✅ Génération de prédictions
5. ✅ Affichage des prédictions

### Sprint 3 (Semaine 5-6) - Sauvegarde et Profil
1. ✅ API prédictions complète
2. ✅ Projets personnalisés
3. ✅ Page de profil
4. ✅ Paramètres

### Sprint 4 (Semaine 7-8) - Polish
1. ✅ UI/UX améliorations
2. ✅ Notifications
3. ✅ Tests
4. ✅ Déploiement

---

## 🛠️ Outils et Technologies

### Déjà configurés:
- ✅ Next.js 14 (App Router)
- ✅ TypeScript
- ✅ Tailwind CSS + Shadcn/ui
- ✅ Supabase (Auth + Database)
- ✅ Anthropic Claude API
- ✅ API Football

### À ajouter:
- [ ] React Query / SWR (data fetching)
- [ ] Zod (validation)
- [ ] React Hook Form (formulaires)
- [ ] Recharts (graphiques)
- [ ] date-fns (dates)
- [ ] Framer Motion (animations)

---

## 📝 Notes Importantes

1. **Sécurité**: Toujours valider les inputs, utiliser RLS, ne jamais exposer les clés API
2. **Performance**: Cache les prédictions, pagination, lazy loading
3. **UX**: Loading states, error handling, feedback utilisateur
4. **Accessibilité**: ARIA labels, keyboard navigation, contrastes

---

## 🔄 Utilisation du MCP Supabase

Le MCP Supabase permet de:
- ✅ Exécuter du SQL directement
- ✅ Lister les tables
- ✅ Générer les types TypeScript
- ✅ Gérer les migrations
- ✅ Déployer des Edge Functions

**Commandes utiles**:
- Utiliser `generate_typescript_types` pour générer les types depuis la DB
- Utiliser `execute_sql` pour tester des requêtes
- Utiliser `list_tables` pour vérifier la structure

---

**Dernière mise à jour**: 2024
**Version du plan**: 1.0

