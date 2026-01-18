-- V36__make_contract_id_nullable_in_internal_review.sql
-- Make contract_id nullable in contract_internal_review table
-- This allows SOW contracts (which don't have contract_id) to have internal reviews

SET @dbname = DATABASE();

-- Check if column exists and is NOT NULL, then make it nullable
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @dbname 
  AND TABLE_NAME = 'contract_internal_review' 
  AND COLUMN_NAME = 'contract_id'
  AND IS_NULLABLE = 'NO');

SET @sql = IF(@column_exists > 0,
  'ALTER TABLE contract_internal_review MODIFY COLUMN contract_id INT NULL',
  'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

