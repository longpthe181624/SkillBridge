-- Add billing type support for engaged engineers (Monthly/Hourly)
-- This migration adds billing_type, hourly_rate, hours, and subtotal columns
-- to support both Monthly and Hourly billing contracts

-- Add columns to sow_engaged_engineers table
ALTER TABLE sow_engaged_engineers 
ADD COLUMN billing_type VARCHAR(20) NOT NULL DEFAULT 'Monthly' 
  AFTER end_date,
ADD COLUMN hourly_rate DECIMAL(16, 2) NULL 
  AFTER billing_type,
ADD COLUMN hours DECIMAL(10, 2) NULL 
  AFTER hourly_rate,
ADD COLUMN subtotal DECIMAL(16, 2) NULL 
  AFTER hours;

-- Add columns to change_request_engaged_engineers table
ALTER TABLE change_request_engaged_engineers 
ADD COLUMN billing_type VARCHAR(20) NOT NULL DEFAULT 'Monthly' 
  AFTER end_date,
ADD COLUMN hourly_rate DECIMAL(16, 2) NULL 
  AFTER billing_type,
ADD COLUMN hours DECIMAL(10, 2) NULL 
  AFTER hourly_rate,
ADD COLUMN subtotal DECIMAL(16, 2) NULL 
  AFTER hours;

-- Add constraint to ensure billing_type is either 'Monthly' or 'Hourly'
ALTER TABLE sow_engaged_engineers 
ADD CONSTRAINT chk_billing_type 
CHECK (billing_type IN ('Monthly', 'Hourly'));

ALTER TABLE change_request_engaged_engineers 
ADD CONSTRAINT chk_cr_billing_type 
CHECK (billing_type IN ('Monthly', 'Hourly'));

-- Update existing records to ensure consistency
-- For existing Monthly contracts, set hourly_rate, hours, subtotal to NULL
UPDATE sow_engaged_engineers 
SET hourly_rate = NULL, hours = NULL, subtotal = NULL 
WHERE billing_type = 'Monthly';

UPDATE change_request_engaged_engineers 
SET hourly_rate = NULL, hours = NULL, subtotal = NULL 
WHERE billing_type = 'Monthly';

