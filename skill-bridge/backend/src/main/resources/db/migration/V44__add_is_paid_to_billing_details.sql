-- Add is_paid column to retainer_billing_details table
ALTER TABLE retainer_billing_details
ADD COLUMN is_paid BOOLEAN NOT NULL DEFAULT FALSE;

-- Add is_paid column to fixed_price_billing_details table
ALTER TABLE fixed_price_billing_details
ADD COLUMN is_paid BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for better query performance when filtering by payment status
CREATE INDEX idx_retainer_billing_details_is_paid ON retainer_billing_details(is_paid);
CREATE INDEX idx_fixed_price_billing_details_is_paid ON fixed_price_billing_details(is_paid);

