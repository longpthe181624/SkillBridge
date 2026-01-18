# Backup & Recovery

## Backup Strategy

### Backup Objectives
- **Data Protection**: Ensure data integrity and availability
- **Business Continuity**: Minimize downtime during recovery
- **Compliance**: Meet regulatory and audit requirements
- **Disaster Recovery**: Support full system recovery

### Backup Types

#### Full Backup
- **Frequency**: Daily
- **Content**: Complete database and application data
- **Retention**: 30 days
- **Size**: ~2GB (estimated)

#### Incremental Backup
- **Frequency**: Every 4 hours
- **Content**: Changes since last backup
- **Retention**: 7 days
- **Size**: ~100MB (estimated)

#### Configuration Backup
- **Frequency**: Weekly
- **Content**: System and application configuration
- **Retention**: 90 days
- **Size**: ~50MB (estimated)

## Database Backup Procedures

### MySQL Full Backup
```bash
#!/bin/bash
# mysql_full_backup.sh

# Set variables
BACKUP_DIR="/backup/mysql/$(date +%Y%m%d)"
DB_NAME="skillbridge"
DB_USER="root"
DB_PASS="your_password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Full database backup
mysqldump -u $DB_USER -p$DB_PASS \
    --single-transaction \
    --routines \
    --triggers \
    --all-databases > $BACKUP_DIR/full_backup.sql

# Compress backup
gzip $BACKUP_DIR/full_backup.sql

# Create backup manifest
echo "Backup Date: $(date)" > $BACKUP_DIR/backup_manifest.txt
echo "Database: $DB_NAME" >> $BACKUP_DIR/backup_manifest.txt
echo "Backup Size: $(du -h $BACKUP_DIR/full_backup.sql.gz | cut -f1)" >> $BACKUP_DIR/backup_manifest.txt
echo "Tables: $(mysql -u $DB_USER -p$DB_PASS -e 'SHOW TABLES' $DB_NAME | wc -l)" >> $BACKUP_DIR/backup_manifest.txt

echo "Full backup completed: $BACKUP_DIR/full_backup.sql.gz"
```

### MySQL Incremental Backup
```bash
#!/bin/bash
# mysql_incremental_backup.sh

# Set variables
BACKUP_DIR="/backup/mysql/$(date +%Y%m%d)"
INCREMENTAL_DIR="/backup/mysql/incremental/$(date +%Y%m%d_%H%M%S)"
DB_USER="root"
DB_PASS="your_password"

# Create incremental backup directory
mkdir -p $INCREMENTAL_DIR

# Enable binary logging
mysql -u $DB_USER -p$DB_PASS -e "FLUSH LOGS;"

# Backup binary logs
cp /var/lib/mysql/mysql-bin.* $INCREMENTAL_DIR/

# Compress binary logs
gzip $INCREMENTAL_DIR/mysql-bin.*

echo "Incremental backup completed: $INCREMENTAL_DIR"
```

### Automated Backup Script
```bash
#!/bin/bash
# automated_backup.sh

# Configuration
BACKUP_ROOT="/backup"
DB_NAME="skillbridge"
DB_USER="root"
DB_PASS="your_password"
RETENTION_DAYS=30

# Create backup directory structure
mkdir -p $BACKUP_ROOT/{mysql,config,logs}
mkdir -p $BACKUP_ROOT/mysql/$(date +%Y%m%d)

# Full backup
echo "Starting full backup..."
mysqldump -u $DB_USER -p$DB_PASS \
    --single-transaction \
    --routines \
    --triggers \
    --all-databases | gzip > $BACKUP_ROOT/mysql/$(date +%Y%m%d)/full_backup.sql.gz

# Configuration backup
echo "Backing up configuration..."
tar -czf $BACKUP_ROOT/config/$(date +%Y%m%d)_config.tar.gz \
    /etc/skillbridge \
    /etc/nginx/sites-available/skillbridge \
    /etc/systemd/system/skillbridge-backend.service

# Log backup
echo "Backing up logs..."
tar -czf $BACKUP_ROOT/logs/$(date +%Y%m%d)_logs.tar.gz \
    /var/log/skillbridge \
    /var/log/nginx \
    /var/log/mysql

# Cleanup old backups
echo "Cleaning up old backups..."
find $BACKUP_ROOT -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_ROOT -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed successfully"
```

## Application Backup Procedures

