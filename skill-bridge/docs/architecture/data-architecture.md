# Data Architecture

## Database Design

### Primary Database (MySQL)
**Purpose**: Transactional data and ACID compliance

**Complete Database Schema**:
```sql
-- Enums for standardized values
CREATE TYPE contact_status AS ENUM (
  'New', 'InProgress', 'CustomerVerified', 
  'ConvertedToOpportunity', 'NoResponse', 'Closed'
);

CREATE TYPE opportunity_status AS ENUM (
  'Open', 'ProposalInProgress', 'Won', 'Lost'
);

CREATE TYPE proposal_stage AS ENUM (
  'Draft', 'SalesMgrReview', 'LegalReview', 
  'TechnicalReview', 'Approved', 'SentToClient'
);

CREATE TYPE decision_type AS ENUM (
  'Pending', 'Approve', 'ChangesRequested', 'Reject'
);

CREATE TYPE contract_status AS ENUM (
  'Draft', 'InternalReview', 'SentToClient', 'ClientReview',
  'Active', 'Completed', 'Terminated', 'Expired'
);

CREATE TYPE engagement_type AS ENUM (
  'FixedPrice', 'Retainer'
);

CREATE TYPE cr_status AS ENUM (
  'Draft', 'InternalReview', 'SentToClient', 
  'UnderReview', 'Approved', 'Rejected'
);

CREATE TYPE close_request_status AS ENUM (
  'Pending', 'ClientApproved', 'Rejected'
);

-- Organizations & Users
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

-- Master Data & Engineers
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
  FOREIGN KEY (skill_id) REFERENCES skills(id),
  INDEX idx_skill_id (skill_id)
);

CREATE TABLE engineer_certs (
  engineer_id INT NOT NULL,
  cert_id INT NOT NULL,
  acquired_date DATE,
  expires_at DATE,
  PRIMARY KEY (engineer_id, cert_id),
  FOREIGN KEY (engineer_id) REFERENCES engineers(id),
  FOREIGN KEY (cert_id) REFERENCES certifications(id),
  INDEX idx_cert_id (cert_id)
);

CREATE TABLE engineer_langs (
  engineer_id INT NOT NULL,
  lang_code VARCHAR(16) NOT NULL,
  proficiency VARCHAR(32), -- JLPT N1..N5 / CEFR A1..C2
  PRIMARY KEY (engineer_id, lang_code),
  FOREIGN KEY (engineer_id) REFERENCES engineers(id),
  FOREIGN KEY (lang_code) REFERENCES languages(code),
  INDEX idx_lang_code (lang_code)
);

-- CRM – Contacts & Opportunity
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_user_id) REFERENCES users(id),
  FOREIGN KEY (assignee_user_id) REFERENCES users(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE contact_communication_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contact_id INT NOT NULL,
  log_content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE contact_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contact_id INT NOT NULL,
  from_status contact_status,
  to_status contact_status,
  changed_by INT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (changed_by) REFERENCES users(id),
  INDEX idx_contact_id (contact_id)
);

CREATE TABLE opportunities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contact_id INT UNIQUE,
  owner_user_id INT,
  status opportunity_status,
  expected_close DATE,
  estimated_value DECIMAL(16,2),
  probability INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

-- Proposals
CREATE TABLE proposals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  opportunity_id INT NOT NULL,
  title VARCHAR(255),
  status proposal_stage,
  attachments_manifest TEXT,
  version varchar(50),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_opportunity_id (opportunity_id)
);

CREATE TABLE proposal_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  proposal_id INT NOT NULL,
  role_required VARCHAR(32), -- SalesManager |
  assignee_user_id INT,
  decision decision_type,
  comment TEXT,
  reviewed_at TIMESTAMP,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id),
  FOREIGN KEY (assignee_user_id) REFERENCES users(id)
);

CREATE TABLE notification_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  purpose VARCHAR(64), -- proposal_for_review | approval_reminder | contract_update | cr_deadline
  channel VARCHAR(16), -- in-app | email
  recipient_user_id INT,
  entity_type VARCHAR(64), -- Proposal | MSA | SOW | ChangeRequest | ProjectClose
  entity_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipient_user_id) REFERENCES users(id),
  INDEX idx_recipient_user_id (recipient_user_id),
  INDEX idx_entity (entity_type, entity_id)
);

-- Contracts – LandBridge ↔ Client only (no engineer links)
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
  governing_law VARCHAR(64),s
  sla_ref VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id)
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (msa_id) REFERENCES msas(id),
  INDEX idx_msa_id (msa_id)
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_id) REFERENCES sows(id),
  FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE amendments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cr_id INT NOT NULL UNIQUE,
  sow_id INT NOT NULL,
  version_no INT,
  effective_date DATE,
  before_diff TEXT,
  after_diff TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cr_id) REFERENCES change_requests(id),
  FOREIGN KEY (sow_id) REFERENCES sows(id),
  INDEX idx_sow_id (sow_id)
);

CREATE TABLE project_close_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_id INT NOT NULL,
  reason TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status close_request_status,
  FOREIGN KEY (sow_id) REFERENCES sows(id),
  INDEX idx_sow_id (sow_id),
  INDEX idx_status (status)
);

-- Documents & Audit
CREATE TABLE documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  storage_uri TEXT,
  file_name VARCHAR(255),
  mime_type VARCHAR(64),
  uploaded_by INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  checksum VARCHAR(128),
  FOREIGN KEY (uploaded_by) REFERENCES users(id),
  INDEX idx_uploaded_by (uploaded_by)
);

CREATE TABLE document_links (
  document_id INT NOT NULL,
  entity_type VARCHAR(64), -- ProposalVersion | MSA | SOW | ChangeRequest | Amendment
  entity_id INT,
  note VARCHAR(255),
  PRIMARY KEY (document_id, entity_type, entity_id),
  FOREIGN KEY (document_id) REFERENCES documents(id),
  INDEX idx_entity (entity_type, entity_id)
);

CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  entity_type VARCHAR(64),
  entity_id INT,
  action VARCHAR(64), -- create | update | status_change | send_for_review
  changed_by INT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diff_json TEXT,
  FOREIGN KEY (changed_by) REFERENCES users(id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_changed_by (changed_by)
);
```

