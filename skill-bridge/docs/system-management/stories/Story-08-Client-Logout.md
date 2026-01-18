# User Story: Client Logout

## Story Information
- **Story ID**: Story-08
- **Title**: Client Logout
- **Epic**: Client Portal Access
- **Priority**: Medium
- **Story Points**: 3
- **Sprint**: Sprint 2
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** logout from the Client Portal  
**So that** I can securely end my session and protect my account

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can logout from the Client Portal using a logout button
- [ ] Logout clears my session and token
- [ ] Logout redirects me to the login page
- [ ] I cannot access protected routes after logout

### Detailed Acceptance Criteria

#### 1. Logout Functionality
- [ ] **Logout Button**:
  - [ ] Logout button available in client portal header/navigation
  - [ ] Button is clearly visible and accessible
  - [ ] Button text: "Logout" or icon representation
  - [ ] Button is responsive on mobile devices

- [ ] **Logout Process**:
  - [ ] Clicking logout button triggers logout action
  - [ ] Confirmation dialog optional (future enhancement)
  - [ ] JWT token removed from storage (localStorage or cookie)
  - [ ] User data cleared from client state
  - [ ] Session invalidated on backend (optional, as JWT is stateless)

- [ ] **Redirect After Logout**:
  - [ ] User redirected to login page after logout
  - [ ] Any protected routes are inaccessible after logout
  - [ ] Browser back button doesn't restore session

- [ ] **Session Cleanup**:
  - [ ] Token removed from localStorage/cookie
  - [ ] User context cleared
  - [ ] Authentication state reset
  - [ ] Any cached data cleared (optional)

#### 2. Security Requirements
- [ ] **Token Invalidation**:
  - [ ] Token removed from client storage
  - [ ] Token blacklisting on backend (optional, for enhanced security)
  - [ ] No token leakage in browser history or cache

- [ ] **Access Control**:
  - [ ] Protected routes require authentication after logout
  - [ ] API requests without valid token return 401 Unauthorized
  - [ ] Redirect to login if accessing protected route while logged out

#### 3. User Experience
- [ ] **Logout Feedback**:
  - [ ] Logout action completes quickly (< 500ms)
  - [ ] Loading state during logout (if needed)
  - [ ] Success message or redirect without delay

- [ ] **Error Handling**:
  - [ ] Network errors during logout handled gracefully
  - [ ] Token removal works even if backend call fails
  - [ ] User still redirected to login page

## Technical Requirements

### Frontend Requirements
```typescript
// Logout Component Structure
interface LogoutButtonProps {
  className?: string;
}

interface AuthContext {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}
```

### Backend Requirements
```java
// Authentication Controller
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(
        HttpServletRequest request
    );
}

// Optional: Token Blacklist Entity (for enhanced security)
@Entity
@Table(name = "blacklisted_tokens")
public class BlacklistedToken {
    @Id
    private String token; // JWT token ID (jti claim)
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "blacklisted_at", nullable = false)
    private LocalDateTime blacklistedAt;
}
```

### Database Schema
```sql
-- Optional: Blacklisted Tokens Table (for enhanced security)
CREATE TABLE blacklisted_tokens (
    token_id VARCHAR(255) PRIMARY KEY,
    expires_at TIMESTAMP NOT NULL,
    blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expires_at (expires_at)
);
```

## Implementation Guidelines

### Frontend Implementation
```typescript
// Auth Context
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load user and token from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint (optional, for token blacklisting)
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Continue with logout even if backend call fails
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      router.push('/client/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Logout Button Component
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton({ className }: { className?: string }) {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant="ghost"
      className={className}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
```

