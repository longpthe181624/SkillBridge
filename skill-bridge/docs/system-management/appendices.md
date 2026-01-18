# Appendices

## System Management Tools

### Monitoring Tools

#### System Monitoring Tools
```bash
# System monitoring tools
htop          # Interactive process viewer
iotop         # I/O monitoring
nethogs       # Network monitoring
iftop         # Network traffic monitoring
glances       # System monitoring
```

#### Application Monitoring Tools
```bash
# Application monitoring tools
jstat         # JVM statistics
jmap          # Memory analysis
jstack        # Thread analysis
curl          # HTTP testing
ab            # Apache Bench
```

#### Database Monitoring Tools
```bash
# Database monitoring tools
mysqladmin    # MySQL administration
mysqldump     # Database backup
mysqlcheck    # Database integrity
pt-query-digest # Query analysis
```

### Backup Tools

#### Backup Scripts
```bash
#!/bin/bash
# backup_tools.sh

# Database backup
mysqldump -u root -p --all-databases | gzip > /backup/mysql/backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Application backup
tar -czf /backup/application/app_$(date +%Y%m%d_%H%M%S).tar.gz /opt/skillbridge/

# Configuration backup
tar -czf /backup/config/config_$(date +%Y%m%d_%H%M%S).tar.gz /etc/skillbridge/ /etc/nginx/ /etc/systemd/system/

# Log backup
tar -czf /backup/logs/logs_$(date +%Y%m%d_%H%M%S).tar.gz /var/log/skillbridge/ /var/log/mysql/
```

#### Recovery Tools
```bash
#!/bin/bash
# recovery_tools.sh

# Database recovery
gunzip -c /backup/mysql/backup_20241216_140000.sql.gz | mysql -u root -p

# Application recovery
tar -xzf /backup/application/app_20241216_140000.tar.gz -C /opt/skillbridge/

# Configuration recovery
tar -xzf /backup/config/config_20241216_140000.tar.gz -C /

# Log recovery
tar -xzf /backup/logs/logs_20241216_140000.tar.gz -C /var/log/
```

### Security Tools

#### Security Monitoring Tools
```bash
# Security monitoring tools
fail2ban      # Intrusion prevention
ufw           # Firewall management
clamav        # Antivirus scanning
rkhunter      # Rootkit detection
chkrootkit    # Rootkit detection
```

#### Security Scripts
```bash
#!/bin/bash
# security_tools.sh

# Check for security updates
sudo apt update && sudo apt list --upgradable | grep -i security

# Check system security
sudo rkhunter --check
sudo chkrootkit

# Check firewall status
sudo ufw status verbose

# Check open ports
sudo netstat -tlnp
sudo ss -tlnp
```

## System Management Scripts

### System Health Scripts

#### System Health Check
```bash
#!/bin/bash
# system_health_check.sh

echo "=== System Health Check ==="
echo "Date: $(date)"
echo ""

# System information
echo "System Information:"
uname -a
lsb_release -a
echo ""

# CPU information
echo "CPU Information:"
lscpu | grep -E "(CPU|Model|Architecture)"
echo ""

# Memory information
echo "Memory Information:"
free -h
echo ""

# Disk information
echo "Disk Information:"
df -h
echo ""

# Network information
echo "Network Information:"
ip addr show
echo ""

# Service status
echo "Service Status:"
systemctl status skillbridge-backend
systemctl status skillbridge-frontend
systemctl status mysql
systemctl status nginx
echo ""

# Process information
echo "Process Information:"
ps aux | grep -E "(java|node|mysql|nginx)" | head -10
echo ""

# Port information
echo "Port Information:"
netstat -tlnp | grep -E "(8080|3000|3306|80|443)"
echo ""

# Log information
echo "Log Information:"
tail -n 5 /var/log/skillbridge/application.log
tail -n 5 /var/log/mysql/error.log
tail -n 5 /var/log/nginx/access.log
```

