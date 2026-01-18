'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, User, Plus } from 'lucide-react';
import { getSalesContracts, SalesContractListFilters } from '@/services/salesContractService';
import { ContractListItem } from '@/types/contract';
import { useDebounce } from '@/hooks/useDebounce';
import SalesSidebar from '@/components/design-patterns/sales/SalesSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SalesContractListPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [contracts, setContracts] = useState<ContractListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    // Debounce search input
    const debouncedSearch = useDebounce(search, 300);

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

    // Fetch contracts
    const fetchContracts = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);

            const filters: SalesContractListFilters = {
                search: debouncedSearch || undefined,
                status: statusFilter && statusFilter !== 'All' ? statusFilter : undefined,
                page: page,
                size: 10,
            };

            const response = await getSalesContracts(filters, token);
            setContracts(response.contracts);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        } finally {
            setLoading(false);
        }
    }, [token, debouncedSearch, statusFilter, page]);

    useEffect(() => {
        if (token) {
            fetchContracts();
        }
    }, [token, fetchContracts]);

    const handleViewContract = (contract: ContractListItem) => {
        // Navigate to contract detail page based on contract type
        if (contract.type === 'SOW') {
            router.push(`/sales/contracts/sow/${contract.internalId}`);
        } else {
            router.push(`/sales/contracts/${contract.internalId}`);
        }
    };


    const handleFilterChange = (value: string) => {
        setStatusFilter(value);
        setPage(0); // Reset to first page when filter changes
    };

    const getStatusBadgeColor = (status: string) => {
        const statusLower = status.toLowerCase().replace(/\s+/g, '');
        switch (statusLower) {
            case 'requestforchange':
                return 'bg-orange-100 text-orange-800';
            case 'internalreview':
            case 'underreview':
                return 'bg-blue-100 text-blue-800';
            case 'clientunderreview':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'terminated':
                return 'bg-gray-100 text-gray-800';
            case 'draft':
                return 'bg-gray-100 text-gray-600';
            case 'active':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusDisplayName = (status: string) => {
        return status.replace(/_/g, ' ');
    };

    const formatPeriod = (start: string | null, end: string | null): string => {
        if (!start && !end) return '-';
        if (!start) return `-${end}`;
        if (!end) return start;
        return `${start}-${end}`;
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
                            <h2 className="text-xl font-semibold text-gray-900">{t('sales.contracts.title')}</h2>
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
                    {/* Search and Filter Controls */}
                    <div className="flex gap-4 mb-6 items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <Input
                                type="text"
                                placeholder={t('sales.contracts.search.placeholder')}
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
                                    <SelectValue placeholder={t('sales.contracts.filter.all')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">{t('sales.contracts.filter.all')}</SelectItem>
                                    <SelectItem value="Draft">{t('sales.contracts.filter.draft')}</SelectItem>
                                    <SelectItem value="Internal Review">{t('sales.contracts.filter.internalReview')}</SelectItem>
                                    <SelectItem value="Client Under Review">{t('sales.contracts.filter.clientUnderReview')}</SelectItem>
                                    <SelectItem value="Active">{t('sales.contracts.filter.active')}</SelectItem>
                                    <SelectItem value="Completed">{t('sales.contracts.filter.completed')}</SelectItem>
                                    <SelectItem value="Terminated">{t('sales.contracts.filter.terminated')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Create New Button */}
                        <Button onClick={() => router.push('/sales/contracts/new')} className="ml-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            {t('sales.contracts.createNew')}
                        </Button>
                    </div>

                    {/* Contract Table */}
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('sales.contracts.table.no')}</TableHead>
                                    <TableHead>{t('sales.contracts.table.id')}</TableHead>
                                    <TableHead>{t('sales.contracts.table.contractName')}</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>{t('sales.contracts.table.type')}</TableHead>
                                    <TableHead>{t('sales.contracts.table.period')}</TableHead>
                                    <TableHead className="text-right">{t('sales.contracts.table.value')}</TableHead>
                                    <TableHead>{t('sales.contracts.table.status')}</TableHead>
                                    <TableHead>{t('sales.contracts.table.action')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8">
                                            {t('sales.contracts.loading')}
                                        </TableCell>
                                    </TableRow>
                                ) : contracts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8">
                                            {t('sales.contracts.empty')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    contracts.map((contract) => (
                                        <TableRow key={`${contract.type}-${contract.internalId}`} className="hover:bg-gray-50">
                                            <TableCell>{contract.no}</TableCell>
                                            <TableCell className="font-mono">{contract.id}</TableCell>
                                            <TableCell className="max-w-xs truncate" title={contract.contractName}>
                                                {contract.contractName}
                                            </TableCell>
                                            <TableCell className="font-semibold">{contract.clientName || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={contract.type === 'MSA' ? 'default' : 'secondary'}>
                                                    {contract.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {contract.period || formatPeriod(contract.periodStart, contract.periodEnd)}
                                            </TableCell>
                                            <TableCell className="text-right">{contract.formattedValue || '-'}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadgeColor(contract.status)}>
                                                    {getStatusDisplayName(contract.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewContract(contract)}
                                                    title="View contract details"
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
                                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                disabled={page === 0}
                            >
                                {t('sales.contracts.pagination.previous')}
                            </Button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i;
                                } else if (page <= 2) {
                                    pageNum = i;
                                } else if (page >= totalPages - 3) {
                                    pageNum = totalPages - 5 + i;
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
                                        {pageNum + 1}
                                    </Button>
                                );
                            })}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={page === totalPages - 1}
                            >
                                {t('sales.contracts.pagination.next')}
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

