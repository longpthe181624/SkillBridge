@echo off
REM Repair Flyway - Delete failed migrations
REM Usage: repair_flyway.bat

echo ==========================================
echo   Repairing Flyway Migrations
echo ==========================================
echo.

set MYSQL_ROOT_PASSWORD=rootpassword
set DB_NAME=skillbridge_dev

echo [1/2] Checking failed migrations...
docker exec skillbridge-mysql-dev mysql -uroot -p%MYSQL_ROOT_PASSWORD% %DB_NAME% -e "SELECT version, description, success FROM flyway_schema_history WHERE success = 0;"

echo.
echo [2/2] Deleting failed migrations...
docker exec skillbridge-mysql-dev mysql -uroot -p%MYSQL_ROOT_PASSWORD% %DB_NAME% -e "DELETE FROM flyway_schema_history WHERE success = 0;"

if %ERRORLEVEL% EQU 0 (
    echo [OK] Failed migrations deleted successfully
    echo.
    echo Next step: Restart backend to re-run migrations
    echo Run: docker-compose -f docker-compose.dev.yml restart backend
) else (
    echo [ERROR] Failed to delete failed migrations
    pause
    exit /b 1
)

echo.
pause

