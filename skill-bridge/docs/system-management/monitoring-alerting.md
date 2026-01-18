# Monitoring & Alerting

## Monitoring Strategy

### Monitoring Objectives
- **System Health**: Ensure all components are operational
- **Performance**: Monitor system performance metrics
- **Availability**: Track system uptime and availability
- **Security**: Monitor security events and anomalies
- **Capacity**: Track resource utilization and growth

### Monitoring Layers

#### Infrastructure Monitoring
- **Server Resources**: CPU, Memory, Disk, Network
- **Operating System**: System metrics and health
- **Network**: Connectivity and bandwidth
- **Storage**: Disk usage and I/O performance

#### Application Monitoring
- **Application Health**: Service status and responsiveness
- **Performance Metrics**: Response times and throughput
- **Error Rates**: Application errors and exceptions
- **User Activity**: User sessions and interactions

#### Database Monitoring
- **Database Health**: Connection status and performance
- **Query Performance**: Slow queries and optimization
- **Storage**: Database size and growth
- **Backup Status**: Backup completion and integrity

## Monitoring Tools

### System Monitoring

#### Basic System Monitoring
```bash
# CPU and Memory monitoring
top -n 1 | head -20

# Disk usage monitoring
df -h

# Network monitoring
netstat -tlnp | grep :8080
netstat -tlnp | grep :3306

# Process monitoring
ps aux | grep java
ps aux | grep node
```

#### Advanced System Monitoring
```bash
# System load average
uptime

# Memory usage details
free -h

# Disk I/O monitoring
iostat -x 1 5

# Network interface monitoring
ifconfig
```

### Application Monitoring

#### Spring Boot Actuator
```yaml
# application.yml configuration
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true
```

#### Health Check Endpoints
```bash
# Application health check
curl -f http://localhost:8080/actuator/health

# Detailed health information
curl http://localhost:8080/actuator/health | jq

# Application metrics
curl http://localhost:8080/actuator/metrics

# Prometheus metrics
curl http://localhost:8080/actuator/prometheus
```

#### Next.js Monitoring
```bash
# Frontend health check
curl -f http://localhost:3000/api/health

# Frontend metrics
curl http://localhost:3000/api/metrics
```

### Database Monitoring

#### MySQL Monitoring
```sql
-- Database status
SHOW STATUS;

-- Connection monitoring
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';

-- Performance monitoring
SHOW STATUS LIKE 'Slow_queries';
SHOW STATUS LIKE 'Questions';

-- Storage monitoring
SELECT 
    table_schema,
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size in MB'
FROM information_schema.tables 
GROUP BY table_schema;
```

#### Database Performance Queries
```sql
-- Slow query log
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- Process list
SHOW PROCESSLIST;

-- Table status
SHOW TABLE STATUS;

-- Index usage
SHOW INDEX FROM contacts;
SHOW INDEX FROM engineers;
```

## Alerting Configuration

### Alert Categories

#### Critical Alerts
- **System Down**: Application or database unavailable
- **High CPU**: CPU usage > 90% for 5 minutes
- **High Memory**: Memory usage > 90% for 5 minutes
- **Disk Full**: Disk usage > 95%
- **Database Down**: MySQL service unavailable

#### Warning Alerts
- **High CPU**: CPU usage > 80% for 10 minutes
- **High Memory**: Memory usage > 80% for 10 minutes
- **Disk Space**: Disk usage > 85%
- **Slow Queries**: Database queries > 5 seconds
- **High Error Rate**: Error rate > 5%

#### Info Alerts
- **Backup Complete**: Daily backup completed
- **System Restart**: Application or database restarted
- **Configuration Change**: System configuration updated
- **User Activity**: Unusual user activity patterns

### Alert Channels

#### Email Alerts
```bash
# Configure email alerts
echo "Subject: SkillBridge Alert - System Down" | sendmail admin@skillbridge.com
```

#### Log-based Alerts
```bash
# Monitor application logs
tail -f /var/log/skillbridge/application.log | grep -i "error\|exception\|fatal"

# Monitor system logs
tail -f /var/log/syslog | grep -i "skillbridge\|mysql\|nginx"
```

#### Script-based Alerts
```bash
#!/bin/bash
# health_check.sh
if ! curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "ALERT: Application is down" | mail -s "SkillBridge Alert" admin@skillbridge.com
fi
```

## Monitoring Scripts

### System Health Check Script
```bash
#!/bin/bash
# system_health_check.sh

# Check system resources
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.2f"), $3/$2 * 100.0}')
DISK_USAGE=$(df -h / | awk 'NR==2{print $5}' | cut -d'%' -f1)

# Check application health
APP_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health)
DB_HEALTH=$(systemctl is-active mysql)

# Generate report
echo "=== System Health Report ==="
echo "CPU Usage: ${CPU_USAGE}%"
echo "Memory Usage: ${MEMORY_USAGE}%"
echo "Disk Usage: ${DISK_USAGE}%"
echo "Application Health: ${APP_HEALTH}"
echo "Database Status: ${DB_HEALTH}"
```

