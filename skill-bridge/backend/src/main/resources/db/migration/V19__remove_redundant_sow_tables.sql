-- V19__remove_redundant_sow_tables.sql
-- Remove fixed_price_sows and retainer_sows tables as they are redundant with sow_contracts
-- Update child tables to reference sow_contracts directly

SET @dbname = DATABASE();

-- Step 1: Update milestone_deliverables to reference sow_contracts directly
-- Check if fixed_price_sow_id column exists
SET @old_column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'milestone_deliverables' AND COLUMN_NAME = 'fixed_price_sow_id');
SET @new_column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'milestone_deliverables' AND COLUMN_NAME = 'sow_contract_id');

-- Add new column if it doesn't exist
SET @sql = IF(@new_column_exists = 0 AND @old_column_exists > 0, 
  'ALTER TABLE milestone_deliverables ADD COLUMN sow_contract_id INT NULL AFTER fixed_price_sow_id', 
  IF(@new_column_exists = 0, 
    'ALTER TABLE milestone_deliverables ADD COLUMN sow_contract_id INT NULL', 
    'SELECT 1'));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Migrate data: Copy fixed_price_sow_id to sow_contract_id (only if old column exists and fixed_price_sows table exists)
SET @table_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'fixed_price_sows');
SET @sql = IF(@old_column_exists > 0 AND @table_exists > 0, 
  'UPDATE milestone_deliverables md INNER JOIN fixed_price_sows fps ON md.fixed_price_sow_id = fps.id SET md.sow_contract_id = fps.contract_id WHERE md.sow_contract_id IS NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop foreign key constraint for fixed_price_sow_id (if exists)
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'milestone_deliverables' 
  AND REFERENCED_TABLE_NAME = 'fixed_price_sows'
  LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL AND @fk_name != '', 
  CONCAT('ALTER TABLE milestone_deliverables DROP FOREIGN KEY ', @fk_name), 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make sow_contract_id NOT NULL (only if we have data) and drop fixed_price_sow_id
SET @data_count = (SELECT COUNT(*) FROM milestone_deliverables WHERE sow_contract_id IS NOT NULL);
SET @sql = IF(@data_count > 0 AND @old_column_exists > 0, 
  'UPDATE milestone_deliverables SET sow_contract_id = (SELECT contract_id FROM fixed_price_sows WHERE id = milestone_deliverables.fixed_price_sow_id LIMIT 1) WHERE sow_contract_id IS NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make column NOT NULL if we have data, otherwise keep it nullable
SET @sql = IF(@data_count > 0, 
  'ALTER TABLE milestone_deliverables MODIFY COLUMN sow_contract_id INT NOT NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop old column if it exists
SET @sql = IF(@old_column_exists > 0, 
  'ALTER TABLE milestone_deliverables DROP COLUMN fixed_price_sow_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint to sow_contracts
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'milestone_deliverables' 
  AND REFERENCED_TABLE_NAME = 'sow_contracts');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE milestone_deliverables ADD CONSTRAINT fk_milestone_deliverables_sow_contract FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Rename index: Drop old index if exists, add new one
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'milestone_deliverables' AND INDEX_NAME = 'idx_sow_id');
SET @sql = IF(@index_exists > 0, 
  'ALTER TABLE milestone_deliverables DROP INDEX idx_sow_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'milestone_deliverables' AND INDEX_NAME = 'idx_sow_contract_id');
SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE milestone_deliverables ADD INDEX idx_sow_contract_id (sow_contract_id)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Update fixed_price_billing_details to reference sow_contracts directly
-- Check if fixed_price_sow_id column exists
SET @old_column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'fixed_price_billing_details' AND COLUMN_NAME = 'fixed_price_sow_id');
SET @new_column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'fixed_price_billing_details' AND COLUMN_NAME = 'sow_contract_id');

-- Add new column if it doesn't exist
SET @sql = IF(@new_column_exists = 0 AND @old_column_exists > 0, 
  'ALTER TABLE fixed_price_billing_details ADD COLUMN sow_contract_id INT NULL AFTER fixed_price_sow_id', 
  IF(@new_column_exists = 0, 
    'ALTER TABLE fixed_price_billing_details ADD COLUMN sow_contract_id INT NULL', 
    'SELECT 1'));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Migrate data (only if old column exists and fixed_price_sows table exists)
SET @table_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'fixed_price_sows');
SET @sql = IF(@old_column_exists > 0 AND @table_exists > 0, 
  'UPDATE fixed_price_billing_details fbd INNER JOIN fixed_price_sows fps ON fbd.fixed_price_sow_id = fps.id SET fbd.sow_contract_id = fps.contract_id WHERE fbd.sow_contract_id IS NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop foreign key constraint
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'fixed_price_billing_details' 
  AND REFERENCED_TABLE_NAME = 'fixed_price_sows'
  LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL AND @fk_name != '', 
  CONCAT('ALTER TABLE fixed_price_billing_details DROP FOREIGN KEY ', @fk_name), 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make sow_contract_id NOT NULL (only if we have data) and drop fixed_price_sow_id
SET @data_count = (SELECT COUNT(*) FROM fixed_price_billing_details WHERE sow_contract_id IS NOT NULL);
SET @sql = IF(@data_count > 0 AND @old_column_exists > 0, 
  'UPDATE fixed_price_billing_details SET sow_contract_id = (SELECT contract_id FROM fixed_price_sows WHERE id = fixed_price_billing_details.fixed_price_sow_id LIMIT 1) WHERE sow_contract_id IS NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make column NOT NULL if we have data
SET @sql = IF(@data_count > 0, 
  'ALTER TABLE fixed_price_billing_details MODIFY COLUMN sow_contract_id INT NOT NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop old column if it exists
SET @sql = IF(@old_column_exists > 0, 
  'ALTER TABLE fixed_price_billing_details DROP COLUMN fixed_price_sow_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint to sow_contracts
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'fixed_price_billing_details' 
  AND REFERENCED_TABLE_NAME = 'sow_contracts');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE fixed_price_billing_details ADD CONSTRAINT fk_fixed_price_billing_details_sow_contract FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Rename index: Drop old index if exists, add new one
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'fixed_price_billing_details' AND INDEX_NAME = 'idx_sow_id');
SET @sql = IF(@index_exists > 0, 
  'ALTER TABLE fixed_price_billing_details DROP INDEX idx_sow_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'fixed_price_billing_details' AND INDEX_NAME = 'idx_sow_contract_id');
SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE fixed_price_billing_details ADD INDEX idx_sow_contract_id (sow_contract_id)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 3: Update delivery_items to reference sow_contracts directly
-- Check if retainer_sow_id column exists
SET @old_column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'delivery_items' AND COLUMN_NAME = 'retainer_sow_id');
SET @new_column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'delivery_items' AND COLUMN_NAME = 'sow_contract_id');

-- Add new column if it doesn't exist
SET @sql = IF(@new_column_exists = 0 AND @old_column_exists > 0, 
  'ALTER TABLE delivery_items ADD COLUMN sow_contract_id INT NULL AFTER retainer_sow_id', 
  IF(@new_column_exists = 0, 
    'ALTER TABLE delivery_items ADD COLUMN sow_contract_id INT NULL', 
    'SELECT 1'));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Migrate data (only if old column exists and retainer_sows table exists)
SET @table_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'retainer_sows');
SET @sql = IF(@old_column_exists > 0 AND @table_exists > 0, 
  'UPDATE delivery_items di INNER JOIN retainer_sows rs ON di.retainer_sow_id = rs.id SET di.sow_contract_id = rs.contract_id WHERE di.sow_contract_id IS NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop foreign key constraint
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'delivery_items' 
  AND REFERENCED_TABLE_NAME = 'retainer_sows'
  LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL AND @fk_name != '', 
  CONCAT('ALTER TABLE delivery_items DROP FOREIGN KEY ', @fk_name), 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make sow_contract_id NOT NULL (only if we have data) and drop retainer_sow_id
SET @data_count = (SELECT COUNT(*) FROM delivery_items WHERE sow_contract_id IS NOT NULL);
SET @sql = IF(@data_count > 0 AND @old_column_exists > 0, 
  'UPDATE delivery_items SET sow_contract_id = (SELECT contract_id FROM retainer_sows WHERE id = delivery_items.retainer_sow_id LIMIT 1) WHERE sow_contract_id IS NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make column NOT NULL if we have data
SET @sql = IF(@data_count > 0, 
  'ALTER TABLE delivery_items MODIFY COLUMN sow_contract_id INT NOT NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop old column if it exists
SET @sql = IF(@old_column_exists > 0, 
  'ALTER TABLE delivery_items DROP COLUMN retainer_sow_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint to sow_contracts
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'delivery_items' 
  AND REFERENCED_TABLE_NAME = 'sow_contracts');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE delivery_items ADD CONSTRAINT fk_delivery_items_sow_contract FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Rename index: Drop old index if exists, add new one
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'delivery_items' AND INDEX_NAME = 'idx_sow_id');
SET @sql = IF(@index_exists > 0, 
  'ALTER TABLE delivery_items DROP INDEX idx_sow_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'delivery_items' AND INDEX_NAME = 'idx_sow_contract_id');
SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE delivery_items ADD INDEX idx_sow_contract_id (sow_contract_id)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 4: Update retainer_billing_details to reference sow_contracts directly
-- Check if retainer_sow_id column exists
SET @old_column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'retainer_billing_details' AND COLUMN_NAME = 'retainer_sow_id');
SET @new_column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'retainer_billing_details' AND COLUMN_NAME = 'sow_contract_id');

-- Add new column if it doesn't exist
SET @sql = IF(@new_column_exists = 0 AND @old_column_exists > 0, 
  'ALTER TABLE retainer_billing_details ADD COLUMN sow_contract_id INT NULL AFTER retainer_sow_id', 
  IF(@new_column_exists = 0, 
    'ALTER TABLE retainer_billing_details ADD COLUMN sow_contract_id INT NULL', 
    'SELECT 1'));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Migrate data (only if old column exists and retainer_sows table exists)
SET @table_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'retainer_sows');
SET @sql = IF(@old_column_exists > 0 AND @table_exists > 0, 
  'UPDATE retainer_billing_details rbd INNER JOIN retainer_sows rs ON rbd.retainer_sow_id = rs.id SET rbd.sow_contract_id = rs.contract_id WHERE rbd.sow_contract_id IS NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop foreign key constraint
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'retainer_billing_details' 
  AND REFERENCED_TABLE_NAME = 'retainer_sows'
  LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL AND @fk_name != '', 
  CONCAT('ALTER TABLE retainer_billing_details DROP FOREIGN KEY ', @fk_name), 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make sow_contract_id NOT NULL (only if we have data) and drop retainer_sow_id
SET @data_count = (SELECT COUNT(*) FROM retainer_billing_details WHERE sow_contract_id IS NOT NULL);
SET @sql = IF(@data_count > 0 AND @old_column_exists > 0, 
  'UPDATE retainer_billing_details SET sow_contract_id = (SELECT contract_id FROM retainer_sows WHERE id = retainer_billing_details.retainer_sow_id LIMIT 1) WHERE sow_contract_id IS NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make column NOT NULL if we have data
SET @sql = IF(@data_count > 0, 
  'ALTER TABLE retainer_billing_details MODIFY COLUMN sow_contract_id INT NOT NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop old column if it exists
SET @sql = IF(@old_column_exists > 0, 
  'ALTER TABLE retainer_billing_details DROP COLUMN retainer_sow_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint to sow_contracts
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'retainer_billing_details' 
  AND REFERENCED_TABLE_NAME = 'sow_contracts');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE retainer_billing_details ADD CONSTRAINT fk_retainer_billing_details_sow_contract FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Rename index: Drop old index if exists, add new one
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'retainer_billing_details' AND INDEX_NAME = 'idx_sow_id');
SET @sql = IF(@index_exists > 0, 
  'ALTER TABLE retainer_billing_details DROP INDEX idx_sow_id', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'retainer_billing_details' AND INDEX_NAME = 'idx_sow_contract_id');
SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE retainer_billing_details ADD INDEX idx_sow_contract_id (sow_contract_id)', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 5: Drop foreign key constraints from fixed_price_sows and retainer_sows before dropping tables
-- Drop foreign keys from fixed_price_sows
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'fixed_price_sows' 
  AND REFERENCED_TABLE_NAME = 'sow_contracts'
  LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL AND @fk_name != '', 
  CONCAT('ALTER TABLE fixed_price_sows DROP FOREIGN KEY ', @fk_name), 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'fixed_price_sows' 
  AND REFERENCED_TABLE_NAME = 'contracts'
  LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL AND @fk_name != '', 
  CONCAT('ALTER TABLE fixed_price_sows DROP FOREIGN KEY ', @fk_name), 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop foreign keys from retainer_sows
SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'retainer_sows' 
  AND REFERENCED_TABLE_NAME = 'sow_contracts'
  LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL AND @fk_name != '', 
  CONCAT('ALTER TABLE retainer_sows DROP FOREIGN KEY ', @fk_name), 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_name = (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = @dbname 
  AND TABLE_NAME = 'retainer_sows' 
  AND REFERENCED_TABLE_NAME = 'contracts'
  LIMIT 1);
SET @sql = IF(@fk_name IS NOT NULL AND @fk_name != '', 
  CONCAT('ALTER TABLE retainer_sows DROP FOREIGN KEY ', @fk_name), 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 6: Drop the redundant tables
DROP TABLE IF EXISTS fixed_price_sows;
DROP TABLE IF EXISTS retainer_sows;

