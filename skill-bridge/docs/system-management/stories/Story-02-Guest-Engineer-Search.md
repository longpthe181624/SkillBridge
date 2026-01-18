# User Story: Guest Engineer Search & Viewing

## Story Information
- **Story ID**: Story-02
- **Title**: Guest Engineer Search & Viewing
- **Epic**: Public Engineer Discovery
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 1
- **Status**: Ready for Development

## User Story
**As a** Guest  
**I want to** search and view public engineer profiles  
**So that** I can get an idea of available skills and experience  

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] Search bar allows filtering engineers by skill, language, or experience
- [ ] Only limited (non-sensitive) engineer info is shown (e.g., skill tags, years of experience, seniority)
- [ ] Public access without authentication required
- [ ] Search results are displayed in an organized, user-friendly format

### Detailed Acceptance Criteria

#### 1. Public Access
- [ ] Engineer search page is accessible without authentication
- [ ] Search functionality is available to all visitors
- [ ] No login required to view public engineer profiles
- [ ] Page loads within 3 seconds on standard internet connection

#### 2. Search Functionality
- [ ] **Advanced Search Button**:
  - [ ] Prominent "Advance Search" button/component
  - [ ] Clickable area with filter/search icon
  - [ ] Opens advanced search modal or panel
  - [ ] Clear search button to reset all filters

- [ ] **Filter Options**:
  - [ ] **Skill Filter**: Dropdown or multi-select for technical skills
  - [ ] **Language Filter**: Dropdown for programming languages
  - [ ] **Experience Filter**: Range slider or dropdown for years of experience
  - [ ] **Seniority Filter**: Dropdown for junior, mid, senior, lead levels
  - [ ] **Location Filter**: Dropdown for country/region
  - [ ] **Salary Filter**: Range slider or dropdown for salary expectations
  - [ ] **Availability Filter**: Toggle for currently available engineers

#### 3. Search Results Display
- [ ] **Results Layout**:
  - [ ] Grid or list view of engineer profiles
  - [ ] Pagination for large result sets (10-20 profiles per page)
  - [ ] Sort options: by experience, seniority, or relevance
  - [ ] Results counter showing "X engineers found"

- [ ] **Engineer Profile Cards**:
  - [ ] **Profile Image**: Professional photo or avatar
  - [ ] **Name**: Full name (e.g., "Nguyen Van A")
  - [ ] **Salary Expectation**: Display salary in Yen (e.g., "350,000 Yen")
  - [ ] **Years of Experience**: Number of years (e.g., "6 years")
  - [ ] **Location**: Country/region with globe icon (e.g., "Vietnam")
  - [ ] **Primary Skills**: 3-5 main technical skills as tags
  - [ ] **Languages**: Programming languages with proficiency levels
  - [ ] **Availability Status**: Available, Busy, or Not Available
  - [ ] **Summary**: Brief professional summary (max 100 characters)

#### 4. Limited Information Display
- [ ] **Visible Information**:
  - [ ] Public profile information only
  - [ ] No personal contact details
  - [ ] No salary information
  - [ ] No specific project details
  - [ ] No client information

- [ ] **Hidden Information**:
  - [ ] Email addresses
  - [ ] Phone numbers
  - [ ] Detailed project history
  - [ ] Client names or project details
  - [ ] Internal notes or comments

#### 5. Search Performance
- [ ] **Search Speed**:
  - [ ] Search results appear within 2 seconds
  - [ ] Real-time filtering as user types
  - [ ] Optimized database queries
  - [ ] Cached search results for common queries

- [ ] **Search Accuracy**:
  - [ ] Relevant results based on search criteria
  - [ ] Fuzzy matching for skill names
  - [ ] Partial text matching support
  - [ ] Search suggestions based on available data

## Technical Requirements

### Frontend Requirements
```typescript
// Engineer Search Component Structure
interface EngineerSearchProps {
  isLoggedIn: boolean;
  searchResults: EngineerProfile[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

interface SearchFilters {
  skills: string[];
  languages: string[];
  experienceMin: number;
  experienceMax: number;
  seniority: string[];
  location: string[];
  salaryMin: number;
  salaryMax: number;
  availability: boolean;
  searchQuery: string;
}

interface EngineerProfile {
  id: number;
  fullName: string;
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  yearsExperience: number;
  salaryExpectation: number;
  primarySkills: string[];
  languages: LanguageProficiency[];
  location: string;
  availabilityStatus: 'Available' | 'Busy' | 'Not Available';
  summary: string;
  profileImageUrl: string;
}

interface LanguageProficiency {
  language: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}
```

