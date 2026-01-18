# Performance Management

## Performance Overview

### Performance Objectives
- **Response Time**: API responses < 2 seconds
- **Throughput**: Support 100+ concurrent users
- **Availability**: 99% uptime target
- **Scalability**: Handle 10x current load
- **Resource Efficiency**: Optimal resource utilization

### Performance Metrics

#### Key Performance Indicators (KPIs)
- **Response Time**: Average API response time
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests
- **Availability**: System uptime percentage
- **Resource Utilization**: CPU, Memory, Disk, Network usage

#### Performance Baselines
```yaml
# Performance baselines
performance-baselines:
  response-time:
    api-calls: 2.0s
    database-queries: 1.0s
    file-uploads: 5.0s
    page-loads: 3.0s
  
  throughput:
    concurrent-users: 100
    requests-per-second: 50
    database-connections: 20
    file-operations: 10
  
  resource-utilization:
    cpu-usage: 70%
    memory-usage: 80%
    disk-usage: 85%
    network-usage: 60%
```

## System Performance Monitoring

### Application Performance Monitoring

#### Spring Boot Actuator Metrics
```yaml
# application.yml
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
    distribution:
      percentiles-histogram:
        http.server.requests: true
```

#### Performance Monitoring Scripts
```bash
#!/bin/bash
# monitor_application_performance.sh

# Check application health
HEALTH_RESPONSE=$(curl -s http://localhost:8080/actuator/health)
HEALTH_STATUS=$(echo $HEALTH_RESPONSE | jq -r '.status')

echo "Application Health: $HEALTH_STATUS"

# Check response time
RESPONSE_TIME=$(curl -w "%{time_total}" -o /dev/null -s http://localhost:8080/actuator/health)
echo "Response Time: ${RESPONSE_TIME}s"

# Check metrics
METRICS_RESPONSE=$(curl -s http://localhost:8080/actuator/metrics)
echo "Metrics: $METRICS_RESPONSE"
```

#### Database Performance Monitoring
```sql
-- Database performance queries
-- Check slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- Check query performance
SHOW STATUS LIKE 'Slow_queries';
SHOW STATUS LIKE 'Questions';

-- Check connection performance
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';

-- Check buffer pool performance
SHOW STATUS LIKE 'Innodb_buffer_pool_hit_rate';
SHOW STATUS LIKE 'Innodb_log_waits';
```

### System Resource Monitoring

#### CPU Monitoring
```bash
#!/bin/bash
# monitor_cpu.sh

# Get CPU usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
echo "CPU Usage: ${CPU_USAGE}%"

# Get CPU load average
LOAD_AVERAGE=$(uptime | awk -F'load average:' '{print $2}')
echo "Load Average: $LOAD_AVERAGE"

# Get CPU info
CPU_INFO=$(lscpu | grep "CPU(s):")
echo "CPU Info: $CPU_INFO"
```

#### Memory Monitoring
```bash
#!/bin/bash
# monitor_memory.sh

# Get memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.2f"), $3/$2 * 100.0}')
echo "Memory Usage: ${MEMORY_USAGE}%"

# Get memory details
MEMORY_DETAILS=$(free -h)
echo "Memory Details:"
echo "$MEMORY_DETAILS"

# Get swap usage
SWAP_USAGE=$(free | grep Swap | awk '{printf("%.2f"), $3/$2 * 100.0}')
echo "Swap Usage: ${SWAP_USAGE}%"
```

#### Disk Monitoring
```bash
#!/bin/bash
# monitor_disk.sh

# Get disk usage
DISK_USAGE=$(df -h / | awk 'NR==2{print $5}' | cut -d'%' -f1)
echo "Disk Usage: ${DISK_USAGE}%"

# Get disk I/O
DISK_IO=$(iostat -x 1 1 | grep -E "(Device|sda)")
echo "Disk I/O:"
echo "$DISK_IO"

# Get disk space by directory
DISK_SPACE=$(du -sh /opt/skillbridge /var/lib/mysql /var/log/skillbridge)
echo "Disk Space by Directory:"
echo "$DISK_SPACE"
```

