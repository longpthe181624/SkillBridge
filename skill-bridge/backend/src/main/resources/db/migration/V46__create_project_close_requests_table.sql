-- V46__create_project_close_requests_table.sql
-- Create project_close_requests table for Story-41: Project Close Request for SOW Contract

CREATE TABLE IF NOT EXISTS project_close_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sow_id INT NOT NULL,
  requested_by_user_id INT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'ClientApproved', 'Rejected'
  message TEXT NULL,
  links TEXT NULL, -- URLs to documents, feedback forms, etc. (one per line or JSON array)
  client_reject_reason TEXT NULL, -- reason provided by Client when rejecting
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sow_id) REFERENCES sow_contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (requested_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_close_requests_sow_id (sow_id),
  INDEX idx_project_close_requests_status (status),
  INDEX idx_project_close_requests_requested_by (requested_by_user_id),
  INDEX idx_project_close_requests_created_at (created_at)
);

-- Add unique constraint to ensure only one Pending request per SOW
-- Note: MySQL doesn't support partial unique indexes directly, so we'll use a trigger or application-level check
-- For now, we'll rely on application-level validation, but add a unique index on (sow_id, status) 
-- where status = 'Pending' using a workaround with a generated column or application logic

-- Add constraint to ensure status is one of the valid values
ALTER TABLE project_close_requests 
ADD CONSTRAINT chk_project_close_request_status 
CHECK (status IN ('Pending', 'ClientApproved', 'Rejected'));

