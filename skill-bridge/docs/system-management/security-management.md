# Security Management

## Security Overview

### Security Objectives
- **Data Protection**: Protect sensitive business and personal data
- **Access Control**: Ensure proper authentication and authorization
- **System Integrity**: Maintain system security and stability
- **Compliance**: Meet security standards and regulations
- **Incident Response**: Handle security incidents effectively

### Security Framework

#### Security Layers
1. **Network Security**: Firewall, VPN, network segmentation
2. **Application Security**: Authentication, authorization, input validation
3. **Database Security**: Access control, encryption, audit logging
4. **System Security**: OS hardening, patch management, monitoring
5. **Physical Security**: Server room access, hardware protection

## Access Control

### User Authentication

#### Authentication Methods
- **JWT Tokens**: Stateless authentication for API access
- **Password Policy**: Strong password requirements
- **Session Management**: Secure session handling
- **Multi-Factor Authentication**: Optional 2FA implementation

#### Password Security
```bash
# Password policy configuration
# Minimum 8 characters
# At least 1 uppercase letter
# At least 1 lowercase letter
# At least 1 number
# At least 1 special character
# No common passwords
# Password history: 5 passwords
# Maximum age: 90 days
```

#### JWT Token Security
```yaml
# JWT Configuration
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400  # 24 hours
  refresh-expiration: 604800  # 7 days
  algorithm: HS256
  issuer: skillbridge
  audience: skillbridge-users
```

### User Authorization

#### Role-Based Access Control (RBAC)
```sql
-- User roles and permissions
CREATE TABLE user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Role permissions
CREATE TABLE role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role VARCHAR(32) NOT NULL,
  permission VARCHAR(64) NOT NULL,
  resource VARCHAR(64) NOT NULL,
  action VARCHAR(32) NOT NULL
);
```

#### Permission Matrix
| Role | Contacts | Engineers | Proposals | Contracts | Admin |
|------|----------|-----------|-----------|-----------|-------|
| ADMIN | CRUD | CRUD | CRUD | CRUD | CRUD |
| SALES_MANAGER | CRUD | R | CRUD | CRUD | R |
| SALES_REP | CRUD | R | CRUD | R | - |
| CLIENT_USER | R | R | R | R | - |
| CLIENT_APPROVER | R | R | R | CRUD | - |

### API Security

#### API Authentication
```java
// Spring Security Configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/sales/**").hasAnyRole("SALES_MANAGER", "SALES_REP")
                .requestMatchers("/api/client/**").hasAnyRole("CLIENT_USER", "CLIENT_APPROVER")
                .anyRequest().authenticated()
            )
            .jwt(jwt -> jwt.jwtDecoder(jwtDecoder()))
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));
        return http.build();
    }
}
```

#### API Rate Limiting
```yaml
# Rate limiting configuration
rate-limit:
  requests-per-minute: 100
  burst-capacity: 200
  window-size: 60
  block-duration: 300
```

## Data Security

### Data Encryption

#### Database Encryption
```sql
-- Enable MySQL encryption
ALTER TABLE contacts ENCRYPTION='Y';
ALTER TABLE engineers ENCRYPTION='Y';
ALTER TABLE proposals ENCRYPTION='Y';
ALTER TABLE contracts ENCRYPTION='Y';

-- Encrypt sensitive fields
UPDATE users SET password_hash = AES_ENCRYPT(password_hash, 'encryption_key');
```

#### Application-Level Encryption
```java
// Sensitive data encryption
@Component
public class EncryptionService {
    
    private final String encryptionKey = "your-encryption-key";
    
    public String encrypt(String data) {
        // AES encryption implementation
        return AESUtil.encrypt(data, encryptionKey);
    }
    
    public String decrypt(String encryptedData) {
        // AES decryption implementation
        return AESUtil.decrypt(encryptedData, encryptionKey);
    }
}
```

### Data Classification

