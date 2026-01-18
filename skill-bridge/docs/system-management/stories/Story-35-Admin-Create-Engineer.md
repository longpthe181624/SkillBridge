# User Story: Admin Create Engineer

## Story Information
- **Story ID**: Story-35
- **Title**: Admin Create Engineer
- **Epic**: Admin Portal - Engineer Management
- **Priority**: High
- **Story Points**: 21
- **Sprint**: Sprint 9
- **Status**: Draft

## User Story

**As an** Admin  
**I want to** create new engineer profiles with comprehensive information including personal details, professional experience, skills, languages, certificates, and avatar  
**So that** I can register engineers into the system with complete profiles for matching, search, and client engagement

## Background & Context

### Create Engineer Purpose
Creating comprehensive engineer profiles is essential for the SkillBridge platform to:
- Register engineers with complete personal and professional information
- Support accurate skill matching and search functionality
- Enable proper profile display for clients
- Track certifications and qualifications
- Manage engineer availability and preferences

### Current Database Schema
The `engineers` table has the following structure:
- `id`: Primary key (INT)
- `full_name`: Engineer full name (VARCHAR 255)
- `years_experience`: Years of experience (INT)
- `seniority`: Seniority level (VARCHAR 32) - e.g., Junior, Mid-level, Senior, Lead
- `summary`: Engineer summary (TEXT, nullable)
- `introduction`: Engineer introduction (TEXT, nullable)
- `location`: Location (VARCHAR 128, nullable)
- `language_summary`: Language summary (VARCHAR 64, nullable)
- `status`: Engineer status (VARCHAR 32) - e.g., AVAILABLE, BUSY, UNAVAILABLE
- `profile_image_url`: Profile image URL (VARCHAR 500, nullable)
- `salary_expectation`: Salary expectation (DECIMAL 10,2, nullable)
- `primary_skill`: Primary skill (VARCHAR 128, nullable)
- `created_at`: Creation timestamp (TIMESTAMP)
- `updated_at`: Last update timestamp (TIMESTAMP)

### Additional Fields Needed
Based on the wireframe, the following fields need to be added to the `engineers` table:
- `email`: Email address (VARCHAR 255, nullable, unique)
- `phone`: Phone number (VARCHAR 20, nullable)
- `gender`: Gender (VARCHAR 16, nullable) - e.g., Male, Female, Other
- `date_of_birth` (DOB): Date of birth (DATE, nullable)
- `interested_in_japan`: Interested in working in Japan (BOOLEAN, nullable)

### Related Tables
- **Certificates Table**: Already exists (`certificates` table)
  - `id`: Primary key (INT)
  - `engineer_id`: Reference to engineer (INT)
  - `name`: Certificate name (VARCHAR 255)
  - `issued_by`: Issuer name (VARCHAR 255, nullable)
  - `issued_date`: Issued date (DATE, nullable)
  - `expiry_date`: Expiry date (DATE, nullable)
  - `created_at`: Creation timestamp (TIMESTAMP)
  - `updated_at`: Last update timestamp (TIMESTAMP)

- **Engineer Skills Table**: Already exists (`engineer_skills` table)
  - `engineer_id`: Reference to engineer (INT)
  - `skill_id`: Reference to skill (INT)
  - `level`: Skill level (VARCHAR 32) - e.g., Beginner, Intermediate, Advanced
  - `years`: Years of experience with this skill (INT)

- **Project Types Table**: Already exists (`project_types` table)
  - Used for Project Type experience selection

## Acceptance Criteria

### Primary Acceptance Criteria

#### Page Layout (Based on Wireframe)

- [ ] **Left Sidebar**:
  - [ ] "SKILL BRIDGE" logo/title at the top of sidebar
  - [ ] Navigation menu items:
    - [ ] "Dashboard" with grid icon
    - [ ] "User" with user icon
    - [ ] "Engineer" with group icon (highlighted/active when on this page)
    - [ ] "Master Data" with folder icon (expandable)
      - [ ] "Skill"
      - [ ] "Project Types"
  - [ ] Sidebar has dark gray background
  - [ ] Active menu item is highlighted in blue

- [ ] **Top Header Bar**:
  - [ ] Header bar has dark gray background
  - [ ] "SKILL BRIDGE" displayed on the left in white text
  - [ ] User information displayed on the right:
    - [ ] User icon/avatar
    - [ ] "Admin" label or actual admin name
  - [ ] Language switcher in header (optional)

