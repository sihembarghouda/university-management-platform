-- Script SQL pour remplir les classes - ISET Tozeur
-- Exécuter avec: psql -U postgres -d university_db -f seed-data.sql

-- Insérer toutes les classes (avec nom seulement, sans code)

-- Département TI (Technologies de l'Informatique)
INSERT INTO classe (nom) VALUES
-- Tronc Commun 1ère année TI
('TI 11'),
('TI 12'),
('TI 13'),
('TI 14'),
('TI 15'),
('TI 16'),
('TI 17'),
('TI 18'),

-- DSI 2ème année (Développement des Systèmes d'Information)
('DSI 21'),
('DSI 22'),
('DSI 23'),

-- RSI 2ème année (Réseaux et Services Informatiques)
('RSI 21'),

-- DSI 3ème année
('DSI 31'),
('DSI 32'),

-- RSI 3ème année
('RSI 31'),

-- Master DevOps
('Master DevOps 1'),
('Master DevOps 2'),

-- Département GM (Génie Mécanique)
-- Tronc Commun 1ère année GM
('GM 11'),
('GM 12'),
('GM 13'),

-- MI 2ème année (Maintenance Industrielle)
('MI 2'),

-- MT 2ème année (Mécatronique)
('MT 2'),

-- MI 3ème année
('MI 3'),

-- MT 3ème année
('MT 3'),

-- Master ENR (Énergies Renouvelables)
('Master ENR 1'),
('Master ENR 2'),

-- Département GE (Génie Électrique)
-- Tronc Commun 1ère année GE
('GE 11'),
('GE 12'),
('GE 13'),

-- EI 2ème année (Électronique Industrielle)
('EI 2'),

-- AII 2ème année (Automatique et Informatique Industrielle)
('AII 21'),
('AII 22'),

-- EI 3ème année
('EI 3'),

-- AII 3ème année
('AII 3'),

-- Département GC (Génie Civil)
-- Tronc Commun 1ère année GC
('GC 11'),
('GC 12'),

-- BAT 2ème année (Bâtiment)
('BAT 2'),

-- TP 2ème année (Travaux Publics)
('TP 2'),

-- TP 3ème année
('TP 3'),

-- BAT 3ème année
('BAT 3');

-- Afficher les résultats
SELECT '✅ Classes créées:' as info, COUNT(*) as total FROM classe;

-- Afficher toutes les classes
SELECT id, nom FROM classe ORDER BY id;

-- ====================================
-- SPÉCIALITÉS PAR DÉPARTEMENT
-- ====================================

-- Récupérer les IDs des départements et niveaux pour les spécialités
DO $$
DECLARE
    dept_ti_id INTEGER;
    dept_gm_id INTEGER;
    dept_ge_id INTEGER;
    dept_gc_id INTEGER;
    niveau_2_id INTEGER;
    niveau_3_id INTEGER;
    niveau_master_id INTEGER;
BEGIN
    -- Récupérer les IDs des départements
    SELECT id INTO dept_ti_id FROM departement WHERE code = 'TI';
    SELECT id INTO dept_gm_id FROM departement WHERE code = 'GM';
    SELECT id INTO dept_ge_id FROM departement WHERE code = 'GE';
    SELECT id INTO dept_gc_id FROM departement WHERE code = 'GC';
    
    -- Récupérer les IDs des niveaux
    SELECT id INTO niveau_2_id FROM niveau WHERE nom = '2ème année';
    SELECT id INTO niveau_3_id FROM niveau WHERE nom = '3ème année';
    SELECT id INTO niveau_master_id FROM niveau WHERE nom = 'Master';
    
    -- Département TI - Technologies de l'Informatique
    INSERT INTO specialite (nom, "departementId", "niveauId") VALUES
    ('DSI', dept_ti_id, niveau_2_id),  -- Développement des Systèmes d'Information
    ('RSI', dept_ti_id, niveau_2_id),  -- Réseaux et Services Informatiques
    ('DSI', dept_ti_id, niveau_3_id),  -- DSI 3ème année
    ('RSI', dept_ti_id, niveau_3_id),  -- RSI 3ème année
    ('DevOps', dept_ti_id, niveau_master_id);  -- Master DevOps
    
    -- Département GM - Génie Mécanique
    INSERT INTO specialite (nom, "departementId", "niveauId") VALUES
    ('MI', dept_gm_id, niveau_2_id),   -- Maintenance Industrielle
    ('MT', dept_gm_id, niveau_2_id),   -- Mécatronique
    ('MI', dept_gm_id, niveau_3_id),   -- MI 3ème année
    ('MT', dept_gm_id, niveau_3_id),   -- MT 3ème année
    ('ENR', dept_gm_id, niveau_master_id);  -- Master Énergies Renouvelables
    
    -- Département GE - Génie Électrique
    INSERT INTO specialite (nom, "departementId", "niveauId") VALUES
    ('EI', dept_ge_id, niveau_2_id),   -- Électronique Industrielle
    ('AII', dept_ge_id, niveau_2_id),  -- Automatique et Informatique Industrielle
    ('EI', dept_ge_id, niveau_3_id),   -- EI 3ème année
    ('AII', dept_ge_id, niveau_3_id);  -- AII 3ème année
    
    -- Département GC - Génie Civil
    INSERT INTO specialite (nom, "departementId", "niveauId") VALUES
    ('BAT', dept_gc_id, niveau_2_id),  -- Bâtiment
    ('TP', dept_gc_id, niveau_2_id),   -- Travaux Publics
    ('BAT', dept_gc_id, niveau_3_id),  -- BAT 3ème année
    ('TP', dept_gc_id, niveau_3_id);   -- TP 3ème année
    
END $$;

-- Afficher les spécialités créées
SELECT '✅ Spécialités créées:' as info, COUNT(*) as total FROM specialite;

-- Afficher toutes les spécialités avec leur département et niveau
SELECT 
    s.id,
    s.nom as specialite,
    d.nom as departement,
    d.code as code_dept,
    n.nom as niveau
FROM specialite s
JOIN departement d ON s."departementId" = d.id
JOIN niveau n ON s."niveauId" = n.id
ORDER BY d.code, n.nom, s.nom;
