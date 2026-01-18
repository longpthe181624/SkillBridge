-- V43__add_engineer_personal_fields.sql
-- Add personal information fields to engineers table for create engineer form

-- Add email column (unique, nullable)
ALTER TABLE engineers 
ADD COLUMN email VARCHAR(255) NULL;

-- Add phone column (nullable)
ALTER TABLE engineers 
ADD COLUMN phone VARCHAR(20) NULL;

-- Add gender column (nullable)
ALTER TABLE engineers 
ADD COLUMN gender VARCHAR(16) NULL;

-- Add date_of_birth column (nullable)
ALTER TABLE engineers 
ADD COLUMN date_of_birth DATE NULL;

-- Add interested_in_japan column (nullable)
ALTER TABLE engineers 
ADD COLUMN interested_in_japan BOOLEAN NULL;

-- Add project_type_experience column (nullable, comma-separated string)
ALTER TABLE engineers 
ADD COLUMN project_type_experience VARCHAR(500) NULL;

-- Create unique index on email for uniqueness constraint
CREATE UNIQUE INDEX idx_engineers_email ON engineers(email);

-- Create index on email for search performance (if not already unique indexed)
-- Note: Unique index already created above, so this is for reference

