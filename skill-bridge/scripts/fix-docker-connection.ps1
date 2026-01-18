# Script to fix Docker connection issues on Windows
# Usage: .\scripts\fix-docker-connection.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Docker Connection Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker Desktop is running
Write-Host "Checking Docker Desktop status..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Docker CLI is available: $dockerVersion" -ForegroundColor Green
    } else {
        Write-Host "✗ Docker CLI not found" -ForegroundColor Red
        Write-Host "  Please install Docker Desktop for Windows" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "✗ Docker CLI not found" -ForegroundColor Red
    Write-Host "  Please install Docker Desktop for Windows" -ForegroundColor Yellow
    exit 1
}

# Check Docker daemon connection
Write-Host ""
Write-Host "Checking Docker daemon connection..." -ForegroundColor Yellow
try {
    docker ps 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Docker daemon is running" -ForegroundColor Green
    } else {
        Write-Host "✗ Cannot connect to Docker daemon" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please try the following:" -ForegroundColor Yellow
        Write-Host "  1. Open Docker Desktop application" -ForegroundColor White
        Write-Host "  2. Wait for Docker Desktop to fully start (whale icon should be steady)" -ForegroundColor White
        Write-Host "  3. Check if Docker Desktop is running in system tray" -ForegroundColor White
        Write-Host "  4. Restart Docker Desktop if needed" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host "✗ Cannot connect to Docker daemon" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please try the following:" -ForegroundColor Yellow
    Write-Host "  1. Open Docker Desktop application" -ForegroundColor White
    Write-Host "  2. Wait for Docker Desktop to fully start" -ForegroundColor White
    Write-Host "  3. Restart Docker Desktop if needed" -ForegroundColor White
    exit 1
}

# Check for existing containers
Write-Host ""
Write-Host "Checking for existing containers..." -ForegroundColor Yellow
$existingContainers = docker ps -a --filter "name=skillbridge" --format "{{.Names}}" 2>&1
if ($existingContainers -and $existingContainers.Count -gt 0) {
    Write-Host "⚠ Found existing containers:" -ForegroundColor Yellow
    $existingContainers | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
    Write-Host ""
    $remove = Read-Host "Remove existing containers? (y/n)"
    if ($remove -eq "y") {
        Write-Host "Removing existing containers..." -ForegroundColor Yellow
        docker-compose -f docker-compose.stg.yml down 2>&1 | Out-Null
        Write-Host "✓ Containers removed" -ForegroundColor Green
    }
} else {
    Write-Host "✓ No existing containers found" -ForegroundColor Green
}

# Check for existing networks
Write-Host ""
Write-Host "Checking for existing networks..." -ForegroundColor Yellow
$existingNetworks = docker network ls --filter "name=skillbridge-stg" --format "{{.Name}}" 2>&1
if ($existingNetworks -and $existingNetworks.Count -gt 0) {
    Write-Host "✓ Network exists" -ForegroundColor Green
} else {
    Write-Host "ℹ Network will be created" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Docker connection check completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now try:" -ForegroundColor Cyan
Write-Host "  docker-compose -f docker-compose.stg.yml up -d" -ForegroundColor White
Write-Host ""

