# User Story: Client Forgot Password

## Story Information
- **Story ID**: Story-07
- **Title**: Client Forgot Password
- **Epic**: Client Portal Access
- **Priority**: High
- **Story Points**: 5
- **Sprint**: Sprint 2
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** reset my password when I forget it  
**So that** I can regain access to my account

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can request a password reset using my email address
- [ ] Forgot password modal matches the wireframe design
- [ ] I receive a password reset email (when SES is configured)
- [ ] I can reset my password using the reset token

### Detailed Acceptance Criteria

#### 1. Forgot Password Modal (Based on Wireframe)
- [ ] **Modal Window**:
  - [ ] White modal window centered on screen
  - [ ] Modal overlays the login page (partially visible background)
  - [ ] Modal has subtle shadow for depth

- [ ] **Close Button**:
  - [ ] Large black 'X' icon in top right corner
  - [ ] Clicking closes the modal and returns to login page

- [ ] **Title**:
  - [ ] "Forgot password" heading centered at top in dark gray font

- [ ] **Email Input Field**:
  - [ ] Label "Email" displayed in smaller dark gray font
  - [ ] Input field with thin black border
  - [ ] Placeholder text "abc@gmail.com" (pre-filled or placeholder)
  - [ ] Input accepts valid email format

- [ ] **Send Button**:
  - [ ] Rectangular button with thin black border
  - [ ] "Send" text in dark gray font, centered within button
  - [ ] Button submits the email for password reset

- [ ] **Back to Login Link**:
  - [ ] "Back to login" text link below Send button
  - [ ] Smaller dark gray underlined font
  - [ ] Clicking closes modal and returns to login page

#### 2. Password Reset Functionality
- [ ] **Email Validation**:
  - [ ] Email field is required
  - [ ] Email must be in valid format
  - [ ] Error messages displayed for invalid email
  - [ ] Form cannot be submitted with invalid email

- [ ] **Password Reset Request**:
  - [ ] Backend checks if email exists in database
  - [ ] Password reset token generated (unique, secure)
  - [ ] Token stored in database with expiration (e.g., 1 hour)
  - [ ] Reset link created with token
  - [ ] Email prepared with reset link (template-based)

- [ ] **Email Sending** (Currently Commented):
  - [ ] Email template loaded from database
  - [ ] Email subject and body prepared with reset link
  - [ ] Email sending via AWS SES (commented until SES configured)
  - [ ] Email content logged to console for development
  - [ ] Success message shown to user regardless of SES status

- [ ] **Security Requirements**:
  - [ ] Reset token is cryptographically secure (UUID or random string)
  - [ ] Token expires after 1 hour (configurable)
  - [ ] Token is single-use (invalidated after use)
  - [ ] Rate limiting prevents abuse (future enhancement)

- [ ] **Response Handling**:
  - [ ] Success message shown even if email doesn't exist (security)
  - [ ] Message: "If an account exists with this email, a password reset link has been sent"
  - [ ] User redirected or modal closed after submission
  - [ ] Appropriate error messages for network failures

#### 3. Password Reset Page (Future Enhancement)
- [ ] **Reset Page Access**:
  - [ ] Accessible via reset link in email
  - [ ] Token validated on page load
  - [ ] Invalid or expired token shows error
  - [ ] User can enter new password

- [ ] **Password Reset Form**:
  - [ ] New password input field
  - [ ] Confirm password input field
  - [ ] Password validation (min length, complexity)
  - [ ] Submit button to reset password

- [ ] **Password Update**:
  - [ ] New password hashed using BCrypt
  - [ ] Password updated in database
  - [ ] Reset token invalidated after use
  - [ ] User redirected to login page
  - [ ] Success message displayed

## Technical Requirements

### Frontend Requirements
```typescript
// Forgot Password Modal Component Structure
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}
```

### Backend Requirements
```java
// Authentication Controller
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(
        @RequestBody ForgotPasswordRequest request
    );
}

// Forgot Password Request DTO
public class ForgotPasswordRequest {
    @Email
    @NotBlank
    private String email;
}

// Password Reset Token Entity
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "token", unique = true, nullable = false)
    private String token;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "used", nullable = false)
    private Boolean used = false;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
```

