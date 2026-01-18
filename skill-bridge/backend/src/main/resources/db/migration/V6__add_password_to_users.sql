-- V6__add_password_to_users.sql
-- Add password column to users table for auto-generated accounts

-- Check if password column exists before adding
SET @dbname = DATABASE();
SET @col_exists = 0;

SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname
AND TABLE_NAME = 'users'
AND COLUMN_NAME = 'password';

-- Only add column if it doesn't exist
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL AFTER email',
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing users with NULL password (they can reset later)
-- Note: We keep NULL for existing users who don't have password yet

-- Add index for password lookups (if needed in future)
-- CREATE INDEX idx_users_password ON users(password); -- Not needed as we hash passwords

