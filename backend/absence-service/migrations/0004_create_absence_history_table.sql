-- Création de la table absence_history pour suivre les modifications d'absences
CREATE TABLE IF NOT EXISTS absence_history (
    id SERIAL PRIMARY KEY,
    etudiant_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('created', 'deleted')),
    absence_count_before INTEGER NOT NULL DEFAULT 0,
    absence_count_after INTEGER NOT NULL DEFAULT 0,
    matiere_nom VARCHAR(100),
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enseignant_id INTEGER,
    details TEXT,
    FOREIGN KEY (etudiant_id) REFERENCES etudiant(id),
    FOREIGN KEY (enseignant_id) REFERENCES enseignant(id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_absence_history_etudiant ON absence_history(etudiant_id);
CREATE INDEX IF NOT EXISTS idx_absence_history_date ON absence_history(date_action);
CREATE INDEX IF NOT EXISTS idx_absence_history_action ON absence_history(action);