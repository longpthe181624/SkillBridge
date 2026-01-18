# User Story: Guest Contact Request

## Story Information
- **Story ID**: Story-04
- **Title**: Guest Contact Request
- **Epic**: Guest Registration
- **Priority**: High
- **Story Points**: 8
- **Sprint**: Sprint 1
- **Status**: Ready for Development

## User Story
**As a** Guest  
**I want to** register or submit my first Contact request  
**So that** I can start communicating with LandBridge  

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can fill out a Contact form with basic information (name, email, company, phone, title, message)
- [ ] After submission, my status changes from Guest → Client
- [ ] The system sends a confirmation email and notifies the Sales Manager
- [ ] Contact form is accessible without authentication
- [ ] Form submission is processed within 5 seconds

### Detailed Acceptance Criteria

#### 1. Contact Form Access
- [ ] Contact form is accessible without authentication
- [ ] Form loads within 3 seconds on standard internet connection
- [ ] Form is mobile-responsive and user-friendly
- [ ] Clear navigation to contact page from other pages

#### 2. Contact Form Fields
- [ ] **Name Field**:
  - [ ] Required text input field
  - [ ] Placeholder: "Enter your full name"
  - [ ] Validation: Minimum 2 characters, maximum 100 characters
  - [ ] Error message for invalid input

- [ ] **Company Name Field**:
  - [ ] Required text input field
  - [ ] Placeholder: "Enter your company name"
  - [ ] Validation: Minimum 2 characters, maximum 100 characters
  - [ ] Error message for invalid input

- [ ] **Phone Field**:
  - [ ] Required text input field
  - [ ] Placeholder: "Enter your phone number"
  - [ ] Validation: Valid phone number format
  - [ ] Error message for invalid input

- [ ] **Email Address Field**:
  - [ ] Required email input field
  - [ ] Placeholder: "Enter your email address"
  - [ ] Validation: Valid email format
  - [ ] Error message for invalid input

- [ ] **Title Field**:
  - [ ] Required text input field
  - [ ] Placeholder: "Enter your request title"
  - [ ] Validation: Minimum 2 characters, maximum 255 characters
  - [ ] Error message for invalid input

- [ ] **Message Field**:
  - [ ] Required textarea field
  - [ ] Placeholder: "Enter your message or request details"
  - [ ] Validation: Minimum 10 characters, maximum 1000 characters
  - [ ] Error message for invalid input

#### 3. Form Submission
- [ ] **Submit Button**:
  - [ ] Prominent "Send" button
  - [ ] Disabled state during submission
  - [ ] Loading indicator during processing
  - [ ] Success/error feedback after submission

- [ ] **Form Validation**:
  - [ ] Client-side validation before submission
  - [ ] Server-side validation for security
  - [ ] Clear error messages for each field
  - [ ] Form cannot be submitted with invalid data

#### 4. Post-Submission Actions
- [ ] **Status Change**:
  - [ ] Guest status changes to Client upon successful submission
  - [ ] User record created in database
  - [ ] Contact record created with submitted information
  - [ ] Status change logged in audit trail

- [ ] **Email Notifications**:
  - [ ] Confirmation email sent to user
  - [ ] Email contains submission details
  - [ ] Professional email template used
  - [ ] Email delivery within 2 minutes

- [ ] **Sales Manager Notification**:
  - [ ] Internal notification sent to Sales Manager
  - [ ] Notification contains contact details
  - [ ] Priority level assigned to new contact
  - [ ] Dashboard update for Sales Manager

#### 5. Page Layout and Design
- [ ] **Header Section**:
  - [ ] "SKILL BRIDGE" logo on the left
  - [ ] Navigation bar with "HOME", "List Engineer", "Service", "Contact us"
  - [ ] "Contact us" link highlighted as current page
  - [ ] "Login" button on the right

- [ ] **Main Content Section**:
  - [ ] "Contact us" heading prominently displayed
  - [ ] Contact form centered on page
  - [ ] Clean, professional form design
  - [ ] Responsive layout for all devices

