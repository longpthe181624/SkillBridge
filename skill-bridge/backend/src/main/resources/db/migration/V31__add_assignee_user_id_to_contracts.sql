-- V31__add_assignee_user_id_to_contracts.sql
-- Add assignee_user_id to contracts and sow_contracts tables for role-based filtering
-- This field references users table (Sales Man assigned to the contract)

SET @dbname = DATABASE();

-- Add assignee_user_id to contracts table (if not exists)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'contracts' AND COLUMN_NAME = 'assignee_user_id');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE contracts ADD COLUMN assignee_user_id INT NULL AFTER assignee_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for assignee_user_id in contracts table
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'contracts' AND INDEX_NAME = 'idx_contracts_assignee_user_id');
SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE contracts ADD INDEX idx_contracts_assignee_user_id (assignee_user_id)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint for assignee_user_id in contracts table
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'contracts' 
  AND COLUMN_NAME = 'assignee_user_id' AND REFERENCED_TABLE_NAME = 'users');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE contracts ADD CONSTRAINT fk_contracts_assignee_user FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add assignee_user_id to sow_contracts table (if not exists)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'sow_contracts' AND COLUMN_NAME = 'assignee_user_id');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE sow_contracts ADD COLUMN assignee_user_id INT NULL AFTER assignee_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for assignee_user_id in sow_contracts table
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'sow_contracts' AND INDEX_NAME = 'idx_sow_contracts_assignee_user_id');
SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE sow_contracts ADD INDEX idx_sow_contracts_assignee_user_id (assignee_user_id)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint for assignee_user_id in sow_contracts table
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'sow_contracts' 
  AND COLUMN_NAME = 'assignee_user_id' AND REFERENCED_TABLE_NAME = 'users');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE sow_contracts ADD CONSTRAINT fk_sow_contracts_assignee_user FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

