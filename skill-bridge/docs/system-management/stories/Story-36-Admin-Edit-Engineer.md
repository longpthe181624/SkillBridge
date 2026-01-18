# User Story: Admin Edit Engineer

## Story Information
- **Story ID**: Story-36
- **Title**: Admin Edit Engineer
- **Epic**: Admin Portal - Engineer Management
- **Priority**: High
- **Story Points**: 18
- **Sprint**: Sprint 9
- **Status**: Draft

## User Story

**As an** Admin  
**I want to** edit existing engineer profiles with comprehensive information including personal details, professional experience, skills, languages, certificates, and avatar  
**So that** I can update engineer information when details change, correct errors, or add missing information to engineer profiles

## Background & Context

### Edit Engineer Purpose
Editing engineer profiles is essential for the SkillBridge platform to:
- Update engineer information when personal or professional details change
- Correct errors in existing engineer profiles
- Add missing information to engineer profiles
- Maintain accurate and up-to-date engineer data for matching and search functionality
- Update engineer availability, skills, and qualifications

### Current Database Schema
The `engineers` table has the following structure (from Story-35):
- `id`: Primary key (INT)
- `full_name`: Engineer full name (VARCHAR 255)
- `email`: Email address (VARCHAR 255, unique, nullable)
- `phone`: Phone number (VARCHAR 20, nullable)
- `gender`: Gender (VARCHAR 16, nullable)
- `date_of_birth`: Date of birth (DATE, nullable)
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
- `interested_in_japan`: Interested in working in Japan (BOOLEAN, nullable)
- `project_type_experience`: Project type experience (VARCHAR 500, nullable) - comma-separated string
- `created_at`: Creation timestamp (TIMESTAMP)
- `updated_at`: Last update timestamp (TIMESTAMP)

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
  - [ ] Breadcrumbs displayed at top: "Engineer Management > Edit Engineer"
  - [ ] Page title "Edit engineer" displayed prominently
  - [ ] Form sections organized in collapsible or sequential sections
  - [ ] Responsive layout for different screen sizes

#### Breadcrumbs

- [ ] **Breadcrumb Navigation**:
  - [ ] Display: "Engineer Management > Edit Engineer"
  - [ ] "Engineer Management" is clickable and links to engineer list page
  - [ ] "Edit Engineer" is current page (not clickable)
  - [ ] Breadcrumbs are styled consistently

#### Form Sections

The form is divided into multiple sections, similar to Create Engineer form, but all fields are pre-filled with existing engineer data:

##### 1. Basic Info Section

- [ ] **Full name Field**:
  - [ ] Label: "Full name"
  - [ ] Input type: Text
  - [ ] Pre-filled with existing engineer's full name (e.g., "nguyen van A")
  - [ ] Required validation
  - [ ] Max length: 255 characters

- [ ] **Email Field**:
  - [ ] Label: "Email"
  - [ ] Input type: Email
  - [ ] Pre-filled with existing engineer's email (e.g., "abc@gmail.com")
  - [ ] Required validation
  - [ ] Email format validation
  - [ ] Unique email validation (check if email already exists for other engineers)
  - [ ] Max length: 255 characters

- [ ] **Phone Field**:
  - [ ] Label: "Phone"
  - [ ] Input type: Tel
  - [ ] Pre-filled with existing engineer's phone (e.g., "123456789")
  - [ ] Optional field
  - [ ] Phone format validation (optional)
  - [ ] Max length: 20 characters

- [ ] **Gender Field**:
  - [ ] Label: "Gender"
  - [ ] Input type: Dropdown/Select
  - [ ] Options: "Male", "Female", "Other"
  - [ ] Pre-filled with existing engineer's gender
  - [ ] Optional field

- [ ] **DOB (Date of Birth) Field**:
  - [ ] Label: "DOB"
  - [ ] Input type: Date picker
  - [ ] Pre-filled with existing engineer's date of birth (e.g., "1995/02/22")
  - [ ] Calendar icon displayed
  - [ ] Date format: YYYY/MM/DD or YYYY-MM-DD
  - [ ] Optional field
  - [ ] Validation: Date should not be in the future

