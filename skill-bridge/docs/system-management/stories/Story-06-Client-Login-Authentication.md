# User Story: Client Login Authentication

## Story Information
- **Story ID**: Story-06
- **Title**: Client Login Authentication
- **Epic**: Client Portal Access
- **Priority**: High
- **Story Points**: 8
- **Sprint**: Sprint 2
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** login to the Client Portal using my email and password  
**So that** I can access my account and view my projects

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can login to the Client Portal using my email and password
- [ ] Login page matches the wireframe design
- [ ] I receive appropriate error messages for invalid credentials
- [ ] Successful login redirects me to the client dashboard

### Detailed Acceptance Criteria

#### 1. Login Page Layout (Based on Wireframe)
- [ ] **Left Section - Branding**:
  - [ ] Rectangular box with black border containing "SKILL BRIDGE" text in large, bold font
  - [ ] "Client Portal" text below in smaller font
  - [ ] Branding is prominently displayed on the left side

- [ ] **Right Section - Login Form**:
  - [ ] "Login" heading at the top in large font
  - [ ] Mail address input field:
    - [ ] Label "Mail address" displayed above input
    - [ ] Input field with placeholder "abc@gmail.com"
    - [ ] Input accepts valid email format
  - [ ] Password input field:
    - [ ] Label "password" displayed above input
    - [ ] Input field with placeholder "password"
    - [ ] Password is masked (hidden characters)
  - [ ] "Forgot password" link:
    - [ ] Displayed below password field, aligned to the right
    - [ ] Underlined text link
    - [ ] Clicking opens forgot password modal
  - [ ] Login button:
    - [ ] Rectangular button with "Login" text
    - [ ] Centered below the forgot password link
    - [ ] Submits login form on click

#### 2. Login Functionality
- [ ] **Form Validation**:
  - [ ] Email field validation (required, valid email format)
  - [ ] Password field validation (required, minimum length)
  - [ ] Error messages displayed for invalid inputs
  - [ ] Form cannot be submitted with invalid data

- [ ] **Authentication Process**:
  - [ ] Login request sent to backend API with email and password
  - [ ] Backend validates credentials against database
  - [ ] Password is verified using BCrypt
  - [ ] User account must be active to login
  - [ ] JWT token generated upon successful authentication
  - [ ] Token stored in localStorage or secure cookie

- [ ] **Success Response**:
  - [ ] User redirected to client dashboard upon successful login
  - [ ] JWT token included in subsequent API requests
  - [ ] User information (name, email, role) loaded and displayed
  - [ ] Session persists across page refreshes

- [ ] **Error Handling**:
  - [ ] Invalid email format shows validation error
  - [ ] Invalid credentials show error message: "Invalid email or password"
  - [ ] Inactive account shows error: "Your account is inactive. Please contact support"
  - [ ] Network errors show appropriate error message
  - [ ] Error messages are clear and user-friendly

#### 3. Security Requirements
- [ ] **Password Security**:
  - [ ] Passwords are hashed using BCrypt on backend
  - [ ] Plain password never stored in database
  - [ ] Password comparison uses secure BCrypt verification

- [ ] **JWT Token Management**:
  - [ ] Token expiration: 24 hours (configurable)
  - [ ] Refresh token mechanism for extended sessions
  - [ ] Token stored securely (HttpOnly cookie or localStorage)
  - [ ] Token validated on each authenticated request

- [ ] **Account Security**:
  - [ ] Account must be active (isActive = true)
  - [ ] Failed login attempts logged (optional, for future rate limiting)
  - [ ] Session timeout handling

## Technical Requirements

### Frontend Requirements
```typescript
// Login Page Component Structure
interface LoginPageProps {
  redirectTo?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
}
```

### Backend Requirements
```java
// Authentication Controller
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request);
}

// Login Request DTO
public class LoginRequest {
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    @Size(min = 8)
    private String password;
}

// Login Response DTO
public class LoginResponse {
    private String token;
    private UserDTO user;
}
```

### Database Schema
```sql
-- Users table (existing)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    full_name VARCHAR(255),
    company_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(32) DEFAULT 'CLIENT',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Implementation Guidelines

### Frontend Implementation
```typescript
// Login Page Component based on wireframe
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.message || 'Login failed' });
        return;
      }

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push('/client/dashboard');
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="w-1/2 flex items-center justify-center border-r border-gray-300">
        <div className="border-2 border-black p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">SKILL BRIDGE</h1>
          <p className="text-lg">Client Portal</p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-normal mb-8">Login</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <Label htmlFor="email">Mail address</Label>
              <Input
                id="email"
                type="email"
                placeholder="abc@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="mb-6 text-right">
              <Link 
                href="/client/forgot-password" 
                className="text-sm underline hover:text-gray-700"
              >
                Forgot password
              </Link>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-4 text-red-500 text-sm">{errors.submit}</div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### Backend Implementation
```java
// Authentication Service
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordService passwordService;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    public LoginResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        
        // Check if account is active
        if (!user.getIsActive()) {
            throw new AccountInactiveException("Your account is inactive. Please contact support");
        }
        
        // Verify password
        if (!passwordService.verifyPassword(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user);
        
        // Build response
        UserDTO userDTO = convertToDTO(user);
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(userDTO);
        
        return response;
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        return dto;
    }
}
```

## Testing Requirements

### Unit Tests
- [ ] Login form validation tests
- [ ] Email format validation tests
- [ ] Password validation tests
- [ ] Error message display tests

### Integration Tests
- [ ] Successful login flow
- [ ] Invalid credentials handling
- [ ] Inactive account handling
- [ ] JWT token generation and validation

### End-to-End Tests
- [ ] Complete login flow from UI to backend
- [ ] Login page matches wireframe layout
- [ ] Successful login redirects to dashboard
- [ ] Error messages display correctly

## Performance Requirements

### Performance Metrics
- **Login Response Time**: < 500ms
- **Page Load Time**: < 2 seconds
- **Form Validation**: Real-time (no delay)

## Security Considerations

### Security Requirements
- [ ] Passwords hashed with BCrypt
- [ ] JWT tokens have expiration
- [ ] HTTPS required for all authentication requests
- [ ] Rate limiting for login attempts (future enhancement)
- [ ] Account lockout after multiple failed attempts (future enhancement)

## Definition of Done

### Development Complete
- [ ] Login page implemented matching wireframe
- [ ] Authentication service implemented
- [ ] JWT token generation working
- [ ] Form validation implemented
- [ ] Error handling implemented
- [ ] Responsive design implemented

### Testing Complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Security tests completed

### Documentation Complete
- [ ] API documentation updated
- [ ] Technical documentation updated
- [ ] Deployment guide updated

## Dependencies

### External Dependencies
- **Next.js 14+**: Frontend framework
- **React 18+**: UI library
- **Spring Security**: Authentication framework
- **JWT Library**: Token generation

### Internal Dependencies
- **User Entity**: Existing user table
- **PasswordService**: Password hashing service
- **EmailService**: Email service (for future password reset)

## Risks and Mitigation

### Technical Risks
- **Security Vulnerabilities**: Authentication is critical for security
  - *Mitigation*: Use proven libraries (Spring Security, JWT), code review, security testing
- **Token Management**: Token expiration and refresh complexity
  - *Mitigation*: Use standard JWT library, implement refresh token mechanism

### Business Risks
- **User Experience**: Poor login experience may deter users
  - *Mitigation*: Follow wireframe design, clear error messages, responsive design

---

**Story Status**: Ready for Development  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 8 Story Points  
**Target Sprint**: Sprint 2

