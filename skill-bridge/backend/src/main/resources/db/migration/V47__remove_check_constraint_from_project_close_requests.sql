-- V47__remove_check_constraint_from_project_close_requests.sql
-- Remove CHECK constraint from project_close_requests table for MySQL compatibility
-- Status validation is enforced at application level
-- 
-- Note: This migration handles the case where V46 was applied with CHECK constraint
-- For MySQL 8.0.16+, we can drop the constraint
-- For older MySQL versions, the constraint may not exist or may not be supported

-- Drop the CHECK constraint if it exists
-- Note: MySQL syntax varies by version
-- For MySQL 8.0.19+, we can use DROP CONSTRAINT IF EXISTS
-- For older versions, we need to check first or handle the error

SET @db_name = DATABASE();
SET @table_name = 'project_close_requests';
SET @constraint_name = 'chk_project_close_request_status';

-- Check if constraint exists
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = @db_name
    AND TABLE_NAME = @table_name
    AND CONSTRAINT_NAME = @constraint_name
    AND CONSTRAINT_TYPE = 'CHECK'
);

-- Drop constraint if it exists
SET @sql = IF(@constraint_exists > 0,
    CONCAT('ALTER TABLE ', @table_name, ' DROP CONSTRAINT ', @constraint_name),
    'SELECT 1 AS noop'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