- [ ] **Level Field**:
  - [ ] Label: "Level"
  - [ ] Input type: Dropdown/Select
  - [ ] Options: "Junior", "Mid-level", "Senior", "Lead" (mapped to seniority)
  - [ ] Pre-filled with existing engineer's seniority/level (e.g., "Senior")
  - [ ] Required validation
  - [ ] Default value: None (or "Mid-level")

- [ ] **Introduce Field**:
  - [ ] Label: "Introduce"
  - [ ] Input type: Textarea (multi-line)
  - [ ] Pre-filled with existing engineer's introduction
  - [ ] Placeholder: "Lorem Ipsum is simply dummy text" (example)
  - [ ] Optional field
  - [ ] Supports multi-line text
  - [ ] Maps to `introduction` field in database

##### 2. Professional Info Section

- [ ] **Year Of Experience Field**:
  - [ ] Label: "Year Of Experience"
  - [ ] Input type: Number
  - [ ] Pre-filled with existing engineer's years of experience (e.g., "6")
  - [ ] Required validation
  - [ ] Min value: 0
  - [ ] Max value: 100
  - [ ] Maps to `years_experience` field in database

- [ ] **Primary Skills Field**:
  - [ ] Label: "Primary Skills"
  - [ ] Input type: Text or Multi-select
  - [ ] Pre-filled with existing engineer's primary skills (e.g., "Backend, Cloud")
  - [ ] Optional field
  - [ ] Supports comma-separated values or multiple selections
  - [ ] Maps to `primary_skill` field in database (comma-separated string)

- [ ] **Other Skill Field**:
  - [ ] Label: "Other Skill"
  - [ ] Input type: Multi-select dropdown
  - [ ] Options: Skills from `skills` table (e.g., "Python(Django)", "Java(Spring Boots)")
  - [ ] Pre-filled with existing engineer's other skills from `engineer_skills` table
  - [ ] Display format: "Skill Name (Sub-skill)" if applicable
  - [ ] Supports multiple selections
  - [ ] Optional field
  - [ ] Creates/updates entries in `engineer_skills` table

- [ ] **Project Type experience Field**:
  - [ ] Label: "Project Type experience"
  - [ ] Input type: Multi-select dropdown
  - [ ] Options: Project types from `project_types` table (e.g., "Game Development", "Healthcare/Medical")
  - [ ] Pre-filled with existing engineer's project type experience (comma-separated string)
  - [ ] Supports multiple selections
  - [ ] Optional field
  - [ ] Stored as comma-separated string in `project_type_experience` field

##### 3. Foreign Language Summary Section

- [ ] **Foreign Language summary Field**:
  - [ ] Label: "Foreign Language summary"
  - [ ] Input type: Textarea (multi-line)
  - [ ] Pre-filled with existing engineer's language summary (e.g., "English (Fluent), Japanese (Basic)")
  - [ ] Placeholder: "English (Fluent), Japanese (Basic)" (example)
  - [ ] Optional field
  - [ ] Supports multi-line text
  - [ ] Maps to `language_summary` field in database

##### 4. Other Section

- [ ] **Salary Expectation Field**:
  - [ ] Label: "Salary Expectation"
  - [ ] Input type: Number with currency
  - [ ] Pre-filled with existing engineer's salary expectation (e.g., "¥35,0000" or "¥3,500,000")
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
  - [ ] Pre-filled with existing engineer's interested_in_japan value
  - [ ] Optional field
  - [ ] Default value: None (or "No")
  - [ ] Maps to `interested_in_japan` field in database (BOOLEAN)

##### 5. Certificate Section

- [ ] **Certificate List**:
  - [ ] Display all existing certificates for the engineer
  - [ ] Each certificate row shows: Certificate Name, Issued by, Issued date, Expiry date
  - [ ] Edit icon/button for each certificate
  - [ ] Remove/delete icon for each certificate
  - [ ] Certificates are loaded from `certificates` table based on `engineer_id`