### Configuration Backup
```bash
#!/bin/bash
# config_backup.sh

BACKUP_DIR="/backup/config/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Application configuration
cp -r /etc/skillbridge $BACKUP_DIR/

# Nginx configuration
cp /etc/nginx/sites-available/skillbridge $BACKUP_DIR/nginx_site.conf
cp /etc/nginx/nginx.conf $BACKUP_DIR/nginx.conf

# Systemd services
cp /etc/systemd/system/skillbridge-backend.service $BACKUP_DIR/
cp /etc/systemd/system/skillbridge-frontend.service $BACKUP_DIR/

# Environment files
cp /opt/skillbridge/.env $BACKUP_DIR/

echo "Configuration backup completed: $BACKUP_DIR"
```

### Application Code Backup
```bash
#!/bin/bash
# code_backup.sh

BACKUP_DIR="/backup/code/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup application code
tar -czf $BACKUP_DIR/skillbridge_code.tar.gz \
    /opt/skillbridge/backend \
    /opt/skillbridge/frontend \
    /opt/skillbridge/docs

# Backup build artifacts
tar -czf $BACKUP_DIR/build_artifacts.tar.gz \
    /opt/skillbridge/backend/target \
    /opt/skillbridge/frontend/.next

echo "Code backup completed: $BACKUP_DIR"
```

## Recovery Procedures

### Database Recovery

#### Full Database Recovery
```bash
#!/bin/bash
# database_recovery.sh

# Set variables
BACKUP_FILE="/backup/mysql/20241216/full_backup.sql.gz"
DB_NAME="skillbridge"
DB_USER="root"
DB_PASS="your_password"

# Stop application
sudo systemctl stop skillbridge-backend

# Stop MySQL
sudo systemctl stop mysql

# Restore database
gunzip -c $BACKUP_FILE | mysql -u $DB_USER -p$DB_PASS

# Start MySQL
sudo systemctl start mysql

# Verify database
mysql -u $DB_USER -p$DB_PASS -e "USE $DB_NAME; SHOW TABLES;"

# Start application
sudo systemctl start skillbridge-backend

echo "Database recovery completed"
```

#### Point-in-Time Recovery
```bash
#!/bin/bash
# point_in_time_recovery.sh

# Set variables
FULL_BACKUP="/backup/mysql/20241216/full_backup.sql.gz"
BINARY_LOGS="/backup/mysql/incremental/20241216_*"
DB_USER="root"
DB_PASS="your_password"
RECOVERY_TIME="2024-12-16 14:30:00"

# Stop application
sudo systemctl stop skillbridge-backend

# Stop MySQL
sudo systemctl stop mysql

# Restore full backup
gunzip -c $FULL_BACKUP | mysql -u $DB_USER -p$DB_PASS

# Apply binary logs up to recovery time
mysqlbinlog --stop-datetime="$RECOVERY_TIME" $BINARY_LOGS | mysql -u $DB_USER -p$DB_PASS

# Start MySQL
sudo systemctl start mysql

# Start application
sudo systemctl start skillbridge-backend

echo "Point-in-time recovery completed"
```

### Application Recovery

#### Configuration Recovery
```bash
#!/bin/bash
# config_recovery.sh

BACKUP_DIR="/backup/config/20241216"

# Restore configuration
sudo cp -r $BACKUP_DIR/skillbridge /etc/
sudo cp $BACKUP_DIR/nginx_site.conf /etc/nginx/sites-available/skillbridge
sudo cp $BACKUP_DIR/nginx.conf /etc/nginx/nginx.conf

# Restore systemd services
sudo cp $BACKUP_DIR/skillbridge-backend.service /etc/systemd/system/
sudo cp $BACKUP_DIR/skillbridge-frontend.service /etc/systemd/system/

# Restore environment
sudo cp $BACKUP_DIR/.env /opt/skillbridge/

# Reload systemd
sudo systemctl daemon-reload

# Restart services
sudo systemctl restart nginx
sudo systemctl restart skillbridge-backend

echo "Configuration recovery completed"
```

#### Code Recovery
```bash
#!/bin/bash
# code_recovery.sh

BACKUP_DIR="/backup/code/20241216"

# Stop services
sudo systemctl stop skillbridge-backend
sudo systemctl stop skillbridge-frontend

# Restore code
sudo tar -xzf $BACKUP_DIR/skillbridge_code.tar.gz -C /

# Restore build artifacts
sudo tar -xzf $BACKUP_DIR/build_artifacts.tar.gz -C /

# Set permissions
sudo chown -R skillbridge:skillbridge /opt/skillbridge/

# Start services
sudo systemctl start skillbridge-backend
sudo systemctl start skillbridge-frontend

echo "Code recovery completed"
```

