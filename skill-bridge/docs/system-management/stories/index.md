# User Stories - SkillBridge Platform

## Story Overview

This directory contains detailed user stories for the SkillBridge platform, providing comprehensive requirements, acceptance criteria, and implementation guidelines for each feature.

## Story Index

### Sprint 1 - Foundation Stories

#### [Story-01: Guest Homepage Browsing](./Story-01-Guest-Homepage-Browsing.md)
**As a** Guest  
**I want to** browse the SkillBridge homepage  
**So that** I can understand what services LandBridge provides  

**Key Features:**
- Public homepage access without authentication
- Service introduction and features display
- Contact button and call-to-action
- Real engineer profiles from database
- Responsive design for all devices

**Story Points:** 8  
**Priority:** High  
**Status:** Ready for Development  

#### [Story-02: Guest Engineer Search & Viewing](./Story-02-Guest-Engineer-Search.md)
**As a** Guest  
**I want to** search and view public engineer profiles  
**So that** I can get an idea of available skills and experience  

**Key Features:**
- Advanced search with multiple filters (skills, languages, experience, salary)
- Public engineer profiles with limited information
- Real-time search functionality
- Pagination and sorting options
- Privacy protection for sensitive data

**Story Points:** 13  
**Priority:** High  
**Status:** Ready for Development  

#### [Story-03: Guest Services Viewing](./Story-03-Guest-Services-Viewing.md)
**As a** Guest  
**I want to** view the list of services (Project Development, Engineer Hiring, Consulting)  
**So that** I can identify the type of engagement that suits my needs  

**Key Features:**
- Service types with clear descriptions and benefits (hardcoded content)
- Merits section highlighting key advantages
- Challenges and solutions section
- Professional layout with responsive design
- Public access without authentication
- No backend API or database required

**Story Points:** 5  
**Priority:** High  
**Status:** Ready for Development  

#### [Story-04: Guest Contact Request](./Story-04-Guest-Contact-Request.md)
**As a** Guest  
**I want to** register or submit my first Contact request  
**So that** I can start communicating with LandBridge  

**Key Features:**
- Contact form with required fields (name, email, company, phone, message)
- Form validation and error handling
- User status change from Guest to Client
- Confirmation email and sales manager notification
- Responsive design matching wireframe layout

**Story Points:** 8  
**Priority:** High  
**Status:** Ready for Development  

---

### Sprint 2 - Client Portal Access Stories

#### [Story-06: Client Login Authentication](./Story-06-Client-Login-Authentication.md)
**As a** Client  
**I want to** login to the Client Portal using my email and password  
**So that** I can access my account and view my projects

**Key Features:**
- Login page matching wireframe design
- Email and password authentication
- JWT token generation and management
- Form validation and error handling
- Responsive design for all devices

**Story Points:** 8  
**Priority:** High  
**Status:** Ready for Development  

#### [Story-07: Client Forgot Password](./Story-07-Client-Forgot-Password.md)
**As a** Client  
**I want to** reset my password when I forget it  
**So that** I can regain access to my account

**Key Features:**
- Forgot password modal matching wireframe design
- Password reset token generation and validation
- Email template for password reset (SES commented)
- Secure token management with expiration
- Form validation and error handling

**Story Points:** 5  
**Priority:** High  
**Status:** Ready for Development  

#### [Story-08: Client Logout](./Story-08-Client-Logout.md)
**As a** Client  
**I want to** logout from the Client Portal  
**So that** I can securely end my session and protect my account

**Key Features:**
- Logout button in client portal header
- Token removal and session cleanup
- Redirect to login page after logout
- Protected route access control
- Optional token blacklisting

**Story Points:** 3  
**Priority:** Medium  
**Status:** Ready for Development  

---

### Sprint 3 - Client Portal Management Stories

#### [Story-09: Client Contact List Management](./Story-09-Client-Contact-List.md)
**As a** Client  
**I want to** view and manage my contact submissions in a list  
**So that** I can track the status of my requests and view contact details

**Key Features:**
- Contact list table with pagination
- Search and filter functionality
- View contact details
- Create new contact from list page
- Sidebar navigation with active state
- User information in header
- Responsive design

**Story Points:** 13  
**Priority:** High  
**Status:** Ready for Development  

#### [Story-10: Client Contact Detail View](./Story-10-Client-Contact-Detail.md)
**As a** Client  
**I want to** view detailed information about my contact submission and interact with proposals and communication logs  
**So that** I can track my consultation requests, communicate with the team, and manage proposals

