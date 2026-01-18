-- V10__create_proposals_table.sql
-- Create proposals table for Story-11
-- Proposal table with fields: Title, status, reviewer_id, contact_id, link, created_by, created_at, updated_at

CREATE TABLE IF NOT EXISTS proposals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    reviewer_id INT NULL,
    contact_id INT NOT NULL,
    link VARCHAR(500) NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_proposals_contact_id (contact_id),
    INDEX idx_proposals_reviewer_id (reviewer_id),
    INDEX idx_proposals_status (status),
    INDEX idx_proposals_created_at (created_at)
);

