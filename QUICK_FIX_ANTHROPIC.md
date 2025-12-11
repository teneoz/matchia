# 🚀 Correction Rapide : "AI service not configured"

## ✅ Le Problème

Votre fichier `.env.local` existe mais il manque `ANTHROPIC_API_KEY`.

## 🔧 Solution en 3 Étapes

### 1. Obtenez votre clé API Anthropic

1. Allez sur **https://console.anthropic.com/**
2. Créez un compte ou connectez-vous
3. Allez dans **"API Keys"** (menu de gauche)
4. Cliquez sur **"Create Key"**
5. Donnez-lui un nom (ex: "FootPredict AI")
6. **Copiez la clé** (elle commence par `sk-ant-`)
   - ⚠️ **Attention** : Vous ne pourrez la voir qu'une seule fois !

### 2. Ajoutez-la à `.env.local`

**Option A : Manuellement**
1. Ouvrez `.env.local` à la racine du projet
2. Ajoutez à la fin :
   ```env
   
   # ============================================
   # ANTHROPIC (Claude AI)
   # ============================================
   ANTHROPIC_API_KEY=sk-ant-votre-clé-ici
   ```
3. Remplacez `sk-ant-votre-clé-ici` par votre vraie clé
4. Sauvegardez

**Option B : Via le script**
```bash
./add-anthropic-key.sh
```
Le script vous demandera votre clé et l'ajoutera automatiquement.

### 3. Redémarrez le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

---

## 🧪 Vérification

Vérifiez que la clé est bien là :
```bash
grep ANTHROPIC .env.local
```

Vous devriez voir : `ANTHROPIC_API_KEY=sk-ant-...`

---

## 📝 Exemple de .env.local

Votre fichier devrait ressembler à ça :

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://jvzqfowyaksyweleblyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hDnlSTzlj-2Zq0QDLGilGA_d0QRmjZT
SUPABASE_URL=https://jvzqfowyaksyweleblyk.supabase.co
SUPABASE_ANON_KEY=sb_publishable_hDnlSTzlj-2Zq0QDLGilGA_d0QRmjZT

# ============================================
# ANTHROPIC (Claude AI)
# ============================================
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ✅ Test

Une fois fait :
1. Redémarrez le serveur
2. Allez sur `/ai/chat`
3. Envoyez un message
4. Ça devrait fonctionner ! 🎉

---

## 💡 Pas de compte Anthropic ?

1. Allez sur https://console.anthropic.com/
2. Créez un compte (gratuit)
3. Vous aurez des crédits gratuits pour tester

---

**Note** : Après avoir ajouté la clé, **redémarrez toujours le serveur** pour que les changements prennent effet !