- [ ] **Main Content Area**:
  - [ ] White background area occupying remaining screen space
  - [ ] Content is properly spaced from sidebar and header
  - [ ] Breadcrumbs displayed at top: "Engineer Management > Add new Engineer"
  - [ ] Page title "Add engineer" displayed prominently
  - [ ] Form sections organized in collapsible or sequential sections
  - [ ] Responsive layout for different screen sizes

#### Breadcrumbs

- [ ] **Breadcrumb Navigation**:
  - [ ] Display: "Engineer Management > Add new Engineer"
  - [ ] "Engineer Management" is clickable and links to engineer list page
  - [ ] "Add new Engineer" is current page (not clickable)
  - [ ] Breadcrumbs are styled consistently

#### Form Sections

The form is divided into multiple sections:

##### 1. Basic Info Section

- [ ] **Full name Field**:
  - [ ] Label: "Full name"
  - [ ] Input type: Text
  - [ ] Placeholder: "nguyen van A" (example)
  - [ ] Required validation
  - [ ] Max length: 255 characters

- [ ] **Email Field**:
  - [ ] Label: "Email"
  - [ ] Input type: Email
  - [ ] Placeholder: "abc@gmail.com" (example)
  - [ ] Required validation
  - [ ] Email format validation
  - [ ] Unique email validation (check if email already exists)
  - [ ] Max length: 255 characters

- [ ] **Phone Field**:
  - [ ] Label: "Phone"
  - [ ] Input type: Tel
  - [ ] Placeholder: "123456789" (example)
  - [ ] Optional field
  - [ ] Phone format validation (optional)
  - [ ] Max length: 20 characters

- [ ] **Gender Field**:
  - [ ] Label: "Gender"
  - [ ] Input type: Dropdown/Select
  - [ ] Options: "Male", "Female", "Other"
  - [ ] Default value: None (or first option)
  - [ ] Optional field

- [ ] **DOB (Date of Birth) Field**:
  - [ ] Label: "DOB"
  - [ ] Input type: Date picker
  - [ ] Placeholder or example: "1995/02/22"
  - [ ] Calendar icon displayed
  - [ ] Date format: YYYY/MM/DD or YYYY-MM-DD
  - [ ] Optional field
  - [ ] Validation: Date should not be in the future

- [ ] **Level Field**:
  - [ ] Label: "Level"
  - [ ] Input type: Dropdown/Select
  - [ ] Options: "Junior", "Mid-level", "Senior", "Lead" (mapped to seniority)
  - [ ] Required validation
  - [ ] Default value: None (or "Mid-level")

- [ ] **Introduce Field**:
  - [ ] Label: "Introduce"
  - [ ] Input type: Textarea (multi-line)
  - [ ] Placeholder: "Lorem Ipsum is simply dummy text" (example)
  - [ ] Optional field
  - [ ] Supports multi-line text
  - [ ] Maps to `introduction` field in database

##### 2. Professional Info Section

- [ ] **Year Of Experience Field**:
  - [ ] Label: "Year Of Experience"
  - [ ] Input type: Number
  - [ ] Placeholder: "6" (example)
  - [ ] Required validation
  - [ ] Min value: 0
  - [ ] Max value: 100
  - [ ] Maps to `years_experience` field in database

- [ ] **Primary Skills Field**:
  - [ ] Label: "Primary Skills"
  - [ ] Input type: Text or Multi-select
  - [ ] Placeholder: "Backend, Cloud" (example)
  - [ ] Optional field
  - [ ] Supports comma-separated values or multiple selections
  - [ ] Maps to `primary_skill` field in database (comma-separated string)
  - [ ] Or can be used to select multiple skills from skills table

- [ ] **Other Skill Field**:
  - [ ] Label: "Other Skill"
  - [ ] Input type: Multi-select dropdown
  - [ ] Options: Skills from `skills` table (e.g., "Python(Django)", "Java(Spring Boots)")
  - [ ] Display format: "Skill Name (Sub-skill)" if applicable
  - [ ] Supports multiple selections
  - [ ] Optional field
  - [ ] Creates entries in `engineer_skills` table

