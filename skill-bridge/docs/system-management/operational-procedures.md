# Operational Procedures

## Daily Operations

### System Health Checks

#### Morning Checklist (9:00 AM)
1. **Database Status**
   ```bash
   # Check MySQL service status
   sudo systemctl status mysql
   
   # Check database connectivity
   mysql -u root -p -e "SELECT 1;"
   ```

2. **Application Status**
   ```bash
   # Check Spring Boot application
   curl -f http://localhost:8080/actuator/health
   
   # Check Next.js application
   curl -f http://localhost:3000/api/health
   ```

3. **Disk Space**
   ```bash
   # Check disk usage
   df -h
   
   # Check database disk usage
   du -sh /var/lib/mysql/
   ```

4. **Log Files**
   ```bash
   # Check application logs
   tail -n 100 /var/log/skillbridge/application.log
   
   # Check error logs
   grep -i error /var/log/skillbridge/application.log | tail -n 20
   ```

#### Evening Checklist (6:00 PM)
1. **Backup Verification**
   ```bash
   # Verify backup completion
   ls -la /backup/mysql/$(date +%Y%m%d)/
   
   # Check backup file size
   du -sh /backup/mysql/$(date +%Y%m%d)/
   ```

2. **Performance Metrics**
   ```bash
   # Check system resources
   top -n 1
   
   # Check database performance
   mysql -u root -p -e "SHOW PROCESSLIST;"
   ```

### Weekly Operations

#### Monday - System Maintenance
1. **Log Rotation**
   ```bash
   # Rotate application logs
   sudo logrotate -f /etc/logrotate.d/skillbridge
   
   # Clean old log files
   find /var/log/skillbridge -name "*.log.*" -mtime +7 -delete
   ```

2. **Database Maintenance**
   ```bash
   # Optimize database tables
   mysql -u root -p -e "OPTIMIZE TABLE contacts, engineers, proposals, contracts;"
   
   # Check database integrity
   mysqlcheck -u root -p --all-databases
   ```

#### Friday - Performance Review
1. **System Performance**
   ```bash
   # Generate performance report
   iostat -x 1 5
   
   # Check memory usage
   free -h
   ```

2. **Application Metrics**
   ```bash
   # Check application metrics
   curl http://localhost:8080/actuator/metrics
   
   # Check database connections
   mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
   ```

## System Startup Procedures

### Development Environment Startup
1. **Database Startup**
   ```bash
   # Start MySQL service
   sudo systemctl start mysql
   
   # Verify database connection
   mysql -u root -p -e "SHOW DATABASES;"
   ```

2. **Backend Startup**
   ```bash
   # Navigate to backend directory
   cd backend/
   
   # Start Spring Boot application
   mvn spring-boot:run
   ```

