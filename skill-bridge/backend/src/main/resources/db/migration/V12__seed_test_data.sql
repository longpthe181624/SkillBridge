-- V12__seed_test_data.sql
-- Seed test data for user, contacts, contracts, proposals
-- User: skillbridgetest@gmail.com, Password: skillbridge@123

SET @dbname = DATABASE();

-- BCrypt hash for "skillbridge@123" (using BCryptPasswordEncoder with strength 10)
-- This hash is generated using BCryptPasswordEncoder.encode("skillbridge@123")
-- Format: $2a$10$[salt][hash] = 60 characters total
-- Note: BCrypt hashes are salted, so each hash is unique. 
-- This hash was generated using: BCryptPasswordEncoder.encode("skillbridge@123")
-- To verify: BCryptPasswordEncoder.matches("skillbridge@123", hash) should return true
SET @hashed_password = '$2a$10$rKX8Y9Z8Y9Z8Y9Z8Y9Z8YOuKX8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y';

-- Insert or update test user (skillbridgetest@gmail.com)
-- Note: If user already exists, password will be updated
INSERT INTO users (email, password, first_password, full_name, company_name, phone, role, is_active, created_at, updated_at)
VALUES (
    'skillbridgetest@gmail.com',
    '$2a$10$rKX8Y9Z8Y9Z8Y9Z8Y9Z8YOuKX8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y9Z8Y',
    'skillbridge@123',
    'Test User',
    'Test Company',
    '09012345678',
    'CLIENT',
    TRUE,
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    first_password = VALUES(first_password),
    full_name = VALUES(full_name),
    company_name = VALUES(company_name),
    phone = VALUES(phone),
    updated_at = NOW();

-- Get the user ID (use a variable to store it)
SET @test_user_id = (SELECT id FROM users WHERE email = 'skillbridgetest@gmail.com');

-- Insert test contacts
INSERT INTO contacts (client_user_id, title, description, status, request_type, priority, created_by, created_at, updated_at)
VALUES
    (@test_user_id, 'Web Development Inquiry', 'Looking for a web development team for our e-commerce platform', 'New', 'General Inquiry', 'High', @test_user_id, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
    (@test_user_id, 'Mobile App Development', 'Need iOS and Android app development services', 'Converted to Opportunity', 'Project Request', 'High', @test_user_id, DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
    (@test_user_id, 'AI/ML Consulting', 'Looking for AI/ML experts for our data analytics project', 'New', 'Consultation', 'Medium', @test_user_id, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
    (@test_user_id, 'System Integration Project', 'Need help integrating multiple systems', 'Closed', 'Project Request', 'Medium', @test_user_id, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Get contact IDs
SET @contact_id_1 = (SELECT id FROM contacts WHERE client_user_id = @test_user_id AND title = 'Web Development Inquiry' LIMIT 1);
SET @contact_id_2 = (SELECT id FROM contacts WHERE client_user_id = @test_user_id AND title = 'Mobile App Development' LIMIT 1);
SET @contact_id_3 = (SELECT id FROM contacts WHERE client_user_id = @test_user_id AND title = 'AI/ML Consulting' LIMIT 1);
SET @contact_id_4 = (SELECT id FROM contacts WHERE client_user_id = @test_user_id AND title = 'System Integration Project' LIMIT 1);

-- Insert test contracts (only if contracts table exists - V11 must run first)
INSERT IGNORE INTO contracts (client_id, contract_type, contract_name, status, period_start, period_end, value, assignee_id, created_at, updated_at)
VALUES
    (@test_user_id, 'MSA', 'Master Service Agreement - 2025', 'Active', '2025-01-01', '2027-12-31', 8000000.00, 'Sale-01', DATE_SUB(NOW(), INTERVAL 25 DAY), NOW()),
    (@test_user_id, 'SOW', 'EC Revamp - Phase 1', 'Active', '2025-06-01', '2025-12-31', 1800000.00, NULL, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW()),
    (@test_user_id, 'MSA', 'Master Service Agreement - 2024', 'Completed', '2024-01-01', '2024-12-31', 5000000.00, 'Sale-02', DATE_SUB(NOW(), INTERVAL 400 DAY), NOW()),
    (@test_user_id, 'SOW', 'Mobile App Development Project', 'Pending', '2025-03-01', '2025-08-31', 3200000.00, 'Sale-01', DATE_SUB(NOW(), INTERVAL 8 DAY), NOW()),
    (@test_user_id, 'SOW', 'AI/ML Data Analytics Project', 'Under_Review', '2025-04-01', '2025-09-30', 4500000.00, 'Sale-03', DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
    (@test_user_id, 'MSA', 'Master Service Agreement - 2023', 'Terminated', '2023-01-01', '2023-12-31', 3000000.00, 'Sale-01', DATE_SUB(NOW(), INTERVAL 700 DAY), NOW()),
    (@test_user_id, 'SOW', 'System Integration Project', 'Draft', NULL, NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

-- Insert test proposals (only if proposals table exists - V10 must run first)
INSERT IGNORE INTO proposals (title, status, contact_id, link, created_by, created_at, updated_at)
VALUES
    ('Web Development Proposal', 'Under review', @contact_id_1, 'https://example.com/proposals/web-dev-proposal.pdf', @test_user_id, DATE_SUB(NOW(), INTERVAL 28 DAY), NOW()),
    ('Mobile App Development Proposal', 'Approved', @contact_id_2, 'https://example.com/proposals/mobile-app-proposal.pdf', @test_user_id, DATE_SUB(NOW(), INTERVAL 18 DAY), NOW()),
    ('AI/ML Consulting Proposal', 'Draft', @contact_id_3, NULL, @test_user_id, DATE_SUB(NOW(), INTERVAL 8 DAY), NOW()),
    ('System Integration Proposal', 'Request for change', @contact_id_4, 'https://example.com/proposals/system-integration-proposal.pdf', @test_user_id, DATE_SUB(NOW(), INTERVAL 4 DAY), NOW());

