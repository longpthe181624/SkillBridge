# User Story: Sales Login Authentication

## Story Information
- **Story ID**: Story-18
- **Title**: Sales Login Authentication
- **Epic**: Sales Portal Access
- **Priority**: High
- **Story Points**: 8
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User  
**I want to** login to the Sales Portal using my email and password  
**So that** I can access my sales account and manage client relationships

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can login to the Sales Portal using my email and password
- [ ] Login page matches the wireframe design with orange gradient theme
- [ ] I can toggle password visibility using the eye icon
- [ ] I receive appropriate error messages for invalid credentials
- [ ] Successful login redirects me to the sales dashboard
- [ ] Multi-language support (Japanese/English) is available

### Detailed Acceptance Criteria

#### 1. Login Page Layout (Based on Wireframe)

- [ ] **Left Section - Branding**:
  - [ ] "SKILL BRIDGE_" text displayed prominently in large, bold, orange uppercase letters
  - [ ] Underscore character at the end suggests active text field or cursor
  - [ ] Branding is prominently displayed on the left side
  - [ ] Background has soft orange and white gradient (from darker orange on left to lighter orange/white on right)

- [ ] **Right Section - Login Form**:
  - [ ] "ログイン" (Login) heading at the top in black, large font
  - [ ] Multi-language support: Text switches between Japanese and English based on language selection
  - [ ] Mail address input field:
    - [ ] Label "メールアドレス" (Email address) displayed above input in black text
    - [ ] Light blue-grey rectangular input field with rounded corners
    - [ ] Input accepts valid email format
    - [ ] Placeholder text or pre-filled example: "khang@landbridge.co.jp"
    - [ ] Input field has proper focus states
  - [ ] Password input field:
    - [ ] Label "パスワード" (Password) displayed above input in black text
    - [ ] Light blue-grey rectangular input field with rounded corners
    - [ ] Password is masked by default (displayed as "••••••••••")
    - [ ] Eye icon with diagonal line through it displayed on the right side of input field
    - [ ] Clicking eye icon toggles password visibility (show/hide)
    - [ ] When password is visible, eye icon changes to show password is revealed
    - [ ] When password is hidden, eye icon shows diagonal line indicating hidden state
  - [ ] Login button:
    - [ ] Large, rectangular button with rounded corners
    - [ ] Orange gradient background (transitioning from darker orange on left to lighter orange on right)
    - [ ] Button text "ログイン" (Login) displayed in white
    - [ ] Button is full-width or appropriately sized
    - [ ] Button has hover and active states
    - [ ] Button is disabled during login process with loading indicator

#### 2. Login Functionality

- [ ] **Form Validation**:
  - [ ] Email field validation (required, valid email format)
  - [ ] Password field validation (required, minimum length)
  - [ ] Real-time validation feedback
  - [ ] Error messages displayed for invalid inputs in appropriate language
  - [ ] Form cannot be submitted with invalid data

- [ ] **Authentication Process**:
  - [ ] Login request sent to backend API with email and password
  - [ ] Backend validates credentials against database
  - [ ] User role must be "SALES" to access Sales Portal
  - [ ] Password is verified using BCrypt
  - [ ] User account must be active to login
  - [ ] JWT token generated upon successful authentication
  - [ ] Token stored in localStorage or secure cookie
  - [ ] User role and permissions included in token

- [ ] **Success Response**:
  - [ ] User redirected to sales dashboard upon successful login
  - [ ] JWT token included in subsequent API requests
  - [ ] User information (name, email, role) loaded and displayed
  - [ ] Session persists across page refreshes
  - [ ] Sales-specific permissions and access granted

- [ ] **Error Handling**:
  - [ ] Invalid email format shows validation error in selected language
  - [ ] Invalid credentials show error message: "Invalid email or password" (or Japanese equivalent)
  - [ ] Wrong role (non-SALES user) shows error: "Access denied. This account does not have sales permissions"
  - [ ] Inactive account shows error: "Your account is inactive. Please contact support" (or Japanese equivalent)
  - [ ] Network errors show appropriate error message
  - [ ] Error messages are clear and user-friendly
  - [ ] Error messages support multi-language

#### 3. Password Visibility Toggle

- [ ] **Toggle Functionality**:
  - [ ] Eye icon visible on the right side of password input field
  - [ ] Default state: Password is hidden, eye icon shows diagonal line
  - [ ] Clicking eye icon toggles between show/hide states
  - [ ] When password is visible, characters are displayed in plain text
  - [ ] When password is hidden, characters are masked with dots/bullets
  - [ ] Icon state changes appropriately (eye open/closed or with/without diagonal line)
  - [ ] Toggle works smoothly without page refresh
  - [ ] Toggle state persists during form interaction but resets on page reload

#### 4. Multi-Language Support

