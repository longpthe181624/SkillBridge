# Appendices

## Technology Decision Matrix

| Technology | Category | Justification | Alternatives |
|------------|----------|---------------|--------------|
| Java/Spring Boot | Backend | Mature framework, good for learning | Node.js, Python Flask |
| Next.js/React | Frontend | Modern React framework, good DX | Vue.js, Angular |
| MySQL | Database | Relational database, easy to learn | PostgreSQL, SQLite |
| TypeScript | Language | Type safety, better development experience | JavaScript |
| Tailwind CSS | Styling | Utility-first, rapid development | Bootstrap, Material-UI |

## Database Schema Summary

### Core Tables
```sql
-- Organizations & Users
users (id, email, company_name, full_name, role, is_active, created_at, updated_at)

-- Master Data & Engineers
engineers (id, full_name, years_experience, seniority, summary, location, language_summary, status)
skills (id, name, parent_skill_id) -- hierarchical taxonomy
certifications (id, name, issuer)
languages (code, name)
engineer_skills (engineer_id, skill_id, level, years)
engineer_certs (engineer_id, cert_id, acquired_date, expires_at)
engineer_langs (engineer_id, lang_code, proficiency)

-- CRM & Sales Pipeline
contacts (id, client_user_id, assignee_user_id, reviewer_id, title, description, status, request_type, priority, internal_note, online_mtg_link, online_mtg_date, communication_progress, created_by)
contact_communication_logs (id, contact_id, log_content, created_at, created_by)
contact_status_history (id, contact_id, from_status, to_status, changed_by, changed_at)
opportunities (id, contact_id, owner_user_id, status, expected_close, estimated_value, probability)

-- Proposals & Reviews
proposals (id, opportunity_id, title, status, attachments_manifest, created_by)
proposal_reviews (id, proposal_id, role_required, assignee_user_id, decision, comment, reviewed_at)
notification_events (id, purpose, channel, recipient_user_id, entity_type, entity_id, created_at)

-- Contracts (MSA & SOW)
msas (id, customer_id, status, effective_date, end_date, currency, payment_terms, invoicing_cycle, fx_rule, ip_ownership, tax_clause, governing_law, sla_ref)
sows (id, msa_id, engagement_type, status, period_start, period_end, billing_model, rate_card_ref, overtime_rule, cost_cap, scope_summary, deliverables)
change_requests (id, sow_id, client_id, title, description, impact_hours, impact_cost, impact_schedule_days, status)
amendments (id, cr_id, sow_id, version_no, effective_date, before_diff, after_diff)
project_close_requests (id, sow_id, reason, requested_at, status)

-- Documents & Audit
documents (id, storage_uri, file_name, mime_type, uploaded_by, uploaded_at, checksum)
document_links (document_id, entity_type, entity_id, note)
audit_logs (id, entity_type, entity_id, action, changed_by, changed_at, diff_json)
```

### Relationships
- Users → Contacts (client_user_id, assignee_user_id, reviewer_id)
- Users → Opportunities (owner_user_id)
- Contacts → Opportunities (1:1 relationship)
- Opportunities → Proposals (1:many)
- Users → MSAs (customer_id)
- MSAs → SOWs (1:many)
- SOWs → Change Requests (1:many)
- SOWs → Project Close Requests (1:many)
- Change Requests → Amendments (1:1)
- Engineers ↔ Skills (many-to-many via engineer_skills)
- Engineers ↔ Certifications (many-to-many via engineer_certs)
- Engineers ↔ Languages (many-to-many via engineer_langs)
- Documents ↔ Entities (many-to-many via document_links)
- Skills → Skills (self-referencing for taxonomy)

## API Endpoints Summary

### Contact Management
```
GET    /api/contacts                    - Get all contacts
GET    /api/contacts/{id}              - Get contact by ID
POST   /api/contacts                   - Create new contact
PUT    /api/contacts/{id}              - Update contact
DELETE /api/contacts/{id}              - Delete contact
GET    /api/contacts/{id}/logs         - Get contact communication logs
POST   /api/contacts/{id}/logs         - Add communication log
GET    /api/contacts/{id}/status-history - Get contact status history
PUT    /api/contacts/{id}/status       - Update contact status
```

### Opportunity Management
```
GET    /api/opportunities              - Get all opportunities
GET    /api/opportunities/{id}         - Get opportunity by ID
POST   /api/opportunities              - Create new opportunity
PUT    /api/opportunities/{id}         - Update opportunity
DELETE /api/opportunities/{id}         - Delete opportunity
GET    /api/opportunities/pipeline     - Get sales pipeline
GET    /api/opportunities/{id}/proposals - Get opportunity proposals
```

