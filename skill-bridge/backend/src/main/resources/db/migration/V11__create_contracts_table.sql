-- V11__create_contracts_table.sql
-- Create contracts table for Story-12 Client Contract List Management

CREATE TABLE IF NOT EXISTS contracts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  contract_type VARCHAR(10) NOT NULL,
  contract_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  period_start DATE,
  period_end DATE,
  value DECIMAL(16,2),
  assignee_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_contracts_client_id (client_id),
  INDEX idx_contracts_status (status),
  INDEX idx_contracts_type (contract_type),
  INDEX idx_contracts_created_at (created_at)
);

