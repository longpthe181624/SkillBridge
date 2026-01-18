@echo off
REM Check Flyway migration status
REM Usage: check_flyway_status.bat

echo ==========================================
echo   Checking Flyway Migration Status
echo ==========================================
echo.

set MYSQL_ROOT_PASSWORD=rootpassword
set DB_NAME=skillbridge_dev

echo [1/2] Checking migration history...
docker exec skillbridge-mysql-dev mysql -uroot -p%MYSQL_ROOT_PASSWORD% %DB_NAME% -e "SELECT version, description, type, installed_on, success, checksum FROM flyway_schema_history ORDER BY installed_rank;"

echo.
echo [2/2] Checking for failed migrations...
docker exec skillbridge-mysql-dev mysql -uroot -p%MYSQL_ROOT_PASSWORD% %DB_NAME% -e "SELECT version, description, installed_on, success FROM flyway_schema_history WHERE success = 0;"

echo.
echo ==========================================
echo   If migrations failed, repair with:
echo   docker exec skillbridge-mysql-dev mysql -uroot -p%MYSQL_ROOT_PASSWORD% %DB_NAME% -e "DELETE FROM flyway_schema_history WHERE success = 0;"
echo ==========================================
echo.
pause

