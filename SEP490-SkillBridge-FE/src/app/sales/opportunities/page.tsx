'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, User } from 'lucide-react';
import SalesSidebar from '@/components/design-patterns/sales/SalesSidebar';
import { getSalesOpportunities, Opportunity, OpportunitiesListFilters } from '@/services/salesOpportunitiesService';
import { useDebounce } from '@/hooks/useDebounce';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SalesOpportunitiesListPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
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

    // Fetch opportunities
    const fetchOpportunities = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);

            const filters: OpportunitiesListFilters = {
                search: debouncedSearch || undefined,
                status: statusFilter && statusFilter !== 'All' ? [statusFilter] : undefined,
                page: page - 1, // Backend uses 0-based pagination
                size: 10,
            };

            const response = await getSalesOpportunities(filters, token);
            setOpportunities(response.opportunities);
            setTotalPages(response.totalPages);
            setTotal(response.total);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        } finally {
            setLoading(false);
        }
    }, [token, debouncedSearch, statusFilter, page]);

    useEffect(() => {
        if (token) {
            fetchOpportunities();
        }
    }, [token, fetchOpportunities]);

    const handleViewOpportunity = (opportunityId: string) => {
        // Find opportunity by opportunityId and use id for navigation
        const opportunity = opportunities.find(o => o.opportunityId === opportunityId);
        if (opportunity) {
            router.push(`/sales/opportunities/${opportunity.id}`);
        } else {
            console.error('Opportunity not found:', opportunityId);
        }
    };

    const handleFilterChange = (value: string) => {
        setStatusFilter(value);
        setPage(1); // Reset to first page when filter changes
    };

    const formatCurrency = (value: number, currency: string) => {
        if (currency === 'JPY') {
            return `¥${value.toLocaleString('ja-JP')}`;
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(value);
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
            case 'PROPOSAL_DRAFTING': return 'bg-purple-100 text-purple-800';
            case 'PROPOSAL_SENT': return 'bg-yellow-100 text-yellow-800';
            case 'REVISION': return 'bg-pink-100 text-pink-800';
            case 'CLIENT_UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
            case 'WON': return 'bg-green-100 text-green-800';
            case 'LOST': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status: string) => {
        const statusMap: Record<string, string> = {
            'NEW': 'New',
            'IN_PROGRESS': 'In Progress',
            'PROPOSAL_DRAFTING': 'Proposal Drafting',
            'PROPOSAL_SENT': 'Proposal Sent',
            'REVISION': 'Revision',
            'CLIENT_UNDER_REVIEW': 'Client Under Review',
            'WON': 'Won',
            'LOST': 'Lost',
        };
        return statusMap[status] || status;
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
                            <h2 className="text-xl font-semibold text-gray-900">{t('sales.opportunities.title')}</h2>
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
                                placeholder={t('sales.opportunities.search.placeholder')}
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
                                    <SelectValue placeholder={t('sales.opportunities.filter.all')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">{t('sales.opportunities.filter.all')}</SelectItem>
                                    <SelectItem value="NEW">{t('sales.opportunities.filter.new')}</SelectItem>
                                    <SelectItem value="IN_PROGRESS">{t('sales.opportunities.filter.qualifying')}</SelectItem>
                                    <SelectItem value="PROPOSAL_DRAFTING">{t('sales.opportunities.filter.proposal')}</SelectItem>
                                    <SelectItem value="PROPOSAL_SENT">{t('sales.opportunities.filter.proposal')}</SelectItem>
                                    <SelectItem value="REVISION">{t('sales.opportunities.filter.negotiation')}</SelectItem>
                                    <SelectItem value="CLIENT_UNDER_REVIEW">{t('sales.opportunities.filter.clientUnderReview')}</SelectItem>
                                    <SelectItem value="WON">{t('sales.opportunities.filter.approved')}</SelectItem>
                                    <SelectItem value="LOST">{t('sales.opportunities.filter.rejected')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Opportunities Table */}
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('sales.opportunities.table.no')}</TableHead>
                                    <TableHead>{t('sales.opportunities.table.id')}</TableHead>
                                    <TableHead className="text-right">{t('sales.opportunities.table.value')}</TableHead>
                                    <TableHead className="text-right">Probability</TableHead>
                                    <TableHead>Client Email</TableHead>
                                    <TableHead>{t('sales.opportunities.table.clientName')}</TableHead>
                                    <TableHead>{t('sales.opportunities.table.status')}</TableHead>
                                    <TableHead>Assignee</TableHead>
                                    <TableHead>{t('sales.opportunities.table.action')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8">
                                            {t('sales.opportunities.loading')}
                                        </TableCell>
                                    </TableRow>
                                ) : opportunities.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8">
                                            {t('sales.opportunities.empty')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    opportunities.map((opportunity, index) => (
                                        <TableRow key={opportunity.id}>
                                            <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                                            <TableCell>{opportunity.opportunityId}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(opportunity.estValue, opportunity.currency)}
                                            </TableCell>
                                            <TableCell className="text-right">{opportunity.probability}%</TableCell>
                                            <TableCell>{opportunity.clientEmail}</TableCell>
                                            <TableCell>{opportunity.clientName}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadgeColor(opportunity.status)}>
                                                    {formatStatus(opportunity.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{opportunity.assigneeName || '-'}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewOpportunity(opportunity.opportunityId)}
                                                    title="View opportunity details"
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
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <Button
                                    key={pageNum}
                                    variant={pageNum === page ? 'default' : 'outline'}
                                    onClick={() => setPage(pageNum)}
                                    className="w-10"
                                >
                                    {pageNum}
                                </Button>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