**Key Features:**
- Detailed contact information display
- Communication log section with inline add functionality
- Proposal section with comment and approve actions
- Comment modal for proposal feedback
- Cancel consultation modal with reason
- Online meeting information display
- Breadcrumb navigation
- Responsive design

**Story Points:** 13  
**Priority:** High  
**Status:** Ready for Development  

---

### Sprint 4 - Client Portal Proposal Management Stories

#### [Story-11: Client Proposal List Management](./Story-11-Client-Proposal-List.md)
**As a** Client  
**I want to** view and manage my proposals in a list  
**So that** I can track the status of my proposals and view proposal details

**Key Features:**
- Proposal list table with pagination
- Search and filter functionality
- View proposal details (navigates to Contract Details screen)
- Sidebar navigation with active state
- User information in header
- Responsive design matching wireframe

**Story Points:** 13  
**Priority:** High  
**Status:** Ready for Development  

#### [Story-12: Client Contract List Management](./Story-12-Client-Contract-List.md)
**As a** Client  
**I want to** view and manage my contracts in a list  
**So that** I can track the status of my contracts, view contract details, and monitor contract values and periods

**Key Features:**
- Contract list table with pagination
- Search and filter functionality
- View contract details by clicking eye icon
- Contract type display (MSA, SOW)
- Contract period and value display
- Status badges with distinct styling
- Assignee information
- Sidebar navigation with active state
- User information in header
- Responsive design matching wireframe
- Multi-language support (JP/EN)

**Story Points:** 13  
**Priority:** High  
**Status:** Ready for Development  

#### [Story-13: Client Contract Detail MSA View](./Story-13-Client-Contract-Detail-MSA.md)
**As a** Client  
**I want to** view detailed information about my MSA (Master Service Agreement) contract  
**So that** I can review contract terms, commercial details, legal compliance information, and contract history, and take actions such as approving, commenting, or canceling the contract

**Key Features:**
- Overview section with MSA ID, Effective Start, Effective End, and Status
- Commercial Terms section with currency, payment terms, invoicing cycle, billing day, and tax/withholding
- Legal/Compliance section with IP ownership and governing law
- Contacts section with Client and LandBridge contact information
- History section with contract documents and files
- Action buttons: Approve, Comment, Cancel Contract
- Breadcrumb navigation
- Sidebar navigation with active state
- User information in header
- Responsive design matching wireframe
- Multi-language support (JP/EN)

**Story Points:** 13  
**Priority:** High  
**Status:** Ready for Development  

#### [Story-14: Client Contract Detail SOW View (Fixed Price & Retainer)](./Story-14-Client-Contract-Detail-SOW.md)
**As a** Client  
**I want to** view detailed information about my SOW (Statement of Work) contracts, both Fixed Price and Retainer types  
**So that** I can review contract details, scope, deliverables, billing information, change requests, and contract history, and take actions such as approving, commenting, or canceling the contract

**Key Features:**
- **Fixed Price SOW**: Overview, Scope Summary, Milestone Deliverables table, Billing details table, Change Request table, History
- **Retainer SOW**: Overview, Scope Summary, Delivery Items table, Billing details table, Change Request table, History
- Tab navigation: Contract Info and Change Requests
- Milestone tracking with acceptance criteria and payment percentages (Fixed Price)
- Delivery items with monthly billing (Retainer)
- Change request history with different fields for each type
- Action buttons: Approve, Comment, Cancel Contract
- Breadcrumb navigation
- Sidebar navigation with active state
- User information in header
- Responsive design matching wireframe
- Multi-language support (JP/EN)

**Story Points:** 21  
**Priority:** High  
**Status:** Ready for Development

#### [Story-15: Client Create Change Request](./Story-15-Client-Create-Change-Request.md)
**As a** Client  
**I want to** create a new change request for my SOW contract through a modal form  
**So that** I can request modifications to the contract scope, schedule, resources, or other terms, and track the status of my change requests

**Key Features:**
- Modal form with three sections: Overview, Attachments, Desired Impact
- CR Type options differ based on contract type:
  - Fixed Price: Add Scope, Remove Scope, Other
  - Retainer: Extend Schedule, Increase Resource, Rate Change, Other
