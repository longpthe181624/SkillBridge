# Story-01: Guest Homepage Browsing - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│                    http://localhost:3000/homepage                │
└────────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP Request
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                          │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Homepage Component (page.tsx)                              │ │
│  │  - Header Section                                          │ │
│  │  - Hero Section (with Statistics)                          │ │
│  │  - How to Use Section                                      │ │
│  │  - Engineer Showcase (3 categories)                        │ │
│  │  - Footer Section                                          │ │
│  └───────────────────────┬───────────────────────────────────┘ │
│                          │                                       │
│                          │ Calls                                 │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Homepage Service (homepageService.ts)                      │ │
│  │  - getHomepageStatistics()                                 │ │
│  │  - getHomepageEngineers()                                  │ │
│  │  - getEngineersByCategory(category)                        │ │
│  └───────────────────────┬───────────────────────────────────┘ │
│                          │                                       │
│                          │ Uses                                  │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ EngineerCard Component (EngineerCard.tsx)                  │ │
│  │  - Avatar with fallback                                    │ │
│  │  - Engineer details                                        │ │
│  │  - Salary, Experience, Location                            │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP API Calls
                            │ http://localhost:8080/api/public
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend (Spring Boot)                          │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ HomepageController (@RestController)                       │ │
│  │  GET /api/public/homepage/statistics                       │ │
│  │  GET /api/public/homepage/engineers                        │ │
│  │  GET /api/public/homepage/engineers/{category}             │ │
│  └───────────────────────┬───────────────────────────────────┘ │
│                          │                                       │
│                          │ Delegates to                          │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ HomepageService (@Service)                                 │ │
│  │  - getHomepageStatistics()                                 │ │
│  │  - getFeaturedEngineers()                                  │ │
│  │  - getEngineersByCategory(category)                        │ │
│  │  - getAllCategoryEngineers()                               │ │
│  │  - convertToProfile(engineer)                              │ │
│  │  - mapCategory(primarySkill)                               │ │
│  └───────────────────────┬───────────────────────────────────┘ │
│                          │                                       │
│                          │ Uses                                  │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ EngineerRepository (@Repository)                           │ │
│  │  - countByStatus(status)                                   │ │
│  │  - findFeaturedEngineers()                                 │ │
│  │  - findWebDevelopers()                                     │ │
│  │  - findGameDevelopers()                                    │ │
│  │  - findAiMlDevelopers()                                    │ │
│  │  - findByCategory(category)                                │ │
│  └───────────────────────┬───────────────────────────────────┘ │
│                          │                                       │
│                          │ Maps to                               │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Engineer Entity (@Entity)                                  │ │
│  │  - id, fullName, yearsExperience                           │ │
│  │  - seniority, summary, location                            │ │
│  │  - salaryExpectation, primarySkill                         │ │
│  │  - status, profileImageUrl                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬─────────────────────────────────────┘
                            │
                            │ JDBC/JPA
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database (MySQL 8.0)                        │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ engineers table                                            │ │
│  │  - 9 engineers (3 per category)                            │ │
│  │  - Web: React, Vue.js, Backend                             │ │
│  │  - Game: Unity, Unreal Engine                              │ │
│  │  - AI/ML: Machine Learning, Deep Learning                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ skills table                                               │ │
│  │  - Web Development, Game Development, AI/ML                │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ engineer_skills table (junction)                           │ │
│  │  - Links engineers to skills                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ contacts table                                             │ │
│  │  - Customer information for statistics                     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### 1. Get Homepage Statistics

```
User → Homepage Component → homepageService.getHomepageStatistics()
                                    │
                                    ▼
                        GET /api/public/homepage/statistics
                                    │
                                    ▼
                            HomepageController
                                    │
                                    ▼
                            HomepageService
                                    │
                                    ▼
                         EngineerRepository.countByStatus("AVAILABLE")
                                    │
                                    ▼
                            Database Query
                                    │
                                    ▼
        Return { totalEngineers: 9, totalCustomers: 3 }
```

### 2. Get Engineers by Category