- [ ] **Footer Section**:
  - [ ] "SKILL BRIDGE" logo
  - [ ] Navigation links: "FAQ", "Term", "Privacy policy"
  - [ ] Service links: "HOME", "List engineer", "Services", "Contact us"

## Technical Requirements

### Frontend Requirements
```typescript
// Contact Form Component Structure
interface ContactFormProps {
  onSubmit: (contactData: ContactFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface ContactFormData {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  title: string;
  message: string;
}

interface ContactFormState {
  formData: ContactFormData;
  errors: Partial<ContactFormData>;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

// Form Validation
interface FormValidation {
  name: (value: string) => string | null;
  companyName: (value: string) => string | null;
  phone: (value: string) => string | null;
  email: (value: string) => string | null;
  title: (value: string) => string | null;
  message: (value: string) => string | null;
}
```

### Backend Requirements
```java
// Contact Controller
@RestController
@RequestMapping("/api/public/contact")
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private NotificationService notificationService;
    
    @PostMapping("/submit")
    public ResponseEntity<ContactSubmissionResponse> submitContact(
        @Valid @RequestBody ContactFormData contactData
    ) {
        ContactSubmissionResponse response = contactService.processContactSubmission(contactData);
        return ResponseEntity.ok(response);
    }
}

// Contact Service
@Service
public class ContactService {
    public ContactSubmissionResponse processContactSubmission(ContactFormData contactData);
    public User createUserFromContact(ContactFormData contactData);
    public Contact createContactRecord(ContactFormData contactData, User user);
    public void sendConfirmationEmail(User user, Contact contact);
    public void notifySalesManager(Contact contact);
}
```

### AWS SES Configuration
```yaml
# application.yml or application-prod.yml
aws:
  ses:
    region: us-east-1
    access-key: ${AWS_ACCESS_KEY_ID}
    secret-key: ${AWS_SECRET_ACCESS_KEY}
    from-email: noreply@skillbridge.com
    from-name: SkillBridge Team
    # Configuration for SES
    # Note: Update these values in production environment
    configuration-set: default
    # Enable SES in production (set to true when SES is configured)
    enabled: false
```

```xml
<!-- pom.xml - Add AWS SDK for SES -->
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-java-sdk-ses</artifactId>
    <version>1.12.529</version>
</dependency>
```

### Database Schema
```sql
-- Users Table (existing)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(32) DEFAULT 'CLIENT',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contacts Table (existing)
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_user_id INT,
    assignee_user_id INT,
    reviewer_id INT,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(32) DEFAULT 'New',
    request_type VARCHAR(32),
    priority VARCHAR(32) DEFAULT 'Medium',
    internal_note TEXT,
    online_mtg_link VARCHAR(255),
    online_mtg_date TIMESTAMP NULL,
    communication_progress VARCHAR(32) DEFAULT 'AutoReply',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_user_id) REFERENCES users(id),
    FOREIGN KEY (assignee_user_id) REFERENCES users(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Contact Communication Logs Table (existing)
CREATE TABLE contact_communication_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    log_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Contact Status History Table (existing)
CREATE TABLE contact_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    from_status VARCHAR(32),
    to_status VARCHAR(32),
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- Email Templates Table
CREATE TABLE email_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255),
    body TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Email Templates
INSERT INTO email_templates (template_name, subject, body) VALUES
('contact_confirmation', 'Thank you for contacting SkillBridge', 
'Dear {name},\n\nThank you for contacting SkillBridge. We have received your request regarding "{title}" and will get back to you within 24 hours.\n\nYour request details:\nTitle: {title}\nCompany: {company_name}\n\nBest regards,\nSkillBridge Team'),
('sales_notification', 'New Contact Request - {company_name}', 
'New contact request received:\n\nName: {name}\nCompany: {company_name}\nEmail: {email}\nPhone: {phone}\nTitle: {title}\nMessage: {message}\n\nPlease follow up within 24 hours.');
```

## Implementation Guidelines

