'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, User } from 'lucide-react';
import { getSalesContacts, SalesContact, SalesContactListFilters } from '@/services/salesContactService';
import { useDebounce } from '@/hooks/useDebounce';
import SalesSidebar from '@/components/design-patterns/sales/SalesSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SalesContactListPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<SalesContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  // Load user and token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    } else {
      router.push('/sales/login');
    }
  }, [router]);

  // Redirect if not authenticated or not sales user
  useEffect(() => {
    if (user && user.role !== 'SALES_MANAGER' && user.role !== 'SALES_REP') {
      router.push('/sales/login');
    }
  }, [user, router]);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      
      const filters: SalesContactListFilters = {
        search: debouncedSearch || undefined,
        status: statusFilter && statusFilter !== 'All' ? [statusFilter] : undefined,
        page: page - 1, // Backend uses 0-based pagination
        size: 10,
      };

      const response = await getSalesContacts(filters, token);
      setContacts(response.contacts);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [token, debouncedSearch, statusFilter, page]);

  useEffect(() => {
    if (token) {
      fetchContacts();
    }
  }, [token, fetchContacts]);

  const handleViewContact = (contactId: string) => {
    // Find contact by contactId (display ID) and use internalId for navigation
    const contact = contacts.find(c => c.contactId === contactId);
    if (contact && contact.internalId) {
      router.push(`/sales/contacts/${contact.internalId}`);
    } else {
      // Fallback: try to find by internalId if contactId is actually an ID
      const contactByInternalId = contacts.find(c => c.internalId.toString() === contactId);
      if (contactByInternalId) {
        router.push(`/sales/contacts/${contactByInternalId.internalId}`);
      } else {
        console.error('Contact not found:', contactId);
      }
    }
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page when filter changes
  };

  const getStatusBadgeColor = (status: string) => {
    const statusUpper = status.toUpperCase().replace(/\s+/g, '_');
    switch (statusUpper) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'INPROGRESS': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'CONVERTED_TO_OPPORTUNITY': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayName = (status: string) => {
    const statusUpper = status.toUpperCase().replace(/\s+/g, '_');
    switch (statusUpper) {
      case 'NEW': return 'New';
      case 'INPROGRESS': return 'In Progress';
      case 'COMPLETED': return 'Completed';
      case 'CLOSED': return 'Closed';
      case 'CONVERTED_TO_OPPORTUNITY': return 'Converted to Opportunity';
      default: return status;
    }
  };

  if (!user || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <SalesSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{t('sales.contacts.title')}</h2>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{user?.fullName || 'Admin'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-white">
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <Input
                type="text"
                placeholder={t('sales.contacts.search.placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder={t('sales.contacts.filter.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t('sales.contacts.filter.all')}</SelectItem>
                  <SelectItem value="NEW">{t('sales.contacts.filter.new')}</SelectItem>
                  <SelectItem value="INPROGRESS">{t('sales.contacts.filter.inProgress')}</SelectItem>
                  <SelectItem value="CONVERTED_TO_OPPORTUNITY">{t('sales.contacts.filter.convertedToOpportunity')}</SelectItem>
                  <SelectItem value="CLOSED">{t('sales.contacts.filter.closed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('sales.contacts.table.no')}</TableHead>
                  <TableHead>{t('sales.contacts.table.id')}</TableHead>
                  <TableHead>{t('sales.contacts.table.clientName')}</TableHead>
                  <TableHead>{t('sales.contacts.table.clientEmail')}</TableHead>
                  <TableHead>{t('sales.contacts.table.company')}</TableHead>
                  <TableHead>{t('sales.contacts.table.title')}</TableHead>
                  <TableHead>{t('sales.contacts.table.status')}</TableHead>
                  <TableHead>{t('sales.contacts.table.assignee')}</TableHead>
                  <TableHead>{t('sales.contacts.table.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      {t('sales.contacts.loading')}
                    </TableCell>
                  </TableRow>
                ) : contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      {t('sales.contacts.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact.internalId} className="hover:bg-gray-50">
                      <TableCell>{contact.no}</TableCell>
                      <TableCell className="font-mono">{contact.contactId}</TableCell>
                      <TableCell className="font-semibold">{contact.clientName || '-'}</TableCell>
                      <TableCell>{contact.clientEmail || '-'}</TableCell>
                      <TableCell>{contact.company || '-'}</TableCell>
                      <TableCell>{contact.title || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(contact.status)}>
                          {getStatusDisplayName(contact.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{contact.assigneeName || '-'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewContact(contact.contactId)}
                          title="View contact details"
                          className="hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4" />
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
            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
              >
                {t('sales.contacts.pagination.previous')}
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
              >
                {t('sales.contacts.pagination.next')}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

