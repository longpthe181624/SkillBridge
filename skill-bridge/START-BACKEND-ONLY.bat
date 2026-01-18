@echo off
REM ============================================
REM  SkillBridge - Start Backend & Database Only
REM ============================================
REM This script starts only the backend and database containers
REM Useful for frontend development outside Docker or API testing

echo.
echo ============================================
echo  SkillBridge - Backend Development
echo ============================================
echo.
echo Starting Backend and Database containers...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Stop any existing containers
echo [1/4] Stopping existing containers (if any)...
docker-compose -f docker-compose.dev.yml stop mysql backend 2>nul
echo.

REM Remove old containers to ensure clean start
echo [2/4] Removing old containers...
docker-compose -f docker-compose.dev.yml rm -f mysql backend 2>nul
echo.

REM Start MySQL database
echo [3/4] Starting MySQL database...
docker-compose -f docker-compose.dev.yml up -d mysql
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start MySQL!
    pause
    exit /b 1
)
echo     MySQL started successfully!
echo.

REM Wait for MySQL to be ready
echo Waiting for MySQL to be ready...
timeout /t 10 /nobreak >nul
echo.

REM Start Backend
echo [4/4] Starting Spring Boot backend...
docker-compose -f docker-compose.dev.yml up -d --build backend
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start backend!
    pause
    exit /b 1
)
echo     Backend started successfully!
echo.

echo ============================================
echo  Backend Environment Started Successfully!
echo ============================================
echo.
echo Services:
echo   - MySQL Database : http://localhost:3307
echo   - Backend API    : http://localhost:8081/api
echo.
echo Database Credentials:
echo   - Host     : localhost:3307
echo   - Database : skillbridge_dev
echo   - Username : skillbridge_dev
echo   - Password : skillbridge_dev_password
echo   - Root Pwd : rootpassword
echo.
echo API Endpoints:
echo   - Health Check : http://localhost:8081/api/actuator/health
echo   - Statistics   : http://localhost:8081/api/public/homepage/statistics
echo   - Engineers    : http://localhost:8081/api/public/homepage/engineers
echo.
echo Useful Commands:
echo   - View backend logs : docker logs skillbridge-backend-dev -f
echo   - View MySQL logs   : docker logs skillbridge-mysql-dev -f
echo   - Stop containers   : docker-compose -f docker-compose.dev.yml stop mysql backend
echo   - Restart backend   : docker-compose -f docker-compose.dev.yml restart backend
echo.
echo To stop the backend environment, run: STOP-BACKEND-ONLY.bat
echo.
pause