### Frontend Implementation
```typescript
// Contact Form Component
import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    title: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    // Company name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    } else if (formData.companyName.trim().length > 100) {
      newErrors.companyName = 'Company name must be less than 100 characters';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\-\+\(\)\s]+$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (formData.title.trim().length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/public/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }
      
      const result = await response.json();
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError('Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="contact-success">
        <h2>Thank you for contacting us!</h2>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p>A confirmation email has been sent to {formData.email}.</p>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Header */}
      <header className="contact-header">
        <div className="header-content">
          <div className="logo">SKILL BRIDGE</div>
          <nav className="navigation">
            <a href="/">HOME</a>
            <a href="/engineers">List Engineer</a>
            <a href="/services">Service</a>
            <a href="/contact" className="active">Contact us</a>
            <a href="/login">Login</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="contact-main">
        <h1>Contact us</h1>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="companyName">Company name *</label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Enter your company name"
              className={errors.companyName ? 'error' : ''}
            />
            {errors.companyName && <span className="error-message">{errors.companyName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Mail Address *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter your request title"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Enter your message or request details"
              rows={5}
              className={errors.message ? 'error' : ''}
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          {submitError && (
            <div className="submit-error">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="footer-content">
          <div className="footer-logo">SKILL BRIDGE</div>
          <div className="footer-links">
            <div className="footer-column">
              <a href="/faq">FAQ</a>
              <a href="/terms">Term</a>
              <a href="/privacy">Privacy policy</a>
            </div>
            <div className="footer-column">
              <a href="/">HOME</a>
              <a href="/engineers">List engineer</a>
              <a href="/services">Services</a>
              <a href="/contact">Contact us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactForm;
```

