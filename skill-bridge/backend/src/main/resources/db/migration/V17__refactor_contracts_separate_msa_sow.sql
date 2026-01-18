-- V17__refactor_contracts_separate_msa_sow.sql
-- Refactor contracts: contracts table only for MSA, create separate sow_contracts table for SOW

-- Step 1: Create sow_contracts table (for SOW contracts)
CREATE TABLE IF NOT EXISTS sow_contracts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  contract_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  engagement_type VARCHAR(50) NOT NULL, -- 'Fixed Price' or 'Retainer'
  parent_msa_id INT NOT NULL, -- Reference to parent MSA contract
  project_name VARCHAR(255) NOT NULL,
  scope_summary TEXT,
  period_start DATE,
  period_end DATE,
  value DECIMAL(16,2),
  assignee_id VARCHAR(50),
  currency VARCHAR(16),
  payment_terms VARCHAR(128),
  invoicing_cycle VARCHAR(64),
  billing_day VARCHAR(64),
  tax_withholding VARCHAR(16),
  ip_ownership VARCHAR(128),
  governing_law VARCHAR(64),
  landbridge_contact_name VARCHAR(255),
  landbridge_contact_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_msa_id) REFERENCES contracts(id) ON DELETE CASCADE,
  INDEX idx_sow_contracts_client_id (client_id),
  INDEX idx_sow_contracts_parent_msa_id (parent_msa_id),
  INDEX idx_sow_contracts_status (status),
  INDEX idx_sow_contracts_engagement_type (engagement_type),
  INDEX idx_sow_contracts_created_at (created_at)
);

-- Step 2: Migrate existing SOW contracts from contracts table to sow_contracts
-- First, insert SOW contracts into sow_contracts
INSERT INTO sow_contracts (
  client_id,
  contract_name,
  status,
  engagement_type,
  parent_msa_id,
  project_name,
  scope_summary,
  period_start,
  period_end,
  value,
  assignee_id,
  currency,
  payment_terms,
  invoicing_cycle,
  billing_day,
  tax_withholding,
  ip_ownership,
  governing_law,
  landbridge_contact_name,
  landbridge_contact_email,
  created_at,
  updated_at
)
SELECT 
  client_id,
  contract_name,
  status,
  COALESCE(engagement_type, 'Fixed Price') as engagement_type,
  COALESCE(parent_msa_id, (SELECT MIN(id) FROM contracts WHERE contract_type = 'MSA' AND client_id = c.client_id LIMIT 1)) as parent_msa_id,
  COALESCE(contract_name, 'SOW Project') as project_name,
  scope_summary,
  period_start,
  period_end,
  value,
  assignee_id,
  currency,
  payment_terms,
  invoicing_cycle,
  billing_day,
  tax_withholding,
  ip_ownership,
  governing_law,
  landbridge_contact_name,
  landbridge_contact_email,
  created_at,
  updated_at
FROM contracts c
WHERE contract_type = 'SOW';

-- Step 3: Drop foreign key constraints BEFORE updating data
-- This is necessary because we're changing the foreign key reference from contracts to sow_contracts
SET @dbname = DATABASE();

-- Drop foreign key for fixed_price_sows.contract_id (if exists)
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'fixed_price_sows' 
  AND COLUMN_NAME = 'contract_id' AND REFERENCED_TABLE_NAME = 'contracts' LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL, CONCAT('ALTER TABLE fixed_price_sows DROP FOREIGN KEY ', @fk_name), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop foreign key for retainer_sows.contract_id (if exists)
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'retainer_sows' 
  AND COLUMN_NAME = 'contract_id' AND REFERENCED_TABLE_NAME = 'contracts' LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL, CONCAT('ALTER TABLE retainer_sows DROP FOREIGN KEY ', @fk_name), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 4: Create mapping between old contract_id and new sow_contract_id
-- Create temporary mapping table
CREATE TEMPORARY TABLE IF NOT EXISTS contract_id_mapping AS
SELECT 
  c.id as old_contract_id,
  s.id as new_sow_contract_id
FROM contracts c
INNER JOIN sow_contracts s ON 
  c.client_id = s.client_id 
  AND c.contract_name = s.contract_name
  AND c.created_at = s.created_at
