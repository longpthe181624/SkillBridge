# SkillBridge Platform - Local Development Setup

## 🚀 Project Overview

This is the SkillBridge platform project with:
- **Backend**: Spring Boot 3.x with Java 17
- **Frontend**: Next.js 14+ with TypeScript and Tailwind CSS
- **Database**: MySQL 8.0
- **Containerization**: Docker and Docker Compose

## 📋 Prerequisites

- Java 17+
- Node.js 18+
- Docker and Docker Compose
- Maven 3.8+

## 🏗️ Project Structure

```
skill-bridge-new/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   ├── pom.xml            # Maven dependencies
│   └── Dockerfile         # Backend container
├── frontend/               # Next.js Frontend
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── Dockerfile         # Frontend container
├── database/              # Database scripts
│   └── init.sql           # Database initialization
├── docker-compose.yml     # Production environment
├── docker-compose.dev.yml # Development environment
└── README.md             # This file
```

## 🚀 Quick Start

### 🎯 Cách nhanh nhất (Khuyến nghị cho người mới)

1. **Cài đặt yêu cầu hệ thống**:
   - Docker Desktop: https://www.docker.com/products/docker-desktop/
   - Java 17+: https://adoptium.net/
   - Node.js 18+: https://nodejs.org/

2. **Kiểm tra yêu cầu** (tùy chọn):
   ```bash
   # Chạy file kiểm tra
   check-requirements.bat
   ```

3. **Khởi động Docker Desktop** (quan trọng!)

4. **Chạy dự án**:
   ```bash
   # Chuột phải vào file này và chọn "Run as administrator"
   start-dev.bat
   ```

5. **Truy cập ứng dụng**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/api/swagger-ui.html

### Option 1: Docker Compose (Manual)

#### Development Environment
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop environment
docker-compose -f docker-compose.dev.yml down
```

#### Production Environment
```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop environment
docker-compose down
```

### Option 2: Local Development

#### 1. Start Database
```bash
# Start MySQL database
docker-compose -f docker-compose.dev.yml up mysql -d
```

#### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```

#### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Development Commands

### Backend Commands
```bash
cd backend

# Install dependencies
mvn clean install

# Run application
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package
```

### Frontend Commands
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## 🌐 Access URLs

### Development Environment
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8081/api
- **Database**: localhost:3307
- **Swagger UI**: http://localhost:8081/api/swagger-ui.html

### Production Environment
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:3306
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html

## 🗄️ Database Configuration

### Development Database
- **Host**: localhost:3307
- **Database**: skillbridge_dev
- **Username**: skillbridge_dev
- **Password**: skillbridge_dev_password

### Production Database
- **Host**: localhost:3306
- **Database**: skillbridge_db
- **Username**: skillbridge_user
- **Password**: skillbridge_password

## 📊 Sample Data

The database is automatically initialized with:
- 6 sample engineers with different skills
- Skills taxonomy (Web, Game, AI/ML development)
- Sample contacts for statistics
- Proper relationships and indexes

## 🔍 API Endpoints

### Homepage API
- `GET /api/public/homepage/statistics` - Get homepage statistics
- `GET /api/public/homepage/engineers` - Get featured engineers
- `GET /api/public/homepage/engineers/{category}` - Get engineers by category

### Health Check
- `GET /api/actuator/health` - Application health status

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
cd frontend
npm run cypress:open
```

## 🐳 Docker Commands

### Build Images
```bash
# Build backend
docker build -t skillbridge-backend ./backend

# Build frontend
docker build -t skillbridge-frontend ./frontend
```

### Run Individual Containers
```bash
# Run MySQL
docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=rootpassword mysql:8.0

# Run backend
docker run -d --name backend -p 8080:8080 --link mysql:mysql skillbridge-backend

# Run frontend
docker run -d --name frontend -p 3000:3000 --link backend:backend skillbridge-frontend
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :3000
   netstat -ano | findstr :8080
   netstat -ano | findstr :3306
   ```

2. **Database Connection Issues**
   ```bash
   # Check MySQL container
   docker-compose logs mysql
   
   # Restart database
   docker-compose restart mysql
   ```

3. **Frontend Build Issues**
   ```bash
   # Clear node_modules and reinstall
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Backend Build Issues**
   ```bash
   # Clear Maven cache
   cd backend
   mvn clean
   mvn dependency:purge-local-repository
   mvn install
   ```

## 📝 Environment Variables

### Backend Environment Variables
```bash
SPRING_PROFILES_ACTIVE=dev
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/skillbridge_db
SPRING_DATASOURCE_USERNAME=skillbridge_user
SPRING_DATASOURCE_PASSWORD=skillbridge_password
```

### Frontend Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NODE_ENV=development
```

## 🚀 Deployment

### Production Deployment
```bash
# Build and start production environment
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Development Deployment
```bash
# Build and start development environment
docker-compose -f docker-compose.dev.yml up -d

# Check status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 📚 Documentation

- **API Documentation**: http://localhost:8080/api/swagger-ui.html
- **Backend Documentation**: `backend/README.md`
- **Frontend Documentation**: `frontend/README.md`
- **Database Schema**: `database/init.sql`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🎉**