```
User → Homepage Component → homepageService.getHomepageEngineers()
                                    │
                                    ▼
                        GET /api/public/homepage/engineers
                                    │
                                    ▼
                            HomepageController
                                    │
                                    ▼
                        HomepageService.getAllCategoryEngineers()
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼                               ▼
        findWebDevelopers()          findGameDevelopers()          findAiMlDevelopers()
                    │                               │                               │
                    ▼                               ▼                               ▼
            Database Query                  Database Query                  Database Query
            (3 web engineers)               (3 game engineers)              (3 AI/ML engineers)
                    │                               │                               │
                    └───────────────┬───────────────┘
                                    ▼
                Return Array[9 engineers] (3 per category)
                                    │
                                    ▼
            Convert to EngineerProfile DTOs
                                    │
                                    ▼
                    Render EngineerCard Components
```

## Component Hierarchy

```
Homepage (page.tsx)
├── Header
│   ├── Logo (SKILL BRIDGE)
│   ├── Navigation Menu
│   │   ├── HOME
│   │   ├── List Engineer
│   │   ├── Service
│   │   └── Contact us
│   └── Login Button
│
├── Hero Section
│   ├── Service Introduction
│   │   ├── Title: SKILL BRIDGE
│   │   └── Vision Statement
│   └── Statistics Cards
│       ├── Engineers Count (Card)
│       └── Customers Count (Card)
│
├── How to Use Section
│   ├── Section Header
│   └── Steps
│       ├── Step 01 (Card): Search for Engineers
│       ├── Step 02 (Card): Select an Order Destination
│       └── Step 03 (Card): Contact Us
│
├── Engineer Showcase Section
│   ├── Web Development
│   │   ├── Section Header
│   │   └── Engineer Cards (3)
│   │       ├── EngineerCard (Nguyen Van A)
│   │       ├── EngineerCard (Pham Thi D)
│   │       └── EngineerCard (Hoang Van E)
│   │
│   ├── Game Development
│   │   ├── Section Header
│   │   └── Engineer Cards (3)
│   │       ├── EngineerCard (Tran Thi B)
│   │       ├── EngineerCard (Do Van G)
│   │       └── EngineerCard (Nguyen Thi H)
│   │
│   └── AI/ML Development
│       ├── Section Header
│       └── Engineer Cards (3)
│           ├── EngineerCard (Le Van C)
│           ├── EngineerCard (Tran Van I)
│           └── EngineerCard (Bui Thi J)
│
└── Footer
    ├── Brand Section
    ├── Legal Links
    │   ├── FAQ
    │   ├── Terms
    │   └── Privacy Policy
    ├── Navigation Links
    │   ├── HOME
    │   ├── List Engineer
    │   ├── Services
    │   └── Contact us
    └── Contact Information
```

## EngineerCard Component Structure

```
EngineerCard (Card)
├── Avatar
│   ├── Image (profile_image_url)
│   └── Fallback (initials)
│
├── Name (fullName)
│
├── Primary Skill Badge
│
├── Details Section
│   ├── Salary Expectation (¥ formatted)
│   ├── Years of Experience
│   └── Location (with Globe icon)
│
└── Status Badge (AVAILABLE)
```

## API Endpoint Details

### Endpoint 1: Get Statistics
```
URL: GET /api/public/homepage/statistics
Auth: None (Public)
Response: {
  "totalEngineers": number,
  "totalCustomers": number
}
```

### Endpoint 2: Get All Engineers
```
URL: GET /api/public/homepage/engineers
Auth: None (Public)
Response: EngineerProfile[] (9 engineers)
```

### Endpoint 3: Get Engineers by Category
```
URL: GET /api/public/homepage/engineers/{category}
Params: category = "web" | "game" | "ai-ml"
Auth: None (Public)
Response: EngineerProfile[] (3 engineers)
```

## Database Schema Relationships

