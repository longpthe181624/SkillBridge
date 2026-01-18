-- V28__make_proposals_contact_id_nullable.sql
-- Make contact_id nullable in proposals table to support proposals created from opportunities

SET @dbname = DATABASE();
SET @tablename = 'proposals';
SET @columnname = 'contact_id';

-- Modify contact_id to be nullable (if it's currently NOT NULL)
-- This allows proposals to be created from opportunities without requiring a contact_id
ALTER TABLE proposals MODIFY COLUMN contact_id INT NULL;

