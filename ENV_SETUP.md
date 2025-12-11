# Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```bash
# ============================================
# FOOTPREDICT AI - Environment Variables
# ============================================

# ============================================
# SUPABASE
# ============================================
# Get these from: https://supabase.com/dashboard/project/_/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================
# ANTHROPIC (Claude AI)
# ============================================
# Get your API key from: https://console.anthropic.com/

ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# ============================================
# FOOTBALL DATA API
# ============================================
# Option 1: API-Football (RapidAPI)
# Sign up at: https://rapidapi.com/api-sports/api/api-football
FOOTBALL_API_KEY=your-rapidapi-key-here
FOOTBALL_API_HOST=api-football-v1.p.rapidapi.com

# Option 2: Football-Data.org (Free tier: 10 calls/min)
# Sign up at: https://www.football-data.org/
# FOOTBALL_DATA_ORG_KEY=your-key-here

# ============================================
# APPLICATION
# ============================================

# Your app URL (for OAuth redirects, etc.)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment (development, staging, production)
NODE_ENV=development

# ============================================
# OPTIONAL: ANALYTICS & MONITORING
# ============================================

# Google Analytics
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel Analytics (automatically enabled on Vercel)
# NEXT_PUBLIC_VERCEL_ANALYTICS_ID=

# Sentry (Error tracking)
# SENTRY_DSN=
# SENTRY_AUTH_TOKEN=

# ============================================
# OPTIONAL: EMAIL SERVICE
# ============================================
# For transactional emails (welcome, predictions, etc.)

# Resend
# RESEND_API_KEY=

# SendGrid
# SENDGRID_API_KEY=

# ============================================
# OPTIONAL: PAYMENT (Future feature)
# ============================================

# Stripe
# STRIPE_PUBLIC_KEY=
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=

# ============================================
# OPTIONAL: RATE LIMITING
# ============================================

# Upstash Redis (for rate limiting)
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=

# ============================================
# DEVELOPMENT ONLY
# ============================================

# Enable debug logging
DEBUG=false

# Disable telemetry
NEXT_TELEMETRY_DISABLED=1
```

## Instructions

1. Copiez le contenu ci-dessus dans un nouveau fichier `.env.local`
2. Remplacez toutes les valeurs `your-*-key-here` par vos vraies clés API
3. Ne commitez jamais ce fichier (déjà dans `.gitignore`)

## Où obtenir les clés ?

### Supabase
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Allez dans **Settings → API**
3. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Anthropic Claude
1. Créez un compte sur [console.anthropic.com](https://console.anthropic.com/)
2. Allez dans **API Keys**
3. Créez une nouvelle clé → `ANTHROPIC_API_KEY`

### API-Football (RapidAPI)
1. Créez un compte sur [rapidapi.com](https://rapidapi.com)
2. Abonnez-vous à [API-Football](https://rapidapi.com/api-sports/api/api-football)
3. Copiez votre clé X-RapidAPI-Key → `FOOTBALL_API_KEY`

