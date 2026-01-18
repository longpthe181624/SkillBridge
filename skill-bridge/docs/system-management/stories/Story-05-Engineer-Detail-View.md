# User Story: Engineer Detail View

## Story Information
- **Story ID**: Story-05
- **Title**: Engineer Detail View
- **Epic**: Public Engineer Discovery
- **Priority**: High
- **Story Points**: 8
- **Sprint**: Sprint 2
- **Status**: Ready for Development
- **Dependencies**: Story-02 (Engineer Search)

## User Story
**As a** Guest/Client  
**I want to** view detailed information about an engineer  
**So that** I can evaluate their skills, experience, and qualifications before contacting them

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] Display comprehensive engineer profile information
- [ ] Show engineer's skills, certifications, and experience
- [ ] Public access without authentication required
- [ ] Breadcrumb navigation (List engineer > Detail)
- [ ] Professional and clean layout

### Detailed Acceptance Criteria

#### 1. Page Structure
- [ ] **Header**: Standard navigation with "List Engineer" highlighted
- [ ] **Breadcrumb**: "List engineer > Detail" with clickable links
- [ ] **Page Title**: "Detail engineer"
- [ ] **Footer**: Standard footer

#### 2. Engineer Profile Section
- [ ] **Profile Image**:
  - [ ] Display engineer's profile photo
  - [ ] Fallback to default avatar if no image
  - [ ] Professional appearance
  
- [ ] **Basic Information**:
  - [ ] Full Name (e.g., "Nguyen Van A")
  - [ ] Location with globe icon (e.g., "Vietnam")
  - [ ] Flag icon for visual appeal

#### 3. Overview Section
- [ ] **Display Information**:
  - [ ] Salary Expectation in Yen (e.g., "¥450,000")
  - [ ] Years of Experience (e.g., "6 years")
  - [ ] Seniority Level (e.g., "Senior")
  - [ ] Current Status (Available/Busy/Not Available)
  - [ ] Primary Skill
  - [ ] Language Proficiency Summary

#### 4. Skills Section
- [ ] **Display Format**:
  - [ ] Skills shown as badges/pills
  - [ ] Multiple skills displayed (e.g., Java, AWS, Python, MySQL)
  - [ ] Clean, organized layout
  - [ ] Responsive grid/flex layout

#### 5. Introduction/Summary Section
- [ ] **Content**:
  - [ ] Professional summary/bio
  - [ ] Full text display (no truncation)
  - [ ] Formatted for readability
  - [ ] Support for multi-paragraph text

#### 6. Certificates Section
- [ ] **Display Format**:
  - [ ] List of certifications
  - [ ] Professional appearance
  - [ ] Badge/pill style similar to skills
  - [ ] Examples: "AWS Certified Cloud Practitioner", "AWS Certified Machine Learning Engineer - Associate"

#### 7. Navigation & UX
- [ ] **Breadcrumb Navigation**:
  - [ ] Clickable "List engineer" link returns to search page
  - [ ] Current page indicator
  
- [ ] **Back to List**:
  - [ ] Clear way to return to engineer list
  - [ ] Preserve search filters if possible

#### 8. Responsive Design
- [ ] Mobile-friendly layout
- [ ] Tablet-optimized view
- [ ] Desktop full-width layout

## Technical Requirements

### Frontend Requirements

#### Route Structure
```typescript
// URL Pattern
/engineers/:id
// Example: /engineers/1
```

#### TypeScript Interfaces
```typescript
interface EngineerDetail {
  id: number;
  fullName: string;
  location: string;
  profileImageUrl: string;
  salaryExpectation: number;
  yearsExperience: number;
  seniority: string;
  status: 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE';
  primarySkill: string;
  languageSummary: string;
  summary: string;
  introduction: string;
  skills: EngineerSkill[];
  certificates: Certificate[];
}

interface EngineerSkill {
  id: number;
  name: string;
  level?: string;
  yearsOfExperience?: number;
}

interface Certificate {
  id: number;
  name: string;
  issuedBy: string;
  issuedDate?: string;
  expiryDate?: string;
}
```

