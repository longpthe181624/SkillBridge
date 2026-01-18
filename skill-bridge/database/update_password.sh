#!/bin/bash
# Script to update MySQL user password to dev_password123

echo "Updating MySQL password for skillbridge_dev user to 'dev_password123'..."

# Connect to MySQL container and update password
docker exec -i skillbridge-mysql-dev mysql -uroot -prootpassword <<EOF

-- Drop existing user if exists and recreate with new password
DROP USER IF EXISTS 'skillbridge_dev'@'%';
DROP USER IF EXISTS 'skillbridge_dev'@'localhost';

-- Create user with new password
CREATE USER 'skillbridge_dev'@'%' IDENTIFIED BY 'dev_password123';
CREATE USER 'skillbridge_dev'@'localhost' IDENTIFIED BY 'dev_password123';

-- Grant all privileges
GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'%';
GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show grants to verify
SELECT 'Grants for skillbridge_dev@%:' as '';
SHOW GRANTS FOR 'skillbridge_dev'@'%';

SELECT 'Grants for skillbridge_dev@localhost:' as '';
SHOW GRANTS FOR 'skillbridge_dev'@'localhost';

EOF

echo ""
echo "✅ Password updated successfully!"
echo ""
echo "You can now connect to MySQL using DataGrip with:"
echo "  Host: localhost"
echo "  Port: 3307"
echo "  User: skillbridge_dev"
echo "  Password: dev_password123"
echo "  Database: skillbridge_dev"
