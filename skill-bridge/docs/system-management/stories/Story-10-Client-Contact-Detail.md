# User Story: Client Contact Detail View

## Story Information
- **Story ID**: Story-10
- **Title**: Client Contact Detail View
- **Epic**: Client Portal - Contact Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 3
- **Status**: Ready for Development

## User Story
**As a** Client  
**I want to** view detailed information about my contact submission and interact with proposals and communication logs  
**So that** I can track my consultation requests, communicate with the team, and manage proposals

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view detailed information about a specific contact
- [ ] I can add communication logs directly on the detail page
- [ ] I can comment on proposals through a modal dialog
- [ ] I can cancel a consultation with a reason through a modal dialog
- [ ] Contact detail page matches the wireframe design

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)
- [ ] **Left Sidebar**: (Shared component with Contact List)
  - [ ] "SKILL BRIDGE" logo/title at the top
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon
    - [ ] "Contact form" with envelope icon (highlighted/active when on this page)
    - [ ] "Proposal" with document icon
    - [ ] "Contract" with document icon

- [ ] **Top Header**: (Shared component with Contact List)
  - [ ] Page title "Contact management" displayed on the left
  - [ ] User information on the right:
    - [ ] User icon/avatar
    - [ ] User name with honorific "様" (e.g., "Yamada Taro様")
  - [ ] Header has white background
  - [ ] Language selector (JA/EN)

- [ ] **Main Content Area**:
  - [ ] Gray background (`bg-gray-50`)
  - [ ] White content area for main details
  - [ ] Proper spacing and padding

#### 2. Breadcrumbs
- [ ] **Breadcrumb Navigation**:
  - [ ] Displays "Contact Management > Consultation Contact"
  - [ ] "Contact Management" is clickable and links back to contact list
  - [ ] "Consultation Contact" is the current page (non-clickable)
  - [ ] Breadcrumbs are positioned below header, above page title

#### 3. Page Title
- [ ] **Contact Detail Title**:
  - [ ] Large, bold text displaying "Contact Detail"
  - [ ] Positioned below breadcrumbs
  - [ ] Clear visual hierarchy

#### 4. Contact Information Section
- [ ] **Contact Info Display**:
  - [ ] **Contact ID**: 
    - [ ] Format: "CC-YYYY-NN" (e.g., "CC-2025-003")
    - [ ] Displayed as label-value pair
  - [ ] **Client Name**: 
    - [ ] Shows client's full name (e.g., "Yamada Hiro")
    - [ ] Displayed as label-value pair
  - [ ] **Phone**: 
    - [ ] Shows phone number (e.g., "+81-90-xxxx-xxxx")
    - [ ] May be masked for privacy
    - [ ] Displayed as label-value pair
  - [ ] **Date Received**: 
    - [ ] Format: "YYYY/MM/DD HH:MM JST" (e.g., "2025/06/01 09:45 JST")
    - [ ] Displayed as label-value pair
  - [ ] **Email**: 
    - [ ] Shows client's email address (e.g., "hiro.yamada@xyz.co.jp")
    - [ ] Displayed as label-value pair
  - [ ] **Client Company**: 
    - [ ] Shows company name or "-" if not provided
    - [ ] Displayed as label-value pair

#### 5. Consultation Request Section
- [ ] **Request Details**:
  - [ ] Section title/header: "Consultation Request" or similar
  - [ ] Full text of the consultation request is displayed
  - [ ] Text is readable and properly formatted
  - [ ] Example: "We are planning an AI-based EC platform. Need 5 backend engineers with AWS experience for ~6 months."

#### 6. Online Meeting Section
- [ ] **Meeting Information**:
  - [ ] Section title/header: "Online MTG Link" or "Meeting Information"
  - [ ] **Date and Time**: 
    - [ ] Format: "YYYY/MM/DD HH:MM" (e.g., "2025/10/13 15:00")
    - [ ] Displayed clearly
  - [ ] **Meeting Link**: 
    - [ ] Clickable URL (e.g., "https://zoom.us/192839832919123")
    - [ ] Underlined to indicate clickability
    - [ ] Opens in new tab/window when clicked
    - [ ] Link is displayed prominently

#### 7. Communication Log Section
- [ ] **Communication Log Display**:
  - [ ] Section title/header: "Communication Log" or "Communication History"
  - [ ] **Add Log Button**: 
    - [ ] Button labeled "+Add Log" or "+ Add Log"
    - [ ] Button has gray outline and blue text (or matching design system)
    - [ ] Positioned at top of section