#### Performance Check
```bash
#!/bin/bash
# performance_check.sh

echo "=== Performance Check ==="
echo "Date: $(date)"
echo ""

# CPU usage
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)"
echo ""

# Memory usage
echo "Memory Usage:"
free -h
echo ""

# Disk usage
echo "Disk Usage:"
df -h
echo ""

# Disk I/O
echo "Disk I/O:"
iostat -x 1 1
echo ""

# Network I/O
echo "Network I/O:"
iftop -t -s 10
echo ""

# Application performance
echo "Application Performance:"
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8080/actuator/health
echo ""

# Database performance
echo "Database Performance:"
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
mysql -u root -p -e "SHOW STATUS LIKE 'Slow_queries';"
echo ""

# Process performance
echo "Process Performance:"
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10
```

### Maintenance Scripts

#### System Maintenance
```bash
#!/bin/bash
# system_maintenance.sh

echo "=== System Maintenance ==="
echo "Date: $(date)"
echo ""

# Update system packages
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Clean up packages
echo "Cleaning up packages..."
sudo apt autoremove -y
sudo apt autoclean

# Clean up logs
echo "Cleaning up logs..."
sudo find /var/log -name "*.log.*" -mtime +7 -delete
sudo find /var/log -name "*.gz" -mtime +30 -delete

# Clean up temporary files
echo "Cleaning up temporary files..."
sudo find /tmp -type f -mtime +7 -delete
sudo find /var/tmp -type f -mtime +7 -delete

# Clean up old backups
echo "Cleaning up old backups..."
find /backup -name "*.sql.gz" -mtime +30 -delete
find /backup -name "*.tar.gz" -mtime +30 -delete

# Optimize database
echo "Optimizing database..."
mysql -u root -p -e "OPTIMIZE TABLE contacts, engineers, proposals, contracts;"

# Restart services
echo "Restarting services..."
sudo systemctl restart skillbridge-backend
sudo systemctl restart skillbridge-frontend
sudo systemctl restart mysql
sudo systemctl restart nginx

echo "System maintenance completed"
```

#### Database Maintenance
```bash
#!/bin/bash
# database_maintenance.sh

echo "=== Database Maintenance ==="
echo "Date: $(date)"
echo ""

# Check database status
echo "Checking database status..."
mysql -u root -p -e "SHOW STATUS;"

# Check table status
echo "Checking table status..."
mysql -u root -p -e "SHOW TABLE STATUS;"

# Optimize tables
echo "Optimizing tables..."
mysql -u root -p -e "OPTIMIZE TABLE contacts, engineers, proposals, contracts;"

# Analyze tables
echo "Analyzing tables..."
mysql -u root -p -e "ANALYZE TABLE contacts, engineers, proposals, contracts;"

# Check for errors
echo "Checking for errors..."
mysql -u root -p -e "CHECK TABLE contacts, engineers, proposals, contracts;"

# Check slow queries
echo "Checking slow queries..."
mysql -u root -p -e "SHOW STATUS LIKE 'Slow_queries';"

# Check connections
echo "Checking connections..."
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
mysql -u root -p -e "SHOW STATUS LIKE 'Max_used_connections';"

echo "Database maintenance completed"
```

### Monitoring Scripts

#### System Monitoring
```bash
#!/bin/bash
# system_monitoring.sh

echo "=== System Monitoring ==="
echo "Date: $(date)"
echo ""

# Monitor CPU
echo "Monitoring CPU..."
top -bn1 | grep "Cpu(s)"

# Monitor Memory
echo "Monitoring Memory..."
free -h

# Monitor Disk
echo "Monitoring Disk..."
df -h

# Monitor Network
echo "Monitoring Network..."
netstat -i

# Monitor Processes
echo "Monitoring Processes..."
ps aux | grep -E "(java|node|mysql|nginx)" | head -10

# Monitor Services
echo "Monitoring Services..."
systemctl status skillbridge-backend
systemctl status skillbridge-frontend
systemctl status mysql
systemctl status nginx

# Monitor Logs
echo "Monitoring Logs..."
tail -n 5 /var/log/skillbridge/application.log
tail -n 5 /var/log/mysql/error.log
tail -n 5 /var/log/nginx/access.log
```

#### Application Monitoring
```bash
#!/bin/bash
# application_monitoring.sh

echo "=== Application Monitoring ==="
echo "Date: $(date)"
echo ""

# Check application health
echo "Checking application health..."
curl -f http://localhost:8080/actuator/health
curl -f http://localhost:3000/api/health

# Check application metrics
echo "Checking application metrics..."
curl -s http://localhost:8080/actuator/metrics

# Check application logs
echo "Checking application logs..."
tail -n 20 /var/log/skillbridge/application.log

# Check application processes
echo "Checking application processes..."
ps aux | grep java
ps aux | grep node

# Check application ports
echo "Checking application ports..."
netstat -tlnp | grep :8080
netstat -tlnp | grep :3000

# Check application performance
echo "Checking application performance..."
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8080/actuator/health
```