- [ ] **Certificate Form Fields** (for each certificate):
  - [ ] **Certificate Name**: Text input, pre-filled with certificate name (e.g., "AWS Certified Cloud Practitioner")
  - [ ] **Issued by**: Text input, pre-filled with issuer name (e.g., "Amazon Web Service")
  - [ ] **Issued date**: Date picker with calendar icon, pre-filled with issued date (e.g., "2020/02/22")
  - [ ] **Expiry_date**: Date picker with calendar icon, pre-filled with expiry date (e.g., "2020/02/22")
  - [ ] All certificate fields are editable
  - [ ] All certificate fields are optional
  - [ ] Date validation: Issued date should not be in the future
  - [ ] Date validation: Expiry date should be after issued date (if both provided)

- [ ] **Add Certificate Button**:
  - [ ] Button labeled "+" or "Add Certificate"
  - [ ] Blue button with white plus icon
  - [ ] Located below certificate list
  - [ ] Clicking button adds a new set of certificate fields
  - [ ] Supports adding multiple certificates
  - [ ] Each certificate entry can be removed individually (with remove/delete icon)

- [ ] **Certificate Management**:
  - [ ] User can add new certificates
  - [ ] User can edit existing certificates
  - [ ] User can remove existing certificates
  - [ ] Changes are saved when form is submitted
  - [ ] Minimum 0 certificates (can submit without certificates)

##### 6. Avatar Section

- [ ] **Avatar Display**:
  - [ ] If engineer has an existing avatar, display it
  - [ ] Show current avatar image with preview
  - [ ] Avatar image is loaded from `profile_image_url` field
  - [ ] Remove/delete image option

- [ ] **Avatar Upload Area**:
  - [ ] Large rectangular box with dashed border
  - [ ] Text displayed: "Click or Drag & Drop image here"
  - [ ] Supports click to select file
  - [ ] Supports drag and drop file upload
  - [ ] Image preview after upload (replaces existing image preview)
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
  - [ ] Email must be unique (check if email already exists for other engineers)
  - [ ] If email already exists for another engineer, show error: "Email already exists. Please use a different email."
  - [ ] At least one certificate field (if certificate section is filled partially, validate all fields)

- [ ] **Real-time Validation**:
  - [ ] Show validation errors on blur (when user leaves field)
  - [ ] Show validation errors on submit if any field is invalid
  - [ ] Clear validation errors when user corrects the field

#### Form Behavior

- [ ] **Form State Management**:
  - [ ] Form is pre-filled with existing engineer data on page load
  - [ ] Form maintains state during navigation (if user navigates away and comes back)
  - [ ] Track dirty state (form has unsaved changes)
  - [ ] Handle browser back/forward buttons appropriately

- [ ] **Data Loading**:
  - [ ] Load engineer data by ID from API endpoint
  - [ ] Load certificates for engineer from API endpoint
  - [ ] Load engineer skills from API endpoint
  - [ ] Show loading indicator while data is being loaded
  - [ ] Handle loading errors gracefully (show error message, redirect to list if engineer not found)

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

#### Database Schema

- [ ] **No Schema Changes Required**:
  - [ ] All required fields and tables already exist (from Story-35)
  - [ ] No new migrations needed for Edit Engineer functionality

#### Form Field Mapping

