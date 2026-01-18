-- V35__add_reviewer_and_attachments_to_sow_contracts.sql
-- Add reviewer_id, link, and attachments_manifest columns to sow_contracts table
-- Similar to contracts table structure

SET @dbname = DATABASE();

-- Add reviewer_id column to sow_contracts table (if not exists)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'sow_contracts' AND COLUMN_NAME = 'reviewer_id');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE sow_contracts ADD COLUMN reviewer_id INT NULL AFTER assignee_user_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add link column to sow_contracts table (if not exists)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'sow_contracts' AND COLUMN_NAME = 'link');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE sow_contracts ADD COLUMN link VARCHAR(500) NULL AFTER landbridge_contact_email', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add attachments_manifest column to sow_contracts table (if not exists)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'sow_contracts' AND COLUMN_NAME = 'attachments_manifest');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE sow_contracts ADD COLUMN attachments_manifest TEXT NULL AFTER link', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

