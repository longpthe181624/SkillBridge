#!/bin/bash

# Script để chạy test trong Docker container
# Usage: ./run-tests-in-docker.sh [test-class]

set -e

# Màu sắc cho output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Chạy Unit Test trong Docker Container ===${NC}"

# Kiểm tra xem có test class cụ thể không
TEST_CLASS=${1:-ContactControllerTest}

echo -e "${GREEN}Test class: ${TEST_CLASS}${NC}"

# Kiểm tra container đang chạy
if docker ps --format '{{.Names}}' | grep -q "skillbridge-backend-dev"; then
    echo -e "${GREEN}Container skillbridge-backend-dev đang chạy${NC}"
    CONTAINER_NAME="skillbridge-backend-dev"
elif docker ps --format '{{.Names}}' | grep -q "skillbridge-backend"; then
    echo -e "${GREEN}Container skillbridge-backend đang chạy${NC}"
    CONTAINER_NAME="skillbridge-backend"
else
    echo -e "${BLUE}Không tìm thấy container đang chạy. Tạo container mới để chạy test...${NC}"
    
    # Sử dụng builder stage để chạy test
    docker-compose -f ../docker-compose.dev.yml run --rm \
        -v "$(pwd)/src:/app/src" \
        -v "$(pwd)/pom.xml:/app/pom.xml" \
        backend sh -c "mvn test -Dtest=${TEST_CLASS}"
    exit 0
fi

# Kiểm tra xem container có Maven không
if docker exec ${CONTAINER_NAME} which mvn > /dev/null 2>&1; then
    echo -e "${GREEN}Container có Maven, chạy test trực tiếp...${NC}"
    docker exec -it ${CONTAINER_NAME} sh -c "cd /app && mvn test -Dtest=${TEST_CLASS}"
else
    echo -e "${BLUE}Container không có Maven. Sử dụng builder stage...${NC}"
    
    # Build image với builder stage và chạy test
    docker build --target builder -t skillbridge-backend-builder ./backend
    
    docker run --rm \
        -v "$(pwd)/src:/app/src" \
        -v "$(pwd)/pom.xml:/app/pom.xml" \
        skillbridge-backend-builder \
        mvn test -Dtest=${TEST_CLASS}
fi

echo -e "${GREEN}=== Hoàn thành ===${NC}"