- [ ] **Add Log Functionality** (Inline, NOT modal):
  - [ ] When user clicks "+Add Log" button:
    - [ ] Input field appears directly below the button
    - [ ] "Add" button appears next to or below the input field
    - [ ] User can type log message in the input field
    - [ ] Clicking "Add" button saves the log entry
    - [ ] After saving, log entry appears in the communication log list
    - [ ] Input field and "Add" button remain visible for adding more logs
    - [ ] User can collapse/hide the input area (optional enhancement)

- [ ] **Log Entries Display**:
  - [ ] Logs are displayed in chronological order (newest first or oldest first)
  - [ ] Each log entry shows:
    - [ ] Log message/content
    - [ ] Date and time when log was added
    - [ ] User who added the log (optional)
  - [ ] Empty state message if no logs exist: "No communication logs yet"

#### 8. Proposal Section
- [ ] **Proposal Information**:
  - [ ] Section title/header: "Proposal" or "Linked Proposal"
  - [ ] **Proposal Document Link**: 
    - [ ] Displayed as clickable link (e.g., "proposal_v1.pdf")
    - [ ] Underlined to indicate clickability
    - [ ] Clicking link downloads or opens the proposal document
    - [ ] Link is clearly visible

- [ ] **Proposal Actions**:
  - [ ] **Approve Button**: 
    - [ ] Solid blue button with white text
    - [ ] Label: "Approve"
    - [ ] Clicking approves the proposal
    - [ ] Confirmation dialog before approval (optional)
    - [ ] After approval, button state changes (disabled/gray)
  - [ ] **Comment Button**: 
    - [ ] Button with gray outline and dark text
    - [ ] Label: "Comment"
    - [ ] Clicking opens Comment Modal (see Modal section below)

#### 9. Comment Modal
- [ ] **Modal Display**:
  - [ ] Modal appears when user clicks "Comment" button
  - [ ] Modal has white background
  - [ ] Modal is centered on screen with backdrop overlay
  - [ ] Modal can be closed by clicking outside, pressing ESC, or close button

- [ ] **Modal Content**:
  - [ ] **Title**: "Comment" displayed prominently at top center
  - [ ] **Message Input Field**:
    - [ ] Label "Message" displayed above input
    - [ ] Large textarea input field (multi-line)
    - [ ] Placeholder text: "Enter your comment" or similar
    - [ ] Input is required (validation)
    - [ ] Textarea has proper styling (rounded corners, border)
  - [ ] **Action Button**: 
    - [ ] Button labeled "Comment" (or "Submit", "Save Comment")
    - [ ] Button has gray border and white background (matching design)
    - [ ] Button submits the comment
    - [ ] Button is disabled during submission (loading state)

- [ ] **Modal Behavior**:
  - [ ] After successful submission, modal closes
  - [ ] Success message or visual feedback (optional)
  - [ ] Comment is saved and associated with the proposal
  - [ ] Error handling if submission fails

#### 10. Cancel Consultation Modal
- [ ] **Modal Display**:
  - [ ] Modal appears when user clicks "Cancel Consultation" button
  - [ ] Modal has white background
  - [ ] Modal is centered on screen with backdrop overlay
  - [ ] Modal can be closed by clicking outside, pressing ESC, or close button

- [ ] **Modal Content**:
  - [ ] **Title**: "Are you sure to cancel this Consultation?" displayed prominently at top center
  - [ ] **Message Input Field**:
    - [ ] Label "Message" displayed above input
    - [ ] Large textarea input field (multi-line)
    - [ ] Placeholder text: "Enter reason for cancellation" or "Lorem ips sum" (placeholder)
    - [ ] Input is required (validation)
    - [ ] Textarea has proper styling (rounded corners, border)
  - [ ] **Action Button**: 
    - [ ] Button labeled "Cancel" (or "Confirm Cancellation")
    - [ ] Button has gray border and white background (matching design)
    - [ ] Button confirms the cancellation
    - [ ] Button is disabled during submission (loading state)

- [ ] **Modal Behavior**:
  - [ ] After successful cancellation:
    - [ ] Modal closes
    - [ ] Consultation status changes to "Cancelled" or "Closed"
    - [ ] Success message or visual feedback
    - [ ] User is redirected to contact list or detail page updates
  - [ ] Error handling if cancellation fails

#### 11. Bottom Action Buttons
- [ ] **Action Buttons** (aligned to the right):
  - [ ] **Back Button**: 
    - [ ] Button with gray outline and dark text
    - [ ] Label: "Back"
    - [ ] Clicking navigates back to contact list page
  - [ ] **Cancel Consultation Button**: 
    - [ ] Button with gray outline and dark text
    - [ ] Label: "Cancel Consultation" (or "Cancel Consultation")
    - [ ] Clicking opens Cancel Consultation Modal (see Modal section above)
    - [ ] Button is only visible if consultation is not already cancelled

