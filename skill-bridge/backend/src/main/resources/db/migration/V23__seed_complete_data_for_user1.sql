-- V23__seed_complete_data_for_user1.sql
-- Seed complete data for user 1: Contact -> Proposal -> Contract (MSA/SOW) -> Change Request
-- Includes all possible statuses for each entity type

SET @user_id = 1;

-- Clean up existing data for user 1 (if any) to avoid duplicates
-- Delete in reverse order of dependencies
-- Note: Using temporary tables to avoid subquery issues in DELETE statements

-- Delete change request history
DELETE crh FROM change_request_history crh
INNER JOIN change_requests cr ON crh.change_request_id = cr.id
WHERE cr.created_by = @user_id;

-- Delete change requests
DELETE FROM change_requests WHERE created_by = @user_id;

-- Delete contract history for MSA contracts
DELETE ch FROM contract_history ch
INNER JOIN contracts c ON ch.contract_id = c.id
WHERE ch.created_by = @user_id AND c.client_id = @user_id;

-- Delete contract history for SOW contracts
DELETE ch FROM contract_history ch
INNER JOIN sow_contracts sc ON ch.sow_contract_id = sc.id
WHERE ch.created_by = @user_id AND sc.client_id = @user_id;

-- Delete SOW contracts
DELETE FROM sow_contracts WHERE client_id = @user_id;

-- Delete MSA contracts
DELETE FROM contracts WHERE client_id = @user_id;

-- Delete proposals
DELETE FROM proposals WHERE created_by = @user_id;

-- Delete contacts
DELETE FROM contacts WHERE client_user_id = @user_id;

-- ============================================
-- 1. CONTACTS (with all statuses)
-- ============================================
-- Contact statuses: New, Converted to Opportunity, Closed, Active, Inactive