### Backend Implementation
```java
// Contact Controller
@RestController
@RequestMapping("/api/public/contact")
@CrossOrigin(origins = "*")
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @PostMapping("/submit")
    public ResponseEntity<ContactSubmissionResponse> submitContact(
        @Valid @RequestBody ContactFormData contactData
    ) {
        try {
            ContactSubmissionResponse response = contactService.processContactSubmission(contactData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ContactSubmissionResponse(false, "Failed to process contact submission"));
        }
    }
}

// Contact Service
@Service
@Transactional
public class ContactService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private ContactStatusHistoryRepository contactStatusHistoryRepository;
    
    public ContactSubmissionResponse processContactSubmission(ContactFormData contactData) {
        // Create or update user
        User user = createOrUpdateUser(contactData);
        
        // Create contact record
        Contact contact = createContactRecord(contactData, user);
        
        // Send confirmation email
        emailService.sendConfirmationEmail(user, contact);
        
        // Notify sales manager
        notificationService.notifySalesManager(contact);
        
        // Log status change
        logStatusChange(contact, "Guest", "New");
        
        return new ContactSubmissionResponse(true, "Contact submitted successfully");
    }
    
    private User createOrUpdateUser(ContactFormData contactData) {
        Optional<User> existingUser = userRepository.findByEmail(contactData.getEmail());
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setFullName(contactData.getName());
            user.setCompanyName(contactData.getCompanyName());
            user.setRole("CLIENT");
            user.setActive(true);
            return userRepository.save(user);
        } else {
            User newUser = new User();
            newUser.setEmail(contactData.getEmail());
            newUser.setFullName(contactData.getName());
            newUser.setCompanyName(contactData.getCompanyName());
            newUser.setRole("CLIENT");
            newUser.setActive(true);
            return userRepository.save(newUser);
        }
    }
    
    private Contact createContactRecord(ContactFormData contactData, User user) {
        Contact contact = new Contact();
        contact.setClientUserId(user.getId());
        contact.setTitle(contactData.getTitle() != null ? contactData.getTitle() : "Contact Request from " + contactData.getName());
        contact.setDescription(contactData.getMessage());
        contact.setStatus("New");
        contact.setRequestType("General Inquiry");
        contact.setPriority("Medium");
        contact.setCommunicationProgress("AutoReply");
        contact.setCreatedBy(user.getId());
        
        return contactRepository.save(contact);
    }
    
    private void logStatusChange(Contact contact, String fromStatus, String toStatus) {
        ContactStatusHistory history = new ContactStatusHistory();
        history.setContactId(contact.getId());
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setChangedBy(contact.getCreatedBy());
        contactStatusHistoryRepository.save(history);
    }
}

// AWS SES Configuration
@Configuration
@ConfigurationProperties(prefix = "aws.ses")
public class SesConfig {
    private String region;
    private String accessKey;
    private String secretKey;
    private String fromEmail;
    private String fromName;
    private String configurationSet;
    private boolean enabled;
    
    @Bean
    public AmazonSimpleEmailService amazonSES() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonSimpleEmailServiceClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withRegion(region)
                .build();
    }
    
    // Getters and setters
    // ...
}

// Email Service with AWS SES
@Service
public class EmailService {
    
    @Autowired(required = false)
    private AmazonSimpleEmailService amazonSES;
    
    @Autowired
    private EmailTemplateRepository emailTemplateRepository;
    
    @Value("${aws.ses.enabled:false}")
    private boolean sesEnabled;
    
    @Value("${aws.ses.from-email}")
    private String fromEmail;
    
    @Value("${aws.ses.from-name}")
    private String fromName;
    
    public void sendConfirmationEmail(User user, Contact contact) {
        try {
            EmailTemplate template = emailTemplateRepository.findByTemplateName("contact_confirmation")
                .orElseThrow(() -> new RuntimeException("Email template not found"));
            
            String subject = template.getSubject();
            String body = template.getBody()
                .replace("{name}", user.getFullName() != null ? user.getFullName() : "")
                .replace("{company_name}", user.getCompanyName() != null ? user.getCompanyName() : "")
                .replace("{title}", contact.getTitle() != null ? contact.getTitle() : "");
            
            // Prepare email content
            String emailContent = buildEmailContent(subject, body, user, contact);
            
            // TODO: Uncomment when SES is configured
            // Send email via AWS SES
            /*
            if (sesEnabled && amazonSES != null) {
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
                    .withSource(fromEmail)
                    .withConfigurationSetName(awsSesConfig.getConfigurationSet());
                
                amazonSES.sendEmail(request);
                System.out.println("Confirmation email sent via SES to: " + user.getEmail());
            } else {
                System.out.println("SES is not enabled or configured. Email content prepared but not sent:");
                System.out.println("To: " + user.getEmail());
                System.out.println("Subject: " + subject);
                System.out.println("Body: " + body);
            }
            */
            
            // Log email content (for development/testing)
            System.out.println("=== Email Content Prepared (SES not enabled) ===");
            System.out.println("To: " + user.getEmail());
            System.out.println("Subject: " + subject);
            System.out.println("Body: " + body);
            System.out.println("================================================");
            
        } catch (Exception e) {
            // Log error but don't fail the contact submission
            System.err.println("Failed to prepare confirmation email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private String buildEmailContent(String subject, String body, User user, Contact contact) {
        // This method can be used to build HTML email templates
        return body;
    }
}

// Notification Service
@Service
public class NotificationService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    public void notifySalesManager(Contact contact) {
        try {
            // Find sales manager
            List<User> salesManagers = userRepository.findByRole("SALES_MANAGER");
            if (salesManagers.isEmpty()) {
                // Fallback to admin users
                salesManagers = userRepository.findByRole("ADMIN");
            }
            
            if (!salesManagers.isEmpty()) {
                User salesManager = salesManagers.get(0);
                sendSalesNotification(salesManager, contact);
            }
        } catch (Exception e) {
            // Log error but don't fail the contact submission
            System.err.println("Failed to notify sales manager: " + e.getMessage());
        }
    }
    
    private void sendSalesNotification(User salesManager, Contact contact) {
        // TODO: Uncomment when SES is configured
        /*
        try {
            EmailTemplate template = emailTemplateRepository.findByTemplateName("sales_notification")
                .orElseThrow(() -> new RuntimeException("Email template not found"));
            
            String subject = template.getSubject()
                .replace("{company_name}", contact.getClientUser().getCompanyName());
            
            String body = template.getBody()
                .replace("{name}", contact.getClientUser().getFullName())
                .replace("{company_name}", contact.getClientUser().getCompanyName())
                .replace("{email}", contact.getClientUser().getEmail())
                .replace("{phone}", contact.getClientUser().getPhone())
                .replace("{message}", contact.getDescription())
                .replace("{title}", contact.getTitle());
            
            // Send email via AWS SES
            if (emailService.isSesEnabled() && emailService.getAmazonSES() != null) {
                SendEmailRequest request = new SendEmailRequest()
                    .withDestination(new Destination().withToAddresses(salesManager.getEmail()))
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
                System.out.println("Sales notification sent via SES to: " + salesManager.getEmail());
            } else {
                System.out.println("SES is not enabled. Sales notification prepared but not sent:");
                System.out.println("To: " + salesManager.getEmail());
                System.out.println("Subject: " + subject);
                System.out.println("Body: " + body);
            }
        } catch (Exception e) {
            System.err.println("Failed to send sales notification: " + e.getMessage());
        }
        */
        
        // Log notification content (for development/testing)
        System.out.println("=== Sales Manager Notification Prepared (SES not enabled) ===");
        System.out.println("Sales Manager: " + salesManager.getEmail());
        System.out.println("Contact ID: " + contact.getId());
        System.out.println("Client: " + contact.getClientUser().getFullName());
        System.out.println("Company: " + contact.getClientUser().getCompanyName());
        System.out.println("==========================================================");
    }
}
```

