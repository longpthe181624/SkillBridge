-- Add impact analysis fields and tables for Story-16: Change Request Detail
-- Add fields for Fixed Price impact analysis
-- Create tables for Retainer impact analysis (Engaged Engineers and Billing Details)
-- Create history table for change requests
-- Add evidence field

-- Add Fixed Price impact analysis fields to change_requests table
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'dev_hours'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN dev_hours INT NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'test_hours'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN test_hours INT NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'new_end_date'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN new_end_date DATE NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'delay_duration'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN delay_duration INT NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add evidence field to change_requests table
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'evidence'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN evidence TEXT NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create change_request_engaged_engineers table for Retainer impact analysis
CREATE TABLE IF NOT EXISTS change_request_engaged_engineers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  engineer_level VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rating DECIMAL(5, 2) NOT NULL,
  salary DECIMAL(16, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  INDEX idx_change_request_engaged_engineers_change_request_id (change_request_id)
);

-- Create change_request_billing_details table for Retainer impact analysis
CREATE TABLE IF NOT EXISTS change_request_billing_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  payment_date DATE NOT NULL,
  delivery_note VARCHAR(500) NOT NULL,
  amount DECIMAL(16, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  INDEX idx_change_request_billing_details_change_request_id (change_request_id)
);

-- Create change_request_history table
CREATE TABLE IF NOT EXISTS change_request_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_change_request_history_change_request_id (change_request_id),
  INDEX idx_change_request_history_timestamp (timestamp)
);