### Backend Requirements
```java
// Engineer Search Controller
@RestController
@RequestMapping("/api/public/engineers")
public class EngineerSearchController {
    
    @Autowired
    private EngineerSearchService engineerSearchService;
    
    @GetMapping("/search")
    public ResponseEntity<EngineerSearchResponse> searchEngineers(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) List<String> skills,
        @RequestParam(required = false) List<String> languages,
        @RequestParam(required = false) Integer experienceMin,
        @RequestParam(required = false) Integer experienceMax,
        @RequestParam(required = false) List<String> seniority,
        @RequestParam(required = false) List<String> location,
        @RequestParam(required = false) Integer salaryMin,
        @RequestParam(required = false) Integer salaryMax,
        @RequestParam(required = false) Boolean availability,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "relevance") String sortBy
    );
    
    @GetMapping("/skills")
    public ResponseEntity<List<String>> getAvailableSkills();
    
    @GetMapping("/languages")
    public ResponseEntity<List<String>> getAvailableLanguages();
    
    @GetMapping("/locations")
    public ResponseEntity<List<String>> getAvailableLocations();
}

// Engineer Search Service
@Service
public class EngineerSearchService {
    public EngineerSearchResponse searchEngineers(SearchCriteria criteria);
    public List<String> getAvailableSkills();
    public List<String> getAvailableLanguages();
    public List<String> getAvailableLocations();
}
```

### Database Schema
```sql
-- Engineers Table (existing)
CREATE TABLE engineers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255),
    years_experience INT,
    seniority VARCHAR(32),
    salary_expectation INT,
    summary TEXT,
    location VARCHAR(128),
    language_summary VARCHAR(64),
    status VARCHAR(32),
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Engineer Skills Table (existing)
CREATE TABLE engineer_skills (
    engineer_id INT NOT NULL,
    skill_id INT NOT NULL,
    level VARCHAR(32),
    years INT,
    PRIMARY KEY (engineer_id, skill_id),
    FOREIGN KEY (engineer_id) REFERENCES engineers(id),
    FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- Skills Table (existing)
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) UNIQUE,
    parent_skill_id INT,
    FOREIGN KEY (parent_skill_id) REFERENCES skills(id)
);

-- Engineer Languages Table (existing)
CREATE TABLE engineer_langs (
    engineer_id INT NOT NULL,
    lang_code VARCHAR(16) NOT NULL,
    proficiency VARCHAR(32),
    PRIMARY KEY (engineer_id, lang_code),
    FOREIGN KEY (engineer_id) REFERENCES engineers(id),
    FOREIGN KEY (lang_code) REFERENCES languages(code)
);

-- Languages Table (existing)
CREATE TABLE languages (
    code VARCHAR(16) PRIMARY KEY,
    name VARCHAR(64)
);

-- Search Indexes for Performance
CREATE INDEX idx_engineers_status ON engineers(status);
CREATE INDEX idx_engineers_seniority ON engineers(seniority);
CREATE INDEX idx_engineers_experience ON engineers(years_experience);
CREATE INDEX idx_engineers_salary ON engineers(salary_expectation);
CREATE INDEX idx_engineers_location ON engineers(location);
CREATE INDEX idx_engineer_skills_skill ON engineer_skills(skill_id);
CREATE INDEX idx_engineer_langs_lang ON engineer_langs(lang_code);

-- Search View for Optimized Queries
CREATE VIEW engineer_search_view AS
SELECT 
    e.id,
    e.full_name,
    e.years_experience,
    e.seniority,
    e.salary_expectation,
    e.location,
    e.status,
    e.profile_image_url,
    e.summary,
    GROUP_CONCAT(DISTINCT s.name) as skills,
    GROUP_CONCAT(DISTINCT l.name) as languages,
    AVG(es.level) as avg_skill_level
FROM engineers e
LEFT JOIN engineer_skills es ON e.id = es.engineer_id
LEFT JOIN skills s ON es.skill_id = s.id
LEFT JOIN engineer_langs el ON e.id = el.engineer_id
LEFT JOIN languages l ON el.lang_code = l.code
WHERE e.status = 'AVAILABLE'
GROUP BY e.id, e.full_name, e.years_experience, e.seniority, e.salary_expectation, e.location, e.status, e.profile_image_url, e.summary;
```

## Implementation Guidelines