- [ ] **Field Mapping** (same as Create Engineer):
  - [ ] Full name → `full_name`
  - [ ] Email → `email` (with uniqueness check excluding current engineer)
  - [ ] Phone → `phone`
  - [ ] Gender → `gender`
  - [ ] DOB → `date_of_birth`
  - [ ] Level → `seniority` (mapping: Junior, Mid-level, Senior, Lead)
  - [ ] Introduce → `introduction`
  - [ ] Year Of Experience → `years_experience`
  - [ ] Primary Skills → `primary_skill` (comma-separated string)
  - [ ] Other Skill → `engineer_skills` table (multiple entries - update/delete/create)
  - [ ] Project Type experience → `project_type_experience` (comma-separated string)
  - [ ] Foreign Language summary → `language_summary`
  - [ ] Salary Expectation → `salary_expectation`
  - [ ] Interested in Working in Japan → `interested_in_japan`
  - [ ] Certificates → `certificates` table (update/delete/create)
  - [ ] Avatar → `profile_image_url` (upload image and save URL)

#### Data Loading

- [ ] **Load Engineer Data**:
  - [ ] GET `/api/admin/engineers/{id}` to load engineer information
  - [ ] Display engineer data in form fields
  - [ ] Handle case when engineer ID is invalid or engineer not found

- [ ] **Load Certificates**:
  - [ ] GET `/api/admin/engineers/{id}/certificates` or include in engineer response
  - [ ] Display certificates in certificate section
  - [ ] Each certificate is editable and removable

- [ ] **Load Engineer Skills**:
  - [ ] GET `/api/admin/engineers/{id}/skills` or include in engineer response
  - [ ] Display skills in "Other Skill" multi-select
  - [ ] Skills can be added or removed

#### Data Updates

- [ ] **Update Engineer**:
  - [ ] PUT `/api/admin/engineers/{id}` to update engineer information
  - [ ] All fields are updated in single request
  - [ ] `updated_at` timestamp is automatically updated

- [ ] **Update Certificates**:
  - [ ] Certificates are managed through update request:
    - [ ] New certificates are created
    - [ ] Existing certificates are updated (if changed)
    - [ ] Removed certificates are deleted
  - [ ] Certificate management is transactional (all or nothing)

- [ ] **Update Engineer Skills**:
  - [ ] Engineer skills are managed through update request:
    - [ ] New skills are added to `engineer_skills` table
    - [ ] Removed skills are deleted from `engineer_skills` table
  - [ ] Skill management is transactional (all or nothing)

#### Email Uniqueness Validation

- [ ] **Email Uniqueness Check**:
  - [ ] When updating email, check if email already exists for another engineer
  - [ ] Current engineer's email should be excluded from uniqueness check
  - [ ] Show error message if email is already in use by another engineer
  - [ ] Allow same email if it's the current engineer's email

#### Certificate Management

- [ ] **Loading Certificates**:
  - [ ] Load all certificates for engineer on page load
  - [ ] Display certificates in a list or table format
  - [ ] Each certificate is editable inline or in a modal

- [ ] **Updating Certificates**:
  - [ ] User can edit existing certificate fields (name, issued by, dates)
  - [ ] Changes are tracked and sent in update request
  - [ ] All certificate updates are saved when form is submitted

- [ ] **Adding Certificates**:
  - [ ] User can add new certificates using "+" button
  - [ ] New certificates are added to the list
  - [ ] New certificates are saved when form is submitted

- [ ] **Removing Certificates**:
  - [ ] User can remove certificates using delete/trash icon
  - [ ] Removed certificates are deleted from database when form is submitted
  - [ ] Confirmation not required for removal (user can add it back if mistake)

#### Skills Management

- [ ] **Loading Skills**:
  - [ ] Load all skills from `engineer_skills` table for engineer
  - [ ] Display skills in "Other Skill" multi-select with selected state
  - [ ] Skills are displayed with their names

- [ ] **Updating Skills**:
  - [ ] User can add skills by selecting from dropdown
  - [ ] User can remove skills by clicking remove button on skill tag
  - [ ] All skill changes are saved when form is submitted
  - [ ] Skills are managed through `engineer_skills` table (add/delete)

#### Avatar/Image Management

- [ ] **Loading Existing Avatar**:
  - [ ] Load existing avatar image from `profile_image_url` field
  - [ ] Display avatar image in preview area
  - [ ] If no avatar exists, show upload area

