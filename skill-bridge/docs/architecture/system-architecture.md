# System Architecture

## Application Modules

### Contact Management Module
**Purpose**: Manages the complete contact lifecycle from initial inquiry to opportunity conversion

**Responsibilities**:
- Contact creation and management
- Pipeline stage management with status tracking
- Communication logging and progress tracking
- Contact qualification and scoring
- Opportunity conversion
- Status history tracking

**Key Components**:
- ContactController (REST API)
- ContactService (Business Logic)
- ContactRepository (Data Access)
- Contact Entity (JPA Entity)
- ContactStatusHistoryService
- ContactCommunicationService

**Data Model**:
```sql
CREATE TABLE contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_user_id INT, -- optional if guest
  assignee_user_id INT, -- optional if guest
  reviewer_id INT,
  title VARCHAR(255),
  description TEXT,
  status contact_status,
  request_type VARCHAR(32), -- Project | Hiring | Consultation
  priority VARCHAR(32),
  internal_note TEXT,
  online_mtg_link VARCHAR(255),
  online_mtg_date TIMESTAMP,
  communication_progress VARCHAR(32), -- AutoReply | MTGSent | NoResponse
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE contact_communication_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contact_id INT NOT NULL,
  log_content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT
);

CREATE TABLE contact_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contact_id INT NOT NULL,
  from_status contact_status,
  to_status contact_status,
  changed_by INT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Opportunity Management Module
**Purpose**: Manages opportunities converted from contacts with sales pipeline tracking

**Responsibilities**:
- Opportunity creation from contacts
- Sales pipeline management
- Value and probability tracking
- Expected close date management
- Owner assignment and tracking

**Key Components**:
- OpportunityController (REST API)
- OpportunityService (Business Logic)
- OpportunityRepository (Data Access)
- Opportunity Entity (JPA Entity)

**Data Model**:
```sql
CREATE TABLE opportunities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contact_id INT UNIQUE,
  owner_user_id INT,
  status opportunity_status,
  expected_close DATE,
  estimated_value DECIMAL(16,2),
  probability INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Proposal Management Module
**Purpose**: Handles proposal creation, review, and approval workflows

**Responsibilities**:
- Proposal creation from opportunities
- Multi-stage review workflow (Sales, Legal, Technical)
- Review assignment and tracking
- Decision tracking and comments
- Attachment management

**Key Components**:
- ProposalController (REST API)
- ProposalService (Business Logic)
- ProposalRepository (Data Access)
- Proposal Entity (JPA Entity)
- ProposalReviewService
- NotificationService

**Data Model**:
```sql
CREATE TABLE proposals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  opportunity_id INT NOT NULL,
  title VARCHAR(255),
  status proposal_stage,
  attachments_manifest TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE proposal_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  proposal_id INT NOT NULL,
  role_required VARCHAR(32), -- SalesManager | Legal | Technical
  assignee_user_id INT,
  decision decision_type,
  comment TEXT,
  reviewed_at TIMESTAMP
);
```

### Contract Management Module
**Purpose**: Comprehensive contract lifecycle management including MSA, SOW, and change requests

**Responsibilities**:
- MSA (Master Service Agreement) creation and management
- SOW (Statement of Work) creation under MSA
- Change request processing with impact analysis
- Amendment generation and version control
- Project close request management
- Contract approval workflows

**Key Components**:
- MsaController (REST API)
- SowController (REST API)
- ChangeRequestController (REST API)
- MsaService, SowService, ChangeRequestService (Business Logic)
- MsaRepository, SowRepository, ChangeRequestRepository (Data Access)
- Msa Entity, Sow Entity, ChangeRequest Entity (JPA Entities)
- AmendmentService
- ProjectCloseService