#### Data Sensitivity Levels
1. **Public**: Non-sensitive information
2. **Internal**: Business information
3. **Confidential**: Sensitive business data
4. **Restricted**: Highly sensitive data

#### Data Handling Requirements
```yaml
# Data classification matrix
data-classification:
  public:
    - company_name
    - public_skills
    - general_contact_info
  
  internal:
    - internal_notes
    - project_details
    - business_metrics
  
  confidential:
    - personal_contact_info
    - salary_information
    - contract_terms
  
  restricted:
    - passwords
    - authentication_tokens
    - audit_logs
```

### Data Loss Prevention

#### Data Backup Security
```bash
# Encrypt backup files
gpg --symmetric --cipher-algo AES256 /backup/mysql/full_backup.sql

# Secure backup storage
chmod 600 /backup/mysql/full_backup.sql.gpg
chown backup:backup /backup/mysql/full_backup.sql.gpg
```

#### Data Retention Policy
```yaml
# Data retention periods
data-retention:
  user-data: 7-years
  audit-logs: 3-years
  backup-data: 1-year
  temporary-data: 30-days
  session-data: 24-hours
```

## Network Security

### Firewall Configuration

#### UFW Firewall Rules
```bash
# Basic firewall configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow MySQL (internal only)
sudo ufw allow from 192.168.1.0/24 to any port 3306

# Allow application ports (internal only)
sudo ufw allow from 192.168.1.0/24 to any port 8080
sudo ufw allow from 192.168.1.0/24 to any port 3000

# Enable firewall
sudo ufw enable
```

#### iptables Configuration
```bash
# Advanced firewall rules
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -j DROP
```

### SSL/TLS Configuration

#### Nginx SSL Configuration
```nginx
# SSL configuration
server {
    listen 443 ssl http2;
    server_name skillbridge.com;
    
    ssl_certificate /etc/ssl/certs/skillbridge.crt;
    ssl_certificate_key /etc/ssl/private/skillbridge.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

#### SSL Certificate Management
```bash
# Generate SSL certificate
openssl req -x509 -newkey rsa:4096 -keyout skillbridge.key -out skillbridge.crt -days 365 -nodes

# Verify certificate
openssl x509 -in skillbridge.crt -text -noout

# Renew certificate
certbot renew --dry-run
```

## System Security

### OS Hardening

#### System Updates
```bash
# Automated security updates
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
sudo apt autoclean

# Enable automatic security updates
sudo dpkg-reconfigure unattended-upgrades
```

#### User Management
```bash
# Create application user
sudo useradd -r -s /bin/false skillbridge
sudo usermod -L skillbridge

# Set up sudo access
echo "skillbridge ALL=(ALL) NOPASSWD: /bin/systemctl restart skillbridge-backend" >> /etc/sudoers
echo "skillbridge ALL=(ALL) NOPASSWD: /bin/systemctl restart skillbridge-frontend" >> /etc/sudoers
```

#### File Permissions
```bash
# Set secure file permissions
chmod 755 /opt/skillbridge
chmod 644 /opt/skillbridge/backend/application.yml
chmod 600 /opt/skillbridge/backend/application-prod.yml
chmod 755 /opt/skillbridge/backend/target/skillbridge.jar

# Set ownership
chown -R skillbridge:skillbridge /opt/skillbridge
```

### Process Security

#### Service Isolation
```bash
# Create systemd service with security options
[Unit]
Description=SkillBridge Backend Service
After=network.target

[Service]
Type=simple
User=skillbridge
Group=skillbridge
WorkingDirectory=/opt/skillbridge/backend
ExecStart=/usr/bin/java -jar target/skillbridge.jar
Restart=always
RestartSec=10

# Security options
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/skillbridge
ReadWritePaths=/var/log/skillbridge

