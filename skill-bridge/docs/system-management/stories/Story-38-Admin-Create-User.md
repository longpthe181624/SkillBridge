# User Story: Admin Create User

## Story Information
- **Story ID**: Story-38
- **Title**: Admin Create User
- **Epic**: Admin Portal - User Management
- **Priority**: High
- **Story Points**: 8
- **Sprint**: Sprint 10
- **Status**: Draft

## User Story

**As an** Admin  
**I want to** create new user accounts with user name, role, email, and phone number  
**So that** I can register Sale Managers and Sale Reps into the system for managing sales operations

## Background & Context

### Create User Purpose
Creating user accounts is essential for the SkillBridge platform to:
- Register Sale Managers and Sale Reps into the system
- Assign appropriate roles to users
- Enable user authentication and access control
- Support sales team management and operations

### Current Database Schema
The `users` table has the following structure:
- `id`: Primary key (INT)
- `email`: Email address (VARCHAR 255, unique, nullable = false)
- `password`: Password hash (VARCHAR 255, nullable)
- `first_password`: First password (VARCHAR 255, nullable)
- `company_name`: Company name (VARCHAR 255, nullable)
- `full_name`: User full name (VARCHAR 255, nullable)
- `phone`: Phone number (VARCHAR 50, nullable)
- `role`: User role (VARCHAR 32) - e.g., CLIENT, ADMIN, SALES_MANAGER, SALES_REP
- `is_active`: Active status (BOOLEAN, default = true)
- `created_at`: Creation timestamp (TIMESTAMP)
- `updated_at`: Last update timestamp (TIMESTAMP)

### User Roles
For this story, we focus on creating users with roles:
- **SALES_MANAGER**: Sale Manager role (displayed as "Sale Manager" in UI)
- **SALES_REP**: Sale Rep role (displayed as "Sale Rep" in UI)

### Password Generation
When creating a new user, the system should:
- Generate a secure random password
- Store password hash in `password` field
- Store plain password in `first_password` field (for initial communication)
- Send password to user via email (optional, can be in future story)

## Acceptance Criteria

### Primary Acceptance Criteria

#### Modal Layout (Based on Wireframe)

- [ ] **Modal Structure**:
  - [ ] Modal title: "Create User"
  - [ ] Modal has standard dialog structure (header, body, footer)
  - [ ] Modal is centered on screen
  - [ ] Modal overlays the main content with semi-transparent background
  - [ ] Modal can be closed by clicking outside, close button, or Cancel button

- [ ] **Modal Header**:
  - [ ] Title "Create User" displayed prominently
  - [ ] Close button (X) in top right corner

- [ ] **Modal Body**:
  - [ ] Form fields organized vertically
  - [ ] Proper spacing between fields
  - [ ] Labels above or beside input fields

- [ ] **Modal Footer**:
  - [ ] "Cancel" button on the left
  - [ ] "Save" button on the right
  - [ ] Buttons are properly styled and aligned

#### Form Fields

- [ ] **User name Field**:
  - [ ] Label: "User name"
  - [ ] Input type: Text
  - [ ] Placeholder: "Yamada Taro" (example from wireframe)
  - [ ] Required validation
  - [ ] Max length: 255 characters
  - [ ] Maps to `full_name` field in database

- [ ] **Role Field**:
  - [ ] Label: "Role"
  - [ ] Input type: Dropdown/Select
  - [ ] Options: "Sale Manager", "Sale Rep"
  - [ ] Required validation
  - [ ] Default value: None (user must select)
  - [ ] Maps to `role` field in database:
    - [ ] "Sale Manager" → "SALES_MANAGER"
    - [ ] "Sale Rep" → "SALES_REP"

- [ ] **Email Field**:
  - [ ] Label: "Email"
  - [ ] Input type: Email
  - [ ] Placeholder: "yamada.taro@landbridge.co.jp" (example from wireframe)
  - [ ] Required validation
  - [ ] Email format validation
  - [ ] Unique email validation (check if email already exists)
  - [ ] Max length: 255 characters
  - [ ] Maps to `email` field in database

- [ ] **Phone Number Field**:
  - [ ] Label: "Phone Number"
  - [ ] Input type: Tel
  - [ ] Placeholder: "070-3359-2653" (example from wireframe)
  - [ ] Optional field
  - [ ] Phone format validation (optional)
  - [ ] Max length: 50 characters
  - [ ] Maps to `phone` field in database

#### Form Actions

- [ ] **Cancel Button**:
  - [ ] Button labeled "Cancel"
  - [ ] Grey outline, white background styling
  - [ ] Located at bottom of modal on the left
  - [ ] Clicking cancel closes modal without saving
  - [ ] No confirmation needed if form is empty
  - [ ] Shows confirmation dialog if form has unsaved changes (optional)