### Frontend Implementation
```typescript
// Engineer Search Component
import React, { useState, useEffect, useCallback } from 'react';

const EngineerSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<EngineerProfile[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    skills: [],
    languages: [],
    experienceMin: 0,
    experienceMax: 20,
    seniority: [],
    location: [],
    salaryMin: 0,
    salaryMax: 1000000,
    availability: true,
    searchQuery: ''
  });

  const [availableOptions, setAvailableOptions] = useState({
    skills: [],
    languages: [],
    locations: []
  });

  useEffect(() => {
    loadAvailableOptions();
    performSearch();
  }, []);

  const loadAvailableOptions = async () => {
    try {
      const [skillsRes, languagesRes, locationsRes] = await Promise.all([
        fetch('/api/public/engineers/skills'),
        fetch('/api/public/engineers/languages'),
        fetch('/api/public/engineers/locations')
      ]);

      const [skills, languages, locations] = await Promise.all([
        skillsRes.json(),
        languagesRes.json(),
        locationsRes.json()
      ]);

      setAvailableOptions({ skills, languages, locations });
    } catch (error) {
      console.error('Error loading available options:', error);
    }
  };

  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.searchQuery) queryParams.append('query', filters.searchQuery);
      if (filters.skills.length > 0) queryParams.append('skills', filters.skills.join(','));
      if (filters.languages.length > 0) queryParams.append('languages', filters.languages.join(','));
      if (filters.experienceMin > 0) queryParams.append('experienceMin', filters.experienceMin.toString());
      if (filters.experienceMax < 20) queryParams.append('experienceMax', filters.experienceMax.toString());
      if (filters.seniority.length > 0) queryParams.append('seniority', filters.seniority.join(','));
      if (filters.location.length > 0) queryParams.append('location', filters.location.join(','));
      if (filters.salaryMin > 0) queryParams.append('salaryMin', filters.salaryMin.toString());
      if (filters.salaryMax < 1000000) queryParams.append('salaryMax', filters.salaryMax.toString());
      if (filters.availability !== null) queryParams.append('availability', filters.availability.toString());
      
      queryParams.append('page', currentPage.toString());
      queryParams.append('size', '20');
      queryParams.append('sortBy', 'relevance');

      const response = await fetch(`/api/public/engineers/search?${queryParams}`);
      const data = await response.json();
      
      setSearchResults(data.results);
      setTotalResults(data.totalResults);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  return (
    <div className="engineer-search">
      {/* Search Header */}
      <div className="search-header">
        <h1>Find Engineers</h1>
        <p>Discover skilled engineers available for your projects</p>
      </div>

      {/* Advanced Search Button */}
      <div className="advanced-search">
        <button
          className="advanced-search-button"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        >
          <span className="filter-icon">🔍</span>
          Advance Search
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Skills:</label>
          <select 
            multiple
            value={filters.skills}
            onChange={(e) => setFilters({...filters, skills: Array.from(e.target.selectedOptions, option => option.value)})}
          >
            {availableOptions.skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Languages:</label>
          <select 
            multiple
            value={filters.languages}
            onChange={(e) => setFilters({...filters, languages: Array.from(e.target.selectedOptions, option => option.value)})}
          >
            {availableOptions.languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Experience:</label>
          <input
            type="range"
            min="0"
            max="20"
            value={filters.experienceMin}
            onChange={(e) => setFilters({...filters, experienceMin: parseInt(e.target.value)})}
          />
          <span>{filters.experienceMin} - {filters.experienceMax} years</span>
        </div>

        <div className="filter-group">
          <label>Salary Range (Yen):</label>
          <input
            type="range"
            min="0"
            max="1000000"
            step="10000"
            value={filters.salaryMin}
            onChange={(e) => setFilters({...filters, salaryMin: parseInt(e.target.value)})}
          />
          <span>{filters.salaryMin.toLocaleString()} - {filters.salaryMax.toLocaleString()} Yen</span>
        </div>

        <div className="filter-group">
          <label>Seniority:</label>
          <select 
            multiple
            value={filters.seniority}
            onChange={(e) => setFilters({...filters, seniority: Array.from(e.target.selectedOptions, option => option.value)})}
          >
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Location:</label>
          <select 
            multiple
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: Array.from(e.target.selectedOptions, option => option.value)})}
          >
            {availableOptions.locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={filters.availability}
              onChange={(e) => setFilters({...filters, availability: e.target.checked})}
            />
            Available Only
          </label>
        </div>
      </div>

      {/* Search Results */}
      <div className="search-results">
        <div className="results-header">
          <h2>{totalResults} engineers found</h2>
          <div className="sort-options">
            <select onChange={(e) => {/* Handle sort */}}>
              <option value="relevance">Relevance</option>
              <option value="experience">Experience</option>
              <option value="seniority">Seniority</option>
            </select>
          </div>
        </div>

        <div className="engineer-grid">
          {searchResults.map(engineer => (
            <EngineerCard key={engineer.id} engineer={engineer} />
          ))}
        </div>

        {/* Pagination */}
        {totalResults > 20 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span>Page {currentPage + 1} of {Math.ceil(totalResults / 20)}</span>
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= Math.ceil(totalResults / 20) - 1}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Engineer Card Component
const EngineerCard: React.FC<{ engineer: EngineerProfile }> = ({ engineer }) => (
  <div className="engineer-card">
    <div className="engineer-image">
      <img 
        src={engineer.profileImageUrl || '/images/default-engineer.jpg'} 
        alt={`${engineer.firstName} ${engineer.lastNameInitial}`}
        onError={(e) => {
          e.currentTarget.src = '/images/default-engineer.jpg';
        }}
      />
    </div>
    
    <div className="engineer-info">
      <h3>{engineer.fullName}</h3>
      <p className="salary">Salary Expectation: {engineer.salaryExpectation.toLocaleString()} Yen</p>
      <p className="experience">Years of experience: {engineer.yearsExperience} years</p>
      
      <div className="skills">
        {engineer.primarySkills.map(skill => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>
      
      <div className="languages">
        {engineer.languages.map(lang => (
          <span key={lang.language} className="language-tag">
            {lang.language} ({lang.proficiency})
          </span>
        ))}
      </div>
      
      <div className="location">
        <span className="location-icon">🌍</span>
        {engineer.location}
      </div>
      
      <div className="availability">
        <span className={`status ${engineer.availabilityStatus.toLowerCase().replace(' ', '-')}`}>
          {engineer.availabilityStatus}
        </span>
      </div>
      
      <p className="summary">{engineer.summary}</p>
    </div>
  </div>
);
```

