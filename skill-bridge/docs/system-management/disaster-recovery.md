# Disaster Recovery

## Disaster Recovery Overview

### Disaster Recovery Objectives
- **Business Continuity**: Minimize business disruption during disasters
- **Data Protection**: Ensure data integrity and availability
- **Rapid Recovery**: Quick system restoration and service resumption
- **Minimal Data Loss**: Minimize data loss during disasters
- **Compliance**: Meet regulatory and audit requirements

### Disaster Scenarios

#### Natural Disasters
- **Earthquakes**: Infrastructure damage, power outages
- **Floods**: Water damage, electrical failures
- **Hurricanes**: Wind damage, flooding, power outages
- **Fire**: Physical damage, smoke damage, data loss

#### Technical Disasters
- **Hardware Failures**: Server crashes, disk failures, network outages
- **Software Failures**: Application crashes, database corruption
- **Cyber Attacks**: Ransomware, data breaches, system compromise
- **Human Error**: Accidental deletions, configuration mistakes

#### Infrastructure Disasters
- **Power Outages**: Electrical grid failures, UPS failures
- **Network Outages**: Internet connectivity loss, ISP failures
- **Data Center Outages**: Facility failures, cooling system failures
- **Cloud Service Outages**: Cloud provider failures, service disruptions

## Disaster Recovery Planning

### Recovery Time Objectives (RTO)

#### RTO Targets
```yaml
# Recovery Time Objectives
recovery-time-objectives:
  critical-systems:
    target: 1-hour
    systems: [database, application, web-server]
  
  important-systems:
    target: 4-hours
    systems: [monitoring, backup, logging]
  
  standard-systems:
    target: 8-hours
    systems: [development, testing, documentation]
  
  non-critical-systems:
    target: 24-hours
    systems: [analytics, reporting, archiving]
```

#### RTO Implementation
```bash
#!/bin/bash
# rto_implementation.sh

echo "=== RTO Implementation ==="
echo "Date: $(date)"
echo ""

# Critical systems recovery
echo "Critical systems recovery (RTO: 1 hour):"
./recover_database.sh
./recover_application.sh
./recover_web_server.sh

# Important systems recovery
echo "Important systems recovery (RTO: 4 hours):"
./recover_monitoring.sh
./recover_backup.sh
./recover_logging.sh

# Standard systems recovery
echo "Standard systems recovery (RTO: 8 hours):"
./recover_development.sh
./recover_testing.sh
./recover_documentation.sh

# Non-critical systems recovery
echo "Non-critical systems recovery (RTO: 24 hours):"
./recover_analytics.sh
./recover_reporting.sh
./recover_archiving.sh

echo "RTO implementation completed"
```

### Recovery Point Objectives (RPO)

#### RPO Targets
```yaml
# Recovery Point Objectives
recovery-point-objectives:
  critical-data:
    target: 1-hour
    data: [user-data, business-data, transactions]
  
  important-data:
    target: 4-hours
    data: [logs, configurations, backups]
  
  standard-data:
    target: 8-hours
    data: [development-data, test-data, documentation]
  
  archived-data:
    target: 24-hours
    data: [historical-data, reports, analytics]
```

#### RPO Implementation
```bash
#!/bin/bash
# rpo_implementation.sh

echo "=== RPO Implementation ==="
echo "Date: $(date)"
echo ""

# Critical data recovery
echo "Critical data recovery (RPO: 1 hour):"
./recover_user_data.sh
./recover_business_data.sh
./recover_transaction_data.sh

# Important data recovery
echo "Important data recovery (RPO: 4 hours):"
./recover_logs.sh
./recover_configurations.sh
./recover_backups.sh

# Standard data recovery
echo "Standard data recovery (RPO: 8 hours):"
./recover_development_data.sh
./recover_test_data.sh
./recover_documentation_data.sh

# Archived data recovery
echo "Archived data recovery (RPO: 24 hours):"
./recover_historical_data.sh
./recover_reports.sh
./recover_analytics.sh

echo "RPO implementation completed"
```

## Disaster Recovery Procedures

### Complete System Recovery

