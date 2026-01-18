-- Fix MySQL Permissions for DataGrip Access
-- Run this script as root user to grant permissions to skillbridge_dev user

-- Grant all privileges to skillbridge_dev user from any host
GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'%';
GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'localhost';

-- Update password for existing user
ALTER USER 'skillbridge_dev'@'%' IDENTIFIED BY 'dev_password123';
ALTER USER 'skillbridge_dev'@'localhost' IDENTIFIED BY 'dev_password123';

-- If you need to create the user first (uncomment if needed)
-- CREATE USER IF NOT EXISTS 'skillbridge_dev'@'%' IDENTIFIED BY 'dev_password123';
-- CREATE USER IF NOT EXISTS 'skillbridge_dev'@'localhost' IDENTIFIED BY 'dev_password123';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Verify permissions
SHOW GRANTS FOR 'skillbridge_dev'@'%';
SHOW GRANTS FOR 'skillbridge_dev'@'localhost';