- [ ] **Language Switching**:
  - [ ] Language selector available on login page (JA/EN)
  - [ ] All text elements switch language dynamically:
    - [ ] Page title "ログイン" / "Login"
    - [ ] Email label "メールアドレス" / "Email address"
    - [ ] Password label "パスワード" / "Password"
    - [ ] Button text "ログイン" / "Login"
    - [ ] Error messages
    - [ ] Placeholder texts
  - [ ] Language preference saved in localStorage
  - [ ] Language persists across page refreshes

#### 5. Design and Styling

- [ ] **Color Scheme** (Based on Wireframe):
  - [ ] Background: Soft orange and white gradient (darker orange to lighter orange/white)
  - [ ] Input fields: Light blue-grey background with rounded corners
  - [ ] Login button: Orange gradient (darker orange left to lighter orange right)
  - [ ] Button text: White
  - [ ] Labels and text: Black
  - [ ] Error messages: Red (appropriate for error state)

- [ ] **Responsive Design**:
  - [ ] Layout adapts to different screen sizes
  - [ ] Mobile-friendly design
  - [ ] Touch-friendly button sizes on mobile
  - [ ] Proper spacing and padding on all devices

#### 6. Security Requirements

- [ ] **Password Security**:
  - [ ] Passwords are hashed using BCrypt on backend
  - [ ] Plain password never stored in database
  - [ ] Password comparison uses secure BCrypt verification
  - [ ] Password visibility toggle does not compromise security

- [ ] **JWT Token Management**:
  - [ ] Token expiration: 24 hours (configurable)
  - [ ] Refresh token mechanism for extended sessions
  - [ ] Token stored securely (HttpOnly cookie or localStorage)
  - [ ] Token validated on each authenticated request
  - [ ] Role-based access control enforced

- [ ] **Account Security**:
  - [ ] Account must be active (isActive = true)
  - [ ] User must have SALES role to access Sales Portal
  - [ ] Failed login attempts logged (optional, for future rate limiting)
  - [ ] Session timeout handling

## Technical Requirements

### Frontend Requirements

```typescript
// Sales Login Page Component Structure
interface SalesLoginPageProps {
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
    role: string; // Must be "SALES"
  };
}

// Password visibility state
interface PasswordVisibilityState {
  showPassword: boolean;
}
```

### Backend Requirements

```java
// Sales Authentication Controller
@RestController
@RequestMapping("/api/sales/auth")
public class SalesAuthController {
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

// Authentication Service with Role Check
@Service
public class SalesAuthService {
    public LoginResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        
        // Check if user has SALES role
        if (!user.getRole().equals("SALES")) {
            throw new AccessDeniedException("Access denied. This account does not have sales permissions");
        }
        
        // Check if account is active
        if (!user.getIsActive()) {
            throw new AccountInactiveException("Your account is inactive. Please contact support");
        }
        
        // Verify password
        if (!passwordService.verifyPassword(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        
        // Generate JWT token with role
        String token = jwtTokenProvider.generateToken(user);
        
        // Build response
        UserDTO userDTO = convertToDTO(user);
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(userDTO);
        
        return response;
    }
}
```

### Database Schema