#### Full System Recovery
```bash
#!/bin/bash
# full_system_recovery.sh

echo "=== Full System Recovery ==="
echo "Date: $(date)"
echo ""

# Step 1: Infrastructure recovery
echo "Step 1: Infrastructure recovery"
./recover_infrastructure.sh

# Step 2: Database recovery
echo "Step 2: Database recovery"
./recover_database.sh

# Step 3: Application recovery
echo "Step 3: Application recovery"
./recover_application.sh

# Step 4: Web server recovery
echo "Step 4: Web server recovery"
./recover_web_server.sh

# Step 5: Configuration recovery
echo "Step 5: Configuration recovery"
./recover_configuration.sh

# Step 6: Verification
echo "Step 6: Verification"
./verify_system_recovery.sh

echo "Full system recovery completed"
```

#### Infrastructure Recovery
```bash
#!/bin/bash
# recover_infrastructure.sh

echo "=== Infrastructure Recovery ==="
echo "Date: $(date)"
echo ""

# Server setup
echo "Setting up servers..."
./setup_frontend_server.sh
./setup_backend_server.sh
./setup_database_server.sh

# Network configuration
echo "Configuring network..."
./configure_network.sh
./configure_firewall.sh
./configure_ssl.sh

# System configuration
echo "Configuring system..."
./configure_operating_system.sh
./configure_users.sh
./configure_permissions.sh

# Service configuration
echo "Configuring services..."
./configure_mysql.sh
./configure_nginx.sh
./configure_java.sh

echo "Infrastructure recovery completed"
```

#### Database Recovery
```bash
#!/bin/bash
# recover_database.sh

echo "=== Database Recovery ==="
echo "Date: $(date)"
echo ""

# Install MySQL
echo "Installing MySQL..."
sudo apt update
sudo apt install -y mysql-server mysql-client

# Configure MySQL
echo "Configuring MySQL..."
sudo mysql_secure_installation

# Restore database
echo "Restoring database..."
gunzip -c /backup/mysql/latest_backup.sql.gz | mysql -u root -p

# Verify database
echo "Verifying database..."
mysql -u root -p -e "SHOW DATABASES;"
mysql -u root -p -e "USE skillbridge; SHOW TABLES;"

# Configure MySQL
echo "Configuring MySQL..."
sudo systemctl enable mysql
sudo systemctl start mysql
sudo systemctl status mysql

echo "Database recovery completed"
```

#### Application Recovery
```bash
#!/bin/bash
# recover_application.sh

echo "=== Application Recovery ==="
echo "Date: $(date)"
echo ""

# Install Java
echo "Installing Java..."
sudo apt install -y openjdk-17-jdk

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Restore application code
echo "Restoring application code..."
sudo mkdir -p /opt/skillbridge
sudo tar -xzf /backup/code/latest_code.tar.gz -C /opt/skillbridge/

# Set permissions
echo "Setting permissions..."
sudo chown -R skillbridge:skillbridge /opt/skillbridge/
sudo chmod +x /opt/skillbridge/backend/skillbridge.jar

# Install dependencies
echo "Installing dependencies..."
cd /opt/skillbridge/backend && mvn clean install
cd /opt/skillbridge/frontend && npm install

# Configure services
echo "Configuring services..."
sudo cp /backup/config/skillbridge-backend.service /etc/systemd/system/
sudo cp /backup/config/skillbridge-frontend.service /etc/systemd/system/
sudo systemctl daemon-reload

# Start services
echo "Starting services..."
sudo systemctl enable skillbridge-backend
sudo systemctl start skillbridge-backend
sudo systemctl enable skillbridge-frontend
sudo systemctl start skillbridge-frontend

echo "Application recovery completed"
```

#### Web Server Recovery
```bash
#!/bin/bash
# recover_web_server.sh

echo "=== Web Server Recovery ==="
echo "Date: $(date)"
echo ""

# Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx

# Restore Nginx configuration
echo "Restoring Nginx configuration..."
sudo cp /backup/config/nginx_site.conf /etc/nginx/sites-available/skillbridge
sudo cp /backup/config/nginx.conf /etc/nginx/nginx.conf

# Enable site
echo "Enabling site..."
sudo ln -s /etc/nginx/sites-available/skillbridge /etc/nginx/sites-enabled/
sudo nginx -t

# Configure SSL
echo "Configuring SSL..."
sudo cp /backup/ssl/skillbridge.crt /etc/ssl/certs/
sudo cp /backup/ssl/skillbridge.key /etc/ssl/private/

# Start Nginx
echo "Starting Nginx..."
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx

echo "Web server recovery completed"
```