- [ ] **Save Button**:
  - [ ] Button labeled "Save"
  - [ ] Blue/primary background, white text styling
  - [ ] Located at bottom of modal on the right
  - [ ] Disabled state when form is invalid
  - [ ] Loading state during save operation ("Saving..." text)
  - [ ] On successful save: Shows success message, closes modal, refreshes user list
  - [ ] On error: Shows error message and keeps modal open

#### Form Validation

- [ ] **Required Field Validation**:
  - [ ] User name is required
  - [ ] Role is required
  - [ ] Email is required
  - [ ] All required fields show error messages when empty on submit

- [ ] **Format Validation**:
  - [ ] Email format validation
  - [ ] Phone format validation (if provided)
  - [ ] All format errors show clear error messages

- [ ] **Business Rule Validation**:
  - [ ] Email must be unique (check if email already exists in database)
  - [ ] If email already exists, show error: "Email already exists. Please use a different email."
  - [ ] Validation happens on blur (when user leaves field) and on submit

- [ ] **Real-time Validation**:
  - [ ] Show validation errors on blur (when user leaves field)
  - [ ] Show validation errors on submit if any field is invalid
  - [ ] Clear validation errors when user corrects the field
  - [ ] Email uniqueness check happens on blur (debounced)

#### Form Behavior

- [ ] **Form State Management**:
  - [ ] Form maintains state during modal open
  - [ ] Form resets when modal closes
  - [ ] Form resets after successful save

- [ ] **Submit Behavior**:
  - [ ] Validate all fields before submission
  - [ ] Show loading indicator during save
  - [ ] Disable form fields during save
  - [ ] Handle network errors gracefully
  - [ ] Show success message on successful save
  - [ ] Close modal after successful save
  - [ ] Refresh user list table after successful save
  - [ ] Keep modal open on error for user to correct

- [ ] **Cancel Behavior**:
  - [ ] Show confirmation dialog if form has changes (optional)
  - [ ] Confirmation message: "You have unsaved changes. Are you sure you want to cancel?"
  - [ ] Close modal on confirm
  - [ ] Do not show confirmation if form has no changes

### Detailed Acceptance Criteria

#### Field Mapping

- [ ] **Field Mapping**:
  - [ ] User name → `full_name`
  - [ ] Role → `role` (with mapping: "Sale Manager" → "SALES_MANAGER", "Sale Rep" → "SALES_REP")
  - [ ] Email → `email`
  - [ ] Phone Number → `phone`
  - [ ] `is_active` → `true` (default)
  - [ ] `created_at` → Current timestamp (auto-generated)
  - [ ] `updated_at` → Current timestamp (auto-generated)

#### Password Generation

- [ ] **Password Generation**:
  - [ ] System generates secure random password (8-12 characters, alphanumeric + special chars)
  - [ ] Password is hashed using BCrypt or similar
  - [ ] Hashed password stored in `password` field
  - [ ] Plain password stored in `first_password` field (for initial communication)
  - [ ] Password is not displayed in UI (user receives it via email)

#### Email Notification

- [ ] **Email Notification on User Creation**:
  - [ ] System sends welcome email to user's email address after successful user creation
  - [ ] Email contains:
    - [ ] Welcome message
    - [ ] User account information (name, role, email)
    - [ ] Initial password (plain password from `first_password` field)
    - [ ] Login instructions
    - [ ] Link to login page (if applicable)
  - [ ] Email is sent asynchronously (non-blocking)
  - [ ] Email sending failure does not prevent user creation
  - [ ] Email sending errors are logged for monitoring
  - [ ] Email template is professional and clear

- [ ] **Email Content**:
  - [ ] Subject: "Welcome to SkillBridge - Your Account Has Been Created"
  - [ ] Greeting with user's full name
  - [ ] Account details: Role, Email
  - [ ] Initial password (clearly marked as temporary/initial password)
  - [ ] Security reminder to change password on first login
  - [ ] Login URL or instructions
  - [ ] Support contact information

#### Error Handling

- [ ] **Form Validation Errors**:
  - [ ] Display inline error messages below each field
  - [ ] Error messages are clear and helpful
  - [ ] Required fields: "This field is required"
  - [ ] Email format: "Please enter a valid email address"
  - [ ] Email unique: "Email already exists. Please use a different email."
  - [ ] Phone format: "Please enter a valid phone number"

