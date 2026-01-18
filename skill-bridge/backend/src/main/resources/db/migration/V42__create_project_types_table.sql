-- SkillBridge Database - Create Project Types Table
-- Flyway Migration V42: Create project_types table for Master Data

CREATE TABLE IF NOT EXISTS project_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) UNIQUE NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_types_name ON project_types(name);

