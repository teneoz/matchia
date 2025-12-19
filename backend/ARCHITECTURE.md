# Architecture du Backend MatchInsight

## 📐 Vue d'ensemble

Le backend est construit avec **NestJS**, un framework Node.js progressif qui utilise TypeScript et suit les principes de l'architecture modulaire.

## 🏗️ Structure Modulaire

```
src/
├── common/                    # Code partagé
│   ├── dto/                   # DTOs communs (pagination, etc.)
│   ├── enums/                 # Enums partagés
│   ├── filters/               # Exception filters
│   ├── interfaces/            # Interfaces TypeScript
│   ├── interceptors/          # Interceptors HTTP
│   └── pipes/                 # Pipes de validation
├── config/                    # Configurations
│   ├── database.config.ts     # Configuration TypeORM
│   ├── jwt.config.ts          # Configuration JWT
│   └── redis.config.ts        # Configuration Redis
├── database/
│   ├── migrations/            # Migrations TypeORM
│   └── seeds/                 # Données de test
├── entities/                  # Entités TypeORM
│   ├── user.entity.ts
│   ├── project.entity.ts
│   ├── prediction.entity.ts
│   └── credit-transaction.entity.ts
├── modules/                   # Modules NestJS
│   ├── auth/                  # Authentification
│   │   ├── decorators/        # @Public(), @Roles(), @CurrentUser()
│   │   ├── dto/               # RegisterDto, LoginDto, etc.
│   │   ├── guards/            # JwtAuthGuard, RolesGuard
│   │   ├── strategies/        # JwtStrategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                 # Gestion utilisateurs
│   ├── projects/              # Gestion projets
│   ├── ai/                    # Services IA
│   └── redis/                 # Service Redis
├── app.module.ts              # Module racine
└── main.ts                    # Point d'entrée
```

## 🔐 Authentification & Autorisation

### JWT (JSON Web Tokens)

- **Access Token** : Durée de vie courte (7 jours par défaut)
- **Refresh Token** : Durée de vie longue (30 jours par défaut)
- Tokens stockés côté client
- Refresh token stocké en base de données pour invalidation

### Stratégie d'authentification

1. L'utilisateur s'inscrit/se connecte via `/auth/register` ou `/auth/login`
2. Le serveur génère un access token et un refresh token
3. Le refresh token est stocké en base de données (table `users`)
4. Les requêtes suivantes incluent le access token dans le header `Authorization: Bearer <token>`
5. Le `JwtAuthGuard` valide le token sur chaque requête protégée
6. Si le token expire, l'utilisateur peut utiliser le refresh token pour en obtenir un nouveau

### Décorateurs

- `@Public()` : Marque une route comme publique (bypass du JwtAuthGuard)
- `@Roles(Role.ADMIN)` : Restreint l'accès aux rôles spécifiés
- `@CurrentUser()` : Injecte l'utilisateur actuel depuis le token JWT

## 🗄️ Base de Données

### TypeORM

Utilisation de TypeORM comme ORM pour PostgreSQL :

- **Entities** : Définissent la structure des tables
- **Migrations** : Gèrent les modifications du schéma
- **Repositories** : Accès aux données avec méthodes CRUD

### Relations

- `User` → `Project` (OneToMany)
- `User` → `Prediction` (OneToMany)
- `User` → `CreditTransaction` (OneToMany)
- `Project` → `Prediction` (OneToMany)

## 🔄 Redis

Utilisé pour :

1. **Cache** : Mise en cache des prédictions IA pour éviter les appels API coûteux
2. **Rate Limiting** : Limitation des requêtes (via @nestjs/throttler)
3. **Sessions** : (Futur) Gestion des sessions utilisateur

## 🛡️ Sécurité

### Layers de sécurité

1. **Helmet** : Headers de sécurité HTTP
2. **CORS** : Configuration stricte des origines autorisées
3. **Rate Limiting** : Limitation des requêtes par IP
4. **Validation** : Validation stricte de toutes les entrées (class-validator)
5. **Argon2** : Hash des mots de passe
6. **JWT** : Tokens signés avec expiration
7. **HTTPS** : Obligatoire en production (via Nginx)

### Validation des entrées

Tous les DTOs utilisent `class-validator` pour valider les entrées :

```typescript
export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;
}
```

## 📡 API REST

### Convention de nommage

- `GET /api/v1/resource` : Lister les ressources
- `GET /api/v1/resource/:id` : Obtenir une ressource
- `POST /api/v1/resource` : Créer une ressource
- `PATCH /api/v1/resource/:id` : Mettre à jour une ressource
- `DELETE /api/v1/resource/:id` : Supprimer une ressource

### Réponses standardisées

```typescript
// Succès avec données
{
  "success": true,
  "data": { ... }
}

// Succès avec pagination
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

// Erreur
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/resource",
  "message": "Message d'erreur"
}
```

## 🧪 Tests

### Structure

- **Tests unitaires** : `*.spec.ts` à côté des fichiers testés
- **Tests E2E** : `test/*.e2e-spec.ts`

### Exécution

```bash
npm run test           # Tests unitaires
npm run test:watch     # Mode watch
npm run test:cov       # Avec coverage
npm run test:e2e       # Tests E2E
```

## 🚀 Déploiement

### Stateless Architecture

Le backend est conçu pour être **stateless** :

- Aucune session stockée côté serveur
- Tokens JWT stockés côté client
- Base de données externe (PostgreSQL)
- Cache externe (Redis)

Cela permet de déployer plusieurs instances derrière un load balancer.

### Variables d'environnement

Toutes les configurations sont via variables d'environnement :
- Secrets (JWT, API keys)
- URLs de connexion (DB, Redis)
- Options de configuration

## 📊 Monitoring & Logs

### Logging

- Utilisation de `Logger` NestJS
- Format structuré des logs
- Niveaux : error, warn, log, debug, verbose

### Health Checks

Endpoint `/health` pour vérifier l'état de l'application (à implémenter).

## 🔄 Flux de données

### Création d'une prédiction

1. Client → `POST /api/v1/ai/predictions`
2. `AiController` → `AiService.createPrediction()`
3. Vérification des crédits utilisateur
4. Vérification du cache Redis
5. Si pas en cache : Génération IA → Cache → Base de données
6. Déduction des crédits
7. Log de la transaction
8. Retour de la prédiction au client

## 🔧 Extensibilité

### Ajouter un nouveau module

1. Créer le dossier dans `src/modules/`
2. Créer `*.module.ts`, `*.service.ts`, `*.controller.ts`
3. Créer les DTOs dans `dto/`
4. Créer l'entité dans `src/entities/`
5. Importer le module dans `app.module.ts`
6. Créer les migrations si nécessaire

### Ajouter une nouvelle route protégée

1. Décorer avec `@UseGuards(JwtAuthGuard)` (optionnel si global)
2. Décorer avec `@Roles()` si restriction par rôle
3. Utiliser `@CurrentUser()` pour obtenir l'utilisateur