- Form fields: CR Title, CR Type, Description, Reason, Desired Start/End Date, Expected Extra Cost
- File upload with drag & drop support
- Form validation and error handling
- Actions: Submit Change Request, Save Draft, Cancel
- Responsive design matching wireframe
- Multi-language support (JP/EN)

**Story Points:** 13  
**Priority:** High  
**Status:** Ready for Development

#### [Story-16: Client Change Request Detail View](./Story-16-Client-Change-Request-Detail.md)
**As a** Client  
**I want to** view detailed information about a change request in a modal  
**So that** I can review all change request details, impact analysis, history, and attachments, and take appropriate actions based on the change request status

**Key Features:**
- Modal with comprehensive change request information
- Sections: Overview, Change Summary, Evidence, Desired Impact, Impact Analysis by Landbridge, History, Attachments
- Impact Analysis differs by contract type:
  - Fixed Price: Dev Hours, Test Hours, New End Date, Delay Duration, Additional Cost
  - Retainer: Engaged Engineer table and Billing details table
- Conditional button display based on status:
  - Draft: Submit Change Request, Save Draft, Terminate CR, Close (fields editable)
  - Under Review: Approve, Request For Change, Terminate CR, Close (fields read-only)
  - Request for Change/Active/Terminated: Close only (fields read-only)
- Status-based field editability
- Action handlers for all status transitions
- Responsive design matching wireframe
- Multi-language support (JP/EN)

**Story Points:** 13  
**Priority:** High  
**Status:** Ready for Development

#### [Story-17: Client Dashboard](./Story-17-Client-Dashboard.md)
**As a** Client  
**I want to** view a comprehensive dashboard with summary statistics, recent activities, and notifications  
**So that** I can quickly understand the status of my contacts, proposals, contracts, and change requests, and stay informed about important updates

**Key Features:**
- Summary section with four cards: Contacts, Proposals, Contracts, Change Requests
- Each summary card displays relevant metrics (e.g., "3 Inprogress", "1 new")
- Recent Activity Timeline with date-stamped activities
- Alerts / Notifications section with important updates
- Clickable cards and items for navigation to detail pages
- Auto-refresh functionality
- Responsive design matching wireframe
- Multi-language support (JP/EN)

**Story Points:** 13  
**Priority:** High  
**Status:** Draft

#### [Story-18: Sales Login Authentication](./Story-18-Sales-Login-Authentication.md)
**As a** Sales User  
**I want to** login to the Sales Portal using my email and password  
**So that** I can access my sales account and manage client relationships

**Key Features:**
- Sales login page with orange gradient theme matching wireframe
- Password visibility toggle with eye icon
- Multi-language support (Japanese/English)
- Role-based access control (SALES role only)
- Form validation with real-time feedback
- Error handling with user-friendly messages
- Responsive design for all devices
- Secure authentication with JWT tokens

**Story Points:** 8  
**Priority:** High  
**Status:** Draft

#### [Story-19: Sales Contact List Management](./Story-19-Sales-Contact-List.md)
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view contact requests in a list with search and filter capabilities  
**So that** I can track contact status and view contact details to manage client relationships effectively

**Key Features:**
- Contact list table matching wireframe design (No, ID, Client Name, Client Email, Company, Title, Status, Assignee, Action)
- Role-based data access: Sales Manager sees all contacts, Sales Man sees only assigned contacts
- Search functionality across multiple fields
- Status filtering (New, Inprogress, Converted to Opportunity, Closed)
- View contact detail with redirect to detail page
- Pagination support
- Authorization checks on view operations
- Responsive design for all devices

**Story Points:** 13  
**Priority:** High  
**Status:** Draft

#### [Story-20: Sales Contact Detail Management](./Story-20-Sales-Contact-Detail.md)
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view and edit detailed contact information with role-based permissions  
**So that** I can manage contact details, update status, schedule meetings, and track communications effectively

**Key Features:**
- Contact detail page matching wireframe design with all sections
- Role-based field editability: Sales Manager edits Classification (Request Type, Priority, Assignee), Assigned Sales Man edits Status, Internal Notes, Online MTG fields
- Sales Manager can assign contacts to themselves
- Communication log functionality for assigned Sales Man
- Convert to opportunity functionality
- Send meeting email functionality
- Authorization checks on all operations
- Responsive design for all devices

**Story Points:** 13  
**Priority:** High  
**Status:** Draft

#### [Story-21: Sales Opportunities List Management](./Story-21-Sales-Opportunities-List.md)
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view and manage opportunities in a list with search and filter capabilities  
**So that** I can track opportunity status, estimate values, and manage sales pipeline effectively