- [ ] **Project Type experience Field**:
  - [ ] Label: "Project Type experience"
  - [ ] Input type: Multi-select dropdown
  - [ ] Options: Project types from `project_types` table (e.g., "Game Development", "Healthcare/Medical")
  - [ ] Supports multiple selections
  - [ ] Optional field
  - [ ] Note: This may require a new junction table `engineer_project_types` or store as comma-separated string

##### 3. Foreign Language Summary Section

- [ ] **Foreign Language summary Field**:
  - [ ] Label: "Foreign Language summary"
  - [ ] Input type: Textarea (multi-line)
  - [ ] Placeholder: "English (Fluent), Japanese (Basic)" (example)
  - [ ] Optional field
  - [ ] Supports multi-line text
  - [ ] Maps to `language_summary` field in database

##### 4. Other Section

- [ ] **Salary Expectation Field**:
  - [ ] Label: "Salary Expectation"
  - [ ] Input type: Number with currency
  - [ ] Placeholder: "¥35,0000" or "¥3,500,000" (example)
  - [ ] Currency symbol: ¥ (Japanese Yen)
  - [ ] Optional field
  - [ ] Min value: 0
  - [ ] Max value: 999999999.99
  - [ ] Format: Japanese Yen format with thousand separators
  - [ ] Maps to `salary_expectation` field in database

- [ ] **Interested in Working in Japan Field**:
  - [ ] Label: "Interested in Working in Japan"
  - [ ] Input type: Dropdown/Select
  - [ ] Options: "Yes", "No", "Maybe" (or just "Yes", "No")
  - [ ] Optional field
  - [ ] Default value: None (or "No")
  - [ ] Maps to `interested_in_japan` field in database (BOOLEAN)

##### 5. Certificate Section

- [ ] **Certificate Form Fields**:
  - [ ] **Certificate Name**: Text input, placeholder: "eg. AWS Certified Cloud Practitioner"
  - [ ] **Issued by**: Text input, placeholder: "eg. Amazon Web Service"
  - [ ] **Issued date**: Date picker with calendar icon, example: "2020/02/22"
  - [ ] **Expiry_date**: Date picker with calendar icon, example: "2020/02/22"
  - [ ] All certificate fields are optional
  - [ ] Date validation: Issued date should not be in the future
  - [ ] Date validation: Expiry date should be after issued date (if both provided)

- [ ] **Add Certificate Button**:
  - [ ] Button labeled "+" or "Add Certificate"
  - [ ] Blue button with white plus icon
  - [ ] Located below certificate fields
  - [ ] Clicking button adds a new set of certificate fields
  - [ ] Supports adding multiple certificates
  - [ ] Each certificate entry can be removed individually (with remove/delete icon)

- [ ] **Certificate List**:
  - [ ] Display all added certificates in a list or table format
  - [ ] Each certificate row shows: Certificate Name, Issued by, Issued date, Expiry date
  - [ ] Remove/delete icon for each certificate
  - [ ] Minimum 0 certificates (can submit without certificates)

##### 6. Avatar Section

- [ ] **Avatar Upload Area**:
  - [ ] Large rectangular box with dashed border
  - [ ] Text displayed: "Click or Drag & Drop image here"
  - [ ] Supports click to select file
  - [ ] Supports drag and drop file upload
  - [ ] Image preview after upload
  - [ ] Supported formats: JPG, PNG, GIF, WEBP (or common image formats)
  - [ ] Max file size: 5MB (configurable)
  - [ ] Optional field
  - [ ] Uploaded image is stored (to cloud storage or server) and URL saved to `profile_image_url` field
  - [ ] Remove/delete image option

#### Action Buttons

- [ ] **Cancel Button**:
  - [ ] Button labeled "Cancel"
  - [ ] Grey outline, white background styling
  - [ ] Located at bottom of form on the left
  - [ ] Clicking cancel shows confirmation dialog if form has unsaved changes
  - [ ] Navigates back to engineer list page on confirm

- [ ] **Save Engineer Button**:
  - [ ] Button labeled "Save engineer"
  - [ ] Blue background, white text styling
  - [ ] Located at bottom of form on the right
  - [ ] Disabled state when form is invalid
  - [ ] Loading state during save operation ("Saving..." text)
  - [ ] On successful save: Shows success message and redirects to engineer list page
  - [ ] On error: Shows error message and keeps form open

#### Form Validation

