@echo off
REM ============================================
REM SKILL BRIDGE - STOP LOCAL ENVIRONMENT
REM ============================================

echo.
echo ========================================
echo   SKILL BRIDGE - STOPPING SERVICES
echo ========================================
echo.

echo Stopping all Docker containers...
docker-compose -f docker-compose.dev.yml down

echo.
echo ========================================
echo   ALL SERVICES STOPPED!
echo ========================================
echo.
echo All containers have been stopped and removed.
echo You can run START-LOCAL.bat to start again.
echo.
pause

