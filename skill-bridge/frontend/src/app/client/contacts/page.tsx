'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Eye } from 'lucide-react';
import { ClientSidebar } from '@/components/design-patterns/client/ClientSidebar';
import { ClientHeader } from '@/components/design-patterns/client/ClientHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContacts, createContact } from '@/services/contactService';
import { ContactListItem } from '@/types/contact';
import { cn } from '@/lib/utils';
import CreateContactModal from '@/components/CreateContactModal';

export default function ContactListPage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [contacts, setContacts] = useState<ContactListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const pageSize = 20;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(0); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch contacts function
  const fetchContacts = async () => {
    if (!token || !isAuthenticated) return;

    try {
      setLoading(true);
      const response = await getContacts(token, {
        search: debouncedSearch || undefined,
        status: statusFilter,
        page: currentPage,
        size: pageSize,
      });
      
      // Debug: Check if internalId is present in response
      if (response.contacts && response.contacts.length > 0) {
        const sampleContact = response.contacts[0];
        console.log('Contacts response sample:', {
          id: sampleContact.id,
          internalId: sampleContact.internalId,
          internal_id: (sampleContact as any).internal_id, // Check camelCase vs snake_case
          hasInternalId: 'internalId' in sampleContact,
          allKeys: Object.keys(sampleContact),
          fullContact: sampleContact
        });
      }
      
      setContacts(response.contacts);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts on mount and when dependencies change
  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAuthenticated, debouncedSearch, statusFilter, currentPage]);

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(0); // Reset to first page on filter change
  };

  // Handle create new contact
  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  // Handle create contact submit
  const handleCreateContactSubmit = async (title: string, description: string) => {
    if (!token) {
      throw new Error('Authentication required');
    }

    await createContact(token, { title, description });
    
    // Reset to first page and refresh contact list
    setCurrentPage(0);
    // Wait a bit for the state to update
    setTimeout(() => {
      fetchContacts();
    }, 100);
  };

  // Handle view details
  // Note: internalId is the primary key (contact.id) from database
  // Display ID (contact.id) is just for display, we use internalId for navigation
  const handleViewDetails = (displayId: string) => {
    // Find the contact by display ID
    const contact = contacts.find(c => c.id === displayId);
    
    if (!contact) {
      console.error('Contact not found:', displayId);
      alert('Contact not found. Please refresh the page and try again.');
      return;
    }
    
    // Use internalId (primary key) for navigation
    // internalId should always be present as it's the database primary key
    const primaryKeyId = contact.internalId || (contact as any).internal_id;
    
    if (primaryKeyId) {
      router.push(`/client/contacts/${primaryKeyId}`);
    } else {
      console.error('Cannot view contact detail - missing primary key (internalId):', {
        displayId,
        contact,
        availableContacts: contacts.length > 0 ? contacts[0] : null
      });
      alert('Cannot view contact detail: Missing primary key. Please refresh the page and try again.');
    }
  };

  // Get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'New':
        return 'default';
      case 'Converted to Opportunity':
        return 'secondary';
      case 'Closed':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Get status badge color class
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Converted to Opportunity':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get translated status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'New':
        return t('client.contactList.status.new');
      case 'Converted to Opportunity':
        return t('client.contactList.status.converted');
      case 'Closed':
        return t('client.contactList.status.closed');
      default:
        return status;
    }
  };

  // Show loading or auth check
  if (authLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <ClientSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <ClientHeader titleKey="client.header.title.contactManagement" />

        {/* Main Content Area */}
        <div className="flex-1 p-6 bg-gray-50">
          {/* Search and Filter Controls */}
          <div className="flex gap-4 mb-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <Input
                type="text"
                placeholder={t('client.contactList.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder={t('client.contactList.filter.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t('client.contactList.status.all')}</SelectItem>
                  <SelectItem value="New">{t('client.contactList.status.new')}</SelectItem>
                  <SelectItem value="Converted to Opportunity">{t('client.contactList.status.converted')}</SelectItem>
                  <SelectItem value="Closed">{t('client.contactList.status.closed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Create New Button */}
            <Button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('client.contactList.createNew')}
            </Button>
          </div>

          {/* Contact Table */}
          <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">{t('client.contactList.table.no')}</TableHead>
                  <TableHead>{t('client.contactList.table.title')}</TableHead>
                  <TableHead>{t('client.contactList.table.description')}</TableHead>
                  <TableHead>{t('client.contactList.table.createdOn')}</TableHead>
                  <TableHead>{t('client.contactList.table.status')}</TableHead>
                  <TableHead className="w-20">{t('client.contactList.table.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {t('client.contactList.loading')}
                    </TableCell>
                  </TableRow>
                ) : contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {t('client.contactList.noContacts')}
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>{contact.no}</TableCell>
                      <TableCell>{contact.title}</TableCell>
                      <TableCell className="max-w-md truncate" title={contact.description}>
                        {contact.description}
                      </TableCell>
                      <TableCell>{contact.createdOn}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(contact.status)}
                          className={getStatusBadgeColor(contact.status)}
                        >
                          {getStatusLabel(contact.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(contact.id)}
                          className="hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                {t('client.contactList.pagination.previous')}
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage < 3) {
                    pageNum = i;
                  } else if (currentPage > totalPages - 4) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-10",
                        currentPage === pageNum && "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                {t('client.contactList.pagination.next')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Contact Modal */}
      <CreateContactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateContactSubmit}
      />
    </div>
  );
}

