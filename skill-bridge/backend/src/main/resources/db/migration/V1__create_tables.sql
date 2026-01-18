-- SkillBridge Database Schema Creation
-- Flyway Migration V1: Create all tables

-- Engineers Table
CREATE TABLE IF NOT EXISTS engineers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    years_experience INT NOT NULL,
    seniority VARCHAR(32) NOT NULL,
    summary TEXT,
    location VARCHAR(128) NOT NULL,
    language_summary VARCHAR(64),
    status VARCHAR(32) DEFAULT 'AVAILABLE',
    profile_image_url VARCHAR(500),
    salary_expectation DECIMAL(10,2),
    primary_skill VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) UNIQUE NOT NULL,
    parent_skill_id INT,
    FOREIGN KEY (parent_skill_id) REFERENCES skills(id)
);

-- Engineer Skills Table (Junction table for many-to-many relationship)
CREATE TABLE IF NOT EXISTS engineer_skills (
    engineer_id INT NOT NULL,
    skill_id INT NOT NULL,
    level VARCHAR(32),
    years INT,
    PRIMARY KEY (engineer_id, skill_id),
    FOREIGN KEY (engineer_id) REFERENCES engineers(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Contacts Table (for customer statistics)
CREATE TABLE IF NOT EXISTS contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_user_id INT,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance optimization
CREATE INDEX idx_engineers_status ON engineers(status);
CREATE INDEX idx_engineers_primary_skill ON engineers(primary_skill);
CREATE INDEX idx_engineers_salary ON engineers(salary_expectation);
CREATE INDEX idx_engineer_skills_engineer_id ON engineer_skills(engineer_id);
CREATE INDEX idx_engineer_skills_skill_id ON engineer_skills(skill_id);
CREATE INDEX idx_contacts_status ON contacts(status);

