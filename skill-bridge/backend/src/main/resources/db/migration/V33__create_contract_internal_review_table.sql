-- V33__create_contract_internal_review_table.sql
-- Create contract_internal_review table to store internal review information
-- This table is separate from contract_history to keep internal reviews hidden from clients

CREATE TABLE IF NOT EXISTS contract_internal_review (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  sow_contract_id INT NULL,
  contract_type VARCHAR(10) NOT NULL, -- 'MSA' or 'SOW'
  reviewer_id INT NOT NULL,
  review_action VARCHAR(32) NOT NULL, -- 'APPROVE', 'REQUEST_REVISION', 'REJECT'
  review_notes TEXT NULL,
  reviewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contract_internal_review_contract_id (contract_id),
  INDEX idx_contract_internal_review_sow_contract_id (sow_contract_id),
  INDEX idx_contract_internal_review_contract_type (contract_type),
  INDEX idx_contract_internal_review_reviewer_id (reviewer_id),
  INDEX idx_contract_internal_review_reviewed_at (reviewed_at),
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);