### Backend Implementation
```java
// Engineer Search Controller
@RestController
@RequestMapping("/api/public/engineers")
public class EngineerSearchController {
    
    @Autowired
    private EngineerSearchService engineerSearchService;
    
    @GetMapping("/search")
    public ResponseEntity<EngineerSearchResponse> searchEngineers(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) List<String> skills,
        @RequestParam(required = false) List<String> languages,
        @RequestParam(required = false) Integer experienceMin,
        @RequestParam(required = false) Integer experienceMax,
        @RequestParam(required = false) List<String> seniority,
        @RequestParam(required = false) List<String> location,
        @RequestParam(required = false) Boolean availability,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "relevance") String sortBy
    ) {
        SearchCriteria criteria = new SearchCriteria();
        criteria.setQuery(query);
        criteria.setSkills(skills);
        criteria.setLanguages(languages);
        criteria.setExperienceMin(experienceMin);
        criteria.setExperienceMax(experienceMax);
        criteria.setSeniority(seniority);
        criteria.setLocation(location);
        criteria.setSalaryMin(salaryMin);
        criteria.setSalaryMax(salaryMax);
        criteria.setAvailability(availability);
        criteria.setPage(page);
        criteria.setSize(size);
        criteria.setSortBy(sortBy);
        
        EngineerSearchResponse response = engineerSearchService.searchEngineers(criteria);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/skills")
    public ResponseEntity<List<String>> getAvailableSkills() {
        List<String> skills = engineerSearchService.getAvailableSkills();
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/languages")
    public ResponseEntity<List<String>> getAvailableLanguages() {
        List<String> languages = engineerSearchService.getAvailableLanguages();
        return ResponseEntity.ok(languages);
    }
    
    @GetMapping("/locations")
    public ResponseEntity<List<String>> getAvailableLocations() {
        List<String> locations = engineerSearchService.getAvailableLocations();
        return ResponseEntity.ok(locations);
    }
}

// Engineer Search Service
@Service
public class EngineerSearchService {
    
    @Autowired
    private EngineerRepository engineerRepository;
    
    @Autowired
    private EngineerSkillsRepository engineerSkillsRepository;
    
    @Autowired
    private EngineerLanguagesRepository engineerLanguagesRepository;
    
    public EngineerSearchResponse searchEngineers(SearchCriteria criteria) {
        // Build dynamic query based on criteria
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT DISTINCT e.* FROM engineers e ");
        queryBuilder.append("LEFT JOIN engineer_skills es ON e.id = es.engineer_id ");
        queryBuilder.append("LEFT JOIN skills s ON es.skill_id = s.id ");
        queryBuilder.append("LEFT JOIN engineer_langs el ON e.id = el.engineer_id ");
        queryBuilder.append("LEFT JOIN languages l ON el.lang_code = l.code ");
        queryBuilder.append("WHERE e.status = 'AVAILABLE' ");
        
        List<Object> parameters = new ArrayList<>();
        
        // Add search criteria
        if (criteria.getQuery() != null && !criteria.getQuery().trim().isEmpty()) {
            queryBuilder.append("AND (e.full_name LIKE ? OR e.summary LIKE ? OR s.name LIKE ? OR l.name LIKE ?) ");
            String searchTerm = "%" + criteria.getQuery() + "%";
            parameters.add(searchTerm);
            parameters.add(searchTerm);
            parameters.add(searchTerm);
            parameters.add(searchTerm);
        }
        
        if (criteria.getSkills() != null && !criteria.getSkills().isEmpty()) {
            queryBuilder.append("AND s.name IN (");
            for (int i = 0; i < criteria.getSkills().size(); i++) {
                if (i > 0) queryBuilder.append(",");
                queryBuilder.append("?");
                parameters.add(criteria.getSkills().get(i));
            }
            queryBuilder.append(") ");
        }
        
        if (criteria.getLanguages() != null && !criteria.getLanguages().isEmpty()) {
            queryBuilder.append("AND l.name IN (");
            for (int i = 0; i < criteria.getLanguages().size(); i++) {
                if (i > 0) queryBuilder.append(",");
                queryBuilder.append("?");
                parameters.add(criteria.getLanguages().get(i));
            }
            queryBuilder.append(") ");
        }
        
        if (criteria.getExperienceMin() != null) {
            queryBuilder.append("AND e.years_experience >= ? ");
            parameters.add(criteria.getExperienceMin());
        }
        
        if (criteria.getExperienceMax() != null) {
            queryBuilder.append("AND e.years_experience <= ? ");
            parameters.add(criteria.getExperienceMax());
        }
        
        if (criteria.getSeniority() != null && !criteria.getSeniority().isEmpty()) {
            queryBuilder.append("AND e.seniority IN (");
            for (int i = 0; i < criteria.getSeniority().size(); i++) {
                if (i > 0) queryBuilder.append(",");
                queryBuilder.append("?");
                parameters.add(criteria.getSeniority().get(i));
            }
            queryBuilder.append(") ");
        }
        
        if (criteria.getLocation() != null && !criteria.getLocation().isEmpty()) {
            queryBuilder.append("AND e.location IN (");
            for (int i = 0; i < criteria.getLocation().size(); i++) {
                if (i > 0) queryBuilder.append(",");
                queryBuilder.append("?");
                parameters.add(criteria.getLocation().get(i));
            }
            queryBuilder.append(") ");
        }
        
        if (criteria.getSalaryMin() != null) {
            queryBuilder.append("AND e.salary_expectation >= ? ");
            parameters.add(criteria.getSalaryMin());
        }
        
        if (criteria.getSalaryMax() != null) {
            queryBuilder.append("AND e.salary_expectation <= ? ");
            parameters.add(criteria.getSalaryMax());
        }
        
        if (criteria.getAvailability() != null && criteria.getAvailability()) {
            queryBuilder.append("AND e.status = 'AVAILABLE' ");
        }
        
        // Add sorting
        switch (criteria.getSortBy()) {
            case "experience":
                queryBuilder.append("ORDER BY e.years_experience DESC ");
                break;
            case "seniority":
                queryBuilder.append("ORDER BY CASE e.seniority WHEN 'Lead' THEN 4 WHEN 'Senior' THEN 3 WHEN 'Mid' THEN 2 WHEN 'Junior' THEN 1 END DESC ");
                break;
            default:
                queryBuilder.append("ORDER BY e.years_experience DESC ");
                break;
        }
        
        // Add pagination
        queryBuilder.append("LIMIT ? OFFSET ? ");
        parameters.add(criteria.getSize());
        parameters.add(criteria.getPage() * criteria.getSize());
        
        // Execute query
        List<Engineer> engineers = engineerRepository.findByCustomQuery(queryBuilder.toString(), parameters);
        
        // Convert to public profiles
        List<EngineerProfile> profiles = engineers.stream()
            .map(this::convertToPublicProfile)
            .collect(Collectors.toList());
        
        // Get total count
        long totalCount = engineerRepository.countByCustomQuery(queryBuilder.toString(), parameters);
        
        EngineerSearchResponse response = new EngineerSearchResponse();
        response.setResults(profiles);
        response.setTotalResults(totalCount);
        response.setCurrentPage(criteria.getPage());
        response.setTotalPages((int) Math.ceil((double) totalCount / criteria.getSize()));
        
        return response;
    }
    
    private EngineerProfile convertToPublicProfile(Engineer engineer) {
        EngineerProfile profile = new EngineerProfile();
        profile.setId(engineer.getId());
        
        // Use full name as shown in wireframe
        profile.setFullName(engineer.getFullName());
        
        profile.setSeniority(engineer.getSeniority());
        profile.setYearsExperience(engineer.getYearsExperience());
        profile.setSalaryExpectation(engineer.getSalaryExpectation());
        profile.setLocation(engineer.getLocation());
        profile.setAvailabilityStatus(engineer.getStatus());
        profile.setSummary(engineer.getSummary());
        profile.setProfileImageUrl(engineer.getProfileImageUrl());
        
        // Get skills and languages
        profile.setPrimarySkills(engineerSkillsRepository.findSkillsByEngineerId(engineer.getId()));
        profile.setLanguages(engineerLanguagesRepository.findLanguagesByEngineerId(engineer.getId()));
        
        return profile;
    }
    
    public List<String> getAvailableSkills() {
        return engineerSkillsRepository.findDistinctSkillNames();
    }
    
    public List<String> getAvailableLanguages() {
        return engineerLanguagesRepository.findDistinctLanguageNames();
    }
    
    public List<String> getAvailableLocations() {
        return engineerRepository.findDistinctLocations();
    }
}
```