- [ ] **Required Field Validation**:
  - [ ] Full name is required
  - [ ] Email is required
  - [ ] Year Of Experience is required
  - [ ] Level (Seniority) is required
  - [ ] All required fields show error messages when empty on submit

- [ ] **Format Validation**:
  - [ ] Email format validation
  - [ ] Phone format validation (if provided)
  - [ ] Date format validation
  - [ ] Date range validation (DOB not in future, expiry date after issued date)
  - [ ] Number range validation (Year Of Experience: 0-100, Salary: 0-999999999.99)

- [ ] **Business Rule Validation**:
  - [ ] Email must be unique (check if email already exists in database)
  - [ ] If email already exists, show error: "Email already exists. Please use a different email."
  - [ ] At least one certificate field (if certificate section is filled partially, validate all fields)

- [ ] **Real-time Validation**:
  - [ ] Show validation errors on blur (when user leaves field)
  - [ ] Show validation errors on submit if any field is invalid
  - [ ] Clear validation errors when user corrects the field

#### Form Behavior

- [ ] **Form State Management**:
  - [ ] Form maintains state during navigation (if user navigates away and comes back)
  - [ ] Auto-save draft functionality (optional - can be implemented in future story)
  - [ ] Handle browser back/forward buttons appropriately

- [ ] **Submit Behavior**:
  - [ ] Validate all fields before submission
  - [ ] Show loading indicator during save
  - [ ] Disable form fields during save
  - [ ] Handle network errors gracefully
  - [ ] Show success message on successful save
  - [ ] Redirect to engineer list page after successful save
  - [ ] Keep form open on error for user to correct

- [ ] **Cancel Behavior**:
  - [ ] Show confirmation dialog if form has changes
  - [ ] Confirmation message: "You have unsaved changes. Are you sure you want to cancel?"
  - [ ] Navigate to engineer list page on confirm
  - [ ] Do not show confirmation if form has no changes

### Detailed Acceptance Criteria

#### Database Schema Updates

- [ ] **Engineers Table Updates**:
  - [ ] Add `email` column: VARCHAR(255), nullable, unique
  - [ ] Add `phone` column: VARCHAR(20), nullable
  - [ ] Add `gender` column: VARCHAR(16), nullable
  - [ ] Add `date_of_birth` column: DATE, nullable
  - [ ] Add `interested_in_japan` column: BOOLEAN, nullable
  - [ ] Create migration script: `VXX__add_engineer_personal_fields.sql`

- [ ] **Engineer Project Types Relationship** (if needed):
  - [ ] Option 1: Create `engineer_project_types` junction table
    - [ ] `engineer_id`: Reference to engineer (INT)
    - [ ] `project_type_id`: Reference to project_type (INT)
    - [ ] Composite primary key: (engineer_id, project_type_id)
  - [ ] Option 2: Store as comma-separated string in `engineers` table
    - [ ] Add `project_type_experience` column: VARCHAR(500), nullable
  - [ ] **Decision**: Use Option 2 (comma-separated string) for simplicity, can be refactored to junction table in future if needed

#### Form Field Mapping

- [ ] **Field Mapping**:
  - [ ] Full name → `full_name`
  - [ ] Email → `email` (new field)
  - [ ] Phone → `phone` (new field)
  - [ ] Gender → `gender` (new field)
  - [ ] DOB → `date_of_birth` (new field)
  - [ ] Level → `seniority` (mapping: Junior, Mid-level, Senior, Lead)
  - [ ] Introduce → `introduction`
  - [ ] Year Of Experience → `years_experience`
  - [ ] Primary Skills → `primary_skill` (comma-separated string)
  - [ ] Other Skill → `engineer_skills` table (multiple entries)
  - [ ] Project Type experience → `project_type_experience` (new field, comma-separated string) or junction table
  - [ ] Foreign Language summary → `language_summary`
  - [ ] Salary Expectation → `salary_expectation`
  - [ ] Interested in Working in Japan → `interested_in_japan` (new field)
  - [ ] Certificates → `certificates` table (multiple entries)
  - [ ] Avatar → `profile_image_url` (upload image and save URL)

#### Skills Selection

- [ ] **Primary Skills**:
  - [ ] Can be entered as comma-separated text (e.g., "Backend, Cloud")
  - [ ] Or can be selected from skills dropdown (future enhancement)
  - [ ] Stored as comma-separated string in `primary_skill` field

