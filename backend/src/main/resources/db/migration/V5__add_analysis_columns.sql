-- V5__add_analysis_columns.sql
-- The original V4 schema predates the insights/improvements lists and the
-- source-provenance column. Hibernate's ddl-auto had been filling these in,
-- so existing databases may or may not have them. ADD COLUMN IF NOT EXISTS
-- makes this safe on both baselined (existing) and fresh databases.
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS insights TEXT;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS improvements TEXT;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS source VARCHAR(32);