## System Management Procedures

### Startup Procedures

#### System Startup
```bash
#!/bin/bash
# system_startup.sh

echo "=== System Startup ==="
echo "Date: $(date)"
echo ""

# Start MySQL
echo "Starting MySQL..."
sudo systemctl start mysql
sudo systemctl status mysql

# Start Nginx
echo "Starting Nginx..."
sudo systemctl start nginx
sudo systemctl status nginx

# Start Backend
echo "Starting Backend..."
sudo systemctl start skillbridge-backend
sudo systemctl status skillbridge-backend

# Start Frontend
echo "Starting Frontend..."
sudo systemctl start skillbridge-frontend
sudo systemctl status skillbridge-frontend

# Verify services
echo "Verifying services..."
sleep 30
curl -f http://localhost:8080/actuator/health
curl -f http://localhost:3000/api/health

echo "System startup completed"
```

#### Service Startup
```bash
#!/bin/bash
# service_startup.sh

SERVICE_NAME=$1

echo "=== Service Startup ==="
echo "Service: $SERVICE_NAME"
echo "Date: $(date)"
echo ""

# Start service
echo "Starting service..."
sudo systemctl start $SERVICE_NAME

# Check status
echo "Checking status..."
sudo systemctl status $SERVICE_NAME

# Verify service
echo "Verifying service..."
if [ "$SERVICE_NAME" = "skillbridge-backend" ]; then
    curl -f http://localhost:8080/actuator/health
elif [ "$SERVICE_NAME" = "skillbridge-frontend" ]; then
    curl -f http://localhost:3000/api/health
elif [ "$SERVICE_NAME" = "mysql" ]; then
    mysql -u root -p -e "SELECT 1;"
elif [ "$SERVICE_NAME" = "nginx" ]; then
    curl -f http://localhost/
fi

echo "Service startup completed"
```

### Shutdown Procedures

#### System Shutdown
```bash
#!/bin/bash
# system_shutdown.sh

echo "=== System Shutdown ==="
echo "Date: $(date)"
echo ""

# Stop Frontend
echo "Stopping Frontend..."
sudo systemctl stop skillbridge-frontend

# Stop Backend
echo "Stopping Backend..."
sudo systemctl stop skillbridge-backend

# Stop Nginx
echo "Stopping Nginx..."
sudo systemctl stop nginx

# Stop MySQL
echo "Stopping MySQL..."
sudo systemctl stop mysql

# Verify shutdown
echo "Verifying shutdown..."
systemctl status skillbridge-backend
systemctl status skillbridge-frontend
systemctl status nginx
systemctl status mysql

echo "System shutdown completed"
```

#### Service Shutdown
```bash
#!/bin/bash
# service_shutdown.sh

SERVICE_NAME=$1

echo "=== Service Shutdown ==="
echo "Service: $SERVICE_NAME"
echo "Date: $(date)"
echo ""

# Stop service
echo "Stopping service..."
sudo systemctl stop $SERVICE_NAME

# Check status
echo "Checking status..."
sudo systemctl status $SERVICE_NAME

echo "Service shutdown completed"
```

## System Management Documentation

### Documentation Templates

#### System Documentation Template
```markdown
# System Documentation

## System Overview
[System description and purpose]

## System Components
[System components and their functions]

## System Configuration
[System configuration details]

## System Procedures
[System operation procedures]

## System Monitoring
[System monitoring procedures]

## System Maintenance
[System maintenance procedures]

## System Troubleshooting
[System troubleshooting procedures]

## System Security
[System security procedures]

## System Backup
[System backup procedures]

## System Recovery
[System recovery procedures]
```

#### Procedure Documentation Template
```markdown
# Procedure Documentation

## Procedure Overview
[Procedure description and purpose]

## Prerequisites
[Requirements and prerequisites]

## Procedure Steps
[Step-by-step procedure]

## Verification
[Procedure verification steps]

## Troubleshooting
[Common issues and solutions]

## Related Procedures
[Related procedures and references]

## Documentation
[Documentation requirements]

## Training
[Training requirements]

## Review
[Procedure review requirements]
```

