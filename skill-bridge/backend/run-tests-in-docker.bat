@echo off
REM Script để chạy test trong Docker container (Windows)
REM Usage: run-tests-in-docker.bat [test-class]

setlocal enabledelayedexpansion

set TEST_CLASS=ContactFormValidatorTest
if not "%~1"=="" set TEST_CLASS=%~1

echo === Chạy Unit Test trong Docker Container ===
echo Test class: %TEST_CLASS%

REM Kiểm tra container đang chạy
docker ps --format "{{.Names}}" | findstr "skillbridge-backend-dev" >nul
if %errorlevel% equ 0 (
    echo Container skillbridge-backend-dev đang chạy
    set CONTAINER_NAME=skillbridge-backend-dev
    goto :run_test
)

docker ps --format "{{.Names}}" | findstr "skillbridge-backend" >nul
if %errorlevel% equ 0 (
    echo Container skillbridge-backend đang chạy
    set CONTAINER_NAME=skillbridge-backend
    goto :run_test
)

echo Không tìm thấy container đang chạy. Tạo container mới để chạy test...
cd ..
docker-compose -f docker-compose.dev.yml run --rm backend mvn test -Dtest=%TEST_CLASS%
goto :end

:run_test
REM Kiểm tra xem container có Maven không
docker exec %CONTAINER_NAME% which mvn >nul 2>&1
if %errorlevel% equ 0 (
    echo Container có Maven, chạy test trực tiếp...
    docker exec -it %CONTAINER_NAME% sh -c "cd /app && mvn test -Dtest=%TEST_CLASS%"
) else (
    echo Container không có Maven. Sử dụng builder stage...
    cd ..
    docker build --target builder -t skillbridge-backend-builder ./backend
    docker run --rm -v "%cd%\backend\src:/app/src" -v "%cd%\backend\pom.xml:/app/pom.xml" -v "%cd%\backend\src\test:/app/src/test" skillbridge-backend-builder mvn test -Dtest=%TEST_CLASS%
)

:end
echo === Hoàn thành ===

