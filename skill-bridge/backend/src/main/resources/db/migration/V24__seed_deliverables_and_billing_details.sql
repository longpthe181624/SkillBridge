-- V24__seed_deliverables_and_billing_details.sql
-- Seed deliverables and billing details for SOW contracts

SET @user_id = 1;

-- Get SOW contract IDs
SET @sow_active_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Active Fixed Price Project' LIMIT 1);
SET @sow_pending_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Pending Fixed Price Project' LIMIT 1);
SET @sow_under_review_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Under Review Fixed Price Project' LIMIT 1);
SET @sow_request_for_change_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Request for Change Fixed Price Project' LIMIT 1);
SET @sow_approved_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Approved Fixed Price Project' LIMIT 1);
SET @sow_completed_fixed = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Completed Fixed Price Project 2024' LIMIT 1);
SET @sow_active_retainer = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Active Retainer Project' LIMIT 1);
SET @sow_pending_retainer = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Pending Retainer Project' LIMIT 1);
SET @sow_under_review_retainer = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Under Review Retainer Project' LIMIT 1);
SET @sow_approved_retainer = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Approved Retainer Project' LIMIT 1);
SET @sow_completed_retainer = (SELECT id FROM sow_contracts WHERE client_id = @user_id AND contract_name = 'SOW - Completed Retainer Project 2024' LIMIT 1);

-- ============================================
-- 1. MILESTONE DELIVERABLES (Fixed Price SOW)
-- ============================================