- [ ] **Updating Avatar**:
  - [ ] User can upload new image to replace existing avatar
  - [ ] New image is uploaded and URL is saved to `profile_image_url`
  - [ ] Old image is replaced (or deleted if stored on server)
  - [ ] User can remove existing avatar (set `profile_image_url` to null)

- [ ] **Image Upload Functionality**:
  - [ ] Supports drag and drop file upload
  - [ ] Supports click to select file from file picker
  - [ ] Image preview after upload
  - [ ] Supported formats: JPG, JPEG, PNG, GIF, WEBP
  - [ ] Max file size: 5MB
  - [ ] Image validation before upload
  - [ ] Upload to cloud storage or server
  - [ ] Save image URL to `profile_image_url` field
  - [ ] Error handling for upload failures

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
  - [ ] Engineer not found: "Engineer not found." (redirect to list page)

- [ ] **Image Upload Errors**:
  - [ ] File too large: "Image size must be less than 5MB"
  - [ ] Invalid format: "Please upload a valid image file (JPG, PNG, GIF, WEBP)"
  - [ ] Upload failed: "Failed to upload image. Please try again."

- [ ] **Loading Errors**:
  - [ ] Engineer not found: Show error message and redirect to engineer list page
  - [ ] Failed to load certificates: Show error message, allow form submission without certificates
  - [ ] Failed to load skills: Show error message, allow form submission without skills

#### Success Feedback

- [ ] **Success Message**:
  - [ ] Success toast/notification: "Engineer updated successfully"
  - [ ] Redirect to engineer list page after 2 seconds (or immediately)

- [ ] **Loading States**:
  - [ ] Show loading spinner during data loading
  - [ ] Show loading spinner during form submission
  - [ ] Disable form fields during save
  - [ ] Show "Saving..." text on Save button
  - [ ] Disable Cancel button during save

## Technical Requirements

### Frontend Requirements

#### Component Structure

- [ ] **Main Page Component**: `frontend/src/app/admin/engineer/[id]/edit/page.tsx`
  - [ ] Imports AdminSidebar and AdminHeader components
  - [ ] Implements breadcrumb navigation
  - [ ] Manages form state and validation
  - [ ] Handles form submission and image upload
  - [ ] Manages certificate list (add/remove/edit)
  - [ ] Loads engineer data by ID on page load

#### State Management

- [ ] **React Hooks**:
  - [ ] `useState` for form data, errors, loading states, certificates list, image preview
  - [ ] `useEffect` for loading engineer data on mount, form initialization, validation, dirty state tracking
  - [ ] `useCallback` for memoized functions (handleSubmit, handleImageUpload, etc.)
  - [ ] `useRouter` for navigation and getting engineer ID from URL params
  - [ ] `useParams` or `useSearchParams` to get engineer ID from route

#### Form Data Structure

```typescript
interface EditEngineerFormData {
  // Same as CreateEngineerFormData
  // All fields from Create Engineer form
  // Plus original data for comparison
  originalData?: Engineer; // For dirty state tracking
}
```

#### Data Loading

- [ ] **Load Engineer Data**:
  - [ ] Call `getEngineerById(id)` on component mount
  - [ ] Populate form fields with loaded data
  - [ ] Load certificates and skills from engineer response or separate endpoints
  - [ ] Handle loading errors

- [ ] **Load Related Data**:
  - [ ] Load all skills for "Other Skill" dropdown
  - [ ] Load all project types for "Project Type Experience" dropdown

#### Image Upload

- [ ] **Upload Service**:
  - [ ] File validation (format, size)
  - [ ] Image preview generation
  - [ ] Upload to backend API endpoint (e.g., `/api/admin/engineers/{id}/upload-avatar`)
  - [ ] Handle upload progress (optional)
  - [ ] Return image URL after successful upload
  - [ ] Update form data with new image URL

#### API Integration

