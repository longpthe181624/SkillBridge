'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, ArrowLeft } from 'lucide-react';
import SalesSidebar from '@/components/design-patterns/sales/SalesSidebar';
import {
    getOpportunityDetail,
    updateOpportunity,
    createOpportunityFromContact,
    getContactDataForOpportunity,
    createProposal,
    updateProposal,
    assignReviewer,
    submitReview,
    markOpportunityAsLost,
    getPresignedUrl,
    OpportunityDetail,
    UpdateOpportunityRequest,
    CreateOpportunityRequest,
    AssignReviewerRequest,
    SubmitReviewRequest,
} from '@/services/salesOpportunityDetailService';
import { getSalesUsers, SalesUser } from '@/services/salesContactDetailService';
import ProposalModal from '@/components/sales/ProposalModal';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SalesOpportunityDetailPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const opportunityId = params.opportunityId as string;
    const contactId = searchParams.get('contactId');
    const isCreateMode = opportunityId === 'new';
    const { toast } = useToast();
    const { t } = useLanguage();

    const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [formData, setFormData] = useState<UpdateOpportunityRequest>({});
    const [salesMen, setSalesMen] = useState<SalesUser[]>([]);
    const [salesManagers, setSalesManagers] = useState<SalesUser[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');
    const [reviewAction, setReviewAction] = useState<string>('APPROVE');
    const [assigningReviewer, setAssigningReviewer] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showMarkLostDialog, setShowMarkLostDialog] = useState(false);

    // Load user and token from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                console.error('Error parsing user:', e);
                router.push('/sales/login');
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

    // Fetch opportunity detail or contact data
    useEffect(() => {
        if (token) {
            if (isCreateMode && contactId) {
                fetchContactData();
            } else if (!isCreateMode) {
                fetchOpportunityDetail();
            }
            fetchSalesUsers();
        }
    }, [token, opportunityId, contactId, isCreateMode]);

    const fetchSalesUsers = async () => {
        if (!token) return;

        try {
            const users = await getSalesUsers(token);
            // Filter to get only Sales Men (SALES_REP) for assignee dropdown
            const salesReps = users.filter(u => u.role === 'SALES_REP');
            setSalesMen(salesReps);
            // Filter to get Sales Managers for reviewer dropdown
            const managers = users.filter(u => u.role === 'SALES_MANAGER');
            setSalesManagers(managers);
        } catch (error) {
            console.error('Error fetching sales users:', error);
        }
    };

    const fetchContactData = async () => {
        if (!token || !contactId) return;

        try {
            setLoading(true);
            setError(null);
            const contactIdNum = parseInt(contactId);
            const contactData = await getContactDataForOpportunity(contactIdNum, token);

            // Pre-populate form data from contact
            setFormData({
                clientName: contactData.clientName,
                clientCompany: contactData.clientCompany || undefined,
                clientEmail: contactData.clientEmail,
                assigneeUserId: contactData.assigneeUserId || undefined,
                probability: 0,
                estValue: 0,
                currency: 'JPY',
            });
        } catch (error: any) {
            console.error('Error fetching contact data:', error);
            setError(error.message || 'Failed to load contact data');
        } finally {
            setLoading(false);
        }
    };

    const fetchOpportunityDetail = async () => {
        if (!token || !opportunityId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await getOpportunityDetail(opportunityId, token);
            setOpportunity(data);
            setFormData({
                clientName: data.clientName,
                clientCompany: data.clientCompany || undefined,
                clientEmail: data.clientEmail,
                assigneeUserId: data.assigneeUserId || undefined,
                probability: data.probability,
                estValue: data.estValue,
                currency: data.currency,
            });
            // Set review notes if proposal exists
            if (data.proposal) {
                setReviewNotes(data.proposal.reviewNotes || '');
                setReviewAction(data.proposal.reviewAction || 'APPROVE');
            }
        } catch (error: any) {
            console.error('Error fetching opportunity detail:', error);
            setError(error.message || 'Failed to load opportunity detail');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!token) return;

        try {
            setSaving(true);
            setError(null);

            if (isCreateMode && contactId) {
                // Create new opportunity from contact
                const contactIdNum = parseInt(contactId);
                const createRequest: CreateOpportunityRequest = {
                    clientName: formData.clientName!,
                    clientCompany: formData.clientCompany,
                    clientEmail: formData.clientEmail!,
                    assigneeUserId: formData.assigneeUserId || null,
                    probability: formData.probability || 0,
                    estValue: formData.estValue || 0,
                    currency: formData.currency || 'JPY',
                };
                const newOpportunity = await createOpportunityFromContact(contactIdNum, createRequest, token);
                toast({
                    variant: "success",
                    title: t('sales.opportunityDetail.messages.success'),
                    description: t('sales.opportunityDetail.messages.opportunityCreated'),
                });
                // Redirect to opportunity detail page
                router.push(`/sales/opportunities/${newOpportunity.opportunityId}`);
            } else if (!isCreateMode && opportunityId) {
                // Update existing opportunity
                const updatedOpportunity = await updateOpportunity(opportunityId, formData, token);
                // Refresh opportunity detail to get full data including proposal, history, etc.
                await fetchOpportunityDetail();
                toast({
                    variant: "success",
                    title: t('sales.opportunityDetail.messages.success'),
                    description: t('sales.opportunityDetail.messages.opportunitySaved'),
                });
            }
        } catch (error: any) {
            console.error('Error saving opportunity:', error);
            setError(error.message || 'Failed to save opportunity');
            toast({
                variant: "destructive",
                title: t('sales.opportunityDetail.messages.error'),
                description: error.message || t('sales.opportunityDetail.messages.saveError'),
            });
        } finally {
            setSaving(false);
        }
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
            case 'PROPOSAL_DRAFTING': return 'bg-purple-100 text-purple-800';
            case 'PROPOSAL_SENT': return 'bg-yellow-100 text-yellow-800';
            case 'REVISION': return 'bg-pink-100 text-pink-800';
            case 'WON': return 'bg-green-100 text-green-800';
            case 'LOST': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status: string) => {
        const statusMap: Record<string, string> = {
            'NEW': t('sales.opportunityDetail.status.new'),
            'PROPOSAL_DRAFTING': t('sales.opportunityDetail.status.proposalDrafting'),
            'PROPOSAL_SENT': t('sales.opportunityDetail.status.proposalSent'),
            'REVISION': t('sales.opportunityDetail.status.revision'),
            'WON': t('sales.opportunityDetail.status.won'),
            'LOST': t('sales.opportunityDetail.status.lost'),
        };
        return statusMap[status] || status;
    };

    const handleCreateProposal = async (title: string, files: File[], reviewerId: number | null) => {
        if (!token || !opportunityId) return;
        try {
            await createProposal(opportunityId, title, files, reviewerId, token);
            toast({
                variant: "default",
                title: t('sales.opportunityDetail.messages.success'),
                description: t('sales.opportunityDetail.messages.proposalCreated'),
            });
            await fetchOpportunityDetail();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t('sales.opportunityDetail.messages.error'),
                description: error.message || t('sales.opportunityDetail.messages.proposalCreateError'),
            });
            throw error;
        }
    };

    const handleUpdateProposal = async (title: string, files: File[], reviewerId: number | null) => {
        if (!token || !opportunity?.proposal) return;
        try {
            await updateProposal(opportunity.proposal.id, title, files, reviewerId, token);
            toast({
                variant: "default",
                title: t('sales.opportunityDetail.messages.success'),
                description: t('sales.opportunityDetail.messages.proposalUpdated'),
            });
            await fetchOpportunityDetail();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t('sales.opportunityDetail.messages.error'),
                description: error.message || t('sales.opportunityDetail.messages.proposalUpdateError'),
            });
            throw error;
        }
    };

    const handleSaveDraft = async (title: string, files: File[], reviewerId: number | null) => {
        if (!token || !opportunityId) return;
        try {
            if (opportunity?.proposal) {
                await updateProposal(opportunity.proposal.id, title, files, reviewerId, token);
            } else {
                await createProposal(opportunityId, title, files, reviewerId, token);
            }
            toast({
                variant: "default",
                title: t('sales.opportunityDetail.messages.success'),
                description: t('sales.opportunityDetail.messages.proposalSavedDraft'),
            });
            await fetchOpportunityDetail();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t('sales.opportunityDetail.messages.error'),
                description: error.message || t('sales.opportunityDetail.messages.saveDraftError'),
            });
            throw error;
        }
    };

    const handleAssignReviewer = async (reviewerId: number) => {
        if (!token || !opportunity?.proposal) return;
        try {
            setAssigningReviewer(true);
            const request: AssignReviewerRequest = { reviewerId };
            await assignReviewer(opportunity.proposal.id, request, token);
            toast({
                variant: "default",
                title: t('sales.opportunityDetail.messages.success'),
                description: t('sales.opportunityDetail.messages.reviewerAssigned'),
            });
            await fetchOpportunityDetail();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t('sales.opportunityDetail.messages.error'),
                description: error.message || t('sales.opportunityDetail.messages.assignReviewerError'),
            });
        } finally {
            setAssigningReviewer(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!token || !opportunity?.proposal) return;
        try {
            setSubmittingReview(true);
            const request: SubmitReviewRequest = {
                reviewNotes: reviewNotes,
                action: reviewAction as 'APPROVE' | 'REQUEST_REVISION' | 'REJECT',
            };
            await submitReview(opportunity.proposal.id, request, token);
            toast({
                variant: "default",
                title: t('sales.opportunityDetail.messages.success'),
                description: t('sales.opportunityDetail.messages.reviewSubmitted'),
            });
            await fetchOpportunityDetail();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t('sales.opportunityDetail.messages.error'),
                description: error.message || t('sales.opportunityDetail.messages.submitReviewError'),
            });
        } finally {
            setSubmittingReview(false);
        }
    };

    const isAssignedReviewer = opportunity?.proposal?.reviewerId === user?.id;
    // canEditProposal: true if no proposal exists, or if proposal exists and canEdit is true
    const canEditProposal = opportunity?.proposal === undefined || opportunity?.proposal?.canEdit === true;

    // Check if proposal has client feedback (revision requested)
    // Show "Create New Proposal" when:
    // 1. Proposal has clientFeedback (client commented)
    // 2. Proposal status is "revision_requested" or "Request for Change" (client requested change)
    const hasClientFeedback = opportunity?.proposal?.clientFeedback &&
        opportunity.proposal.clientFeedback.trim().length > 0;
    const isRevisionRequested = opportunity?.proposal?.status === 'revision_requested' ||
        opportunity?.proposal?.status === 'Request for Change';
    const shouldShowCreateNew = hasClientFeedback || isRevisionRequested;

    const handleMarkLost = async () => {
        if (!token || !opportunityId) {
            return;
        }
        try {
            setSaving(true);
            setShowMarkLostDialog(false);
            const updated = await markOpportunityAsLost(opportunityId, token);
            setOpportunity(updated);
            toast({
                variant: "default",
                title: t('sales.opportunityDetail.messages.success'),
                description: t('sales.opportunityDetail.messages.markedLost'),
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t('sales.opportunityDetail.messages.error'),
                description: error.message || t('sales.opportunityDetail.messages.markLostError'),
            });
        } finally {
            setSaving(false);
        }
    };

    const handleConvertToContract = async () => {
        if (!opportunityId) {
            return;
        }
        // Navigate to contract creation page with opportunityId
        router.push(`/sales/contracts/new?opportunityId=${opportunityId}`);
    };

    const formatProposalStatus = (status: string, reviewAction?: string | null) => {
        // If status is revision_requested and reviewAction is REQUEST_REVISION, show "Request Revision"
        if (status === 'revision_requested' && reviewAction === 'REQUEST_REVISION') {
            return t('sales.opportunityDetail.proposalStatus.requestRevision');
        }

        const statusMap: Record<string, string> = {
            'draft': t('sales.opportunityDetail.proposalStatus.draft'),
            'internal_review': t('sales.opportunityDetail.proposalStatus.internalReview'),
            'approved': t('sales.opportunityDetail.proposalStatus.approved'),
            'sent_to_client': t('sales.opportunityDetail.proposalStatus.sentToClient'),
            'revision_requested': t('sales.opportunityDetail.proposalStatus.revisionRequested'),
            'rejected': t('sales.opportunityDetail.proposalStatus.rejected'),
            'converted_to_contract': t('sales.opportunityDetail.proposalStatus.convertedToContract'),
        };
        return statusMap[status] || status;
    };

    const getProposalStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-blue-100 text-blue-800';
            case 'internal_review': return 'bg-purple-100 text-purple-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'sent_to_client': return 'bg-yellow-100 text-yellow-800';
            case 'revision_requested': return 'bg-orange-100 text-orange-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'converted_to_contract': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleFileClick = async (e: React.MouseEvent<HTMLAnchorElement>, s3Key: string) => {
        e.preventDefault();
        if (!token) {
            toast({
                variant: "destructive",
                title: t('sales.opportunityDetail.messages.error'),
                description: t('sales.opportunityDetail.messages.loginRequired'),
            });
            return;
        }

        try {
            // Check if it's an S3 key (contains "proposals/" or starts with "proposals/")
            // or if it's a local file path (starts with "/uploads/")
            if (s3Key.startsWith('proposals/') || s3Key.includes('proposals/')) {
                // It's an S3 key, get presigned URL
                const response = await getPresignedUrl(s3Key, token);
                window.open(response.presignedUrl, '_blank');
            } else if (s3Key.startsWith('/uploads/')) {
                // It's a local file, open directly
                window.open(s3Key, '_blank');
            } else if (s3Key.startsWith('http://') || s3Key.startsWith('https://')) {
                // It's already a URL (legacy), try to extract S3 key or open directly
                // Try to extract S3 key from URL
                const urlParts = s3Key.split('/');
                const bucketIndex = urlParts.findIndex(part => part.includes('skillbridge') || part.includes('s3'));
                if (bucketIndex >= 0 && bucketIndex < urlParts.length - 1) {
                    // Extract key after bucket name
                    const keyParts = urlParts.slice(bucketIndex + 1);
                    const extractedKey = keyParts.join('/');
                    if (extractedKey.startsWith('proposals/')) {
                        const response = await getPresignedUrl(extractedKey, token);
                        window.open(response.presignedUrl, '_blank');
                    } else {
                        window.open(s3Key, '_blank');
                    }
                } else {
                    window.open(s3Key, '_blank');
                }
            } else {
                // Assume it's an S3 key
                const response = await getPresignedUrl(s3Key, token);
                window.open(response.presignedUrl, '_blank');
            }
        } catch (error: any) {
            console.error('Error getting presigned URL:', error);
            toast({
                variant: "destructive",
                title: t('sales.opportunityDetail.messages.error'),
                description: error.message || t('sales.opportunityDetail.messages.accessFileError'),
            });
        }
    };

    if (!user || !token) {
        return <div>{t('sales.opportunityDetail.loading')}</div>;
    }

    if (loading) {
        return <div>{t('sales.opportunityDetail.loadingDetail')}</div>;
    }

    const displayData = isCreateMode ? formData : opportunity;
    const currentStatus = opportunity?.status || 'NEW';
    const currentStage = opportunity?.stage || 'New';

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
                            <h2 className="text-xl font-semibold text-gray-900">{t('sales.opportunityDetail.title')}</h2>
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
                    {/* Breadcrumbs */}
                    <div className="mb-4">
                        <a
                            href="/sales/opportunities"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => {
                                e.preventDefault();
                                router.push('/sales/opportunities');
                            }}
                        >
                            {t('sales.opportunityDetail.breadcrumb.list')}
                        </a>
                        <span className="mx-2">/</span>
                        <span>{isCreateMode ? t('sales.opportunityDetail.breadcrumb.create') : t('sales.opportunityDetail.breadcrumb.detail')}</span>
                    </div>

                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">{isCreateMode ? t('sales.opportunityDetail.pageTitle.create') : t('sales.opportunityDetail.pageTitle.detail')}</h1>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Opportunity Info Section */}
                    <div className="bg-white border rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">{t('sales.opportunityDetail.sections.opportunityInfo')}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">{t('sales.opportunityDetail.fields.clientName')}</label>
                                    <Input
                                        value={formData.clientName || ''}
                                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                        placeholder={t('sales.opportunityDetail.placeholders.clientName')}
                                        required
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">{t('sales.opportunityDetail.fields.assignee')}</label>
                                    <Select
                                        value={formData.assigneeUserId?.toString() || ''}
                                        onValueChange={(value) => setFormData({ ...formData, assigneeUserId: value ? parseInt(value) : undefined })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('sales.opportunityDetail.placeholders.selectAssignee')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {salesMen.map((salesMan) => (
                                                <SelectItem key={salesMan.id} value={salesMan.id.toString()}>
                                                    {salesMan.fullName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">{t('sales.opportunityDetail.fields.probability')}</label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.probability || 0}
                                            onChange={(e) => {
                                                const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                                                // Auto-limit to 100 if exceeds
                                                const limitedValue = value > 100 ? 100 : (value < 0 ? 0 : value);
                                                setFormData({ ...formData, probability: limitedValue });
                                            }}
                                            className="w-24"
                                        />
                                        <span>%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">{t('sales.opportunityDetail.fields.clientCompany')}</label>
                                    <Input
                                        value={formData.clientCompany || ''}
                                        onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                                        placeholder={t('sales.opportunityDetail.placeholders.clientCompany')}
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">{t('sales.opportunityDetail.fields.estValue')}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 z-10">¥</span>
                                        <Input
                                            type="text"
                                            value={formData.estValue ? formData.estValue.toLocaleString('ja-JP') : ''}
                                            onChange={(e) => {
                                                // Remove all non-digit characters (including commas from formatting)
                                                const rawValue = e.target.value.replace(/[^\d]/g, '');
                                                // Parse the value
                                                const numValue = rawValue === '' ? 0 : parseFloat(rawValue) || 0;
                                                // Limit to maximum 1000000000
                                                const limitedValue = numValue > 1000000000 ? 1000000000 : numValue;
                                                setFormData({ ...formData, estValue: limitedValue });
                                            }}
                                            onBlur={(e) => {
                                                // Ensure value is formatted on blur and within limit
                                                const value = formData.estValue || 0;
                                                const limitedValue = value > 1000000000 ? 1000000000 : value;
                                                setFormData({ ...formData, estValue: limitedValue });
                                            }}
                                            placeholder="0"
                                            className="pl-8"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">{t('sales.opportunityDetail.fields.status')}</label>
                                    {opportunity && (
                                        <Badge className={getStatusBadgeColor(currentStatus)}>
                                            {formatStatus(currentStatus)}
                                        </Badge>
                                    )}
                                    {isCreateMode && (
                                        <Badge className="bg-blue-100 text-blue-800">{t('sales.opportunityDetail.status.new')}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Proposal Versions Section */}
                    <div className="bg-white border rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">{t('sales.opportunityDetail.sections.proposalVersions')}</h2>
                            {!isCreateMode && opportunity && (
                                <Button
                                    onClick={() => setShowProposalModal(true)}
                                    disabled={opportunity.proposal != null && opportunity.proposal?.canEdit === false && !shouldShowCreateNew}
                                >
                                    {shouldShowCreateNew
                                        ? t('sales.opportunityDetail.actions.createNewProposal')
                                        : opportunity.proposal
                                            ? t('sales.opportunityDetail.actions.editProposal')
                                            : t('sales.opportunityDetail.actions.createProposal')}
                                </Button>
                            )}
                            {isCreateMode && (
                                <Button
                                    disabled
                                    variant="outline"
                                >
                                    {t('sales.opportunityDetail.actions.saveOpportunityFirst')}
                                </Button>
                            )}
                        </div>

                        {/* Proposal Versions Table */}
                        {!isCreateMode && opportunity?.proposalVersions && opportunity.proposalVersions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2 text-sm font-semibold">{t('sales.opportunityDetail.table.name')}</th>
                                        <th className="text-left p-2 text-sm font-semibold">{t('sales.opportunityDetail.table.createdBy')}</th>
                                        <th className="text-left p-2 text-sm font-semibold">{t('sales.opportunityDetail.table.date')}</th>
                                        <th className="text-left p-2 text-sm font-semibold">{t('sales.opportunityDetail.table.status')}</th>
                                        <th className="text-left p-2 text-sm font-semibold">{t('sales.opportunityDetail.table.reviewer')}</th>
                                        <th className="text-left p-2 text-sm font-semibold">{t('sales.opportunityDetail.table.internalFeedback')}</th>
                                        <th className="text-left p-2 text-sm font-semibold">{t('sales.opportunityDetail.table.clientFeedback')}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {opportunity.proposalVersions.map((version) => (
                                        <tr key={version.id} className={`border-b ${version.isCurrent ? 'bg-blue-50' : ''}`}>
                                            <td className="p-2 text-sm">{version.name} {version.isCurrent && `(${t('sales.opportunityDetail.current')})`}</td>
                                            <td className="p-2 text-sm">{version.createdByName || '-'}</td>
                                            <td className="p-2 text-sm">
                                                {version.createdAt ? new Date(version.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/') : '-'}
                                            </td>
                                            <td className="p-2 text-sm">
                                                <Badge className={getProposalStatusBadgeColor(version.status)}>
                                                    {formatProposalStatus(version.status, (version as any).reviewAction)}
                                                </Badge>
                                            </td>
                                            <td className="p-2 text-sm">{version.reviewerName || '-'}</td>
                                            <td className="p-2 text-sm">{version.internalFeedback || '-'}</td>
                                            <td className="p-2 text-sm">{version.clientFeedback || '-'}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">
                                {isCreateMode ? t('sales.opportunityDetail.messages.saveOpportunityFirst') : t('sales.opportunityDetail.messages.noProposalVersions')}
                            </p>
                        )}
                    </div>

                    {/* Current Proposal Section */}
                    {opportunity?.proposal && (
                        <div className="bg-white border rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">
                                {t('sales.opportunityDetail.sections.currentProposal')} (v{opportunity.proposalVersions?.find(v => v.isCurrent)?.version || '1'})
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-600 font-medium">{t('sales.opportunityDetail.fields.title')}</label>
                                    <p className="text-sm text-gray-900">{opportunity.proposal.title}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 font-medium">{t('sales.opportunityDetail.fields.file')}</label>
                                    {opportunity.proposal.attachments && opportunity.proposal.attachments.length > 0 ? (
                                        <div className="space-y-1">
                                            {opportunity.proposal.attachments.map((attachment, index) => (
                                                <a
                                                    key={index}
                                                    href="#"
                                                    onClick={(e) => handleFileClick(e, attachment)}
                                                    className="text-blue-600 hover:underline text-sm block cursor-pointer"
                                                >
                                                    {attachment.split('/').pop() || `${t('sales.opportunityDetail.file')} ${index + 1}`}
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">{t('sales.opportunityDetail.messages.noFiles')}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 font-medium">{t('sales.opportunityDetail.fields.status')}</label>
                                    <Badge className={getProposalStatusBadgeColor(opportunity.proposal.status)}>
                                        {formatProposalStatus(opportunity.proposal.status, opportunity.proposal.reviewAction)}
                                    </Badge>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 font-medium">{t('sales.opportunityDetail.fields.reviewer')}</label>
                                    <p className="text-sm text-gray-900">{opportunity.proposal.reviewerName || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 font-medium">{t('sales.opportunityDetail.fields.assignee')}</label>
                                    <p className="text-sm text-gray-900">{opportunity.assigneeName || '-'}</p>
                                </div>
                                <div>
                                    <Button
                                        onClick={() => setShowProposalModal(true)}
                                        disabled={!canEditProposal && !shouldShowCreateNew}
                                        variant="outline"
                                    >
                                        {shouldShowCreateNew
                                            ? t('sales.opportunityDetail.actions.createNewProposal')
                                            : t('sales.opportunityDetail.actions.editProposal')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Internal Review Workflow Section */}
                    {!isCreateMode && opportunity?.proposal ? (
                        <div className="bg-white border rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">{t('sales.opportunityDetail.sections.internalReviewWorkflow')}</h2>

                            <div className="space-y-4">
                                {/* Reviewer Info (read-only) */}
                                {opportunity.proposal.reviewerName && (
                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">{t('sales.opportunityDetail.fields.reviewer')}</label>
                                        <p className="text-sm text-gray-900">{opportunity.proposal.reviewerName}</p>
                                    </div>
                                )}

                                {/* Review Notes */}
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">{t('sales.opportunityDetail.fields.reviewNotes')}</label>
                                    <Textarea
                                        value={reviewNotes}
                                        onChange={(e) => setReviewNotes(e.target.value)}
                                        placeholder={t('sales.opportunityDetail.placeholders.reviewNotes')}
                                        disabled={!isAssignedReviewer || opportunity.proposal.reviewSubmittedAt !== null}
                                        className="min-h-[100px]"
                                    />
                                </div>

                                {/* Actions */}
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">{t('sales.opportunityDetail.fields.actions')}</label>
                                    <Select
                                        value={reviewAction}
                                        onValueChange={setReviewAction}
                                        disabled={!isAssignedReviewer || opportunity.proposal.reviewSubmittedAt !== null}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="APPROVE">{t('sales.opportunityDetail.actions.approve')}</SelectItem>
                                            <SelectItem value="REQUEST_REVISION">{t('sales.opportunityDetail.actions.requestRevision')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Submit Review Button */}
                                {isAssignedReviewer && opportunity.proposal.reviewSubmittedAt === null && (
                                    <div>
                                        <Button
                                            onClick={handleSubmitReview}
                                            disabled={submittingReview}
                                        >
                                            {submittingReview ? t('sales.opportunityDetail.actions.submitting') : t('sales.opportunityDetail.actions.submitReview')}
                                        </Button>
                                    </div>
                                )}

                                {/* Review Status Display */}
                                {opportunity.proposal.reviewSubmittedAt && (
                                    <div className="p-4 bg-gray-50 rounded">
                                        <p className="text-sm text-gray-600"><strong>{t('sales.opportunityDetail.reviewStatus.label')}:</strong> {t('sales.opportunityDetail.reviewStatus.submitted')}</p>
                                        <p className="text-sm text-gray-600"><strong>{t('sales.opportunityDetail.reviewStatus.action')}:</strong> {reviewAction}</p>
                                        <p className="text-sm text-gray-600"><strong>{t('sales.opportunityDetail.reviewStatus.reviewer')}:</strong> {opportunity.proposal.reviewerName}</p>
                                        <p className="text-sm text-gray-600"><strong>{t('sales.opportunityDetail.reviewStatus.submittedAt')}:</strong> {new Date(opportunity.proposal.reviewSubmittedAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : !isCreateMode && (
                        <div className="bg-white border rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">{t('sales.opportunityDetail.sections.internalReviewWorkflow')}</h2>
                            <p className="text-sm text-gray-500">{t('sales.opportunityDetail.messages.createProposalFirst')}</p>
                        </div>
                    )}

                    {/* Proposal Modal */}
                    {!isCreateMode && opportunity && (
                        <ProposalModal
                            isOpen={showProposalModal}
                            onClose={() => setShowProposalModal(false)}
                            proposal={shouldShowCreateNew ? null : (opportunity.proposal || null)}
                            opportunityId={opportunityId}
                            salesManagers={salesManagers}
                            onSave={shouldShowCreateNew ? handleCreateProposal : (opportunity.proposal ? handleUpdateProposal : handleCreateProposal)}
                            onSaveDraft={handleSaveDraft}
                        />
                    )}

                    {/* History Section */}
                    {opportunity?.history && opportunity.history.length > 0 && (
                        <div className="bg-white border rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">{t('sales.opportunityDetail.sections.history')}</h2>
                            <div className="space-y-2">
                                {opportunity.history.map((entry) => (
                                    <div key={entry.id} className="text-sm">
                                        <span className="text-gray-600">[{entry.date}]</span>{' '}
                                        <span className="text-gray-900">{entry.activity}</span>
                                        {entry.fileLink && (
                                            <span className="text-blue-600">
                        {' '}-{' '}
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const fileKey = entry.fileUrl || entry.fileLink || '';
                                                        if (fileKey) {
                                                            handleFileClick(e, fileKey);
                                                        }
                                                    }}
                                                    className="hover:underline cursor-pointer"
                                                >
                          {entry.fileLink}
                        </a>
                      </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowMarkLostDialog(true)}
                                disabled={opportunity?.status === 'LOST' || saving}
                            >
                                {t('sales.opportunityDetail.actions.markLost')}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleConvertToContract}
                                disabled={!opportunity?.canConvertToContract || opportunity?.status === 'LOST' || saving}
                            >
                                {t('sales.opportunityDetail.actions.convertToContract')}
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/sales/opportunities')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t('sales.opportunityDetail.actions.back')}
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? t('sales.opportunityDetail.actions.saving') : t('sales.opportunityDetail.actions.save')}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mark Lost Confirmation Dialog */}
            <Dialog open={showMarkLostDialog} onOpenChange={setShowMarkLostDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('sales.opportunityDetail.confirm.markLost')}</DialogTitle>
                        <DialogDescription>
                            {t('sales.opportunityDetail.confirm.markLost')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowMarkLostDialog(false)}
                            disabled={saving}
                        >
                            {t('sales.opportunityDetail.actions.cancel')}
                        </Button>
                        <Button
                            onClick={handleMarkLost}
                            disabled={saving}
                            variant="destructive"
                        >
                            {saving ? t('sales.opportunityDetail.actions.saving') : t('sales.opportunityDetail.actions.markLost')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}

