-- Création du schéma
CREATE SCHEMA IF NOT EXISTS cofrap;

-- Extension pour utiliser la génération UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création de la table dans le schéma 'cofrap'
CREATE TABLE IF NOT EXISTS cofrap.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    mfa TEXT,
    mfa_updated_at TIMESTAMP,
    gendate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expired BOOLEAN NOT NULL DEFAULT FALSE,
    disabled BOOLEAN DEFAULT FALSE
);

ALTER TABLE cofrap.users ADD COLUMN last_password_ok_at TIMESTAMP;


-- Création de la base si besoin (exécuté par superutilisateur)
-- CREATE DATABASE cofrap;

-- Création des utilisateurs
CREATE USER cofrap_admin WITH PASSWORD 'admin_pass';
CREATE USER cofrap_rw WITH PASSWORD 'rw_pass';
CREATE USER cofrap_ro WITH PASSWORD 'ro_pass';

-- Attribution des rôles (si besoin)
-- GRANT cofrap_admin TO another_super_user;

-- Attribution du schéma par défaut
ALTER ROLE cofrap_admin SET search_path = cofrap;
ALTER ROLE cofrap_rw SET search_path = cofrap;
ALTER ROLE cofrap_ro SET search_path = cofrap;

-- Attribution des droits
GRANT ALL PRIVILEGES ON SCHEMA cofrap TO cofrap_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cofrap TO cofrap_admin;

GRANT USAGE ON SCHEMA cofrap TO cofrap_rw;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA cofrap TO cofrap_rw;

GRANT USAGE ON SCHEMA cofrap TO cofrap_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA cofrap TO cofrap_ro;

-- Pour que les nouveaux objets héritent automatiquement des droits
ALTER DEFAULT PRIVILEGES IN SCHEMA cofrap GRANT SELECT ON TABLES TO cofrap_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA cofrap GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cofrap_rw;
ALTER DEFAULT PRIVILEGES IN SCHEMA cofrap GRANT ALL ON TABLES TO cofrap_admin;
