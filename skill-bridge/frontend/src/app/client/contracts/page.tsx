'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Eye, AlertCircle } from 'lucide-react';
import Link from 'next/link';
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
import { getContractList } from '@/services/contractService';
import { ContractListItem } from '@/types/contract';

export default function ContractListPage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');

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

  // Fetch contracts function
  const fetchContracts = async () => {
    if (!token || !isAuthenticated) return;

    try {
      setLoading(true);
      const response = await getContractList(token, {
        search: debouncedSearch || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        type: typeFilter !== 'All' ? typeFilter : undefined,
        page: currentPage,
        size: pageSize,
      });
      
      setContracts(response.contracts);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch contracts when filters or page change
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchContracts();
    }
  }, [debouncedSearch, statusFilter, typeFilter, currentPage, isAuthenticated, token]);

  const handleViewDetails = (contract: ContractListItem) => {
    // Use primary key (internalId) for navigation
    router.push(`/client/contracts/${contract.internalId}`);
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(0); // Reset to first page on filter change
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(0); // Reset to first page on filter change
  };

  const formatPeriod = (start: string | null, end: string | null): string => {
    if (!start && !end) return '-';
    if (!start) return `-${end}`;
    if (!end) return start;
    return `${start}-${end}`;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default'; // Green
      case 'draft':
        return 'secondary'; // Gray
      case 'pending':
        return 'outline'; // Yellow
      case 'under review':
        return 'default'; // Blue
      case 'request for change':
        return 'outline'; // Yellow/Orange
      case 'completed':
        return 'default';
      case 'terminated':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getCloseRequestBadgeVariant = (status?: string | null) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'pending') return 'outline';
    if (normalized === 'clientapproved') return 'default';
    if (normalized === 'rejected') return 'destructive';
    return 'secondary';
  };

  const getCloseRequestLabel = (status?: string | null) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'pending') return 'Close Request Pending';
    if (normalized === 'clientapproved') return 'Close Request Approved';
    if (normalized === 'rejected') return 'Close Request Rejected';
    return 'Close Request';
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
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
        <ClientHeader titleKey="client.header.title.contractManagement" />

        {/* Main Content Area */}
        <div className="flex-1 p-6 bg-gray-50">
          {/* Search and Filter Controls */}
          <div className="flex gap-4 mb-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <Input
                type="text"
                placeholder={t('client.contractList.search.placeholder')}
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
                  <SelectValue placeholder={t('client.contractList.filter.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t('client.contractList.filter.all')}</SelectItem>
                  <SelectItem value="Active">{t('client.contractList.filter.active')}</SelectItem>
                  <SelectItem value="Pending">{t('client.contractList.filter.pending')}</SelectItem>
                  <SelectItem value="Under Review">{t('client.contractList.filter.underReview')}</SelectItem>
                  <SelectItem value="Request for Change">{t('client.contractList.filter.requestForChange')}</SelectItem>
                  <SelectItem value="Completed">{t('client.contractList.filter.completed')}</SelectItem>
                  <SelectItem value="Terminated">{t('client.contractList.filter.terminated')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                <SelectTrigger className="w-[150px] bg-white">
                  <SelectValue placeholder={t('client.contractList.filter.type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t('client.contractList.filter.all')}</SelectItem>
                  <SelectItem value="MSA">{t('client.contractList.filter.msa')}</SelectItem>
                  <SelectItem value="SOW">{t('client.contractList.filter.sow')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contract Table */}
          <div className="bg-white rounded-lg shadow border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('client.contractList.table.no')}</TableHead>
                  <TableHead>{t('client.contractList.table.id')}</TableHead>
                  <TableHead>{t('client.contractList.table.contractName')}</TableHead>
                  <TableHead>{t('client.contractList.table.type')}</TableHead>
                  <TableHead>{t('client.contractList.table.period')}</TableHead>
                  <TableHead>{t('client.contractList.table.value')}</TableHead>
                  <TableHead>{t('client.contractList.table.status')}</TableHead>
                  <TableHead>{t('client.contractList.table.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      {t('client.contractList.loading')}
                    </TableCell>
                  </TableRow>
                ) : contracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      {t('client.contractList.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  contracts.map((contract) => (
                    <TableRow key={`${contract.type}-${contract.internalId}`}>
                      <TableCell>{contract.no}</TableCell>
                      <TableCell>{contract.id}</TableCell>
                      <TableCell className="max-w-xs truncate" title={contract.contractName}>
                        {contract.contractName}
                      </TableCell>
                      <TableCell>
                        <Badge variant={contract.type === 'MSA' ? 'default' : 'secondary'}>
                          {contract.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {contract.period || formatPeriod(contract.periodStart, contract.periodEnd)}
                      </TableCell>
                      <TableCell>{contract.formattedValue || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(contract.status)}>
                          {t(`client.contractList.status.${contract.status.toLowerCase().replace(/\s+/g, '')}`) || contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* Close Request indicator only when pending close request exists */}
                          {contract.type === 'SOW' &&
                           (contract.closeRequestPending === true ||
                            (contract.closeRequestStatus &&
                              contract.closeRequestStatus.toLowerCase().includes('pending'))) && (
                            <Link href={`/client/contracts/sow/${contract.internalId}/close-request/review`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                                title="Close Request Pending Review"
                              >
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Review Close Request
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(contract)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end gap-2 mt-4">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-8 w-8"
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-2 py-1">...</span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(totalPages - 1)}
                    className="h-8 w-8"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

