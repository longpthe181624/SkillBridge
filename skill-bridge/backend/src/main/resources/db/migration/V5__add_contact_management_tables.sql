-- V5__add_contact_management_tables.sql
-- Add tables for contact management feature (Story-04)
-- Creates users table, updates contacts table, and adds supporting tables

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255),
    full_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(32) DEFAULT 'CLIENT',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

-- Update Contacts Table to match entity
-- Check and add columns safely
SET @dbname = DATABASE();
SET @col_exists = 0;

-- Check if assignee_user_id column exists
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'assignee_user_id';

-- Only add columns if they don't exist
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts
    ADD COLUMN assignee_user_id INT,
    ADD COLUMN reviewer_id INT,
    ADD COLUMN title VARCHAR(255),
    ADD COLUMN description TEXT,
    ADD COLUMN request_type VARCHAR(32),
    ADD COLUMN priority VARCHAR(32) DEFAULT ''Medium'',
    ADD COLUMN internal_note TEXT,
    ADD COLUMN online_mtg_link VARCHAR(255),
    ADD COLUMN online_mtg_date TIMESTAMP NULL,
    ADD COLUMN communication_progress VARCHAR(32) DEFAULT ''AutoReply'',
    ADD COLUMN created_by INT,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update contacts status default to 'New'
ALTER TABLE contacts MODIFY COLUMN status VARCHAR(32) DEFAULT 'New';

-- Create Contact Status History Table
CREATE TABLE IF NOT EXISTS contact_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    from_status VARCHAR(32),
    to_status VARCHAR(32),
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    INDEX idx_contact_status_history_contact_id (contact_id),
    INDEX idx_contact_status_history_changed_at (changed_at)
);

-- Create Contact Communication Logs Table
CREATE TABLE IF NOT EXISTS contact_communication_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    log_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    INDEX idx_contact_communication_logs_contact_id (contact_id)
);

-- Create Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255),
    body TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email_templates_template_name (template_name),
    INDEX idx_email_templates_is_active (is_active)
);

-- Clean up orphaned contacts (if any) before adding foreign keys
-- Delete contacts with invalid client_user_id references
DELETE FROM contacts 
WHERE client_user_id IS NOT NULL 
AND client_user_id NOT IN (SELECT id FROM users);

-- Set NULL for foreign key columns that don't have valid references
UPDATE contacts 
SET assignee_user_id = NULL 
WHERE assignee_user_id IS NOT NULL 
AND assignee_user_id NOT IN (SELECT id FROM users);

UPDATE contacts 
SET reviewer_id = NULL 
WHERE reviewer_id IS NOT NULL 
AND reviewer_id NOT IN (SELECT id FROM users);

UPDATE contacts 
SET created_by = NULL 
WHERE created_by IS NOT NULL 
AND created_by NOT IN (SELECT id FROM users);

-- Add Foreign Keys to contacts table (only if they don't exist)
SET @fk_exists = 0;
SELECT COUNT(*) INTO @fk_exists
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = @dbname
AND TABLE_NAME = 'contacts'
AND CONSTRAINT_NAME = 'fk_contacts_client_user_id';

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE contacts
    ADD CONSTRAINT fk_contacts_client_user_id FOREIGN KEY (client_user_id) REFERENCES users(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_contacts_assignee_user_id FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_contacts_reviewer_id FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_contacts_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL',
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add Foreign Keys to contact_status_history
SET @fk_exists = 0;
SELECT COUNT(*) INTO @fk_exists
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = @dbname
AND TABLE_NAME = 'contact_status_history'
AND CONSTRAINT_NAME = 'fk_contact_status_history_changed_by';

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE contact_status_history
    ADD CONSTRAINT fk_contact_status_history_changed_by FOREIGN KEY (changed_by) REFERENCES users(id)',
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add Foreign Keys to contact_communication_logs
SET @fk_exists = 0;
SELECT COUNT(*) INTO @fk_exists
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = @dbname
AND TABLE_NAME = 'contact_communication_logs'
AND CONSTRAINT_NAME = 'fk_contact_communication_logs_created_by';

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE contact_communication_logs
    ADD CONSTRAINT fk_contact_communication_logs_created_by FOREIGN KEY (created_by) REFERENCES users(id)',
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Insert Email Templates (with ON DUPLICATE KEY UPDATE to avoid errors on re-run)
INSERT INTO email_templates (template_name, subject, body) VALUES
('contact_confirmation', 'Thank you for contacting SkillBridge', 
'Dear {name},

Thank you for contacting SkillBridge. We have received your request regarding "{title}" and will get back to you within 24 hours.

Your request details:
Title: {title}
Company: {company_name}

Best regards,
SkillBridge Team'),
('sales_notification', 'New Contact Request - {company_name}', 
'New contact request received:

Name: {name}
Company: {company_name}
Email: {email}
Phone: {phone}
Title: {title}
Message: {message}

Please follow up within 24 hours.')
ON DUPLICATE KEY UPDATE 
    subject = VALUES(subject),
    body = VALUES(body),
    updated_at = CURRENT_TIMESTAMP;

-- Create indexes for performance (only if they don't exist)
SET @idx_exists = 0;
SELECT COUNT(*) INTO @idx_exists
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = @dbname
AND TABLE_NAME = 'contacts'
AND INDEX_NAME = 'idx_contacts_client_user_id';

SET @sql = IF(@idx_exists = 0,
    'CREATE INDEX idx_contacts_client_user_id ON contacts(client_user_id)',
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = 0;
SELECT COUNT(*) INTO @idx_exists
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = @dbname
AND TABLE_NAME = 'contacts'
AND INDEX_NAME = 'idx_contacts_created_at';

SET @sql = IF(@idx_exists = 0,
    'CREATE INDEX idx_contacts_created_at ON contacts(created_at)',
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
