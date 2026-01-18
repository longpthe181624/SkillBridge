# Backend Refactoring Guide - Layer to Domain Structure

## Overview
Refactoring backend code from layer-based structure to domain-based structure for better maintainability.

## Completed
✅ **Engineer Domain** - Fully migrated
- Entities: `Engineer`, `Skill`, `Certificate`, `EngineerSkill`, `EngineerSkillId`
- Repositories: `EngineerRepository`, `EngineerSkillRepository`, `CertificateRepository`
- Services: `EngineerService`, `EngineerSearchService`
- Controllers: `EngineerDetailController`, `EngineerSearchController` (in `controller/public/engineer/`)
- DTOs: All engineer-related DTOs in `dto/engineer/request/` and `dto/engineer/response/`

## Remaining Domains to Migrate

### 1. Customer/Contact Domain
**Entities to move:**
- `Contact` → `entity/customer/Contact.java`
- `CommunicationLog` → `entity/customer/CommunicationLog.java`
- `ContactStatusHistory` → `entity/customer/ContactStatusHistory.java`
- `ConsultationCancellation` → `entity/customer/ConsultationCancellation.java`

**Repositories to move:**
- `ContactRepository` → `repository/customer/ContactRepository.java`
- `CommunicationLogRepository` → `repository/customer/CommunicationLogRepository.java`
- `ContactStatusHistoryRepository` → `repository/customer/ContactStatusHistoryRepository.java`
- `ConsultationCancellationRepository` → `repository/customer/ConsultationCancellationRepository.java`

**Services to move:**
- `ContactService` → `service/customer/ContactService.java`
- `ContactListService` → `service/customer/ContactListService.java`
- `ContactDetailService` → `service/customer/ContactDetailService.java`

**Controllers to move:**
- `ContactController` → `controller/public/customer/ContactController.java`
- `ClientContactController` → `controller/client/customer/ClientContactController.java`

**DTOs to move:**
- Request DTOs → `dto/customer/request/`
- Response DTOs → `dto/customer/response/`

### 2. Contract Domain
**Entities:**
- `Contract`, `ContractHistory`, `ChangeRequest`

**Controllers:**
- `ClientContractController` → `controller/client/contract/ClientContractController.java`

### 3. Proposal Domain
**Entities:**
- `Proposal`, `ProposalComment`

**Controllers:**
- `ClientProposalController` → `controller/client/proposal/ClientProposalController.java`

### 4. Auth/User Domain
**Entities:**
- `User`, `PasswordResetToken`

**Controllers:**
- `AuthController` → `controller/public/auth/AuthController.java`

### 5. Common Domain
**Entities:**
- `EmailTemplate`

**Services:**
- `EmailService`, `NotificationService`, `HomepageService`

**Controllers:**
- `HomepageController` → `controller/public/homepage/HomepageController.java`

## Import Update Rules

When moving files, update imports as follows:

1. **Entity imports:**
   - `com.skillbridge.entity.Engineer` → `com.skillbridge.entity.engineer.Engineer`
   - `com.skillbridge.entity.Contact` → `com.skillbridge.entity.customer.Contact`
   - `com.skillbridge.entity.User` → `com.skillbridge.entity.auth.User`
   - etc.

2. **Repository imports:**
   - `com.skillbridge.repository.EngineerRepository` → `com.skillbridge.repository.engineer.EngineerRepository`
   - etc.

3. **Service imports:**
   - `com.skillbridge.service.EngineerService` → `com.skillbridge.service.engineer.EngineerService`
   - etc.

4. **DTO imports:**
   - `com.skillbridge.dto.EngineerDetailDTO` → `com.skillbridge.dto.engineer.response.EngineerDetailDTO`
   - `com.skillbridge.dto.SearchCriteria` → `com.skillbridge.dto.engineer.request.SearchCriteria`
   - etc.

5. **Controller imports:**
   - Update all imports to reference new package locations

## Cross-Domain Dependencies

Some entities reference entities from other domains:
- `Contact` references `User` (auth domain)
- `CommunicationLog` references `User` (auth domain)
- `Proposal` references `Contact` (customer domain) and `User` (auth domain)
- etc.

When updating imports, ensure cross-domain references use full package paths:
- `import com.skillbridge.entity.auth.User;`
- `import com.skillbridge.entity.customer.Contact;`

## Steps to Complete Migration

1. **Move Auth/User domain first** (since many other domains depend on it)
2. **Move Customer/Contact domain** (since Proposal depends on it)
3. **Move Contract domain**
4. **Move Proposal domain**
5. **Move Common domain**
6. **Update all imports** across all files
7. **Test compilation** and fix any errors
8. **Delete old files** after verification

## Testing

After each domain migration:
1. Compile the project
2. Fix any import errors
3. Run tests if available
4. Verify API endpoints still work

## Notes

- Keep old files until new structure is fully tested
- Update `HomepageService` to use new `EngineerProfile` location
- Update all JPA queries that reference entity classes
- Update all `@Query` annotations with entity class names

