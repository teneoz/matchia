# 🚀 Roadmap d'Implémentation IA - Guide Pratique

## 📋 Vue d'Ensemble

Ce document fournit un guide étape par étape pour implémenter les fonctionnalités IA dans FootPredict AI.

---

## ✅ Étape 1 : Préparation (Terminé)

- [x] Plan d'intégration IA créé (`AI_INTEGRATION_PLAN.md`)
- [x] Structure de dossiers créée (`lib/ai/`)
- [x] Services de base créés (`PredictionService`, `ChatService`)
- [x] Prompts créés (`match-prediction.ts`, `chat-assistant.ts`)
- [x] Utilitaires créés (`cost-calculator.ts`, `prompt-builder.ts`)
- [x] Route API chat créée (`/api/ai/chat`)
- [x] Schéma de base de données créé (`database-schema-ai.sql`)

---

## 🎯 Étape 2 : Base de Données (À Faire)

### 2.1 Exécuter le schéma SQL

```bash
# Dans Supabase SQL Editor, exécuter:
database-schema-ai.sql
```

**Tables créées**:
- `chat_conversations` - Historique des conversations
- `ai_usage_logs` - Suivi de l'utilisation IA
- `user_ai_preferences` - Préférences utilisateur pour l'IA

### 2.2 Vérifier les tables

```sql
SELECT * FROM chat_conversations LIMIT 1;
SELECT * FROM ai_usage_logs LIMIT 1;
SELECT * FROM user_ai_preferences LIMIT 1;
```

---

## 💬 Étape 3 : Interface Chat (À Faire)

### 3.1 Créer le composant Chat

**Fichier**: `components/ai/ChatInterface.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ChatInterface() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-500">L'IA réfléchit...</div>}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Posez votre question..."
          />
          <Button onClick={sendMessage} disabled={loading}>
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### 3.2 Créer la page Chat

**Fichier**: `app/(app)/ai/chat/page.tsx`

```typescript
import { ChatInterface } from '@/components/ai/ChatInterface'

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Assistant IA</h1>
      <div className="bg-white rounded-lg shadow-lg h-[600px]">
        <ChatInterface />
      </div>
    </div>
  )
}
```

---

## 🎯 Étape 4 : Améliorer les Prédictions (À Faire)

### 4.1 Mettre à jour la route de prédiction

**Fichier**: `app/api/ai/predictions/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PredictionService } from '@/lib/ai/services/PredictionService'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { matchId } = body

    // Récupérer les données du match
    const { data: match } = await supabase
      .from('matches')
      .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
      .eq('id', matchId)
      .single()

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    // Utiliser le nouveau service
    const predictionService = new PredictionService()
    const prediction = await predictionService.generatePrediction({
      homeTeam: match.home_team.name,
      awayTeam: match.away_team.name,
      matchDate: match.match_date,
      league: 'Ligue 1', // À récupérer depuis la DB
      homeTeamStats: {
        form: 'WWDLW',
        position: 1,
        goalsFor: 45,
        goalsAgainst: 20,
      },
      awayTeamStats: {
        form: 'LWLWW',
        position: 5,
        goalsFor: 35,
        goalsAgainst: 25,
      },
    })

    return NextResponse.json({ prediction })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    )
  }
}
```

---

## 📊 Étape 5 : Suivi des Coûts (À Faire)

### 5.1 Créer un service de logging

**Fichier**: `lib/ai/services/UsageTrackingService.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import type { AIFeatureType } from '@/lib/types'

export class UsageTrackingService {
  async logUsage(
    userId: string,
    featureType: AIFeatureType,
    tokensUsed: number,
    cost: number,
    modelVersion: string
  ) {
    const supabase = await createClient()
    
    await supabase.from('ai_usage_logs').insert({
      user_id: userId,
      feature_type: featureType,
      tokens_used: tokensUsed,
      cost_usd: cost,
      model_version: modelVersion,
    })
  }