## Disaster Recovery

### Complete System Recovery
```bash
#!/bin/bash
# complete_system_recovery.sh

# Set variables
BACKUP_DATE="20241216"
DB_BACKUP="/backup/mysql/$BACKUP_DATE/full_backup.sql.gz"
CONFIG_BACKUP="/backup/config/$BACKUP_DATE"
CODE_BACKUP="/backup/code/$BACKUP_DATE"

echo "Starting complete system recovery..."

# 1. Restore database
echo "Restoring database..."
gunzip -c $DB_BACKUP | mysql -u root -p

# 2. Restore configuration
echo "Restoring configuration..."
sudo cp -r $CONFIG_BACKUP/skillbridge /etc/
sudo cp $CONFIG_BACKUP/nginx_site.conf /etc/nginx/sites-available/skillbridge
sudo systemctl daemon-reload

# 3. Restore application code
echo "Restoring application code..."
sudo tar -xzf $CODE_BACKUP/skillbridge_code.tar.gz -C /
sudo chown -R skillbridge:skillbridge /opt/skillbridge/

# 4. Start services
echo "Starting services..."
sudo systemctl start mysql
sudo systemctl start nginx
sudo systemctl start skillbridge-backend
sudo systemctl start skillbridge-frontend

# 5. Verify recovery
echo "Verifying recovery..."
curl -f http://localhost:8080/actuator/health
curl -f http://localhost:3000/api/health

echo "Complete system recovery completed"
```

### Recovery Testing

#### Database Recovery Test
```bash
#!/bin/bash
# test_database_recovery.sh

# Create test database
mysql -u root -p -e "CREATE DATABASE skillbridge_test;"

# Restore to test database
gunzip -c /backup/mysql/20241216/full_backup.sql.gz | mysql -u root -p skillbridge_test

# Verify tables
mysql -u root -p -e "USE skillbridge_test; SHOW TABLES;"

# Test data integrity
mysql -u root -p -e "USE skillbridge_test; SELECT COUNT(*) FROM contacts;"
mysql -u root -p -e "USE skillbridge_test; SELECT COUNT(*) FROM engineers;"

# Cleanup test database
mysql -u root -p -e "DROP DATABASE skillbridge_test;"

echo "Database recovery test completed"
```

#### Application Recovery Test
```bash
#!/bin/bash
# test_application_recovery.sh

# Create test environment
sudo mkdir -p /opt/skillbridge_test
sudo chown skillbridge:skillbridge /opt/skillbridge_test

# Restore code to test environment
sudo tar -xzf /backup/code/20241216/skillbridge_code.tar.gz -C /opt/skillbridge_test/

# Test application startup
cd /opt/skillbridge_test/backend
mvn spring-boot:run &
BACKEND_PID=$!

# Wait for startup
sleep 30

# Test health endpoint
curl -f http://localhost:8080/actuator/health

# Cleanup
kill $BACKEND_PID
sudo rm -rf /opt/skillbridge_test

echo "Application recovery test completed"
```

## Backup Verification

### Backup Integrity Check
```bash
#!/bin/bash
# verify_backup.sh

BACKUP_FILE="/backup/mysql/20241216/full_backup.sql.gz"

# Check backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check backup file size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Backup size: $BACKUP_SIZE"

# Test backup integrity
gunzip -t "$BACKUP_FILE"
if [ $? -eq 0 ]; then
    echo "Backup file integrity: OK"
else
    echo "ERROR: Backup file is corrupted"
    exit 1
fi

# Test SQL syntax
gunzip -c "$BACKUP_FILE" | mysql -u root -p --force > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "SQL syntax: OK"
else
    echo "ERROR: SQL syntax errors in backup"
    exit 1
fi

echo "Backup verification completed successfully"
```

### Backup Completeness Check
```bash
#!/bin/bash
# check_backup_completeness.sh

# Check database tables
TABLES=$(mysql -u root -p -e "SHOW TABLES" skillbridge | wc -l)
echo "Current tables: $TABLES"

# Check backup tables
BACKUP_TABLES=$(gunzip -c /backup/mysql/20241216/full_backup.sql.gz | grep -c "CREATE TABLE")
echo "Backup tables: $BACKUP_TABLES"

# Compare counts
if [ "$TABLES" -eq "$BACKUP_TABLES" ]; then
    echo "Table count matches: OK"
else
    echo "ERROR: Table count mismatch"
    exit 1
fi

# Check data counts
CONTACTS=$(mysql -u root -p -e "SELECT COUNT(*) FROM contacts" skillbridge | tail -n 1)
ENGINEERS=$(mysql -u root -p -e "SELECT COUNT(*) FROM engineers" skillbridge | tail -n 1)

echo "Current data:"
echo "  Contacts: $CONTACTS"
echo "  Engineers: $ENGINEERS"

echo "Backup completeness check completed"
```