```
engineers (1) ──────< engineer_skills (M) >────── (1) skills
    │
    │ One engineer has:
    │  - id (PK)
    │  - full_name
    │  - years_experience
    │  - seniority
    │  - summary
    │  - location
    │  - language_summary
    │  - status (AVAILABLE/UNAVAILABLE)
    │  - profile_image_url
    │  - salary_expectation
    │  - primary_skill
    │  - created_at
    │  - updated_at
    │
    └── Many engineers can have many skills (through engineer_skills)

skills
    │ One skill has:
    │  - id (PK)
    │  - name
    │  - parent_skill_id (FK to skills)
    │
    └── Can have sub-skills (hierarchical)

engineer_skills (junction table)
    │ Links:
    │  - engineer_id (FK to engineers)
    │  - skill_id (FK to skills)
    │  - level (Beginner/Intermediate/Advanced/Expert)
    │  - years (years of experience with this skill)
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Spring Security                              │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ SecurityConfig                                             │ │
│  │                                                            │ │
│  │  Public Endpoints (No Auth):                              │ │
│  │    - /api/public/**                                       │ │
│  │    - /actuator/health                                     │ │
│  │    - /swagger-ui/**                                       │ │
│  │                                                            │ │
│  │  Protected Endpoints (Auth Required):                     │ │
│  │    - /api/admin/**                                        │ │
│  │    - /api/client/**                                       │ │
│  │    - All other endpoints                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ CORS Configuration                                         │ │
│  │                                                            │ │
│  │  Allowed Origins:                                         │ │
│  │    - http://localhost:3000                                │ │
│  │    - http://localhost:3001                                │ │
│  │    - http://localhost:4200                                │ │
│  │                                                            │ │
│  │  Allowed Methods:                                         │ │
│  │    - GET, POST, PUT, DELETE, OPTIONS                      │ │
│  │                                                            │ │
│  │  Allowed Headers: *                                       │ │
│  │  Credentials: true                                        │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Performance Optimizations

```
┌─────────────────────────────────────────────────────────────────┐
│                     Performance Features                         │
│                                                                  │
│  Frontend:                                                       │
│    ✓ Parallel API calls (Promise.all)                           │
│    ✓ Loading skeletons (perceived performance)                  │
│    ✓ Code splitting (React.lazy)                                │
│    ✓ Image optimization (lazy loading)                          │
│    ✓ Responsive design (mobile-first)                           │
│                                                                  │
│  Backend:                                                        │
│    ✓ Database indexes on frequently queried columns             │
│      - status                                                    │
│      - primary_skill                                             │
│      - salary_expectation                                        │
│    ✓ Efficient JPA queries                                      │
│    ✓ DTO pattern (minimize data transfer)                       │
│    ✓ Connection pooling                                         │
│                                                                  │
│  Database:                                                       │
│    ✓ Indexes on foreign keys                                    │
│    ✓ Optimized query patterns                                   │
│    ✓ Proper column types and constraints                        │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack Summary

```
┌──────────────────┬──────────────────┬───────────────────────────┐
│    Layer         │   Technology     │      Version              │
├──────────────────┼──────────────────┼───────────────────────────┤
│ Frontend         │ Next.js          │ 14.x                      │
│                  │ React            │ 18.x                      │
│                  │ TypeScript       │ 5.x                       │
│                  │ Tailwind CSS     │ 3.x                       │
│                  │ shadcn/ui        │ Latest                    │
├──────────────────┼──────────────────┼───────────────────────────┤
│ Backend          │ Spring Boot      │ 3.2.0                     │
│                  │ Java             │ 17                        │
│                  │ Spring Data JPA  │ 3.2.0                     │
│                  │ Spring Security  │ 6.2.0                     │
├──────────────────┼──────────────────┼───────────────────────────┤
│ Database         │ MySQL            │ 8.0                       │
├──────────────────┼──────────────────┼───────────────────────────┤
│ Build Tools      │ Maven            │ 3.9.x                     │
│                  │ npm              │ 10.x                      │
├──────────────────┼──────────────────┼───────────────────────────┤
│ Containerization │ Docker           │ Latest                    │
│                  │ Docker Compose   │ 2.x                       │
└──────────────────┴──────────────────┴───────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Docker Compose Setup                         │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │   Frontend Service   │  │   Backend Service    │            │
│  │   (Next.js)          │  │   (Spring Boot)      │            │
│  │   Port: 3000         │  │   Port: 8080         │            │
│  └──────────┬───────────┘  └──────────┬───────────┘            │
│             │                          │                         │
│             │                          │                         │
│             │                          ▼                         │
│             │              ┌──────────────────────┐             │
│             │              │   Database Service   │             │
│             │              │   (MySQL)            │             │
│             │              │   Port: 3306         │             │
│             │              └──────────────────────┘             │
│             │                          │                         │
│             └──────────────────────────┘                         │
│                     (Network: skillbridge-network)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

This architecture implements a clean separation of concerns:

- **Frontend**: Handles UI/UX and user interactions
- **Backend**: Implements business logic and data access
- **Database**: Stores persistent data

The system follows REST API principles, uses DTOs for data transfer, implements proper security with public endpoints, and includes performance optimizations at every layer.

All components are containerized for easy deployment and development.

