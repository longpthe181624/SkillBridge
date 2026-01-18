# Script to generate self-signed SSL certificate for STG environment
# WARNING: Self-signed certificates are for testing only!
# For production, use proper SSL certificates from a trusted CA

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Generate Self-Signed SSL Certificate" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if OpenSSL is available
Write-Host "Checking for OpenSSL..." -ForegroundColor Yellow

# Try to find OpenSSL
$openssl = $null
$possiblePaths = @(
    "C:\Program Files\Git\usr\bin\openssl.exe",
    "C:\OpenSSL-Win64\bin\openssl.exe",
    "C:\Program Files\OpenSSL-Win64\bin\openssl.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $openssl = $path
        break
    }
}

# Check if openssl is in PATH
if ($null -eq $openssl) {
    try {
        $openssl = (Get-Command openssl -ErrorAction Stop).Source
    } catch {
        Write-Host "✗ OpenSSL not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install OpenSSL:" -ForegroundColor Yellow
        Write-Host "  1. Download from: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor White
        Write-Host "  2. Or use Git Bash (usually includes OpenSSL)" -ForegroundColor White
        Write-Host "  3. Or install via Chocolatey: choco install openssl" -ForegroundColor White
        exit 1
    }
}

Write-Host "✓ OpenSSL found at: $openssl" -ForegroundColor Green

# Create ssl directory if not exists
$sslDir = "nginx\ssl"
if (-not (Test-Path $sslDir)) {
    New-Item -ItemType Directory -Path $sslDir | Out-Null
    Write-Host "✓ Created $sslDir directory" -ForegroundColor Green
}

# Generate private key
Write-Host ""
Write-Host "Generating private key..." -ForegroundColor Yellow
& $openssl genrsa -out "$sslDir\key.pem" 2048

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate private key!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Private key generated" -ForegroundColor Green

# Generate certificate signing request and self-signed certificate
Write-Host ""
Write-Host "Generating certificate..." -ForegroundColor Yellow

$certConfig = @"
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = VN
ST = Ho Chi Minh
L = Ho Chi Minh City
O = Inisoft
OU = IT Department
CN = dev-skillbridge.inisoft.vn

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = dev-skillbridge.inisoft.vn
DNS.2 = *.dev-skillbridge.inisoft.vn
"@

$configFile = "$sslDir\cert.conf"
$certConfig | Out-File -FilePath $configFile -Encoding ASCII

& $openssl req -new -x509 -key "$sslDir\key.pem" -out "$sslDir\cert.pem" -days 365 -config $configFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate certificate!" -ForegroundColor Red
    Remove-Item $configFile -ErrorAction SilentlyContinue
    exit 1
}

# Clean up config file
Remove-Item $configFile -ErrorAction SilentlyContinue

Write-Host "✓ Certificate generated" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SSL Certificate Generated Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files created:" -ForegroundColor Cyan
Write-Host "  - $sslDir\key.pem (Private Key)" -ForegroundColor White
Write-Host "  - $sslDir\cert.pem (Certificate)" -ForegroundColor White
Write-Host ""
Write-Host "⚠ WARNING: This is a self-signed certificate!" -ForegroundColor Yellow
Write-Host "  Browsers will show a security warning." -ForegroundColor Yellow
Write-Host "  For production, use certificates from a trusted CA." -ForegroundColor Yellow
Write-Host ""

