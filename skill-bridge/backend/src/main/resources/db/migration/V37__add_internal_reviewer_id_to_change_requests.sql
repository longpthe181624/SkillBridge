-- Add internal_reviewer_id field to change_requests table
-- This field stores the user ID of the internal reviewer assigned to review the change request

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'change_requests' 
    AND COLUMN_NAME = 'internal_reviewer_id'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE change_requests 
     ADD COLUMN internal_reviewer_id INT NULL,
     ADD CONSTRAINT fk_change_requests_internal_reviewer FOREIGN KEY (internal_reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
     ADD INDEX idx_change_requests_internal_reviewer (internal_reviewer_id)',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