- [ ] **Other Skills**:
  - [ ] Multi-select dropdown showing skills from `skills` table
  - [ ] Display format: "Parent Skill" or "Parent Skill > Sub-skill" for hierarchical skills
  - [ ] Each selected skill creates an entry in `engineer_skills` table
  - [ ] Level and years can be set to default values (or added in future enhancement)

#### Project Type Experience

- [ ] **Project Type Selection**:
  - [ ] Multi-select dropdown showing project types from `project_types` table
  - [ ] Selected project types are stored as comma-separated string: "Game Development, Healthcare/Medical"
  - [ ] Stored in new `project_type_experience` field (VARCHAR 500, nullable)

#### Certificate Management

- [ ] **Adding Certificates**:
  - [ ] User can add multiple certificates
  - [ ] Each certificate has: Name, Issued by, Issued date, Expiry date
  - [ ] All fields optional, but if any field is filled, all should be validated
  - [ ] Certificates are saved to `certificates` table with `engineer_id`

- [ ] **Removing Certificates**:
  - [ ] Each certificate row has a remove/delete button
  - [ ] Clicking remove removes the certificate from the list
  - [ ] Confirmation not required for removal (user can add it back if mistake)

#### Avatar/Image Upload

- [ ] **Image Upload Functionality**:
  - [ ] Supports drag and drop file upload
  - [ ] Supports click to select file from file picker
  - [ ] Image preview after upload
  - [ ] Supported formats: JPG, JPEG, PNG, GIF, WEBP
  - [ ] Max file size: 5MB
  - [ ] Image validation before upload
  - [ ] Upload to cloud storage (AWS S3, Cloudinary, etc.) or server storage
  - [ ] Save image URL to `profile_image_url` field
  - [ ] Error handling for upload failures

- [ ] **Image Preview**:
  - [ ] Show image thumbnail after upload
  - [ ] Remove image option (trash icon or "Remove" button)
  - [ ] Replace image option (click to upload different image)

#### Error Handling

- [ ] **Form Validation Errors**:
  - [ ] Display inline error messages below each field
  - [ ] Error messages are clear and helpful
  - [ ] Required fields: "This field is required"
  - [ ] Email format: "Please enter a valid email address"
  - [ ] Email unique: "Email already exists. Please use a different email."
  - [ ] Phone format: "Please enter a valid phone number"
  - [ ] Date validation: "Date cannot be in the future" or "Expiry date must be after issued date"

- [ ] **API Errors**:
  - [ ] Network error: "Network error. Please try again."
  - [ ] Server error: "An error occurred. Please try again later."
  - [ ] Validation error: Display backend validation error messages
  - [ ] Email already exists: "Email already exists. Please use a different email."

- [ ] **Image Upload Errors**:
  - [ ] File too large: "Image size must be less than 5MB"
  - [ ] Invalid format: "Please upload a valid image file (JPG, PNG, GIF, WEBP)"
  - [ ] Upload failed: "Failed to upload image. Please try again."

#### Success Feedback

- [ ] **Success Message**:
  - [ ] Success toast/notification: "Engineer created successfully"
  - [ ] Redirect to engineer list page after 2 seconds (or immediately)

- [ ] **Loading States**:
  - [ ] Show loading spinner during form submission
  - [ ] Disable form fields during save
  - [ ] Show "Saving..." text on Save button
  - [ ] Disable Cancel button during save

## Technical Requirements

### Frontend Requirements

#### Component Structure

- [ ] **Main Page Component**: `frontend/src/app/admin/engineer/new/page.tsx`
  - [ ] Imports AdminSidebar and AdminHeader components
  - [ ] Implements breadcrumb navigation
  - [ ] Manages form state and validation
  - [ ] Handles form submission and image upload
  - [ ] Manages certificate list (add/remove)

- [ ] **Form Sections**:
  - [ ] BasicInfoSection component (or inline in main component)
  - [ ] ProfessionalInfoSection component
  - [ ] ForeignLanguageSection component
  - [ ] OtherInfoSection component
  - [ ] CertificateSection component (with add/remove functionality)
  - [ ] AvatarSection component (with drag & drop upload)

#### State Management

- [ ] **React Hooks**:
  - [ ] `useState` for form data, errors, loading states, certificates list, image preview
  - [ ] `useEffect` for form initialization, validation, dirty state tracking
  - [ ] `useCallback` for memoized functions (handleSubmit, handleImageUpload, etc.)
  - [ ] `useRouter` for navigation

