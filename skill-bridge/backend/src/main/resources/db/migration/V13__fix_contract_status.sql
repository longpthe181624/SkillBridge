-- V13__fix_contract_status.sql
-- Fix contract status values to match enum definitions
-- Update 'Under Review' to 'Under_Review' to match Contract.ContractStatus enum

UPDATE contracts 
SET status = 'Under_Review' 
WHERE status = 'Under Review';