[Install]
WantedBy=multi-user.target
```

#### Resource Limits
```bash
# Set resource limits
echo "skillbridge soft nofile 65536" >> /etc/security/limits.conf
echo "skillbridge hard nofile 65536" >> /etc/security/limits.conf
echo "skillbridge soft nproc 32768" >> /etc/security/limits.conf
echo "skillbridge hard nproc 32768" >> /etc/security/limits.conf
```

## Application Security

### Input Validation

#### Server-Side Validation
```java
// Input validation example
@RestController
@Validated
public class ContactController {
    
    @PostMapping("/api/contacts")
    public ResponseEntity<Contact> createContact(@Valid @RequestBody ContactDto contactDto) {
        // Validation is handled by @Valid annotation
        Contact contact = contactService.createContact(contactDto);
        return ResponseEntity.ok(contact);
    }
}

// DTO with validation annotations
public class ContactDto {
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;
    
    @Email(message = "Email must be valid")
    private String email;
    
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone must be 10-15 digits")
    private String phone;
}
```

#### SQL Injection Prevention
```java
// Use parameterized queries
@Repository
public class ContactRepository extends JpaRepository<Contact, Integer> {
    
    @Query("SELECT c FROM Contact c WHERE c.status = :status AND c.priority = :priority")
    List<Contact> findByStatusAndPriority(@Param("status") String status, @Param("priority") String priority);
    
    // Avoid string concatenation in queries
    // BAD: String query = "SELECT * FROM contacts WHERE status = '" + status + "'";
    // GOOD: Use @Query with parameters
}
```

### XSS Protection

#### Output Encoding
```java
// XSS protection in Spring Boot
@Configuration
public class SecurityConfig {
    
    @Bean
    public HttpSecurity httpSecurity(HttpSecurity http) throws Exception {
        http
            .headers(headers -> headers
                .frameOptions().deny()
                .contentTypeOptions().and()
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubdomains(true)
                )
            );
        return http;
    }
}
```

#### Frontend XSS Protection
```typescript
// Sanitize user input
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input);
};

// Use in components
const ContactForm = () => {
    const [description, setDescription] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const sanitizedDescription = sanitizeInput(description);
        // Submit sanitized data
    };
};
```

## Security Monitoring

### Security Event Monitoring

#### Authentication Monitoring
```bash
# Monitor failed login attempts
grep "Failed password" /var/log/auth.log | tail -n 20

# Monitor successful logins
grep "Accepted password" /var/log/auth.log | tail -n 20

# Monitor sudo usage
grep "sudo" /var/log/auth.log | tail -n 20
```

#### Application Security Monitoring
```bash
# Monitor application security events
grep -i "security\|authentication\|authorization" /var/log/skillbridge/application.log | tail -n 20

# Monitor database security events
grep -i "access denied\|authentication failed" /var/log/mysql/error.log | tail -n 20
```

### Security Logging

#### Security Event Logging
```java
// Security event logging
@Component
public class SecurityEventLogger {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityEventLogger.class);
    
    public void logAuthenticationSuccess(String username, String ip) {
        logger.info("Authentication success: user={}, ip={}", username, ip);
    }
    
    public void logAuthenticationFailure(String username, String ip, String reason) {
        logger.warn("Authentication failure: user={}, ip={}, reason={}", username, ip, reason);
    }
    
    public void logAuthorizationFailure(String username, String resource, String action) {
        logger.warn("Authorization failure: user={}, resource={}, action={}", username, resource, action);
    }
}
```

#### Database Security Logging
```sql
-- Enable MySQL general log
SET GLOBAL general_log = 'ON';
SET GLOBAL general_log_file = '/var/log/mysql/general.log';

-- Enable MySQL slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
```

## Incident Response

### Security Incident Classification

#### Incident Severity Levels
1. **Critical**: System compromise, data breach
2. **High**: Unauthorized access, service disruption
3. **Medium**: Security policy violation, suspicious activity
4. **Low**: Minor security issues, false positives

#### Incident Response Procedures
```bash
#!/bin/bash
# security_incident_response.sh

