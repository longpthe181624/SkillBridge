-- Add created_by field to change_requests table
-- This field stores the user ID who created the change request

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'created_by'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests ADD COLUMN created_by INT NULL,
     ADD CONSTRAINT fk_change_requests_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
     ADD INDEX idx_change_requests_created_by (created_by)',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

