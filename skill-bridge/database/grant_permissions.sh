#!/bin/bash
# Script to grant MySQL permissions for DataGrip access

echo "Granting MySQL permissions for skillbridge_dev user..."

# Connect to MySQL container and run SQL commands
docker exec -i skillbridge-mysql-dev mysql -uroot -prootpassword <<EOF

-- Grant all privileges from any host
GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'%' IDENTIFIED BY 'dev_password123';
GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'skillbridge_dev'@'localhost' IDENTIFIED BY 'dev_password123';

-- Also grant for root access from localhost (for DataGrip)
GRANT ALL PRIVILEGES ON skillbridge_dev.* TO 'root'@'%' IDENTIFIED BY 'rootpassword';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show grants to verify
SELECT 'Grants for skillbridge_dev@%:' as '';
SHOW GRANTS FOR 'skillbridge_dev'@'%';

SELECT 'Grants for skillbridge_dev@localhost:' as '';
SHOW GRANTS FOR 'skillbridge_dev'@'localhost';

EOF

echo "✅ Permissions granted successfully!"
echo ""
echo "You can now connect to MySQL using DataGrip with:"
echo "  Host: localhost"
echo "  Port: 3307"
echo "  User: skillbridge_dev"
echo "  Password: dev_password123"
echo "  Database: skillbridge_dev"
echo ""
echo "Or use root user:"
echo "  User: root"
echo "  Password: rootpassword"

