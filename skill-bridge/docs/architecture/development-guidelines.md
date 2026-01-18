# Development Guidelines

## Coding Standards

### Backend (Spring Boot) Standards
```java
// Entity Example
@Entity
@Table(name = "contacts")
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "client_id", nullable = false)
    private Integer clientId;
    
    @Enumerated(EnumType.STRING)
    private ContactStatus status;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors, getters, setters
}

// Controller Example
@RestController
@RequestMapping("/api/contacts")
@Validated
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts() {
        List<Contact> contacts = contactService.findAll();
        return ResponseEntity.ok(contacts);
    }
    
    @PostMapping
    public ResponseEntity<Contact> createContact(@Valid @RequestBody Contact contact) {
        Contact savedContact = contactService.save(contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedContact);
    }
}
```

### Frontend (Next.js) Standards
```typescript
// Component Example
interface Contact {
  id: number;
  clientId: number;
  status: 'NEW' | 'IN_PROGRESS' | 'VERIFIED' | 'CONVERTED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
}

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {contacts.map(contact => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
};
```

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/skillbridge/
│   │   │       ├── SkillBridgeApplication.java
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   └── DatabaseConfig.java
│   │   │       ├── controller/
│   │   │       │   ├── ContactController.java
│   │   │       │   ├── EngineerController.java
│   │   │       │   └── ContractController.java
│   │   │       ├── service/
│   │   │       │   ├── ContactService.java
│   │   │       │   ├── EngineerService.java
│   │   │       │   └── ContractService.java
│   │   │       ├── repository/
│   │   │       │   ├── ContactRepository.java
│   │   │       │   ├── EngineerRepository.java
│   │   │       │   └── ContractRepository.java
│   │   │       ├── entity/
│   │   │       │   ├── Contact.java
│   │   │       │   ├── Engineer.java
│   │   │       │   └── Contract.java
│   │   │       └── dto/
│   │   │           ├── ContactDto.java
│   │   │           ├── EngineerDto.java
│   │   │           └── ContractDto.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── data.sql
│   └── test/
│       └── java/
├── pom.xml
└── README.md
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── contacts/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── engineers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── contracts/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── ContactCard.tsx
│   │   ├── EngineerCard.tsx
│   │   └── ContractCard.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── contact.ts
│   │   ├── engineer.ts
│   │   └── contract.ts
│   └── styles/
│       └── globals.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Development Workflow

### Git Workflow
```bash
# Feature Development
git checkout -b feature/contact-management
# Make changes
git add .
git commit -m "Add contact management functionality"
git push origin feature/contact-management
# Create Pull Request

# Bug Fix
git checkout -b bugfix/fix-contact-validation
# Fix the bug
git add .
git commit -m "Fix contact validation issue"
git push origin bugfix/fix-contact-validation
```

### Testing Strategy
```java
// Unit Test Example
@ExtendWith(MockitoExtension.class)
class ContactServiceTest {
    
    @Mock
    private ContactRepository contactRepository;
    
    @InjectMocks
    private ContactService contactService;
    
    @Test
    void shouldCreateContact() {
        // Given
        Contact contact = new Contact();
        contact.setClientId(1);
        contact.setStatus(ContactStatus.NEW);
        
        when(contactRepository.save(any(Contact.class))).thenReturn(contact);
        
        // When
        Contact result = contactService.save(contact);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(ContactStatus.NEW);
        verify(contactRepository).save(contact);
    }
}
```

## Performance Guidelines

### Database Optimization
```sql
-- Use appropriate indexes
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_sales_rep ON contacts(sales_rep_id);

-- Use LIMIT for pagination
SELECT * FROM contacts 
WHERE status = 'NEW' 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;

-- Use JOIN instead of multiple queries
SELECT c.*, cl.company_name 
FROM contacts c 
JOIN clients cl ON c.client_id = cl.id;
```

### Frontend Optimization
```typescript
// Use React.memo for expensive components
const ContactCard = React.memo(({ contact }: { contact: Contact }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3>{contact.clientName}</h3>
      <p>Status: {contact.status}</p>
    </div>
  );
});

// Use useMemo for expensive calculations
const filteredContacts = useMemo(() => {
  return contacts.filter(contact => contact.status === 'NEW');
}, [contacts]);

// Use useCallback for event handlers
const handleContactUpdate = useCallback((id: number, updates: Partial<Contact>) => {
  // Update logic
}, []);
```

## Documentation Standards

### API Documentation
```java
@RestController
@RequestMapping("/api/contacts")
@Tag(name = "Contact Management", description = "APIs for managing contacts")
public class ContactController {
    
    @Operation(summary = "Get all contacts", description = "Retrieve all contacts with pagination")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved contacts"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts(
        @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
        @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size
    ) {
        // Implementation
    }
}
```

### Code Documentation
```java
/**
 * Service class for managing contacts
 * Handles business logic for contact operations including CRUD operations
 * and contact lifecycle management
 */
@Service
@Transactional
public class ContactService {
    
    /**
     * Creates a new contact
     * @param contact the contact to create
     * @return the created contact with generated ID
     * @throws ValidationException if contact data is invalid
     */
    public Contact createContact(Contact contact) {
        // Implementation
    }
}
```