### Documentation Maintenance

#### Documentation Update
```bash
#!/bin/bash
# update_documentation.sh

echo "=== Update Documentation ==="
echo "Date: $(date)"
echo ""

# Update system documentation
echo "Updating system documentation..."
./update_system_documentation.sh

# Update procedure documentation
echo "Updating procedure documentation..."
./update_procedure_documentation.sh

# Update configuration documentation
echo "Updating configuration documentation..."
./update_configuration_documentation.sh

# Update monitoring documentation
echo "Updating monitoring documentation..."
./update_monitoring_documentation.sh

# Generate documentation report
echo "Generating documentation report..."
./generate_documentation_report.sh

echo "Documentation update completed"
```

#### Documentation Review
```bash
#!/bin/bash
# review_documentation.sh

echo "=== Review Documentation ==="
echo "Date: $(date)"
echo ""

# Review system documentation
echo "Reviewing system documentation..."
./review_system_documentation.sh

# Review procedure documentation
echo "Reviewing procedure documentation..."
./review_procedure_documentation.sh

# Review configuration documentation
echo "Reviewing configuration documentation..."
./review_configuration_documentation.sh

# Review monitoring documentation
echo "Reviewing monitoring documentation..."
./review_monitoring_documentation.sh

# Generate review report
echo "Generating review report..."
./generate_review_report.sh

echo "Documentation review completed"
```

## System Management Training

### Training Materials

#### Training Curriculum
```markdown
# System Management Training Curriculum

## Module 1: System Overview
- System architecture
- System components
- System functions
- System requirements

## Module 2: System Operations
- System startup procedures
- System shutdown procedures
- System monitoring procedures
- System maintenance procedures

## Module 3: System Troubleshooting
- Common issues
- Troubleshooting procedures
- Problem resolution
- Incident management

## Module 4: System Security
- Security procedures
- Security monitoring
- Security maintenance
- Security incident response

## Module 5: System Backup
- Backup procedures
- Backup verification
- Backup recovery
- Backup maintenance

## Module 6: System Recovery
- Recovery procedures
- Recovery testing
- Recovery documentation
- Recovery maintenance
```

#### Training Procedures
```bash
#!/bin/bash
# training_procedures.sh

echo "=== Training Procedures ==="
echo "Date: $(date)"
echo ""

# System overview training
echo "System overview training..."
./system_overview_training.sh

# System operations training
echo "System operations training..."
./system_operations_training.sh

# System troubleshooting training
echo "System troubleshooting training..."
./system_troubleshooting_training.sh

# System security training
echo "System security training..."
./system_security_training.sh

# System backup training
echo "System backup training..."
./system_backup_training.sh

# System recovery training
echo "System recovery training..."
./system_recovery_training.sh

echo "Training procedures completed"
```

### Training Assessment

#### Training Assessment
```bash
#!/bin/bash
# training_assessment.sh

echo "=== Training Assessment ==="
echo "Date: $(date)"
echo ""

# System knowledge assessment
echo "System knowledge assessment..."
./system_knowledge_assessment.sh

# Procedure knowledge assessment
echo "Procedure knowledge assessment..."
./procedure_knowledge_assessment.sh

# Troubleshooting assessment
echo "Troubleshooting assessment..."
./troubleshooting_assessment.sh

# Security knowledge assessment
echo "Security knowledge assessment..."
./security_knowledge_assessment.sh

# Backup knowledge assessment
echo "Backup knowledge assessment..."
./backup_knowledge_assessment.sh

# Recovery knowledge assessment
echo "Recovery knowledge assessment..."
./recovery_knowledge_assessment.sh

echo "Training assessment completed"
```

#### Training Certification
```bash
#!/bin/bash
# training_certification.sh

echo "=== Training Certification ==="
echo "Date: $(date)"
echo ""

# Check training completion
echo "Checking training completion..."
./check_training_completion.sh

# Assess training performance
echo "Assessing training performance..."
./assess_training_performance.sh

# Generate certification
echo "Generating certification..."
./generate_certification.sh

# Update training records
echo "Updating training records..."
./update_training_records.sh

echo "Training certification completed"
```
