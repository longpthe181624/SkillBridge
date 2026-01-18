#!/usr/bin/env python3
"""
Script to refactor backend code structure from layer-based to domain-based packages.
This script moves files and updates imports automatically.
"""

import os
import re
import shutil
from pathlib import Path

# Base directory
BASE_DIR = Path("backend/src/main/java/com/skillbridge")

# Domain mappings: (old_package, new_package, domain_name)
DOMAIN_MAPPINGS = {
    # Customer/Contact domain
    "customer": {
        "entities": ["Contact", "CommunicationLog", "ContactStatusHistory", "ConsultationCancellation"],
        "repositories": ["ContactRepository", "CommunicationLogRepository", "ContactStatusHistoryRepository", "ConsultationCancellationRepository"],
        "services": ["ContactService", "ContactListService", "ContactDetailService"],
        "controllers": {
            "ContactController": "public/customer",
            "ClientContactController": "client/customer"
        },
        "dtos": {
            "request": ["ContactFormData", "CreateContactRequest", "AddLogRequest", "CommentRequest", "CancelRequest", "ApproveResponse"],
            "response": ["ContactSubmissionResponse", "ContactDetailDTO", "ContactListItemDTO", "ContactListResponse", "CreateContactResponse", "CommunicationLogDTO", "CommentResponse", "CancelResponse"]
        }
    },
    # Contract domain
    "contract": {
        "entities": ["Contract", "ContractHistory", "ChangeRequest"],
        "repositories": ["ContractRepository", "ContractHistoryRepository", "ChangeRequestRepository"],
        "services": ["ContractListService", "ContractDetailService"],
        "controllers": {
            "ClientContractController": "client/contract"
        },
        "dtos": {
            "request": [],
            "response": ["ContractDetailDTO", "ContractListItemDTO", "ContractListResponse", "ContractHistoryItemDTO", "ChangeRequestDTO", "DeliveryItemDTO", "MilestoneDeliverableDTO", "FixedPriceBillingDetailDTO", "RetainerBillingDetailDTO"]
        }
    },
    # Proposal domain
    "proposal": {
        "entities": ["Proposal", "ProposalComment"],
        "repositories": ["ProposalRepository", "ProposalCommentRepository"],
        "services": ["ProposalListService"],
        "controllers": {
            "ClientProposalController": "client/proposal"
        },
        "dtos": {
            "request": [],
            "response": ["ProposalListItemDTO", "ProposalListResponse"]
        }
    },
    # Auth/User domain
    "auth": {
        "entities": ["User", "PasswordResetToken"],
        "repositories": ["UserRepository", "PasswordResetTokenRepository"],
        "services": ["AuthService", "PasswordService"],
        "controllers": {
            "AuthController": "public/auth"
        },
        "dtos": {
            "request": ["LoginRequest", "ForgotPasswordRequest"],
            "response": ["LoginResponse", "LogoutResponse", "ForgotPasswordResponse", "UserDTO"]
        }
    },
    # Common domain
    "common": {
        "entities": ["EmailTemplate"],
        "repositories": ["EmailTemplateRepository"],
        "services": ["EmailService", "NotificationService", "HomepageService"],
        "controllers": {
            "HomepageController": "public/homepage"
        },
        "dtos": {
            "request": [],
            "response": ["HomepageStatistics", "EngineerProfile"]  # EngineerProfile used by Homepage
        }
    }
}

def update_package_declaration(file_path, new_package):
    """Update package declaration in a Java file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace package declaration
    content = re.sub(
        r'^package\s+com\.skillbridge\.[^;]+;',
        f'package {new_package};',
        content,
        flags=re.MULTILINE
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def update_imports(file_path, import_mappings):
    """Update imports in a Java file based on mappings."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update each import
    for old_import, new_import in import_mappings.items():
        pattern = re.escape(old_import)
        content = re.sub(
            rf'import\s+{pattern};',
            f'import {new_import};',
            content
        )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def move_file(src, dst):
    """Move a file and create destination directory if needed."""
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(src), str(dst))

def main():
    print("Starting backend refactoring...")
    
    # This is a template - actual implementation would need to:
    # 1. Move files to new locations
    # 2. Update package declarations
    # 3. Update all imports across all files
    # 4. Handle cross-domain dependencies (e.g., Contact references User)
    
    print("Refactoring script template created.")
    print("Note: Full implementation requires careful handling of cross-domain dependencies.")
    print("Consider doing this refactoring incrementally by domain.")

if __name__ == "__main__":
    main()

