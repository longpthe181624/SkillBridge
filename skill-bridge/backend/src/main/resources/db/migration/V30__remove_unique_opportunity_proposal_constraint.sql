-- V30__remove_unique_opportunity_proposal_constraint.sql
-- Remove unique constraint on opportunity_id to allow multiple proposal versions
-- The constraint was preventing creation of new proposal versions when client requests changes

SET @dbname = DATABASE();
SET @tablename = 'proposals';
SET @constraintname = 'unique_opportunity_proposal';

-- Check if constraint exists and drop it
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (CONSTRAINT_NAME = @constraintname)
  ) > 0,
  CONCAT('ALTER TABLE ', @tablename, ' DROP INDEX ', @constraintname),
  'SELECT 1'
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