#### Network Monitoring
```bash
#!/bin/bash
# monitor_network.sh

# Get network interfaces
NETWORK_INTERFACES=$(ip addr show)
echo "Network Interfaces:"
echo "$NETWORK_INTERFACES"

# Get network connections
NETWORK_CONNECTIONS=$(netstat -tlnp | grep -E "(8080|3000|3306)")
echo "Network Connections:"
echo "$NETWORK_CONNECTIONS"

# Get network traffic
NETWORK_TRAFFIC=$(iftop -t -s 10)
echo "Network Traffic:"
echo "$NETWORK_TRAFFIC"
```

## Performance Optimization

### Database Optimization

#### Query Optimization
```sql
-- Analyze slow queries
SELECT 
    query_time,
    lock_time,
    rows_sent,
    rows_examined,
    sql_text
FROM mysql.slow_log
ORDER BY query_time DESC
LIMIT 10;

-- Check table indexes
SHOW INDEX FROM contacts;
SHOW INDEX FROM engineers;
SHOW INDEX FROM proposals;
SHOW INDEX FROM contracts;

-- Analyze table performance
ANALYZE TABLE contacts, engineers, proposals, contracts;
```

#### Database Configuration Optimization
```ini
# MySQL configuration optimization
[mysqld]
# Buffer pool size (70% of available RAM)
innodb_buffer_pool_size = 2G

# Log file size
innodb_log_file_size = 256M

# Connection settings
max_connections = 200
max_connect_errors = 1000

# Query cache
query_cache_type = 1
query_cache_size = 64M

# Slow query log
slow_query_log = 1
long_query_time = 2
```

#### Database Indexing Strategy
```sql
-- Create performance indexes
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_assignee ON contacts(assignee_user_id);
CREATE INDEX idx_contacts_client ON contacts(client_user_id);
CREATE INDEX idx_engineers_status ON engineers(status);
CREATE INDEX idx_engineers_seniority ON engineers(seniority);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_owner ON opportunities(owner_user_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_opportunity ON proposals(opportunity_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```

### Application Optimization

#### JVM Tuning
```bash
# JVM optimization parameters
JAVA_OPTS="-Xms2g -Xmx4g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+UseStringDeduplication"
export JAVA_OPTS

# Start application with optimized JVM
java $JAVA_OPTS -jar skillbridge.jar
```

#### Spring Boot Optimization
```yaml
# application.yml optimization
server:
  tomcat:
    max-threads: 200
    min-spare-threads: 10
    max-connections: 8192
    accept-count: 100
    connection-timeout: 20000

spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 60000
```

#### Frontend Optimization
```typescript
// Next.js optimization configuration
// next.config.js
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable static optimization
  trailingSlash: false,
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@headlessui/react'],
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    return config;
  },
};
```

### Caching Strategy

#### Application-Level Caching
```java
// Spring Boot caching configuration
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .recordStats());
        return cacheManager;
    }
}

// Cache usage example
@Service
public class ContactService {
    
    @Cacheable(value = "contacts", key = "#id")
    public Contact findById(Integer id) {
        return contactRepository.findById(id).orElse(null);
    }
    
    @CacheEvict(value = "contacts", key = "#contact.id")
    public Contact save(Contact contact) {
        return contactRepository.save(contact);
    }
}
```

#### Database Query Caching
```sql
-- Enable query cache
SET GLOBAL query_cache_type = 1;
SET GLOBAL query_cache_size = 64M;

-- Cache frequently used queries
SELECT SQL_CACHE * FROM contacts WHERE status = 'NEW';
SELECT SQL_CACHE * FROM engineers WHERE status = 'AVAILABLE';
```

#### Frontend Caching
```typescript
// React Query for data caching
import { useQuery } from '@tanstack/react-query';

const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: () => api.get('/contacts').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Service Worker for caching
// public/sw.js
const CACHE_NAME = 'skillbridge-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## Performance Testing

### Load Testing

#### Apache Bench Load Testing
```bash
#!/bin/bash
# load_test.sh

# Test API endpoints
echo "Testing API endpoints..."

# Test health endpoint
ab -n 1000 -c 10 http://localhost:8080/actuator/health

# Test contacts endpoint
ab -n 1000 -c 10 http://localhost:8080/api/contacts

# Test engineers endpoint
ab -n 1000 -c 10 http://localhost:8080/api/engineers

