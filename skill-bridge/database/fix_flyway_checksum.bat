@echo off
REM Fix Flyway checksum mismatch for migrations V4 and V5
REM Usage: fix_flyway_checksum.bat

echo ==========================================
echo   Fixing Flyway Checksum Mismatch
echo ==========================================
echo.

set MYSQL_ROOT_PASSWORD=rootpassword
set DB_NAME=skillbridge_dev

echo [1/3] Checking current checksums...
docker exec skillbridge-mysql-dev mysql -uroot -p%MYSQL_ROOT_PASSWORD% %DB_NAME% -e "SELECT version, description, checksum FROM flyway_schema_history WHERE version IN (4, 5);"

echo.
echo [2/3] Updating checksums to match current migration files...
echo   - V4: 304656614 (add engineer details tables)
echo   - V5: 1843192103 (add contact management tables)

docker exec skillbridge-mysql-dev mysql -uroot -p%MYSQL_ROOT_PASSWORD% %DB_NAME% -e "UPDATE flyway_schema_history SET checksum = 304656614 WHERE version = 4; UPDATE flyway_schema_history SET checksum = 1843192103 WHERE version = 5;"

if %ERRORLEVEL% EQU 0 (
    echo [OK] Checksums updated successfully
) else (
    echo [ERROR] Failed to update checksums
    pause
    exit /b 1
)

echo.
echo [3/3] Verifying checksums...
docker exec skillbridge-mysql-dev mysql -uroot -p%MYSQL_ROOT_PASSWORD% %DB_NAME% -e "SELECT version, description, checksum FROM flyway_schema_history WHERE version IN (4, 5);"

echo.
echo ==========================================
echo   Next step: Restart backend
echo ==========================================
echo Run: docker-compose -f docker-compose.dev.yml restart backend
echo.
pause