```sql
-- Users table (existing, with role check)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    full_name VARCHAR(255),
    company_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(32) DEFAULT 'CLIENT', -- Can be 'CLIENT', 'SALES', 'ADMIN', etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index for email lookup
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

## Implementation Guidelines

### Frontend Implementation

```typescript
// Sales Login Page Component based on wireframe
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SalesLoginPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = t('sales.login.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('sales.login.errors.emailInvalid');
    }
    
    if (!formData.password) {
      newErrors.password = t('sales.login.errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('sales.login.errors.passwordMinLength');
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
      const response = await fetch('/api/sales/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.message || t('sales.login.errors.loginFailed') });
        return;
      }

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('role', 'SALES');

      // Redirect to sales dashboard
      router.push('/sales/dashboard');
    } catch (error) {
      setErrors({ submit: t('sales.login.errors.networkError') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-orange-500 via-orange-400 to-orange-100">
      {/* Left Section - Branding */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-orange-600 uppercase tracking-tight">
            SKILL BRIDGE_
          </h1>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-white/90">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            {t('sales.login.title')}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <Label htmlFor="email" className="text-gray-900 mb-2 block">
                {t('sales.login.emailLabel')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="khang@landbridge.co.jp"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`bg-blue-50 border-gray-300 rounded-lg h-12 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <Label htmlFor="password" className="text-gray-900 mb-2 block">
                {t('sales.login.passwordLabel')}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`bg-blue-50 border-gray-300 rounded-lg h-12 pr-12 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? t('sales.login.hidePassword') : t('sales.login.showPassword')}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-4 text-red-500 text-sm">{errors.submit}</div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-500 text-white font-medium rounded-lg text-lg"
              disabled={loading}
            >
              {loading ? t('sales.login.loggingIn') : t('sales.login.button')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### Translation Keys

```typescript
// Translation keys for Sales Login
{
  "sales": {
    "login": {
      "title": "ログイン", // "Login"
      "emailLabel": "メールアドレス", // "Email address"
      "passwordLabel": "パスワード", // "Password"
      "button": "ログイン", // "Login"
      "loggingIn": "ログイン中...", // "Logging in..."
      "showPassword": "パスワードを表示", // "Show password"
      "hidePassword": "パスワードを非表示", // "Hide password"
      "errors": {
        "emailRequired": "メールアドレスは必須です", // "Email is required"
        "emailInvalid": "メールアドレスの形式が正しくありません", // "Email format is invalid"
        "passwordRequired": "パスワードは必須です", // "Password is required"
        "passwordMinLength": "パスワードは8文字以上である必要があります", // "Password must be at least 8 characters"
        "loginFailed": "ログインに失敗しました", // "Login failed"
        "networkError": "ネットワークエラー。もう一度お試しください。", // "Network error. Please try again."
        "invalidCredentials": "メールアドレスまたはパスワードが正しくありません", // "Invalid email or password"
        "accessDenied": "アクセスが拒否されました。このアカウントには営業権限がありません", // "Access denied. This account does not have sales permissions"
        "accountInactive": "アカウントが無効です。サポートにお問い合わせください" // "Your account is inactive. Please contact support"
      }
    }
  }
}
```

## Testing Requirements

### Unit Tests
- [ ] Login form validation tests
- [ ] Email format validation tests
- [ ] Password validation tests
- [ ] Password visibility toggle tests
- [ ] Error message display tests
- [ ] Language switching tests

### Integration Tests
- [ ] Successful login flow for SALES role
- [ ] Invalid credentials handling
- [ ] Wrong role (non-SALES) access denial
- [ ] Inactive account handling
- [ ] JWT token generation and validation
- [ ] Role-based access control

### End-to-End Tests
- [ ] Complete login flow from UI to backend
- [ ] Login page matches wireframe layout
- [ ] Password visibility toggle works correctly
- [ ] Successful login redirects to sales dashboard
- [ ] Error messages display correctly in both languages
- [ ] Language switching works on login page

## Performance Requirements

### Performance Metrics
- **Login Response Time**: < 500ms
- **Page Load Time**: < 2 seconds
- **Form Validation**: Real-time (no delay)
- **Password Toggle**: Instant response (< 50ms)

## Security Considerations

### Security Requirements
- [ ] Passwords hashed with BCrypt
- [ ] JWT tokens have expiration
- [ ] HTTPS required for all authentication requests
- [ ] Role-based access control enforced
- [ ] Only SALES role users can access Sales Portal
- [ ] Rate limiting for login attempts (future enhancement)
- [ ] Account lockout after multiple failed attempts (future enhancement)

## Definition of Done

### Development Complete
- [ ] Sales login page implemented matching wireframe with orange gradient theme
- [ ] Password visibility toggle implemented
- [ ] Authentication service implemented with role check
- [ ] JWT token generation working with role information
- [ ] Form validation implemented
- [ ] Error handling implemented
- [ ] Multi-language support implemented
- [ ] Responsive design implemented

### Testing Complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Security tests completed
- [ ] Cross-browser testing completed

### Documentation Complete
- [ ] API documentation updated
- [ ] Technical documentation updated
- [ ] Translation keys documented
- [ ] Deployment guide updated

## Dependencies

### External Dependencies
- **Next.js 14+**: Frontend framework
- **React 18+**: UI library
- **Spring Security**: Authentication framework
- **JWT Library**: Token generation
- **Lucide React**: Icons (Eye, EyeOff)

### Internal Dependencies
- **User Entity**: Existing user table with role field
- **PasswordService**: Password hashing service
- **LanguageContext**: Multi-language support context
- **AuthContext**: Authentication context (may need Sales-specific version)

## Risks and Mitigation

### Technical Risks
- **Security Vulnerabilities**: Authentication is critical for security
  - *Mitigation*: Use proven libraries (Spring Security, JWT), code review, security testing
- **Role-Based Access Control**: Ensuring only SALES users can access
  - *Mitigation*: Implement role check at multiple levels (backend, frontend routing, API endpoints)
- **Token Management**: Token expiration and refresh complexity
  - *Mitigation*: Use standard JWT library, implement refresh token mechanism

### Business Risks
- **User Experience**: Poor login experience may deter sales users
  - *Mitigation*: Follow wireframe design exactly, clear error messages, responsive design, smooth password toggle
- **Language Support**: Incorrect translations may confuse users
  - *Mitigation*: Review translations with native speakers, test both languages thoroughly

---

**Story Status**: Draft  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 8 Story Points  
**Target Sprint**: Sprint 6

