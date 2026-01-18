-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    opportunity_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., "OP-2025-01"
    contact_id INT, -- Foreign key to contacts table (if converted from contact)
    est_value DECIMAL(15, 2) NOT NULL, -- Estimated value
    currency VARCHAR(10) DEFAULT 'JPY', -- Currency code (JPY, USD, etc.)
    probability INT DEFAULT 0, -- Percentage (0-100)
    client_email VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_company VARCHAR(255), -- Client company name
    status VARCHAR(32) DEFAULT 'NEW', -- NEW, IN_PROGRESS, PROPOSAL_DRAFTING, PROPOSAL_SENT, REVISION, WON, LOST
    assignee_user_id INT, -- Foreign key to users table (Sales Man assigned)
    created_by INT NOT NULL, -- Foreign key to users table (Sales Man who created this opportunity)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_opportunity_id (opportunity_id),
    INDEX idx_contact_id (contact_id),
    INDEX idx_status (status),
    INDEX idx_assignee_user_id (assignee_user_id),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
    FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