#### API Service
```typescript
// Service: engineerDetailService.ts
export async function getEngineerById(id: number): Promise<EngineerDetail> {
  const response = await fetch(`${API_BASE_URL}/public/engineers/${id}`);
  if (!response.ok) {
    throw new Error('Engineer not found');
  }
  return await response.json();
}
```

### Backend Requirements

#### REST API Endpoint
```java
@RestController
@RequestMapping("/public/engineers")
@CrossOrigin(origins = "*")
public class EngineerDetailController {
    
    @GetMapping("/{id}")
    public ResponseEntity<EngineerDetailDTO> getEngineerById(@PathVariable Integer id) {
        EngineerDetailDTO engineer = engineerService.getEngineerDetailById(id);
        
        if (engineer == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(engineer);
    }
}
```

#### DTO Structure
```java
public class EngineerDetailDTO {
    private Integer id;
    private String fullName;
    private String location;
    private String profileImageUrl;
    private BigDecimal salaryExpectation;
    private Integer yearsExperience;
    private String seniority;
    private String status;
    private String primarySkill;
    private String languageSummary;
    private String summary;
    private String introduction;
    private List<SkillDTO> skills;
    private List<CertificateDTO> certificates;
    
    // Getters and Setters
}

public class SkillDTO {
    private Integer id;
    private String name;
    private String level;
    private Integer yearsOfExperience;
    
    // Getters and Setters
}

public class CertificateDTO {
    private Integer id;
    private String name;
    private String issuedBy;
    private LocalDate issuedDate;
    private LocalDate expiryDate;
    
    // Getters and Setters
}
```

#### Service Layer
```java
@Service
public class EngineerService {
    
    @Autowired
    private EngineerRepository engineerRepository;
    
    @Autowired
    private EngineerSkillRepository engineerSkillRepository;
    
    @Autowired
    private CertificateRepository certificateRepository;
    
    public EngineerDetailDTO getEngineerDetailById(Integer id) {
        Engineer engineer = engineerRepository.findById(id)
            .orElse(null);
            
        if (engineer == null) {
            return null;
        }
        
        EngineerDetailDTO dto = new EngineerDetailDTO();
        // Map basic fields
        dto.setId(engineer.getId());
        dto.setFullName(engineer.getFullName());
        dto.setLocation(engineer.getLocation());
        dto.setProfileImageUrl(engineer.getProfileImageUrl());
        dto.setSalaryExpectation(engineer.getSalaryExpectation());
        dto.setYearsExperience(engineer.getYearsExperience());
        dto.setSeniority(engineer.getSeniority());
        dto.setStatus(engineer.getStatus());
        dto.setPrimarySkill(engineer.getPrimarySkill());
        dto.setLanguageSummary(engineer.getLanguageSummary());
        dto.setSummary(engineer.getSummary());
        dto.setIntroduction(engineer.getIntroduction());
        
        // Load skills
        List<SkillDTO> skills = engineerSkillRepository.findSkillsByEngineerId(id);
        dto.setSkills(skills);
        
        // Load certificates
        List<CertificateDTO> certificates = certificateRepository.findByEngineerId(id);
        dto.setCertificates(certificates);
        
        return dto;
    }
}
```

### Database Schema

```sql
-- Add introduction column to engineers table (if not exists)
ALTER TABLE engineers 
ADD COLUMN introduction TEXT AFTER summary;

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    engineer_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    issued_by VARCHAR(255),
    issued_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (engineer_id) REFERENCES engineers(id) ON DELETE CASCADE,
    INDEX idx_engineer_id (engineer_id)
);

-- Update skills table to include level and years
ALTER TABLE engineer_skills 
MODIFY COLUMN level VARCHAR(32) DEFAULT 'Intermediate',
ADD COLUMN years_of_experience INT DEFAULT 0 AFTER level;
```

## Implementation Guidelines

### Frontend Implementation

