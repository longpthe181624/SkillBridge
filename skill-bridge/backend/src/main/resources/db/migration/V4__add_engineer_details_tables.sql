-- V4__add_engineer_details_tables.sql
-- Add engineer detail view support: introduction column and certificates table

-- Add introduction column to engineers table
ALTER TABLE engineers 
ADD COLUMN introduction TEXT AFTER summary;

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    engineer_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    issued_by VARCHAR(255),
    issued_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (engineer_id) REFERENCES engineers(id) ON DELETE CASCADE,
    INDEX idx_certificates_engineer_id (engineer_id)
);

-- Note: engineer_skills table already has 'years' column from V1 migration
-- No need to add years_of_experience column

-- Insert sample certificates
INSERT INTO certificates (engineer_id, name, issued_by, issued_date) VALUES
(1, 'AWS Certified Cloud Practitioner', 'Amazon Web Services', '2023-01-15'),
(1, 'AWS Certified Machine Learning Engineer - Associate', 'Amazon Web Services', '2023-06-20'),
(2, 'AWS Certified Solutions Architect', 'Amazon Web Services', '2022-11-10'),
(2, 'Google Cloud Professional Cloud Architect', 'Google Cloud', '2023-03-15'),
(3, 'Oracle Certified Professional: Java SE 11 Developer', 'Oracle', '2021-08-05'),
(3, 'Spring Professional Certification', 'Pivotal', '2022-05-20');

-- Update sample engineers with introduction
UPDATE engineers 
SET introduction = 'Experienced full-stack developer with expertise in React and Node.js. Passionate about building scalable web applications and mentoring junior developers. Strong problem-solving skills and ability to work in fast-paced environments. Proven track record of delivering high-quality software solutions on time and within budget.'
WHERE id = 1;

UPDATE engineers 
SET introduction = 'Frontend developer specializing in Vue.js and TypeScript. Strong focus on user experience and performance optimization. Experience with modern frontend tools and frameworks. Dedicated to creating beautiful, responsive, and accessible user interfaces that delight users.'
WHERE id = 2;

UPDATE engineers 
SET introduction = 'Backend developer with expertise in Java and Spring Boot. Experienced in microservices architecture and cloud deployment. Strong understanding of system design and scalability. Passionate about building robust, maintainable, and performant backend systems that can handle millions of users.'
WHERE id = 3;

-- Note: engineer_skills 'years' column is already populated from V3 migration
-- No need to update years

