-- Script pour corriger les valeurs NULL dans la colonne email de la table enseignant
-- Exécuter ce script AVANT de démarrer l'application

-- Étape 1: Mettre à jour les enregistrements avec des emails NULL
UPDATE enseignant 
SET email = CONCAT(LOWER(REPLACE(nom, ' ', '')), '.', LOWER(REPLACE(prenom, ' ', '')), '@university.edu')
WHERE email IS NULL OR email = '';

-- Étape 2: S'assurer qu'il n'y a pas de doublons d'email
-- Ajouter un suffixe numérique pour les doublons
WITH duplicate_emails AS (
    SELECT id, email, 
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) as rn
    FROM enseignant
    WHERE email IS NOT NULL
)
UPDATE enseignant 
SET email = CONCAT(
    SUBSTRING(e.email FROM 1 FOR POSITION('@' IN e.email) - 1),
    de.rn,
    SUBSTRING(e.email FROM POSITION('@' IN e.email))
)
FROM duplicate_emails de
WHERE enseignant.id = de.id 
AND de.rn > 1;

-- Étape 3: Vérification - Afficher tous les emails pour contrôle
SELECT id, nom, prenom, email FROM enseignant ORDER BY id;