#### Form Data Structure

```typescript
interface CreateEngineerFormData {
  // Basic Info
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string; // YYYY-MM-DD format
  level: string; // Junior | Mid-level | Senior | Lead
  introduction?: string;

  // Professional Info
  yearsExperience: number;
  primarySkills?: string; // Comma-separated
  otherSkills?: number[]; // Array of skill IDs
  projectTypeExperience?: number[]; // Array of project type IDs

  // Foreign Language
  languageSummary?: string;

  // Other
  salaryExpectation?: number;
  interestedInJapan?: boolean;

  // Avatar
  profileImage?: File; // For upload
  profileImageUrl?: string; // After upload

  // Certificates
  certificates: CertificateFormData[];
}

interface CertificateFormData {
  name: string;
  issuedBy?: string;
  issuedDate?: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD
}
```

#### Image Upload

- [ ] **Upload Service**:
  - [ ] File validation (format, size)
  - [ ] Image preview generation
  - [ ] Upload to backend API endpoint (e.g., `/api/admin/engineers/upload-avatar`)
  - [ ] Handle upload progress (optional)
  - [ ] Return image URL after successful upload

#### API Integration

- [ ] **Service File**: Extend `frontend/src/services/adminEngineerService.ts`
  - [ ] `createEngineerWithDetails(request: CreateEngineerRequest): Promise<Engineer>`
  - [ ] `uploadAvatar(file: File): Promise<string>` (returns image URL)
  - [ ] `getSkills(): Promise<Skill[]>` (for Other Skills dropdown)
  - [ ] `getProjectTypes(): Promise<ProjectType[]>` (for Project Type dropdown)

#### Date Pickers

- [ ] **Date Picker Component**:
  - [ ] Use existing date picker component or library (e.g., react-datepicker, shadcn/ui DatePicker)
  - [ ] Format: YYYY/MM/DD or YYYY-MM-DD
  - [ ] Calendar icon displayed
  - [ ] Disable future dates for DOB
  - [ ] Min/Max date validation

#### Multi-select Dropdowns

- [ ] **Multi-select Components**:
  - [ ] Use existing multi-select component or library
  - [ ] For Other Skills: Show skills from skills table with hierarchy (Parent > Sub)
  - [ ] For Project Types: Show project types from project_types table
  - [ ] Display selected items as tags/chips
  - [ ] Remove individual selections

### Backend Requirements

#### REST API Endpoints

- [ ] **POST `/api/admin/engineers`** - Create new engineer with all details
  - [ ] Request body: `CreateEngineerRequest` (extended with new fields)
  - [ ] Response: `EngineerResponse` with created engineer
  - [ ] Validation: Validate all required fields and formats
  - [ ] Business logic: Check email uniqueness
  - [ ] Handle certificates creation (multiple entries)
  - [ ] Handle engineer_skills creation (if Other Skills selected)
  - [ ] Authentication: Requires ADMIN role
  - [ ] Authorization: Only ADMIN users can access

- [ ] **POST `/api/admin/engineers/upload-avatar`** - Upload engineer avatar image
  - [ ] Request: Multipart form data with image file
  - [ ] Response: Image URL string
  - [ ] File validation: Format, size
  - [ ] Upload to cloud storage or server
  - [ ] Return public URL for image
  - [ ] Authentication: Requires ADMIN role

- [ ] **GET `/api/admin/engineers/skills`** - Get all skills for dropdown (optional, if needed)
  - [ ] Response: List of skills with hierarchy information
  - [ ] Used for "Other Skill" dropdown

- [ ] **GET `/api/admin/master-data/project-types`** - Already exists, used for Project Type dropdown

#### Database Migrations

- [ ] **Migration Script**: `VXX__add_engineer_personal_fields.sql`
  - [ ] Add `email` column: VARCHAR(255) UNIQUE NULL
  - [ ] Add `phone` column: VARCHAR(20) NULL
  - [ ] Add `gender` column: VARCHAR(16) NULL
  - [ ] Add `date_of_birth` column: DATE NULL
  - [ ] Add `interested_in_japan` column: BOOLEAN NULL
  - [ ] Add `project_type_experience` column: VARCHAR(500) NULL
  - [ ] Create index on `email` for uniqueness and search performance

