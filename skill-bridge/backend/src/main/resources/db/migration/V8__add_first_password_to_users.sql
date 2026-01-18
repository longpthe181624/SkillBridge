-- V8__add_first_password_to_users.sql
-- Add first_password column to users table to store initial password when account is created

-- Check if first_password column exists before adding
SET @dbname = DATABASE();
SET @col_exists = 0;

SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname
AND TABLE_NAME = 'users'
AND COLUMN_NAME = 'first_password';

-- Only add column if it doesn't exist
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN first_password VARCHAR(255) NULL AFTER password',
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Note: first_password will be NULL for existing users (they already have accounts)
-- Only new users created via contact form will have first_password set