-- Milestone Deliverables for Active Fixed Price SOW
INSERT INTO milestone_deliverables (sow_contract_id, milestone, delivery_note, acceptance_criteria, planned_end, payment_percentage, created_at, updated_at)
VALUES
    (@sow_active_fixed, 'Phase 1: Project Setup & Planning', 'Complete project setup, environment configuration, and initial planning documentation', 'All environments configured, project plan approved by client', '2025-02-28', 10.00, DATE_SUB(NOW(), INTERVAL 75 DAY), NOW()),
    (@sow_active_fixed, 'Phase 2: Core Features Development', 'Develop core e-commerce features: product catalog, shopping cart, user authentication', 'All core features tested and working, code review completed', '2025-05-31', 30.00, DATE_SUB(NOW(), INTERVAL 60 DAY), NOW()),
    (@sow_active_fixed, 'Phase 3: Payment Integration', 'Integrate payment gateway (Stripe), implement checkout flow, order management', 'Payment processing tested successfully, order system operational', '2025-08-31', 30.00, DATE_SUB(NOW(), INTERVAL 45 DAY), NOW()),
    (@sow_active_fixed, 'Phase 4: Admin Dashboard', 'Build admin dashboard for product management, order tracking, user management', 'Admin dashboard fully functional, all CRUD operations working', '2025-10-31', 20.00, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
    (@sow_active_fixed, 'Phase 5: Testing & Deployment', 'Final testing, bug fixes, production deployment, documentation', 'All tests passed, application deployed to production, documentation complete', '2025-12-31', 10.00, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW());

-- Milestone Deliverables for Pending Fixed Price SOW
INSERT INTO milestone_deliverables (sow_contract_id, milestone, delivery_note, acceptance_criteria, planned_end, payment_percentage, created_at, updated_at)
VALUES
    (@sow_pending_fixed, 'Phase 1: Design & Wireframes', 'Create UI/UX designs and wireframes for iOS and Android apps', 'Designs approved by client, wireframes finalized', '2025-07-31', 15.00, DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
    (@sow_pending_fixed, 'Phase 2: iOS Development', 'Develop native iOS application with core features', 'iOS app functional, tested on devices, ready for beta', '2025-09-30', 35.00, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW()),
    (@sow_pending_fixed, 'Phase 3: Android Development', 'Develop native Android application with core features', 'Android app functional, tested on devices, ready for beta', '2025-10-31', 35.00, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
    (@sow_pending_fixed, 'Phase 4: Integration & Testing', 'Integrate both apps with backend, comprehensive testing, bug fixes', 'Both apps integrated, all tests passed, ready for release', '2025-11-30', 15.00, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());

-- Milestone Deliverables for Under Review Fixed Price SOW
INSERT INTO milestone_deliverables (sow_contract_id, milestone, delivery_note, acceptance_criteria, planned_end, payment_percentage, created_at, updated_at)
VALUES
    (@sow_under_review_fixed, 'Phase 1: NLP Model Training', 'Train natural language processing model for chatbot', 'Model accuracy > 90%, tested with sample conversations', '2025-05-31', 25.00, DATE_SUB(NOW(), INTERVAL 8 DAY), NOW()),
    (@sow_under_review_fixed, 'Phase 2: Chatbot Integration', 'Integrate chatbot with customer service platform, API development', 'Chatbot integrated, API endpoints working, response time < 2s', '2025-07-31', 35.00, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
    (@sow_under_review_fixed, 'Phase 3: Testing & Optimization', 'Comprehensive testing, performance optimization, user acceptance testing', 'All tests passed, performance optimized, UAT completed', '2025-09-30', 40.00, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

-- Milestone Deliverables for Request for Change Fixed Price SOW
INSERT INTO milestone_deliverables (sow_contract_id, milestone, delivery_note, acceptance_criteria, planned_end, payment_percentage, created_at, updated_at)
VALUES
    (@sow_request_for_change_fixed, 'Phase 1: Blockchain Architecture Design', 'Design blockchain architecture, smart contract specifications', 'Architecture approved, smart contract specs finalized', '2025-05-31', 20.00, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
    (@sow_request_for_change_fixed, 'Phase 2: Smart Contract Development', 'Develop and test smart contracts for supply chain management', 'Smart contracts deployed to testnet, all functions tested', '2025-07-31', 30.00, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
    (@sow_request_for_change_fixed, 'Phase 3: Integration & Testing', 'Integrate blockchain with existing systems, comprehensive testing', 'Integration complete, all tests passed, ready for production', '2025-10-31', 50.00, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Milestone Deliverables for Approved Fixed Price SOW
INSERT INTO milestone_deliverables (sow_contract_id, milestone, delivery_note, acceptance_criteria, planned_end, payment_percentage, created_at, updated_at)
VALUES
    (@sow_approved_fixed, 'Phase 1: Data Pipeline Setup', 'Set up data ingestion pipeline, configure data storage', 'Pipeline operational, data flowing correctly', '2025-06-30', 15.00, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
    (@sow_approved_fixed, 'Phase 2: Analytics Engine Development', 'Develop analytics engine, implement data processing algorithms', 'Analytics engine functional, processing data correctly', '2025-09-30', 40.00, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
    (@sow_approved_fixed, 'Phase 3: Dashboard Development', 'Build real-time dashboards, implement visualization components', 'Dashboards operational, real-time updates working', '2025-12-31', 45.00, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Milestone Deliverables for Completed Fixed Price SOW
INSERT INTO milestone_deliverables (sow_contract_id, milestone, delivery_note, acceptance_criteria, planned_end, payment_percentage, created_at, updated_at)
VALUES
    (@sow_completed_fixed, 'Phase 1: Assessment & Planning', 'Assess legacy system, create migration plan, set up cloud infrastructure', 'Assessment complete, migration plan approved, cloud ready', '2024-03-31', 15.00, DATE_SUB(NOW(), INTERVAL 360 DAY), NOW()),
    (@sow_completed_fixed, 'Phase 2: Data Migration', 'Migrate data from legacy system to cloud, validate data integrity', 'Data migrated successfully, integrity verified, no data loss', '2024-06-30', 30.00, DATE_SUB(NOW(), INTERVAL 330 DAY), NOW()),
    (@sow_completed_fixed, 'Phase 3: Application Migration', 'Migrate applications to cloud, configure services, test functionality', 'Applications migrated, all services operational, tests passed', '2024-09-30', 35.00, DATE_SUB(NOW(), INTERVAL 240 DAY), NOW()),
    (@sow_completed_fixed, 'Phase 4: Final Testing & Go-Live', 'Final testing, performance tuning, production go-live, documentation', 'All tests passed, system live, documentation complete', '2024-12-31', 20.00, DATE_SUB(NOW(), INTERVAL 150 DAY), NOW());

-- Get Milestone Deliverable IDs for billing details
SET @milestone_1_active = (SELECT id FROM milestone_deliverables WHERE sow_contract_id = @sow_active_fixed AND milestone = 'Phase 1: Project Setup & Planning' LIMIT 1);
SET @milestone_2_active = (SELECT id FROM milestone_deliverables WHERE sow_contract_id = @sow_active_fixed AND milestone = 'Phase 2: Core Features Development' LIMIT 1);
SET @milestone_3_active = (SELECT id FROM milestone_deliverables WHERE sow_contract_id = @sow_active_fixed AND milestone = 'Phase 3: Payment Integration' LIMIT 1);
SET @milestone_4_active = (SELECT id FROM milestone_deliverables WHERE sow_contract_id = @sow_active_fixed AND milestone = 'Phase 4: Admin Dashboard' LIMIT 1);
SET @milestone_5_active = (SELECT id FROM milestone_deliverables WHERE sow_contract_id = @sow_active_fixed AND milestone = 'Phase 5: Testing & Deployment' LIMIT 1);

-- ============================================
-- 2. FIXED PRICE BILLING DETAILS
-- ============================================

-- Billing Details for Active Fixed Price SOW
INSERT INTO fixed_price_billing_details (sow_contract_id, billing_name, milestone, amount, percentage, invoice_date, milestone_deliverable_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_active_fixed, 'Project Setup & Planning Invoice', 'Phase 1: Project Setup & Planning', 500000.00, 10.00, '2025-02-28', @milestone_1_active, NULL, DATE_SUB(NOW(), INTERVAL 70 DAY), NOW()),
    (@sow_active_fixed, 'Core Features Development Invoice', 'Phase 2: Core Features Development', 1500000.00, 30.00, '2025-05-31', @milestone_2_active, NULL, DATE_SUB(NOW(), INTERVAL 55 DAY), NOW()),
    (@sow_active_fixed, 'Payment Integration Invoice', 'Phase 3: Payment Integration', 1500000.00, 30.00, '2025-08-31', @milestone_3_active, NULL, DATE_SUB(NOW(), INTERVAL 40 DAY), NOW()),
    (@sow_active_fixed, 'Admin Dashboard Invoice', 'Phase 4: Admin Dashboard', 1000000.00, 20.00, '2025-10-31', @milestone_4_active, NULL, DATE_SUB(NOW(), INTERVAL 25 DAY), NOW());

-- Billing Details for Pending Fixed Price SOW
INSERT INTO fixed_price_billing_details (sow_contract_id, billing_name, milestone, amount, percentage, invoice_date, milestone_deliverable_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_pending_fixed, 'Design & Wireframes Invoice', 'Phase 1: Design & Wireframes', 525000.00, 15.00, '2025-07-31', NULL, NULL, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW());

-- Billing Details for Under Review Fixed Price SOW
INSERT INTO fixed_price_billing_details (sow_contract_id, billing_name, milestone, amount, percentage, invoice_date, milestone_deliverable_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_under_review_fixed, 'NLP Model Training Invoice', 'Phase 1: NLP Model Training', 700000.00, 25.00, '2025-05-31', NULL, NULL, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW());

-- Billing Details for Request for Change Fixed Price SOW
INSERT INTO fixed_price_billing_details (sow_contract_id, billing_name, milestone, amount, percentage, invoice_date, milestone_deliverable_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_request_for_change_fixed, 'Blockchain Architecture Design Invoice', 'Phase 1: Blockchain Architecture Design', 840000.00, 20.00, '2025-05-31', NULL, NULL, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

-- Billing Details for Approved Fixed Price SOW
INSERT INTO fixed_price_billing_details (sow_contract_id, billing_name, milestone, amount, percentage, invoice_date, milestone_deliverable_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_approved_fixed, 'Data Pipeline Setup Invoice', 'Phase 1: Data Pipeline Setup', 900000.00, 15.00, '2025-06-30', NULL, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Billing Details for Completed Fixed Price SOW
INSERT INTO fixed_price_billing_details (sow_contract_id, billing_name, milestone, amount, percentage, invoice_date, milestone_deliverable_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_completed_fixed, 'Assessment & Planning Invoice', 'Phase 1: Assessment & Planning', 600000.00, 15.00, '2024-03-31', NULL, NULL, DATE_SUB(NOW(), INTERVAL 355 DAY), NOW()),
    (@sow_completed_fixed, 'Data Migration Invoice', 'Phase 2: Data Migration', 1200000.00, 30.00, '2024-06-30', NULL, NULL, DATE_SUB(NOW(), INTERVAL 325 DAY), NOW()),
    (@sow_completed_fixed, 'Application Migration Invoice', 'Phase 3: Application Migration', 1400000.00, 35.00, '2024-09-30', NULL, NULL, DATE_SUB(NOW(), INTERVAL 235 DAY), NOW()),
    (@sow_completed_fixed, 'Final Testing & Go-Live Invoice', 'Phase 4: Final Testing & Go-Live', 800000.00, 20.00, '2024-12-31', NULL, NULL, DATE_SUB(NOW(), INTERVAL 145 DAY), NOW());

-- ============================================
-- 3. DELIVERY ITEMS (Retainer SOW)
-- ============================================

-- Delivery Items for Active Retainer SOW
INSERT INTO delivery_items (sow_contract_id, milestone, delivery_note, amount, payment_date, created_at, updated_at)
VALUES
    (@sow_active_retainer, 'January 2025 Support', 'Monthly support and maintenance for January 2025. Resolved 15 tickets, performed system updates, and provided consultation on new features.', 100000.00, '2025-02-15', DATE_SUB(NOW(), INTERVAL 65 DAY), NOW()),
    (@sow_active_retainer, 'February 2025 Support', 'Monthly support and maintenance for February 2025. Resolved 12 tickets, implemented 3 feature enhancements, and conducted code reviews.', 100000.00, '2025-03-15', DATE_SUB(NOW(), INTERVAL 50 DAY), NOW()),
    (@sow_active_retainer, 'March 2025 Support', 'Monthly support and maintenance for March 2025. Resolved 18 tickets, performed security updates, and optimized database queries.', 100000.00, '2025-04-15', DATE_SUB(NOW(), INTERVAL 35 DAY), NOW()),
    (@sow_active_retainer, 'April 2025 Support', 'Monthly support and maintenance for April 2025. Resolved 10 tickets, deployed new features, and provided technical documentation.', 100000.00, '2025-05-15', DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
    (@sow_active_retainer, 'May 2025 Support', 'Monthly support and maintenance for May 2025. Resolved 14 tickets, performed system maintenance, and conducted performance tuning.', 100000.00, '2025-06-15', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());

-- Delivery Items for Pending Retainer SOW
INSERT INTO delivery_items (sow_contract_id, milestone, delivery_note, amount, payment_date, created_at, updated_at)
VALUES
    (@sow_pending_retainer, 'July 2025 DevOps Support', 'Quarterly DevOps support for Q3 2025. Infrastructure monitoring, CI/CD pipeline maintenance, and cloud resource optimization.', 266666.67, '2025-08-01', DATE_SUB(NOW(), INTERVAL 15 DAY), NOW());

-- Delivery Items for Under Review Retainer SOW
INSERT INTO delivery_items (sow_contract_id, milestone, delivery_note, amount, payment_date, created_at, updated_at)
VALUES
    (@sow_under_review_retainer, 'April 2025 QA Testing', 'Monthly QA testing services for April 2025. Executed 150 test cases, found and reported 8 bugs, performed regression testing.', 50000.00, '2025-05-20', DATE_SUB(NOW(), INTERVAL 8 DAY), NOW());

-- Delivery Items for Approved Retainer SOW
INSERT INTO delivery_items (sow_contract_id, milestone, delivery_note, amount, payment_date, created_at, updated_at)
VALUES
    (@sow_approved_retainer, 'June 2025 Technical Support', 'Monthly technical support for June 2025. Provided 24/7 support, resolved critical issues, and maintained system uptime at 99.9%.', 58333.33, '2025-07-05', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

-- Delivery Items for Completed Retainer SOW
INSERT INTO delivery_items (sow_contract_id, milestone, delivery_note, amount, payment_date, created_at, updated_at)
VALUES
    (@sow_completed_retainer, 'February 2024 Support', 'Monthly support for February 2024. Resolved 20 tickets, performed system updates, and provided consultation.', 83333.33, '2024-03-15', DATE_SUB(NOW(), INTERVAL 360 DAY), NOW()),
    (@sow_completed_retainer, 'March 2024 Support', 'Monthly support for March 2024. Resolved 16 tickets, implemented feature enhancements, and conducted training.', 83333.33, '2024-04-15', DATE_SUB(NOW(), INTERVAL 330 DAY), NOW()),
    (@sow_completed_retainer, 'April 2024 Support', 'Monthly support for April 2024. Resolved 22 tickets, performed security updates, and optimized performance.', 83333.33, '2024-05-15', DATE_SUB(NOW(), INTERVAL 300 DAY), NOW()),
    (@sow_completed_retainer, 'May 2024 Support', 'Monthly support for May 2024. Resolved 18 tickets, deployed new features, and provided documentation.', 83333.33, '2024-06-15', DATE_SUB(NOW(), INTERVAL 270 DAY), NOW()),
    (@sow_completed_retainer, 'June 2024 Support', 'Monthly support for June 2024. Resolved 15 tickets, performed maintenance, and conducted code reviews.', 83333.33, '2024-07-15', DATE_SUB(NOW(), INTERVAL 240 DAY), NOW()),
    (@sow_completed_retainer, 'July 2024 Support', 'Monthly support for July 2024. Resolved 19 tickets, implemented optimizations, and provided technical support.', 83333.33, '2024-08-15', DATE_SUB(NOW(), INTERVAL 210 DAY), NOW()),
    (@sow_completed_retainer, 'August 2024 Support', 'Monthly support for August 2024. Resolved 17 tickets, performed updates, and conducted training sessions.', 83333.33, '2024-09-15', DATE_SUB(NOW(), INTERVAL 180 DAY), NOW()),
    (@sow_completed_retainer, 'September 2024 Support', 'Monthly support for September 2024. Resolved 21 tickets, deployed features, and provided consultation.', 83333.33, '2024-10-15', DATE_SUB(NOW(), INTERVAL 150 DAY), NOW()),
    (@sow_completed_retainer, 'October 2024 Support', 'Monthly support for October 2024. Resolved 14 tickets, performed maintenance, and optimized systems.', 83333.33, '2024-11-15', DATE_SUB(NOW(), INTERVAL 120 DAY), NOW()),
    (@sow_completed_retainer, 'November 2024 Support', 'Monthly support for November 2024. Resolved 16 tickets, implemented enhancements, and provided support.', 83333.33, '2024-12-15', DATE_SUB(NOW(), INTERVAL 90 DAY), NOW()),
    (@sow_completed_retainer, 'December 2024 Support', 'Monthly support for December 2024. Resolved 13 tickets, performed year-end maintenance, and provided documentation.', 83333.33, '2025-01-15', DATE_SUB(NOW(), INTERVAL 60 DAY), NOW());

-- Get Delivery Item IDs for billing details
SET @delivery_item_1_active = (SELECT id FROM delivery_items WHERE sow_contract_id = @sow_active_retainer AND milestone = 'January 2025 Support' LIMIT 1);
SET @delivery_item_2_active = (SELECT id FROM delivery_items WHERE sow_contract_id = @sow_active_retainer AND milestone = 'February 2025 Support' LIMIT 1);
SET @delivery_item_3_active = (SELECT id FROM delivery_items WHERE sow_contract_id = @sow_active_retainer AND milestone = 'March 2025 Support' LIMIT 1);
SET @delivery_item_4_active = (SELECT id FROM delivery_items WHERE sow_contract_id = @sow_active_retainer AND milestone = 'April 2025 Support' LIMIT 1);
SET @delivery_item_5_active = (SELECT id FROM delivery_items WHERE sow_contract_id = @sow_active_retainer AND milestone = 'May 2025 Support' LIMIT 1);

-- ============================================
-- 4. RETAINER BILLING DETAILS
-- ============================================

-- Billing Details for Active Retainer SOW
INSERT INTO retainer_billing_details (sow_contract_id, payment_date, delivery_note, amount, delivery_item_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_active_retainer, '2025-02-15', 'Payment for January 2025 support services. Invoice #INV-2025-001', 100000.00, @delivery_item_1_active, NULL, DATE_SUB(NOW(), INTERVAL 60 DAY), NOW()),
    (@sow_active_retainer, '2025-03-15', 'Payment for February 2025 support services. Invoice #INV-2025-002', 100000.00, @delivery_item_2_active, NULL, DATE_SUB(NOW(), INTERVAL 45 DAY), NOW()),
    (@sow_active_retainer, '2025-04-15', 'Payment for March 2025 support services. Invoice #INV-2025-003', 100000.00, @delivery_item_3_active, NULL, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
    (@sow_active_retainer, '2025-05-15', 'Payment for April 2025 support services. Invoice #INV-2025-004', 100000.00, @delivery_item_4_active, NULL, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW()),
    (@sow_active_retainer, '2025-06-15', 'Payment for May 2025 support services. Invoice #INV-2025-005', 100000.00, @delivery_item_5_active, NULL, DATE_SUB(NOW(), INTERVAL 0 DAY), NOW());

-- Billing Details for Pending Retainer SOW
INSERT INTO retainer_billing_details (sow_contract_id, payment_date, delivery_note, amount, delivery_item_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_pending_retainer, '2025-08-01', 'Payment for Q3 2025 DevOps support services. Invoice #INV-2025-006', 266666.67, NULL, NULL, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW());

-- Billing Details for Under Review Retainer SOW
INSERT INTO retainer_billing_details (sow_contract_id, payment_date, delivery_note, amount, delivery_item_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_under_review_retainer, '2025-05-20', 'Payment for April 2025 QA testing services. Invoice #INV-2025-007', 50000.00, NULL, NULL, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());

-- Billing Details for Approved Retainer SOW
INSERT INTO retainer_billing_details (sow_contract_id, payment_date, delivery_note, amount, delivery_item_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_approved_retainer, '2025-07-05', 'Payment for June 2025 technical support services. Invoice #INV-2025-008', 58333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Billing Details for Completed Retainer SOW
INSERT INTO retainer_billing_details (sow_contract_id, payment_date, delivery_note, amount, delivery_item_id, change_request_id, created_at, updated_at)
VALUES
    (@sow_completed_retainer, '2024-03-15', 'Payment for February 2024 support services. Invoice #INV-2024-001', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 355 DAY), NOW()),
    (@sow_completed_retainer, '2024-04-15', 'Payment for March 2024 support services. Invoice #INV-2024-002', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 325 DAY), NOW()),
    (@sow_completed_retainer, '2024-05-15', 'Payment for April 2024 support services. Invoice #INV-2024-003', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 295 DAY), NOW()),
    (@sow_completed_retainer, '2024-06-15', 'Payment for May 2024 support services. Invoice #INV-2024-004', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 265 DAY), NOW()),
    (@sow_completed_retainer, '2024-07-15', 'Payment for June 2024 support services. Invoice #INV-2024-005', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 235 DAY), NOW()),
    (@sow_completed_retainer, '2024-08-15', 'Payment for July 2024 support services. Invoice #INV-2024-006', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 205 DAY), NOW()),
    (@sow_completed_retainer, '2024-09-15', 'Payment for August 2024 support services. Invoice #INV-2024-007', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 175 DAY), NOW()),
    (@sow_completed_retainer, '2024-10-15', 'Payment for September 2024 support services. Invoice #INV-2024-008', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 145 DAY), NOW()),
    (@sow_completed_retainer, '2024-11-15', 'Payment for October 2024 support services. Invoice #INV-2024-009', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 115 DAY), NOW()),
    (@sow_completed_retainer, '2024-12-15', 'Payment for November 2024 support services. Invoice #INV-2024-010', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 85 DAY), NOW()),
    (@sow_completed_retainer, '2025-01-15', 'Payment for December 2024 support services. Invoice #INV-2024-011', 83333.33, NULL, NULL, DATE_SUB(NOW(), INTERVAL 55 DAY), NOW());

