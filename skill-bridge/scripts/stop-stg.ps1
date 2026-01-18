# Script to stop STG environment
# Usage: .\scripts\stop-stg.ps1

Write-Host "Stopping STG environment..." -ForegroundColor Yellow
docker-compose -f docker-compose.stg.yml down

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ STG environment stopped" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to stop STG environment" -ForegroundColor Red
    exit 1
}