### Partial System Recovery

#### Database-Only Recovery
```bash
#!/bin/bash
# database_only_recovery.sh

echo "=== Database-Only Recovery ==="
echo "Date: $(date)"
echo ""

# Stop application
echo "Stopping application..."
sudo systemctl stop skillbridge-backend
sudo systemctl stop skillbridge-frontend

# Backup current database
echo "Backing up current database..."
mysqldump -u root -p --all-databases > /backup/mysql/pre_recovery_$(date +%Y%m%d_%H%M%S).sql

# Restore database
echo "Restoring database..."
gunzip -c /backup/mysql/latest_backup.sql.gz | mysql -u root -p

# Verify database
echo "Verifying database..."
mysql -u root -p -e "SHOW DATABASES;"
mysql -u root -p -e "USE skillbridge; SHOW TABLES;"

# Start application
echo "Starting application..."
sudo systemctl start skillbridge-backend
sudo systemctl start skillbridge-frontend

# Verify application
echo "Verifying application..."
curl -f http://localhost:8080/actuator/health
curl -f http://localhost:3000/api/health

echo "Database-only recovery completed"
```

#### Application-Only Recovery
```bash
#!/bin/bash
# application_only_recovery.sh

echo "=== Application-Only Recovery ==="
echo "Date: $(date)"
echo ""

# Stop application
echo "Stopping application..."
sudo systemctl stop skillbridge-backend
sudo systemctl stop skillbridge-frontend

# Backup current application
echo "Backing up current application..."
sudo tar -czf /backup/application/current_app_$(date +%Y%m%d_%H%M%S).tar.gz /opt/skillbridge/

# Restore application
echo "Restoring application..."
sudo tar -xzf /backup/application/latest_app.tar.gz -C /opt/skillbridge/

# Set permissions
echo "Setting permissions..."
sudo chown -R skillbridge:skillbridge /opt/skillbridge/
sudo chmod +x /opt/skillbridge/backend/skillbridge.jar

# Start application
echo "Starting application..."
sudo systemctl start skillbridge-backend
sudo systemctl start skillbridge-frontend

# Verify application
echo "Verifying application..."
curl -f http://localhost:8080/actuator/health
curl -f http://localhost:3000/api/health

echo "Application-only recovery completed"
```

### Data Recovery

#### Point-in-Time Recovery
```bash
#!/bin/bash
# point_in_time_recovery.sh

RECOVERY_TIME=$1

echo "=== Point-in-Time Recovery ==="
echo "Recovery Time: $RECOVERY_TIME"
echo "Date: $(date)"
echo ""

# Stop application
echo "Stopping application..."
sudo systemctl stop skillbridge-backend
sudo systemctl stop skillbridge-frontend

# Restore full backup
echo "Restoring full backup..."
gunzip -c /backup/mysql/latest_backup.sql.gz | mysql -u root -p

# Apply binary logs up to recovery time
echo "Applying binary logs..."
mysqlbinlog --stop-datetime="$RECOVERY_TIME" /backup/mysql/binary_logs/* | mysql -u root -p

# Verify recovery
echo "Verifying recovery..."
mysql -u root -p -e "SHOW DATABASES;"
mysql -u root -p -e "USE skillbridge; SHOW TABLES;"

# Start application
echo "Starting application..."
sudo systemctl start skillbridge-backend
sudo systemctl start skillbridge-frontend

# Verify application
echo "Verifying application..."
curl -f http://localhost:8080/actuator/health
curl -f http://localhost:3000/api/health

echo "Point-in-time recovery completed"
```

