#!/bin/bash

# SkillBridge Production Environment Startup Script

echo "🚀 Starting SkillBridge Production Environment..."

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

echo "📦 Starting production environment with Docker Compose..."

# Start production environment
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check if services are running
echo "🔍 Checking service status..."

# Check MySQL
if docker-compose ps mysql | grep -q "Up"; then
    echo "✅ MySQL is running on port 3306"
else
    echo "❌ MySQL failed to start"
fi

# Check Backend
if docker-compose ps backend | grep -q "Up"; then
    echo "✅ Backend is running on port 8080"
else
    echo "❌ Backend failed to start"
fi

# Check Frontend
if docker-compose ps frontend | grep -q "Up"; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend failed to start"
fi

echo ""
echo "🎉 Production environment is ready!"
echo ""
echo "📱 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080/api"
echo "   Swagger UI: http://localhost:8080/api/swagger-ui.html"
echo "   Database: localhost:3306"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop environment:"
echo "   docker-compose down"
echo ""