- [ ] **API Errors**:
  - [ ] Network error: "Network error. Please try again."
  - [ ] Server error: "An error occurred. Please try again later."
  - [ ] Validation error: Display backend validation error messages
  - [ ] Email already exists: "Email already exists. Please use a different email."

- [ ] **Email Sending Errors**:
  - [ ] Email sending failures are logged but do not block user creation
  - [ ] Admin is notified if email sending fails (optional, can be logged only)
  - [ ] User creation is considered successful even if email sending fails
  - [ ] Retry mechanism for failed email sends (optional, can be in future enhancement)

#### Success Feedback

- [ ] **Success Message**:
  - [ ] Success toast/notification: "User created successfully. Welcome email has been sent."
  - [ ] Modal closes after successful save
  - [ ] User list table refreshes to show new user
  - [ ] Note: Email notification is sent in background (user creation is not blocked by email sending)

- [ ] **Loading States**:
  - [ ] Show loading spinner during form submission
  - [ ] Disable form fields during save
  - [ ] Show "Saving..." text on Save button
  - [ ] Disable Cancel button during save

## Technical Requirements

### Frontend Requirements

#### Component Structure

- [ ] **Create User Modal Component**: `frontend/src/components/admin/user/CreateUserModal.tsx`
  - [ ] Modal wrapper with overlay
  - [ ] Form with all fields
  - [ ] Form validation logic
  - [ ] Submit handler
  - [ ] Error handling

#### State Management

- [ ] **React Hooks**:
  - [ ] `useState` for form data, errors, loading states
  - [ ] `useEffect` for form initialization, validation
  - [ ] `useCallback` for memoized functions (handleSubmit, handleEmailCheck, etc.)

#### Form Data Structure

```typescript
interface CreateUserFormData {
  fullName: string;
  role: 'SALES_MANAGER' | 'SALES_REP';
  email: string;
  phone?: string;
}

interface CreateUserRequest {
  fullName: string;
  role: string; // 'SALES_MANAGER' or 'SALES_REP'
  email: string;
  phone?: string;
}
```

#### API Integration

- [ ] **Service File**: Extend `frontend/src/services/adminUserService.ts`
  - [ ] `createUser(request: CreateUserRequest): Promise<User>`
  - [ ] `checkEmailExists(email: string): Promise<boolean>` (optional, for real-time validation)

