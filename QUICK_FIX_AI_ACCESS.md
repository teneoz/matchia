# 🚀 Accès Rapide aux Fonctionnalités IA

## ✅ Vérification Rapide

### 1. Êtes-vous connecté ?

**Symptôme** : Vous êtes redirigé vers `/login` quand vous essayez d'accéder à `/ai/chat`

**Solution** :
1. Allez sur `http://localhost:3000/login`
2. Connectez-vous avec vos identifiants
3. Une fois connecté, vous verrez votre nom dans le header (en haut à droite)
4. Cliquez sur votre nom → Menu → "Assistant IA"

### 2. Accès Direct

Une fois connecté, vous pouvez accéder directement à :
- **Chat IA** : `http://localhost:3000/ai/chat`
- **Dashboard** : `http://localhost:3000/dashboard`

### 3. Vérifier que tout fonctionne

1. **Connectez-vous** (si ce n'est pas déjà fait)
2. **Allez sur** `/ai/chat`
3. **Tapez un message** comme "Bonjour" ou "Qui va gagner entre PSG et OM ?"
4. **Cliquez sur Envoyer** ou appuyez sur Entrée
5. **Vous devriez recevoir une réponse** de l'IA

---

## 🔍 Si ça ne fonctionne toujours pas

### Vérifier la console du navigateur

1. Ouvrez la console (F12)
2. Regardez s'il y a des erreurs en rouge
3. Partagez-moi les erreurs que vous voyez

### Vérifier les logs du serveur

Dans le terminal où `npm run dev` tourne, regardez s'il y a des erreurs.

### Vérifier les variables d'environnement

Assurez-vous que `.env.local` contient :
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...
```

---

## 📝 Checklist

- [ ] Je suis connecté (je vois mon nom dans le header)
- [ ] Le serveur tourne (`npm run dev`)
- [ ] Je peux accéder à `http://localhost:3000/ai/chat`
- [ ] Je vois l'interface de chat (pas d'erreur 404)
- [ ] Je peux envoyer un message
- [ ] Je reçois une réponse de l'IA

---

## 🎯 Test Rapide

1. **Connectez-vous** : `/login`
2. **Allez sur le chat** : `/ai/chat`
3. **Envoyez** : "Bonjour, comment ça va ?"
4. **Vérifiez** : Vous devriez recevoir une réponse

Si ça fonctionne, tout est OK ! 🎉

---

**Note** : Les tables dans Supabase existent déjà, donc ce n'est pas un problème de base de données.