#### Page Component Structure
```typescript
// app/engineers/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { getEngineerById, EngineerDetail } from '@/services/engineerDetailService';

export default function EngineerDetailPage() {
  const params = useParams();
  const engineerId = Number(params.id);
  const { t } = useLanguage();
  
  const [engineer, setEngineer] = useState<EngineerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEngineerDetail();
  }, [engineerId]);

  const loadEngineerDetail = async () => {
    try {
      setLoading(true);
      const data = await getEngineerById(engineerId);
      setEngineer(data);
    } catch (err) {
      setError('Engineer not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !engineer) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader currentPage="engineers" />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: t('engineerDetail.listEngineer'), href: '/engineers' },
            { label: t('engineerDetail.detail') }
          ]}
        />

        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-8">{t('engineerDetail.title')}</h1>

        {/* Engineer Profile */}
        <EngineerProfileSection engineer={engineer} />

        {/* Overview */}
        <OverviewSection engineer={engineer} />

        {/* Skills */}
        <SkillsSection skills={engineer.skills} />

        {/* Introduction */}
        <IntroductionSection introduction={engineer.introduction} />

        {/* Certificates */}
        <CertificatesSection certificates={engineer.certificates} />
      </main>

      <AppFooter />
    </div>
  );
}
```

#### Component Breakdown

##### 1. Engineer Profile Section
```typescript
interface EngineerProfileSectionProps {
  engineer: EngineerDetail;
}

const EngineerProfileSection: React.FC<EngineerProfileSectionProps> = ({ engineer }) => {
  return (
    <div className="flex items-start gap-6 mb-8">
      {/* Profile Image */}
      <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
        <img
          src={engineer.profileImageUrl || '/images/default-engineer.jpg'}
          alt={engineer.fullName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/default-engineer.jpg';
          }}
        />
      </div>

      {/* Basic Info */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{engineer.fullName}</h2>
        <div className="flex items-center text-gray-600">
          <Globe className="w-4 h-4 mr-2" />
          <span>{engineer.location}</span>
        </div>
      </div>
    </div>
  );
};
```

##### 2. Overview Section
```typescript
const OverviewSection: React.FC<{ engineer: EngineerDetail }> = ({ engineer }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg border p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">{t('engineerDetail.overview')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 text-sm mb-1">
            {t('engineerDetail.salaryExpectation')}
          </p>
          <p className="text-lg font-semibold">
            ¥{engineer.salaryExpectation.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-sm mb-1">
            {t('engineerDetail.yearsExperience')}
          </p>
          <p className="text-lg font-semibold">
            {engineer.yearsExperience} {t('engineerDetail.years')}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-sm mb-1">
            {t('engineerDetail.seniority')}
          </p>
          <p className="text-lg font-semibold">{engineer.seniority}</p>
        </div>

        <div>
          <p className="text-gray-600 text-sm mb-1">
            {t('engineerDetail.status')}
          </p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            engineer.status === 'AVAILABLE' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {engineer.status}
          </span>
        </div>
      </div>
    </div>
  );
};
```

##### 3. Skills Section
```typescript
const SkillsSection: React.FC<{ skills: EngineerSkill[] }> = ({ skills }) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{t('engineerDetail.skills')}</h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
};
```

##### 4. Introduction Section
```typescript
const IntroductionSection: React.FC<{ introduction: string }> = ({ introduction }) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{t('engineerDetail.introduction')}</h3>
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-gray-700 whitespace-pre-line">{introduction}</p>
      </div>
    </div>
  );
};
```

##### 5. Certificates Section
```typescript
const CertificatesSection: React.FC<{ certificates: Certificate[] }> = ({ certificates }) => {
  const { t } = useLanguage();
  
  if (!certificates || certificates.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{t('engineerDetail.certificates')}</h3>
      <div className="flex flex-wrap gap-3">
        {certificates.map((cert) => (
          <span
            key={cert.id}
            className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
          >
            {cert.name}
          </span>
        ))}
      </div>
    </div>
  );
};
```

### Multilanguage Support