- [ ] **Service File**: Extend `frontend/src/services/adminEngineerService.ts`
  - [ ] `getEngineerById(id: number): Promise<Engineer>` - Already exists
  - [ ] `updateEngineer(id: number, request: UpdateEngineerRequest): Promise<Engineer>` - Already exists, extend with new fields
  - [ ] `getEngineerCertificates(id: number): Promise<Certificate[]>` - Optional, if certificates loaded separately
  - [ ] `getEngineerSkills(id: number): Promise<Skill[]>` - Optional, if skills loaded separately
  - [ ] `uploadAvatar(id: number, file: File): Promise<string>` - Upload avatar and return URL

#### Date Pickers

- [ ] **Date Picker Component**:
  - [ ] Use existing date picker component or library (e.g., react-datepicker, shadcn/ui DatePicker)
  - [ ] Format: YYYY/MM/DD or YYYY-MM-DD
  - [ ] Calendar icon displayed
  - [ ] Pre-filled with existing dates
  - [ ] Disable future dates for DOB
  - [ ] Min/Max date validation

#### Multi-select Dropdowns

- [ ] **Multi-select Components**:
  - [ ] Use existing multi-select component or library
  - [ ] For Other Skills: Show skills from skills table with hierarchy (Parent > Sub)
  - [ ] Pre-select existing engineer skills
  - [ ] For Project Types: Show project types from project_types table
  - [ ] Pre-select existing project types (from comma-separated string)
  - [ ] Display selected items as tags/chips
  - [ ] Remove individual selections

### Backend Requirements

#### REST API Endpoints

- [ ] **GET `/api/admin/engineers/{id}`** - Get engineer by ID (Already exists)
  - [ ] Response: `EngineerResponse` with engineer information
  - [ ] Include certificates in response or separate endpoint
  - [ ] Include engineer skills in response or separate endpoint
  - [ ] Authentication: Requires ADMIN role
  - [ ] Authorization: Only ADMIN users can access

- [ ] **PUT `/api/admin/engineers/{id}`** - Update engineer with all details (Already exists, extend with new fields)
  - [ ] Request body: `UpdateEngineerRequest` (extended with new fields)
  - [ ] Response: `EngineerResponse` with updated engineer
  - [ ] Validation: Validate all required fields and formats
  - [ ] Business logic: Check email uniqueness (excluding current engineer)
  - [ ] Handle certificates update/delete/create (multiple entries)
  - [ ] Handle engineer_skills update/delete/create (if Other Skills provided)
  - [ ] Authentication: Requires ADMIN role
  - [ ] Authorization: Only ADMIN users can access

- [ ] **POST `/api/admin/engineers/{id}/upload-avatar`** - Upload engineer avatar image (Optional, can use same as create)
  - [ ] Request: Multipart form data with image file
  - [ ] Response: Image URL string
  - [ ] File validation: Format, size
  - [ ] Upload to cloud storage or server
  - [ ] Return public URL for image
  - [ ] Authentication: Requires ADMIN role

- [ ] **GET `/api/admin/engineers/{id}/certificates`** - Get certificates for engineer (Optional, if not included in engineer response)
  - [ ] Response: List of certificates
  - [ ] Used for loading certificates separately

- [ ] **GET `/api/admin/engineers/{id}/skills`** - Get skills for engineer (Optional, if not included in engineer response)
  - [ ] Response: List of skills
  - [ ] Used for loading engineer skills separately

#### Database Updates

- [ ] **No Schema Changes Required**:
  - [ ] All required fields and tables already exist (from Story-35)
  - [ ] No new migrations needed for Edit Engineer functionality

#### Entity Updates

- [ ] **Engineer Entity**: Already updated in Story-35
  - [ ] All required fields already exist

#### DTOs

- [ ] **Request DTOs**: Update `UpdateEngineerRequest.java`
  - [ ] Add fields: email, phone, gender, dateOfBirth, interestedInJapan, projectTypeExperience
  - [ ] Add nested `CertificateRequest` class or list
  - [ ] Add `otherSkills` list (array of skill IDs)
  - [ ] Validation annotations for all new fields