#### Selective Data Recovery
```bash
#!/bin/bash
# selective_data_recovery.sh

TABLE_NAME=$1

echo "=== Selective Data Recovery ==="
echo "Table: $TABLE_NAME"
echo "Date: $(date)"
echo ""

# Backup current table
echo "Backing up current table..."
mysqldump -u root -p skillbridge $TABLE_NAME > /backup/selective/current_${TABLE_NAME}_$(date +%Y%m%d_%H%M%S).sql

# Restore table from backup
echo "Restoring table from backup..."
gunzip -c /backup/mysql/latest_backup.sql.gz | grep -A 1000 "CREATE TABLE.*$TABLE_NAME" | mysql -u root -p skillbridge

# Verify table
echo "Verifying table..."
mysql -u root -p -e "USE skillbridge; SELECT COUNT(*) FROM $TABLE_NAME;"

echo "Selective data recovery completed"
```

## Disaster Recovery Testing

### Recovery Testing Procedures

#### Full System Recovery Test
```bash
#!/bin/bash
# full_system_recovery_test.sh

echo "=== Full System Recovery Test ==="
echo "Date: $(date)"
echo ""

# Create test environment
echo "Creating test environment..."
sudo mkdir -p /opt/skillbridge_test
sudo chown skillbridge:skillbridge /opt/skillbridge_test

# Simulate disaster
echo "Simulating disaster..."
sudo systemctl stop skillbridge-backend
sudo systemctl stop skillbridge-frontend
sudo systemctl stop mysql

# Test recovery procedures
echo "Testing recovery procedures..."
./full_system_recovery.sh

# Verify recovery
echo "Verifying recovery..."
curl -f http://localhost:8080/actuator/health
curl -f http://localhost:3000/api/health
mysql -u root -p -e "SELECT 1;"

# Cleanup test environment
echo "Cleaning up test environment..."
sudo rm -rf /opt/skillbridge_test

echo "Full system recovery test completed"
```

#### Database Recovery Test
```bash
#!/bin/bash
# database_recovery_test.sh

echo "=== Database Recovery Test ==="
echo "Date: $(date)"
echo ""

# Create test database
echo "Creating test database..."
mysql -u root -p -e "CREATE DATABASE skillbridge_test;"

# Test database recovery
echo "Testing database recovery..."
gunzip -c /backup/mysql/latest_backup.sql.gz | mysql -u root -p skillbridge_test

# Verify recovery
echo "Verifying recovery..."
mysql -u root -p -e "USE skillbridge_test; SHOW TABLES;"
mysql -u root -p -e "USE skillbridge_test; SELECT COUNT(*) FROM contacts;"

# Cleanup test database
echo "Cleaning up test database..."
mysql -u root -p -e "DROP DATABASE skillbridge_test;"

echo "Database recovery test completed"
```

#### Application Recovery Test
```bash
#!/bin/bash
# application_recovery_test.sh

echo "=== Application Recovery Test ==="
echo "Date: $(date)"
echo ""

# Create test environment
echo "Creating test environment..."
sudo mkdir -p /opt/skillbridge_test
sudo chown skillbridge:skillbridge /opt/skillbridge_test

# Test application recovery
echo "Testing application recovery..."
sudo tar -xzf /backup/application/latest_app.tar.gz -C /opt/skillbridge_test/

# Test application startup
echo "Testing application startup..."
cd /opt/skillbridge_test/backend
java -jar skillbridge.jar &
APP_PID=$!

# Wait for startup
sleep 30

# Test health endpoint
echo "Testing health endpoint..."
curl -f http://localhost:8080/actuator/health

# Cleanup
echo "Cleaning up..."
kill $APP_PID
sudo rm -rf /opt/skillbridge_test

echo "Application recovery test completed"
```

### Recovery Testing Schedule

#### Testing Schedule
```yaml
# Recovery testing schedule
recovery-testing-schedule:
  daily-tests:
    - database-backup-verification
    - application-health-check
    - system-resource-monitoring
  
  weekly-tests:
    - database-recovery-test
    - application-recovery-test
    - configuration-backup-test
  
  monthly-tests:
    - full-system-recovery-test
    - disaster-scenario-test
    - recovery-time-test
  
  quarterly-tests:
    - complete-disaster-recovery-test
    - business-continuity-test
    - recovery-procedure-review
```

