-- Migration: Add directeur_id column to notifications table
-- Date: 2025-11-24

ALTER TABLE notifications
ADD COLUMN directeur_id INTEGER NULL;

-- Add index for better performance
CREATE INDEX idx_notifications_directeur_id ON notifications(directeur_id);

-- Add comment
COMMENT ON COLUMN notifications.directeur_id IS 'ID du directeur destinataire de la notification';