#!/bin/bash
# Script to manually apply Migration V5 to add missing contact table columns

echo "Applying Migration V5 - Adding missing columns to contacts table..."

# Check if columns already exist
docker exec -it skillbridge-mysql-dev mysql -uskillbridge_dev -pdev_password123 skillbridge_dev -e "
SELECT COUNT(*) as missing_columns FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'skillbridge_dev' 
AND TABLE_NAME = 'contacts' 
AND COLUMN_NAME IN ('title', 'description', 'assignee_user_id');" | grep -q "0"

if [ $? -eq 0 ]; then
    echo "✅ Migration V5 columns already exist. Skipping..."
    exit 0
fi

echo "Running migration SQL..."

# Run the migration
docker exec -i skillbridge-mysql-dev mysql -uskillbridge_dev -pdev_password123 skillbridge_dev < database/run_migration_v5.sql

# Since MySQL doesn't support IF NOT EXISTS in ALTER TABLE, we'll use a different approach
docker exec -i skillbridge-mysql-dev mysql -uskillbridge_dev -pdev_password123 skillbridge_dev <<EOF

-- Check and add columns one by one
SET @col_exists = 0;

-- Check assignee_user_id
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'assignee_user_id';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN assignee_user_id INT',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check reviewer_id
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'reviewer_id';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN reviewer_id INT',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check title
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'title';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN title VARCHAR(255)',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check description
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'description';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN description TEXT',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check request_type
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'request_type';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN request_type VARCHAR(32)',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check priority
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'priority';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN priority VARCHAR(32) DEFAULT ''Medium''',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check internal_note
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'internal_note';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN internal_note TEXT',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check online_mtg_link
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'online_mtg_link';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN online_mtg_link VARCHAR(255)',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check online_mtg_date
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'online_mtg_date';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN online_mtg_date TIMESTAMP NULL',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check communication_progress
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'communication_progress';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN communication_progress VARCHAR(32) DEFAULT ''AutoReply''',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check created_by
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'created_by';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN created_by INT',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check updated_at
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'skillbridge_dev'
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'updated_at';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update status default
ALTER TABLE contacts MODIFY COLUMN status VARCHAR(32) DEFAULT 'New';

EOF

echo ""
echo "✅ Migration V5 applied successfully!"
echo ""
echo "Verifying columns..."
docker exec -it skillbridge-mysql-dev mysql -uskillbridge_dev -pdev_password123 skillbridge_dev -e "DESCRIBE contacts;"

