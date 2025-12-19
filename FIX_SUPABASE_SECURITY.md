# 🔒 Correction des Erreurs de Sécurité Supabase

Ce document explique comment corriger les 5 erreurs détectées par le Security Advisor de Supabase.

## 📋 Erreurs à corriger

1. **Security Definer View** : `public.upcoming_matches_with_teams`
2. **RLS Disabled** : `public.leagues`
3. **RLS Disabled** : `public.teams`
4. **RLS Disabled** : `public.match_statistics`
5. **RLS Disabled** : `public.team_standings`

## ✅ Solution

Un fichier SQL a été créé : `fix-supabase-security-errors.sql`

Ce script :
- Recrée la vue `upcoming_matches_with_teams` sans SECURITY DEFINER
- Active RLS sur les 4 tables concernées
- Crée des politiques RLS permettant la lecture publique (car ces données sont publiques)

## 🚀 Comment appliquer les corrections

### Option 1 : Via le Dashboard Supabase (Recommandé)

1. Ouvrez votre projet Supabase dans le dashboard
2. Allez dans **SQL Editor**
3. Cliquez sur **New query**
4. Copiez le contenu du fichier `fix-supabase-security-errors.sql`
5. Collez-le dans l'éditeur SQL
6. Cliquez sur **Run** (ou appuyez sur `Cmd/Ctrl + Enter`)

### Option 2 : Via la ligne de commande

Si vous avez `psql` configuré avec votre connexion Supabase :

```bash
psql "votre-connection-string" -f fix-supabase-security-errors.sql
```

## 🔍 Vérification

Après avoir exécuté le script :

1. Retournez dans **Security Advisor** dans le dashboard Supabase
2. Cliquez sur **Refresh**
3. Les 5 erreurs devraient avoir disparu

Si des erreurs persistent :
- Vérifiez que le script s'est exécuté sans erreurs
- Consultez les logs dans le SQL Editor pour voir les messages d'erreur éventuels

## 📝 Notes importantes

- **Politiques RLS** : Les politiques créées permettent la lecture publique (`USING (true)`) car les données de football (ligues, équipes, statistiques, classements) sont publiques par nature
- **Vue sans SECURITY DEFINER** : La vue `upcoming_matches_with_teams` utilise maintenant les permissions de l'utilisateur qui l'interroge, ce qui est plus sûr
- **Compatibilité** : Ces corrections n'affectent pas le comportement de l'application, elles renforcent simplement la sécurité

## ✨ Mises à jour du schéma

Le fichier `database-schema.sql` a également été mis à jour pour inclure ces politiques RLS dès la création des tables. Cela garantit que les futurs déploiements seront corrects dès le départ.