INSERT INTO contacts (client_user_id, title, description, status, request_type, priority, created_by, created_at, updated_at)
VALUES
    -- New status
    (@user_id, 'E-commerce Platform Development', 'Looking for a team to develop a comprehensive e-commerce platform with payment integration', 'New', 'Project Request', 'High', @user_id, DATE_SUB(NOW(), INTERVAL 60 DAY), NOW()),
    
    -- Converted to Opportunity
    (@user_id, 'Mobile Banking App Development', 'Need a secure mobile banking application for iOS and Android', 'Converted to Opportunity', 'Project Request', 'High', @user_id, DATE_SUB(NOW(), INTERVAL 50 DAY), NOW()),
    
    -- Closed
    (@user_id, 'Legacy System Migration', 'Migrate legacy system to modern cloud infrastructure', 'Closed', 'Project Request', 'Medium', @user_id, DATE_SUB(NOW(), INTERVAL 40 DAY), NOW()),
    
    -- Active
    (@user_id, 'AI Chatbot Integration', 'Integrate AI chatbot into customer service platform', 'Active', 'Consultation', 'High', @user_id, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
    
    -- Inactive
    (@user_id, 'Blockchain Consulting', 'Consultation for blockchain implementation strategy', 'Inactive', 'Consultation', 'Low', @user_id, DATE_SUB(NOW(), INTERVAL 20 DAY), NOW());

-- Get contact IDs
SET @contact_new = (SELECT id FROM contacts WHERE client_user_id = @user_id AND title = 'E-commerce Platform Development' LIMIT 1);
SET @contact_converted = (SELECT id FROM contacts WHERE client_user_id = @user_id AND title = 'Mobile Banking App Development' LIMIT 1);
SET @contact_closed = (SELECT id FROM contacts WHERE client_user_id = @user_id AND title = 'Legacy System Migration' LIMIT 1);
SET @contact_active = (SELECT id FROM contacts WHERE client_user_id = @user_id AND title = 'AI Chatbot Integration' LIMIT 1);
SET @contact_inactive = (SELECT id FROM contacts WHERE client_user_id = @user_id AND title = 'Blockchain Consulting' LIMIT 1);

-- ============================================
-- 2. PROPOSALS (with all statuses)
-- ============================================
-- Proposal statuses: draft, under review, Sent to client, Reject, Approved, Request for change

INSERT INTO proposals (title, status, contact_id, link, created_by, created_at, updated_at)
VALUES
    -- Draft
    ('E-commerce Platform Proposal', 'draft', @contact_new, NULL, @user_id, DATE_SUB(NOW(), INTERVAL 55 DAY), NOW()),
    
    -- Under review
    ('Mobile Banking App Proposal', 'under review', @contact_converted, 'https://example.com/proposals/mobile-banking-proposal.pdf', @user_id, DATE_SUB(NOW(), INTERVAL 45 DAY), NOW()),
    
    -- Sent to client
    ('Legacy System Migration Proposal', 'Sent to client', @contact_closed, 'https://example.com/proposals/legacy-migration-proposal.pdf', @user_id, DATE_SUB(NOW(), INTERVAL 35 DAY), NOW()),
    
    -- Reject
    ('AI Chatbot Integration Proposal', 'Reject', @contact_active, 'https://example.com/proposals/ai-chatbot-proposal.pdf', @user_id, DATE_SUB(NOW(), INTERVAL 25 DAY), NOW()),
    
    -- Approved
    ('Blockchain Consulting Proposal', 'Approved', @contact_inactive, 'https://example.com/proposals/blockchain-proposal.pdf', @user_id, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW()),
    
    -- Request for change
    ('E-commerce Platform Proposal V2', 'Request for change', @contact_new, 'https://example.com/proposals/ecommerce-proposal-v2.pdf', @user_id, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW());

-- ============================================
-- 3. MSA CONTRACTS (with all statuses)
-- ============================================
-- Contract statuses: Draft, Active, Pending, Under_Review, Request_for_Change, Approved, Completed, Terminated, Cancelled

INSERT INTO contracts (client_id, contract_name, status, period_start, period_end, value, assignee_id, currency, payment_terms, invoicing_cycle, billing_day, tax_withholding, ip_ownership, governing_law, landbridge_contact_name, landbridge_contact_email, created_at, updated_at)
VALUES
    -- Draft
    (@user_id, 'MSA - Draft Contract 2025', 'Draft', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
    
    -- Active
    (@user_id, 'MSA - Active Contract 2025', 'Active', '2025-01-01', '2027-12-31', 10000000.00, 'Sale-01', 'USD', 'Net 30', 'Monthly', '15', '10%', 'Client owns all IP', 'Japan Law', 'John Smith', 'john.smith@landbridge.com', DATE_SUB(NOW(), INTERVAL 90 DAY), NOW()),
    
    -- Pending
    (@user_id, 'MSA - Pending Contract 2025', 'Pending', '2025-06-01', '2028-05-31', 8000000.00, 'Sale-02', 'USD', 'Net 45', 'Quarterly', '1', '15%', 'Shared IP', 'US Law', 'Jane Doe', 'jane.doe@landbridge.com', DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
    
    -- Under_Review
    (@user_id, 'MSA - Under Review Contract 2025', 'Under_Review', '2025-03-01', '2028-02-28', 12000000.00, 'Sale-01', 'JPY', 'Net 30', 'Monthly', '20', '20%', 'LandBridge owns IP', 'Japan Law', 'Mike Johnson', 'mike.johnson@landbridge.com', DATE_SUB(NOW(), INTERVAL 15 DAY), NOW()),
    
    -- Request_for_Change
    (@user_id, 'MSA - Request for Change Contract 2025', 'Request_for_Change', '2025-04-01', '2028-03-31', 9000000.00, 'Sale-03', 'USD', 'Net 30', 'Monthly', '10', '10%', 'Client owns all IP', 'Japan Law', 'Sarah Wilson', 'sarah.wilson@landbridge.com', DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
    
    -- Approved
    (@user_id, 'MSA - Approved Contract 2025', 'Approved', '2025-05-01', '2028-04-30', 7500000.00, 'Sale-02', 'USD', 'Net 30', 'Monthly', '5', '10%', 'Shared IP', 'US Law', 'Tom Brown', 'tom.brown@landbridge.com', DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
    
    -- Completed
    (@user_id, 'MSA - Completed Contract 2024', 'Completed', '2024-01-01', '2024-12-31', 5000000.00, 'Sale-01', 'USD', 'Net 30', 'Monthly', '15', '10%', 'Client owns all IP', 'Japan Law', 'John Smith', 'john.smith@landbridge.com', DATE_SUB(NOW(), INTERVAL 400 DAY), NOW()),
    
    -- Terminated
    (@user_id, 'MSA - Terminated Contract 2023', 'Terminated', '2023-01-01', '2023-12-31', 3000000.00, 'Sale-01', 'USD', 'Net 30', 'Monthly', '15', '10%', 'Client owns all IP', 'Japan Law', 'John Smith', 'john.smith@landbridge.com', DATE_SUB(NOW(), INTERVAL 700 DAY), NOW()),
    
    -- Cancelled
    (@user_id, 'MSA - Cancelled Contract 2025', 'Cancelled', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW());

-- Get MSA contract IDs
SET @msa_active = (SELECT id FROM contracts WHERE client_id = @user_id AND contract_name = 'MSA - Active Contract 2025' LIMIT 1);
SET @msa_pending = (SELECT id FROM contracts WHERE client_id = @user_id AND contract_name = 'MSA - Pending Contract 2025' LIMIT 1);
SET @msa_under_review = (SELECT id FROM contracts WHERE client_id = @user_id AND contract_name = 'MSA - Under Review Contract 2025' LIMIT 1);
SET @msa_request_for_change = (SELECT id FROM contracts WHERE client_id = @user_id AND contract_name = 'MSA - Request for Change Contract 2025' LIMIT 1);
SET @msa_approved = (SELECT id FROM contracts WHERE client_id = @user_id AND contract_name = 'MSA - Approved Contract 2025' LIMIT 1);
SET @msa_completed = (SELECT id FROM contracts WHERE client_id = @user_id AND contract_name = 'MSA - Completed Contract 2024' LIMIT 1);
SET @msa_terminated = (SELECT id FROM contracts WHERE client_id = @user_id AND contract_name = 'MSA - Terminated Contract 2023' LIMIT 1);

-- ============================================
-- 4. SOW CONTRACTS (with all statuses)
-- ============================================
-- SOW Contract statuses: Draft, Active, Pending, Under_Review, Request_for_Change, Approved, Completed, Terminated, Cancelled
-- Engagement types: Fixed Price, Retainer

INSERT INTO sow_contracts (client_id, contract_name, status, engagement_type, parent_msa_id, project_name, scope_summary, period_start, period_end, value, assignee_id, currency, payment_terms, invoicing_cycle, billing_day, tax_withholding, ip_ownership, governing_law, landbridge_contact_name, landbridge_contact_email, created_at, updated_at)
VALUES
    -- Draft - Fixed Price
    (@user_id, 'SOW - Draft Fixed Price Project', 'Draft', 'Fixed Price', @msa_active, 'Draft E-commerce Platform', 'Initial planning phase for e-commerce platform', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 4 DAY), NOW()),
    
    -- Active - Fixed Price
    (@user_id, 'SOW - Active Fixed Price Project', 'Active', 'Fixed Price', @msa_active, 'E-commerce Platform Development', 'Full-stack e-commerce platform with payment gateway integration, user management, and admin dashboard', '2025-01-15', '2025-12-31', 5000000.00, 'Sale-01', 'USD', 'Net 30', 'Monthly', '15', '10%', 'Client owns all IP', 'Japan Law', 'John Smith', 'john.smith@landbridge.com', DATE_SUB(NOW(), INTERVAL 80 DAY), NOW()),
    
    -- Pending - Fixed Price
    (@user_id, 'SOW - Pending Fixed Price Project', 'Pending', 'Fixed Price', @msa_pending, 'Mobile App Development', 'Native iOS and Android mobile application development', '2025-06-01', '2025-11-30', 3500000.00, 'Sale-02', 'USD', 'Net 45', 'Quarterly', '1', '15%', 'Shared IP', 'US Law', 'Jane Doe', 'jane.doe@landbridge.com', DATE_SUB(NOW(), INTERVAL 25 DAY), NOW()),
    
    -- Under_Review - Fixed Price
    (@user_id, 'SOW - Under Review Fixed Price Project', 'Under_Review', 'Fixed Price', @msa_under_review, 'AI Chatbot Development', 'AI-powered chatbot with natural language processing capabilities', '2025-03-15', '2025-09-30', 2800000.00, 'Sale-01', 'JPY', 'Net 30', 'Monthly', '20', '20%', 'LandBridge owns IP', 'Japan Law', 'Mike Johnson', 'mike.johnson@landbridge.com', DATE_SUB(NOW(), INTERVAL 12 DAY), NOW()),
    
    -- Request_for_Change - Fixed Price
    (@user_id, 'SOW - Request for Change Fixed Price Project', 'Request_for_Change', 'Fixed Price', @msa_request_for_change, 'Blockchain Integration', 'Blockchain integration for supply chain management', '2025-04-01', '2025-10-31', 4200000.00, 'Sale-03', 'USD', 'Net 30', 'Monthly', '10', '10%', 'Client owns all IP', 'Japan Law', 'Sarah Wilson', 'sarah.wilson@landbridge.com', DATE_SUB(NOW(), INTERVAL 8 DAY), NOW()),
    
    -- Approved - Fixed Price
    (@user_id, 'SOW - Approved Fixed Price Project', 'Approved', 'Fixed Price', @msa_approved, 'Data Analytics Platform', 'Big data analytics platform with real-time dashboards', '2025-05-01', '2025-12-31', 6000000.00, 'Sale-02', 'USD', 'Net 30', 'Monthly', '5', '10%', 'Shared IP', 'US Law', 'Tom Brown', 'tom.brown@landbridge.com', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
    
    -- Completed - Fixed Price
    (@user_id, 'SOW - Completed Fixed Price Project 2024', 'Completed', 'Fixed Price', @msa_completed, 'Legacy System Migration', 'Migration of legacy system to cloud infrastructure', '2024-01-15', '2024-12-31', 4000000.00, 'Sale-01', 'USD', 'Net 30', 'Monthly', '15', '10%', 'Client owns all IP', 'Japan Law', 'John Smith', 'john.smith@landbridge.com', DATE_SUB(NOW(), INTERVAL 380 DAY), NOW()),
    
    -- Terminated - Fixed Price
    (@user_id, 'SOW - Terminated Fixed Price Project 2023', 'Terminated', 'Fixed Price', @msa_terminated, 'Cancelled Project', 'Project was terminated due to budget constraints', '2023-01-15', '2023-06-30', 2000000.00, 'Sale-01', 'USD', 'Net 30', 'Monthly', '15', '10%', 'Client owns all IP', 'Japan Law', 'John Smith', 'john.smith@landbridge.com', DATE_SUB(NOW(), INTERVAL 680 DAY), NOW()),
    
    -- Cancelled - Fixed Price
    (@user_id, 'SOW - Cancelled Fixed Price Project', 'Cancelled', 'Fixed Price', @msa_active, 'Cancelled E-commerce Project', 'Project cancelled before start', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
    
    -- Active - Retainer
    (@user_id, 'SOW - Active Retainer Project', 'Active', 'Retainer', @msa_active, 'Ongoing Development Support', 'Monthly retainer for ongoing development and maintenance support', '2025-02-01', '2026-01-31', 1200000.00, 'Sale-01', 'USD', 'Net 30', 'Monthly', '15', '10%', 'Client owns all IP', 'Japan Law', 'John Smith', 'john.smith@landbridge.com', DATE_SUB(NOW(), INTERVAL 70 DAY), NOW()),
    
    -- Pending - Retainer
    (@user_id, 'SOW - Pending Retainer Project', 'Pending', 'Retainer', @msa_pending, 'DevOps Support Retainer', 'Monthly DevOps and infrastructure support', '2025-07-01', '2026-06-30', 800000.00, 'Sale-02', 'USD', 'Net 45', 'Quarterly', '1', '15%', 'Shared IP', 'US Law', 'Jane Doe', 'jane.doe@landbridge.com', DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
    
    -- Under_Review - Retainer
    (@user_id, 'SOW - Under Review Retainer Project', 'Under_Review', 'Retainer', @msa_under_review, 'QA Testing Retainer', 'Monthly QA testing and quality assurance services', '2025-04-01', '2026-03-31', 600000.00, 'Sale-01', 'JPY', 'Net 30', 'Monthly', '20', '20%', 'LandBridge owns IP', 'Japan Law', 'Mike Johnson', 'mike.johnson@landbridge.com', DATE_SUB(NOW(), INTERVAL 11 DAY), NOW()),
    
    -- Request_for_Change - Retainer
    (@user_id, 'SOW - Request for Change Retainer Project', 'Request_for_Change', 'Retainer', @msa_request_for_change, 'Consulting Retainer', 'Monthly consulting and advisory services', '2025-05-01', '2026-04-30', 900000.00, 'Sale-03', 'USD', 'Net 30', 'Monthly', '10', '10%', 'Client owns all IP', 'Japan Law', 'Sarah Wilson', 'sarah.wilson@landbridge.com', DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
    
    -- Approved - Retainer
    (@user_id, 'SOW - Approved Retainer Project', 'Approved', 'Retainer', @msa_approved, 'Support Retainer', 'Monthly technical support and maintenance', '2025-06-01', '2026-05-31', 700000.00, 'Sale-02', 'USD', 'Net 30', 'Monthly', '5', '10%', 'Shared IP', 'US Law', 'Tom Brown', 'tom.brown@landbridge.com', DATE_SUB(NOW(), INTERVAL 4 DAY), NOW()),
    
    -- Completed - Retainer
    (@user_id, 'SOW - Completed Retainer Project 2024', 'Completed', 'Retainer', @msa_completed, '2024 Support Retainer', 'Completed retainer for 2024 support services', '2024-02-01', '2024-12-31', 1000000.00, 'Sale-01', 'USD', 'Net 30', 'Monthly', '15', '10%', 'Client owns all IP', 'Japan Law', 'John Smith', 'john.smith@landbridge.com', DATE_SUB(NOW(), INTERVAL 370 DAY), NOW()),
    
    -- Terminated - Retainer
    (@user_id, 'SOW - Terminated Retainer Project 2023', 'Terminated', 'Retainer', @msa_terminated, '2023 Support Retainer', 'Terminated retainer agreement', '2023-02-01', '2023-06-30', 500000.00, 'Sale-01', 'USD', 'Net 30', 'Monthly', '15', '10%', 'Client owns all IP', 'Japan Law', 'John Smith', 'john.smith@landbridge.com', DATE_SUB(NOW(), INTERVAL 670 DAY), NOW()),
    
    -- Cancelled - Retainer
    (@user_id, 'SOW - Cancelled Retainer Project', 'Cancelled', 'Retainer', @msa_active, 'Cancelled Support Retainer', 'Retainer cancelled before start', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Get SOW contract IDs
SET @sow_active_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Active Fixed Price Project' LIMIT 1);
SET @sow_pending_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Pending Fixed Price Project' LIMIT 1);
SET @sow_under_review_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Under Review Fixed Price Project' LIMIT 1);
SET @sow_request_for_change_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Request for Change Fixed Price Project' LIMIT 1);
SET @sow_approved_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Approved Fixed Price Project' LIMIT 1);
SET @sow_active_retainer = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Active Retainer Project' LIMIT 1);
SET @sow_pending_retainer = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Pending Retainer Project' LIMIT 1);
SET @sow_under_review_retainer = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Under Review Retainer Project' LIMIT 1);

-- ============================================
-- 5. CHANGE REQUESTS (with all statuses)
-- ============================================
-- Change Request statuses: Draft, Pending, Under Review, Approved, Request for Change, Active, Terminated, Rejected
-- CR Types for Fixed Price: Add Scope, Remove Scope, Other
-- CR Types for Retainer: Extend Schedule, Increase Resource, Rate Change, Other

-- Change Requests for Fixed Price SOW
INSERT INTO change_requests (sow_contract_id, contract_type, change_request_id, type, title, summary, description, reason, desired_start_date, desired_end_date, expected_extra_cost, cost_estimated_by_landbridge, amount, status, created_by, created_at, updated_at)
VALUES
    -- Draft - Fixed Price
    (@sow_active_fixed, 'SOW', 'CR-2025-01', 'Add Scope', 'Add Payment Gateway Integration', 'Add Payment Gateway Integration', 'Add Stripe payment gateway integration to the e-commerce platform', 'Client requested additional payment method support', '2025-06-01', '2025-07-31', 500000.00, NULL, 500000.00, 'Draft', @user_id, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
    
    -- Pending - Fixed Price
    (@sow_active_fixed, 'SOW', 'CR-2025-02', 'Remove Scope', 'Remove Social Media Integration', 'Remove Social Media Integration', 'Remove social media login and sharing features from the platform', 'Client decided to use different authentication method', '2025-08-01', '2025-08-15', -200000.00, NULL, -200000.00, 'Pending', @user_id, DATE_SUB(NOW(), INTERVAL 75 DAY), NOW()),
    
    -- Under Review - Fixed Price
    (@sow_active_fixed, 'SOW', 'CR-2025-03', 'Other', 'Change Delivery Timeline', 'Change Delivery Timeline', 'Request to extend project delivery timeline by 2 months', 'Client needs more time for internal review and testing', '2025-10-01', '2025-12-31', 0.00, 300000.00, 0.00, 'Under Review', @user_id, DATE_SUB(NOW(), INTERVAL 65 DAY), NOW()),
    
    -- Approved - Fixed Price
    (@sow_active_fixed, 'SOW', 'CR-2025-04', 'Add Scope', 'Add Multi-language Support', 'Add Multi-language Support', 'Add multi-language support for English, Japanese, and Chinese', 'Client expanding to international markets', '2025-09-01', '2025-10-31', 800000.00, 750000.00, 800000.00, 'Approved', @user_id, DATE_SUB(NOW(), INTERVAL 55 DAY), NOW()),
    
    -- Request for Change - Fixed Price
    (@sow_active_fixed, 'SOW', 'CR-2025-05', 'Other', 'Modify UI Design', 'Modify UI Design', 'Request to modify UI design based on new brand guidelines', 'Client updated their brand identity', '2025-07-01', '2025-08-31', 400000.00, 450000.00, 400000.00, 'Request for Change', @user_id, DATE_SUB(NOW(), INTERVAL 45 DAY), NOW()),
    
    -- Active - Fixed Price
    (@sow_active_fixed, 'SOW', 'CR-2025-06', 'Add Scope', 'Add Analytics Dashboard', 'Add Analytics Dashboard', 'Add comprehensive analytics dashboard for sales and user behavior', 'Client needs better insights into platform performance', '2025-05-01', '2025-06-30', 600000.00, 580000.00, 600000.00, 'Active', @user_id, DATE_SUB(NOW(), INTERVAL 35 DAY), NOW()),
    
    -- Terminated - Fixed Price
    (@sow_active_fixed, 'SOW', 'CR-2025-07', 'Remove Scope', 'Terminated Feature Request', 'Terminated Feature Request', 'Feature request that was later terminated', 'Client changed requirements', '2025-04-01', '2025-04-30', 300000.00, NULL, 300000.00, 'Terminated', @user_id, DATE_SUB(NOW(), INTERVAL 25 DAY), NOW()),
    
    -- Rejected - Fixed Price
    (@sow_active_fixed, 'SOW', 'CR-2025-08', 'Other', 'Rejected Change Request', 'Rejected Change Request', 'Change request that was rejected by LandBridge', 'Requested changes not feasible within timeline', '2025-03-01', '2025-03-31', 1000000.00, 1200000.00, 1000000.00, 'Rejected', @user_id, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW());

-- Change Requests for MSA Contracts
INSERT INTO change_requests (contract_id, contract_type, change_request_id, type, title, summary, description, reason, desired_start_date, desired_end_date, expected_extra_cost, cost_estimated_by_landbridge, amount, status, created_by, created_at, updated_at)
VALUES
    -- Draft - MSA
    (@msa_active, 'MSA', 'CR-2025-17', 'Other', 'MSA Amendment Request', 'MSA Amendment Request', 'Request to amend MSA terms and conditions', 'Client needs to update payment terms', '2025-08-01', '2025-08-31', 0.00, NULL, 0.00, 'Draft', @user_id, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
    
    -- Pending - MSA
    (@msa_active, 'MSA', 'CR-2025-18', 'Other', 'MSA Extension Request', 'MSA Extension Request', 'Request to extend MSA period by 1 year', 'Client wants to continue partnership', '2028-01-01', '2028-12-31', 0.00, NULL, 0.00, 'Pending', @user_id, DATE_SUB(NOW(), INTERVAL 50 DAY), NOW()),
    
    -- Under Review - MSA
    (@msa_active, 'MSA', 'CR-2025-19', 'Other', 'MSA Terms Update', 'MSA Terms Update', 'Request to update commercial terms in MSA', 'Market conditions changed', '2025-09-01', '2025-09-30', 0.00, 0.00, 0.00, 'Under Review', @user_id, DATE_SUB(NOW(), INTERVAL 40 DAY), NOW()),
    
    -- Approved - MSA
    (@msa_active, 'MSA', 'CR-2025-20', 'Other', 'MSA Approved Amendment', 'MSA Approved Amendment', 'Approved amendment to MSA agreement', 'Terms successfully updated', '2025-07-01', '2025-07-31', 0.00, 0.00, 0.00, 'Approved', @user_id, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
    
    -- Request for Change - MSA
    (@msa_active, 'MSA', 'CR-2025-21', 'Other', 'MSA Change Request', 'MSA Change Request', 'Request for changes to MSA agreement', 'Client requested modifications', '2025-10-01', '2025-10-31', 0.00, 0.00, 0.00, 'Request for Change', @user_id, DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
    
    -- Active - MSA
    (@msa_active, 'MSA', 'CR-2025-22', 'Other', 'MSA Active Amendment', 'MSA Active Amendment', 'Active amendment to MSA agreement', 'Amendment is now active', '2025-06-01', '2025-06-30', 0.00, 0.00, 0.00, 'Active', @user_id, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW()),
    
    -- Terminated - MSA
    (@msa_active, 'MSA', 'CR-2025-23', 'Other', 'MSA Terminated Request', 'MSA Terminated Request', 'Terminated MSA change request', 'Request was cancelled', '2025-05-01', '2025-05-31', 0.00, NULL, 0.00, 'Terminated', @user_id, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
    
    -- Rejected - MSA
    (@msa_active, 'MSA', 'CR-2025-24', 'Other', 'MSA Rejected Request', 'MSA Rejected Request', 'Rejected MSA change request', 'Request not feasible', '2025-04-01', '2025-04-30', 0.00, 0.00, 0.00, 'Rejected', @user_id, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());

-- Change Requests for Retainer SOW
INSERT INTO change_requests (sow_contract_id, contract_type, change_request_id, type, title, summary, description, reason, desired_start_date, desired_end_date, expected_extra_cost, cost_estimated_by_landbridge, amount, status, created_by, created_at, updated_at)
VALUES
    -- Draft - Retainer
    (@sow_active_retainer, 'SOW', 'CR-2025-09', 'Extend Schedule', 'Extend Retainer Period', 'Extend Retainer Period', 'Extend retainer period by 3 months', 'Client needs ongoing support for longer period', '2026-02-01', '2026-04-30', 300000.00, NULL, 300000.00, 'Draft', @user_id, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
    
    -- Pending - Retainer
    (@sow_active_retainer, 'SOW', 'CR-2025-10', 'Increase Resource', 'Add Senior Developer', 'Add Senior Developer', 'Add one senior developer to the retainer team', 'Client needs more experienced developer for complex tasks', '2025-08-01', '2026-01-31', 1200000.00, NULL, 1200000.00, 'Pending', @user_id, DATE_SUB(NOW(), INTERVAL 60 DAY), NOW()),
    
    -- Under Review - Retainer
    (@sow_active_retainer, 'SOW', 'CR-2025-11', 'Rate Change', 'Adjust Hourly Rate', 'Adjust Hourly Rate', 'Request to adjust hourly rate for senior developers', 'Market rate adjustment needed', '2025-09-01', '2026-01-31', 0.00, 500000.00, 0.00, 'Under Review', @user_id, DATE_SUB(NOW(), INTERVAL 50 DAY), NOW()),
    
    -- Approved - Retainer
    (@sow_active_retainer, 'SOW', 'CR-2025-12', 'Extend Schedule', 'Extend Support Period', 'Extend Support Period', 'Extend support period by 6 months', 'Client satisfied with service quality', '2026-02-01', '2026-07-31', 600000.00, 580000.00, 600000.00, 'Approved', @user_id, DATE_SUB(NOW(), INTERVAL 40 DAY), NOW()),
    
    -- Request for Change - Retainer
    (@sow_active_retainer, 'SOW', 'CR-2025-13', 'Other', 'Change Support Hours', 'Change Support Hours', 'Request to change support hours from 9-5 to 24/7', 'Client needs round-the-clock support', '2025-10-01', '2026-01-31', 2000000.00, 2200000.00, 2000000.00, 'Request for Change', @user_id, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
    
    -- Active - Retainer
    (@sow_active_retainer, 'SOW', 'CR-2025-14', 'Increase Resource', 'Add QA Engineer', 'Add QA Engineer', 'Add QA engineer to the retainer team', 'Client needs dedicated QA support', '2025-06-01', '2026-01-31', 800000.00, 750000.00, 800000.00, 'Active', @user_id, DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
    
    -- Terminated - Retainer
    (@sow_active_retainer, 'SOW', 'CR-2025-15', 'Other', 'Terminated Resource Request', 'Terminated Resource Request', 'Resource request that was later terminated', 'Client changed resource requirements', '2025-05-01', '2025-05-31', 400000.00, NULL, 400000.00, 'Terminated', @user_id, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
    
    -- Rejected - Retainer
    (@sow_active_retainer, 'SOW', 'CR-2025-16', 'Rate Change', 'Rejected Rate Change', 'Rejected Rate Change', 'Rate change request that was rejected', 'Rate change not justified', '2025-04-01', '2025-04-30', 0.00, 0.00, 0.00, 'Rejected', @user_id, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());

-- ============================================
-- 6. CONTRACT HISTORY (for MSA and SOW contracts)
-- ============================================

-- History for Active MSA
INSERT INTO contract_history (contract_id, entry_date, description, created_by, history_type, created_at)
VALUES
    (@msa_active, DATE_SUB(NOW(), INTERVAL 90 DAY), 'Contract created and activated', @user_id, 'MSA', DATE_SUB(NOW(), INTERVAL 90 DAY)),
    (@msa_active, DATE_SUB(NOW(), INTERVAL 85 DAY), 'Status changed from Draft to Active', @user_id, 'MSA', DATE_SUB(NOW(), INTERVAL 85 DAY));

-- History for Under Review MSA
INSERT INTO contract_history (contract_id, entry_date, description, created_by, history_type, created_at)
VALUES
    (@msa_under_review, DATE_SUB(NOW(), INTERVAL 15 DAY), 'Contract created', @user_id, 'MSA', DATE_SUB(NOW(), INTERVAL 15 DAY)),
    (@msa_under_review, DATE_SUB(NOW(), INTERVAL 12 DAY), 'Status changed from Draft to Under_Review', @user_id, 'MSA', DATE_SUB(NOW(), INTERVAL 12 DAY));

-- History for Request for Change MSA
INSERT INTO contract_history (contract_id, entry_date, description, created_by, history_type, created_at)
VALUES
    (@msa_request_for_change, DATE_SUB(NOW(), INTERVAL 10 DAY), 'Contract created', @user_id, 'MSA', DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (@msa_request_for_change, DATE_SUB(NOW(), INTERVAL 8 DAY), 'Status changed from Under_Review to Request_for_Change', @user_id, 'MSA', DATE_SUB(NOW(), INTERVAL 8 DAY));

-- History for Active Fixed Price SOW
INSERT INTO contract_history (sow_contract_id, entry_date, description, created_by, history_type, created_at)
VALUES
    (@sow_active_fixed, DATE_SUB(NOW(), INTERVAL 80 DAY), 'SOW contract created', @user_id, 'SOW', DATE_SUB(NOW(), INTERVAL 80 DAY)),
    (@sow_active_fixed, DATE_SUB(NOW(), INTERVAL 75 DAY), 'Status changed from Draft to Active', @user_id, 'SOW', DATE_SUB(NOW(), INTERVAL 75 DAY));

-- History for Under Review Fixed Price SOW
INSERT INTO contract_history (sow_contract_id, entry_date, description, created_by, history_type, created_at)
VALUES
    (@sow_under_review_fixed, DATE_SUB(NOW(), INTERVAL 12 DAY), 'SOW contract created', @user_id, 'SOW', DATE_SUB(NOW(), INTERVAL 12 DAY)),
    (@sow_under_review_fixed, DATE_SUB(NOW(), INTERVAL 10 DAY), 'Status changed from Draft to Under_Review', @user_id, 'SOW', DATE_SUB(NOW(), INTERVAL 10 DAY));

-- History for Active Retainer SOW
INSERT INTO contract_history (sow_contract_id, entry_date, description, created_by, history_type, created_at)
VALUES
    (@sow_active_retainer, DATE_SUB(NOW(), INTERVAL 70 DAY), 'SOW contract created', @user_id, 'SOW', DATE_SUB(NOW(), INTERVAL 70 DAY)),
    (@sow_active_retainer, DATE_SUB(NOW(), INTERVAL 65 DAY), 'Status changed from Draft to Active', @user_id, 'SOW', DATE_SUB(NOW(), INTERVAL 65 DAY));

-- ============================================
-- 7. CHANGE REQUEST HISTORY
-- ============================================

-- Get change request IDs
SET @cr_draft_fixed = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-01' LIMIT 1);
SET @cr_pending_fixed = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-02' LIMIT 1);
SET @cr_under_review_fixed = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-03' LIMIT 1);
SET @cr_approved_fixed = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-04' LIMIT 1);
SET @cr_request_for_change_fixed = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-05' LIMIT 1);
SET @cr_active_fixed = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-06' LIMIT 1);
SET @cr_draft_retainer = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-09' LIMIT 1);
SET @cr_pending_retainer = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-10' LIMIT 1);
SET @cr_under_review_retainer = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-11' LIMIT 1);
SET @cr_draft_msa = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-17' LIMIT 1);
SET @cr_pending_msa = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-18' LIMIT 1);
SET @cr_under_review_msa = (SELECT id FROM change_requests WHERE change_request_id = 'CR-2025-19' LIMIT 1);

-- History for Draft CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_draft_fixed, 'Change request created as draft', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- History for Pending CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_pending_fixed, 'Change request created', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 75 DAY)),
    (@cr_pending_fixed, 'Change request submitted', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 74 DAY)),
    (@cr_pending_fixed, 'Status changed to Pending', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 74 DAY));

-- History for Under Review CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_under_review_fixed, 'Change request created', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 65 DAY)),
    (@cr_under_review_fixed, 'Change request submitted', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 64 DAY)),
    (@cr_under_review_fixed, 'Status changed to Under Review', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 64 DAY));

-- History for Approved CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_approved_fixed, 'Change request created', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 55 DAY)),
    (@cr_approved_fixed, 'Change request submitted', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 54 DAY)),
    (@cr_approved_fixed, 'Status changed to Under Review', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 54 DAY)),
    (@cr_approved_fixed, 'Change request approved', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 53 DAY)),
    (@cr_approved_fixed, 'Status changed to Approved', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 53 DAY));

-- History for Request for Change CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_request_for_change_fixed, 'Change request created', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 45 DAY)),
    (@cr_request_for_change_fixed, 'Change request submitted', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 44 DAY)),
    (@cr_request_for_change_fixed, 'Status changed to Under Review', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 44 DAY)),
    (@cr_request_for_change_fixed, 'Request for change submitted', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 43 DAY)),
    (@cr_request_for_change_fixed, 'Status changed to Request for Change', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 43 DAY));

