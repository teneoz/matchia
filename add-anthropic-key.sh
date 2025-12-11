#!/bin/bash

# Script pour ajouter ANTHROPIC_API_KEY à .env.local

echo "🔑 Ajout de ANTHROPIC_API_KEY à .env.local"
echo ""

# Vérifier si la clé existe déjà
if grep -q "ANTHROPIC_API_KEY" .env.local 2>/dev/null; then
    echo "⚠️  ANTHROPIC_API_KEY existe déjà dans .env.local"
    echo ""
    read -p "Voulez-vous la remplacer ? (o/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[OoYy]$ ]]; then
        echo "❌ Annulé"
        exit 0
    fi
    # Supprimer l'ancienne ligne
    sed -i.bak '/ANTHROPIC_API_KEY/d' .env.local
fi

# Demander la clé API
echo "📝 Entrez votre clé API Anthropic (commence par sk-ant-):"
echo "   (Vous pouvez l'obtenir sur https://console.anthropic.com/)"
echo ""
read -p "ANTHROPIC_API_KEY: " API_KEY

if [ -z "$API_KEY" ]; then
    echo "❌ Clé API vide, annulé"
    exit 1
fi

# Ajouter la clé au fichier
echo "" >> .env.local
echo "# ============================================" >> .env.local
echo "# ANTHROPIC (Claude AI)" >> .env.local
echo "# ============================================" >> .env.local
echo "# Get your API key from: https://console.anthropic.com/" >> .env.local
echo "ANTHROPIC_API_KEY=$API_KEY" >> .env.local

echo ""
echo "✅ ANTHROPIC_API_KEY ajoutée avec succès !"
echo ""
echo "⚠️  IMPORTANT: Redémarrez le serveur pour que les changements prennent effet:"
echo "   1. Arrêtez le serveur (Ctrl+C)"
echo "   2. Relancez: npm run dev"
echo ""