#### 12. Authentication & Authorization
- [ ] **Access Control**:
  - [ ] Only authenticated client users can access this page
  - [ ] Users can only view their own contacts (client_user_id filter)
  - [ ] Unauthenticated users redirected to login
  - [ ] Contact ID validation - ensure contact belongs to user

#### 13. Data Loading & Error Handling
- [ ] **Loading States**:
  - [ ] Loading spinner/skeleton while fetching contact details
  - [ ] Loading state for communication logs
  - [ ] Loading state for proposal information
- [ ] **Error Handling**:
  - [ ] Error message if contact not found
  - [ ] Error message if unauthorized access
  - [ ] Error message for failed API calls
  - [ ] Graceful error messages (user-friendly)

## Technical Requirements

### Frontend Requirements
```typescript
// Contact Detail Page Component Structure
interface ContactDetailPageProps {
  contactId: string; // Contact ID from URL params
}

interface ContactDetail {
  id: string; // Format: CC-YYYY-NN
  contactId: number; // Internal ID
  clientName: string;
  phone: string;
  email: string;
  clientCompany: string | null;
  dateReceived: string; // ISO format
  consultationRequest: string;
  onlineMtgDate: string | null;
  onlineMtgLink: string | null;
  status: 'New' | 'Converted to Opportunity' | 'Closed' | 'Cancelled';
  proposalLink: string | null;
  proposalStatus: 'Pending' | 'Approved' | 'Commented';
}

interface CommunicationLog {
  id: number;
  message: string;
  createdAt: string;
  createdBy: number;
  createdByName?: string;
}

interface ContactDetailState {
  contact: ContactDetail | null;
  communicationLogs: CommunicationLog[];
  loading: boolean;
  error: string | null;
  showCommentModal: boolean;
  showCancelModal: boolean;
  showAddLogInput: boolean;
  newLogMessage: string;
  commentMessage: string;
  cancellationReason: string;
}

// Modal Components
interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
}

interface CancelConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

// Add Log Component (Inline)
interface AddLogInputProps {
  isVisible: boolean;
  onSubmit: (message: string) => Promise<void>;
  onCancel?: () => void;
}
```

### Backend Requirements
```java
// Contact Detail Controller
@RestController
@RequestMapping("/client/contacts")
public class ClientContactController {
    
    @GetMapping("/{contactId}")
    public ResponseEntity<ContactDetailDTO> getContactDetail(
        @PathVariable Integer contactId,
        Authentication authentication
    );
    
    @PostMapping("/{contactId}/logs")
    public ResponseEntity<CommunicationLogDTO> addCommunicationLog(
        @PathVariable Integer contactId,
        @RequestBody AddLogRequest request,
        Authentication authentication
    );
    
    @PostMapping("/{contactId}/proposal/comment")
    public ResponseEntity<CommentResponse> addProposalComment(
        @PathVariable Integer contactId,
        @RequestBody CommentRequest request,
        Authentication authentication
    );
    
    @PostMapping("/{contactId}/cancel")
    public ResponseEntity<CancelResponse> cancelConsultation(
        @PathVariable Integer contactId,
        @RequestBody CancelRequest request,
        Authentication authentication
    );
    
    @PostMapping("/{contactId}/proposal/approve")
    public ResponseEntity<ApproveResponse> approveProposal(
        @PathVariable Integer contactId,
        Authentication authentication
    );
}

// Contact Detail DTO
public class ContactDetailDTO {
    private String id; // Format: CC-YYYY-NN
    private String clientName;
    private String phone;
    private String email;
    private String clientCompany;
    private String dateReceived; // ISO format
    private String consultationRequest;
    private String onlineMtgDate;
    private String onlineMtgLink;
    private String status;
    private String proposalLink;
    private String proposalStatus;
    private List<CommunicationLogDTO> communicationLogs;
}

// Communication Log DTO
public class CommunicationLogDTO {
    private Integer id;
    private String message;
    private String createdAt;
    private Integer createdBy;
    private String createdByName;
}

// Request DTOs
public class AddLogRequest {
    private String message;
}

public class CommentRequest {
    private String message;
}

public class CancelRequest {
    private String reason;
}
```