## Testing Requirements

### Unit Tests
```typescript
// Contact Form Component Tests
describe('ContactForm Component', () => {
  it('should render contact form without authentication', () => {
    render(<ContactForm />);
    expect(screen.getByText('Contact us')).toBeInTheDocument();
    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Company name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Mail Address *')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Message *')).toBeInTheDocument();
  });
  
  it('should validate required fields', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByText('Send');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Company name is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
  });
  
  it('should validate email format', async () => {
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText('Mail Address *');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByText('Send');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });
  
  it('should submit form with valid data', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Contact submitted successfully' })
    });
    
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Company name *'), { target: { value: 'ABC Company' } });
    fireEvent.change(screen.getByLabelText('Phone *'), { target: { value: '070-3345-3223' } });
    fireEvent.change(screen.getByLabelText('Mail Address *'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Title *'), { target: { value: 'Project Consulting' } });
    fireEvent.change(screen.getByLabelText('Message *'), { target: { value: 'Test message' } });
    
    const submitButton = screen.getByText('Send');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/public/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          companyName: 'ABC Company',
          phone: '070-3345-3223',
          email: 'john@example.com',
          title: 'Project Consulting',
          message: 'Test message'
        })
      });
    });
  });
  
  it('should show success message after submission', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Contact submitted successfully' })
    });
    
    render(<ContactForm />);
    
    // Fill form and submit
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Company name *'), { target: { value: 'ABC Company' } });
    fireEvent.change(screen.getByLabelText('Phone *'), { target: { value: '070-3345-3223' } });
    fireEvent.change(screen.getByLabelText('Mail Address *'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Title *'), { target: { value: 'Project Consulting' } });
    fireEvent.change(screen.getByLabelText('Message *'), { target: { value: 'Test message' } });
    
    const submitButton = screen.getByText('Send');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thank you for contacting us!')).toBeInTheDocument();
      expect(screen.getByText('We have received your message and will get back to you within 24 hours.')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests
```java
// Contact Controller Tests
@SpringBootTest
@AutoConfigureTestDatabase
class ContactControllerTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Test
    void testSubmitContactForm() {
        ContactFormData contactData = new ContactFormData();
        contactData.setName("John Doe");
        contactData.setCompanyName("ABC Company");
        contactData.setPhone("070-3345-3223");
        contactData.setEmail("john@example.com");
        contactData.setTitle("Project Consulting");
        contactData.setMessage("Test message");
        
        ResponseEntity<ContactSubmissionResponse> response = restTemplate.postForEntity(
            "/api/public/contact/submit",
            contactData,
            ContactSubmissionResponse.class
        );
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        
        // Verify user was created
        Optional<User> user = userRepository.findByEmail("john@example.com");
        assertTrue(user.isPresent());
        assertEquals("CLIENT", user.get().getRole());
        
        // Verify contact was created
        List<Contact> contacts = contactRepository.findByClientUserId(user.get().getId());
        assertFalse(contacts.isEmpty());
        assertEquals("New", contacts.get(0).getStatus());
    }
    
    @Test
    void testSubmitContactFormWithInvalidData() {
        ContactFormData contactData = new ContactFormData();
        contactData.setName(""); // Invalid: empty name
        contactData.setEmail("invalid-email"); // Invalid: bad email format
        
        ResponseEntity<ContactSubmissionResponse> response = restTemplate.postForEntity(
            "/api/public/contact/submit",
            contactData,
            ContactSubmissionResponse.class
        );
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
```

### End-to-End Tests
```typescript
// E2E Tests
describe('Contact Form E2E Tests', () => {
  it('should submit contact form successfully', () => {
    cy.visit('/contact');
    
    // Verify form is displayed
    cy.contains('Contact us').should('be.visible');
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="companyName"]').should('be.visible');
    cy.get('input[name="phone"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="title"]').should('be.visible');
    cy.get('textarea[name="message"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    
    // Fill form
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="companyName"]').type('ABC Company');
    cy.get('input[name="phone"]').type('070-3345-3223');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="title"]').type('Project Consulting');
    cy.get('textarea[name="message"]').type('Test message');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.contains('Thank you for contacting us!').should('be.visible');
    cy.contains('We have received your message and will get back to you within 24 hours.').should('be.visible');
  });
  
  it('should show validation errors for empty fields', () => {
    cy.visit('/contact');
    
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // Verify validation errors
    cy.contains('Name is required').should('be.visible');
    cy.contains('Company name is required').should('be.visible');
    cy.contains('Phone number is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Title is required').should('be.visible');
    cy.contains('Message is required').should('be.visible');
  });
  
  it('should show validation error for invalid email', () => {
    cy.visit('/contact');
    
    // Fill form with invalid email
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="companyName"]').type('ABC Company');
    cy.get('input[name="phone"]').type('070-3345-3223');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="title"]').type('Project Consulting');
    cy.get('textarea[name="message"]').type('Test message');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify validation error
    cy.contains('Please enter a valid email address').should('be.visible');
  });
});
```

## Performance Requirements

### Performance Metrics
- **Form Load Time**: < 3 seconds
- **Form Submission Time**: < 5 seconds
- **Email Delivery Time**: < 2 minutes
- **Database Query Time**: < 500ms

### Optimization Strategies
```typescript
// Form Optimization
const useFormOptimization = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const debouncedValidation = useCallback(
    debounce((field: string, value: string) => {
      validateField(field, value);
    }, 300),
    []
  );
  
  return { isSubmitting, debouncedValidation };
};
```

```java
// Database Optimization
@Repository
public class ContactRepository extends JpaRepository<Contact, Long> {
    