#### Automated Testing
```bash
#!/bin/bash
# automated_recovery_testing.sh

echo "=== Automated Recovery Testing ==="
echo "Date: $(date)"
echo ""

# Daily tests
echo "Running daily tests..."
./test_database_backup.sh
./test_application_health.sh
./test_system_resources.sh

# Weekly tests
if [ $(date +%u) -eq 1 ]; then
    echo "Running weekly tests..."
    ./test_database_recovery.sh
    ./test_application_recovery.sh
    ./test_configuration_backup.sh
fi

# Monthly tests
if [ $(date +%d) -eq 1 ]; then
    echo "Running monthly tests..."
    ./test_full_system_recovery.sh
    ./test_disaster_scenario.sh
    ./test_recovery_time.sh
fi

# Quarterly tests
if [ $(date +%m) -eq 1 ] && [ $(date +%d) -eq 1 ]; then
    echo "Running quarterly tests..."
    ./test_complete_disaster_recovery.sh
    ./test_business_continuity.sh
    ./test_recovery_procedures.sh
fi

echo "Automated recovery testing completed"
```

## Disaster Recovery Documentation

### Recovery Procedures Documentation

#### Recovery Procedures Template
```markdown
# Disaster Recovery Procedures

## Overview
This document outlines the procedures for recovering the SkillBridge platform from various disaster scenarios.

## Recovery Objectives
- **RTO**: 4 hours for critical systems
- **RPO**: 1 hour for critical data
- **Availability**: 99% uptime target
- **Data Loss**: < 1 hour maximum

## Recovery Scenarios
1. **Complete System Failure**: Full infrastructure recovery
2. **Database Failure**: Database-only recovery
3. **Application Failure**: Application-only recovery
4. **Network Failure**: Network infrastructure recovery
5. **Data Corruption**: Data recovery and restoration

## Recovery Procedures
[Detailed step-by-step recovery procedures]

## Recovery Testing
[Regular testing procedures and schedules]

## Recovery Contacts
[Emergency contact information and escalation procedures]
```

#### Recovery Checklist Template
```markdown
# Disaster Recovery Checklist

## Pre-Recovery
- [ ] Assess disaster impact
- [ ] Notify recovery team
- [ ] Gather recovery resources
- [ ] Review recovery procedures
- [ ] Prepare recovery environment

## Recovery Execution
- [ ] Stop affected services
- [ ] Backup current state
- [ ] Restore from backup
- [ ] Configure services
- [ ] Start services
- [ ] Verify functionality

## Post-Recovery
- [ ] Test system functionality
- [ ] Monitor system performance
- [ ] Document recovery actions
- [ ] Notify stakeholders
- [ ] Schedule follow-up review
```

### Recovery Documentation Maintenance

#### Documentation Update Procedures
```bash
#!/bin/bash
# update_recovery_documentation.sh

echo "=== Update Recovery Documentation ==="
echo "Date: $(date)"
echo ""

# Update recovery procedures
echo "Updating recovery procedures..."
./update_recovery_procedures.sh

# Update recovery contacts
echo "Updating recovery contacts..."
./update_recovery_contacts.sh

# Update recovery resources
echo "Updating recovery resources..."
./update_recovery_resources.sh

# Update recovery testing
echo "Updating recovery testing..."
./update_recovery_testing.sh

# Generate documentation report
echo "Generating documentation report..."
./generate_documentation_report.sh

echo "Recovery documentation update completed"
```

#### Documentation Review
```bash
#!/bin/bash
# review_recovery_documentation.sh

echo "=== Review Recovery Documentation ==="
echo "Date: $(date)"
echo ""

# Review recovery procedures
echo "Reviewing recovery procedures..."
./review_recovery_procedures.sh

# Review recovery contacts
echo "Reviewing recovery contacts..."
./review_recovery_contacts.sh

# Review recovery resources
echo "Reviewing recovery resources..."
./review_recovery_resources.sh

# Review recovery testing
echo "Reviewing recovery testing..."
./review_recovery_testing.sh

# Generate review report
echo "Generating review report..."
./generate_review_report.sh

echo "Recovery documentation review completed"
```

## Disaster Recovery Monitoring

### Recovery Monitoring