#### Modal Component

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUser } from '@/services/adminUserService';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ open, onClose, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserFormData>({
    fullName: '',
    role: undefined,
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation and submission logic
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
        </form>
      </div>
    </div>
  );
}
```

### Backend Requirements

#### REST API Endpoints

- [ ] **POST `/api/admin/users`** - Create new user
  - [ ] Request body: `CreateUserRequest`
  - [ ] Response: `UserResponse` with created user
  - [ ] Validation: Validate all required fields and formats
  - [ ] Business logic: 
    - [ ] Check email uniqueness
    - [ ] Generate secure random password
    - [ ] Hash password
    - [ ] Store password hash and plain password
    - [ ] Set is_active = true
  - [ ] Authentication: Requires ADMIN role
  - [ ] Authorization: Only ADMIN users can access

#### DTOs

- [ ] **Request DTO**: `CreateUserRequest.java`
  - [ ] `fullName`: String (required, max 255)
  - [ ] `role`: String (required, must be SALES_MANAGER or SALES_REP)
  - [ ] `email`: String (required, valid email format, max 255)
  - [ ] `phone`: String (optional, max 50)
  - [ ] Validation annotations

- [ ] **Response DTO**: `UserResponseDTO.java`
  - [ ] `id`: Integer
  - [ ] `fullName`: String
  - [ ] `role`: String
  - [ ] `email`: String
  - [ ] `phone`: String
  - [ ] `isActive`: Boolean
  - [ ] `createdAt`: LocalDateTime

#### Service

- [ ] **AdminUserService**: 
  - [ ] `createUser(CreateUserRequest request): UserResponseDTO`
    - [ ] Validate email uniqueness
    - [ ] Generate secure random password
    - [ ] Hash password using BCrypt
    - [ ] Create User entity
    - [ ] Save to database
    - [ ] Send welcome email asynchronously (non-blocking)
    - [ ] Return UserResponseDTO

- [ ] **Email Service**:
  - [ ] `EmailService` or `NotificationService` for sending emails
  - [ ] `sendWelcomeEmail(User user, String plainPassword): void`
    - [ ] Send email to user's email address
    - [ ] Include user account information and initial password
    - [ ] Handle email sending errors gracefully
    - [ ] Log email sending status

#### Controller

- [ ] **AdminUserController**: 
  - [ ] `POST /admin/users` endpoint
  - [ ] Handle validation errors
  - [ ] Handle email uniqueness errors
  - [ ] Return appropriate HTTP status codes

#### Password Generation

- [ ] **Password Generator Utility**:
  - [ ] Generate secure random password (8-12 characters)
  - [ ] Include uppercase, lowercase, numbers, and special characters
  - [ ] Use SecureRandom for generation
  - [ ] Store in `first_password` field (plain text, for initial communication)

#### Email Service

- [ ] **Email Service Implementation**:
  - [ ] Use Spring Mail or email service library (e.g., JavaMailSender, SendGrid, AWS SES)
  - [ ] Configure SMTP settings or email service API
  - [ ] Create email template for welcome email
  - [ ] Send email asynchronously using `@Async` or message queue
  - [ ] Handle email sending exceptions gracefully
  - [ ] Log email sending status for monitoring

### Database Requirements

#### Schema

- [ ] **users Table**:
  - [ ] Already exists, no schema changes needed
  - [ ] Ensure unique constraint on `email`
  - [ ] Ensure indexes for performance

## Implementation Guidelines

### Frontend Implementation

#### Form Validation

```typescript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (!formData.fullName.trim()) {
    newErrors.fullName = 'This field is required';
  }

  if (!formData.role) {
    newErrors.role = 'This field is required';
  }

  if (!formData.email.trim()) {
    newErrors.email = 'This field is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

#### Email Uniqueness Check

```typescript
const checkEmailUniqueness = async (email: string) => {
  try {
    const exists = await checkEmailExists(email);
    if (exists) {
      setErrors(prev => ({ ...prev, email: 'Email already exists. Please use a different email.' }));
      return false;
    }
  } catch (error) {
    console.error('Error checking email:', error);
  }
  return true;
};
```

### Backend Implementation

#### Create User Service

```java
@Service
public class AdminUserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public UserResponseDTO createUser(CreateUserRequest request) {
        // Validate email uniqueness
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Generate password
        String plainPassword = generateSecurePassword();
        String hashedPassword = passwordEncoder.encode(plainPassword);
        
        // Create user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(hashedPassword);
        user.setFirstPassword(plainPassword);
        user.setIsActive(true);
        
        user = userRepository.save(user);
        
        // Send welcome email asynchronously (non-blocking)
        try {
            emailService.sendWelcomeEmail(user, plainPassword);
        } catch (Exception e) {
            // Log error but don't fail user creation
            logger.error("Failed to send welcome email to user: " + user.getEmail(), e);
        }
        
        // Convert to DTO and return
        return convertToDTO(user);
    }
    
    private String generateSecurePassword() {
        // Generate secure random password
        // Return plain password
    }
}
```

## Testing Requirements

### Unit Tests

- [ ] **Frontend Unit Tests**:
  - [ ] Test form validation
  - [ ] Test email format validation
  - [ ] Test email uniqueness check
  - [ ] Test form submission
  - [ ] Test error handling

- [ ] **Backend Unit Tests**:
  - [ ] Test service methods
  - [ ] Test email uniqueness validation
  - [ ] Test password generation
  - [ ] Test password hashing

### Integration Tests

- [ ] **API Integration Tests**:
  - [ ] Test POST /api/admin/users with valid data
  - [ ] Test POST /api/admin/users with duplicate email
  - [ ] Test POST /api/admin/users with invalid data
  - [ ] Test password generation and hashing

### End-to-End Tests

- [ ] **E2E Test Scenarios**:
  - [ ] User can fill all form fields
  - [ ] User can select role from dropdown
  - [ ] User can submit form successfully
  - [ ] User sees validation errors for invalid fields
  - [ ] User sees error if email already exists
  - [ ] User list refreshes after successful creation

## Performance Requirements

- [ ] **Modal Load Time**: Modal should open instantly
- [ ] **Form Submission Time**: Form submission should complete within 2 seconds
- [ ] **Email Check Time**: Email uniqueness check should complete within 500ms

## Security Considerations

- [ ] **Authentication**: All endpoints require valid JWT token
- [ ] **Authorization**: Only ADMIN role can access endpoints
- [ ] **Input Validation**: All inputs are validated on both frontend and backend
- [ ] **Email Uniqueness**: Prevent duplicate emails in database
- [ ] **Password Security**: Use secure password generation and hashing
- [ ] **SQL Injection Prevention**: Use parameterized queries and JPA methods
- [ ] **XSS Prevention**: Sanitize user inputs before displaying

## Deployment Requirements

- [ ] **Environment Variables**: No additional environment variables needed
- [ ] **Database Migration**: No migration needed (using existing users table)
- [ ] **Error Logging**: Implement proper error logging and monitoring

## Definition of Done

- [ ] All acceptance criteria are met
- [ ] Code is reviewed and approved
- [ ] Unit tests are written and passing
- [ ] Integration tests are written and passing
- [ ] E2E tests are written and passing
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile devices
- [ ] Form validation is working correctly
- [ ] Email uniqueness check is working
- [ ] Password generation is working correctly

## Dependencies

### Internal Dependencies

- [ ] Story-37: Admin User List Management (for modal trigger and list refresh)
- [ ] Admin authentication system (already implemented)
- [ ] Users table (already exists)

### External Dependencies

- [ ] React/Next.js for frontend
- [ ] Spring Boot for backend
- [ ] MySQL database
- [ ] Password hashing library (BCrypt)
- [ ] Email service library (JavaMailSender, SendGrid, AWS SES, or similar)

## Risks and Mitigation

### Risks

1. **Email Uniqueness Race Condition**:
   - Risk: Two users created simultaneously with same email
   - Mitigation: Use database unique constraint, handle unique constraint violation gracefully

2. **Password Security**:
   - Risk: Weak password generation or insecure storage
   - Mitigation: Use secure random generation, proper hashing algorithm (BCrypt)

### Mitigation Strategies

- [ ] Implement comprehensive form validation
- [ ] Use database unique constraint for email
- [ ] Use secure password generation and hashing
- [ ] Implement proper error handling and user feedback

## Success Metrics

### Business Metrics

- [ ] Admin can create user accounts with all required information
- [ ] Zero data loss during user creation
- [ ] Form submission success rate > 95%

### Technical Metrics

- [ ] Modal load time < 100ms
- [ ] Form submission time < 2 seconds
- [ ] Email uniqueness check time < 500ms
- [ ] Zero critical bugs in production

## Future Enhancements

### Planned Improvements

- [ ] Email template customization
- [ ] Email sending retry mechanism for failed sends
- [ ] Email delivery tracking
- [ ] Password strength indicator
- [ ] Bulk user import (CSV, Excel)
- [ ] User activation/deactivation workflow
- [ ] User profile picture upload

### Notes

- This story focuses on creating user accounts with basic information
- Password is auto-generated and stored securely
- Welcome email is sent automatically after user creation
- Email sending is asynchronous and non-blocking
- Edit user functionality will be covered in Story-39

---

## Dev Agent Record

### Implementation Status: ✅ Completed

### Implementation Date: December 2024

### Implemented Features:

#### Backend:
- ✅ Created `CreateUserRequest.java` DTO with validation annotations
- ✅ Added `sendWelcomeEmail()` method to `EmailService.java`
- ✅ Implemented `createUser()` method in `AdminUserService.java`:
  - Email uniqueness validation
  - Secure password generation using `PasswordService`
  - Password hashing using BCrypt
  - User entity creation and persistence
  - Asynchronous welcome email sending (non-blocking)
- ✅ Added `POST /api/admin/users` endpoint in `AdminUserController.java`
- ✅ Error handling for email uniqueness and validation errors

#### Frontend:
- ✅ Updated `CreateUserModal.tsx` with full functionality:
  - Form fields: User name, Role, Email, Phone Number
  - Real-time validation (on blur and submit)
  - Email format validation
  - Email uniqueness check (via API error handling)
  - Form state management and dirty state tracking
  - Loading states during submission
  - Error handling and user feedback
  - Success toast notification
  - Confirmation dialog for unsaved changes
- ✅ Added `createUser()` method to `adminUserService.ts`
- ✅ Integrated with existing user list refresh mechanism

#### Email Service:
- ✅ Welcome email template with:
  - User account information (name, role, email)
  - Initial password
  - Login URL
  - Security reminder
  - Support information
- ✅ Asynchronous email sending (non-blocking)
- ✅ Error logging without blocking user creation

### Technical Notes:
- Password generation: Uses `PasswordService.generateRandomPassword()` (12 characters, alphanumeric + special chars)
- Password hashing: Uses BCrypt via `PasswordService.hashPassword()`
- Email sending: Uses existing `EmailService` with `JavaMailSender`
- Email uniqueness: Validated via `UserRepository.existsByEmail()`
- Form validation: Both frontend and backend validation implemented
- Error handling: Graceful error handling with user-friendly messages

### Testing Status:
- ⏳ Unit tests: Pending
- ⏳ Integration tests: Pending
- ⏳ E2E tests: Pending

### Known Issues:
- None

### Next Steps:
- Implement unit tests
- Implement integration tests
- Implement E2E tests
- Code review

---

**Document Control**
- **Version**: 1.0
- **Last Updated**: December 2024
- **Next Review**: January 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

