@echo off
REM ============================================
REM  SkillBridge - Stop Backend & Database Only
REM ============================================
REM This script stops the backend and database containers

echo.
echo ============================================
echo  SkillBridge - Stop Backend Environment
echo ============================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Stop backend and database containers
echo Stopping backend and database containers...
docker-compose -f docker-compose.dev.yml stop backend mysql

if %errorlevel% neq 0 (
    echo [ERROR] Failed to stop containers!
    pause
    exit /b 1
)

echo.
echo ============================================
echo  Backend Environment Stopped Successfully!
echo ============================================
echo.
echo Containers stopped:
echo   - skillbridge-backend-dev
echo   - skillbridge-mysql-dev
echo.
echo Note: Containers are stopped but not removed.
echo To start again, run: START-BACKEND-ONLY.bat
echo.
echo To completely remove containers and data:
echo   docker-compose -f docker-compose.dev.yml down -v
echo.
pause

