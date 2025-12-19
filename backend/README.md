# MatchInsight Backend API

Backend API REST complet pour la plateforme MatchInsight, construit avec NestJS, PostgreSQL, Redis et Nginx.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm ou yarn

### Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditez `.env` avec vos configurations :
- Base de données PostgreSQL
- Redis
- JWT secrets
- Clés API (Anthropic, Football API)

3. **Exécuter les migrations**
```bash
npm run migration:run
```

4. **Générer les données de test (optionnel)**
```bash
npm run seed
```

5. **Lancer le serveur de développement**
```bash
npm run start:dev
```

L'API sera accessible sur `http://localhost:4000/api/v1`

La documentation Swagger sera disponible sur `http://localhost:4000/api/v1/docs`

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── common/              # Code partagé (filters, dto, enums, interfaces)
│   ├── config/              # Configurations (database, redis, jwt)
│   ├── database/
│   │   ├── migrations/      # Migrations TypeORM
│   │   └── seeds/           # Données de test
│   ├── entities/            # Entités TypeORM
│   ├── modules/             # Modules NestJS
│   │   ├── auth/            # Authentification JWT
│   │   ├── users/           # Gestion des utilisateurs
│   │   ├── projects/        # Gestion des projets IA
│   │   ├── ai/              # Services IA (prédictions, chat)
│   │   └── redis/           # Service Redis
│   ├── app.module.ts        # Module racine
│   └── main.ts              # Point d'entrée
├── test/                    # Tests E2E
└── package.json
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Endpoints d'authentification

- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/refresh` - Rafraîchir le token
- `POST /api/v1/auth/logout` - Déconnexion (nécessite authentification)

### Utilisation

Tous les endpoints protégés nécessitent un header `Authorization: Bearer <token>`

## 📚 Modules Principaux

### Auth Module
- Inscription/Connexion
- JWT avec refresh tokens
- Hash des mots de passe avec Argon2
- Rôles (admin/user)

### Users Module
- CRUD utilisateurs
- Gestion du profil
- Rôles et permissions

### Projects Module
- Gestion des projets IA
- Association avec les prédictions

### AI Module
- Création de prédictions IA
- Chat avec l'IA (Anthropic Claude)
- Gestion des crédits utilisateur

## 🛡️ Sécurité

- **Helmet** : Headers de sécurité HTTP
- **CORS** : Configuration stricte des origines
- **Rate Limiting** : Limitation des requêtes par IP
- **Validation** : Validation stricte de toutes les entrées (class-validator)
- **Hash** : Mots de passe hashés avec Argon2
- **JWT** : Tokens signés avec expiration
- **HTTPS** : Obligatoire en production

## 🗄️ Base de Données

### Migrations

```bash
# Générer une nouvelle migration
npm run migration:generate -- -n NomDeLaMigration

# Exécuter les migrations
npm run migration:run

# Annuler la dernière migration
npm run migration:revert
```

### Seeds

```bash
# Exécuter les seeds
npm run seed
```

Création de :
- Utilisateur admin : `admin@matchinsight.com` / `Admin123!@#`
- Utilisateur test : `user@matchinsight.com` / `User123!@#`

## 🔄 Redis

Redis est utilisé pour :
- Cache des prédictions
- Rate limiting
- Sessions (future implémentation)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:cov

# Tests E2E
npm run test:e2e
```

## 📝 Scripts Disponibles

- `npm run build` - Build de production
- `npm run start` - Lancer en production
- `npm run start:dev` - Lancer en développement (watch)
- `npm run start:debug` - Lancer en mode debug
- `npm run lint` - Linter le code
- `npm run format` - Formater le code avec Prettier

## 🔧 Configuration Nginx (Production)

Exemple de configuration Nginx pour reverse proxy :

```nginx
server {
    listen 80;
    server_name api.matchinsight.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Documentation API

La documentation Swagger est disponible à `/api/v1/docs` en développement.

## 🚢 Déploiement

### Variables d'environnement requises

```env
NODE_ENV=production
PORT=4000
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_DATABASE=matchinsight
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
REDIS_HOST=your-redis-host
REDIS_PORT=6379
ANTHROPIC_API_KEY=your-anthropic-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build et démarrage

```bash
npm run build
npm run start:prod
```

## 📄 Licence

ISC
