-- Script SQL pour remplir la table spécialité
-- À exécuter dans DBeaver ou pgAdmin

-- ====================================
-- SPÉCIALITÉS PAR DÉPARTEMENT
-- ====================================
-- Note: Les spécialités ne sont PAS liées aux niveaux
-- Le niveau sera choisi lors de la création de la classe
-- Le nom de la classe sera généré automatiquement (ex: DSI 21, DSI 22, TI 11, etc.)

-- 🗑️ Supprimer toutes les spécialités existantes pour éviter les doublons
DELETE FROM specialite;

DO $$
DECLARE
    dept_ti_id INTEGER;
    dept_gm_id INTEGER;
    dept_ge_id INTEGER;
    dept_gc_id INTEGER;
BEGIN
    -- Récupérer les IDs des départements
    SELECT id INTO dept_ti_id FROM departement WHERE code = 'TI';
    SELECT id INTO dept_gm_id FROM departement WHERE code = 'GM';
    SELECT id INTO dept_ge_id FROM departement WHERE code = 'GE';
    SELECT id INTO dept_gc_id FROM departement WHERE code = 'GC';
    
    -- Département TI - Technologies de l'Informatique
    INSERT INTO specialite (nom, "departementId") VALUES
    ('TI', dept_ti_id),      -- Tronc Commun (1ère année)
    ('DSI', dept_ti_id),     -- Développement des Systèmes d'Information (2ème et 3ème année)
    ('RSI', dept_ti_id),     -- Réseaux et Services Informatiques (2ème et 3ème année)
    ('DevOps', dept_ti_id);  -- Master DevOps
    
    -- Département GM - Génie Mécanique
    INSERT INTO specialite (nom, "departementId") VALUES
    ('GM', dept_gm_id),      -- Tronc Commun (1ère année)
    ('MI', dept_gm_id),      -- Maintenance Industrielle (2ème et 3ème année)
    ('MT', dept_gm_id),      -- Mécatronique (2ème et 3ème année)
    ('ENR', dept_gm_id);     -- Master Énergies Renouvelables
    
    -- Département GE - Génie Électrique
    INSERT INTO specialite (nom, "departementId") VALUES
    ('GE', dept_ge_id),      -- Tronc Commun (1ère année)
    ('EI', dept_ge_id),      -- Électronique Industrielle (2ème et 3ème année)
    ('AII', dept_ge_id);     -- Automatique et Informatique Industrielle (2ème et 3ème année)
    
    -- Département GC - Génie Civil
    INSERT INTO specialite (nom, "departementId") VALUES
    ('GC', dept_gc_id),      -- Tronc Commun (1ère année)
    ('BAT', dept_gc_id),     -- Bâtiment (2ème et 3ème année)
    ('TP', dept_gc_id);      -- Travaux Publics (2ème et 3ème année)
    
END $$;

-- Afficher les spécialités créées
SELECT '✅ Spécialités créées:' as info, COUNT(*) as total FROM specialite;

-- Afficher toutes les spécialités avec leur département
SELECT 
    s.id,
    s.nom as specialite,
    d.nom as departement,
    d.code as code_dept
FROM specialite s
JOIN departement d ON s."departementId" = d.id
ORDER BY d.code, s.nom;