### Database Schema
```sql
-- Communication Logs table
CREATE TABLE communication_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    message TEXT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_contact_id (contact_id),
    INDEX idx_created_at (created_at)
);

-- Proposal Comments table
CREATE TABLE proposal_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    message TEXT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_contact_id (contact_id)
);

-- Consultation Cancellations table
CREATE TABLE consultation_cancellations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    reason TEXT NOT NULL,
    cancelled_by INT NOT NULL,
    cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (cancelled_by) REFERENCES users(id),
    INDEX idx_contact_id (contact_id)
);

-- Contacts table (update)
ALTER TABLE contacts ADD COLUMN proposal_link VARCHAR(500) NULL;
ALTER TABLE contacts ADD COLUMN proposal_status VARCHAR(50) DEFAULT 'Pending';
ALTER TABLE contacts ADD COLUMN online_mtg_date DATETIME NULL;
ALTER TABLE contacts ADD COLUMN online_mtg_link VARCHAR(500) NULL;
```

## Implementation Guidelines

### Frontend Implementation
```typescript
// Contact Detail Page Component (simplified structure)
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import CommentModal from '@/components/CommentModal';
import CancelConsultationModal from '@/components/CancelConsultationModal';
import AddLogInput from '@/components/AddLogInput';

export default function ContactDetailPage() {
  const { contactId } = useParams();
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddLogInput, setShowAddLogInput] = useState(false);
  
  // Component structure matching wireframe
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <ClientSidebar currentPage="contact-form" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <ClientHeader titleKey="client.header.title.contactManagement" />
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 bg-gray-50">
          {/* Breadcrumbs */}
          <nav className="mb-4">
            <a href="/client/contacts">{t('client.contactDetail.breadcrumb.list')}</a>
            <span> > </span>
            <span>{t('client.contactDetail.breadcrumb.detail')}</span>
          </nav>
          
          {/* Page Title */}
          <h1 className="text-2xl font-bold mb-6">{t('client.contactDetail.title')}</h1>
          
          {/* Contact Info Section */}
          <ContactInfoSection contact={contact} />
          
          {/* Consultation Request Section */}
          <ConsultationRequestSection request={contact?.consultationRequest} />
          
          {/* Online Meeting Section */}
          <OnlineMeetingSection 
            date={contact?.onlineMtgDate}
            link={contact?.onlineMtgLink}
          />
          
          {/* Communication Log Section */}
          <CommunicationLogSection 
            logs={contact?.communicationLogs}
            showAddInput={showAddLogInput}
            onAddLogClick={() => setShowAddLogInput(true)}
            onAddLogSubmit={handleAddLog}
          />
          
          {/* Proposal Section */}
          <ProposalSection 
            proposalLink={contact?.proposalLink}
            onApprove={handleApproveProposal}
            onComment={() => setShowCommentModal(true)}
          />
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => router.push('/client/contacts')}>
              {t('client.contactDetail.actions.back')}
            </Button>
            <Button variant="outline" onClick={() => setShowCancelModal(true)}>
              {t('client.contactDetail.actions.cancelConsultation')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onSubmit={handleAddComment}
      />
      
      <CancelConsultationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSubmit={handleCancelConsultation}
      />
    </div>
  );
}

// Add Log Input Component (Inline)
function AddLogInput({ isVisible, onSubmit, onCancel }: AddLogInputProps) {
  const [message, setMessage] = useState('');
  
  if (!isVisible) return null;
  
  const handleSubmit = async () => {
    if (message.trim()) {
      await onSubmit(message);
      setMessage('');
      onCancel?.();
    }
  };
  
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter communication log message"
        rows={3}
        className="mb-3"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button onClick={handleSubmit}>Add</Button>
      </div>
    </div>
  );
}
```

### Backend Implementation
```java
// Contact Detail Service
@Service
public class ContactDetailService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private CommunicationLogRepository communicationLogRepository;
    
    @Autowired
    private ProposalCommentRepository proposalCommentRepository;
    
    @Autowired
    private ConsultationCancellationRepository cancellationRepository;
    
    public ContactDetailDTO getContactDetail(Integer contactId, Integer clientUserId) {
        // Validate contact belongs to client
        Contact contact = contactRepository.findByIdAndClientUserId(contactId, clientUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        
        // Get communication logs
        List<CommunicationLog> logs = communicationLogRepository.findByContactIdOrderByCreatedAtDesc(contactId);
        
        // Build DTO
        ContactDetailDTO dto = new ContactDetailDTO();
        // ... map contact fields
        // ... map logs
        
        return dto;
    }
    
    @Transactional
    public CommunicationLogDTO addCommunicationLog(Integer contactId, Integer userId, String message) {
        // Validate contact belongs to user
        Contact contact = contactRepository.findByIdAndClientUserId(contactId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        
        CommunicationLog log = new CommunicationLog();
        log.setContactId(contactId);
        log.setMessage(message);
        log.setCreatedBy(userId);
        log = communicationLogRepository.save(log);
        
        return convertToDTO(log);
    }
    
    @Transactional
    public void addProposalComment(Integer contactId, Integer userId, String message) {
        // Validate and save comment
    }
    
    @Transactional
    public void cancelConsultation(Integer contactId, Integer userId, String reason) {
        // Update contact status
        // Save cancellation record
    }
    
    @Transactional
    public void approveProposal(Integer contactId, Integer userId) {
        // Update proposal status
    }
}
```