- [ ] **Response DTOs**: Already updated in Story-35
  - [ ] `EngineerResponseDTO` already includes all new fields

#### Service

- [ ] **AdminEngineerService**: Update `updateEngineer` method
  - [ ] Handle email uniqueness check (excluding current engineer)
  - [ ] Update engineer with all fields
  - [ ] Update/delete/create certificates (multiple entries)
  - [ ] Update/delete/create engineer_skills entries (if Other Skills provided)
  - [ ] Handle transactions (all or nothing)

#### Controller

- [ ] **AdminEngineerController**: Update or create methods
  - [ ] Update `updateEngineer` endpoint to handle extended request (Already exists, extend with new fields)
  - [ ] Optional: Add `uploadAvatar` endpoint for image upload (if not using same as create)
  - [ ] Handle multipart file upload
  - [ ] Return image URL

### Database Requirements

#### Schema Updates

- [ ] **No Schema Changes Required**:
  - [ ] All required tables and columns already exist
  - [ ] Engineer update operations use existing schema

## Implementation Guidelines

### Frontend Implementation

#### Form Component Structure

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminSidebar from '@/components/design-patterns/admin/AdminSidebar';
import AdminHeader from '@/components/design-patterns/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateEngineer, getEngineerById } from '@/services/adminEngineerService';

export default function EditEngineerPage() {
  const router = useRouter();
  const params = useParams();
  const engineerId = parseInt(params.id as string);
  
  // Load engineer data on mount
  useEffect(() => {
    loadEngineerData();
  }, [engineerId]);
  
  // Form state management
  // Certificate list management
  // Image upload handling
  // Form validation
  // Form submission
  // Navigation
}
```

#### Data Loading Implementation

```typescript
const loadEngineerData = async () => {
  try {
    setLoading(true);
    const engineer = await getEngineerById(engineerId);
    // Populate form with engineer data
    setFormData({
      fullName: engineer.fullName,
      email: engineer.email || '',
      // ... all other fields
    });
    
    // Load certificates
    // Load engineer skills
  } catch (error) {
    console.error('Error loading engineer:', error);
    alert('Failed to load engineer data');
    router.push('/admin/engineer');
  } finally {
    setLoading(false);
  }
};
```

### Backend Implementation

#### Update Engineer Service

```java
@Service
public class AdminEngineerService {
    
    public EngineerResponseDTO updateEngineer(Integer id, UpdateEngineerRequest request) {
        Engineer engineer = engineerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Engineer not found"));

        // Check email uniqueness (excluding current engineer)
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            engineerRepository.findByEmail(request.getEmail())
                    .ifPresent(e -> {
                        if (!e.getId().equals(id)) {
                            throw new RuntimeException("Email already exists. Please use a different email.");
                        }
                    });
        }

