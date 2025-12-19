# Guide de Configuration - Backend MatchInsight

## 🚀 Installation et Configuration

### 1. Prérequis

- Node.js 18+ installé
- PostgreSQL 14+ installé et démarré
- Redis 6+ installé et démarré

### 2. Installation des dépendances

```bash
cd backend
npm install
```

### 3. Configuration de l'environnement

Copiez le fichier d'exemple et configurez vos variables :

```bash
cp env.example .env
```

Éditez `.env` avec vos valeurs :
- **Base de données PostgreSQL** : Créez une base de données `matchinsight`
- **Redis** : Assurez-vous que Redis est démarré
- **JWT Secrets** : Générez des secrets forts pour la production
- **Anthropic API Key** : Ajoutez votre clé API Anthropic

### 4. Exécution des migrations

```bash
npm run migration:run
```

Cela créera toutes les tables nécessaires dans PostgreSQL.

### 5. Seeds (Données de test)

Exécutez les seeds pour créer des utilisateurs de test :

```bash
npm run seed
```

Cela créera :
- **Admin** : `admin@matchinsight.com` / `Admin123!@#`
- **User** : `user@matchinsight.com` / `User123!@#`

### 6. Démarrage

**Développement** :
```bash
npm run start:dev
```

**Production** :
```bash
npm run build
npm run start:prod
```

L'API sera accessible sur `http://localhost:4000/api/v1`
La documentation Swagger sera sur `http://localhost:4000/api/v1/docs`

## 🔐 Configuration de la Sécurité

### JWT Secrets

Générez des secrets forts pour la production :

```bash
# Générer un secret JWT
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### HTTPS

En production, configurez HTTPS :
1. Installez un certificat SSL (Let's Encrypt recommandé)
2. Configurez Nginx avec SSL (voir `nginx.conf.example`)
3. Définissez `NODE_ENV=production` dans `.env`

## 📊 Configuration Nginx

1. Copiez `nginx.conf.example` vers votre configuration Nginx
2. Ajustez `server_name` avec votre domaine
3. Configurez SSL si nécessaire
4. Redémarrez Nginx

## 🐳 Docker (Optionnel)

Pour utiliser Docker :

```bash
docker-compose up -d
```

Cela démarre :
- PostgreSQL sur le port 5432
- Redis sur le port 6379
- Le backend sur le port 4000

## ✅ Vérification

Testez l'API :

```bash
# Health check
curl http://localhost:4000/api/v1/health

# Documentation Swagger
open http://localhost:4000/api/v1/docs
```

## 📝 Notes Importantes

- Ne commitez jamais le fichier `.env`
- En production, utilisez des secrets forts et uniques
- Configurez HTTPS pour sécuriser les communications
- Surveillez les logs pour détecter les erreurs
- Configurez des backups réguliers de la base de données
