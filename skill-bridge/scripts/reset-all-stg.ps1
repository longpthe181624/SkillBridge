# Script to reset and rebuild all staging services from scratch
# Usage: .\scripts\reset-all-stg.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Reset All Staging Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all services
Write-Host "[1/7] Stopping all services..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml down
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Some services may not have been running" -ForegroundColor Gray
}
Write-Host "✓ All services stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Remove all containers
Write-Host "[2/7] Removing all containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml rm -f
Write-Host "✓ All containers removed" -ForegroundColor Green
Write-Host ""

# Step 3: Remove all volumes (WARNING: This deletes all data!)
Write-Host "[3/7] Removing all volumes (this will delete all data)..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml down -v
Write-Host "✓ All volumes removed" -ForegroundColor Green
Write-Host ""

# Step 4: Remove orphaned containers and networks
Write-Host "[4/7] Cleaning up orphaned resources..." -ForegroundColor Yellow
docker system prune -f --volumes
Write-Host "✓ Cleanup completed" -ForegroundColor Green
Write-Host ""

# Step 5: Build all images
Write-Host "[5/7] Building all images..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml build --no-cache
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ All images built successfully" -ForegroundColor Green
Write-Host ""

# Step 6: Start MySQL first and wait for it to be healthy
Write-Host "[6/7] Starting MySQL and waiting for it to be healthy..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml up -d mysql

# Wait for MySQL to be healthy (max 5 minutes)
$maxWait = 300  # 5 minutes
$elapsed = 0
$interval = 5

while ($elapsed -lt $maxWait) {
    $health = docker inspect skillbridge-mysql-stg --format='{{.State.Health.Status}}' 2>&1 | Out-String
    $health = $health.Trim()
    if ($health -eq "healthy") {
        Write-Host "✓ MySQL is healthy!" -ForegroundColor Green
        break
    }
    Write-Host "  Waiting for MySQL... ($elapsed/$maxWait seconds)" -ForegroundColor Gray
    Start-Sleep -Seconds $interval
    $elapsed += $interval
}

if ($elapsed -ge $maxWait) {
    Write-Host "✗ MySQL did not become healthy within $maxWait seconds" -ForegroundColor Red
    Write-Host "Check logs with: docker-compose -f docker-compose.stg.yml logs mysql" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 7: Start all other services
Write-Host "[7/7] Starting all other services..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to start services!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ All services started" -ForegroundColor Green
Write-Host ""

# Final status
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service Status:" -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml ps
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Yellow
Write-Host '  docker-compose -f docker-compose.stg.yml logs -f' -ForegroundColor Gray
Write-Host ""
Write-Host "To view MySQL logs:" -ForegroundColor Yellow
Write-Host '  docker-compose -f docker-compose.stg.yml logs -f mysql' -ForegroundColor Gray
Write-Host ""

