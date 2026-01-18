-- Add new fields to change_requests table for Story-15
-- Add title, description, reason, desired_start_date, desired_end_date, expected_extra_cost, cost_estimated_by_landbridge

-- Check and add title column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'title'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN title VARCHAR(255) NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add description column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'description'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN description TEXT NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add reason column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'reason'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN reason TEXT NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add desired_start_date column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'desired_start_date'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN desired_start_date DATE NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add desired_end_date column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'desired_end_date'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN desired_end_date DATE NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add expected_extra_cost column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'expected_extra_cost'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN expected_extra_cost DECIMAL(16, 2) NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add cost_estimated_by_landbridge column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'cost_estimated_by_landbridge'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN cost_estimated_by_landbridge DECIMAL(16, 2) NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create change_request_attachments table
CREATE TABLE IF NOT EXISTS change_request_attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  change_request_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100),
  uploaded_by INT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id),
  INDEX idx_change_request_attachments_change_request_id (change_request_id),
  INDEX idx_change_request_attachments_uploaded_by (uploaded_by)
);