### Proposal Management
```
GET    /api/proposals                  - Get all proposals
GET    /api/proposals/{id}             - Get proposal by ID
POST   /api/proposals                  - Create new proposal
PUT    /api/proposals/{id}             - Update proposal
DELETE /api/proposals/{id}             - Delete proposal
GET    /api/proposals/{id}/reviews     - Get proposal reviews
POST   /api/proposals/{id}/reviews     - Create proposal review
PUT    /api/proposals/{id}/status      - Update proposal status
```

### Engineer Management
```
GET    /api/engineers                   - Get all engineers
GET    /api/engineers/{id}             - Get engineer by ID
POST   /api/engineers                  - Create new engineer
PUT    /api/engineers/{id}             - Update engineer
DELETE /api/engineers/{id}             - Delete engineer
GET    /api/engineers/search           - Search engineers
GET    /api/engineers/{id}/skills      - Get engineer skills
POST   /api/engineers/{id}/skills      - Add skill to engineer
GET    /api/engineers/{id}/certifications - Get engineer certifications
POST   /api/engineers/{id}/certifications - Add certification to engineer
GET    /api/engineers/{id}/languages   - Get engineer languages
POST   /api/engineers/{id}/languages   - Add language to engineer
```

### Skills & Certifications
```
GET    /api/skills                      - Get all skills
GET    /api/skills/{id}                 - Get skill by ID
POST   /api/skills                      - Create new skill
PUT    /api/skills/{id}                 - Update skill
DELETE /api/skills/{id}                 - Delete skill
GET    /api/skills/taxonomy             - Get skill taxonomy tree

GET    /api/certifications              - Get all certifications
GET    /api/certifications/{id}         - Get certification by ID
POST   /api/certifications              - Create new certification
PUT    /api/certifications/{id}         - Update certification
DELETE /api/certifications/{id}         - Delete certification

GET    /api/languages                   - Get all languages
GET    /api/languages/{code}            - Get language by code
```

### Contract Management (MSA & SOW)
```
GET    /api/msas                        - Get all MSAs
GET    /api/msas/{id}                   - Get MSA by ID
POST   /api/msas                        - Create new MSA
PUT    /api/msas/{id}                   - Update MSA
DELETE /api/msas/{id}                   - Delete MSA
GET    /api/msas/{id}/sows              - Get MSA SOWs

GET    /api/sows                        - Get all SOWs
GET    /api/sows/{id}                   - Get SOW by ID
POST   /api/sows                        - Create new SOW
PUT    /api/sows/{id}                   - Update SOW
DELETE /api/sows/{id}                   - Delete SOW
GET    /api/sows/{id}/change-requests   - Get SOW change requests
POST   /api/sows/{id}/change-requests   - Create change request
GET    /api/sows/{id}/close-requests    - Get SOW close requests
POST   /api/sows/{id}/close-requests    - Create close request
```

### Change Request Management
```
GET    /api/change-requests             - Get all change requests
GET    /api/change-requests/{id}        - Get change request by ID
POST   /api/change-requests             - Create new change request
PUT    /api/change-requests/{id}        - Update change request
DELETE /api/change-requests/{id}         - Delete change request
GET    /api/change-requests/{id}/amendments - Get change request amendments
POST   /api/change-requests/{id}/amendments - Create amendment
```

### Document Management
```
GET    /api/documents                   - Get all documents
GET    /api/documents/{id}             - Get document by ID
POST   /api/documents                   - Upload new document
PUT    /api/documents/{id}             - Update document
DELETE /api/documents/{id}             - Delete document
GET    /api/documents/{id}/links        - Get document links
POST   /api/documents/{id}/links        - Create document link
```

### Notification Management
```
GET    /api/notifications               - Get user notifications
GET    /api/notifications/{id}          - Get notification by ID
POST   /api/notifications               - Create notification
PUT    /api/notifications/{id}/read     - Mark notification as read
DELETE /api/notifications/{id}          - Delete notification
GET    /api/notifications/unread        - Get unread notifications
```

### Audit & Reporting
```
GET    /api/audit-logs                  - Get audit logs
GET    /api/audit-logs/{entity_type}   - Get audit logs by entity type
GET    /api/audit-logs/{entity_type}/{entity_id} - Get audit logs for specific entity
GET    /api/reports/pipeline            - Get sales pipeline report
GET    /api/reports/engineers           - Get engineer utilization report
GET    /api/reports/contracts           - Get contract status report
```

## Development Setup Guide

### Prerequisites
```bash
# Required software
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Git
- IDE (VS Code or IntelliJ IDEA)
```

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd skillbridge-backend

# Install dependencies
mvn clean install

# Configure database
# Update application.yml with database connection

# Run application
mvn spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd skillbridge-frontend

# Install dependencies
npm install

# Configure environment
# Update .env.local with API URL

# Run development server
npm run dev
```

### Database Setup
```sql
-- Create database
CREATE DATABASE skillbridge;

-- Run schema script
source schema.sql;

-- Insert sample data
source sample-data.sql;
```