        // Update engineer fields
        // Update certificates
        // Update engineer_skills
        // Save and return
    }
}
```

## Testing Requirements

### Unit Tests

- [ ] **Frontend Unit Tests**:
  - [ ] Test form validation
  - [ ] Test data loading
  - [ ] Test certificate add/remove/edit
  - [ ] Test image upload validation
  - [ ] Test form submission
  - [ ] Test email uniqueness validation

- [ ] **Backend Unit Tests**:
  - [ ] Test service methods
  - [ ] Test email uniqueness validation (excluding current engineer)
  - [ ] Test certificate update/delete/create
  - [ ] Test engineer_skills update/delete/create

### Integration Tests

- [ ] **API Integration Tests**:
  - [ ] Test GET /api/admin/engineers/{id} with valid ID
  - [ ] Test GET /api/admin/engineers/{id} with invalid ID (404)
  - [ ] Test PUT /api/admin/engineers/{id} with all fields
  - [ ] Test email uniqueness validation
  - [ ] Test certificate update/delete/create
  - [ ] Test image upload endpoint

### End-to-End Tests

- [ ] **E2E Test Scenarios**:
  - [ ] User can navigate to edit engineer page from list
  - [ ] Form is pre-filled with engineer data
  - [ ] User can edit all form fields
  - [ ] User can add/remove certificates
  - [ ] User can update avatar image
  - [ ] User can submit form successfully
  - [ ] User sees validation errors for invalid fields
  - [ ] User sees error if email already exists for another engineer
  - [ ] User can cancel with unsaved changes confirmation

## Performance Requirements

- [ ] **Form Load Time**: Form should load within 2 seconds
- [ ] **Image Upload Time**: Image upload should complete within 5 seconds for files < 5MB
- [ ] **Form Submission Time**: Form submission should complete within 3 seconds
- [ ] **Dropdown Load Time**: Skills and Project Types dropdowns should load within 1 second

## Security Considerations

- [ ] **Authentication**: All endpoints require valid JWT token
- [ ] **Authorization**: Only ADMIN role can access endpoints
- [ ] **Input Validation**: All inputs are validated on both frontend and backend
- [ ] **File Upload Security**: Validate file types and sizes, scan for malware (if applicable)
- [ ] **Email Uniqueness**: Prevent duplicate emails in database (excluding current engineer)
- [ ] **SQL Injection Prevention**: Use parameterized queries and JPA methods
- [ ] **XSS Prevention**: Sanitize user inputs before displaying

## Deployment Requirements

- [ ] **Environment Variables**: Configure image upload storage (AWS S3, Cloudinary, etc.)
- [ ] **File Storage**: Configure cloud storage or server storage for images
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
- [ ] Image upload functionality is tested
- [ ] Form validation is working correctly
- [ ] Email uniqueness check is working (excluding current engineer)
- [ ] Certificate update/delete/create is working
- [ ] Engineer skills update/delete/create is working

## Dependencies

### Internal Dependencies

- [ ] Story-35: Admin Create Engineer (for form structure and fields)
- [ ] Story-34: Admin Engineer List Management (for navigation and list page)
- [ ] Story-32: Admin Master Data Skill Management (for skills dropdown)
- [ ] Story-33: Admin Master Data Project Type Management (for project types dropdown)
- [ ] Admin authentication system (already implemented)
- [ ] AdminSidebar component (already implemented)
- [ ] AdminHeader component (already implemented)

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
   - Mitigation: Organize fields into clear sections, provide helpful placeholders, pre-fill existing data

2. **Data Consistency**:
   - Risk: Update operations may fail partially (e.g., engineer updated but certificates not)
   - Mitigation: Use database transactions (all or nothing), implement proper error handling

3. **Email Uniqueness Validation**:
   - Risk: Race condition when checking email uniqueness
   - Mitigation: Use database unique constraint, handle unique constraint violation gracefully, exclude current engineer from check

4. **Certificate and Skills Management**:
   - Risk: Complex logic for updating/deleting/creating certificates and skills
   - Mitigation: Implement clear update logic, test thoroughly, use transactions

### Mitigation Strategies

- [ ] Implement comprehensive form validation
- [ ] Use database transactions for data consistency
- [ ] Test certificate and skills update/delete/create thoroughly
- [ ] Implement proper error handling and user feedback
- [ ] Pre-fill form data to reduce user errors

## Success Metrics

### Business Metrics

- [ ] Admin can edit engineer profiles with all required information
- [ ] Zero data loss during engineer update
- [ ] Form submission success rate > 95%

### Technical Metrics

- [ ] Form load time < 2 seconds
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
- [ ] Version history for engineer updates
- [ ] Skills with levels and years in "Other Skills" selection

### Notes

- This story focuses on editing engineer profiles with comprehensive information
- The form structure is similar to Create Engineer form (Story-35)
- All fields from Create Engineer form are available in Edit Engineer form
- Form is pre-filled with existing engineer data on page load
- Certificate and skills management allows adding, editing, and removing items

---

**Document Control**
- **Version**: 1.0
- **Last Updated**: December 2024
- **Next Review**: January 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management