  async getUserUsage(userId: string, days: number = 30) {
    const supabase = await createClient()
    const since = new Date()
    since.setDate(since.getDate() - days)

    const { data } = await supabase
      .from('ai_usage_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString())

    return data || []
  }
}
```

### 5.2 Intégrer dans les services

Mettre à jour `PredictionService` et `ChatService` pour logger l'utilisation.

---

## 🎨 Étape 6 : Interface Utilisateur (À Faire)

### 6.1 Composant de Prédiction Amélioré

**Fichier**: `components/ai/EnhancedPredictionCard.tsx`

Afficher:
- Score prédit avec confiance
- Probabilités (victoire/nul/défaite)
- Analyse textuelle
- Facteurs clés
- Risques

### 6.2 Dashboard IA

**Fichier**: `app/(app)/ai/dashboard/page.tsx`

Afficher:
- Statistiques d'utilisation
- Coûts
- Historique des prédictions
- Conversations récentes

---

## 🔒 Étape 7 : Sécurité et Limites (À Faire)

### 7.1 Rate Limiting

**Fichier**: `lib/ai/utils/rate-limiter.ts`

```typescript
export class RateLimiter {
  async checkLimit(userId: string, feature: string): Promise<boolean> {
    // Vérifier les limites selon le plan utilisateur
    // Gratuit: 10 prédictions/mois, 50 messages/mois
    // Pro: 100 prédictions/mois, 500 messages/mois
    // Premium: Illimité
  }
}
```

### 7.2 Validation des Entrées

Valider tous les inputs utilisateur avant d'envoyer à l'IA.

---

## 📈 Étape 8 : Tests (À Faire)

### 8.1 Tests Unitaires

- Tester les services IA
- Tester les prompts
- Tester le calcul de coûts

### 8.2 Tests d'Intégration

- Tester les routes API
- Tester le flux complet de prédiction
- Tester le chat

---

## 🚀 Étape 9 : Déploiement (À Faire)

### 9.1 Variables d'Environnement

S'assurer que `ANTHROPIC_API_KEY` est configuré.

### 9.2 Monitoring

- Configurer le logging
- Surveiller les coûts
- Surveiller les erreurs

---

## 📝 Checklist Complète

### Phase 1: Fondations
- [ ] Exécuter `database-schema-ai.sql` dans Supabase
- [ ] Vérifier les tables créées
- [ ] Tester la connexion à l'API Anthropic

### Phase 2: Chat
- [ ] Créer `ChatInterface` component
- [ ] Créer page `/ai/chat`
- [ ] Tester le chat de base
- [ ] Ajouter gestion d'historique
- [ ] Ajouter suggestions de questions

### Phase 3: Prédictions Améliorées
- [ ] Mettre à jour `PredictionService`
- [ ] Créer route `/api/ai/predictions`
- [ ] Créer `EnhancedPredictionCard`
- [ ] Tester les prédictions améliorées

### Phase 4: Suivi et Analytics
- [ ] Créer `UsageTrackingService`
- [ ] Intégrer le logging dans les services
- [ ] Créer dashboard d'utilisation
- [ ] Afficher les coûts

### Phase 5: Sécurité
- [ ] Implémenter rate limiting
- [ ] Valider les inputs
- [ ] Ajouter limites par plan

### Phase 6: Tests
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Tests de performance

### Phase 7: Déploiement
- [ ] Configurer variables d'environnement
- [ ] Déployer sur Vercel
- [ ] Configurer monitoring
- [ ] Documenter pour les utilisateurs

---

## 🎯 Prochaines Étapes Immédiates

1. **Exécuter le schéma SQL** dans Supabase
2. **Créer le composant ChatInterface**
3. **Tester le chat de base**
4. **Améliorer les prédictions avec le nouveau service**

---

**Dernière mise à jour**: 2024
**Version**: 1.0





