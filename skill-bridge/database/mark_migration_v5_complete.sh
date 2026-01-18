#!/bin/bash
# Mark Migration V5 as complete in Flyway schema history
# This is needed if migration V5 was applied manually

echo "Marking Migration V5 as complete in Flyway schema history..."

docker exec -i skillbridge-mysql-dev mysql -uroot -prootpassword skillbridge_dev <<EOF

-- Check if V5 already exists
SELECT COUNT(*) INTO @v5_exists FROM flyway_schema_history WHERE version = '5';

-- Insert V5 into flyway_schema_history if not exists
SET @sql = IF(@v5_exists = 0,
    'INSERT INTO flyway_schema_history 
     (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success)
     VALUES 
     (4, ''5'', ''add contact management tables'', ''SQL'', ''V5__add_contact_management_tables.sql'', 1234567890, ''skillbridge_dev'', NOW(), 100, 1)',
    'SELECT ''Migration V5 already exists in history'' as Status');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Also check and mark V4 if needed (for certificates table)
SELECT COUNT(*) INTO @v4_exists FROM flyway_schema_history WHERE version = '4';

SET @sql = IF(@v4_exists = 0,
    'INSERT INTO flyway_schema_history 
     (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success)
     VALUES 
     (3, ''4'', ''add engineer details tables'', ''SQL'', ''V4__add_engineer_details_tables.sql'', 9876543210, ''skillbridge_dev'', NOW(), 50, 1)',
    'SELECT ''Migration V4 already exists in history'' as Status');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Show current migration status
SELECT 'Current migrations:' as '';
SELECT version, description, installed_on, success FROM flyway_schema_history ORDER BY installed_rank;

EOF

echo ""
echo "✅ Migration V5 marked as complete!"

