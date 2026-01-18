-- V40__create_event_based_retainer_sow_tables.sql
-- Create tables for Event-based Retainer SOW Contracts
-- This migration creates baseline tables, event tables, and appendix table

SET @dbname = DATABASE();

-- ============================================
-- 1. Create Baseline Tables
-- ============================================

-- 1.1. Create sow_engaged_engineers_base table
CREATE TABLE IF NOT EXISTS sow_engaged_engineers_base (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  engineer_id INT NULL,  -- Optional: reference to engineer
  role VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  rating DECIMAL(5,2) NOT NULL DEFAULT 0,  -- FTE % (0-100)
  unit_rate DECIMAL(16,2) NOT NULL,  -- Monthly cost
  start_date DATE NOT NULL,
  end_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  INDEX idx_base_sow_contract_id (sow_contract_id),
  INDEX idx_base_dates (start_date, end_date)
);

-- 1.2. Create retainer_billing_base table
CREATE TABLE IF NOT EXISTS retainer_billing_base (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  billing_month DATE NOT NULL,  -- YYYY-MM-01 format
  amount DECIMAL(16,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  INDEX idx_base_sow_contract_id (sow_contract_id),
  INDEX idx_base_billing_month (billing_month),
  UNIQUE KEY uk_base_sow_month (sow_contract_id, billing_month)
);

-- ============================================
-- 2. Create Event Tables
-- ============================================

-- 2.1. Create cr_resource_events table
CREATE TABLE IF NOT EXISTS cr_resource_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  action ENUM('ADD', 'REMOVE', 'MODIFY') NOT NULL,
  engineer_id INT NULL,  -- For MODIFY/REMOVE: reference to base engineer
  role VARCHAR(100) NULL,
  level VARCHAR(50) NULL,
  rating_old DECIMAL(5,2) NULL,
  rating_new DECIMAL(5,2) NULL,
  unit_rate_old DECIMAL(16,2) NULL,
  unit_rate_new DECIMAL(16,2) NULL,
  start_date_old DATE NULL,
  start_date_new DATE NULL,
  end_date_old DATE NULL,
  end_date_new DATE NULL,
  effective_start DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  INDEX idx_cr_resource_cr_id (change_request_id),
  INDEX idx_cr_resource_effective (effective_start)
);

-- 2.2. Create cr_billing_events table
CREATE TABLE IF NOT EXISTS cr_billing_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  billing_month DATE NOT NULL,  -- YYYY-MM-01 format
  delta_amount DECIMAL(16,2) NOT NULL,  -- Positive or negative
  description TEXT,
  type ENUM('RETAINER_ADJUST', 'SCOPE_ADJUSTMENT', 'CORRECTION') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  INDEX idx_cr_billing_cr_id (change_request_id),
  INDEX idx_cr_billing_month (billing_month),
  INDEX idx_cr_billing_type (type)
);

-- ============================================
-- 3. Create Appendix Table
-- ============================================

-- 3.1. Create contract_appendices table
CREATE TABLE IF NOT EXISTS contract_appendices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  change_request_id INT NOT NULL,
  appendix_number VARCHAR(50) NOT NULL,  -- PL-001, PL-002...
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  pdf_path VARCHAR(500) NULL,
  signed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  UNIQUE KEY uk_appendix_number (sow_contract_id, appendix_number),
  INDEX idx_appendix_sow (sow_contract_id),
  INDEX idx_appendix_cr (change_request_id)
);

-- ============================================
-- 4. Update Existing Tables
-- ============================================

-- 4.1. Add base_total_amount to sow_contracts table
SET @tablename = 'sow_contracts';
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'base_total_amount');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE sow_contracts ADD COLUMN base_total_amount DECIMAL(16,2) NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4.2. Add appendix_id to change_requests table
SET @tablename = 'change_requests';
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'appendix_id');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE change_requests ADD COLUMN appendix_id INT NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint for appendix_id (if not exists)
SET @constraint_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = @dbname 
  AND TABLE_NAME = @tablename 
  AND CONSTRAINT_NAME = 'fk_change_requests_appendix');
SET @sql = IF(@constraint_exists = 0, 
  'ALTER TABLE change_requests ADD CONSTRAINT fk_change_requests_appendix FOREIGN KEY (appendix_id) REFERENCES contract_appendices(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4.3. Add sales_internal_note to change_requests table
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'sales_internal_note');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE change_requests ADD COLUMN sales_internal_note TEXT NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4.4. Add approved_by to change_requests table
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'approved_by');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE change_requests ADD COLUMN approved_by INT NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint for approved_by (if not exists)
SET @constraint_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = @dbname 
  AND TABLE_NAME = @tablename 
  AND CONSTRAINT_NAME = 'fk_change_requests_approved_by');
SET @sql = IF(@constraint_exists = 0, 
  'ALTER TABLE change_requests ADD CONSTRAINT fk_change_requests_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4.5. Add approved_at to change_requests table
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'approved_at');
SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE change_requests ADD COLUMN approved_at DATETIME NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