#### Recovery Status Monitoring
```bash
#!/bin/bash
# recovery_status_monitoring.sh

echo "=== Recovery Status Monitoring ==="
echo "Date: $(date)"
echo ""

# Check recovery readiness
echo "Checking recovery readiness..."
./check_recovery_readiness.sh

# Check backup status
echo "Checking backup status..."
./check_backup_status.sh

# Check recovery resources
echo "Checking recovery resources..."
./check_recovery_resources.sh

# Check recovery procedures
echo "Checking recovery procedures..."
./check_recovery_procedures.sh

# Generate monitoring report
echo "Generating monitoring report..."
./generate_monitoring_report.sh

echo "Recovery status monitoring completed"
```

#### Recovery Alerting
```bash
#!/bin/bash
# recovery_alerting.sh

echo "=== Recovery Alerting ==="
echo "Date: $(date)"
echo ""

# Check backup alerts
echo "Checking backup alerts..."
if [ ! -f "/backup/mysql/latest_backup.sql.gz" ]; then
    echo "ALERT: Latest backup not found" | mail -s "Recovery Alert" admin@skillbridge.com
fi

# Check recovery resource alerts
echo "Checking recovery resource alerts..."
if [ ! -d "/opt/skillbridge" ]; then
    echo "ALERT: Recovery environment not ready" | mail -s "Recovery Alert" admin@skillbridge.com
fi

# Check recovery procedure alerts
echo "Checking recovery procedure alerts..."
if [ ! -f "/opt/skillbridge/scripts/recovery_procedures.sh" ]; then
    echo "ALERT: Recovery procedures not available" | mail -s "Recovery Alert" admin@skillbridge.com
fi

echo "Recovery alerting completed"
```

### Recovery Reporting

#### Recovery Status Report
```bash
#!/bin/bash
# recovery_status_report.sh

REPORT_FILE="/var/log/recovery/status_report_$(date +%Y%m%d).txt"

echo "=== Recovery Status Report ===" > $REPORT_FILE
echo "Date: $(date)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Recovery readiness
echo "Recovery Readiness:" >> $REPORT_FILE
echo "Backup Status: $(check_backup_status)" >> $REPORT_FILE
echo "Recovery Environment: $(check_recovery_environment)" >> $REPORT_FILE
echo "Recovery Procedures: $(check_recovery_procedures)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Recovery resources
echo "Recovery Resources:" >> $REPORT_FILE
echo "Recovery Servers: $(count_recovery_servers)" >> $REPORT_FILE
echo "Recovery Storage: $(check_recovery_storage)" >> $REPORT_FILE
echo "Recovery Network: $(check_recovery_network)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Recovery testing
echo "Recovery Testing:" >> $REPORT_FILE
echo "Last Full Test: $(get_last_full_test_date)" >> $REPORT_FILE
echo "Test Results: $(get_last_test_results)" >> $REPORT_FILE
echo "Next Test: $(get_next_test_date)" >> $REPORT_FILE

echo "Recovery status report generated: $REPORT_FILE"
```

#### Recovery Testing Report
```bash
#!/bin/bash
# recovery_testing_report.sh

REPORT_FILE="/var/log/recovery/testing_report_$(date +%Y%m%d).txt"

echo "=== Recovery Testing Report ===" > $REPORT_FILE
echo "Date: $(date)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Testing summary
echo "Testing Summary:" >> $REPORT_FILE
echo "Total Tests: $(count_total_tests)" >> $REPORT_FILE
echo "Passed Tests: $(count_passed_tests)" >> $REPORT_FILE
echo "Failed Tests: $(count_failed_tests)" >> $REPORT_FILE
echo "Success Rate: $(calculate_success_rate)%" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Test results
echo "Test Results:" >> $REPORT_FILE
echo "Database Recovery: $(get_database_recovery_result)" >> $REPORT_FILE
echo "Application Recovery: $(get_application_recovery_result)" >> $REPORT_FILE
echo "Full System Recovery: $(get_full_system_recovery_result)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Recommendations
echo "Recommendations:" >> $REPORT_FILE
echo "1. Improve recovery procedures" >> $REPORT_FILE
echo "2. Enhance recovery testing" >> $REPORT_FILE
echo "3. Update recovery documentation" >> $REPORT_FILE
echo "4. Train recovery team" >> $REPORT_FILE

echo "Recovery testing report generated: $REPORT_FILE"
```
