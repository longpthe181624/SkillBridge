-- V47_1__repair_v46_checksum.sql
-- Repair checksum for V46 migration in flyway_schema_history
-- This fixes the checksum mismatch issue

-- Update checksum for V46 to match the current file
-- Note: This should be run before V47 to ensure proper migration order
UPDATE flyway_schema_history 
SET checksum = 944459797 
WHERE version = '46' AND checksum = 331523750;

