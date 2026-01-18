# Script to rebuild frontend with correct API URL for STG
# Usage: .\scripts\rebuild-frontend-stg.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Rebuild Frontend for STG" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠ IMPORTANT: Frontend must be rebuilt to apply NEXT_PUBLIC_API_URL changes!" -ForegroundColor Yellow
Write-Host "   Next.js compiles NEXT_PUBLIC_* variables at BUILD TIME, not runtime." -ForegroundColor Yellow
Write-Host ""

# Stop frontend container
Write-Host "Stopping frontend container..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml stop frontend

# Remove old frontend container
Write-Host "Removing old frontend container..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml rm -f frontend

# Rebuild frontend with no cache to ensure fresh build
Write-Host ""
Write-Host "Rebuilding frontend image (this may take a few minutes)..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml build --no-cache frontend

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Frontend rebuilt successfully" -ForegroundColor Green

# Start frontend
Write-Host ""
Write-Host "Starting frontend..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml up -d frontend

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to start frontend!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Frontend started" -ForegroundColor Green

# Wait a bit for service to be ready
Write-Host ""
Write-Host "Waiting for frontend to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check status
Write-Host ""
Write-Host "Frontend Status:" -ForegroundColor Cyan
docker-compose -f docker-compose.stg.yml ps frontend

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend rebuild completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend URL: http://localhost:3000" -ForegroundColor White
Write-Host "API URL: https://api.skill-bridge.dev.inisoft.vn/" -ForegroundColor White
Write-Host ""
Write-Host "To verify API URL is correct:" -ForegroundColor Cyan
Write-Host "  1. Open http://localhost:3000 in browser" -ForegroundColor White
Write-Host "  2. Open Developer Tools (F12)" -ForegroundColor White
Write-Host "  3. Check Network tab - API calls should go to https://api.skill-bridge.dev.inisoft.vn/api/..." -ForegroundColor White
Write-Host ""

