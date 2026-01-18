-- V32__add_attachments_to_contracts.sql
-- Add link and attachments_manifest columns to contracts table for storing attachment information
-- Similar to proposals table structure

SET @dbname = DATABASE();

-- Add link column to contracts table (if not exists)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'contracts' AND COLUMN_NAME = 'link');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE contracts ADD COLUMN link VARCHAR(500) NULL AFTER landbridge_contact_email', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add attachments_manifest column to contracts table (if not exists)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'contracts' AND COLUMN_NAME = 'attachments_manifest');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE contracts ADD COLUMN attachments_manifest TEXT NULL AFTER link', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