# 1. Immediate containment
echo "Containing security incident..."

# Isolate affected systems
sudo systemctl stop skillbridge-backend
sudo systemctl stop skillbridge-frontend

# Block suspicious IPs
sudo ufw deny from $SUSPICIOUS_IP

# 2. Evidence collection
echo "Collecting evidence..."
sudo cp /var/log/skillbridge/application.log /incident/evidence/
sudo cp /var/log/auth.log /incident/evidence/
sudo cp /var/log/mysql/error.log /incident/evidence/

# 3. System analysis
echo "Analyzing system..."
sudo netstat -tlnp > /incident/evidence/network_connections.txt
sudo ps aux > /incident/evidence/running_processes.txt
sudo lsof > /incident/evidence/open_files.txt

# 4. Notification
echo "Notifying security team..."
echo "Security incident detected" | mail -s "URGENT: Security Incident" security@skillbridge.com

echo "Security incident response completed"
```

### Security Incident Documentation

#### Incident Report Template
```markdown
# Security Incident Report

## Incident Details
- **Incident ID**: INC-2024-001
- **Date/Time**: 2024-12-16 14:30:00
- **Severity**: High
- **Status**: Resolved

## Description
Brief description of the security incident.

## Impact Assessment
- **Systems Affected**: List affected systems
- **Data Impact**: Describe data impact
- **User Impact**: Describe user impact
- **Business Impact**: Describe business impact

## Root Cause Analysis
Analysis of the root cause of the incident.

## Response Actions
List of actions taken to respond to the incident.

## Lessons Learned
Key lessons learned from the incident.

## Recommendations
Recommendations to prevent similar incidents.
```

## Security Compliance

### Security Standards

#### OWASP Top 10 Compliance
1. **A01: Broken Access Control**
2. **A02: Cryptographic Failures**
3. **A03: Injection**
4. **A04: Insecure Design**
5. **A05: Security Misconfiguration**
6. **A06: Vulnerable Components**
7. **A07: Authentication Failures**
8. **A08: Software and Data Integrity**
9. **A09: Security Logging Failures**
10. **A10: Server-Side Request Forgery**

#### Security Checklist
```yaml
# Security compliance checklist
security-checklist:
  authentication:
    - Strong password policy
    - JWT token security
    - Session management
    - Multi-factor authentication
  
  authorization:
    - Role-based access control
    - Resource permissions
    - API endpoint protection
    - Data access controls
  
  data-protection:
    - Data encryption at rest
    - Data encryption in transit
    - Sensitive data handling
    - Data retention policies
  
  application-security:
    - Input validation
    - Output encoding
    - SQL injection prevention
    - XSS protection
  
  system-security:
    - OS hardening
    - Network security
    - Service isolation
    - Security monitoring
```

### Security Auditing

#### Security Audit Procedures
```bash
#!/bin/bash
# security_audit.sh

echo "=== Security Audit Report ==="
echo "Date: $(date)"
echo ""

# Check system updates
echo "System Updates:"
sudo apt list --upgradable | grep -i security

# Check user accounts
echo "User Accounts:"
cat /etc/passwd | grep -E "(bash|sh)$"

# Check sudo access
echo "Sudo Access:"
sudo -l

# Check file permissions
echo "File Permissions:"
ls -la /opt/skillbridge/

# Check network services
echo "Network Services:"
sudo netstat -tlnp

# Check firewall status
echo "Firewall Status:"
sudo ufw status

echo "Security audit completed"
```

#### Security Vulnerability Scanning
```bash
#!/bin/bash
# vulnerability_scan.sh

# Scan for open ports
nmap -sS -O localhost

# Check for vulnerable services
nmap --script vuln localhost

# Check SSL/TLS configuration
sslscan localhost:443