**Key Features:**
- Opportunities list table matching wireframe design (No, ID, Est. Value, Probability, Client Email, Client Name, Status, Assignee, Action)
- Role-based data access: Sales Manager sees all opportunities, Sales Man sees only opportunities they created
- Search functionality across multiple fields
- Status filtering (New, In Progress, Proposal Drafting, Proposal Sent, Revision, Won, Lost)
- View opportunity detail with redirect to detail page
- Currency formatting for estimated values
- Probability percentage display
- Pagination support
- Authorization checks on view operations
- Responsive design for all devices

**Story Points:** 13  
**Priority:** High  
**Status:** Draft

#### [Story-22: Sales Opportunity Create/Detail Management](./Story-22-Sales-Opportunity-Create.md)
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** create and manage opportunity details with proposal creation and review workflow  
**So that** I can convert contacts to opportunities, create proposals, and manage the sales pipeline through internal review processes

**Key Features:**
- Opportunity create/detail page matching wireframe design
- Convert contact to opportunity with data pre-population (Client's name, Client Company, Assignee)
- Opportunity info section with editable fields (Client's name, Client Company, Assignee, Probability, Est. Value)
- Automatic status calculation based on proposal state (New, Proposal Drafting, Proposal Sent, Revision, Won, Lost)
- Proposal creation and edit functionality (only one proposal per opportunity)
- Proposal edit restrictions after reviewer assignment
- Internal review workflow with reviewer assignment (only Sales Managers)
- Review submission with notes and actions (only assigned reviewer)
- File upload for proposals (PDF only)
- Role-based permissions and authorization checks
- Responsive design for all devices

**Story Points:** 21  
**Priority:** High  
**Status:** Draft

#### [Story-23: Sales Opportunity Edit/Detail Management](./Story-23-Sales-Opportunity-Edit.md)
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view and edit opportunity details with proposal version history, current proposal management, and review workflow  
**So that** I can track proposal versions, manage the current proposal, conduct internal reviews, convert approved proposals to contracts, and mark opportunities as lost

**Key Features:**
- Opportunity edit/detail page matching wireframe design
- Proposal versions table showing all proposal versions with status, reviewer, and feedback
- Current proposal section with version number and details
- Internal review workflow (same as Story-22)
- History section showing proposal activity log
- Mark Lost functionality
- Convert to Contract button (only enabled when client approves a proposal)
- Proposal version tracking and history logging
- Role-based permissions and authorization checks
- Responsive design for all devices

**Story Points:** 21  
**Priority:** High  
**Status:** Draft

#### [Story-24: Sales Contract List Management](./Story-24-Sales-Contract-List.md)
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** view and manage contracts in a list with search and filter capabilities  
**So that** I can track contract status, monitor contract values and periods, and manage client relationships effectively

**Key Features:**
- Contract list table matching wireframe design (No, ID, Contract Name, Client, Type, Period, Value, Status, Action)
- Role-based data access: Sales Manager sees all contracts, Sales Man sees only assigned contracts
- Search functionality across multiple fields (Contract ID, Contract Name, Client Name, Client Email)
- Status filtering (Request for Change, Internal Review, Client Under Review, Completed, Terminated)
- View contract detail with redirect to detail page
- Support for both MSA and SOW contracts in unified list
- Contract period and value formatting
- Pagination support
- Authorization checks on view operations
- Responsive design for all devices

**Story Points:** 13  
**Priority:** High  
**Status:** Draft

#### [Story-25: Sales Create MSA (Master Service Agreement)](./Story-25-Sales-Create-MSA.md)
**As a** Sales User (Sales Manager or Sales Man)  
**I want to** create a new MSA (Master Service Agreement) contract from an opportunity  
**So that** I can convert approved opportunities into formal contracts and manage contract terms, commercial details, and legal compliance information

**Key Features:**
- Create MSA form matching wireframe design with all sections (MSA Summary, Commercial Terms, Legal/Compliance, Contacts, Attachments, Internal Review Workflow)
- Opportunity selection dropdown (only shows opportunities with approved proposals)
- Auto-population of client information from selected opportunity
- Date pickers for Effective Start and Effective End
- Commercial terms configuration (Currency, Payment Terms, Invoicing Cycle, Billing Day, Tax/Withholding)
- Legal/Compliance fields (IP Ownership, Governing Law)
- Contact selection (Client and LandBridge contacts)
- PDF file upload with drag & drop support
- Internal review workflow (assign reviewer, submit review with actions)
- Multiple action buttons (Submit review, Save as Draft, Cancel, Save Contract)
- Form validation and error handling
- Contract ID generation (MSA-YYYY-NN format)
- History tracking for contract creation and reviews
- Responsive design for all devices

**Story Points:** 21  
**Priority:** High  
**Status:** Draft

#### [Story-30: Sales Change Request Detail](./Story-30-Sales-Change-Request-Detail.md)
**As a** Sales User (Sales Manager or Sales Rep)  
**I want to** view and manage change request details  
**So that** I can review, edit, approve, or reject change requests effectively

**Key Features:**
- View change request details with all related information
- Edit change request details (for draft/pending status)
- Approve or reject change requests
- View history and attachments
- Responsive design for all devices

**Story Points:** 21  
**Priority:** High  
**Status:** Draft

#### [Story-31: Sales Dashboard](./Story-31-Sales-Dashboard.md)
**As a** Sales Manager  
**I want to** view a comprehensive dashboard with summary statistics, recent activities, and revenue information for all system data  
**So that** I can monitor the overall sales performance and make informed business decisions

**As a** Sales Rep  
**I want to** view a personalized dashboard with summary statistics and recent activities for only my assigned items  
**So that** I can quickly understand the status of my assigned work without seeing sensitive revenue information

**Key Features:**
- Summary section with six cards: Contacts, Opportunities, Proposals, Contracts, Change Requests, Revenue (Sales Manager only)
- Each summary card displays relevant metrics (e.g., "70(All)", "15(New)")
- Approvals Waiting from Client section
- Recent Client Activity section
- Role-based data filtering (Sales Manager: all data, Sales Rep: assigned data only)
- Revenue section hidden for Sales Rep
- Clickable cards and items for navigation to detail pages
- Auto-refresh functionality
- Responsive design matching wireframe
- Multi-language support (JP/EN)

**Story Points:** 13  
**Priority:** High  
**Status:** Draft

### Sprint 9 - Admin Portal Stories

#### [Story-32: Admin Master Data Skill Management](./Story-32-Admin-Master-Data-Skill.md)
**As an** Admin  
**I want to** manage skills and sub-skills for engineers in the Master Data section  
**So that** I can organize and maintain the skill taxonomy used for engineer profiles, search, and matching across the system

**Key Features:**
- Skills table with columns: No, Name, Description, Action (Edit, Delete)
- Click on skill row to display sub-skills in right panel
- Create Skill modal with name, description, and multiple sub-skills
- Create Sub Skill modal with parent skill (pre-filled) and skill name
- Edit Skill modal (same structure as create, pre-filled with existing data)
- Edit Sub Skill modal (same structure as create, pre-filled with existing data)
- Delete skill/sub-skill with confirmation dialog
- Search functionality for skills (by name and description)
- Pagination support for skills table
- Validation for unique skill names and sub-skill names within same parent
- Database schema update to add description field to skills table

**Story Points:** 13  
**Priority:** High  
**Status:** Draft

#### [Story-33: Admin Master Data Project Type Management](./Story-33-Admin-Master-Data-Project-Type.md)
**As an** Admin  
**I want to** manage project types in the Master Data section  
**So that** I can organize and maintain the project type taxonomy used across the system for categorizing projects and opportunities

**Key Features:**
- Project Types table with columns: No, Name, Description, Action (Edit, Delete)
- Create Project Type modal with name and description fields
- Edit Project Type modal (same structure as create, pre-filled with existing data)
- Delete project type with confirmation dialog
- Search functionality for project types (by name and description)
- Pagination support for project types table
- Validation for unique project type names
- Database schema creation for project_types table (if not exists)

**Story Points:** 8  
**Priority:** High  
**Status:** Draft

#### [Story-34: Admin Engineer List Management](./Story-34-Admin-Engineer-List.md)
**As an** Admin  
**I want to** view and manage engineers in a list with search, pagination, and CRUD operations  
**So that** I can efficiently manage engineer profiles, skills, experience, and salary expectations across the system

**Key Features:**
- Engineers table with columns: No, Name, Main Skill, Experience, Salary Expectation, Action (Edit, Delete)
- Create Engineer modal (detailed in separate story)
- Edit Engineer modal (detailed in separate story)
- Delete engineer with confirmation dialog and validation
- Search functionality for engineers (by name and primary skill)
- Pagination support for engineers table
- Real-time search with debouncing
- Validation to prevent deletion of engineers with active contracts/engagements
- Formatted display of experience (e.g., "5 yrs") and salary (e.g., "¥ 3,500,000")

**Story Points:** 13  
**Priority:** High  
**Status:** Draft

#### [Story-35: Admin Create Engineer](./Story-35-Admin-Create-Engineer.md)
**As an** Admin  
**I want to** create new engineer profiles with comprehensive information including personal details, professional experience, skills, languages, certificates, and avatar  
**So that** I can register engineers into the system with complete profiles for matching, search, and client engagement

**Key Features:**
- Comprehensive form with multiple sections: Basic Info, Professional Info, Foreign Language Summary, Other, Certificate, Avatar
- Basic Info section: Full name, Email, Phone, Gender, DOB, Level, Introduce
- Professional Info section: Year Of Experience, Primary Skills, Other Skill (multi-select), Project Type experience (multi-select)
- Foreign Language summary section with textarea
- Other section: Salary Expectation, Interested in Working in Japan
- Certificate section: Add multiple certificates with Name, Issued by, Issued date, Expiry date
- Avatar section: Drag & drop image upload with preview
- Form validation with real-time error messages
- Email uniqueness validation
- Breadcrumb navigation: "Engineer Management > Add new Engineer"
- Database schema updates to add: email, phone, gender, date_of_birth, interested_in_japan, project_type_experience

**Story Points:** 21  
**Priority:** High  
**Status:** Draft

#### [Story-36: Admin Edit Engineer](./Story-36-Admin-Edit-Engineer.md)
**As an** Admin  
**I want to** edit existing engineer profiles with comprehensive information including personal details, professional experience, skills, languages, certificates, and avatar  
**So that** I can update engineer information when details change, correct errors, or add missing information to engineer profiles

**Key Features:**
- Edit form with same structure as Create Engineer form (Story-35)
- All form fields pre-filled with existing engineer data
- Basic Info section: Full name, Email, Phone, Gender, DOB, Level, Introduce (all pre-filled)
- Professional Info section: Year Of Experience, Primary Skills, Other Skill (multi-select with pre-selected skills), Project Type experience (multi-select with pre-selected types)
- Foreign Language summary section with textarea (pre-filled)
- Other section: Salary Expectation, Interested in Working in Japan (pre-filled)
- Certificate section: Display existing certificates, add/remove/edit certificates
- Avatar section: Display existing avatar, upload new avatar or remove
- Form validation with real-time error messages
- Email uniqueness validation (excluding current engineer)
- Certificate and skills update/delete/create functionality
- Breadcrumb navigation: "Engineer Management > Edit Engineer"
- Data loading: Load engineer data, certificates, and skills on page mount
- Dirty state tracking for unsaved changes confirmation

**Story Points:** 18  
**Priority:** High  
**Status:** Draft

---

### Sprint 10 - Admin User Management

#### [Story-37: Admin User List Management](./Story-37-Admin-User-List.md)
**As an** Admin  
**I want to** view and manage users in a list with search, filter, pagination, and CRUD operations  
**So that** I can efficiently manage user accounts, roles, and status across the system

**Key Features:**
- Users table with columns: No, Name, Role, Phone Number, Status, Action
- Search functionality for users (by name, email, phone)
- Filter by role (Sale Manager, Sale Rep) and status (Active, Deleted)
- Create User modal (detailed in Story-38)
- Edit User modal (detailed in Story-39)
- Delete user with confirmation (soft delete - sets is_active = false)
- Pagination support for users table
- Real-time search with debouncing
- Role display mapping: "SALES_MANAGER" → "Sale Manager", "SALES_REP" → "Sale Rep"
- Status display: Active/Deleted based on is_active field

**Story Points:** 13  
**Priority:** High  
**Status:** Draft

#### [Story-38: Admin Create User](./Story-38-Admin-Create-User.md)
**As an** Admin  
**I want to** create new user accounts with user name, role, email, and phone number  
**So that** I can register Sale Managers and Sale Reps into the system for managing sales operations

**Key Features:**
- Create User modal with form fields: User name, Role, Email, Phone Number
- Role dropdown with options: "Sale Manager" and "Sale Rep"
- Form validation with real-time error messages
- Email uniqueness validation
- Auto-generated secure password (stored securely, plain password in first_password field)
- Success message and table refresh after creation
- Modal closes after successful save

**Story Points:** 8  
**Priority:** High  
**Status:** Draft

#### [Story-39: Admin Edit User](./Story-39-Admin-Edit-User.md)
**As an** Admin  
**I want to** edit existing user accounts with user name, role, email, and phone number  
**So that** I can update user information when details change, correct errors, or modify user roles

**Key Features:**
- Edit User modal with same structure as Create User modal
- All form fields pre-filled with existing user data
- Form fields: User name, Role, Email, Phone Number (all pre-filled)
- Form validation with real-time error messages
- Email uniqueness validation (excluding current user)
- Dirty state tracking for unsaved changes confirmation
- Data loading: Load user data on modal open
- Success message and table refresh after update
- Password is NOT changed (separate password reset functionality)

**Story Points:** 8  
**Priority:** High  
**Status:** Draft

#### [Story-40: Admin Dashboard](./Story-40-Admin-Dashboard.md)
**As an** Admin  
**I want to** view a comprehensive dashboard with summary statistics for engineers, system users, skills, and project types  
**So that** I can quickly understand the overall system status, monitor key metrics, and make informed management decisions

**Key Features:**
- Summary section with four cards: Engineer, System User, Skills, Project Type
- Engineer card displays active and inactive counts
- System User card displays active and inactive counts
- Skills card displays total count
- Project Type card displays total count
- Responsive design matching wireframe
- Clickable cards for navigation (optional enhancement)

**Story Points:** 13  
**Priority:** High  
**Status:** Draft

---

### Sprint 11 - Contract Management Enhancement

#### [Story-41: Project Close Request for SOW Contract](./Story-41-Project-Close-Request.md)
**As a** Sales Representative  
**I want to** create a Project Close Request for an active SOW contract that has reached its end date  
**So that** I can formally request client confirmation to close the project and mark the SOW as completed

**As a** Client  
**I want to** review and approve/reject Project Close Requests from Sales Representatives  
**So that** I can confirm project completion or request additional work before closing the project

**Key Features:**
- **SalesRep Side**: Create Close Request button (only when SOW is Active and end_date <= today, no Pending request exists)
- **SalesRep Side**: Modal form to create Close Request with message and links
- **SalesRep Side**: View rejected Close Request with reason and resubmit functionality
- **Client Side**: Close Request Pending Review indicator on Contracts list
- **Client Side**: Review Close Request page with SOW details, message, and links
- **Client Side**: Approve/Reject actions with confirmation and required rejection reason
- **Business Rules**: Only one Pending Close Request per SOW, SOW must be Active, end_date <= today
- **Status Transitions**: Approve → SOW becomes Completed, Reject → SOW remains Active
- **Notifications**: Notify Client when Close Request is created/resubmitted, notify SalesRep when approved/rejected
- **Audit Logging**: Track all Close Request actions (Created, Approved, Rejected, Resubmitted)

**Story Points:** 21  
**Priority:** High  
**Status:** Ready for Development

---

## Story Template

### Story Structure
Each user story follows this comprehensive structure:

1. **Story Information**: ID, title, epic, priority, story points, sprint, status
2. **User Story**: Standard "As a... I want... So that..." format
3. **Acceptance Criteria**: Detailed, testable requirements
4. **Technical Requirements**: Frontend, backend, and database specifications
5. **Implementation Guidelines**: Code examples and best practices
6. **Testing Requirements**: Unit, integration, and E2E tests
7. **Performance Requirements**: Performance metrics and optimization
8. **Security Considerations**: Privacy compliance and data protection
9. **Deployment Requirements**: Environment configuration and monitoring
10. **Definition of Done**: Complete checklist for story completion
11. **Dependencies**: External and internal dependencies
12. **Risks and Mitigation**: Potential issues and solutions
13. **Success Metrics**: Business and technical success criteria
14. **Future Enhancements**: Planned improvements and features

### Acceptance Criteria Format
- **Primary Acceptance Criteria**: High-level requirements
- **Detailed Acceptance Criteria**: Specific, testable conditions
- **Technical Acceptance Criteria**: Implementation requirements
- **Performance Acceptance Criteria**: Performance standards
- **Security Acceptance Criteria**: Security and privacy requirements

### Technical Requirements Format
- **Frontend Requirements**: React/Next.js components and interfaces
- **Backend Requirements**: Spring Boot services and controllers
- **Database Requirements**: MySQL schema and queries
- **API Requirements**: REST endpoints and data models
- **Integration Requirements**: External service integrations

### Testing Requirements Format
- **Unit Tests**: Component and service testing
- **Integration Tests**: API and database testing
- **End-to-End Tests**: User workflow testing
- **Performance Tests**: Load and stress testing
- **Security Tests**: Security vulnerability testing

## Story Development Process

### 1. Story Creation
- **Epic Identification**: Determine which epic the story belongs to
- **User Research**: Understand user needs and pain points
- **Requirements Gathering**: Collect functional and non-functional requirements
- **Acceptance Criteria**: Define testable acceptance criteria
- **Technical Analysis**: Identify technical requirements and constraints

### 2. Story Refinement
- **Backlog Grooming**: Review and refine story details
- **Estimation**: Assign story points based on complexity
- **Dependency Analysis**: Identify and resolve dependencies
- **Risk Assessment**: Identify potential risks and mitigation strategies
- **Resource Planning**: Assign team members and estimate effort

### 3. Story Development
- **Sprint Planning**: Include story in appropriate sprint
- **Development**: Implement story according to requirements
- **Testing**: Execute all test scenarios
- **Code Review**: Peer review of implementation
- **Documentation**: Update technical documentation

### 4. Story Completion
- **Definition of Done**: Verify all completion criteria
- **User Acceptance**: Validate story meets user needs
- **Performance Validation**: Confirm performance requirements
- **Security Review**: Validate security requirements
- **Deployment**: Deploy to production environment

## Story Quality Guidelines

### Story Writing Best Practices
- **User-Focused**: Write from user perspective
- **Specific**: Clear and unambiguous requirements
- **Testable**: Measurable acceptance criteria
- **Independent**: Stories should be self-contained
- **Negotiable**: Allow for implementation flexibility
- **Valuable**: Provide clear business value
- **Estimable**: Can be estimated by development team

### Acceptance Criteria Best Practices
- **SMART Criteria**: Specific, Measurable, Achievable, Relevant, Time-bound
- **Testable**: Can be verified through testing
- **Complete**: Cover all aspects of the story
- **Clear**: Unambiguous and easy to understand
- **Prioritized**: Ordered by importance

### Technical Requirements Best Practices
- **Comprehensive**: Cover all technical aspects
- **Detailed**: Provide sufficient implementation guidance
- **Consistent**: Follow established patterns and standards
- **Scalable**: Consider future growth and changes
- **Secure**: Include security considerations

## Story Metrics and Tracking

### Story Metrics
- **Story Points**: Effort estimation
- **Velocity**: Stories completed per sprint
- **Cycle Time**: Time from start to completion
- **Lead Time**: Time from creation to completion
- **Defect Rate**: Bugs found per story
- **Rework Rate**: Stories requiring rework

### Story Tracking
- **Status Tracking**: Current status of each story
- **Progress Monitoring**: Development progress
- **Blockers**: Issues preventing story completion
- **Dependencies**: Story interdependencies
- **Risks**: Potential issues and mitigation

## Story Review and Retrospective

### Story Review Process
- **Sprint Review**: Present completed stories to stakeholders
- **User Feedback**: Collect user feedback on implemented features
- **Quality Assessment**: Evaluate story quality and completeness
- **Lessons Learned**: Identify improvements for future stories
- **Process Improvement**: Refine story development process

### Retrospective Activities
- **Story Quality**: Review story writing quality
- **Process Effectiveness**: Evaluate development process
- **Team Performance**: Assess team collaboration
- **Tool Usage**: Review tools and techniques
- **Continuous Improvement**: Identify process improvements

## Story Documentation Standards

### Documentation Requirements
- **Completeness**: All required sections included
- **Accuracy**: Information is correct and up-to-date
- **Clarity**: Easy to understand and follow
- **Consistency**: Follows established format and style
- **Accessibility**: Available to all team members

### Documentation Maintenance
- **Regular Updates**: Keep documentation current
- **Version Control**: Track changes and updates
- **Review Process**: Regular documentation reviews
- **Quality Assurance**: Ensure documentation quality
- **Feedback Integration**: Incorporate feedback and improvements

---

**Document Control**
- **Version**: 1.0
- **Last Updated**: December 2024
- **Next Review**: March 2025
- **Approved By**: System Management Team
- **Distribution**: Development Team, Product Team, Management
