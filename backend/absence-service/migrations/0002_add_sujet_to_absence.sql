-- Migration: add sujet column to absence table
-- Run this file with psql against your local Postgres database

ALTER TABLE IF EXISTS "absence"
ADD COLUMN IF NOT EXISTS "sujet" varchar(20) DEFAULT 'etudiant';