## Testing Requirements

### Unit Tests
```typescript
// Engineer Search Component Tests
describe('EngineerSearch Component', () => {
  it('should render search interface without authentication', () => {
    render(<EngineerSearch />);
    expect(screen.getByText('Find Engineers')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by skill, language, or experience...')).toBeInTheDocument();
  });
  
  it('should display search results', async () => {
    const mockEngineers = [
      { id: 1, firstName: 'John', lastNameInitial: 'D.', seniority: 'Senior', yearsExperience: 5 },
      { id: 2, firstName: 'Jane', lastNameInitial: 'S.', seniority: 'Mid', yearsExperience: 3 }
    ];
    
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ results: mockEngineers, totalResults: 2 })
    });
    
    render(<EngineerSearch />);
    
    await waitFor(() => {
      expect(screen.getByText('John D.')).toBeInTheDocument();
      expect(screen.getByText('Jane S.')).toBeInTheDocument();
    });
  });
  
  it('should filter results based on search criteria', async () => {
    render(<EngineerSearch />);
    
    const searchInput = screen.getByPlaceholderText('Search by skill, language, or experience...');
    fireEvent.change(searchInput, { target: { value: 'React' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('query=React'));
    });
  });
  
  it('should display engineer information with salary', () => {
    const mockEngineer = {
      id: 1,
      fullName: 'Nguyen Van A',
      seniority: 'Senior',
      yearsExperience: 6,
      salaryExpectation: 350000,
      primarySkills: ['React', 'Node.js'],
      location: 'Vietnam',
      availabilityStatus: 'Available',
      summary: 'Experienced full-stack developer'
    };
    
    render(<EngineerCard engineer={mockEngineer} />);
    
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument();
    expect(screen.getByText('Salary Expectation: 350,000 Yen')).toBeInTheDocument();
    expect(screen.getByText('Years of experience: 6 years')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vietnam')).toBeInTheDocument();
    
    // Should not display sensitive information
    expect(screen.queryByText('john.doe@email.com')).not.toBeInTheDocument();
    expect(screen.queryByText('+84')).not.toBeInTheDocument();
  });
});
```

