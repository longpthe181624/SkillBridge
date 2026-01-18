# Story-01 Implementation Guide
## Guest Homepage Browsing

### Overview
This guide provides instructions for running and testing the Guest Homepage Browsing feature (Story-01).

### What Has Been Implemented

#### Backend Components ✅
1. **DTOs** (`backend/src/main/java/com/skillbridge/dto/`)
   - `HomepageStatistics.java` - Statistics for homepage
   - `EngineerProfile.java` - Engineer profile data

2. **Entity** (`backend/src/main/java/com/skillbridge/entity/`)
   - `Engineer.java` - Engineer entity with JPA mappings

3. **Repository** (`backend/src/main/java/com/skillbridge/repository/`)
   - `EngineerRepository.java` - Database queries for engineers
   - Methods for filtering by category (web, game, ai-ml)

4. **Service** (`backend/src/main/java/com/skillbridge/service/`)
   - `HomepageService.java` - Business logic for homepage data

5. **Controller** (`backend/src/main/java/com/skillbridge/controller/`)
   - `HomepageController.java` - Public API endpoints

#### Frontend Components ✅
1. **Services** (`frontend/src/services/`)
   - `homepageService.ts` - API service for homepage data

2. **Components** (`frontend/src/components/`)
   - `EngineerCard.tsx` - Engineer profile card component

3. **Pages** (`frontend/src/app/homepage/`)
   - `page.tsx` - Main homepage component with all sections

#### Database ✅
1. **Schema** (`database/init.sql`)
   - Engineers table with all required fields
   - Skills table for categorization
   - Engineer_skills junction table
   - Sample data for 9 engineers (3 per category)

### API Endpoints

#### 1. Get Homepage Statistics
```
GET /api/public/homepage/statistics
```
Returns total engineers and customers count.

**Response:**
```json
{
  "totalEngineers": 350,
  "totalCustomers": 30
}
```

#### 2. Get All Homepage Engineers
```
GET /api/public/homepage/engineers
```
Returns 9 engineers grouped by categories (3 per category).

**Response:**
```json
[
  {
    "id": 1,
    "fullName": "Nguyen Van A",
    "category": "web",
    "salaryExpectation": 350000,
    "yearsExperience": 6,
    "location": "Vietnam",
    "profileImageUrl": "/images/engineers/nguyen-van-a.jpg",
    "primarySkill": "React",
    "status": "AVAILABLE"
  },
  ...
]
```

#### 3. Get Engineers by Category
```
GET /api/public/homepage/engineers/{category}
```
Categories: `web`, `game`, `ai-ml`

Returns up to 3 engineers for the specified category.

### How to Run

#### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for frontend development)
- Java 17+ (for backend development)
- MySQL 8+ (or use Docker)

#### Option 1: Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Backend will be available at: http://localhost:8080
# Frontend will be available at: http://localhost:3000
```

#### Option 2: Manual Setup

**Backend:**
```bash
cd backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# Backend will be available at: http://localhost:8080
```

**Database:**
```bash
# If using Docker for MySQL
docker run --name skillbridge-db \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=skillbridge_db \
  -p 3306:3306 \
  -v $(pwd)/database/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -d mysql:8.0
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Set environment variable
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api/public" > .env.local

# Run development server
npm run dev

# Frontend will be available at: http://localhost:3000
```

### Testing

#### Manual Testing
1. Open browser and navigate to `http://localhost:3000/homepage`
2. Verify all sections are displayed:
   - ✅ Header with navigation
   - ✅ Hero section with statistics
   - ✅ How to Use section with 3 steps
   - ✅ Engineer showcase with 3 categories
   - ✅ Footer with links

#### API Testing
```bash
# Test statistics endpoint
curl http://localhost:8080/api/public/homepage/statistics

# Test engineers endpoint
curl http://localhost:8080/api/public/homepage/engineers

# Test category endpoint
curl http://localhost:8080/api/public/homepage/engineers/web
```

### Features Implemented

#### ✅ Header Section
- Logo with "SKILL BRIDGE" branding
- Navigation menu (HOME, List Engineer, Service, Contact us)
- Login link (optional access)

#### ✅ Hero Section
- Service introduction with vision statement
- Real-time statistics display:
  - Number of engineers (dynamically loaded from database)
  - Number of customers (dynamically loaded from database)

#### ✅ How to Use Section
- Step 01: Search for Engineers
- Step 02: Select an Order Destination
- Step 03: Contact Us

#### ✅ Engineer Showcase Section
Three categories with real data from database:
- **Web Development**: 3 engineers with web skills (React, Vue.js, Backend)
- **Game Development**: 3 engineers with game skills (Unity, Unreal Engine)
- **AI/ML Development**: 3 engineers with AI/ML skills (Machine Learning, Deep Learning)

Each engineer card displays:
- Profile image (with fallback to initials)
- Full name
- Primary skill badge
- Salary expectation (formatted in Yen)
- Years of experience
- Location with globe icon
- Availability status

#### ✅ Footer Section
- Brand name
- Legal links (FAQ, Terms, Privacy Policy)
- Navigation links
- Contact information

### Technology Stack

#### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- MySQL 8.0
- Maven

#### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide icons

### Database Schema

```sql
engineers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255),
  years_experience INT,
  seniority VARCHAR(32),
  summary TEXT,
  location VARCHAR(128),
  language_summary VARCHAR(64),
  status VARCHAR(32),
  profile_image_url VARCHAR(500),
  salary_expectation DECIMAL(10,2),
  primary_skill VARCHAR(128),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Performance Optimizations
- Parallel data loading (statistics + engineers)
- Efficient database queries with indexes
- Loading skeletons for better UX
- Responsive design for all devices
- Image optimization with fallbacks

### Security Features
- Public API endpoints (no authentication required)
- CORS configuration for cross-origin requests
- Input validation on backend
- SQL injection prevention with JPA

### Troubleshooting

#### Backend not starting
```bash
# Check if MySQL is running
docker ps | grep mysql

# Check backend logs
./mvnw spring-boot:run
```

#### Frontend not loading data
```bash
# Check if NEXT_PUBLIC_API_URL is set correctly
cat frontend/.env.local

# Check browser console for errors
# Open DevTools (F12) -> Console tab
```

#### Database connection errors
```bash
# Verify MySQL connection
mysql -h localhost -u root -p skillbridge_db

# Re-initialize database
mysql -h localhost -u root -p < database/init.sql
```

### Next Steps

After verifying the homepage works correctly:

1. **Story-02**: Implement Engineer Search functionality
2. **Story-03**: Implement Services Viewing page
3. **Story-04**: Implement Contact Request form

### Support

For issues or questions:
- Check logs in `backend/logs/` (if configured)
- Check browser console for frontend errors
- Review API responses using browser DevTools Network tab
- Contact the development team

### Acceptance Criteria Status

All acceptance criteria from Story-01 have been implemented:

- ✅ Homepage is accessible without authentication
- ✅ All sections display correctly (Header, Hero, How to Use, Engineer Showcase, Footer)
- ✅ Real engineer profiles loaded from database
- ✅ Statistics dynamically updated from database
- ✅ Responsive design for all devices
- ✅ Navigation links functional
- ✅ Engineer cards show all required information
- ✅ 3 engineers per category displayed
- ✅ Loading states implemented
- ✅ Error handling in place

### Story Status: ✅ COMPLETED