    @Query("SELECT c FROM Contact c WHERE c.clientUserId = :userId ORDER BY c.createdAt DESC")
    List<Contact> findByClientUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT c FROM Contact c WHERE c.status = :status ORDER BY c.createdAt DESC")
    List<Contact> findByStatusOrderByCreatedAtDesc(@Param("status") String status);
}

@Repository
public class UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
    
    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRole(@Param("role") String role);
}
```

## Security Considerations

### Data Validation
```java
// Contact Form Validation
@Component
public class ContactFormValidator {
    
    public void validateContactForm(ContactFormData contactData) {
        if (contactData.getName() == null || contactData.getName().trim().isEmpty()) {
            throw new ValidationException("Name is required");
        }
        
        if (contactData.getName().length() > 100) {
            throw new ValidationException("Name too long");
        }
        
        if (contactData.getEmail() == null || !isValidEmail(contactData.getEmail())) {
            throw new ValidationException("Invalid email format");
        }
        
        if (contactData.getMessage() == null || contactData.getMessage().trim().length() < 10) {
            throw new ValidationException("Message too short");
        }
        
        if (contactData.getMessage().length() > 1000) {
            throw new ValidationException("Message too long");
        }
    }
    
    private boolean isValidEmail(String email) {
        return email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }
}
```

### Input Sanitization
```java
// Input Sanitization Service
@Service
public class InputSanitizationService {
    
