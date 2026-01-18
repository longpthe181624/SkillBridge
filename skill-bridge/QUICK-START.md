# 🚀 Quick Start Guide

## Prerequisites

- Docker Desktop installed and running
- Git installed

## Start Local Environment

Simply run:

```bash
START-LOCAL.bat
```

This will:
1. Stop any existing containers
2. Start all services (MySQL, Backend, Frontend)
3. Wait for services to initialize (30 seconds)
4. Test backend APIs
5. Open homepage in your browser

**Services:**
- Frontend: http://localhost:3001/
- Backend API: http://localhost:8081/api/
- Database: localhost:3307

## Stop Local Environment

Simply run:

```bash
STOP-LOCAL.bat
```

This will stop and remove all Docker containers.

## Troubleshooting

### Clear Browser Cache

If you see old content, press:
- **Ctrl + Shift + R** (hard refresh)
- Or use **Incognito mode**: Ctrl + Shift + N

### Check Container Status

```bash
docker ps
```

### View Logs

```bash
# Backend logs
docker logs -f skillbridge-backend-dev

# Frontend logs
docker logs -f skillbridge-frontend-dev

# Database logs
docker logs -f skillbridge-mysql-dev
```

### Rebuild Containers

```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

## Database Access

**Credentials:**
- Host: `localhost:3307`
- User: `skillbridge_dev`
- Password: `dev_password123`
- Database: `skillbridge_dev`

**Connect via MySQL client:**
```bash
mysql -h 127.0.0.1 -P 3307 -u skillbridge_dev -p skillbridge_dev
```

## Language Support

The application supports:
- **English (EN)** - Default
- **Japanese (JP)**

Switch language using the dropdown in the header.

## Features

✅ Multi-language support (EN/JP)
✅ Engineer profiles with Vietnam flag 🇻🇳
✅ Homepage with statistics and engineer showcase
✅ Services page
✅ Responsive design
✅ Database migrations with Flyway

---

**For detailed documentation, see:**
- Main README: `README.md`
- Setup Guide: `SETUP-GUIDE.md`
- Database Guide: `docs/database/FLYWAY-MIGRATION-GUIDE.md`