# Check for known vulnerabilities
apt list --installed | grep -E "(apache|nginx|mysql|java)"
```

## Security Training

### Security Awareness

#### Security Training Topics
1. **Password Security**: Strong passwords, password managers
2. **Phishing Awareness**: Email security, social engineering
3. **Data Handling**: Sensitive data protection, data classification
4. **Incident Reporting**: Security incident procedures
5. **System Access**: Secure system access, remote work security

#### Security Best Practices
```markdown
# Security Best Practices

## Password Security
- Use strong, unique passwords
- Enable multi-factor authentication
- Use password managers
- Never share passwords

## Email Security
- Be cautious with email attachments
- Verify sender identity
- Don't click suspicious links
- Report phishing attempts

## Data Protection
- Classify data sensitivity
- Encrypt sensitive data
- Secure data transmission
- Proper data disposal

## System Access
- Use secure connections
- Lock workstations
- Report suspicious activity
- Follow access policies
```

### Security Documentation

#### Security Policy Template
```markdown
# Security Policy

## Purpose
This policy establishes security requirements for the SkillBridge platform.

## Scope
This policy applies to all users, systems, and data associated with the SkillBridge platform.

## Responsibilities
- **Users**: Follow security procedures
- **Administrators**: Implement security controls
- **Management**: Ensure security compliance

## Security Requirements
- Strong authentication
- Data encryption
- Access controls
- Security monitoring
- Incident response

## Compliance
- Regular security audits
- Security training
- Policy updates
- Incident reporting
```

## Security Maintenance

### Regular Security Tasks

#### Daily Security Tasks
```bash
#!/bin/bash
# daily_security_tasks.sh

# Check system updates
sudo apt update && sudo apt list --upgradable

# Check security logs
grep -i "failed\|denied\|blocked" /var/log/auth.log | tail -n 10

# Check application security logs
grep -i "security\|authentication\|authorization" /var/log/skillbridge/application.log | tail -n 10

# Check firewall status
sudo ufw status

# Check running processes
ps aux | grep -E "(java|node|mysql|nginx)"
```

#### Weekly Security Tasks
```bash
#!/bin/bash
# weekly_security_tasks.sh

# Security updates
sudo apt update && sudo apt upgrade -y

# Security audit
./security_audit.sh

# Vulnerability scan
./vulnerability_scan.sh

# Security log analysis
./security_log_analysis.sh

# Backup security configuration
tar -czf /backup/security/$(date +%Y%m%d)_security_config.tar.gz /etc/security/
```

#### Monthly Security Tasks
```bash
#!/bin/bash
# monthly_security_tasks.sh

# Comprehensive security audit
./comprehensive_security_audit.sh

# Security training review
./security_training_review.sh

# Security policy review
./security_policy_review.sh

# Security incident review
./security_incident_review.sh
```

### Security Updates

#### Security Patch Management
```bash
#!/bin/bash
# security_patch_management.sh

# Check for security updates
sudo apt update
SECURITY_UPDATES=$(apt list --upgradable | grep -i security | wc -l)

if [ $SECURITY_UPDATES -gt 0 ]; then
    echo "Security updates available: $SECURITY_UPDATES"
    
    # Install security updates
    sudo apt upgrade -y
    
    # Restart services if needed
    sudo systemctl restart skillbridge-backend
    sudo systemctl restart skillbridge-frontend
    sudo systemctl restart nginx
    sudo systemctl restart mysql
    
    echo "Security updates installed and services restarted"
else
    echo "No security updates available"
fi
```

#### Security Configuration Updates
```bash
#!/bin/bash
# security_config_update.sh

# Update security configuration
sudo cp /backup/security/latest_security_config/* /etc/security/

# Update firewall rules
sudo ufw reload

# Update SSL certificates
sudo certbot renew

# Restart security services
sudo systemctl restart fail2ban
sudo systemctl restart ufw

echo "Security configuration updated"
```
