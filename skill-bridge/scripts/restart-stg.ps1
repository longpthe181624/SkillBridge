# Script to restart STG environment
# Usage: .\scripts\restart-stg.ps1

Write-Host "Restarting STG environment..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml restart

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ STG environment restarted" -ForegroundColor Green
    Write-Host ""
    Write-Host "Service Status:" -ForegroundColor Cyan
    docker-compose -f docker-compose.stg.yml ps
} else {
    Write-Host "✗ Failed to restart STG environment" -ForegroundColor Red
    exit 1
}

