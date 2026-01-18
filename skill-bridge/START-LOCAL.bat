@echo off
REM ============================================
REM SKILL BRIDGE - START LOCAL ENVIRONMENT
REM ============================================

echo.
echo ========================================
echo   SKILL BRIDGE - LOCAL ENVIRONMENT
echo ========================================
echo.

REM Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [1/5] Stopping existing containers...
docker-compose -f docker-compose.dev.yml down

echo.
echo [2/5] Rebuilding frontend image to ensure all dependencies are installed...
docker-compose -f docker-compose.dev.yml build frontend

echo.
echo [3/5] Starting all services...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo [4/5] Waiting for services to start (up to 2 minutes)...
REM Smart wait: poll backend health until it's UP or timeout
powershell -Command "$ErrorActionPreference='SilentlyContinue'; $deadline = (Get-Date).AddMinutes(2); while((Get-Date) -lt $deadline){ try { $r = Invoke-WebRequest -Uri http://localhost:8081/api/actuator/health -TimeoutSec 5; if($r.StatusCode -eq 200){ $body = $r.Content; $status=''; try { $json = $body | ConvertFrom-Json; $status = $json.status } catch { } if($status -eq 'UP' -or ($body -match '"status"\s*:\s*"UP"') -or ($body -like '*UP*')){ Write-Host 'Backend is UP'; exit 0 } } } catch { } Start-Sleep -Seconds 3 } exit 0"

echo.
echo [5/5] Checking service status...
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo ========================================
echo   TESTING BACKEND API
echo ========================================
echo.

echo Testing backend health...
powershell -Command "try { $r = Invoke-WebRequest -Uri http://localhost:8081/api/actuator/health -TimeoutSec 5; if($r.StatusCode -eq 200){ $body = $r.Content; $status=''; try { $json = $body | ConvertFrom-Json; $status = $json.status } catch { } if($status -eq 'UP' -or ($body -match '"status"\s*:\s*"UP"') -or ($body -like '*UP*')){ Write-Host '[OK] Backend is healthy' -ForegroundColor Green } else { if([string]::IsNullOrEmpty($status)){ Write-Host '[WARN] Could not parse health JSON but HTTP 200 received' -ForegroundColor Yellow } else { Write-Host ('[FAIL] Backend unhealthy: ' + $status) -ForegroundColor Red } } } else { Write-Host ('[FAIL] Backend HTTP ' + $r.StatusCode) -ForegroundColor Red } } catch { Write-Host '[FAIL] Backend not responding' -ForegroundColor Red }"

echo.
echo Testing engineers API...
powershell -Command "$ErrorActionPreference='SilentlyContinue'; $ok=$false; for($i=0;$i -lt 5;$i++){ try { $r = Invoke-WebRequest -Uri http://localhost:8081/api/public/homepage/engineers -TimeoutSec 5; if($r.StatusCode -eq 200){ $data = $r.Content | ConvertFrom-Json; $count = 0; if($data -is [System.Collections.IEnumerable]){ $count = $data.Count } Write-Host '[OK] Engineers API returned' $count 'items' -ForegroundColor Green; $ok=$true; break } } catch { } Start-Sleep -Seconds 2 }; if(-not $ok){ Write-Host '[FAIL] Engineers API not responding' -ForegroundColor Red }"

echo.
echo ========================================
echo   SERVICES READY!
echo ========================================
echo.
echo Frontend:  http://localhost:3001/
echo Backend:   http://localhost:8081/api/actuator/health
echo Database:  localhost:3307 (user: skillbridge_dev, pass: dev_password123)
echo.
echo ========================================
echo   IMPORTANT: CLEAR BROWSER CACHE!
echo ========================================
echo.
echo Press Ctrl + Shift + R in your browser to hard refresh
echo Or use Incognito mode: Ctrl + Shift + N
echo.

echo Opening homepage in browser...
start http://localhost:3001/

echo.
echo Press any key to view logs (Ctrl+C to exit logs)
pause >nul

echo.
echo Showing backend logs (Press Ctrl+C to stop)...
docker logs -f skillbridge-backend-dev

