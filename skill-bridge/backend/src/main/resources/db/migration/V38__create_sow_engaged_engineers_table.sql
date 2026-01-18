-- Create sow_engaged_engineers table for Retainer SOW contracts
CREATE TABLE IF NOT EXISTS sow_engaged_engineers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_contract_id INT NOT NULL,
  engineer_level VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rating DECIMAL(5, 2) NOT NULL,
  salary DECIMAL(16, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_contract_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  INDEX idx_sow_engaged_engineers_sow_contract_id (sow_contract_id)
);

