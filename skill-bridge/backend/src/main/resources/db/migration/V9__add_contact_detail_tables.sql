-- V9__add_contact_detail_tables.sql
-- Add tables for contact detail feature (Story-10)
-- Creates communication_logs, proposal_comments, consultation_cancellations tables
-- Updates contacts table with proposal fields

SET @dbname = DATABASE();

-- Update contacts table with proposal fields
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname
AND TABLE_NAME = 'contacts'
AND COLUMN_NAME = 'proposal_link';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE contacts 
    ADD COLUMN proposal_link VARCHAR(500) NULL,
    ADD COLUMN proposal_status VARCHAR(50) DEFAULT ''Pending'' AFTER proposal_link',
    'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create Communication Logs table (for Story-10 contact detail)
CREATE TABLE IF NOT EXISTS communication_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    message TEXT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_communication_logs_contact_id (contact_id),
    INDEX idx_communication_logs_created_at (created_at)
);

-- Create Proposal Comments table
CREATE TABLE IF NOT EXISTS proposal_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    message TEXT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_proposal_comments_contact_id (contact_id),
    INDEX idx_proposal_comments_created_at (created_at)
);

-- Create Consultation Cancellations table
CREATE TABLE IF NOT EXISTS consultation_cancellations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    reason TEXT NOT NULL,
    cancelled_by INT NOT NULL,
    cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (cancelled_by) REFERENCES users(id),
    INDEX idx_consultation_cancellations_contact_id (contact_id),
    INDEX idx_consultation_cancellations_cancelled_at (cancelled_at)
);