-- History for Active CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_active_fixed, 'Change request created', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 35 DAY)),
    (@cr_active_fixed, 'Change request submitted', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 34 DAY)),
    (@cr_active_fixed, 'Status changed to Under Review', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 34 DAY)),
    (@cr_active_fixed, 'Change request approved', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 33 DAY)),
    (@cr_active_fixed, 'Status changed to Active', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 33 DAY));

-- History for Draft Retainer CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_draft_retainer, 'Change request created as draft', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- History for Pending Retainer CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_pending_retainer, 'Change request created', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 60 DAY)),
    (@cr_pending_retainer, 'Change request submitted', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 59 DAY)),
    (@cr_pending_retainer, 'Status changed to Pending', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 59 DAY));

-- History for Under Review Retainer CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_under_review_retainer, 'Change request created', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 50 DAY)),
    (@cr_under_review_retainer, 'Change request submitted', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 49 DAY)),
    (@cr_under_review_retainer, 'Status changed to Under Review', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 49 DAY));

-- History for MSA Change Requests
-- History for Draft MSA CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_draft_msa, 'Change request created as draft', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- History for Pending MSA CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_pending_msa, 'Change request created', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 50 DAY)),
    (@cr_pending_msa, 'Change request submitted', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 49 DAY)),
    (@cr_pending_msa, 'Status changed to Pending', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 49 DAY));

-- History for Under Review MSA CR
INSERT INTO change_request_history (change_request_id, action, user_id, user_name, timestamp)
VALUES
    (@cr_under_review_msa, 'Change request created', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 40 DAY)),
    (@cr_under_review_msa, 'Change request submitted', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 39 DAY)),
    (@cr_under_review_msa, 'Status changed to Under Review', @user_id, 'User 1', DATE_SUB(NOW(), INTERVAL 39 DAY));

