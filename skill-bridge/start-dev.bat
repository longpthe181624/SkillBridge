@echo off
title SkillBridge Development Environment
color 0A

echo ========================================
echo   SkillBridge Development Environment
echo ========================================
echo.

REM Check if Docker is running
echo [1/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop and start it first.
    pause
    exit /b 1
)

REM Check if Java is installed
echo [2/5] Checking Java...
java --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java 17+ is not installed!
    echo Please install Java 17 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
echo [3/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [4/5] Starting MySQL Database...
docker-compose -f docker-compose.dev.yml up mysql -d

echo Waiting for MySQL to start...
timeout /t 15 /nobreak

echo [5/5] Starting Backend and Frontend...
echo.
echo Starting Backend (Spring Boot)...
start "SkillBridge Backend" cmd /k "cd /d %~dp0backend && echo Starting Backend... && mvnw.cmd spring-boot:run"

echo Waiting 5 seconds before starting Frontend...
timeout /t 5 /nobreak

echo Starting Frontend (Next.js)...
start "SkillBridge Frontend" cmd /k "cd /d %~dp0frontend && echo Starting Frontend... && npm run dev"

echo.
echo ========================================
echo   Development Environment Started!
echo ========================================
echo.
echo Access URLs:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8080/api
echo - Database: localhost:3307
echo - Swagger UI: http://localhost:8080/api/swagger-ui.html
echo.
echo Database Info:
echo - Host: localhost:3307
echo - Database: skillbridge_dev
echo - Username: skillbridge_dev
echo - Password: skillbridge_dev_password
echo.
echo Note: It may take 2-3 minutes for all services to fully start.
echo Check the opened terminal windows for detailed logs.
echo.
echo Press any key to close this window...
pause >nul
