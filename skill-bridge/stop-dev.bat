@echo off
title SkillBridge - Stop Development Environment
color 0C

echo ========================================
echo   Stopping SkillBridge Development Environment
echo ========================================
echo.

echo Stopping Docker containers...
docker-compose -f docker-compose.dev.yml down

echo.
echo Killing Java processes (Spring Boot)...
taskkill /f /im java.exe >nul 2>&1

echo.
echo Killing Node.js processes (Next.js)...
taskkill /f /im node.exe >nul 2>&1

echo.
echo ========================================
echo   Development Environment Stopped!
echo ========================================
echo.
echo All services have been stopped.
echo You can now run start-dev.bat again when needed.
echo.
pause