## Testing Requirements

### Unit Tests
- [ ] Contact detail component renders correctly
- [ ] Communication log input appears when "+Add Log" is clicked
- [ ] Comment modal opens when "Comment" button is clicked
- [ ] Cancel modal opens when "Cancel Consultation" button is clicked
- [ ] Log submission works correctly
- [ ] Comment submission works correctly
- [ ] Cancellation submission works correctly
- [ ] Proposal approval works correctly

### Integration Tests
- [ ] API returns contact details for authenticated client
- [ ] API validates contact ownership
- [ ] Communication log is saved correctly
- [ ] Proposal comment is saved correctly
- [ ] Consultation cancellation is saved correctly
- [ ] Proposal approval updates status correctly

### End-to-End Tests
- [ ] Complete flow: Login → Contact List → View Detail
- [ ] Add communication log from detail page
- [ ] Add comment to proposal via modal
- [ ] Cancel consultation via modal
- [ ] Approve proposal
- [ ] Navigate back to contact list

## Performance Requirements

### Performance Metrics
- **Page Load Time**: < 2 seconds
- **Detail Render Time**: < 500ms
- **Modal Open Time**: < 200ms
- **Log Submission Time**: < 500ms
- **Comment Submission Time**: < 500ms

### Optimization Strategies
- [ ] Lazy load communication logs (paginate if many)
- [ ] Cache contact details
- [ ] Debounce input for log message (optional)

## Security Considerations

### Security Requirements
- [ ] Only authenticated client users can access
- [ ] Client can only view their own contacts (client_user_id validation)
- [ ] All actions require authentication
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS prevention

## Definition of Done

### Development Complete
- [ ] Contact detail page implemented matching wireframe
- [ ] All sections display correctly (Contact Info, Request, Meeting, Logs, Proposal)
- [ ] Communication log inline input works
- [ ] Comment modal implemented and functional
- [ ] Cancel consultation modal implemented and functional
- [ ] Proposal approval functionality works
- [ ] Breadcrumbs navigation works
- [ ] Back button navigation works
- [ ] Responsive design implemented
- [ ] Multi-language support (JP/EN)

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
- **Spring Boot**: Backend framework
- **MySQL**: Database

### Internal Dependencies
- **AuthContext**: User authentication
- **LanguageContext**: Multi-language support
- **Contact Entity**: Existing contact table structure
- **ClientSidebar**: Shared sidebar component
- **ClientHeader**: Shared header component
- **Story-09**: Contact List page (for navigation)

## Risks and Mitigation

### Technical Risks
- **Performance**: Large communication logs may slow down page
  - *Mitigation*: Implement pagination for logs, limit initial load
- **Complex State**: Multiple modals and inline inputs may cause state management issues
  - *Mitigation*: Use proper React state management, clear separation of concerns

### Business Risks
- **User Experience**: Multiple modals may confuse users
  - *Mitigation*: Clear modal titles, intuitive UI, consistent design patterns

## Success Metrics

### Business Metrics
- **Detail Page Views**: Track how often users view contact details
- **Log Additions**: Track frequency of communication log additions
- **Comment Submissions**: Track proposal comment frequency
- **Cancellation Rate**: Track consultation cancellation frequency

### Technical Metrics
- **Page Load Time**: Target < 2 seconds
- **API Response Time**: Target < 500ms
- **Error Rate**: Target < 1%

## Future Enhancements

### Phase 2 Features
- **Edit Contact Details**: Allow clients to edit certain fields
- **File Attachments**: Allow uploading files to communication logs
- **Real-time Updates**: WebSocket notifications for status changes
- **Export Contact Details**: Export contact information to PDF

### Phase 3 Features
- **Communication Log Filtering**: Filter logs by date, user, etc.
- **Proposal Versioning**: Track multiple proposal versions
- **Meeting Scheduling**: Integrate calendar for scheduling meetings
- **Activity Timeline**: Visual timeline of all contact activities

---

**Story Status**: Ready for Development  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 13 Story Points  
**Target Sprint**: Sprint 3

