# User Story: Sales Contact Detail Management

## Story Information
- **Story ID**: Story-20
- **Title**: Sales Contact Detail Management
- **Epic**: Sales Portal - Contact Management
- **Priority**: High
- **Story Points**: 13
- **Sprint**: Sprint 6
- **Status**: Draft

## User Story
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view and edit detailed contact information with role-based permissions  
**So that** I can manage contact details, update status, schedule meetings, and track communications effectively

## Acceptance Criteria

### Primary Acceptance Criteria
- [ ] I can view detailed contact information matching the wireframe
- [ ] Sales Manager can edit Classification fields (Request Type, Priority, Assignee)
- [ ] Sales Manager can assign contacts to themselves
- [ ] Only assigned Sales Man can edit Status, Internal Notes, Online MTG fields, and Communication Log
- [ ] I can save contact changes
- [ ] I can convert contact to opportunity
- [ ] Contact detail page matches the wireframe design exactly

### Detailed Acceptance Criteria

#### 1. Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar in dark gray background
  - [ ] Navigation menu items with icons:
    - [ ] "Dashboard" with grid icon (four squares)
    - [ ] "Opportunities" with envelope icon (highlighted/active state when on this page)
    - [ ] "Contract" with document icon (appears twice in wireframe)
  - [ ] Sidebar has white background with dark gray header
  - [ ] Sidebar is collapsible on mobile (future enhancement)

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] "SKILL BRIDGE" text on the far left
  - [ ] Page title "Contact management" displayed in the center
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] User name (e.g., "Admin")
  - [ ] Header is sticky/static at top

- [ ] **Main Content Area**:
  - [ ] White background area for main content
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Responsive layout for different screen sizes

#### 2. Breadcrumbs

- [ ] **Breadcrumb Navigation**:
  - [ ] Displays "Contact Management > Consultation Contact"
  - [ ] "Contact Management" is clickable and links back to contact list (`/sales/contacts`)
  - [ ] "Consultation Contact" is the current page (non-clickable)
  - [ ] Breadcrumbs are positioned below header, above page title

#### 3. Page Title

- [ ] **Contact Detail Title**:
  - [ ] Large, bold text displaying "Contact Detail"
  - [ ] Positioned below breadcrumbs
  - [ ] Clear visual hierarchy

#### 4. Contact Information Section

- [ ] **Contact Info Display** (Read-only):
  - [ ] **Contact ID**: 
    - [ ] Format: "CC-YYYY-NN" (e.g., "CC-2025-003")
    - [ ] Displayed as label-value pair
    - [ ] Field is read-only (cannot be edited)
  - [ ] **Date Received**: 
    - [ ] Format: "YYYY/MM/DD HH:MM JST" (e.g., "2025/06/01 09:45 JST")
    - [ ] Displayed as label-value pair
    - [ ] Field is read-only
  - [ ] **Client Name**: 
    - [ ] Shows client's full name (e.g., "Yamada Hiro")
    - [ ] Displayed as label-value pair
    - [ ] Field is read-only
  - [ ] **Email**: 
    - [ ] Shows client's email address (e.g., "hiro.yamada@xyz.co.jp")
    - [ ] Displayed as label-value pair
    - [ ] Field is read-only
  - [ ] **Phone**: 
    - [ ] Shows phone number (e.g., "+81-90-xxxx-xxxx")
    - [ ] Displayed as label-value pair
    - [ ] Field is read-only
  - [ ] **Client Company**: 
    - [ ] Shows company name or "-" if not provided
    - [ ] Displayed as label-value pair
    - [ ] Field is read-only

#### 5. Consultation Request Section

- [ ] **Request Details** (Read-only):
  - [ ] Section title/header: "Consultation Request"
  - [ ] Full text of the consultation request is displayed in a text area
  - [ ] Text area is read-only (cannot be edited)
  - [ ] Text is readable and properly formatted
  - [ ] Example: "We are planning an AI-based EC platform. Need 5 backend engineers with AWS experience for ~6 months."

#### 6. Classification Section

- [ ] **Request Type Dropdown**:
  - [ ] Label: "Request Type"
  - [ ] Dropdown with options: "Project", "Hiring", "Consultation", or combined "Project / Hiring / Consultation"
  - [ ] Current selection is displayed
  - [ ] **Edit Permission**: Only Sales Manager can edit this field
  - [ ] Sales Man sees this field as read-only
  - [ ] Dropdown is disabled for Sales Man

