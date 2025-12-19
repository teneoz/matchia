#!/bin/bash

# Script pour configurer les variables d'environnement Supabase

ENV_FILE=".env.local"

echo "🔧 Configuration des variables d'environnement Supabase..."

# Vérifier si .env.local existe
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 Création du fichier .env.local..."
    touch "$ENV_FILE"
fi

# Ajouter les variables Supabase
echo "" >> "$ENV_FILE"
echo "# ============================================" >> "$ENV_FILE"
echo "# SUPABASE CONFIGURATION" >> "$ENV_FILE"
echo "# ============================================" >> "$ENV_FILE"
echo "NEXT_PUBLIC_SUPABASE_URL=https://jvzqfowyaksyweleblyk.supabase.co" >> "$ENV_FILE"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hDnlSTzlj-2Zq0QDLGilGA_d0QRmjZT" >> "$ENV_FILE"
echo "SUPABASE_URL=https://jvzqfowyaksyweleblyk.supabase.co" >> "$ENV_FILE"
echo "SUPABASE_ANON_KEY=sb_publishable_hDnlSTzlj-2Zq0QDLGilGA_d0QRmjZT" >> "$ENV_FILE"

echo "✅ Variables d'environnement configurées dans .env.local"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Exécutez le fichier database-schema.sql dans Supabase SQL Editor"
echo "   2. Redémarrez le serveur: npm run dev"
echo "   3. Testez la connexion: curl http://localhost:3000/api/test-supabase"