#### Translation Keys
```typescript
// Add to LanguageContext.tsx
const translations = {
  en: {
    // ... existing translations
    'engineerDetail.listEngineer': 'List engineer',
    'engineerDetail.detail': 'Detail',
    'engineerDetail.title': 'Detail engineer',
    'engineerDetail.overview': 'Overview',
    'engineerDetail.salaryExpectation': 'Salary Expectation',
    'engineerDetail.yearsExperience': 'Years of Experience',
    'engineerDetail.years': 'years',
    'engineerDetail.seniority': 'Seniority',
    'engineerDetail.status': 'Status',
    'engineerDetail.skills': 'Skills',
    'engineerDetail.introduction': 'Introduction',
    'engineerDetail.certificates': 'Certificates',
    'engineerDetail.backToList': 'Back to List',
    'engineerDetail.notFound': 'Engineer not found',
    'engineerDetail.loading': 'Loading engineer details...',
  },
  ja: {
    // ... existing translations
    'engineerDetail.listEngineer': 'エンジニア一覧',
    'engineerDetail.detail': '詳細',
    'engineerDetail.title': 'エンジニア詳細',
    'engineerDetail.overview': '概要',
    'engineerDetail.salaryExpectation': '希望給与',
    'engineerDetail.yearsExperience': '経験年数',
    'engineerDetail.years': '年',
    'engineerDetail.seniority': 'レベル',
    'engineerDetail.status': 'ステータス',
    'engineerDetail.skills': 'スキル',
    'engineerDetail.introduction': '自己紹介',
    'engineerDetail.certificates': '資格',
    'engineerDetail.backToList': '一覧に戻る',
    'engineerDetail.notFound': 'エンジニアが見つかりません',
    'engineerDetail.loading': '読み込み中...',
  }
};
```

## Testing Requirements

### Unit Tests
```typescript
describe('EngineerDetailPage', () => {
  it('should load and display engineer details', async () => {
    const mockEngineer = {
      id: 1,
      fullName: 'Nguyen Van A',
      location: 'Vietnam',
      salaryExpectation: 450000,
      yearsExperience: 6,
      skills: [
        { id: 1, name: 'Java' },
        { id: 2, name: 'AWS' },
      ],
      certificates: [
        { id: 1, name: 'AWS Certified Cloud Practitioner' }
      ]
    };
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEngineer)
    });
    
    render(<EngineerDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Nguyen Van A')).toBeInTheDocument();
      expect(screen.getByText('Vietnam')).toBeInTheDocument();
      expect(screen.getByText('Java')).toBeInTheDocument();
    });
  });
  
  it('should handle engineer not found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404
    });
    
    render(<EngineerDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Engineer not found')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests
```java
@SpringBootTest
@AutoConfigureMockMvc
class EngineerDetailControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetEngineerById_Success() throws Exception {
        mockMvc.perform(get("/api/public/engineers/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.fullName").exists())
            .andExpect(jsonPath("$.skills").isArray())
            .andExpect(jsonPath("$.certificates").isArray());
    }
    
    @Test
    void testGetEngineerById_NotFound() throws Exception {
        mockMvc.perform(get("/api/public/engineers/9999"))
            .andExpect(status().isNotFound());
    }
}
```

### E2E Tests
```typescript
describe('Engineer Detail E2E', () => {
  it('should navigate from list to detail and back', () => {
    cy.visit('/engineers');
    
    // Click on first engineer card
    cy.get('.engineer-card').first().click();
    
    // Verify detail page loads
    cy.url().should('include', '/engineers/');
    cy.contains('Detail engineer').should('be.visible');
    cy.contains('Overview').should('be.visible');
    
    // Verify breadcrumb navigation
    cy.contains('List engineer').click();
    cy.url().should('eq', '/engineers');
  });
  
  it('should display all engineer information', () => {
    cy.visit('/engineers/1');
    
    // Check all sections exist
    cy.contains('Overview').should('be.visible');
    cy.contains('Skills').should('be.visible');
    cy.contains('Introduction').should('be.visible');
    cy.contains('Certificates').should('be.visible');
    
    // Check specific data
    cy.contains('Salary Expectation').should('be.visible');
    cy.contains('Years of Experience').should('be.visible');
  });
});
```

## Database Migration

```sql
-- V4__add_engineer_details_tables.sql

-- Add introduction column to engineers table
ALTER TABLE engineers 
ADD COLUMN IF NOT EXISTS introduction TEXT AFTER summary;

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    engineer_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    issued_by VARCHAR(255),
    issued_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (engineer_id) REFERENCES engineers(id) ON DELETE CASCADE,
    INDEX idx_certificates_engineer_id (engineer_id)
);