**Data Model**:
```sql
CREATE TABLE msas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  status contract_status,
  effective_date DATE,
  end_date DATE,
  currency VARCHAR(16),
  payment_terms VARCHAR(128),
  invoicing_cycle VARCHAR(64),
  fx_rule VARCHAR(64),
  ip_ownership VARCHAR(128),
  tax_clause VARCHAR(128),
  governing_law VARCHAR(64),
  sla_ref VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  msa_id INT NOT NULL,
  engagement_type engagement_type,
  status contract_status,
  period_start DATE,
  period_end DATE,
  billing_model VARCHAR(64),
  rate_card_ref VARCHAR(128),
  overtime_rule VARCHAR(128),
  cost_cap DECIMAL(16,2),
  scope_summary TEXT,
  deliverables TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE change_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_id INT NOT NULL,
  client_id INT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  impact_hours DECIMAL(10,2),
  impact_cost DECIMAL(16,2),
  impact_schedule_days INT,
  status cr_status,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE amendments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cr_id INT NOT NULL UNIQUE,
  sow_id INT NOT NULL,
  version_no INT,
  effective_date DATE,
  before_diff TEXT,
  after_diff TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_close_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_id INT NOT NULL,
  reason TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status close_request_status
);
```

### Engineer Management Module
**Purpose**: Manages engineer profiles, skills, certifications, and languages

**Responsibilities**:
- Engineer profile management with comprehensive information
- Hierarchical skill taxonomy management
- Certification tracking with expiration dates
- Language proficiency management (JLPT/CEFR)
- Engineer status and verification
- Skill matching and search optimization

**Key Components**:
- EngineerController (REST API)
- SkillController (REST API)
- CertificationController (REST API)
- LanguageController (REST API)
- EngineerService, SkillService, CertificationService, LanguageService (Business Logic)
- EngineerRepository, SkillRepository, CertificationRepository, LanguageRepository (Data Access)
- Engineer Entity, Skill Entity, Certification Entity, Language Entity (JPA Entities)
- EngineerSkillService, EngineerCertService, EngineerLangService

**Data Model**:
```sql
CREATE TABLE engineers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  years_experience INT,
  seniority VARCHAR(32), -- Jr | Mid | Sr | Lead
  summary TEXT,
  location VARCHAR(128),
  language_summary VARCHAR(64), -- JLPT/CEFR summary
  status VARCHAR(32), -- PendingReview | Verified | Rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128) UNIQUE NOT NULL,
  parent_skill_id INT, -- taxonomy tree (nullable)
  FOREIGN KEY (parent_skill_id) REFERENCES skills(id)
);

CREATE TABLE certifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128) NOT NULL,
  issuer VARCHAR(128) NOT NULL
);

CREATE TABLE languages (
  code VARCHAR(16) PRIMARY KEY,
  name VARCHAR(64) NOT NULL
);

CREATE TABLE engineer_skills (
  engineer_id INT NOT NULL,
  skill_id INT NOT NULL,
  level VARCHAR(32), -- Beginner | Intermediate | Advanced
  years INT,
  PRIMARY KEY (engineer_id, skill_id),
  FOREIGN KEY (engineer_id) REFERENCES engineers(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE engineer_certs (
  engineer_id INT NOT NULL,
  cert_id INT NOT NULL,
  acquired_date DATE,
  expires_at DATE,
  PRIMARY KEY (engineer_id, cert_id),
  FOREIGN KEY (engineer_id) REFERENCES engineers(id),
  FOREIGN KEY (cert_id) REFERENCES certifications(id)
);

CREATE TABLE engineer_langs (
  engineer_id INT NOT NULL,
  lang_code VARCHAR(16) NOT NULL,
  proficiency VARCHAR(32), -- JLPT N1..N5 / CEFR A1..C2
  PRIMARY KEY (engineer_id, lang_code),
  FOREIGN KEY (engineer_id) REFERENCES engineers(id),
  FOREIGN KEY (lang_code) REFERENCES languages(code)
);
```

### Search & Matching Module
**Purpose**: Basic search capabilities and engineer matching

