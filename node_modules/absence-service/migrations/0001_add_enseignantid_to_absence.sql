-- Migration: add enseignantId column to absence table
-- Run this file with psql against your local Postgres database

ALTER TABLE IF EXISTS "absence"
ADD COLUMN IF NOT EXISTS "enseignantId" integer NULL;

-- Optional: you can add a foreign key constraint if you have an enseignants table:
-- ALTER TABLE "absence" ADD CONSTRAINT fk_absence_enseignant FOREIGN KEY ("enseignantId") REFERENCES "enseignant"(id);
