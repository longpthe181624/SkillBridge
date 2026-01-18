#!/bin/bash

# SkillBridge Development Environment Startup Script

echo "🚀 Starting SkillBridge Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Starting development environment with Docker Compose..."

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."

# Check MySQL
if docker-compose -f docker-compose.dev.yml ps mysql | grep -q "Up"; then
    echo "✅ MySQL is running on port 3307"
else
    echo "❌ MySQL failed to start"
fi

# Check Backend
if docker-compose -f docker-compose.dev.yml ps backend | grep -q "Up"; then
    echo "✅ Backend is running on port 8081"
else
    echo "❌ Backend failed to start"
fi

# Check Frontend
if docker-compose -f docker-compose.dev.yml ps frontend | grep -q "Up"; then
    echo "✅ Frontend is running on port 3001"
else
    echo "❌ Frontend failed to start"
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📱 Access URLs:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:8081/api"
echo "   Swagger UI: http://localhost:8081/api/swagger-ui.html"
echo "   Database: localhost:3307"
echo ""
echo "📊 To view logs:"
echo "   docker-compose -f docker-compose.dev.yml logs -f"
echo ""
echo "🛑 To stop environment:"
echo "   docker-compose -f docker-compose.dev.yml down"
echo ""