### Integration Tests
```java
// Engineer Search Controller Tests
@SpringBootTest
@AutoConfigureTestDatabase
class EngineerSearchControllerTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void testSearchEngineers() {
        ResponseEntity<EngineerSearchResponse> response = restTemplate.getForEntity(
            "/api/public/engineers/search?query=React&skills=JavaScript&experienceMin=3&salaryMin=300000&salaryMax=500000",
            EngineerSearchResponse.class
        );
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().getResults().isEmpty());
    }
    
    @Test
    void testGetAvailableSkills() {
        ResponseEntity<List<String>> response = restTemplate.getForEntity(
            "/api/public/engineers/skills",
            new ParameterizedTypeReference<List<String>>() {}
        );
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isEmpty());
    }
    
    @Test
    void testGetAvailableLanguages() {
        ResponseEntity<List<String>> response = restTemplate.getForEntity(
            "/api/public/engineers/languages",
            new ParameterizedTypeReference<List<String>>() {}
        );
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isEmpty());
    }
    
    @Test
    void testGetAvailableLocations() {
        ResponseEntity<List<String>> response = restTemplate.getForEntity(
            "/api/public/engineers/locations",
            new ParameterizedTypeReference<List<String>>() {}
        );
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isEmpty());
    }
}
```

### End-to-End Tests
```typescript
// E2E Tests
describe('Engineer Search E2E Tests', () => {
  it('should search and display engineer profiles', () => {
    cy.visit('/engineers');
    
    // Verify search interface
    cy.contains('Find Engineers').should('be.visible');
    cy.get('input[placeholder*="Search by skill"]').should('be.visible');
    
    // Perform search
    cy.get('input[placeholder*="Search by skill"]').type('React');
    cy.get('button').contains('Search').click();
    
    // Verify results
    cy.get('.engineer-card').should('have.length.at.least', 1);
    cy.get('.engineer-card').first().within(() => {
      cy.contains('Salary Expectation').should('be.visible');
      cy.contains('Years of experience').should('be.visible');
      cy.contains('🌍').should('be.visible');
    });
  });
  
  it('should filter engineers by multiple criteria', () => {
    cy.visit('/engineers');
    
    // Apply filters
    cy.get('select[multiple]').first().select(['JavaScript', 'React']);
    cy.get('input[type="range"]').first().invoke('val', 5);
    cy.get('input[type="range"]').last().invoke('val', 400000);
    cy.get('button').contains('Search').click();
    
    // Verify filtered results
    cy.get('.engineer-card').should('have.length.at.least', 1);
    cy.get('.engineer-card').each(($card) => {
      cy.wrap($card).should('contain', 'JavaScript').or('contain', 'React');
    });
  });
  
  it('should display pagination for large result sets', () => {
    cy.visit('/engineers');
    
    // Perform broad search
    cy.get('button').contains('Search').click();
    
    // Verify pagination if results > 20
    cy.get('body').then(($body) => {
      if ($body.find('.pagination').length > 0) {
        cy.get('.pagination').should('be.visible');
        cy.get('.pagination button').contains('Next').should('be.visible');
      }
    });
  });
  
  it('should not display sensitive information', () => {
    cy.visit('/engineers');
    cy.get('button').contains('Search').click();
    
    // Verify no sensitive information is displayed
    cy.get('.engineer-card').first().within(() => {
      cy.get('input[type="email"]').should('not.exist');
      cy.get('input[type="tel"]').should('not.exist');
      cy.contains('@').should('not.exist');
      // Salary is displayed in Yen, not $ symbol
      cy.contains('Yen').should('be.visible');
    });
  });
});
```

