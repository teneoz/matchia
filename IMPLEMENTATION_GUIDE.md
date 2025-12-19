# 🚀 Guide d'Implémentation - FootPredict AI

## 📁 Structure de Fichiers Complète

```
MatchInsight/
├── app/
│   ├── (auth)/                    # Routes d'authentification (public)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (app)/                     # Routes de l'application (protégées)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── matches/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── predictions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── predictions/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── matches/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── cron/
│   │       └── sync-matches/
│   │           └── route.ts
│   │
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   └── predictions.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ResetPasswordForm.tsx
│   │   └── AuthLayout.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── UserMenu.tsx
│   │   └── NotificationBell.tsx
│   │
│   ├── dashboard/
│   │   ├── StatsGrid.tsx
│   │   ├── RecentPredictions.tsx
│   │   ├── UpcomingMatches.tsx
│   │   └── PerformanceChart.tsx
│   │
│   ├── matches/
│   │   ├── MatchList.tsx
│   │   ├── MatchCard.tsx
│   │   ├── MatchHeader.tsx
│   │   ├── TeamStats.tsx
│   │   ├── HeadToHead.tsx
│   │   └── MatchFilters.tsx
│   │
│   ├── predictions/
│   │   ├── PredictionCard.tsx
│   │   ├── ConfidenceScore.tsx
│   │   ├── ProbabilityChart.tsx
│   │   ├── KeyFactors.tsx
│   │   └── AnalysisText.tsx
│   │
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── AvatarUpload.tsx
│   │   ├── StatsCard.tsx
│   │   └── CreditHistory.tsx
│   │
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectForm.tsx
│   │   └── ProjectShare.tsx
│   │
│   ├── ui/                        # Shadcn components
│   │   └── ...
│   │
│   └── providers/
│       └── AuthProvider.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── usePredictions.ts
│   ├── useMatches.ts
│   └── useProjects.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   │
│   ├── api/
│   │   ├── football.ts
│   │   └── anthropic.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── utils/
│       ├── validation.ts
│       └── formatters.ts
│
└── scripts/
    └── ...
```

---

## 🔐 Implémentation de l'Authentification

### 1. Server Actions (`app/actions/auth.ts`)

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
})

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
  }

  // Validation
  const validated = signUpSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    }
  }

  const { email, password, fullName } = validated.data

  // Inscription
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Le profil est créé automatiquement via le trigger
  revalidatePath('/')
  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/login')
}
```

### 2. Hook useAuth (`hooks/useAuth.ts`)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

### 3. Formulaire de Connexion (`components/auth/LoginForm.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { signIn } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  )
}
```

---

## 💾 Implémentation de la Sauvegarde de Projets

### 1. Table SQL (à ajouter dans Supabase)

```sql
CREATE TABLE user_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  predictions JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT false,
  share_token UUID DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_projects_user ON user_projects(user_id);
CREATE INDEX idx_user_projects_share_token ON user_projects(share_token);

-- RLS
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON user_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON user_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON user_projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON user_projects FOR DELETE
  USING (auth.uid() = user_id);

-- Public projects can be viewed by anyone
CREATE POLICY "Public projects are viewable by everyone"
  ON user_projects FOR SELECT
  USING (is_public = true);
```

### 2. API Route (`app/api/projects/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('user_projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ projects: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, predictions, settings } = body

  const { data, error } = await supabase
    .from('user_projects')
    .insert({
      user_id: user.id,
      name,
      description,
      predictions: predictions || [],
      settings: settings || {},
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ project: data }, { status: 201 })
}
```

### 3. Hook useProjects (`hooks/useProjects.ts`)

```typescript
'use client'

import { useState, useEffect } from 'react'
import type { UserProject } from '@/lib/types'

export function useProjects() {
  const [projects, setProjects] = useState<UserProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data = await response.json()
        setProjects(data.projects)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return { projects, loading, error }
}
```

---

## 📊 Utilisation du MCP Supabase

### Générer les types TypeScript depuis la DB

```typescript
// Utiliser le MCP tool pour générer les types
// Cela créera automatiquement les types depuis votre schéma Supabase
```

### Exécuter du SQL de test

```typescript
// Utiliser execute_sql pour tester des requêtes
// Exemple: Vérifier les données, tester des jointures, etc.
```

### Lister les tables

```typescript
// Utiliser list_tables pour vérifier la structure
// Utile pour la documentation et le debugging
```

---

## ✅ Checklist de Développement

### Phase 1: Authentification
- [ ] Créer `app/actions/auth.ts`
- [ ] Créer `hooks/useAuth.ts`
- [ ] Créer `components/auth/LoginForm.tsx`
- [ ] Créer `components/auth/SignupForm.tsx`
- [ ] Créer `app/(auth)/login/page.tsx`
- [ ] Créer `app/(auth)/signup/page.tsx`
- [ ] Tester le flow complet

### Phase 2: Sauvegarde
- [ ] Créer la table `user_projects` dans Supabase
- [ ] Créer `app/api/projects/route.ts`
- [ ] Créer `hooks/useProjects.ts`
- [ ] Créer `components/projects/ProjectCard.tsx`
- [ ] Créer `app/(app)/projects/page.tsx`
- [ ] Tester CRUD complet

---

**Note**: Ce guide est complémentaire au `DEVELOPMENT_PLAN.md`. Utilisez les deux documents ensemble pour un développement complet.