### Database Monitoring Script
```bash
#!/bin/bash
# database_monitor.sh

# Check database connections
CONNECTIONS=$(mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';" | tail -n 1 | awk '{print $2}')
MAX_CONNECTIONS=$(mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections';" | tail -n 1 | awk '{print $2}')

# Check slow queries
SLOW_QUERIES=$(mysql -u root -p -e "SHOW STATUS LIKE 'Slow_queries';" | tail -n 1 | awk '{print $2}')

# Check database size
DB_SIZE=$(mysql -u root -p -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size in MB' FROM information_schema.tables WHERE table_schema = 'skillbridge';" | tail -n 1)

echo "=== Database Monitoring Report ==="
echo "Active Connections: ${CONNECTIONS}/${MAX_CONNECTIONS}"
echo "Slow Queries: ${SLOW_QUERIES}"
echo "Database Size: ${DB_SIZE} MB"
```

### Application Monitoring Script
```bash
#!/bin/bash
# application_monitor.sh

# Check application health
HEALTH_RESPONSE=$(curl -s http://localhost:8080/actuator/health)
HEALTH_STATUS=$(echo $HEALTH_RESPONSE | jq -r '.status')

# Check application metrics
METRICS_RESPONSE=$(curl -s http://localhost:8080/actuator/metrics)

# Check error logs
ERROR_COUNT=$(grep -c "ERROR" /var/log/skillbridge/application.log)

echo "=== Application Monitoring Report ==="
echo "Health Status: ${HEALTH_STATUS}"
echo "Error Count: ${ERROR_COUNT}"
echo "Metrics: ${METRICS_RESPONSE}"
```

## Performance Monitoring

### Key Performance Indicators (KPIs)

#### System KPIs
- **CPU Utilization**: < 80% average
- **Memory Utilization**: < 80% average
- **Disk I/O**: < 1000 IOPS
- **Network Latency**: < 100ms

#### Application KPIs
- **Response Time**: < 2 seconds
- **Throughput**: > 100 requests/minute
- **Error Rate**: < 1%
- **Availability**: > 99%

#### Database KPIs
- **Query Response Time**: < 1 second
- **Connection Pool**: < 80% utilization
- **Slow Queries**: < 5% of total queries
- **Lock Wait Time**: < 1 second

### Performance Monitoring Commands
```bash
# System performance
iostat -x 1 5
vmstat 1 5
sar -u 1 5

# Application performance
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8080/api/contacts

# Database performance
mysql -u root -p -e "SHOW STATUS LIKE 'Innodb_buffer_pool_hit_rate';"
mysql -u root -p -e "SHOW STATUS LIKE 'Innodb_log_waits';"
```

## Log Monitoring

### Log Sources
- **Application Logs**: `/var/log/skillbridge/application.log`
- **System Logs**: `/var/log/syslog`
- **Database Logs**: `/var/log/mysql/error.log`
- **Web Server Logs**: `/var/log/nginx/access.log`

### Log Analysis
```bash
# Error analysis
grep -i "error\|exception\|fatal" /var/log/skillbridge/application.log | tail -n 20

# Performance analysis
grep "slow query" /var/log/mysql/error.log | tail -n 10

# Access analysis
tail -n 100 /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -nr
```

### Log Rotation
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/skillbridge

# Log rotation configuration
/var/log/skillbridge/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 skillbridge skillbridge
}
```

## Alert Response Procedures

### Critical Alert Response
1. **Immediate Assessment**
   - Check system status
   - Identify root cause
   - Assess impact

2. **Immediate Actions**
   - Restart services if needed
   - Check system resources
   - Verify database connectivity

3. **Communication**
   - Notify stakeholders
   - Update status page
   - Document incident

### Warning Alert Response
1. **Investigation**
   - Analyze metrics
   - Check system logs
   - Identify trends

2. **Preventive Actions**
   - Optimize performance
   - Clean up resources
   - Update monitoring

3. **Documentation**
   - Record findings
   - Update procedures
   - Schedule maintenance

## Monitoring Dashboard

### System Dashboard
- **CPU Usage**: Real-time CPU utilization
- **Memory Usage**: Memory consumption trends
- **Disk Usage**: Storage utilization
- **Network**: Network traffic and latency

### Application Dashboard
- **Health Status**: Application health indicators
- **Response Time**: API response times
- **Error Rate**: Error frequency and types
- **User Activity**: User sessions and interactions

### Database Dashboard
- **Connection Pool**: Active connections
- **Query Performance**: Slow query analysis
- **Storage**: Database size and growth
- **Backup Status**: Backup completion and integrity

## Monitoring Maintenance

### Regular Maintenance Tasks
1. **Log Cleanup**: Remove old log files
2. **Metric Analysis**: Review performance trends
3. **Alert Tuning**: Adjust alert thresholds
4. **Dashboard Updates**: Update monitoring dashboards

### Monthly Reviews
1. **Performance Analysis**: Review system performance
2. **Capacity Planning**: Plan for future growth
3. **Alert Optimization**: Improve alert accuracy
4. **Documentation Updates**: Update monitoring procedures
