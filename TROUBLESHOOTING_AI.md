# 🔧 Guide de Dépannage - Fonctionnalités IA

## Problème : "Je n'y ai pas accès"

### ✅ Vérifications à faire

#### 1. Êtes-vous connecté ?

La page `/ai/chat` nécessite d'être connecté. Vérifiez :
- Allez sur `/login` et connectez-vous
- Vérifiez que vous voyez votre nom dans le header en haut à droite
- Si vous n'êtes pas connecté, le middleware vous redirige automatiquement vers `/login`

#### 2. Les tables existent-elles dans Supabase ?

Les fonctionnalités IA nécessitent ces tables :
- `chat_conversations`
- `ai_usage_logs`
- `user_ai_preferences`

**Pour créer les tables** :
1. Allez dans Supabase Dashboard → SQL Editor
2. Exécutez le contenu du fichier `database-schema-ai.sql`
3. Vérifiez que les tables sont créées

#### 3. Vérifier les erreurs dans la console

Ouvrez la console du navigateur (F12) et vérifiez :
- Erreurs JavaScript
- Erreurs de réseau (onglet Network)
- Erreurs dans la console du serveur (terminal où `npm run dev` tourne)

#### 4. Vérifier les variables d'environnement

Assurez-vous que `.env.local` contient :
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...
```

#### 5. Vérifier que le serveur tourne

```bash
npm run dev
```

Le serveur doit être accessible sur `http://localhost:3000`

---

## 🐛 Erreurs Courantes

### Erreur : "Unauthorized" (401)

**Cause** : Vous n'êtes pas connecté

**Solution** :
1. Allez sur `/login`
2. Connectez-vous avec vos identifiants
3. Réessayez d'accéder à `/ai/chat`

---

### Erreur : "Table 'chat_conversations' does not exist"

**Cause** : Les tables n'ont pas été créées dans Supabase

**Solution** :
1. Ouvrez Supabase Dashboard
2. Allez dans SQL Editor
3. Exécutez le contenu de `database-schema-ai.sql`
4. Vérifiez que les tables sont créées

---

### Erreur : "ANTHROPIC_API_KEY is not configured"

**Cause** : La clé API Anthropic n'est pas configurée

**Solution** :
1. Vérifiez que `.env.local` contient `ANTHROPIC_API_KEY=...`
2. Redémarrez le serveur de développement (`npm run dev`)

---

### Erreur : "Failed to process chat message"

**Cause** : Problème avec l'API Anthropic ou Supabase

**Solution** :
1. Vérifiez les logs dans la console du serveur
2. Vérifiez que `ANTHROPIC_API_KEY` est valide
3. Vérifiez que Supabase est accessible

---

### La page charge mais le chat ne fonctionne pas

**Vérifications** :
1. Ouvrez la console du navigateur (F12)
2. Regardez l'onglet Network
3. Vérifiez si la requête vers `/api/ai/chat` échoue
4. Vérifiez les erreurs dans la console

---

## 🔍 Comment Tester

### Test 1 : Accès à la page

1. Connectez-vous
2. Allez sur `http://localhost:3000/ai/chat`
3. Vous devriez voir l'interface de chat

### Test 2 : Envoyer un message

1. Tapez un message dans le champ
2. Cliquez sur "Envoyer" ou appuyez sur Entrée
3. Vous devriez recevoir une réponse de l'IA

### Test 3 : Vérifier les tables

Dans Supabase SQL Editor :
```sql
SELECT * FROM chat_conversations LIMIT 1;
SELECT * FROM ai_usage_logs LIMIT 1;
SELECT * FROM user_ai_preferences LIMIT 1;
```

Si ces requêtes retournent des erreurs, les tables n'existent pas.

---

## 📞 Support

Si le problème persiste :

1. Vérifiez les logs du serveur (`npm run dev`)
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que toutes les étapes ci-dessus sont complétées
4. Partagez les erreurs exactes que vous voyez

---

## ✅ Checklist de Vérification

- [ ] Je suis connecté (je vois mon nom dans le header)
- [ ] Le serveur de développement tourne (`npm run dev`)
- [ ] Les tables existent dans Supabase (`chat_conversations`, `ai_usage_logs`, `user_ai_preferences`)
- [ ] Les variables d'environnement sont configurées (`.env.local`)
- [ ] `ANTHROPIC_API_KEY` est valide
- [ ] Je peux accéder à `http://localhost:3000/ai/chat`
- [ ] Aucune erreur dans la console du navigateur
- [ ] Aucune erreur dans les logs du serveur

---

**Dernière mise à jour**: 2024

