# 🔑 Ajouter la clé API Anthropic

## ✅ Solution Rapide

Votre fichier `.env.local` existe mais il manque `ANTHROPIC_API_KEY`.

### Option 1 : Ajout Manuel (Recommandé)

1. **Ouvrez** `.env.local` à la racine du projet

2. **Ajoutez** cette ligne :
   ```env
   ANTHROPIC_API_KEY=sk-ant-votre-clé-ici
   ```

3. **Obtenez votre clé** :
   - Allez sur https://console.anthropic.com/
   - Créez un compte ou connectez-vous
   - Allez dans **"API Keys"** (menu de gauche)
   - Cliquez sur **"Create Key"**
   - Donnez-lui un nom (ex: "FootPredict AI")
   - Copiez la clé (elle commence par `sk-ant-`)
   - ⚠️ **Important** : Vous ne pourrez la voir qu'une seule fois !

4. **Collez la clé** dans `.env.local` :
   ```env
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

5. **Sauvegardez** le fichier

6. **Redémarrez le serveur** :
   ```bash
   # Arrêtez le serveur (Ctrl+C dans le terminal)
   # Puis relancez :
   npm run dev
   ```

### Option 2 : Via Terminal

```bash
# Ajoutez la ligne à la fin du fichier .env.local
echo "" >> .env.local
echo "# ANTHROPIC (Claude AI)" >> .env.local
echo "ANTHROPIC_API_KEY=sk-ant-votre-clé-ici" >> .env.local
```

Puis **remplacez** `sk-ant-votre-clé-ici` par votre vraie clé dans le fichier.

---

## 🧪 Vérification

Après avoir ajouté la clé, vérifiez :

```bash
# Vérifiez que la clé est bien là
grep ANTHROPIC .env.local
```

Vous devriez voir : `ANTHROPIC_API_KEY=sk-ant-...`

---

## 📝 Exemple de .env.local complet

Votre fichier devrait ressembler à ça :

```env
# SUPABASE CONFIGURATION
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-clé-anon

# ANTHROPIC (Claude AI)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ⚠️ Important

1. **Ne partagez jamais** votre clé API
2. **Ne commitez jamais** `.env.local` (déjà dans `.gitignore`)
3. **Redémarrez toujours** le serveur après modification de `.env.local`

---

## 🎯 Test

Une fois la clé ajoutée et le serveur redémarré :

1. Allez sur `/ai/chat`
2. Envoyez un message
3. Ça devrait fonctionner ! 🎉

---

## 💡 Besoin d'aide ?

Si vous n'avez pas de compte Anthropic :
1. Allez sur https://console.anthropic.com/
2. Créez un compte (gratuit)
3. Vous aurez des crédits gratuits pour tester

