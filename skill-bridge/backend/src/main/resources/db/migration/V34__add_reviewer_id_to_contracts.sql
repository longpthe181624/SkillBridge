-- V34__add_reviewer_id_to_contracts.sql
-- Add reviewer_id column to contracts table to store assigned reviewer

SET @dbname = DATABASE();

-- Add reviewer_id column to contracts table (if not exists)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'contracts' AND COLUMN_NAME = 'reviewer_id');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE contracts ADD COLUMN reviewer_id INT NULL AFTER assignee_user_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint (optional, can be added if needed)
-- ALTER TABLE contracts ADD CONSTRAINT fk_contracts_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL;