### Backend Implementation
```java
// Authentication Controller
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(HttpServletRequest request) {
        // Extract token from request
        String token = extractTokenFromRequest(request);
        
        if (token != null) {
            // Optional: Blacklist token for enhanced security
            // authService.blacklistToken(token);
        }
        
        LogoutResponse response = new LogoutResponse();
        response.setMessage("Logged out successfully");
        return ResponseEntity.ok(response);
    }
    
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

// Authentication Service
@Service
public class AuthService {
    
    @Autowired(required = false)
    private BlacklistedTokenRepository blacklistedTokenRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    /**
     * Optional: Blacklist token for enhanced security
     * This requires storing JWT ID (jti claim) when generating tokens
     */
    public void blacklistToken(String token) {
        try {
            // Extract JWT ID (jti) from token
            Claims claims = jwtTokenProvider.getClaimsFromToken(token);
            String jti = claims.getId();
            
            if (jti != null && blacklistedTokenRepository != null) {
                // Get token expiration
                Date expiration = claims.getExpiration();
                
                BlacklistedToken blacklistedToken = new BlacklistedToken();
                blacklistedToken.setToken(jti);
                blacklistedToken.setExpiresAt(expiration.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime());
                blacklistedToken.setBlacklistedAt(LocalDateTime.now());
                
                blacklistedTokenRepository.save(blacklistedToken);
            }
        } catch (Exception e) {
            // Log error but don't fail logout
            System.err.println("Failed to blacklist token: " + e.getMessage());
        }
    }
    
    /**
     * Check if token is blacklisted
     */
    public boolean isTokenBlacklisted(String token) {
        if (blacklistedTokenRepository == null) {
            return false; // Blacklisting not enabled
        }
        
        try {
            Claims claims = jwtTokenProvider.getClaimsFromToken(token);
            String jti = claims.getId();
            
            if (jti != null) {
                return blacklistedTokenRepository.existsById(jti);
            }
        } catch (Exception e) {
            // If token is invalid, consider it blacklisted
            return true;
        }
        
        return false;
    }
}
```

## Testing Requirements

### Unit Tests
- [ ] Logout button click handler tests
- [ ] Token removal from storage tests
- [ ] User state clearing tests
- [ ] Redirect functionality tests

### Integration Tests
- [ ] Complete logout flow
- [ ] Token blacklisting (if implemented)
- [ ] Protected route access after logout
- [ ] Session cleanup verification

### End-to-End Tests
- [ ] Complete logout flow from UI to backend
- [ ] Redirect to login page after logout
- [ ] Protected routes inaccessible after logout
- [ ] Browser back button behavior

## Performance Requirements

### Performance Metrics
- **Logout Response Time**: < 500ms
- **Token Removal**: Immediate
- **Redirect Time**: < 300ms

## Security Considerations

### Security Requirements
- [ ] Token removed from client storage
- [ ] Token blacklisting on backend (optional, for enhanced security)
- [ ] No token leakage in browser history
- [ ] Protected routes require authentication after logout
- [ ] HTTPS required for logout requests

## Definition of Done

### Development Complete
- [ ] Logout button implemented in client portal
- [ ] Logout functionality working
- [ ] Token removal implemented
- [ ] Redirect to login page working
- [ ] Protected route access control working
- [ ] Token blacklisting implemented (optional)

### Testing Complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Security tests completed

### Documentation Complete
- [ ] API documentation updated
- [ ] Technical documentation updated
- [ ] User guide updated

## Dependencies

### External Dependencies
- **Next.js 14+**: Frontend framework
- **React 18+**: UI library
- **JWT Library**: Token management

### Internal Dependencies
- **AuthContext**: Authentication context
- **User Entity**: Existing user table

## Risks and Mitigation

### Technical Risks
- **Token Security**: Token may still be valid after logout if not blacklisted
  - *Mitigation*: Implement token blacklisting, use short token expiration
- **Session Persistence**: Browser back button may restore session
  - *Mitigation*: Clear state on logout, redirect to login, check authentication on route access

### Business Risks
- **User Experience**: Logout may be confusing if not clearly accessible
  - *Mitigation*: Clear logout button in header/navigation, consistent placement

---

**Story Status**: Ready for Development  
**Assigned To**: Frontend Team  
**Estimated Effort**: 3 Story Points  
**Target Sprint**: Sprint 2

