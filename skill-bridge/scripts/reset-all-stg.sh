#!/bin/bash
# Script to reset and rebuild all staging services from scratch
# Usage: ./scripts/reset-all-stg.sh

echo "========================================"
echo "  Reset All Staging Services"
echo "========================================"
echo ""

# Step 1: Stop all services
echo "[1/7] Stopping all services..."
docker-compose -f docker-compose.stg.yml down
echo "✓ All services stopped"
echo ""

# Step 2: Remove all containers
echo "[2/7] Removing all containers..."
docker-compose -f docker-compose.stg.yml rm -f
echo "✓ All containers removed"
echo ""

# Step 3: Remove all volumes (WARNING: This deletes all data!)
echo "[3/7] Removing all volumes (this will delete all data)..."
docker-compose -f docker-compose.stg.yml down -v
echo "✓ All volumes removed"
echo ""

# Step 4: Remove orphaned containers and networks
echo "[4/7] Cleaning up orphaned resources..."
docker system prune -f --volumes
echo "✓ Cleanup completed"
echo ""

# Step 5: Build all images
echo "[5/7] Building all images..."
docker-compose -f docker-compose.stg.yml build --no-cache
if [ $? -ne 0 ]; then
    echo "✗ Build failed!"
    exit 1
fi
echo "✓ All images built successfully"
echo ""

# Step 6: Start MySQL first and wait for it to be healthy
echo "[6/7] Starting MySQL and waiting for it to be healthy..."
docker-compose -f docker-compose.stg.yml up -d mysql

# Wait for MySQL to be healthy (max 5 minutes)
MAX_WAIT=300  # 5 minutes
ELAPSED=0
INTERVAL=5

while [ $ELAPSED -lt $MAX_WAIT ]; do
    HEALTH=$(docker inspect skillbridge-mysql-stg --format='{{.State.Health.Status}}' 2>/dev/null)
    if [ "$HEALTH" = "healthy" ]; then
        echo "✓ MySQL is healthy!"
        break
    fi
    echo "  Waiting for MySQL... ($ELAPSED/$MAX_WAIT seconds)"
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo "✗ MySQL did not become healthy within $MAX_WAIT seconds"
    echo "Check logs with: docker-compose -f docker-compose.stg.yml logs mysql"
    exit 1
fi
echo ""

# Step 7: Start all other services
echo "[7/7] Starting all other services..."
docker-compose -f docker-compose.stg.yml up -d
if [ $? -ne 0 ]; then
    echo "✗ Failed to start services!"
    exit 1
fi
echo "✓ All services started"
echo ""

# Final status
echo "========================================"
echo "  Deployment Complete!"
echo "========================================"
echo ""
echo "Service Status:"
docker-compose -f docker-compose.stg.yml ps
echo ""
echo "To view logs:"
echo "  docker-compose -f docker-compose.stg.yml logs -f"
echo ""
echo "To view MySQL logs:"
echo "  docker-compose -f docker-compose.stg.yml logs -f mysql"
echo ""