3. **Frontend Startup**
   ```bash
   # Navigate to frontend directory
   cd frontend/
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

### Production Environment Startup
1. **Database Startup**
   ```bash
   # Start MySQL service
   sudo systemctl start mysql
   
   # Verify database status
   sudo systemctl status mysql
   ```

2. **Backend Startup**
   ```bash
   # Start Spring Boot application
   sudo systemctl start skillbridge-backend
   
   # Check application status
   sudo systemctl status skillbridge-backend
   ```

3. **Frontend Startup**
   ```bash
   # Start Nginx
   sudo systemctl start nginx
   
   # Check Nginx status
   sudo systemctl status nginx
   ```

## System Shutdown Procedures

### Graceful Shutdown
1. **Stop Applications**
   ```bash
   # Stop Spring Boot application
   sudo systemctl stop skillbridge-backend
   
   # Stop Nginx
   sudo systemctl stop nginx
   ```

2. **Database Shutdown**
   ```bash
   # Graceful MySQL shutdown
   sudo systemctl stop mysql
   
   # Verify shutdown
   sudo systemctl status mysql
   ```

### Emergency Shutdown
1. **Force Stop Applications**
   ```bash
   # Kill Java processes
   sudo pkill -f java
   
   # Kill Node.js processes
   sudo pkill -f node
   ```

2. **Force Database Shutdown**
   ```bash
   # Force MySQL shutdown
   sudo systemctl kill mysql
   ```

## Backup Procedures

### Database Backup
1. **Daily Backup**
   ```bash
   # Create backup directory
   mkdir -p /backup/mysql/$(date +%Y%m%d)
   
   # Full database backup
   mysqldump -u root -p --all-databases > /backup/mysql/$(date +%Y%m%d)/full_backup.sql
   
   # Compress backup
   gzip /backup/mysql/$(date +%Y%m%d)/full_backup.sql
   ```

2. **Incremental Backup**
   ```bash
   # Binary log backup
   mysqlbinlog /var/lib/mysql/mysql-bin.* > /backup/mysql/$(date +%Y%m%d)/incremental_backup.sql
   ```

### Application Backup
1. **Configuration Backup**
   ```bash
   # Backup application configuration
   cp -r /etc/skillbridge /backup/config/$(date +%Y%m%d)/
   
   # Backup Nginx configuration
   cp /etc/nginx/sites-available/skillbridge /backup/config/$(date +%Y%m%d)/
   ```

2. **Log Backup**
   ```bash
   # Backup application logs
   tar -czf /backup/logs/$(date +%Y%m%d)_logs.tar.gz /var/log/skillbridge/
   ```

## Recovery Procedures

### Database Recovery
1. **Full Database Recovery**
   ```bash
   # Stop MySQL service
   sudo systemctl stop mysql
   
   # Restore from backup
   gunzip -c /backup/mysql/20241216/full_backup.sql.gz | mysql -u root -p
   
   # Start MySQL service
   sudo systemctl start mysql
   ```

2. **Point-in-Time Recovery**
   ```bash
   # Restore full backup
   gunzip -c /backup/mysql/20241216/full_backup.sql.gz | mysql -u root -p
   
   # Apply binary logs
   mysqlbinlog /var/lib/mysql/mysql-bin.* | mysql -u root -p
   ```

### Application Recovery
1. **Configuration Recovery**
   ```bash
   # Restore configuration
   cp -r /backup/config/20241216/skillbridge /etc/
   
   # Restart services
   sudo systemctl restart skillbridge-backend
   sudo systemctl restart nginx
   ```

## Monitoring Procedures

### System Monitoring
1. **Resource Monitoring**
   ```bash
   # CPU usage
   top -n 1 | grep "Cpu(s)"
   
   # Memory usage
   free -h
   
   # Disk usage
   df -h
   ```

2. **Application Monitoring**
   ```bash
   # Check application health
   curl -f http://localhost:8080/actuator/health
   
   # Check application metrics
   curl http://localhost:8080/actuator/metrics
   ```

### Database Monitoring
1. **Database Performance**
   ```bash
   # Check slow queries
   mysql -u root -p -e "SHOW VARIABLES LIKE 'slow_query_log';"
   
   # Check database size
   mysql -u root -p -e "SELECT table_schema, ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size in MB' FROM information_schema.tables GROUP BY table_schema;"
   ```

2. **Connection Monitoring**
   ```bash
   # Check active connections
   mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
   
   # Check connection limits
   mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections';"
   ```

## Security Procedures

### Access Control
1. **User Management**
   ```bash
   # Check system users
   cat /etc/passwd | grep skillbridge
   
   # Check sudo access
   sudo -l
   ```

2. **Database Security**
   ```bash
   # Check database users
   mysql -u root -p -e "SELECT user, host FROM mysql.user;"
   
   # Check database permissions
   mysql -u root -p -e "SHOW GRANTS FOR 'skillbridge'@'localhost';"
   ```

### Security Updates
1. **System Updates**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Check for security updates
   sudo apt list --upgradable | grep -i security
   ```

2. **Application Updates**
   ```bash
   # Update Java
   sudo apt update && sudo apt upgrade openjdk-17-jdk
   
   # Update Node.js
   sudo apt update && sudo apt upgrade nodejs npm
   ```

## Maintenance Procedures

### Regular Maintenance
1. **Log Cleanup**
   ```bash
   # Clean old log files
   find /var/log/skillbridge -name "*.log.*" -mtime +30 -delete
   
   # Clean old backup files
   find /backup -name "*.sql.gz" -mtime +90 -delete
   ```

2. **Database Maintenance**
   ```bash
   # Optimize database tables
   mysql -u root -p -e "OPTIMIZE TABLE contacts, engineers, proposals, contracts;"
   
   # Analyze database tables
   mysql -u root -p -e "ANALYZE TABLE contacts, engineers, proposals, contracts;"
   ```

### System Updates
1. **Application Updates**
   ```bash
   # Stop services
   sudo systemctl stop skillbridge-backend
   
   # Update application
   git pull origin main
   mvn clean package
   
   # Restart services
   sudo systemctl start skillbridge-backend
   ```

2. **Database Updates**
   ```bash
   # Backup before update
   mysqldump -u root -p --all-databases > /backup/mysql/pre_update_backup.sql
   
   # Apply database updates
   mysql -u root -p < database_updates.sql
   ```

## Troubleshooting Procedures

### Common Issues
1. **Application Won't Start**
   ```bash
   # Check application logs
   tail -n 100 /var/log/skillbridge/application.log
   
   # Check system resources
   free -h && df -h
   
   # Check port availability
   netstat -tlnp | grep :8080
   ```

2. **Database Connection Issues**
   ```bash
   # Check MySQL service
   sudo systemctl status mysql
   
   # Check database connectivity
   mysql -u root -p -e "SELECT 1;"
   
   # Check firewall
   sudo ufw status
   ```

3. **Performance Issues**
   ```bash
   # Check system resources
   top -n 1
   
   # Check database performance
   mysql -u root -p -e "SHOW PROCESSLIST;"
   
   # Check application metrics
   curl http://localhost:8080/actuator/metrics
   ```

### Emergency Procedures
1. **System Overload**
   ```bash
   # Check system resources
   top -n 1
   
   # Kill high CPU processes
   sudo pkill -f java
   
   # Restart services
   sudo systemctl restart skillbridge-backend
   ```

2. **Database Issues**
   ```bash
   # Check MySQL error log
   tail -n 100 /var/log/mysql/error.log
   
   # Restart MySQL
   sudo systemctl restart mysql
   
   # Check database integrity
   mysqlcheck -u root -p --all-databases
   ```
