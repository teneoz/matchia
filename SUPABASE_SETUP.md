# Configuration Supabase - MatchInsight

## ✅ Variables d'environnement configurées

Les variables suivantes ont été ajoutées dans `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://jvzqfowyaksyweleblyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hDnlSTzlj-2Zq0QDLGilGA_d0QRmjZT
SUPABASE_URL=https://jvzqfowyaksyweleblyk.supabase.co
SUPABASE_ANON_KEY=sb_publishable_hDnlSTzlj-2Zq0QDLGilGA_d0QRmjZT
```

## 📋 Prochaines étapes

### 1. Créer les tables dans Supabase

1. Allez sur votre projet Supabase : https://supabase.com/dashboard/project/jvzqfowyaksyweleblyk
2. Ouvrez le **SQL Editor**
3. Copiez le contenu du fichier `database-schema.sql`
4. Exécutez le script SQL
5. Vérifiez que les tables sont créées dans l'onglet **Table Editor**

### 2. Redémarrer le serveur

```bash
# Arrêtez le serveur actuel (Ctrl+C)
# Puis relancez-le
npm run dev
```

### 3. Tester la connexion

Une fois le serveur redémarré, testez la connexion :

```bash
# Via curl
curl http://localhost:3000/api/test-supabase

# Ou ouvrez dans votre navigateur
http://localhost:3000/api/test-supabase
```

### 4. Vérifier les utilisateurs

Pour récupérer les utilisateurs depuis `auth.users`, vous devez également ajouter dans `.env.local` :

```bash
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```

Vous pouvez trouver cette clé dans : **Settings → API → service_role key**

## 🔍 Tables créées

Le schéma SQL crée les tables suivantes :

- `profiles` - Profils utilisateurs
- `teams` - Équipes de football
- `leagues` - Ligues et compétitions
- `matches` - Matchs
- `match_statistics` - Statistiques des matchs
- `team_standings` - Classements des équipes
- `predictions` - Prédictions IA
- `user_favorites` - Favoris utilisateurs
- `credit_transactions` - Transactions de crédits

## 📝 Notes

- La connexion Supabase fonctionne ✅
- Les tables doivent être créées via le SQL Editor
- Le middleware a été configuré pour fonctionner sans Supabase (mode développement)