## Backup Monitoring

### Backup Status Monitoring
```bash
#!/bin/bash
# monitor_backup_status.sh

# Check backup directory
BACKUP_DIR="/backup/mysql/$(date +%Y%m%d)"
if [ -d "$BACKUP_DIR" ]; then
    echo "Today's backup directory exists: $BACKUP_DIR"
else
    echo "ERROR: Today's backup directory not found"
    exit 1
fi

# Check backup file
BACKUP_FILE="$BACKUP_DIR/full_backup.sql.gz"
if [ -f "$BACKUP_FILE" ]; then
    echo "Backup file exists: $BACKUP_FILE"
    echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
    echo "Backup date: $(stat -c %y "$BACKUP_FILE")"
else
    echo "ERROR: Backup file not found"
    exit 1
fi

# Check backup age
BACKUP_AGE=$(find "$BACKUP_FILE" -mtime -1)
if [ -n "$BACKUP_AGE" ]; then
    echo "Backup is recent: OK"
else
    echo "WARNING: Backup is older than 24 hours"
fi

echo "Backup status monitoring completed"
```

### Automated Backup Monitoring
```bash
#!/bin/bash
# automated_backup_monitor.sh

# Send backup status email
BACKUP_DIR="/backup/mysql/$(date +%Y%m%d)"
BACKUP_FILE="$BACKUP_DIR/full_backup.sql.gz"

if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    BACKUP_DATE=$(stat -c %y "$BACKUP_FILE")
    
    echo "Subject: SkillBridge Backup Status - SUCCESS" | \
    echo "Backup completed successfully" | \
    echo "Backup size: $BACKUP_SIZE" | \
    echo "Backup date: $BACKUP_DATE" | \
    sendmail admin@skillbridge.com
else
    echo "Subject: SkillBridge Backup Status - FAILED" | \
    echo "Backup failed or not found" | \
    sendmail admin@skillbridge.com
fi
```

## Recovery Time Objectives (RTO)

### Recovery Time Targets
- **Database Recovery**: < 30 minutes
- **Application Recovery**: < 15 minutes
- **Complete System Recovery**: < 60 minutes
- **Point-in-Time Recovery**: < 45 minutes

### Recovery Point Objectives (RPO)
- **Data Loss**: < 4 hours
- **Configuration Changes**: < 24 hours
- **Code Changes**: < 24 hours
- **System State**: < 4 hours

## Backup Storage Management

### Storage Requirements
- **Daily Backups**: ~2GB per day
- **Monthly Retention**: ~60GB
- **Yearly Retention**: ~730GB
- **Total Storage**: ~1TB (with compression)

### Storage Optimization
```bash
#!/bin/bash
# optimize_backup_storage.sh

# Compress old backups
find /backup -name "*.sql" -mtime +7 -exec gzip {} \;

# Remove old backups
find /backup -name "*.sql.gz" -mtime +30 -delete

# Archive old backups
find /backup -name "*.sql.gz" -mtime +7 -exec tar -czf {}.tar.gz {} \; -delete

echo "Backup storage optimization completed"
```

## Backup Documentation

### Backup Log
```bash
#!/bin/bash
# log_backup.sh

LOG_FILE="/var/log/backup.log"
BACKUP_DIR="/backup/mysql/$(date +%Y%m%d)"

echo "$(date): Starting backup" >> $LOG_FILE
echo "Backup directory: $BACKUP_DIR" >> $LOG_FILE
echo "Backup size: $(du -h "$BACKUP_DIR" | cut -f1)" >> $LOG_FILE
echo "$(date): Backup completed" >> $LOG_FILE
```

### Backup Report
```bash
#!/bin/bash
# generate_backup_report.sh

REPORT_FILE="/var/log/backup_report.txt"
echo "=== SkillBridge Backup Report ===" > $REPORT_FILE
echo "Date: $(date)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "Database Backups:" >> $REPORT_FILE
ls -la /backup/mysql/ >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "Configuration Backups:" >> $REPORT_FILE
ls -la /backup/config/ >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "Code Backups:" >> $REPORT_FILE
ls -la /backup/code/ >> $REPORT_FILE

echo "Backup report generated: $REPORT_FILE"
```