## Performance Requirements

### Performance Metrics
- **Search Response Time**: < 2 seconds
- **Page Load Time**: < 3 seconds
- **Filter Response Time**: < 1 second
- **Database Query Time**: < 500ms
- **Result Rendering Time**: < 200ms

### Optimization Strategies
```typescript
// Search Optimization
const useSearchOptimization = () => {
  const [searchDebounce] = useState(300);
  
  const debouncedSearch = useCallback(
    debounce((filters: SearchFilters) => {
      performSearch(filters);
    }, searchDebounce),
    [searchDebounce]
  );
  
  useEffect(() => {
    debouncedSearch(filters);
  }, [filters, debouncedSearch]);
};
```

```java
// Database Optimization
@Repository
public class EngineerRepository {
    
    @Query(value = "SELECT * FROM engineer_search_view WHERE " +
                   "(:query IS NULL OR full_name LIKE %:query% OR summary LIKE %:query%) " +
                   "AND (:skills IS NULL OR skills LIKE %:skills%) " +
                   "AND (:languages IS NULL OR languages LIKE %:languages%) " +
                   "AND (:experienceMin IS NULL OR years_experience >= :experienceMin) " +
                   "AND (:experienceMax IS NULL OR years_experience <= :experienceMax) " +
                   "AND (:seniority IS NULL OR seniority IN :seniority) " +
                   "AND (:location IS NULL OR location IN :location) " +
                   "AND (:salaryMin IS NULL OR salary_expectation >= :salaryMin) " +
                   "AND (:salaryMax IS NULL OR salary_expectation <= :salaryMax) " +
                   "AND (:availability IS NULL OR status = 'AVAILABLE') " +
                   "ORDER BY years_experience DESC " +
                   "LIMIT :size OFFSET :offset", nativeQuery = true)
    List<Engineer> searchEngineersOptimized(
        @Param("query") String query,
        @Param("skills") String skills,
        @Param("languages") String languages,
        @Param("experienceMin") Integer experienceMin,
        @Param("experienceMax") Integer experienceMax,
        @Param("seniority") List<String> seniority,
        @Param("location") List<String> location,
        @Param("salaryMin") Integer salaryMin,
        @Param("salaryMax") Integer salaryMax,
        @Param("availability") Boolean availability,
        @Param("size") int size,
        @Param("offset") int offset
    );
}
```

## Security Considerations

### Data Privacy
```java
// Privacy Protection Service
@Service
public class PrivacyProtectionService {
    
    public EngineerProfile sanitizeEngineerProfile(Engineer engineer) {
        EngineerProfile profile = new EngineerProfile();
        
        // Only include public information
        profile.setId(engineer.getId());
        profile.setFullName(engineer.getFullName());
        profile.setSeniority(engineer.getSeniority());
        profile.setYearsExperience(engineer.getYearsExperience());
        profile.setSalaryExpectation(engineer.getSalaryExpectation());
        profile.setLocation(engineer.getLocation());
        profile.setAvailabilityStatus(engineer.getStatus());
        profile.setSummary(truncateSummary(engineer.getSummary(), 100));
        profile.setProfileImageUrl(engineer.getProfileImageUrl());
        
        // Exclude sensitive information
        // - No email addresses
        // - No phone numbers
        // - No detailed project history
        // - No client information
        // - No internal notes or comments
        
        return profile;
    }
    
    
    private String truncateSummary(String summary, int maxLength) {
        if (summary == null) return "";
        if (summary.length() <= maxLength) return summary;
        return summary.substring(0, maxLength) + "...";
    }
}
```