# Test proposals endpoint
ab -n 1000 -c 10 http://localhost:8080/api/proposals
```

#### JMeter Load Testing
```xml
<!-- JMeter test plan -->
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan testname="SkillBridge Load Test">
      <elementProp name="TestPlan.arguments" elementType="Arguments" guiclass="ArgumentsPanel">
        <collectionProp name="Arguments.arguments"/>
      </elementProp>
      <stringProp name="TestPlan.user_define_classpath"></stringProp>
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup testname="API Load Test">
        <stringProp name="ThreadGroup.num_threads">100</stringProp>
        <stringProp name="ThreadGroup.ramp_time">60</stringProp>
        <stringProp name="ThreadGroup.duration">300</stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
      </ThreadGroup>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
```

### Stress Testing

#### System Stress Testing
```bash
#!/bin/bash
# stress_test.sh

# CPU stress test
stress --cpu 4 --timeout 60s

# Memory stress test
stress --vm 2 --vm-bytes 1G --timeout 60s

# Disk stress test
stress --io 4 --timeout 60s

# Combined stress test
stress --cpu 2 --vm 1 --vm-bytes 512M --io 2 --timeout 120s
```

#### Database Stress Testing
```sql
-- Database stress test queries
-- Generate load on contacts table
SELECT COUNT(*) FROM contacts WHERE status = 'NEW';
SELECT * FROM contacts WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY);
SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100;

-- Generate load on engineers table
SELECT COUNT(*) FROM engineers WHERE status = 'AVAILABLE';
SELECT * FROM engineers WHERE seniority = 'Senior';
SELECT * FROM engineers ORDER BY years_experience DESC LIMIT 50;

-- Generate load on proposals table
SELECT COUNT(*) FROM proposals WHERE status = 'DRAFT';
SELECT * FROM proposals WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY);
SELECT * FROM proposals ORDER BY created_at DESC LIMIT 100;
```

## Performance Analysis

### Performance Profiling

#### Application Profiling
```bash
#!/bin/bash
# profile_application.sh

# JVM profiling
jstat -gc -t $(pgrep java) 1s 10

# Memory profiling
jmap -histo $(pgrep java)

# Thread profiling
jstack $(pgrep java)

# CPU profiling
top -H -p $(pgrep java)
```

#### Database Profiling
```sql
-- Database profiling queries
-- Check query execution plans
EXPLAIN SELECT * FROM contacts WHERE status = 'NEW';
EXPLAIN SELECT * FROM engineers WHERE seniority = 'Senior';

-- Check table statistics
SHOW TABLE STATUS LIKE 'contacts';
SHOW TABLE STATUS LIKE 'engineers';
SHOW TABLE STATUS LIKE 'proposals';
SHOW TABLE STATUS LIKE 'contracts';

-- Check index usage
SHOW INDEX FROM contacts;
SHOW INDEX FROM engineers;
```

### Performance Bottleneck Analysis

#### Common Bottlenecks
1. **Database Queries**: Slow queries, missing indexes
2. **Memory Usage**: Memory leaks, insufficient heap
3. **CPU Usage**: High CPU utilization, inefficient algorithms
4. **Network I/O**: Slow network connections, large data transfers
5. **Disk I/O**: Slow disk access, insufficient disk space

#### Bottleneck Identification
```bash
#!/bin/bash
# identify_bottlenecks.sh

echo "=== Performance Bottleneck Analysis ==="

# Check CPU usage
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)"

# Check memory usage
echo "Memory Usage:"
free -h

# Check disk usage
echo "Disk Usage:"
df -h

# Check network usage
echo "Network Usage:"
netstat -i

# Check database performance
echo "Database Performance:"
mysql -u root -p -e "SHOW STATUS LIKE 'Slow_queries';"
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"

# Check application performance
echo "Application Performance:"
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8080/actuator/health
```

## Performance Reporting

### Performance Reports

#### Daily Performance Report
```bash
#!/bin/bash
# daily_performance_report.sh

REPORT_FILE="/var/log/performance/daily_report_$(date +%Y%m%d).txt"

