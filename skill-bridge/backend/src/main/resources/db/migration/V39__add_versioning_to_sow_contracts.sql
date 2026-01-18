-- V39__add_versioning_to_sow_contracts.sql
-- Add versioning support for Retainer SOW contracts
-- Note: MySQL doesn't support IF NOT EXISTS for ADD COLUMN, so we check before adding

SET @dbname = DATABASE();
SET @tablename = 'sow_contracts';

-- Add version column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'version');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE sow_contracts ADD COLUMN version INT NOT NULL DEFAULT 1', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add parent_version_id column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'parent_version_id');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE sow_contracts ADD COLUMN parent_version_id INT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for parent_version_id for faster lookups (if not exists)
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_sow_contracts_parent_version_id');
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_sow_contracts_parent_version_id ON sow_contracts(parent_version_id)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint for parent_version_id (if not exists)
SET @constraint_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND CONSTRAINT_NAME = 'fk_sow_contracts_parent_version');
SET @sql = IF(@constraint_exists = 0, 
  'ALTER TABLE sow_contracts ADD CONSTRAINT fk_sow_contracts_parent_version FOREIGN KEY (parent_version_id) REFERENCES sow_contracts(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for version for faster queries (if not exists)
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_sow_contracts_version');
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_sow_contracts_version ON sow_contracts(version)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