WHERE c.contract_type = 'SOW';

-- Step 5: Update fixed_price_sows to use sow_contract_id from mapping
-- Only update if mapping table has data
SET @mapping_count = (SELECT COUNT(*) FROM contract_id_mapping);
SET @sql = IF(@mapping_count > 0, 
  'UPDATE fixed_price_sows fps INNER JOIN contract_id_mapping m ON fps.contract_id = m.old_contract_id SET fps.contract_id = m.new_sow_contract_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 6: Update retainer_sows to reference sow_contracts
-- Only update if mapping table has data
SET @sql = IF(@mapping_count > 0, 
  'UPDATE retainer_sows rs INNER JOIN contract_id_mapping m ON rs.contract_id = m.old_contract_id SET rs.contract_id = m.new_sow_contract_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 7: Add new foreign key constraints AFTER updating data
-- Add foreign key for fixed_price_sows.contract_id to reference sow_contracts
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'fixed_price_sows' 
  AND COLUMN_NAME = 'contract_id' AND REFERENCED_TABLE_NAME = 'sow_contracts' LIMIT 1);
SET @sql = IF(@fk_name IS NULL, 
  'ALTER TABLE fixed_price_sows ADD CONSTRAINT fk_fixed_price_sows_sow_contract FOREIGN KEY (contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key for retainer_sows.contract_id to reference sow_contracts
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'retainer_sows' 
  AND COLUMN_NAME = 'contract_id' AND REFERENCED_TABLE_NAME = 'sow_contracts' LIMIT 1);
SET @sql = IF(@fk_name IS NULL, 
  'ALTER TABLE retainer_sows ADD CONSTRAINT fk_retainer_sows_sow_contract FOREIGN KEY (contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 8: Update change_requests to reference sow_contracts for SOW contracts
-- First, drop all foreign key constraints for contract_id (if exists)
-- Find FK constraint name using REFERENTIAL_CONSTRAINTS (more reliable)
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'change_requests' 
  AND REFERENCED_TABLE_NAME = 'contracts'
  LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL AND @fk_name != '', 
  CONCAT('ALTER TABLE change_requests DROP FOREIGN KEY ', @fk_name), 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make contract_id nullable (since it can be either MSA or SOW)
SET @column_nullable = (SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'change_requests' AND COLUMN_NAME = 'contract_id');
SET @sql = IF(@column_nullable = 'NO', 
  'ALTER TABLE change_requests MODIFY COLUMN contract_id INT NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Re-add foreign key constraint (now nullable is allowed)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'change_requests' 
  AND REFERENCED_TABLE_NAME = 'contracts');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE change_requests ADD CONSTRAINT fk_change_requests_contract FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add new columns to track if it's MSA or SOW
ALTER TABLE change_requests 
ADD COLUMN contract_type VARCHAR(10) NULL,
ADD COLUMN sow_contract_id INT NULL;

-- Update change_requests to set contract_type and sow_contract_id
-- Only update if mapping table has data
SET @mapping_count = (SELECT COUNT(*) FROM contract_id_mapping);
SET @sql = IF(@mapping_count > 0, 
  'UPDATE change_requests cr INNER JOIN contract_id_mapping m ON cr.contract_id = m.old_contract_id SET cr.contract_type = ''SOW'', cr.sow_contract_id = m.new_sow_contract_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Set contract_type for MSA change requests
UPDATE change_requests cr
INNER JOIN contracts c ON cr.contract_id = c.id
SET cr.contract_type = 'MSA'
WHERE cr.contract_type IS NULL AND c.contract_type = 'MSA';

-- Step 9: Update contract_history to reference sow_contracts for SOW contracts
-- First, drop all foreign key constraints for contract_id (if exists)
-- Find FK constraint name using REFERENTIAL_CONSTRAINTS (more reliable)
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'contract_history' 
  AND REFERENCED_TABLE_NAME = 'contracts'
  LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL AND @fk_name != '', 
  CONCAT('ALTER TABLE contract_history DROP FOREIGN KEY ', @fk_name), 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make contract_id nullable (since it can be either MSA or SOW)
SET @column_nullable = (SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'contract_history' AND COLUMN_NAME = 'contract_id');
SET @sql = IF(@column_nullable = 'NO', 
  'ALTER TABLE contract_history MODIFY COLUMN contract_id INT NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Re-add foreign key constraint (now nullable is allowed)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'contract_history' 
  AND REFERENCED_TABLE_NAME = 'contracts');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE contract_history ADD CONSTRAINT fk_contract_history_contract FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add new column for SOW contract history
ALTER TABLE contract_history
ADD COLUMN sow_contract_id INT NULL,
ADD COLUMN history_type VARCHAR(10) NULL DEFAULT 'MSA';

-- Update contract_history to set history_type and sow_contract_id
-- Only update if mapping table has data
SET @mapping_count = (SELECT COUNT(*) FROM contract_id_mapping);
SET @sql = IF(@mapping_count > 0, 
  'UPDATE contract_history ch INNER JOIN contract_id_mapping m ON ch.contract_id = m.old_contract_id SET ch.history_type = ''SOW'', ch.sow_contract_id = m.new_sow_contract_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 10: Remove SOW-specific columns from contracts table (keep only MSA)
-- Remove contract_type column (contracts table is now MSA-only)
SET @dbname = DATABASE();
SET @tablename = 'contracts';

-- Drop contract_type column if exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'contract_type');
SET @sql = IF(@column_exists > 0, 'ALTER TABLE contracts DROP COLUMN contract_type', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop engagement_type column if exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'engagement_type');
SET @sql = IF(@column_exists > 0, 'ALTER TABLE contracts DROP COLUMN engagement_type', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop parent_msa_id column if exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'parent_msa_id');
SET @sql = IF(@column_exists > 0, 'ALTER TABLE contracts DROP COLUMN parent_msa_id', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop scope_summary column if exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'scope_summary');
SET @sql = IF(@column_exists > 0, 'ALTER TABLE contracts DROP COLUMN scope_summary', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 11: Add foreign key constraints for change_requests and contract_history
-- Check if constraint already exists before adding
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'change_requests' 
  AND COLUMN_NAME = 'sow_contract_id' AND REFERENCED_TABLE_NAME = 'sow_contracts' LIMIT 1);
SET @sql = IF(@fk_name IS NULL, 
  'ALTER TABLE change_requests ADD CONSTRAINT fk_change_requests_sow_contract FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'contract_history' 
  AND COLUMN_NAME = 'sow_contract_id' AND REFERENCED_TABLE_NAME = 'sow_contracts' LIMIT 1);
SET @sql = IF(@fk_name IS NULL, 
  'ALTER TABLE contract_history ADD CONSTRAINT fk_contract_history_sow_contract FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 12: Update fixed_price_sows.parent_msa_id to reference contracts (MSA)
-- Check if constraint already exists, if not add it
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'fixed_price_sows' 
  AND COLUMN_NAME = 'parent_msa_id' AND REFERENCED_TABLE_NAME = 'contracts' LIMIT 1);
SET @sql = IF(@fk_name IS NULL, 
  'ALTER TABLE fixed_price_sows ADD CONSTRAINT fk_fixed_price_sows_parent_msa FOREIGN KEY (parent_msa_id) REFERENCES contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 13: Update retainer_sows.parent_msa_id to reference contracts (MSA)
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'retainer_sows' 
  AND COLUMN_NAME = 'parent_msa_id' AND REFERENCED_TABLE_NAME = 'contracts' LIMIT 1);
SET @sql = IF(@fk_name IS NULL, 
  'ALTER TABLE retainer_sows ADD CONSTRAINT fk_retainer_sows_parent_msa FOREIGN KEY (parent_msa_id) REFERENCES contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 14: Delete SOW contracts from contracts table (they're now in sow_contracts)
-- Only delete if mapping table has data
SET @mapping_count = (SELECT COUNT(*) FROM contract_id_mapping);
SET @sql = IF(@mapping_count > 0, 
  'DELETE c FROM contracts c INNER JOIN contract_id_mapping m ON c.id = m.old_contract_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 15: Clean up - drop temporary table
DROP TEMPORARY TABLE IF EXISTS contract_id_mapping;