echo "=== Daily Performance Report ===" > $REPORT_FILE
echo "Date: $(date)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# System metrics
echo "System Metrics:" >> $REPORT_FILE
echo "CPU Usage: $(top -bn1 | grep 'Cpu(s)' | awk '{print $2}')" >> $REPORT_FILE
echo "Memory Usage: $(free | grep Mem | awk '{printf("%.2f"), $3/$2 * 100.0}')%" >> $REPORT_FILE
echo "Disk Usage: $(df -h / | awk 'NR==2{print $5}')" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Application metrics
echo "Application Metrics:" >> $REPORT_FILE
curl -s http://localhost:8080/actuator/metrics >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Database metrics
echo "Database Metrics:" >> $REPORT_FILE
mysql -u root -p -e "SHOW STATUS LIKE 'Slow_queries';" >> $REPORT_FILE
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';" >> $REPORT_FILE

echo "Daily performance report generated: $REPORT_FILE"
```

#### Weekly Performance Report
```bash
#!/bin/bash
# weekly_performance_report.sh

REPORT_FILE="/var/log/performance/weekly_report_$(date +%Y%m%d).txt"

echo "=== Weekly Performance Report ===" > $REPORT_FILE
echo "Week: $(date)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Performance trends
echo "Performance Trends:" >> $REPORT_FILE
echo "Average CPU Usage: $(cat /var/log/performance/daily_*.txt | grep 'CPU Usage' | awk '{sum+=$3} END {print sum/NR}')" >> $REPORT_FILE
echo "Average Memory Usage: $(cat /var/log/performance/daily_*.txt | grep 'Memory Usage' | awk '{sum+=$3} END {print sum/NR}')" >> $REPORT_FILE
echo "Average Disk Usage: $(cat /var/log/performance/daily_*.txt | grep 'Disk Usage' | awk '{sum+=$3} END {print sum/NR}')" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Performance recommendations
echo "Performance Recommendations:" >> $REPORT_FILE
echo "1. Review slow queries" >> $REPORT_FILE
echo "2. Optimize database indexes" >> $REPORT_FILE
echo "3. Monitor memory usage" >> $REPORT_FILE
echo "4. Check disk space" >> $REPORT_FILE

echo "Weekly performance report generated: $REPORT_FILE"
```

### Performance Alerts

#### Performance Alert Configuration
```bash
#!/bin/bash
# performance_alerts.sh

# Check CPU usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
if [ $(echo "$CPU_USAGE > 80" | bc) -eq 1 ]; then
    echo "ALERT: High CPU usage: ${CPU_USAGE}%" | mail -s "Performance Alert" admin@skillbridge.com
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.2f"), $3/$2 * 100.0}')
if [ $(echo "$MEMORY_USAGE > 80" | bc) -eq 1 ]; then
    echo "ALERT: High memory usage: ${MEMORY_USAGE}%" | mail -s "Performance Alert" admin@skillbridge.com
fi

# Check disk usage
DISK_USAGE=$(df -h / | awk 'NR==2{print $5}' | cut -d'%' -f1)
if [ $DISK_USAGE -gt 80 ]; then
    echo "ALERT: High disk usage: ${DISK_USAGE}%" | mail -s "Performance Alert" admin@skillbridge.com
fi

# Check response time
RESPONSE_TIME=$(curl -w "%{time_total}" -o /dev/null -s http://localhost:8080/actuator/health)
if [ $(echo "$RESPONSE_TIME > 2.0" | bc) -eq 1 ]; then
    echo "ALERT: Slow response time: ${RESPONSE_TIME}s" | mail -s "Performance Alert" admin@skillbridge.com
fi
```

## Performance Maintenance

### Regular Performance Tasks

#### Daily Performance Tasks
```bash
#!/bin/bash
# daily_performance_tasks.sh

# Check system performance
./monitor_system_performance.sh

# Check application performance
./monitor_application_performance.sh

# Check database performance
./monitor_database_performance.sh

# Generate performance report
./daily_performance_report.sh
```

#### Weekly Performance Tasks
```bash
#!/bin/bash
# weekly_performance_tasks.sh

# Analyze performance trends
./analyze_performance_trends.sh

# Optimize database
./optimize_database.sh

# Clean up logs
./cleanup_performance_logs.sh

# Generate weekly report
./weekly_performance_report.sh
```

#### Monthly Performance Tasks
```bash
#!/bin/bash
# monthly_performance_tasks.sh

# Comprehensive performance analysis
./comprehensive_performance_analysis.sh

# Performance optimization review
./performance_optimization_review.sh

# Capacity planning
./capacity_planning.sh

# Performance documentation update
./update_performance_documentation.sh
```