#### Entity Updates

- [ ] **Engineer Entity**: Update `Engineer.java`
  - [ ] Add new fields: email, phone, gender, dateOfBirth, interestedInJapan, projectTypeExperience
  - [ ] Add getters and setters
  - [ ] Update validation annotations if needed

#### DTOs

- [ ] **Request DTOs**: Update `CreateEngineerRequest.java`
  - [ ] Add fields: email, phone, gender, dateOfBirth, interestedInJapan, projectTypeExperience
  - [ ] Add nested `CertificateRequest` class or list
  - [ ] Add `otherSkills` list (array of skill IDs)
  - [ ] Validation annotations for all new fields

- [ ] **Response DTOs**: Update `EngineerResponseDTO.java`
  - [ ] Add new fields in response

#### Service

- [ ] **AdminEngineerService**: Update `createEngineer` method
  - [ ] Handle email uniqueness check
  - [ ] Create engineer with all fields
  - [ ] Create certificates (multiple entries)
  - [ ] Create engineer_skills entries (if Other Skills provided)
  - [ ] Handle transactions (all or nothing)

#### Controller

- [ ] **AdminEngineerController**: Update or create methods
  - [ ] Update `createEngineer` endpoint to handle extended request
  - [ ] Add `uploadAvatar` endpoint for image upload
  - [ ] Handle multipart file upload
  - [ ] Return image URL

### Database Requirements

#### Schema Updates

- [ ] **engineers Table**:
  - [ ] Add new columns as specified in migration script
  - [ ] Ensure email uniqueness constraint
  - [ ] Add indexes for performance

- [ ] **certificates Table**:
  - [ ] Already exists, no changes needed
  - [ ] Used for storing multiple certificates per engineer

- [ ] **engineer_skills Table**:
  - [ ] Already exists, no changes needed
  - [ ] Used for storing multiple skills per engineer

- [ ] **project_types Table**:
  - [ ] Already exists, no changes needed
  - [ ] Used for project type experience selection

## Implementation Guidelines

### Frontend Implementation

#### Form Component Structure

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/design-patterns/admin/AdminSidebar';
import AdminHeader from '@/components/design-patterns/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createEngineerWithDetails, uploadAvatar } from '@/services/adminEngineerService';

export default function CreateEngineerPage() {
  // Form state management
  // Certificate list management
  // Image upload handling
  // Form validation
  // Form submission
  // Navigation
}
```

#### Image Upload Implementation

```typescript
const handleImageUpload = async (file: File) => {
  // Validate file
  // Show preview
  // Upload to server
  // Get image URL
  // Update form data
};

const handleDragDrop = (e: React.DragEvent) => {
  // Handle drag and drop
  // Validate dropped files
  // Upload image
};
```

### Backend Implementation

#### Create Engineer Service

```java
@Service
public class AdminEngineerService {
    