**Responsibilities**:
- Multi-criteria search
- Basic matching algorithms
- Search results ranking
- Search history
- Performance optimization

**Key Components**:
- SearchController (REST API)
- SearchService (Business Logic)
- SearchRepository (Data Access)
- Search Entity (JPA Entity)

**Search Implementation**:
```sql
-- Search view for optimized queries
CREATE VIEW engineer_search_view AS
SELECT 
  e.id,
  e.name,
  e.email,
  e.location,
  e.status,
  GROUP_CONCAT(s.name) as skills,
  AVG(es.proficiency_level) as avg_proficiency,
  COUNT(es.skill_id) as skill_count
FROM engineers e
LEFT JOIN engineer_skills es ON e.id = es.engineer_id
LEFT JOIN skills s ON es.skill_id = s.id
GROUP BY e.id, e.name, e.email, e.location, e.status;
```

## Support Modules

### User Management Module
**Purpose**: Handles user authentication and authorization

**Responsibilities**:
- User registration and login
- Role-based access control
- Password management
- Session management
- User profile management
- Company information management

**Key Components**:
- UserController (REST API)
- UserService (Business Logic)
- UserRepository (Data Access)
- User Entity (JPA Entity)

**Data Model**:
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  company_name VARCHAR(255),
  full_name VARCHAR(255),
  role VARCHAR(32), -- convenience (primary role)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Notification Management Module
**Purpose**: Handles system notifications and event management

**Responsibilities**:
- Notification event creation
- Multi-channel notification delivery (in-app, email)
- Notification tracking and status
- Event-based notification triggers
- Notification history and analytics

**Key Components**:
- NotificationController (REST API)
- NotificationService (Business Logic)
- NotificationRepository (Data Access)
- Notification Entity (JPA Entity)
- EmailService
- InAppNotificationService

**Data Model**:
```sql
CREATE TABLE notification_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  purpose VARCHAR(64), -- proposal_for_review | approval_reminder | contract_update | cr_deadline
  channel VARCHAR(16), -- in-app | email
  recipient_user_id INT,
  entity_type VARCHAR(64), -- Proposal | MSA | SOW | ChangeRequest | ProjectClose
  entity_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Document Management Module
**Purpose**: Handles document storage, linking, and management

**Responsibilities**:
- Document upload and storage
- Document linking to entities
- File metadata management
- Document version control
- Secure document access

**Key Components**:
- DocumentController (REST API)
- DocumentService (Business Logic)
- DocumentRepository (Data Access)
- Document Entity (JPA Entity)
- DocumentLinkService
- FileStorageService

**Data Model**:
```sql
CREATE TABLE documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  storage_uri TEXT,
  file_name VARCHAR(255),
  mime_type VARCHAR(64),
  uploaded_by INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  checksum VARCHAR(128)
);

CREATE TABLE document_links (
  document_id INT NOT NULL,
  entity_type VARCHAR(64), -- ProposalVersion | MSA | SOW | ChangeRequest | Amendment
  entity_id INT,
  note VARCHAR(255),
  PRIMARY KEY (document_id, entity_type, entity_id)
);
```

### Audit Log Module
**Purpose**: Comprehensive audit trail and change tracking

**Responsibilities**:
- Entity change tracking
- Action logging with detailed context
- Change diff storage (JSON format)
- Audit trail reporting
- Data retention and compliance

**Key Components**:
- AuditController (REST API)
- AuditService (Business Logic)
- AuditRepository (Data Access)
- AuditLog Entity (JPA Entity)
- AuditInterceptor (AOP)
- AuditReportService

**Data Model**:
```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  entity_type VARCHAR(64),
  entity_id INT,
  action VARCHAR(64), -- create | update | status_change | send_for_review
  changed_by INT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diff_json TEXT,
  FOREIGN KEY (changed_by) REFERENCES users(id)
);
```