### Database Indexes
**Purpose**: Optimize query performance

**Key Indexes**:
```sql
-- Performance indexes for new schema
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_assignee ON contacts(assignee_user_id);
CREATE INDEX idx_contacts_client ON contacts(client_user_id);
CREATE INDEX idx_engineers_status ON engineers(status);
CREATE INDEX idx_engineers_seniority ON engineers(seniority);
CREATE INDEX idx_engineer_skills_engineer ON engineer_skills(engineer_id);
CREATE INDEX idx_engineer_skills_skill ON engineer_skills(skill_id);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_owner ON opportunities(owner_user_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_opportunity ON proposals(opportunity_id);
CREATE INDEX idx_msas_status ON msas(status);
CREATE INDEX idx_sows_status ON sows(status);
CREATE INDEX idx_change_requests_status ON change_requests(status);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_notification_events_recipient ON notification_events(recipient_user_id);
```

### Database Views
**Purpose**: Simplify complex queries

**Engineer Search View**:
```sql
-- Enhanced engineer search view with skills, certifications, and languages
CREATE VIEW engineer_search_view AS
SELECT 
  e.id,
  e.full_name,
  e.years_experience,
  e.seniority,
  e.location,
  e.status,
  e.language_summary,
  GROUP_CONCAT(DISTINCT s.name) as skills,
  GROUP_CONCAT(DISTINCT c.name) as certifications,
  GROUP_CONCAT(DISTINCT l.name) as languages,
  AVG(es.level) as avg_skill_level,
  COUNT(DISTINCT es.skill_id) as skill_count,
  COUNT(DISTINCT ec.cert_id) as cert_count
FROM engineers e
LEFT JOIN engineer_skills es ON e.id = es.engineer_id
LEFT JOIN skills s ON es.skill_id = s.id
LEFT JOIN engineer_certs ec ON e.id = ec.engineer_id
LEFT JOIN certifications c ON ec.cert_id = c.id
LEFT JOIN engineer_langs el ON e.id = el.engineer_id
LEFT JOIN languages l ON el.lang_code = l.code
GROUP BY e.id, e.full_name, e.years_experience, e.seniority, e.location, e.status, e.language_summary;
```