### Input Validation
```java
// Search Input Validation
@Component
public class SearchInputValidator {
    
    public void validateSearchCriteria(SearchCriteria criteria) {
        if (criteria.getQuery() != null && criteria.getQuery().length() > 100) {
            throw new IllegalArgumentException("Search query too long");
        }
        
        if (criteria.getSkills() != null && criteria.getSkills().size() > 10) {
            throw new IllegalArgumentException("Too many skills selected");
        }
        
        if (criteria.getLanguages() != null && criteria.getLanguages().size() > 10) {
            throw new IllegalArgumentException("Too many languages selected");
        }
        
        if (criteria.getExperienceMin() != null && criteria.getExperienceMin() < 0) {
            throw new IllegalArgumentException("Invalid minimum experience");
        }
        
        if (criteria.getExperienceMax() != null && criteria.getExperienceMax() > 50) {
            throw new IllegalArgumentException("Invalid maximum experience");
        }
        
        if (criteria.getSalaryMin() != null && criteria.getSalaryMin() < 0) {
            throw new IllegalArgumentException("Invalid minimum salary");
        }
        
        if (criteria.getSalaryMax() != null && criteria.getSalaryMax() > 10000000) {
            throw new IllegalArgumentException("Invalid maximum salary");
        }
    }
}
```

## Definition of Done

### Development Complete
- [ ] Search interface implemented with all filter options
- [ ] Engineer profile cards display limited information only
- [ ] Search results pagination implemented
- [ ] Real-time search functionality
- [ ] Performance optimization applied

### Testing Complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Performance tests completed
- [ ] Security tests completed

### Documentation Complete
- [ ] API documentation updated
- [ ] User guide updated
- [ ] Technical documentation updated
- [ ] Security guidelines updated

### Deployment Complete
- [ ] Code deployed to staging environment
- [ ] Staging testing completed
- [ ] Production deployment completed
- [ ] Database indexes created
- [ ] Performance monitoring configured

## Dependencies

### External Dependencies
- **Next.js 14+**: Frontend framework
- **React 18+**: UI library
- **TypeScript**: Type safety
- **Spring Boot 3.x**: Backend framework
- **MySQL 8.0+**: Database

### Internal Dependencies
- **Engineer Management**: Engineer data and profiles
- **Skills Management**: Skills taxonomy and categorization
- **Languages Management**: Programming language data
- **Search Service**: Search functionality and indexing

## Risks and Mitigation

### Technical Risks
- **Search Performance**: Large dataset may slow search
  - *Mitigation*: Implement database indexes and query optimization
- **Data Privacy**: Accidental exposure of sensitive information
  - *Mitigation*: Implement strict data sanitization and privacy controls
- **Search Accuracy**: Poor search results may frustrate users
  - *Mitigation*: Implement fuzzy matching and relevance scoring

### Business Risks
- **User Experience**: Complex search interface may confuse users
  - *Mitigation*: Conduct user testing and iterative improvements
- **Data Quality**: Inaccurate engineer profiles may mislead users
  - *Mitigation*: Implement data validation and quality checks

## Success Metrics

### Business Metrics
- **Search Usage**: Target 1000+ searches per month
- **User Engagement**: Target 5+ minutes average session time
- **Search Success Rate**: Target 80% of searches return relevant results
- **Filter Usage**: Target 60% of users use advanced filters

### Technical Metrics
- **Search Response Time**: Target < 2 seconds
- **Page Load Time**: Target < 3 seconds
- **Error Rate**: Target < 1% error rate
- **Uptime**: Target 99.9% uptime

## Future Enhancements

### Phase 2 Features
- **Advanced Search**: Boolean operators and complex queries
- **Search Suggestions**: Auto-complete and search suggestions
- **Saved Searches**: Save and reuse search criteria
- **Search Analytics**: Track popular searches and trends

### Phase 3 Features
- **AI-Powered Matching**: Machine learning for better matching
- **Recommendation Engine**: Suggest relevant engineers
- **Search History**: Track user search history
- **Export Results**: Export search results to PDF/Excel

---

**Story Status**: Ready for Development  
**Assigned To**: Frontend Team, Backend Team  
**Estimated Effort**: 13 Story Points  
**Target Sprint**: Sprint 1  
**Review Date**: End of Sprint 1