- [ ] **Status Dropdown**:
  - [ ] Label: "Status"
  - [ ] Dropdown with options: "New", "Inprogress", "Closed", "Converted to Opportunity"
  - [ ] Current selection is displayed
  - [ ] **Edit Permission**: Only assigned Sales Man can edit this field
  - [ ] Sales Manager cannot edit this field (read-only for Sales Manager)
  - [ ] Unassigned contacts: No one can edit (read-only)

- [ ] **Priority Dropdown**:
  - [ ] Label: "Priority"
  - [ ] Dropdown with options: "Normal", "High", "Urgent"
  - [ ] Current selection is displayed
  - [ ] **Edit Permission**: Only Sales Manager can edit this field
  - [ ] Sales Man sees this field as read-only
  - [ ] Dropdown is disabled for Sales Man

- [ ] **Assignee Dropdown**:
  - [ ] Label: "Assignee"
  - [ ] Dropdown shows list of Sales Men (users with role SALES_REP or SALES_MANAGER)
  - [ ] Current assignee is displayed (e.g., "Sale 01" or Sales Man's name)
  - [ ] **Edit Permission**: Only Sales Manager can edit this field
  - [ ] Sales Manager can assign to any Sales Man including themselves
  - [ ] Sales Manager can assign to themselves (their own user ID)
  - [ ] Sales Man cannot change assignee (read-only)
  - [ ] Dropdown is disabled for Sales Man

#### 7. Converted to Opportunity Section

- [ ] **Conversion Status Display**:
  - [ ] Label: "Converted to Opportunity"
  - [ ] Displays status: "Converted" or "Not yet"
  - [ ] Status is read-only (display only)
  - [ ] Status changes when "Converted to Opportunity" button is clicked (see Action Buttons section)

#### 8. Internal Notes Section

- [ ] **Internal Notes Field**:
  - [ ] Label: "Internal Notes"
  - [ ] Text input/textarea field
  - [ ] Current notes are displayed (e.g., "Call with client scheduled for 2025/06/03")
  - [ ] **Edit Permission**: Only assigned Sales Man can edit this field
  - [ ] Sales Manager cannot edit this field (read-only for Sales Manager)
  - [ ] Unassigned contacts: No one can edit (read-only)
  - [ ] Field is disabled for non-assigned users

#### 9. Communication Status Section

- [ ] **Section Header**:
  - [ ] Label: "Communication Status" or "Online MTG Send"
  - [ ] Section is clearly visible

- [ ] **Online MTG Link Field**:
  - [ ] Label: "Online MTG Link"
  - [ ] Text input field
  - [ ] Current link is displayed (e.g., "zoom.us/123124541141")
  - [ ] **Edit Permission**: Only assigned Sales Man can edit this field
  - [ ] Sales Manager cannot edit this field (read-only for Sales Manager)
  - [ ] Unassigned contacts: No one can edit (read-only)
  - [ ] Field is disabled for non-assigned users

- [ ] **Online MTG Date Time Field**:
  - [ ] Label: "Online MTG Date time"
  - [ ] Date-time input field
  - [ ] Current date-time is displayed (e.g., "2025/10/13 15:00")
  - [ ] Format: "YYYY/MM/DD HH:MM"
  - [ ] **Edit Permission**: Only assigned Sales Man can edit this field
  - [ ] Sales Manager cannot edit this field (read-only for Sales Manager)
  - [ ] Unassigned contacts: No one can edit (read-only)
  - [ ] Field is disabled for non-assigned users

- [ ] **Send Mail for MTG Button**:
  - [ ] Button labeled "Send Mail for MTG"
  - [ ] Button is clickable
  - [ ] **Permission**: Only assigned Sales Man can click this button
  - [ ] Sales Manager cannot use this button (disabled for Sales Manager)
  - [ ] Unassigned contacts: Button is disabled
  - [ ] Clicking button sends email to client with meeting link and date-time

#### 10. Communication Log Section

- [ ] **Section Header**:
  - [ ] Label: "Communication Log"
  - [ ] Section is clearly visible

- [ ] **Add Log Button**:
  - [ ] Button labeled "+Add Log" or "+ Add Log"
  - [ ] Button is positioned at top of section
  - [ ] **Permission**: Only assigned Sales Man can click this button
  - [ ] Sales Manager cannot add logs (button disabled for Sales Manager)
  - [ ] Unassigned contacts: Button is disabled

- [ ] **Add Log Functionality**:
  - [ ] When assigned Sales Man clicks "+Add Log" button:
    - [ ] Input field appears for entering log message
    - [ ] "Add" or "Save" button appears
    - [ ] User can type log message
    - [ ] Clicking "Add"/"Save" saves the log entry
    - [ ] After saving, log entry appears in the communication log list
    - [ ] Log entry shows: message, date/time, and user who added it

- [ ] **Log Entries Display**:
  - [ ] Logs are displayed in chronological order (newest first or oldest first)
  - [ ] Each log entry shows:
    - [ ] Log message/content
    - [ ] Date and time when log was added
    - [ ] User who added the log (Sales Man's name)
  - [ ] Empty state message if no logs exist: "No communication logs yet"
  - [ ] **View Permission**: Both Sales Manager and assigned Sales Man can view logs
  - [ ] Sales Man not assigned cannot view logs

#### 11. Action Buttons

- [ ] **Cancel Button**:
  - [ ] Button labeled "Cancel"
  - [ ] Positioned at bottom left
  - [ ] Clicking button discards changes and returns to contact list
  - [ ] Confirmation dialog if there are unsaved changes

- [ ] **Save contact Button**:
  - [ ] Button labeled "Save contact"
  - [ ] Positioned at bottom center
  - [ ] **Permission**: 
    - [ ] Sales Manager can save changes to Classification fields (Request Type, Priority, Assignee)
    - [ ] Assigned Sales Man can save changes to Status, Internal Notes, Online MTG fields
    - [ ] Button is enabled based on user's edit permissions
  - [ ] Clicking button saves all changes made by the user
  - [ ] Success message displayed after successful save
  - [ ] Error message displayed if save fails
  - [ ] After save, page refreshes to show updated data

- [ ] **Converted to Opportunity Button**:
  - [ ] Button labeled "Converted to Opportunity"
  - [ ] Positioned at bottom right
  - [ ] **Permission**: Only assigned Sales Man can click this button
  - [ ] Sales Manager cannot use this button (disabled for Sales Manager)
  - [ ] Unassigned contacts: Button is disabled
  - [ ] Clicking button:
    - [ ] Shows confirmation dialog: "Are you sure you want to convert this contact to opportunity?"
    - [ ] After confirmation, contact status changes to "Converted to Opportunity"
    - [ ] "Converted to Opportunity" section updates to show "Converted"
    - [ ] Status dropdown updates to "Converted to Opportunity"
    - [ ] Success message displayed
    - [ ] Button may become disabled after conversion

#### 12. Role-Based Edit Permissions Summary

- [ ] **Sales Manager Permissions**:
  - [ ] Can edit Classification fields:
    - [ ] Request Type (dropdown)
    - [ ] Priority (dropdown)
    - [ ] Assignee (dropdown) - can assign to any Sales Man including themselves
  - [ ] Cannot edit:
    - [ ] Status (read-only)
    - [ ] Internal Notes (read-only)
    - [ ] Online MTG Link (read-only)
    - [ ] Online MTG Date time (read-only)
  - [ ] Cannot add Communication Logs (button disabled)
  - [ ] Cannot use "Send Mail for MTG" button (disabled)
  - [ ] Cannot use "Converted to Opportunity" button (disabled)
  - [ ] Can view all contact information
  - [ ] Can view all communication logs

- [ ] **Sales Man (Assigned) Permissions**:
  - [ ] Can edit:
    - [ ] Status (dropdown)
    - [ ] Internal Notes (text field)
    - [ ] Online MTG Link (text field)
    - [ ] Online MTG Date time (date-time field)
  - [ ] Can add Communication Logs (button enabled)
  - [ ] Can use "Send Mail for MTG" button (enabled)
  - [ ] Can use "Converted to Opportunity" button (enabled)
  - [ ] Cannot edit:
    - [ ] Request Type (read-only)
    - [ ] Priority (read-only)
    - [ ] Assignee (read-only)
  - [ ] Can view all contact information
  - [ ] Can view all communication logs for this contact

- [ ] **Sales Man (Not Assigned) Permissions**:
  - [ ] Can view contact information (read-only)
  - [ ] Cannot edit any fields (all read-only)
  - [ ] Cannot add Communication Logs (button disabled)
  - [ ] Cannot use "Send Mail for MTG" button (disabled)
  - [ ] Cannot use "Converted to Opportunity" button (disabled)
  - [ ] Cannot view communication logs (if access is restricted)

- [ ] **Backend Authorization**:
  - [ ] API validates user role and assignee relationship before allowing edits
  - [ ] Sales Manager: Can update Request Type, Priority, Assignee
  - [ ] Assigned Sales Man: Can update Status, Internal Notes, Online MTG fields, Communication Logs
  - [ ] Unauthorized edit attempts return 403 Forbidden
  - [ ] Authorization check performed on every update request

## Technical Requirements

### Frontend Requirements

```typescript
// Sales Contact Detail Page Component Structure
interface SalesContactDetailPageProps {
  contactId: string; // e.g., "CC-2025-003"
}

interface ContactDetail {
  id: string; // Format: "CC-YYYY-NN"
  contactId: number; // Internal ID
  dateReceived: string; // Format: "YYYY/MM/DD HH:MM JST"
  clientName: string;
  email: string;
  phone: string;
  clientCompany: string | null;
  consultationRequest: string;
  requestType: 'PROJECT' | 'HIRING' | 'CONSULTATION';
  status: 'NEW' | 'INPROGRESS' | 'CONVERTED_TO_OPPORTUNITY' | 'CLOSED';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  assigneeUserId: number | null;
  assigneeName: string | null;
  convertedToOpportunity: boolean;
  internalNotes: string | null;
  onlineMtgLink: string | null;
  onlineMtgDateTime: string | null; // Format: "YYYY/MM/DD HH:MM"
  communicationLogs: CommunicationLog[];
}

interface CommunicationLog {
  id: number;
  message: string;
  createdAt: string; // Format: "YYYY/MM/DD HH:MM"
  createdBy: number; // User ID
  createdByName: string; // User's full name
}

interface UpdateContactRequest {
  requestType?: 'PROJECT' | 'HIRING' | 'CONSULTATION';
  priority?: 'NORMAL' | 'HIGH' | 'URGENT';
  assigneeUserId?: number;
  status?: 'NEW' | 'INPROGRESS' | 'CONVERTED_TO_OPPORTUNITY' | 'CLOSED';
  internalNotes?: string;
  onlineMtgLink?: string;
  onlineMtgDateTime?: string;
}

interface CreateCommunicationLogRequest {
  message: string;
}

// User role types
type SalesRole = 'SALES_MANAGER' | 'SALES_REP';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: SalesRole;
}
```

### Backend Requirements

```java
// Sales Contact Detail Controller
@RestController
@RequestMapping("/api/sales/contacts")
@PreAuthorize("hasAnyRole('SALES_MANAGER', 'SALES_REP')")
public class SalesContactDetailController {
    
    @Autowired
    private SalesContactDetailService contactDetailService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ContactDetailDTO> getContactDetail(
        @PathVariable Long id,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        ContactDetailDTO contact = contactDetailService.getContactDetail(id, currentUser);
        return ResponseEntity.ok(contact);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ContactDetailDTO> updateContact(
        @PathVariable Long id,
        @RequestBody UpdateContactRequest request,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        ContactDetailDTO contact = contactDetailService.updateContact(id, request, currentUser);
        return ResponseEntity.ok(contact);
    }
    
    @PostMapping("/{id}/convert-to-opportunity")
    public ResponseEntity<ContactDetailDTO> convertToOpportunity(
        @PathVariable Long id,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        ContactDetailDTO contact = contactDetailService.convertToOpportunity(id, currentUser);
        return ResponseEntity.ok(contact);
    }
    
    @PostMapping("/{id}/communication-logs")
    public ResponseEntity<CommunicationLogDTO> addCommunicationLog(
        @PathVariable Long id,
        @RequestBody CreateCommunicationLogRequest request,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        CommunicationLogDTO log = contactDetailService.addCommunicationLog(id, request, currentUser);
        return ResponseEntity.ok(log);
    }
    
    @PostMapping("/{id}/send-mtg-email")
    public ResponseEntity<Void> sendMeetingEmail(
        @PathVariable Long id,
        Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        contactDetailService.sendMeetingEmail(id, currentUser);
        return ResponseEntity.ok().build();
    }
}

// Sales Contact Detail Service with Role-Based Logic
@Service
public class SalesContactDetailService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CommunicationLogRepository communicationLogRepository;
    
    @Autowired
    private EmailService emailService;
    
    public ContactDetailDTO getContactDetail(Long id, User currentUser) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact not found"));
        
        // Authorization check
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (contact.getAssigneeUserId() == null || 
                !contact.getAssigneeUserId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only view contacts assigned to you");
            }
        }
        
        return convertToDetailDTO(contact);
    }
    
    public ContactDetailDTO updateContact(Long id, UpdateContactRequest request, User currentUser) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact not found"));
        
        // Role-based field update authorization
        if (currentUser.getRole() == SalesRole.SALES_MANAGER) {
            // Sales Manager can only update: requestType, priority, assigneeUserId
            if (request.getRequestType() != null) {
                contact.setRequestType(request.getRequestType());
            }
            if (request.getPriority() != null) {
                contact.setPriority(request.getPriority());
            }
            if (request.getAssigneeUserId() != null) {
                // Sales Manager can assign to themselves
                User assignee = userRepository.findById(request.getAssigneeUserId())
                    .orElseThrow(() -> new EntityNotFoundException("Assignee not found"));
                contact.setAssigneeUserId(request.getAssigneeUserId());
            }
        } else if (currentUser.getRole() == SalesRole.SALES_REP) {
            // Sales Man can only update if assigned to them
            if (contact.getAssigneeUserId() == null || 
                !contact.getAssigneeUserId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only edit contacts assigned to you");
            }
            
            // Sales Man can only update: status, internalNotes, onlineMtgLink, onlineMtgDateTime
            if (request.getStatus() != null) {
                contact.setStatus(request.getStatus());
            }
            if (request.getInternalNotes() != null) {
                contact.setInternalNotes(request.getInternalNotes());
            }
            if (request.getOnlineMtgLink() != null) {
                contact.setOnlineMtgLink(request.getOnlineMtgLink());
            }
            if (request.getOnlineMtgDateTime() != null) {
                contact.setOnlineMtgDateTime(request.getOnlineMtgDateTime());
            }
        }
        
        contact = contactRepository.save(contact);
        return convertToDetailDTO(contact);
    }
    
    public ContactDetailDTO convertToOpportunity(Long id, User currentUser) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact not found"));
        
        // Only assigned Sales Man can convert
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (contact.getAssigneeUserId() == null || 
                !contact.getAssigneeUserId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only convert contacts assigned to you");
            }
        } else {
            throw new AccessDeniedException("Only assigned Sales Man can convert contact to opportunity");
        }
        
        contact.setStatus("CONVERTED_TO_OPPORTUNITY");
        contact.setConvertedToOpportunity(true);
        contact = contactRepository.save(contact);
        
        return convertToDetailDTO(contact);
    }
    
    public CommunicationLogDTO addCommunicationLog(Long id, CreateCommunicationLogRequest request, User currentUser) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact not found"));
        
        // Only assigned Sales Man can add logs
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (contact.getAssigneeUserId() == null || 
                !contact.getAssigneeUserId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only add logs to contacts assigned to you");
            }
        } else {
            throw new AccessDeniedException("Only assigned Sales Man can add communication logs");
        }
        
        CommunicationLog log = new CommunicationLog();
        log.setContactId(contact.getId());
        log.setMessage(request.getMessage());
        log.setCreatedBy(currentUser.getId());
        log.setCreatedAt(LocalDateTime.now());
        
        log = communicationLogRepository.save(log);
        return convertToLogDTO(log);
    }
    
    public void sendMeetingEmail(Long id, User currentUser) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact not found"));
        
        // Only assigned Sales Man can send meeting email
        if (currentUser.getRole() == SalesRole.SALES_REP) {
            if (contact.getAssigneeUserId() == null || 
                !contact.getAssigneeUserId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only send meeting emails for contacts assigned to you");
            }
        } else {
            throw new AccessDeniedException("Only assigned Sales Man can send meeting emails");
        }
        
        if (contact.getOnlineMtgLink() == null || contact.getOnlineMtgDateTime() == null) {
            throw new BadRequestException("Online meeting link and date-time must be set before sending email");
        }
        
        // Send email to client with meeting details
        emailService.sendMeetingInvitation(
            contact.getEmail(),
            contact.getClientName(),
            contact.getOnlineMtgLink(),
            contact.getOnlineMtgDateTime()
        );
    }
}
```

### Database Schema

```sql
-- Contacts table (existing, with additional fields)
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., "CC-2025-003"
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    client_company VARCHAR(255),
    consultation_request TEXT,
    request_type VARCHAR(32) DEFAULT 'CONSULTATION', -- PROJECT, HIRING, CONSULTATION
    status VARCHAR(32) DEFAULT 'NEW', -- NEW, INPROGRESS, CONVERTED_TO_OPPORTUNITY, CLOSED
    priority VARCHAR(32) DEFAULT 'NORMAL', -- NORMAL, HIGH, URGENT
    assignee_user_id INT, -- Foreign key to users table (Sales Man assigned)
    converted_to_opportunity BOOLEAN DEFAULT false,
    internal_notes TEXT,
    online_mtg_link VARCHAR(500),
    online_mtg_date_time DATETIME,
    date_received TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_contact_id (contact_id),
    INDEX idx_status (status),
    INDEX idx_assignee_user_id (assignee_user_id),
    INDEX idx_request_type (request_type),
    FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Communication Logs table
CREATE TABLE communication_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    message TEXT NOT NULL,
    created_by INT NOT NULL, -- User ID who created the log
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contact_id (contact_id),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Users table (existing, with role)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(32) DEFAULT 'CLIENT', -- CLIENT, SALES_MANAGER, SALES_REP, ADMIN
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_email (email)
);
```

## Implementation Guidelines

### Frontend Implementation

```typescript
// Sales Contact Detail Page Component
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Save, X, Grid, Mail, FileText, User } from 'lucide-react';

export default function SalesContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;
  const { user, token, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateContactRequest>({});
  const [newLogMessage, setNewLogMessage] = useState('');
  const [showAddLog, setShowAddLog] = useState(false);

  // Check if user is assigned to this contact
  const isAssigned = contact?.assigneeUserId === user?.id;
  const isSalesManager = user?.role === 'SALES_MANAGER';

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchContactDetail();
      if (isSalesManager) {
        fetchSalesMen();
      }
    }
  }, [contactId, isAuthenticated, token]);

  const fetchSalesMen = async () => {
    try {
      const response = await fetch('/api/sales/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSalesMen(data.filter((user: User) => 
          user.role === 'SALES_MANAGER' || user.role === 'SALES_REP'
        ));
      }
    } catch (error) {
      console.error('Error fetching sales men:', error);
    }
  };

  const fetchContactDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sales/contacts/${contactId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contact detail');
      }

      const data: ContactDetail = await response.json();
      setContact(data);
      setFormData({
        requestType: data.requestType,
        priority: data.priority,
        assigneeUserId: data.assigneeUserId,
        status: data.status,
        internalNotes: data.internalNotes,
        onlineMtgLink: data.onlineMtgLink,
        onlineMtgDateTime: data.onlineMtgDateTime,
      });
    } catch (error) {
      console.error('Error fetching contact detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/sales/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save contact');
      }

      // Refresh contact data
      await fetchContactDetail();
      alert(t('sales.contactDetail.saveSuccess'));
    } catch (error) {
      console.error('Error saving contact:', error);
      alert(t('sales.contactDetail.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToOpportunity = async () => {
    if (!confirm(t('sales.contactDetail.convertConfirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/sales/contacts/${contactId}/convert-to-opportunity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to convert to opportunity');
      }

      await fetchContactDetail();
      alert(t('sales.contactDetail.convertSuccess'));
    } catch (error) {
      console.error('Error converting to opportunity:', error);
      alert(t('sales.contactDetail.convertError'));
    }
  };

  const handleAddLog = async () => {
    if (!newLogMessage.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/sales/contacts/${contactId}/communication-logs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newLogMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to add log');
      }

      setNewLogMessage('');
      setShowAddLog(false);
      await fetchContactDetail();
    } catch (error) {
      console.error('Error adding log:', error);
      alert(t('sales.contactDetail.addLogError'));
    }
  };

  const handleSendMtgEmail = async () => {
    try {
      const response = await fetch(`/api/sales/contacts/${contactId}/send-mtg-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send meeting email');
      }

      alert(t('sales.contactDetail.emailSent'));
    } catch (error) {
      console.error('Error sending email:', error);
      alert(t('sales.contactDetail.emailError'));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!contact) {
    return <div>Contact not found</div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar - same as contact list */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 bg-gray-800 text-white">
          <h1 className="text-xl font-bold">SKILL BRIDGE</h1>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/sales/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-100">
            <Grid className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a href="/sales/contacts" className="flex items-center gap-2 p-2 bg-blue-50 text-blue-600 font-medium">
            <Mail className="w-5 h-5" />
            <span>Opportunities</span>
          </a>
          <a href="/sales/contracts" className="flex items-center gap-2 p-2 hover:bg-gray-100">
            <FileText className="w-5 h-5" />
            <span>Contract</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm">SKILL BRIDGE</span>
            <span className="text-xl font-semibold">Contact management</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{user?.fullName || 'Admin'}</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-white">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <a href="/sales/contacts" className="text-blue-600 hover:underline">
              Contact Management
            </a>
            <span className="mx-2">/</span>
            <span>Consultation Contact</span>
          </div>

          {/* Page Title */}
          <h1 className="text-2xl font-bold mb-6">Contact Detail</h1>

          {/* Contact Info Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Contact Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Contact ID</label>
                <p className="text-base font-medium">{contact.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Date Received</label>
                <p className="text-base font-medium">{contact.dateReceived}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Client Name</label>
                <p className="text-base font-medium">{contact.clientName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-base font-medium">{contact.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <p className="text-base font-medium">{contact.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Client Company</label>
                <p className="text-base font-medium">{contact.clientCompany || '-'}</p>
              </div>
            </div>
          </div>

          {/* Consultation Request Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Consultation Request</h2>
            <Textarea
              value={contact.consultationRequest}
              readOnly
              className="min-h-[100px]"
            />
          </div>

          {/* Classification Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Classification</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Request Type</label>
                <Select
                  value={formData.requestType}
                  onValueChange={(value) => setFormData({ ...formData, requestType: value as any })}
                  disabled={!isSalesManager}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROJECT">Project</SelectItem>
                    <SelectItem value="HIRING">Hiring</SelectItem>
                    <SelectItem value="CONSULTATION">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  disabled={!isAssigned}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="INPROGRESS">Inprogress</SelectItem>
                    <SelectItem value="CONVERTED_TO_OPPORTUNITY">Converted to Opportunity</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                  disabled={!isSalesManager}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Assignee</label>
                <Select
                  value={formData.assigneeUserId?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, assigneeUserId: parseInt(value) })}
                  disabled={!isSalesManager}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Load list of Sales Men from API */}
                    {salesMen.map((salesMan) => (
                      <SelectItem key={salesMan.id} value={salesMan.id.toString()}>
                        {salesMan.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Converted to Opportunity Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <label className="text-sm text-gray-600">Converted to Opportunity</label>
            <p className="text-base font-medium">
              {contact.convertedToOpportunity ? 'Converted' : 'Not yet'}
            </p>
          </div>

          {/* Internal Notes Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <label className="text-sm text-gray-600 mb-2 block">Internal Notes</label>
            <Textarea
              value={formData.internalNotes || ''}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
              disabled={!isAssigned}
              className="min-h-[100px]"
            />
          </div>

          {/* Communication Status Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Communication Status</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Online MTG Link</label>
                <Input
                  value={formData.onlineMtgLink || ''}
                  onChange={(e) => setFormData({ ...formData, onlineMtgLink: e.target.value })}
                  disabled={!isAssigned}
                  placeholder="zoom.us/123124541141"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Online MTG Date time</label>
                <Input
                  type="datetime-local"
                  value={formData.onlineMtgDateTime || ''}
                  onChange={(e) => setFormData({ ...formData, onlineMtgDateTime: e.target.value })}
                  disabled={!isAssigned}
                />
              </div>
              <Button
                onClick={handleSendMtgEmail}
                disabled={!isAssigned || !formData.onlineMtgLink || !formData.onlineMtgDateTime}
              >
                Send Mail for MTG
              </Button>
            </div>
          </div>

          {/* Communication Log Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Communication Log</h2>
              {isAssigned && (
                <Button
                  variant="outline"
                  onClick={() => setShowAddLog(!showAddLog)}
                >
                  +Add Log
                </Button>
              )}
            </div>
            {showAddLog && isAssigned && (
              <div className="mb-4">
                <Textarea
                  value={newLogMessage}
                  onChange={(e) => setNewLogMessage(e.target.value)}
                  placeholder="Enter log message..."
                  className="mb-2"
                />
                <Button onClick={handleAddLog}>Add</Button>
              </div>
            )}
            <div className="space-y-2">
              {contact.communicationLogs.length === 0 ? (
                <p className="text-gray-500">No communication logs yet</p>
              ) : (
                contact.communicationLogs.map((log) => (
                  <div key={log.id} className="border-b pb-2">
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-gray-500">
                      {log.createdAt} by {log.createdByName}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.push('/sales/contacts')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save contact'}
            </Button>
            {isAssigned && (
              <Button
                onClick={handleConvertToOpportunity}
                disabled={contact.convertedToOpportunity}
              >
                Converted to Opportunity
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
```

## Testing Requirements

### Unit Tests
- [ ] Contact detail component renders correctly
- [ ] Field editability based on user role and assignment
- [ ] Sales Manager can edit Classification fields
- [ ] Assigned Sales Man can edit Status, Internal Notes, Online MTG fields
- [ ] Non-assigned Sales Man cannot edit any fields
- [ ] Add log functionality works for assigned Sales Man
- [ ] Convert to opportunity button visibility based on assignment

### Integration Tests
- [ ] Get contact detail API with authorization check
- [ ] Update contact API with role-based field validation
- [ ] Sales Manager can update Request Type, Priority, Assignee
- [ ] Sales Manager can assign to themselves
- [ ] Assigned Sales Man can update Status, Internal Notes, Online MTG fields
- [ ] Non-assigned Sales Man cannot update any fields (403 error)
- [ ] Add communication log API with authorization check
- [ ] Convert to opportunity API with authorization check
- [ ] Send meeting email API with authorization check

### End-to-End Tests
- [ ] Sales Manager can view and edit Classification fields
- [ ] Sales Manager can assign contact to themselves
- [ ] Assigned Sales Man can view and edit assigned fields
- [ ] Assigned Sales Man can add communication logs
- [ ] Assigned Sales Man can convert to opportunity
- [ ] Assigned Sales Man can send meeting email
- [ ] Non-assigned Sales Man cannot edit any fields
- [ ] Save contact functionality works correctly
- [ ] Authorization errors display correctly

## Performance Requirements

### Performance Metrics
- **Page Load Time**: < 2 seconds
- **Save Response Time**: < 1 second
- **Add Log Response Time**: < 500ms
- **Convert to Opportunity Response Time**: < 1 second

## Security Considerations

### Security Requirements
- [ ] Role-based access control enforced at API level
- [ ] Field-level authorization checks on all update operations
- [ ] Sales Man cannot edit fields they don't have permission for
- [ ] Sales Manager cannot edit fields they don't have permission for
- [ ] Input validation on all editable fields
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection on all user inputs
- [ ] HTTPS required for all API requests

## Definition of Done

### Development Complete
- [ ] Sales contact detail page implemented matching wireframe
- [ ] Role-based field editability implemented
- [ ] Sales Manager can edit Classification fields
- [ ] Sales Manager can assign to themselves
- [ ] Assigned Sales Man can edit Status, Internal Notes, Online MTG fields
- [ ] Communication log functionality implemented
- [ ] Convert to opportunity functionality implemented
- [ ] Send meeting email functionality implemented
- [ ] Authorization checks implemented
- [ ] Responsive design implemented

### Testing Complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Security tests completed
- [ ] Cross-browser testing completed
- [ ] Role-based permissions tested thoroughly

### Documentation Complete
- [ ] API documentation updated
- [ ] Technical documentation updated
- [ ] User guide updated (if applicable)
- [ ] Deployment guide updated

## Dependencies

### External Dependencies
- **Next.js 14+**: Frontend framework
- **React 18+**: UI library
- **Spring Boot**: Backend framework
- **Spring Security**: Authentication and authorization
- **JPA/Hibernate**: Database access
- **Email Service**: For sending meeting invitations

### Internal Dependencies
- **User Entity**: Existing user table with role field
- **Contact Entity**: Contact table with all required fields
- **CommunicationLog Entity**: Communication logs table
- **AuthContext**: Authentication context for sales users
- **LanguageContext**: Multi-language support (if applicable)

## Risks and Mitigation

### Technical Risks
- **Complex Authorization Logic**: Multiple role-based permissions for different fields
  - *Mitigation*: Clear authorization checks at both frontend and backend, comprehensive testing
- **Data Consistency**: Multiple users editing different fields simultaneously
  - *Mitigation*: Optimistic locking, clear error messages, refresh after save

### Business Risks
- **User Confusion**: Complex permission rules may confuse users
  - *Mitigation*: Clear UI indicators (disabled fields), tooltips, user testing
- **Data Privacy**: Wrong users accessing contacts
  - *Mitigation*: Thorough testing, authorization checks at multiple levels

---

**Story Status**: Draft  
**Assigned To**: Backend & Frontend Teams  
**Estimated Effort**: 13 Story Points  
**Target Sprint**: Sprint 6