**Contact Pipeline View**:
```sql
-- Contact pipeline view with opportunity information
CREATE VIEW contact_pipeline_view AS
SELECT 
  c.id,
  c.title,
  c.status as contact_status,
  c.priority,
  c.request_type,
  c.created_at,
  u.full_name as client_name,
  u.company_name,
  o.status as opportunity_status,
  o.estimated_value,
  o.probability,
  o.expected_close
FROM contacts c
LEFT JOIN users u ON c.client_user_id = u.id
LEFT JOIN opportunities o ON c.id = o.contact_id;
```

**Contract Summary View**:
```sql
-- Contract summary view with MSA and SOW information
CREATE VIEW contract_summary_view AS
SELECT 
  m.id as msa_id,
  m.customer_id,
  m.status as msa_status,
  m.effective_date as msa_effective_date,
  m.end_date as msa_end_date,
  s.id as sow_id,
  s.engagement_type,
  s.status as sow_status,
  s.period_start,
  s.period_end,
  s.cost_cap,
  COUNT(cr.id) as change_request_count,
  COUNT(pcr.id) as close_request_count
FROM msas m
LEFT JOIN sows s ON m.id = s.msa_id
LEFT JOIN change_requests cr ON s.id = cr.sow_id
LEFT JOIN project_close_requests pcr ON s.id = pcr.sow_id
GROUP BY m.id, m.customer_id, m.status, m.effective_date, m.end_date, 
         s.id, s.engagement_type, s.status, s.period_start, s.period_end, s.cost_cap;
```

## Data Flow Architecture

### Simple Data Flow
```mermaid
graph LR
    A[Frontend] --> B[Backend API]
    B --> C[Data Validation]
    C --> D[Business Logic]
    D --> E[Database]
    E --> F[Audit Log]
```

### CRUD Operations
- **Create**: Insert new records with validation
- **Read**: Query data with proper indexing
- **Update**: Update records with audit logging
- **Delete**: Soft delete with audit trail

## Data Management

### Data Validation
- **Input Validation**: Bean validation annotations
- **Business Rules**: Service layer validation
- **Database Constraints**: Foreign key and unique constraints
- **Data Types**: Appropriate MySQL data types

### Data Relationships
- **One-to-Many**: 
  - Users → Contacts (client_user_id, assignee_user_id, reviewer_id)
  - Users → Opportunities (owner_user_id)
  - Contacts → Opportunities (1:1 relationship)
  - Opportunities → Proposals (1:many)
  - Users → MSAs (customer_id)
  - MSAs → SOWs (1:many)
  - SOWs → Change Requests (1:many)
  - SOWs → Project Close Requests (1:many)
  - Change Requests → Amendments (1:1)
- **Many-to-Many**: 
  - Engineers ↔ Skills (engineer_skills)
  - Engineers ↔ Certifications (engineer_certs)
  - Engineers ↔ Languages (engineer_langs)
  - Documents ↔ Entities (document_links)
- **Self-Referencing**: Skills → Skills (parent_skill_id for taxonomy)
- **Foreign Keys**: Proper referential integrity with appropriate constraints
- **Cascading**: Appropriate cascade operations for dependent records

### Basic Security
- **Password Hashing**: BCrypt password encoding
- **Input Sanitization**: SQL injection prevention
- **Access Control**: Role-based permissions
- **Audit Trail**: Complete change tracking