    public EngineerResponseDTO createEngineerWithDetails(CreateEngineerRequest request) {
        // Validate email uniqueness
        // Create engineer entity
        // Create certificates
        // Create engineer_skills
        // Save and return
    }
}
```

## Testing Requirements

### Unit Tests

- [ ] **Frontend Unit Tests**:
  - [ ] Test form validation
  - [ ] Test certificate add/remove
  - [ ] Test image upload validation
  - [ ] Test form submission

- [ ] **Backend Unit Tests**:
  - [ ] Test service methods
  - [ ] Test email uniqueness validation
  - [ ] Test certificate creation
  - [ ] Test engineer_skills creation

### Integration Tests

- [ ] **API Integration Tests**:
  - [ ] Test POST /api/admin/engineers with all fields
  - [ ] Test email uniqueness validation
  - [ ] Test certificate creation
  - [ ] Test image upload endpoint

### End-to-End Tests

- [ ] **E2E Test Scenarios**:
  - [ ] User can fill all form fields
  - [ ] User can add multiple certificates
  - [ ] User can upload avatar image
  - [ ] User can submit form successfully
  - [ ] User sees validation errors for invalid fields
  - [ ] User sees error if email already exists

## Performance Requirements

- [ ] **Form Load Time**: Form should load within 1 second
- [ ] **Image Upload Time**: Image upload should complete within 5 seconds for files < 5MB
- [ ] **Form Submission Time**: Form submission should complete within 3 seconds
- [ ] **Dropdown Load Time**: Skills and Project Types dropdowns should load within 1 second

## Security Considerations

- [ ] **Authentication**: All endpoints require valid JWT token
- [ ] **Authorization**: Only ADMIN role can access endpoints
- [ ] **Input Validation**: All inputs are validated on both frontend and backend
- [ ] **File Upload Security**: Validate file types and sizes, scan for malware (if applicable)
- [ ] **Email Uniqueness**: Prevent duplicate emails in database
- [ ] **SQL Injection Prevention**: Use parameterized queries and JPA methods
- [ ] **XSS Prevention**: Sanitize user inputs before displaying

## Deployment Requirements

- [ ] **Environment Variables**: Configure image upload storage (AWS S3, Cloudinary, etc.)
- [ ] **Database Migration**: Run migration script to add new columns
- [ ] **File Storage**: Configure cloud storage or server storage for images
- [ ] **Error Logging**: Implement proper error logging and monitoring

## Definition of Done

- [ ] All acceptance criteria are met
- [ ] Database schema is updated with new fields
- [ ] Code is reviewed and approved
- [ ] Unit tests are written and passing
- [ ] Integration tests are written and passing
- [ ] E2E tests are written and passing
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile devices
- [ ] Image upload functionality is tested
- [ ] Form validation is working correctly
- [ ] Email uniqueness check is working

## Dependencies

### Internal Dependencies

- [ ] Story-34: Admin Engineer List Management (for navigation and list page)
- [ ] Story-32: Admin Master Data Skill Management (for skills dropdown)
- [ ] Story-33: Admin Master Data Project Type Management (for project types dropdown)
- [ ] Admin authentication system (already implemented)
- [ ] AdminSidebar component (already implemented)
- [ ] AdminHeader component (already implemented)
- [ ] Certificates table (already exists)

### External Dependencies

- [ ] React/Next.js for frontend
- [ ] Spring Boot for backend
- [ ] MySQL database
- [ ] Image upload library/service (AWS S3, Cloudinary, or local storage)
- [ ] Date picker component/library
- [ ] Multi-select dropdown component/library

## Risks and Mitigation

### Risks

1. **Complex Form with Many Fields**:
   - Risk: Form may be overwhelming for users, high chance of errors
   - Mitigation: Organize fields into clear sections, provide helpful placeholders, implement auto-save draft (future)

2. **Image Upload Complexity**:
   - Risk: Image upload may fail, storage issues
   - Mitigation: Implement proper error handling, retry mechanism, clear error messages

3. **Email Uniqueness Validation**:
   - Risk: Race condition when checking email uniqueness
   - Mitigation: Use database unique constraint, handle unique constraint violation gracefully

4. **Database Schema Changes**:
   - Risk: Migration may affect existing data
   - Mitigation: Test migration on staging environment, ensure backward compatibility

### Mitigation Strategies

- [ ] Implement comprehensive form validation
- [ ] Add auto-save draft functionality (optional for this story)
- [ ] Test image upload thoroughly with different file types and sizes
- [ ] Implement proper error handling and user feedback
- [ ] Use database transactions for data consistency

## Success Metrics

### Business Metrics

- [ ] Admin can create engineer profiles with all required information
- [ ] Zero data loss during engineer creation
- [ ] Form submission success rate > 95%

### Technical Metrics

- [ ] Form load time < 1 second
- [ ] Image upload success rate > 95%
- [ ] Form submission time < 3 seconds
- [ ] Zero critical bugs in production

## Future Enhancements

### Planned Improvements

- [ ] Auto-save draft functionality
- [ ] Skills autocomplete/search for Primary Skills field
- [ ] Rich text editor for Introduction field
- [ ] Bulk certificate import (CSV, Excel)
- [ ] Image cropping/resizing before upload
- [ ] Preview engineer profile before saving
- [ ] Refactor project_type_experience to use junction table
- [ ] Skills with levels and years in "Other Skills" selection

### Notes

- This story focuses on creating engineer profiles with comprehensive information
- Edit engineer functionality will be covered in a separate story (Story-36)
- Image upload can use cloud storage (AWS S3) or local storage depending on infrastructure
- Certificate and skills management can be enhanced in future stories

---

**Document Control**
- **Version**: 1.0
- **Last Updated**: December 2024
- **Next Review**: January 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

