'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Eye } from 'lucide-react';
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
import { getProposals } from '@/services/proposalService';
import { ProposalListItem } from '@/types/proposal';
import { cn } from '@/lib/utils';

export default function ProposalListPage() {
    const { user, token, isAuthenticated, loading: authLoading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const [proposals, setProposals] = useState<ProposalListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
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

    // Fetch proposals function
    const fetchProposals = async () => {
        if (!token || !isAuthenticated) return;

        try {
            setLoading(true);
            const response = await getProposals(token, {
                search: debouncedSearch || undefined,
                status: statusFilter,
                page: currentPage,
                size: pageSize,
            });

            setProposals(response.proposals);
            setCurrentPage(response.currentPage);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Error fetching proposals:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch proposals on mount and when dependencies change
    useEffect(() => {
        fetchProposals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, isAuthenticated, debouncedSearch, statusFilter, currentPage]);

    // Handle filter change
    const handleFilterChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(0); // Reset to first page on filter change
    };

    // Handle view details - navigate to Contact Detail screen
    const handleViewDetails = (contactInternalId: number) => {
        // Navigate to Contact Detail screen with contact ID
        router.push(`/client/contacts/${contactInternalId}`);
    };

    // Get status badge color class
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Under review':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Request for change':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Approved':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Get translated status label
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Under review':
                return t('client.proposalList.status.underReview');
            case 'Request for change':
                return t('client.proposalList.status.requestForChange');
            case 'Approved':
                return t('client.proposalList.status.approved');
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
                <ClientHeader titleKey="client.header.title.proposalManagement" />

                {/* Main Content Area */}
                <div className="flex-1 p-6 bg-white">
                    {/* Search and Filter Controls */}
                    <div className="flex gap-4 mb-6 items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <Input
                                type="text"
                                placeholder={t('client.proposalList.search')}
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
                                    <SelectValue placeholder={t('client.proposalList.filter.placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">{t('client.proposalList.status.all')}</SelectItem>
                                    <SelectItem value="Under review">{t('client.proposalList.status.underReview')}</SelectItem>
                                    <SelectItem value="Request for change">{t('client.proposalList.status.requestForChange')}</SelectItem>
                                    <SelectItem value="Approved">{t('client.proposalList.status.approved')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Proposal Table */}
                    <div className="border rounded-lg overflow-hidden bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">{t('client.proposalList.table.no')}</TableHead>
                                    <TableHead>{t('client.proposalList.table.id')}</TableHead>
                                    <TableHead>{t('client.proposalList.table.contactId')}</TableHead>
                                    <TableHead>{t('client.proposalList.table.contactDescription')}</TableHead>
                                    <TableHead>{t('client.proposalList.table.createdOn')}</TableHead>
                                    <TableHead>{t('client.proposalList.table.status')}</TableHead>
                                    <TableHead>{t('client.proposalList.table.lastUpdated')}</TableHead>
                                    <TableHead className="w-20">{t('client.proposalList.table.action')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                            {t('client.proposalList.loading')}
                                        </TableCell>
                                    </TableRow>
                                ) : proposals.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                            {t('client.proposalList.noProposals')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    proposals.map((proposal) => (
                                        <TableRow key={proposal.id}>
                                            <TableCell>{proposal.no}</TableCell>
                                            <TableCell>{proposal.id}</TableCell>
                                            <TableCell>{proposal.contactId}</TableCell>
                                            <TableCell className="max-w-md truncate" title={proposal.contactDescription}>
                                                {proposal.contactDescription}
                                            </TableCell>
                                            <TableCell>{proposal.createdOn}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusBadgeColor(proposal.status)}
                                                >
                                                    {getStatusLabel(proposal.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{proposal.lastUpdated}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleViewDetails(proposal.contactInternalId)}
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
                                {t('client.proposalList.pagination.previous')}
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
                                {t('client.proposalList.pagination.next')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