### Database Schema
```sql
-- Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);

-- Email Template for Password Reset (existing table)
CREATE TABLE email_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Implementation Guidelines

### Frontend Implementation
```typescript
// Forgot Password Modal Component based on wireframe
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ 
  isOpen, 
  onClose 
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to send reset email');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-normal text-gray-800 text-center mb-6">
          Forgot password
        </h2>

        {success ? (
          <div className="text-center py-4">
            <p className="text-green-600 mb-4">
              If an account exists with this email, a password reset link has been sent.
            </p>
            <Button onClick={onClose} className="w-full">
              Back to login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              className="w-full mb-4"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-gray-600 underline hover:text-gray-800"
              >
                Back to login
              </button>
            </div>
          </form>
        )}
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
    private PasswordResetTokenRepository passwordResetTokenRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private EmailTemplateRepository emailTemplateRepository;
    
    @Value("${password.reset.token.expiration:3600}") // 1 hour in seconds
    private int tokenExpirationSeconds;
    
    public void requestPasswordReset(String email) {
        // Find user by email (for security, don't reveal if email exists)
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Check if account is active
            if (!user.getIsActive()) {
                // Still return success for security (don't reveal account status)
                return;
            }
            
            // Invalidate any existing tokens for this user
            passwordResetTokenRepository.invalidateUserTokens(user.getId());
            
            // Generate reset token
            String token = UUID.randomUUID().toString();
            
            // Calculate expiration time
            LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(tokenExpirationSeconds);
            
            // Save reset token
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUserId(user.getId());
            resetToken.setToken(token);
            resetToken.setExpiresAt(expiresAt);
            resetToken.setUsed(false);
            passwordResetTokenRepository.save(resetToken);
            
            // Prepare reset link
            String resetLink = String.format(
                "%s/client/reset-password?token=%s",
                getBaseUrl(),
                token
            );
            
            // Send password reset email (commented until SES configured)
            sendPasswordResetEmail(user, resetLink);
        }
        
        // Always return success for security (don't reveal if email exists)
    }
    
    private void sendPasswordResetEmail(User user, String resetLink) {
        try {
            EmailTemplate template = emailTemplateRepository
                .findByTemplateName("password_reset")
                .orElseThrow(() -> new RuntimeException("Password reset email template not found"));
            
            String subject = template.getSubject();
            String body = template.getBody()
                .replace("{name}", user.getFullName() != null ? user.getFullName() : "")
                .replace("{reset_link}", resetLink)
                .replace("{expiration_minutes}", String.valueOf(tokenExpirationSeconds / 60));
            
            // TODO: Uncomment when SES is configured
            // Send email via AWS SES
            /*
            if (emailService.isSesEnabled() && emailService.getAmazonSES() != null) {
                SendEmailRequest request = new SendEmailRequest()
                    .withDestination(new Destination().withToAddresses(user.getEmail()))
                    .withMessage(new Message()
                        .withBody(new Body()
                            .withHtml(new Content()
                                .withCharset("UTF-8")
                                .withData(body)))
                        .withSubject(new Content()
                            .withCharset("UTF-8")
                            .withData(subject)))
                    .withSource(emailService.getFromEmail());
                
                emailService.getAmazonSES().sendEmail(request);
                System.out.println("Password reset email sent via SES to: " + user.getEmail());
            } else {
                System.out.println("SES is not enabled or configured. Email content prepared but not sent:");
                System.out.println("To: " + user.getEmail());
                System.out.println("Subject: " + subject);
                System.out.println("Body: " + body);
                System.out.println("Reset Link: " + resetLink);
            }
            */
            
            // Log email content (for development/testing)
            System.out.println("=== Password Reset Email Content Prepared (SES not enabled) ===");
            System.out.println("To: " + user.getEmail());
            System.out.println("Subject: " + subject);
            System.out.println("Body: " + body);
            System.out.println("Reset Link: " + resetLink);
            System.out.println("==============================================================");
            
        } catch (Exception e) {
            // Log error but don't fail the request (security: don't reveal if email exists)
            System.err.println("Failed to prepare password reset email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private String getBaseUrl() {
        // Get base URL from configuration
        return System.getProperty("app.base-url", "http://localhost:3000");
    }
}
```

## Testing Requirements

### Unit Tests
- [ ] Email validation tests
- [ ] Token generation tests
- [ ] Token expiration tests
- [ ] Email template replacement tests

### Integration Tests
- [ ] Password reset request flow
- [ ] Token storage and retrieval
- [ ] Email preparation (even when SES disabled)
- [ ] Invalid email handling

### End-to-End Tests
- [ ] Complete forgot password flow from UI to backend
- [ ] Modal matches wireframe layout
- [ ] Success message display
- [ ] Modal close functionality

## Performance Requirements

### Performance Metrics
- **Request Response Time**: < 500ms
- **Modal Open/Close Animation**: < 300ms
- **Form Validation**: Real-time (no delay)

## Security Considerations

### Security Requirements
- [ ] Reset token is cryptographically secure (UUID)
- [ ] Token expires after 1 hour (configurable)
- [ ] Token is single-use
- [ ] Don't reveal if email exists (always return success)
- [ ] Rate limiting for reset requests (future enhancement)
- [ ] HTTPS required for reset links

## Definition of Done

### Development Complete
- [ ] Forgot password modal implemented matching wireframe
- [ ] Password reset service implemented
- [ ] Token generation and storage working
- [ ] Email template integration (with SES commented)
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
- [ ] Email template documentation updated
- [ ] Technical documentation updated

## Dependencies

### External Dependencies
- **Next.js 14+**: Frontend framework
- **React 18+**: UI library
- **UUID**: Token generation

### Internal Dependencies
- **User Entity**: Existing user table
- **EmailService**: Email service (SES commented)
- **EmailTemplateRepository**: Email template storage

## Risks and Mitigation

### Technical Risks
- **Email Delivery**: SES not configured, emails not sent
  - *Mitigation*: Email content logged to console, email template prepared, ready for SES
- **Token Security**: Weak tokens could be compromised
  - *Mitigation*: Use cryptographically secure UUID, token expiration, single-use tokens

### Business Risks
- **User Experience**: Users may not receive emails if SES not configured
  - *Mitigation*: Clear messaging, log email content for testing, ready for SES integration

---

**Story Status**: Ready for Development  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 5 Story Points  
**Target Sprint**: Sprint 2

