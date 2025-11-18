# 📅 Service de Gestion des Absences

Module complet pour gérer les absences des étudiants avec enregistrement, justificatifs, alertes d'élimination et rattrapages.

## 🎯 Fonctionnalités

### ✅ CRUD de base
- ✓ Enregistrer une absence
- ✓ Consulter toutes les absences
- ✓ Modifier une absence
- ✓ Supprimer une absence
- ✓ Statistiques globales

### 📝 Gestion des justificatifs
- ✓ Soumettre une justification (maladie, personnel, administratif, autre)
- ✓ Télécharger une pièce justificative
- ✓ Valider ou refuser une justification
- ✓ Suivre le statut (non justifiée, en attente, justifiée, refusée)

### ⚠️ Alertes d'élimination
- ✓ Calcul automatique du pourcentage d'absences
- ✓ Détection des étudiants à risque (≥25% d'absences)
- ✓ Envoi d'alertes d'élimination
- ✓ Tableau de bord des étudiants à risque

### 🔄 Rattrapages
- ✓ Planifier un rattrapage (date + heure)
- ✓ Suivre les rattrapages planifiés
- ✓ Marquer un rattrapage comme effectué

## 📊 Modèle de données

### Absence Entity

| Champ | Type | Description |
|-------|------|-------------|
| id | number | Identifiant unique |
| etudiantId | number | ID de l'étudiant |
| etudiantNom | string | Nom de l'étudiant |
| etudiantPrenom | string | Prénom de l'étudiant |
| matiereId | number | ID de la matière |
| matiereNom | string | Nom de la matière |
| dateAbsence | date | Date de l'absence |
| heureDebut | string | Heure de début (optionnel) |
| heureFin | string | Heure de fin (optionnel) |
| nbHeures | number | Nombre d'heures (défaut: 1) |
| statut | enum | `non_justifiee`, `justifiee`, `en_attente`, `refusee` |
| typeJustificatif | enum | `maladie`, `personnel`, `administratif`, `autre` |
| motifJustification | text | Motif de la justification |
| pieceJustificative | string | URL de la pièce justificative |
| dateJustification | date | Date de soumission de la justification |
| commentaire | text | Commentaire libre |
| rattrapage | boolean | Rattrapage planifié ? |
| dateRattrapage | date | Date du rattrapage |
| heureRattrapage | string | Heure du rattrapage |
| rattrapageEffectue | boolean | Rattrapage effectué ? |
| alerteEliminationEnvoyee | boolean | Alerte envoyée ? |
| createdAt | timestamp | Date de création |

## 🔌 API Endpoints

### CRUD de base

```http
POST   /absences                    # Créer une absence
GET    /absences                    # Liste toutes les absences
GET    /absences/:id                # Détails d'une absence
PATCH  /absences/:id                # Modifier une absence
DELETE /absences/:id                # Supprimer une absence
GET    /absences/statistiques       # Statistiques globales
```

### Recherches

```http
GET /absences/etudiant/:etudiantId              # Absences d'un étudiant
GET /absences/matiere/:matiereId                # Absences par matière
GET /absences/etudiant/:id/total-heures         # Total heures d'absence
GET /absences/etudiants-a-risque?seuil=25       # Étudiants à risque
GET /absences/etudiant/:id/risque-elimination   # Vérifier risque
```

### Justifications

```http
POST /absences/:id/justifier              # Soumettre une justification
POST /absences/:id/valider-justification  # Accepter/refuser justification
```

### Rattrapages

```http
POST /absences/:id/planifier-rattrapage   # Planifier un rattrapage
POST /absences/:id/rattrapage-effectue    # Marquer comme effectué
```

### Alertes

```http
POST /absences/:id/envoyer-alerte         # Envoyer alerte élimination
```

## 📝 Exemples d'utilisation

### Créer une absence

```javascript
POST http://localhost:3002/absences
Content-Type: application/json

{
  "etudiantId": 1,
  "etudiantNom": "Dupont",
  "etudiantPrenom": "Jean",
  "matiereId": 5,
  "matiereNom": "Mathématiques",
  "dateAbsence": "2025-11-14",
  "heureDebut": "08:00",
  "heureFin": "10:00",
  "nbHeures": 2,
  "commentaire": "Absence non excusée"
}
```

### Justifier une absence

```javascript
POST http://localhost:3002/absences/1/justifier
Content-Type: application/json

{
  "typeJustificatif": "maladie",
  "motifJustification": "Grippe sévère avec certificat médical",
  "pieceJustificative": "https://example.com/certificat.pdf"
}
```

### Planifier un rattrapage

```javascript
POST http://localhost:3002/absences/1/planifier-rattrapage
Content-Type: application/json

{
  "dateRattrapage": "2025-11-20",
  "heureRattrapage": "14:00"
}
```

### Vérifier le risque d'élimination

```javascript
GET http://localhost:3002/absences/etudiant/1/risque-elimination?matiereId=5&totalHeuresMatiere=40

Response:
{
  "risque": true,
  "totalHeures": 12,
  "pourcentage": 30.0,
  "seuilElimination": 25
}
```

## 🎨 Interface utilisateur

### Accès à l'interface

```
http://localhost:3003/absences
```

### Rôles autorisés
- Directeur de département
- Administratif
- Enseignant

### Fonctionnalités de l'interface

1. **Tableau de bord statistiques**
   - Total absences
   - Non justifiées
   - En attente de validation
   - Justifiées
   - Avec rattrapage

2. **Liste des absences**
   - Affichage en grille
   - Badges de statut colorés
   - Actions rapides (éditer, supprimer, justifier)
   - Validation de justifications
   - Planification de rattrapages

3. **Étudiants à risque**
   - Liste des étudiants ≥25% d'absences
   - Barre de progression
   - Détails par matière
   - Alerte visuelle

4. **Formulaires modaux**
   - Enregistrement d'absence
   - Justification
   - Planification de rattrapage

## 🧪 Tests

### Fichier de test API

Ouvrir `test-absences-api.html` dans un navigateur pour tester tous les endpoints.

### Tests manuels

1. **Créer une absence**
   ```bash
   curl -X POST http://localhost:3002/absences \
     -H "Content-Type: application/json" \
     -d '{
       "etudiantId": 1,
       "matiereId": 1,
       "dateAbsence": "2025-11-14",
       "nbHeures": 2
     }'
   ```

2. **Obtenir les statistiques**
   ```bash
   curl http://localhost:3002/absences/statistiques
   ```

3. **Lister les étudiants à risque**
   ```bash
   curl http://localhost:3002/absences/etudiants-a-risque
   ```

## 🚀 Démarrage

### Backend

```bash
cd backend/admin-service
npm run start:dev
```

Le service sera disponible sur `http://localhost:3002/absences`

### Frontend

```bash
cd frontend/front
npm start
```

L'interface sera disponible sur `http://localhost:3003/absences`

## 📦 Structure des fichiers

```
backend/admin-service/src/absence/
├── absence.entity.ts              # Modèle de données
├── absence.service.ts             # Logique métier
├── absence.controller.ts          # Routes API
├── absence.module.ts              # Module NestJS
└── dto/
    ├── create-absence.dto.ts      # DTO création
    ├── update-absence.dto.ts      # DTO modification
    └── justifier-absence.dto.ts   # DTO justification

frontend/front/src/components/
├── AbsenceManagement.jsx          # Composant principal
└── AbsenceManagement.css          # Styles

test-absences-api.html             # Tests API interactifs
```

## ⚙️ Configuration

### Seuil d'élimination

Le seuil par défaut est **25%** d'absences. Vous pouvez le modifier:

```javascript
// Dans absence.service.ts
const seuilElimination = 25; // Changez cette valeur

// Via l'API
GET /absences/etudiants-a-risque?seuil=30  // 30% au lieu de 25%
```

### Total d'heures par matière

Par défaut, chaque matière a **40 heures**. Pour personnaliser:

```javascript
GET /absences/etudiant/1/risque-elimination?matiereId=5&totalHeuresMatiere=60
```

## 🔐 Sécurité

- ✓ Validation des données avec class-validator
- ✓ DTOs pour toutes les entrées
- ✓ Gestion des erreurs avec exceptions NestJS
- ✓ Routes protégées par rôles (ProtectedRoute)

## 🎯 Prochaines améliorations possibles

- [ ] Upload de fichiers pour pièces justificatives
- [ ] Notifications email automatiques
- [ ] Export PDF des absences
- [ ] Calendrier des rattrapages
- [ ] Dashboard enseignant par classe
- [ ] Génération automatique de rapports mensuels
- [ ] Intégration avec emploi du temps

## 📞 Support

Pour toute question ou problème, consultez la documentation principale du projet.

---

**Module développé pour le projet University Management Platform**
Version 3.0 | © 2025
