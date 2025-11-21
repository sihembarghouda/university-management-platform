# 🚀 Configuration des Ports - University Management Platform

## 📊 Résumé des Services et Ports

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Auth Service** | 3001 | http://localhost:3001/api | Authentification et gestion utilisateurs |
| **Admin Service** | 3002 | http://localhost:3002 | Gestion administrative (départements, classes, etc.) |
| **Absence Service** | 3003 | http://localhost:3003 | Gestion des absences |
| **Emploi Service** | 3010 | http://localhost:3010 | Gestion des emplois du temps |
| **Frontend React** | 3004 | http://localhost:3004 | Interface utilisateur |

## 🗄️ Base de Données
- **PostgreSQL**: Port 5432 (localhost)
- **Nom de la DB**: university_db

## 📋 Configuration Frontend

Le frontend React est configuré pour communiquer avec les services backend via les URLs suivantes :

```bash
# Auth Service
REACT_APP_AUTH_API_URL=http://localhost:3001/api

# Admin Service  
REACT_APP_ADMIN_API_URL=http://localhost:3002

# Absence Service
REACT_APP_ABSENCE_API_URL=http://localhost:3003

# Port du frontend
PORT=3004
```

## 🚀 Démarrage des Services

### Backend (tous les services)
```bash
cd backend
npm run start:dev
```

### Services individuels
```bash
# Auth Service (Port 3001)
npm run start:auth

# Admin Service (Port 3002)  
npm run start:admin

# Absence Service (Port 3003)
npm run start:absence

# Emploi Service (Port 3010)
npm run start:emploi
```

### Frontend
```bash
cd frontend/front
npm start  # Démarre sur le port 3004
```

## 🔧 Swagger/Documentation API

- Auth Service: http://localhost:3001/api (si configuré)
- Admin Service: http://localhost:3002/api
- Emploi Service: http://localhost:3010/api

## ✅ Aucun Conflit de Port

Tous les services sont maintenant configurés avec des ports différents pour éviter les conflits lors du démarrage simultané.