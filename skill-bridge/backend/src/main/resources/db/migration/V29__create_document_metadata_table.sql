-- V29__create_document_metadata_table.sql
-- Create document_metadata table for managing S3 file access permissions

CREATE TABLE IF NOT EXISTS document_metadata (
    id INT PRIMARY KEY AUTO_INCREMENT,
    s3_key VARCHAR(500) NOT NULL UNIQUE,
    owner_id INT NOT NULL,
    document_type VARCHAR(50) NOT NULL COMMENT 'proposal, contract, invoice, etc.',
    entity_id INT NULL COMMENT 'ID of related entity (proposal_id, contract_id, etc.)',
    entity_type VARCHAR(50) NULL COMMENT 'proposal, contract, etc.',
    allowed_roles TEXT NULL COMMENT 'JSON array of allowed roles',
    allowed_users TEXT NULL COMMENT 'JSON array of allowed user IDs',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_s3_key (s3_key),
    INDEX idx_owner_id (owner_id),
    INDEX idx_document_type (document_type),
    INDEX idx_entity (entity_type, entity_id),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