    public ContactFormData sanitizeContactForm(ContactFormData contactData) {
        ContactFormData sanitized = new ContactFormData();
        sanitized.setName(sanitizeString(contactData.getName()));
        sanitized.setCompanyName(sanitizeString(contactData.getCompanyName()));
        sanitized.setPhone(sanitizeString(contactData.getPhone()));
        sanitized.setEmail(sanitizeString(contactData.getEmail()));
        sanitized.setMessage(sanitizeString(contactData.getMessage()));
        return sanitized;
    }
    
    private String sanitizeString(String input) {
        if (input == null) return null;
        return input.trim().replaceAll("[<>\"'&]", "");
    }
}
```

## Definition of Done

### Development Complete
- [ ] Contact form implemented with all required fields
- [ ] Form validation implemented (client and server side)
- [ ] User creation and status change functionality
- [ ] Email notification system implemented
- [ ] Sales manager notification system
- [ ] Responsive design for all devices

### Testing Complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Email delivery testing completed
- [ ] Form validation testing completed

### Documentation Complete
- [ ] API documentation updated
- [ ] Email template documentation updated
- [ ] Technical documentation updated
- [ ] User guide updated

### Deployment Complete
- [ ] Code deployed to staging environment
- [ ] Staging testing completed
- [ ] Production deployment completed
- [ ] Email service configured
- [ ] Database tables created
- [ ] Performance monitoring configured

## Dependencies

### External Dependencies
- **Next.js 14+**: Frontend framework
- **React 18+**: UI library
- **TypeScript**: Type safety
- **Spring Boot 3.x**: Backend framework
- **MySQL 8.0+**: Database
- **AWS SDK for SES**: Email service (AWS Simple Email Service)

### Internal Dependencies
- **User Management**: User creation and role assignment
- **Contact Management**: Contact record creation
- **Email Service**: Confirmation email delivery
- **Notification Service**: Sales manager notifications
- **Navigation System**: Header and footer navigation

## Risks and Mitigation

### Technical Risks
- **Email Delivery**: Email service failures may prevent confirmation emails
  - *Mitigation*: Implement email queue and retry mechanism
- **Database Performance**: High contact volume may slow database
  - *Mitigation*: Implement database indexing and query optimization
- **Form Spam**: Automated form submissions may overwhelm system
  - *Mitigation*: Implement CAPTCHA and rate limiting

### Business Risks
- **User Experience**: Complex form may discourage submissions
  - *Mitigation*: Conduct user testing and iterative improvements
- **Data Quality**: Invalid contact information may waste sales efforts
  - *Mitigation*: Implement comprehensive validation and data quality checks

## Success Metrics

### Business Metrics
- **Contact Submissions**: Target 100+ submissions per month
- **Conversion Rate**: Target 20% of visitors submit contact form
- **Response Time**: Target 24-hour response time to contacts
- **Email Delivery**: Target 99% email delivery rate

### Technical Metrics
- **Form Load Time**: Target < 3 seconds
- **Form Submission Time**: Target < 5 seconds
- **Email Delivery Time**: Target < 2 minutes
- **Error Rate**: Target < 1% error rate

## Future Enhancements

### Phase 2 Features
- **Contact Management Dashboard**: Admin interface for managing contacts
- **Advanced Form Fields**: Additional fields for specific request types
- **File Upload**: Allow users to attach documents
- **Contact History**: Track all interactions with contacts

### Phase 3 Features
- **CRM Integration**: Full CRM system integration
- **Automated Follow-up**: Automated follow-up email sequences
- **Contact Scoring**: Lead scoring based on form data
- **Analytics Dashboard**: Contact submission analytics and reporting

---

**Story Status**: Ready for Development  
**Assigned To**: Frontend Team, Backend Team  
**Estimated Effort**: 8 Story Points  
**Target Sprint**: Sprint 1  
**Review Date**: End of Sprint 1
