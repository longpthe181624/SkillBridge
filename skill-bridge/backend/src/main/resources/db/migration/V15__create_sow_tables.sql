-- V15__create_sow_tables.sql
-- Create SOW tables for Story-14: Fixed Price and Retainer SOW detail

-- Add engagement_type column to contracts table if not exists (to distinguish Fixed Price vs Retainer)
SET @dbname = DATABASE();
SET @tablename = 'contracts';

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'engagement_type');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN engagement_type VARCHAR(50) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add parent_msa_id column to contracts table if not exists (for SOW to reference parent MSA)
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'parent_msa_id');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN parent_msa_id INT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add scope_summary column to contracts table if not exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'scope_summary');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE contracts ADD COLUMN scope_summary TEXT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create Fixed Price SOW table
CREATE TABLE IF NOT EXISTS fixed_price_sows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  parent_msa_id INT NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  value DECIMAL(16,2) NOT NULL,
  invoicing_cycle VARCHAR(64),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  billing_day VARCHAR(64),
  scope_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_msa_id) REFERENCES contracts(id) ON DELETE CASCADE,
  INDEX idx_contract_id (contract_id),
  INDEX idx_parent_msa_id (parent_msa_id)
);

-- Create Milestone Deliverables table
CREATE TABLE IF NOT EXISTS milestone_deliverables (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fixed_price_sow_id INT NOT NULL,
  milestone VARCHAR(255) NOT NULL,
  delivery_note TEXT,
  acceptance_criteria TEXT,
  planned_end DATE NOT NULL,
  payment_percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (fixed_price_sow_id) REFERENCES fixed_price_sows(id) ON DELETE CASCADE,
  INDEX idx_sow_id (fixed_price_sow_id),
  INDEX idx_planned_end (planned_end)
);

-- Create Fixed Price Billing Details table
CREATE TABLE IF NOT EXISTS fixed_price_billing_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fixed_price_sow_id INT NOT NULL,
  billing_name VARCHAR(255) NOT NULL,
  milestone VARCHAR(255),
  amount DECIMAL(16,2) NOT NULL,
  percentage DECIMAL(5,2) NULL,
  invoice_date DATE NOT NULL,
  milestone_deliverable_id INT NULL,
  change_request_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (fixed_price_sow_id) REFERENCES fixed_price_sows(id) ON DELETE CASCADE,
  FOREIGN KEY (milestone_deliverable_id) REFERENCES milestone_deliverables(id) ON DELETE SET NULL,
  INDEX idx_sow_id (fixed_price_sow_id),
  INDEX idx_invoice_date (invoice_date)
);

-- Create Retainer SOW table
CREATE TABLE IF NOT EXISTS retainer_sows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  parent_msa_id INT NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  value DECIMAL(16,2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  invoicing_cycle VARCHAR(64),
  billing_day VARCHAR(64),
  scope_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_msa_id) REFERENCES contracts(id) ON DELETE CASCADE,
  INDEX idx_contract_id (contract_id),
  INDEX idx_parent_msa_id (parent_msa_id)
);

-- Create Delivery Items table
CREATE TABLE IF NOT EXISTS delivery_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  retainer_sow_id INT NOT NULL,
  milestone VARCHAR(255) NOT NULL,
  delivery_note TEXT NOT NULL,
  amount DECIMAL(16,2) NOT NULL,
  payment_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (retainer_sow_id) REFERENCES retainer_sows(id) ON DELETE CASCADE,
  INDEX idx_sow_id (retainer_sow_id),
  INDEX idx_payment_date (payment_date)
);

-- Create Retainer Billing Details table
CREATE TABLE IF NOT EXISTS retainer_billing_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  retainer_sow_id INT NOT NULL,
  payment_date DATE NOT NULL,
  delivery_note TEXT NOT NULL,
  amount DECIMAL(16,2) NOT NULL,
  delivery_item_id INT NULL,
  change_request_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (retainer_sow_id) REFERENCES retainer_sows(id) ON DELETE CASCADE,
  FOREIGN KEY (delivery_item_id) REFERENCES delivery_items(id) ON DELETE SET NULL,
  INDEX idx_sow_id (retainer_sow_id),
  INDEX idx_payment_date (payment_date)
);

-- Create Change Requests table (common for both Fixed Price and Retainer SOW)
CREATE TABLE IF NOT EXISTS change_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  change_request_id VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL,
  summary TEXT NOT NULL,
  planned_end DATE NULL,
  effective_from DATE NULL,
  effective_until DATE NULL,
  amount DECIMAL(16,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  INDEX idx_contract_id (contract_id),
  INDEX idx_change_request_id (change_request_id),
  INDEX idx_status (status)
);

