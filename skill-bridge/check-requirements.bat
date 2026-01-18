@echo off
title SkillBridge - System Requirements Check
color 0E

echo ========================================
echo   SkillBridge System Requirements Check
echo ========================================
echo.

set "all_good=true"

echo Checking system requirements...
echo.

REM Check Docker
echo [1/4] Checking Docker Desktop...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker: OK
    docker --version
) else (
    echo ❌ Docker: NOT FOUND
    echo    Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    set "all_good=false"
)
echo.

REM Check Java
echo [2/4] Checking Java...
java --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Java: OK
    java --version 2>&1 | findstr "version"
) else (
    echo ❌ Java: NOT FOUND
    echo    Please install Java 17+ from: https://adoptium.net/
    set "all_good=false"
)
echo.

REM Check Node.js
echo [3/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js: OK
    node --version
) else (
    echo ❌ Node.js: NOT FOUND
    echo    Please install Node.js 18+ from: https://nodejs.org/
    set "all_good=false"
)
echo.

REM Check npm
echo [4/4] Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ npm: OK
    npm --version
) else (
    echo ❌ npm: NOT FOUND
    echo    npm should come with Node.js installation
    set "all_good=false"
)
echo.

echo ========================================
if "%all_good%"=="true" (
    echo 🎉 All requirements are satisfied!
    echo.
    echo You can now run: start-dev.bat
    color 0A
) else (
    echo ❌ Some requirements are missing!
    echo.
    echo Please install the missing components and run this check again.
    color 0C
)
echo ========================================
echo.
pause
