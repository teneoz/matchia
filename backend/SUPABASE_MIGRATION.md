# 📊 Migration Supabase - Backend NestJS

## 🎯 Instructions pour appliquer les migrations sur Supabase

Ce guide vous explique comment créer les tables du backend NestJS dans votre base de données Supabase.

### 📋 Étapes

1. **Ouvrez votre projet Supabase**
   - Allez sur [https://supabase.com](https://supabase.com)
   - Connectez-vous et sélectionnez votre projet

2. **Accédez à l'éditeur SQL**
   - Dans le menu latéral, cliquez sur "SQL Editor"
   - Cliquez sur "New query"

3. **Exécutez la migration**
   - Ouvrez le fichier `backend/database-schema-supabase.sql`
   - Copiez tout le contenu
   - Collez-le dans l'éditeur SQL de Supabase
   - Cliquez sur "Run" ou appuyez sur `Cmd/Ctrl + Enter`

4. **Vérifiez que les tables sont créées**
   - Allez dans "Table Editor" dans le menu latéral
   - Vous devriez voir les tables suivantes :
     - `users`
     - `projects`
     - `predictions`
     - `credit_transactions`

### 🔐 Important - RLS (Row Level Security)

Les politiques RLS sont configurées dans le script SQL. Cependant, notez que :

- **Les utilisateurs du backend NestJS sont séparés de Supabase Auth**
- Le backend NestJS gère sa propre authentification via JWT
- Les politiques RLS utilisent `auth.uid()` qui correspond à Supabase Auth

**Si vous voulez que le backend NestJS utilise Supabase Auth :**
- Vous devrez modifier le backend pour utiliser les tokens Supabase
- Ou désactiver RLS pour ces tables si vous utilisez uniquement JWT du backend

**Pour désactiver RLS (si nécessaire) :**

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE predictions DISABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions DISABLE ROW LEVEL SECURITY;
```

### ✅ Vérification

Après avoir exécuté la migration, vous pouvez vérifier avec cette requête :

```sql
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'projects', 'predictions', 'credit_transactions')
ORDER BY table_name;
```

Vous devriez voir les 4 tables listées.

### 📝 Notes

- Les utilisateurs seront créés via l'API NestJS (`POST /api/v1/auth/register`)
- Les tables sont indépendantes de Supabase Auth par défaut
- Le backend NestJS peut se connecter à Supabase PostgreSQL en utilisant les credentials de connexion directe

### 🔗 Connexion du Backend à Supabase

Pour connecter votre backend NestJS à Supabase PostgreSQL, utilisez les credentials de connexion directe :

1. Dans Supabase : Settings → Database
2. Copiez les informations de connexion (Host, Database, Port, User, Password)
3. Configurez votre `.env` du backend :

```env
DB_HOST=votre-host.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=votre-password
DB_DATABASE=postgres
DB_SSL=true
```

⚠️ **Important** : Utilisez toujours `DB_SSL=true` pour Supabase !
