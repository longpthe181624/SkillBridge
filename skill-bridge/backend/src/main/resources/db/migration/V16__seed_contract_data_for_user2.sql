-- V16__seed_contract_data_for_user2.sql
-- Seed contract data (MSA, SOW Fixed Price, SOW Retainer) for user id = 2

SET @client_user_id = 2;

-- Verify user exists
SET @user_exists = (SELECT COUNT(*) FROM users WHERE id = @client_user_id);
SET @sql = IF(@user_exists = 0, 
    'INSERT INTO users (id, email, password, full_name, company_name, phone, role, is_active, created_at, updated_at) 
     VALUES (2, ''client2@example.com'', ''$2a$10$dummy'', ''Client User 2'', ''Client Company 2'', ''09012345678'', ''CLIENT'', TRUE, NOW(), NOW())',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 1. MSA Contract
-- ============================================
INSERT INTO contracts (
    client_id,
    contract_type,
    contract_name,
    status,
    period_start,
    period_end,
    value,
    assignee_id,
    currency,
    payment_terms,
    invoicing_cycle,
    billing_day,
    tax_withholding,
    ip_ownership,
    governing_law,
    landbridge_contact_name,
    landbridge_contact_email,
    created_at,
    updated_at
) VALUES (
    @client_user_id,
    'MSA',
    'Master Service Agreement - Client Company 2',
    'Active',
    '2024-01-01',
    '2026-12-31',
    0.00, -- MSA doesn't have value
    'SALES001',
    'JPY',
    'Net 30',
    'Monthly',
    'Last business day',
    '10%',
    'Client',
    'JP',
    'LandBridge Sales Team',
    'sales@landbridge.co.jp',
    DATE_SUB(NOW(), INTERVAL 365 DAY),
    NOW()
);

SET @msa_contract_id = LAST_INSERT_ID();

-- Add MSA contract history
INSERT INTO contract_history (contract_id, entry_date, description, created_by, created_at)
VALUES
    (@msa_contract_id, DATE_SUB(NOW(), INTERVAL 365 DAY), 'MSA contract created and sent to client', @client_user_id, DATE_SUB(NOW(), INTERVAL 365 DAY)),
    (@msa_contract_id, DATE_SUB(NOW(), INTERVAL 360 DAY), 'MSA contract approved by client', @client_user_id, DATE_SUB(NOW(), INTERVAL 360 DAY)),
    (@msa_contract_id, DATE_SUB(NOW(), INTERVAL 180 DAY), 'MSA contract renewed for another year', @client_user_id, DATE_SUB(NOW(), INTERVAL 180 DAY));

-- ============================================
-- 2. SOW Fixed Price Contract
-- ============================================
INSERT INTO contracts (
    client_id,
    contract_type,
    contract_name,
    status,
    period_start,
    period_end,
    value,
    assignee_id,
    currency,
    payment_terms,
    invoicing_cycle,
    billing_day,
    tax_withholding,
    ip_ownership,
    governing_law,
    landbridge_contact_name,
    landbridge_contact_email,
    engagement_type,
    parent_msa_id,
    scope_summary,
    created_at,
    updated_at
) VALUES (
    @client_user_id,
    'SOW',
    'E-Commerce Platform Development - Fixed Price',
    'Active',
    '2024-06-01',
    '2025-05-31',
    15000000.00, -- 15 million JPY
    'PM001',
    'JPY',
    'Net 30',
    'Milestone-based',
    'Upon milestone completion',
    '10%',
    'Client',
    'JP',
    'LandBridge Project Manager',
    'pm@landbridge.co.jp',
    'Fixed Price',
    @msa_contract_id,
    'Development of a complete e-commerce platform with shopping cart, payment integration, and admin dashboard. The project includes frontend, backend, and database design.',
    DATE_SUB(NOW(), INTERVAL 180 DAY),
    NOW()
);

SET @sow_fixed_price_id = LAST_INSERT_ID();

-- Insert into fixed_price_sows table
INSERT INTO fixed_price_sows (
    contract_id,
    parent_msa_id,
    project_name,
    value,
    invoicing_cycle,
    period_start,
    period_end,
    billing_day,
    scope_summary,
    created_at,
    updated_at
) VALUES (
    @sow_fixed_price_id,
    @msa_contract_id,
    'E-Commerce Platform Development',
    15000000.00,
    'Milestone-based',
    '2024-06-01',
    '2025-05-31',
    'Upon milestone completion',
    'Development of a complete e-commerce platform with shopping cart, payment integration, and admin dashboard.',
    DATE_SUB(NOW(), INTERVAL 180 DAY),
    NOW()
);

SET @fixed_price_sow_id = LAST_INSERT_ID();

-- Insert milestone deliverables
INSERT INTO milestone_deliverables (
    fixed_price_sow_id,
    milestone,
    delivery_note,
    acceptance_criteria,
    planned_end,
    payment_percentage,
    created_at,
    updated_at
) VALUES
    (@fixed_price_sow_id, 'Kickoff', 'Project kickoff meeting and initial setup', 'All team members assigned, project repository created, initial documentation completed', '2024-06-15', 10.00, DATE_SUB(NOW(), INTERVAL 180 DAY), NOW()),
    (@fixed_price_sow_id, 'Design Phase', 'UI/UX design and system architecture', 'Design mockups approved, technical architecture document signed off', '2024-07-31', 20.00, DATE_SUB(NOW(), INTERVAL 180 DAY), NOW()),
    (@fixed_price_sow_id, 'Development Phase 1', 'Core functionality development', 'Shopping cart, product catalog, and user authentication completed', '2024-10-31', 30.00, DATE_SUB(NOW(), INTERVAL 180 DAY), NOW()),
    (@fixed_price_sow_id, 'Development Phase 2', 'Payment integration and admin dashboard', 'Payment gateway integrated, admin dashboard functional', '2025-02-28', 25.00, DATE_SUB(NOW(), INTERVAL 180 DAY), NOW()),
    (@fixed_price_sow_id, 'Testing & Deployment', 'QA testing and production deployment', 'All tests passed, application deployed to production', '2025-05-31', 15.00, DATE_SUB(NOW(), INTERVAL 180 DAY), NOW());

-- Insert fixed price billing details
INSERT INTO fixed_price_billing_details (
    fixed_price_sow_id,
    billing_name,
    milestone,
    amount,
    percentage,
    invoice_date,
    milestone_deliverable_id,
    created_at,
    updated_at
) VALUES
    (@fixed_price_sow_id, 'Kickoff Payment', 'Kickoff', 1500000.00, 10.00, '2024-06-15', (SELECT id FROM milestone_deliverables WHERE fixed_price_sow_id = @fixed_price_sow_id AND milestone = 'Kickoff' LIMIT 1), DATE_SUB(NOW(), INTERVAL 180 DAY), NOW()),
    (@fixed_price_sow_id, 'Design Payment', 'Design Phase', 3000000.00, 20.00, '2024-07-31', (SELECT id FROM milestone_deliverables WHERE fixed_price_sow_id = @fixed_price_sow_id AND milestone = 'Design Phase' LIMIT 1), DATE_SUB(NOW(), INTERVAL 150 DAY), NOW()),
    (@fixed_price_sow_id, 'Development Phase 1 Payment', 'Development Phase 1', 4500000.00, 30.00, '2024-10-31', (SELECT id FROM milestone_deliverables WHERE fixed_price_sow_id = @fixed_price_sow_id AND milestone = 'Development Phase 1' LIMIT 1), DATE_SUB(NOW(), INTERVAL 60 DAY), NOW());

-- Add SOW Fixed Price contract history
INSERT INTO contract_history (contract_id, entry_date, description, created_by, created_at)
VALUES
    (@sow_fixed_price_id, DATE_SUB(NOW(), INTERVAL 180 DAY), 'SOW Fixed Price contract created', @client_user_id, DATE_SUB(NOW(), INTERVAL 180 DAY)),
    (@sow_fixed_price_id, DATE_SUB(NOW(), INTERVAL 175 DAY), 'SOW contract approved by client', @client_user_id, DATE_SUB(NOW(), INTERVAL 175 DAY)),
    (@sow_fixed_price_id, DATE_SUB(NOW(), INTERVAL 150 DAY), 'Design Phase milestone completed and invoiced', @client_user_id, DATE_SUB(NOW(), INTERVAL 150 DAY)),
    (@sow_fixed_price_id, DATE_SUB(NOW(), INTERVAL 60 DAY), 'Development Phase 1 milestone completed and invoiced', @client_user_id, DATE_SUB(NOW(), INTERVAL 60 DAY));

-- Add change request for Fixed Price SOW
INSERT INTO change_requests (
    contract_id,
    change_request_id,
    type,
    summary,
    planned_end,
    amount,
    status,
    created_at,
    updated_at
) VALUES (
    @sow_fixed_price_id,
    'CR-2024-01',
    'Add Scope',
    'Additional feature: Mobile app version of the e-commerce platform',
    '2025-08-31',
    5000000.00,
    'Approved',
    DATE_SUB(NOW(), INTERVAL 90 DAY),
    NOW()
);

-- ============================================
-- 3. SOW Retainer Contract
-- ============================================
INSERT INTO contracts (
    client_id,
    contract_type,
    contract_name,
    status,
    period_start,
    period_end,
    value,
    assignee_id,
    currency,
    payment_terms,
    invoicing_cycle,
    billing_day,
    tax_withholding,
    ip_ownership,
    governing_law,
    landbridge_contact_name,
    landbridge_contact_email,
    engagement_type,
    parent_msa_id,
    scope_summary,
    created_at,
    updated_at
) VALUES (
    @client_user_id,
    'SOW',
    'Ongoing Maintenance & Support - Retainer',
    'Active',
    '2024-09-01',
    '2025-08-31',
    6000000.00, -- 6 million JPY per year
    'PM002',
    'JPY',
    'Net 30',
    'Monthly',
    'Last business day',
    '10%',
    'Client',
    'JP',
    'LandBridge Support Team',
    'support@landbridge.co.jp',
    'Retainer',
    @msa_contract_id,
    'Monthly retainer for ongoing maintenance, bug fixes, and feature enhancements. Includes 2 Middle Backend engineers at 100% allocation.',
    DATE_SUB(NOW(), INTERVAL 90 DAY),
    NOW()
);

SET @sow_retainer_id = LAST_INSERT_ID();

-- Insert into retainer_sows table
INSERT INTO retainer_sows (
    contract_id,
    parent_msa_id,
    project_name,
    value,
    period_start,
    period_end,
    invoicing_cycle,
    billing_day,
    scope_summary,
    created_at,
    updated_at
) VALUES (
    @sow_retainer_id,
    @msa_contract_id,
    'Ongoing Maintenance & Support',
    6000000.00,
    '2024-09-01',
    '2025-08-31',
    'Monthly',
    'Last business day',
    'Monthly retainer for ongoing maintenance, bug fixes, and feature enhancements. Includes 2 Middle Backend engineers at 100% allocation.',
    DATE_SUB(NOW(), INTERVAL 90 DAY),
    NOW()
);

SET @retainer_sow_id = LAST_INSERT_ID();

-- Insert delivery items for Retainer SOW
INSERT INTO delivery_items (
    retainer_sow_id,
    milestone,
    delivery_note,
    amount,
    payment_date,
    created_at,
    updated_at
) VALUES
    (@retainer_sow_id, 'November 2024', '2 Middle Backend(100%)', 500000.00, '2024-11-30', DATE_SUB(NOW(), INTERVAL 60 DAY), NOW()),
    (@retainer_sow_id, 'December 2024', '2 Middle Backend(100%)', 500000.00, '2024-12-31', DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
    (@retainer_sow_id, 'January 2025', '2 Middle Backend(100%)', 500000.00, '2025-01-31', NOW(), NOW());

-- Insert retainer billing details
INSERT INTO retainer_billing_details (
    retainer_sow_id,
    payment_date,
    delivery_note,
    amount,
    delivery_item_id,
    created_at,
    updated_at
) VALUES
    (@retainer_sow_id, '2024-11-30', '2 Middle Backend(100%)', 500000.00, (SELECT id FROM delivery_items WHERE retainer_sow_id = @retainer_sow_id AND milestone = 'November 2024' LIMIT 1), DATE_SUB(NOW(), INTERVAL 60 DAY), NOW()),
    (@retainer_sow_id, '2024-12-31', '2 Middle Backend(100%)', 500000.00, (SELECT id FROM delivery_items WHERE retainer_sow_id = @retainer_sow_id AND milestone = 'December 2024' LIMIT 1), DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
    (@retainer_sow_id, '2025-01-31', '2 Middle Backend(100%)', 500000.00, (SELECT id FROM delivery_items WHERE retainer_sow_id = @retainer_sow_id AND milestone = 'January 2025' LIMIT 1), NOW(), NOW());

-- Add SOW Retainer contract history
INSERT INTO contract_history (contract_id, entry_date, description, created_by, created_at)
VALUES
    (@sow_retainer_id, DATE_SUB(NOW(), INTERVAL 90 DAY), 'SOW Retainer contract created', @client_user_id, DATE_SUB(NOW(), INTERVAL 90 DAY)),
    (@sow_retainer_id, DATE_SUB(NOW(), INTERVAL 85 DAY), 'SOW Retainer contract approved by client', @client_user_id, DATE_SUB(NOW(), INTERVAL 85 DAY)),
    (@sow_retainer_id, DATE_SUB(NOW(), INTERVAL 60 DAY), 'November 2024 delivery completed and invoiced', @client_user_id, DATE_SUB(NOW(), INTERVAL 60 DAY)),
    (@sow_retainer_id, DATE_SUB(NOW(), INTERVAL 30 DAY), 'December 2024 delivery completed and invoiced', @client_user_id, DATE_SUB(NOW(), INTERVAL 30 DAY));

-- Add change request for Retainer SOW
INSERT INTO change_requests (
    contract_id,
    change_request_id,
    type,
    summary,
    effective_from,
    effective_until,
    amount,
    status,
    created_at,
    updated_at
) VALUES (
    @sow_retainer_id,
    'CR-2024-02',
    'Extend',
    'Extend retainer period by 3 months with additional Frontend engineer',
    '2025-09-01',
    '2025-11-30',
    2250000.00, -- 3 months * 750,000 JPY/month
    'Pending',
    DATE_SUB(NOW(), INTERVAL 15 DAY),
    NOW()
);

-- ============================================
-- 4. Additional MSA Contract (Draft status)
-- ============================================
INSERT INTO contracts (
    client_id,
    contract_type,
    contract_name,
    status,
    period_start,
    period_end,
    value,
    assignee_id,
    currency,
    payment_terms,
    invoicing_cycle,
    billing_day,
    tax_withholding,
    ip_ownership,
    governing_law,
    landbridge_contact_name,
    landbridge_contact_email,
    created_at,
    updated_at
) VALUES (
    @client_user_id,
    'MSA',
    'Master Service Agreement - Renewal 2026',
    'Draft',
    '2027-01-01',
    '2028-12-31',
    0.00,
    'SALES001',
    'JPY',
    'Net 30',
    'Monthly',
    'Last business day',
    '10%',
    'Client',
    'JP',
    'LandBridge Sales Team',
    'sales@landbridge.co.jp',
    DATE_SUB(NOW(), INTERVAL 7 DAY),
    NOW()
);

SET @msa_draft_id = LAST_INSERT_ID();

-- Add draft MSA history
INSERT INTO contract_history (contract_id, entry_date, description, created_by, created_at)
VALUES
    (@msa_draft_id, DATE_SUB(NOW(), INTERVAL 7 DAY), 'Draft MSA contract created for review', @client_user_id, DATE_SUB(NOW(), INTERVAL 7 DAY));

