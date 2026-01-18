-- SkillBridge Database - Add Description to Skills
-- Flyway Migration V41: Add description column to skills table

ALTER TABLE skills ADD COLUMN description TEXT NULL;

