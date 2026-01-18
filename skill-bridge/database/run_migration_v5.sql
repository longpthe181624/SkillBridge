-- Manual Migration V5 - Add contact management tables
-- Run this if Flyway migration V5 hasn't been executed

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

-- Update Contacts Table - Add missing columns
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS assignee_user_id INT,
ADD COLUMN IF NOT EXISTS reviewer_id INT,
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS request_type VARCHAR(32),
ADD COLUMN IF NOT EXISTS priority VARCHAR(32) DEFAULT 'Medium',
ADD COLUMN IF NOT EXISTS internal_note TEXT,
ADD COLUMN IF NOT EXISTS online_mtg_link VARCHAR(255),
ADD COLUMN IF NOT EXISTS online_mtg_date TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS communication_progress VARCHAR(32) DEFAULT 'AutoReply',
ADD COLUMN IF NOT EXISTS created_by INT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

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

-- Insert Email Templates
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

