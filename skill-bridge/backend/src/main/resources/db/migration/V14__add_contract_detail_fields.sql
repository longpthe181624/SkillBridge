-- V14__add_contract_detail_fields.sql
-- Add contract detail fields to contracts table and create contract_history table for Story-13

-- Add additional fields to contracts table for MSA detail
-- Note: Using stored procedure to check if columns exist before adding (MySQL doesn't support IF NOT EXISTS for ADD COLUMN)
SET @dbname = DATABASE();
SET @tablename = 'contracts';

-- Add currency column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'currency');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN currency VARCHAR(16) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add payment_terms column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'payment_terms');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN payment_terms VARCHAR(128) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add invoicing_cycle column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'invoicing_cycle');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN invoicing_cycle VARCHAR(64) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add billing_day column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'billing_day');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN billing_day VARCHAR(64) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add tax_withholding column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'tax_withholding');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN tax_withholding VARCHAR(16) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add ip_ownership column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'ip_ownership');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN ip_ownership VARCHAR(128) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add governing_law column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'governing_law');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN governing_law VARCHAR(64) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add landbridge_contact_name column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'landbridge_contact_name');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN landbridge_contact_name VARCHAR(255) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add landbridge_contact_email column if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'landbridge_contact_email');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN landbridge_contact_email VARCHAR(255) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create contract_history table
CREATE TABLE IF NOT EXISTS contract_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  entry_date DATE NOT NULL,
  description TEXT NOT NULL,
  document_link VARCHAR(500) NULL,
  document_name VARCHAR(255) NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_contract_history_contract_id (contract_id),
  INDEX idx_contract_history_entry_date (entry_date),
  INDEX idx_contract_history_created_at (created_at)
);

