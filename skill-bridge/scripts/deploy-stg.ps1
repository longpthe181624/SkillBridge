# Script Deploy STG Environment - SkillBridge
# Usage: .\scripts\deploy-stg.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SkillBridge STG Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if docker-compose is available
Write-Host "Checking Docker Compose..." -ForegroundColor Yellow
try {
    docker-compose --version | Out-Null
    Write-Host "✓ Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker Compose is not available." -ForegroundColor Red
    exit 1
}

# Check SSL certificates
Write-Host "Checking SSL certificates..." -ForegroundColor Yellow
if (-not (Test-Path "nginx\ssl\cert.pem") -or -not (Test-Path "nginx\ssl\key.pem")) {
    Write-Host "⚠ SSL certificates not found in nginx\ssl\" -ForegroundColor Yellow
    Write-Host "  Please add cert.pem and key.pem to nginx\ssl\ directory" -ForegroundColor Yellow
    Write-Host "  Or create self-signed certificates for testing" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
} else {
    Write-Host "✓ SSL certificates found" -ForegroundColor Green
}

# Check .env.stg file
Write-Host "Checking environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env.stg")) {
    Write-Host "⚠ .env.stg file not found" -ForegroundColor Yellow
    Write-Host "  Creating .env.stg from template..." -ForegroundColor Yellow
    Copy-Item ".env.stg.example" ".env.stg" -ErrorAction SilentlyContinue
    if (-not (Test-Path ".env.stg")) {
        Write-Host "  Please create .env.stg file with your configuration" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ .env.stg file found" -ForegroundColor Green
}

# Stop existing containers
Write-Host ""
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml down

# Build images
Write-Host ""
Write-Host "Building Docker images..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build completed" -ForegroundColor Green

# Start services
Write-Host ""
Write-Host "Starting services..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to start services!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Services started" -ForegroundColor Green

# Wait for services to be ready
Write-Host ""
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host ""
Write-Host "Service Status:" -ForegroundColor Cyan
docker-compose -f docker-compose.stg.yml ps

# Health check
Write-Host ""
Write-Host "Performing health checks..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $health = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 5
    if ($health.StatusCode -eq 200) {
        Write-Host "✓ Nginx health check passed" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Nginx health check failed (may need more time)" -ForegroundColor Yellow
}

try {
    $backendHealth = Invoke-WebRequest -Uri "http://localhost:8082/api/actuator/health" -UseBasicParsing -TimeoutSec 5
    if ($backendHealth.StatusCode -eq 200) {
        Write-Host "✓ Backend health check passed" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Backend health check failed (may need more time)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  - Backend API: https://api.skill-bridge.dev.inisoft.vn/" -ForegroundColor White
Write-Host "  - Backend Direct (localhost): http://localhost:8082/api" -ForegroundColor White
Write-Host "  - phpMyAdmin: http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "phpMyAdmin Login:" -ForegroundColor Cyan
Write-Host "  - Username: root" -ForegroundColor White
Write-Host "  - Password: rootpassword" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  - View logs: docker-compose -f docker-compose.stg.yml logs -f" -ForegroundColor White
Write-Host "  - Stop: docker-compose -f docker-compose.stg.yml down" -ForegroundColor White
Write-Host "  - Restart: docker-compose -f docker-compose.stg.yml restart" -ForegroundColor White
Write-Host ""