-- Update engineer_skills table
ALTER TABLE engineer_skills 
ADD COLUMN IF NOT EXISTS years_of_experience INT DEFAULT 0 AFTER level;

-- Insert sample certificates
INSERT INTO certificates (engineer_id, name, issued_by, issued_date) VALUES
(1, 'AWS Certified Cloud Practitioner', 'Amazon Web Services', '2023-01-15'),
(1, 'AWS Certified Machine Learning Engineer - Associate', 'Amazon Web Services', '2023-06-20'),
(2, 'AWS Certified Solutions Architect', 'Amazon Web Services', '2022-11-10'),
(3, 'Oracle Certified Java Programmer', 'Oracle', '2021-08-05');

-- Update sample engineers with introduction
UPDATE engineers 
SET introduction = 'Experienced full-stack developer with expertise in React and Node.js. Passionate about building scalable web applications and mentoring junior developers. Strong problem-solving skills and ability to work in fast-paced environments.'
WHERE id = 1;

UPDATE engineers 
SET introduction = 'Frontend developer specializing in Vue.js and TypeScript. Strong focus on user experience and performance optimization. Experience with modern frontend tools and frameworks.'
WHERE id = 2;

UPDATE engineers 
SET introduction = 'Backend developer with expertise in Java and Spring Boot. Experienced in microservices architecture and cloud deployment. Strong understanding of system design and scalability.'
WHERE id = 3;
```

## Definition of Done

### Development Complete
- [ ] Backend API endpoint implemented and tested
- [ ] Frontend detail page created with all sections
- [ ] Multilanguage support added
- [ ] Responsive design implemented
- [ ] Breadcrumb navigation working
- [ ] Error handling (404, network errors)

### Testing Complete
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Manual testing on different devices
- [ ] Cross-browser testing

### Documentation Complete
- [ ] API documentation updated
- [ ] Component documentation added
- [ ] README updated with new route
- [ ] Story implementation summary created

### Deployment Complete
- [ ] Code reviewed and approved
- [ ] Merged to main branch
- [ ] Database migration applied
- [ ] Deployed to staging
- [ ] Tested in staging environment
- [ ] Deployed to production

## Dependencies

### External Dependencies
- Next.js 14+ (Dynamic routes)
- React 18+
- TypeScript
- Tailwind CSS
- lucide-react (icons)

### Internal Dependencies
- Story-02: Engineer Search (navigation source)
- Engineer Entity and Repository
- Skills and Certificates data

## Risks and Mitigation

### Technical Risks
- **Invalid Engineer ID**: User might access non-existent engineer
  - *Mitigation*: Implement 404 page and proper error handling
  
- **Large Introduction Text**: Introduction might be very long
  - *Mitigation*: Set reasonable character limits, use proper text formatting

- **Missing Profile Images**: Some engineers might not have photos
  - *Mitigation*: Use fallback default avatar

### Business Risks
- **Data Privacy**: Showing too much personal information
  - *Mitigation*: Only show public, non-sensitive information
  
- **SEO**: Dynamic routes might not be indexed well
  - *Mitigation*: Implement proper meta tags and SSR

## Success Metrics

### Business Metrics
- **Page Views**: Target 500+ detail page views per month
- **Engagement Time**: Target 2+ minutes average time on page
- **Conversion**: Target 20% of detail views lead to contact requests

### Technical Metrics
- **Page Load Time**: Target < 2 seconds
- **API Response Time**: Target < 500ms
- **Error Rate**: Target < 1%
- **Mobile Performance**: Target 90+ Lighthouse score

## Future Enhancements

### Phase 2 Features
- [ ] Contact engineer button/form
- [ ] Share engineer profile (social media)
- [ ] Print-friendly view
- [ ] Download resume/CV
- [ ] Related engineers suggestions

### Phase 3 Features
- [ ] Engineer video introduction
- [ ] Portfolio/project showcase
- [ ] Client reviews/ratings
- [ ] Availability calendar
- [ ] Real-time chat

---

**Story Status**: Ready for Development  
**Assigned To**: Backend Team, Frontend Team  
**Estimated Effort**: 8 Story Points  
**Target Sprint**: Sprint 2  
**Review Date**: End of Sprint 2

