-- SkillBridge Database Initialization Script
-- This script creates the database schema and sample data
-- Note: Database is already created by MySQL container via MYSQL_DATABASE env var
-- This script will run in the context of the database specified in MYSQL_DATABASE

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

-- Engineer Skills Table
CREATE TABLE IF NOT EXISTS engineer_skills (
    engineer_id INT NOT NULL,
    skill_id INT NOT NULL,
    level VARCHAR(32),
    years INT,
    PRIMARY KEY (engineer_id, skill_id),
    FOREIGN KEY (engineer_id) REFERENCES engineers(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Contacts Table (for statistics)
CREATE TABLE IF NOT EXISTS contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_user_id INT,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Homepage Statistics View
CREATE OR REPLACE VIEW homepage_statistics AS
SELECT 
    (SELECT COUNT(*) FROM engineers WHERE status = 'AVAILABLE') as total_engineers,
    (SELECT COUNT(*) FROM contacts WHERE status = 'ACTIVE') as total_customers;

-- Insert Skills
INSERT INTO skills (name, parent_skill_id) VALUES
('Web Development', NULL),
('Frontend Development', 1),
('Backend Development', 1),
('React', 2),
('Vue.js', 2),
('Node.js', 3),
('Game Development', NULL),
('Unity', 7),
('Unreal Engine', 7),
('AI/ML Development', NULL),
('Machine Learning', 10),
('Deep Learning', 10);

-- Insert Sample Engineers
INSERT INTO engineers (full_name, years_experience, seniority, summary, location, language_summary, status, profile_image_url, salary_expectation, primary_skill) VALUES
('Nguyen Van A', 6, 'Senior', 'Experienced full-stack developer with expertise in React and Node.js', 'Vietnam', 'English (Fluent)', 'AVAILABLE', '/images/engineers/nguyen-van-a.jpg', 350000, 'React'),
('Tran Thi B', 5, 'Mid', 'Game developer specializing in Unity and C#', 'Vietnam', 'English (Intermediate)', 'AVAILABLE', '/images/engineers/tran-thi-b.jpg', 400000, 'Unity'),
('Le Van C', 8, 'Senior', 'AI/ML engineer with expertise in Python and TensorFlow', 'Vietnam', 'English (Fluent)', 'AVAILABLE', '/images/engineers/le-van-c.jpg', 500000, 'Machine Learning'),
('Pham Thi D', 4, 'Mid', 'Frontend developer specializing in Vue.js and TypeScript', 'Vietnam', 'English (Intermediate)', 'AVAILABLE', '/images/engineers/pham-thi-d.jpg', 300000, 'Vue.js'),
('Hoang Van E', 7, 'Senior', 'Backend developer with expertise in Java and Spring Boot', 'Vietnam', 'English (Fluent)', 'AVAILABLE', '/images/engineers/hoang-van-e.jpg', 450000, 'Node.js'),
('Vu Thi F', 3, 'Junior', 'Full-stack developer with React and Node.js experience', 'Vietnam', 'English (Basic)', 'AVAILABLE', '/images/engineers/vu-thi-f.jpg', 250000, 'React');

-- Insert Engineer Skills
INSERT INTO engineer_skills (engineer_id, skill_id, level, years) VALUES
(1, 4, 'Advanced', 4), -- Nguyen Van A - React
(1, 6, 'Advanced', 3), -- Nguyen Van A - Node.js
(2, 8, 'Advanced', 3), -- Tran Thi B - Unity
(3, 11, 'Expert', 5), -- Le Van C - Machine Learning
(4, 5, 'Advanced', 3), -- Pham Thi D - Vue.js
(5, 6, 'Expert', 5), -- Hoang Van E - Node.js
(6, 4, 'Intermediate', 2); -- Vu Thi F - React

-- Insert Sample Contacts
INSERT INTO contacts (client_user_id, status) VALUES
(1, 'ACTIVE'),
(2, 'ACTIVE'),
(3, 'ACTIVE');

-- Create indexes for performance
CREATE INDEX idx_engineers_status ON engineers(status);
CREATE INDEX idx_engineers_primary_skill ON engineers(primary_skill);
CREATE INDEX idx_engineers_salary ON engineers(salary_expectation);
CREATE INDEX idx_engineer_skills_engineer_id ON engineer_skills(engineer_id);
CREATE INDEX idx_engineer_skills_skill_id ON engineer_skills(skill_id);
CREATE INDEX idx_contacts_status ON contacts(status);
