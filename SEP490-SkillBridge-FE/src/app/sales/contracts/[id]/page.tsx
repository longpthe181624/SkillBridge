'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Upload, X, Eye, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SalesSidebar from '@/components/design-patterns/sales/SalesSidebar';
import {
    getMSAContractDetail,
    getApprovedOpportunities,
    getOpportunityDetails,
    getSalesUsers,
    getClientUsers,
    submitReview,
    updateMSAContract,
    deleteMSAAttachment,
    getPresignedUrl,
    MSAContractDetail,
    Opportunity,
    SalesUser,
    ClientUser,
    CreateMSAFormData,
} from '@/services/salesMSAContractService';
import CreateMSAChangeRequestModal from '@/components/sales/CreateMSAChangeRequestModal';
import SalesChangeRequestDetailModal from '@/components/sales/SalesChangeRequestDetailModal';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useToast } from '@/components/ui/use-toast';

export default function MSAContractDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const contractId = params?.id ? parseInt(params.id as string) : null;

    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isCreateChangeRequestModalOpen, setIsCreateChangeRequestModalOpen] = useState(false);
    const [selectedChangeRequestId, setSelectedChangeRequestId] = useState<number | null>(null);
    const [isChangeRequestDetailModalOpen, setIsChangeRequestDetailModalOpen] = useState(false);

    // Data for dropdowns
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [salesUsers, setSalesUsers] = useState<SalesUser[]>([]);
    const [clientUsers, setClientUsers] = useState<ClientUser[]>([]);

    // Contract detail
    const [contractDetail, setContractDetail] = useState<MSAContractDetail | null>(null);

    // Form data
    const [formData, setFormData] = useState<CreateMSAFormData>({
        opportunityId: null,
        clientId: null,
        clientName: '',
        effectiveStart: null,
        effectiveEnd: null,
        status: 'Draft',
        assigneeUserId: null,
        note: '',
        currency: 'JPY',
        paymentTerms: 'Net',
        invoicingCycle: 'Monthly',
        billingDay: 'Last business day',
        taxWithholding: '10%',
        ipOwnership: 'Client',
        governingLaw: 'JP',
        clientContactId: null,
        landbridgeContactId: null,
        attachments: [],
        reviewerId: null,
        reviewNotes: '',
        reviewAction: null,
    });

    // Check if contract is editable (Draft status or Request for Change)
    const isEditable = contractDetail?.status === 'Draft' ||
        contractDetail?.status === 'draft' ||
        contractDetail?.status === 'Request for Change' ||
        contractDetail?.status === 'Request_for_Change' ||
        contractDetail?.status === 'Request for change';

    // Check if status is Under Review (various formats) - for reviewer to submit review
    const isUnderReview = contractDetail?.status === 'Under Review' ||
        contractDetail?.status === 'Under review' ||
        contractDetail?.status === 'Under_Review' ||
        contractDetail?.status === 'Internal Review';

    // Check if status is Client Under Review
    const isClientUnderReview = contractDetail?.status === 'Client Under Review' ||
        contractDetail?.status === 'Client under review';

    // Load user and token
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
            }
        } else {
            router.push('/sales/login');
        }
    }, [router]);

    // Load contract detail function
    const loadContractDetail = async () => {
        if (!token || !contractId) return;

        try {
            const detail = await getMSAContractDetail(contractId, token);
            setContractDetail(detail);

            // Update form data with latest contract detail
            setFormData(prev => ({
                ...prev,
                opportunityId: detail.opportunityId || null,
                clientId: detail.clientId,
                clientName: detail.clientName,
                effectiveStart: detail.effectiveStart,
                effectiveEnd: detail.effectiveEnd,
                status: detail.status,
                assigneeUserId: detail.assigneeUserId,
                note: detail.note || '',
                currency: detail.currency,
                paymentTerms: detail.paymentTerms,
                invoicingCycle: detail.invoicingCycle,
                billingDay: detail.billingDay,
                taxWithholding: detail.taxWithholding,
                ipOwnership: detail.ipOwnership,
                governingLaw: detail.governingLaw,
                clientContactId: detail.clientContactId,
                landbridgeContactId: detail.landbridgeContactId,
                attachments: [],
                reviewerId: detail.reviewerId,
                reviewNotes: detail.reviewNotes || '',
                reviewAction: detail.reviewAction,
            }));
        } catch (error: any) {
            console.error('Error loading contract detail:', error);
        }
    };

    // Load contract detail and dropdown data
    useEffect(() => {
        if (!token || !contractId) return;

        const loadData = async () => {
            try {
                setLoading(true);
                const [detail, opps, sales, clients] = await Promise.all([
                    getMSAContractDetail(contractId, token),
                    getApprovedOpportunities(token),
                    getSalesUsers(token),
                    getClientUsers(token),
                ]);

                setContractDetail(detail);
                setOpportunities(opps);
                setSalesUsers(sales);
                setClientUsers(clients);

                // Populate form data from contract detail
                setFormData({
                    opportunityId: detail.opportunityId || null,
                    clientId: detail.clientId,
                    clientName: detail.clientName,
                    effectiveStart: detail.effectiveStart,
                    effectiveEnd: detail.effectiveEnd,
                    status: detail.status,
                    assigneeUserId: detail.assigneeUserId,
                    note: detail.note || '',
                    currency: detail.currency,
                    paymentTerms: detail.paymentTerms,
                    invoicingCycle: detail.invoicingCycle,
                    billingDay: detail.billingDay,
                    taxWithholding: detail.taxWithholding,
                    ipOwnership: detail.ipOwnership,
                    governingLaw: detail.governingLaw,
                    clientContactId: detail.clientContactId,
                    landbridgeContactId: detail.landbridgeContactId,
                    attachments: [],
                    reviewerId: detail.reviewerId || null,
                    reviewNotes: detail.reviewNotes || '',
                    reviewAction: detail.reviewAction || null,
                });
            } catch (error) {
                console.error('Error loading data:', error);
                alert('Failed to load contract detail');
                router.push('/sales/contracts');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [token, contractId, router]);

    // Handle opportunity selection
    const handleOpportunityChange = async (opportunityId: string) => {
        if (!token || !isEditable) return;

        try {
            const oppDetails = await getOpportunityDetails(opportunityId, token);

            let clientsToUse = clientUsers;
            if (clientsToUse.length === 0) {
                clientsToUse = await getClientUsers(token);
                setClientUsers(clientsToUse);
            }

            let clientId: number | null = null;
            let clientContactId: number | null = null;

            if (oppDetails.clientEmail) {
                const clientUser = clientsToUse.find(u =>
                    u.email && u.email.toLowerCase() === oppDetails.clientEmail?.toLowerCase()
                );

                if (clientUser) {
                    clientId = clientUser.id;
                    clientContactId = clientUser.id;
                }
            }

            setFormData(prev => ({
                ...prev,
                opportunityId: oppDetails.opportunityId,
                clientId: clientId || oppDetails.clientId || null,
                clientName: oppDetails.clientName,
                clientContactId: clientContactId || null,
            }));
        } catch (error) {
            console.error('Error loading opportunity details:', error);
        }
    };

    // Handle client selection
    const handleClientChange = (clientId: string) => {
        if (!isEditable) return;
        const selectedClient = clientUsers.find(c => c.id.toString() === clientId);
        if (selectedClient) {
            setFormData(prev => ({
                ...prev,
                clientId: selectedClient.id,
                clientName: selectedClient.fullName,
                clientContactId: selectedClient.id,
            }));
        }
    };

    // Handle opportunity clear
    const handleOpportunityClear = () => {
        if (!isEditable) return;
        setFormData(prev => ({
            ...prev,
            opportunityId: null,
            clientId: null,
            clientName: '',
            clientContactId: null,
        }));
    };

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isEditable) return;
        const files = Array.from(e.target.files || []);
        const pdfFiles = files.filter(file => file.type === 'application/pdf');

        setFormData(prev => ({
            ...prev,
            attachments: [...(prev.attachments || []), ...pdfFiles],
        }));
    };

    const handleFileRemove = (index: number) => {
        if (!isEditable) return;
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments?.filter((_, i) => i !== index) || [],
        }));
    };

    // Get status badge color
    const getStatusBadgeColor = (status: string) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        const statusLower = status.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
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

    // Handle form submission (update contract)
    const handleSubmit = async (action: 'save' | 'draft') => {
        if (!token || !contractId || !isEditable) return;

        try {
            setSubmitting(true);

            const dataToSubmit = {
                ...formData,
                status: action === 'draft' ? 'Draft' : formData.status,
            };

            const result = await updateMSAContract(contractId, dataToSubmit, token);

            alert('Contract updated successfully');
            // Reload contract detail to reflect changes (including attachments)
            const detail = await getMSAContractDetail(contractId, token);
            setContractDetail(detail);

            // Update form data with latest status and clear new attachments (they're now in contractDetail)
            setFormData(prev => ({
                ...prev,
                status: detail.status,
                attachments: [], // Clear new attachments as they're now saved and in contractDetail
            }));
        } catch (error: any) {
            alert(error.message || 'Failed to update contract');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle view attachment
    const handleViewAttachment = async (s3Key: string) => {
        if (!token) return;

        try {
            const response = await getPresignedUrl(s3Key, token);
            window.open(response.presignedUrl, '_blank');
        } catch (error: any) {
            alert(error.message || 'Failed to open attachment');
        }
    };

    // Handle delete attachment
    const handleDeleteAttachment = async (s3Key: string) => {
        if (!token || !contractId || !isEditable) return;

        if (!confirm('Are you sure you want to delete this attachment?')) {
            return;
        }

        try {
            await deleteMSAAttachment(contractId, s3Key, token);
            alert('Attachment deleted successfully');

            // Reload contract detail to reflect changes
            const detail = await getMSAContractDetail(contractId, token);
            setContractDetail(detail);
        } catch (error: any) {
            alert(error.message || 'Failed to delete attachment');
        }
    };

    // Handle review submission
    const handleReviewSubmit = async () => {
        if (!token || !contractId || !formData.reviewAction) return;

        try {
            setSubmitting(true);
            await submitReview(contractId, formData.reviewNotes || '', formData.reviewAction, token);
            toast({
                title: 'Success',
                description: 'Review submitted successfully',
            });
            // Reload contract detail to get updated status and review info
            const detail = await getMSAContractDetail(contractId, token);
            setContractDetail(detail);

            // Update form data with latest status and review info
            setFormData(prev => ({
                ...prev,
                status: detail.status,
                reviewAction: detail.reviewAction || prev.reviewAction,
                reviewNotes: detail.reviewNotes || prev.reviewNotes,
                reviewerId: detail.reviewerId || prev.reviewerId,
            }));
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to submit review',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        router.push('/sales/contracts');
    };

    if (!user || !token || loading || !contractDetail) {
        return <div className="flex items-center justify-center min-h-screen">{t('sales.msaDetail.loading')}</div>;
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <SalesSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">{t('sales.msaDetail.title')}</h2>
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

                {/* Main Content */}
                <main className="flex-1 p-6 bg-white overflow-y-auto">
                    {/* Breadcrumbs */}
                    <div className="mb-4 text-sm text-gray-600">
                        <a href="/sales/contracts" className="hover:underline">{t('sales.msaDetail.breadcrumb.list')}</a>
                        <span className="mx-2">/</span>
                        <span>{t('sales.msaDetail.breadcrumb.detail')} - {contractDetail.contractId}</span>
                    </div>

                    {/* Form Title */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">{t('sales.msaDetail.title')}</h1>
                        {!isEditable && (
                            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold">
                                Read Only - Status: {contractDetail.status}
                            </div>
                        )}
                    </div>

                    <form className="space-y-8">
                        {/* MSA Summary Section */}
                        <section className="border-b pb-6">
                            <h2 className="text-xl font-semibold mb-4">{t('sales.msaDetail.sections.overview')}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="contractId">Contract ID</Label>
                                    <Input
                                        id="contractId"
                                        value={contractDetail.contractId}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="opportunityId">Opportunity ID</Label>
                                    <Select
                                        value={formData.opportunityId || 'none'}
                                        onValueChange={(value) => {
                                            if (value && value !== 'none') {
                                                handleOpportunityChange(value);
                                            } else {
                                                handleOpportunityClear();
                                            }
                                        }}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue placeholder="Select opportunity (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {opportunities.map(opp => (
                                                <SelectItem key={opp.id} value={opp.opportunityId}>
                                                    {opp.opportunityId}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="client">Client *</Label>
                                    {formData.opportunityId ? (
                                        <Input
                                            id="client"
                                            value={formData.clientName}
                                            readOnly
                                            className="bg-gray-100"
                                        />
                                    ) : (
                                        <Select
                                            value={formData.clientId?.toString() || ''}
                                            onValueChange={handleClientChange}
                                            disabled={!isEditable}
                                        >
                                            <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                                <SelectValue placeholder="Select client" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clientUsers.map(client => (
                                                    <SelectItem key={client.id} value={client.id.toString()}>
                                                        {client.fullName} ({client.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="effectiveStart">Effective Start *</Label>
                                    <div className="relative">
                                        <Input
                                            id="effectiveStart"
                                            type="date"
                                            value={formData.effectiveStart || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, effectiveStart: e.target.value }))}
                                            disabled={!isEditable}
                                            min={(() => {
                                                const today = new Date();
                                                const minDate = new Date(today);
                                                minDate.setFullYear(today.getFullYear() - 5);
                                                return minDate.toISOString().split('T')[0];
                                            })()}
                                            max={(() => {
                                                const today = new Date();
                                                const maxDate = new Date(today);
                                                maxDate.setFullYear(today.getFullYear() + 10);
                                                return maxDate.toISOString().split('T')[0];
                                            })()}
                                            className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${!isEditable ? 'bg-gray-100' : ''}`}
                                            lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                                        />
                                        {isEditable && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const input = document.getElementById('effectiveStart') as HTMLInputElement;
                                                    if (input && 'showPicker' in input) {
                                                        input.showPicker();
                                                    }
                                                }}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                tabIndex={-1}
                                            >
                                                <CalendarIcon size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="effectiveEnd">Effective End *</Label>
                                    <div className="relative">
                                        <Input
                                            id="effectiveEnd"
                                            type="date"
                                            value={formData.effectiveEnd || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, effectiveEnd: e.target.value }))}
                                            disabled={!isEditable}
                                            min={(() => {
                                                const today = new Date();
                                                const minDate = new Date(today);
                                                minDate.setFullYear(today.getFullYear() - 5);
                                                return minDate.toISOString().split('T')[0];
                                            })()}
                                            max={(() => {
                                                const today = new Date();
                                                const maxDate = new Date(today);
                                                maxDate.setFullYear(today.getFullYear() + 10);
                                                return maxDate.toISOString().split('T')[0];
                                            })()}
                                            className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${!isEditable ? 'bg-gray-100' : ''}`}
                                            lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                                        />
                                        {isEditable && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const input = document.getElementById('effectiveEnd') as HTMLInputElement;
                                                    if (input && 'showPicker' in input) {
                                                        input.showPicker();
                                                    }
                                                }}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                tabIndex={-1}
                                            >
                                                <CalendarIcon size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="status">{t('sales.msaDetail.fields.status')}</Label>
                                    <div className="mt-2">
                                        <Badge className={getStatusBadgeColor(contractDetail?.status || formData.status)}>
                                            {contractDetail?.status || formData.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="assignee">Assignee *</Label>
                                    <Select
                                        value={formData.assigneeUserId?.toString() || ''}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, assigneeUserId: parseInt(value) }))}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue placeholder="Select assignee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {salesUsers.filter(u => u.role === 'SALES_REP').map(user => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.fullName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="note">Note</Label>
                      <Textarea
                        id="note"
                        placeholder="Lorem Ipsum is simply dummy text"
                        value={formData.note}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 500) {
                            setFormData(prev => ({ ...prev, note: value }));
                          }
                        }}
                        maxLength={500}
                        disabled={!isEditable}
                        className={!isEditable ? 'bg-gray-100' : ''}
                        rows={4}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.note?.length || 0}/500 characters
                      </p>
                                </div>
                            </div>
                        </section>

                        {/* Commercial Terms Section */}
                        <section className="border-b pb-6">
                            <h2 className="text-xl font-semibold mb-4">{t('sales.msaDetail.sections.commercialTerms')}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="currency">Currency *</Label>
                                    <Select
                                        value={formData.currency}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="JPY">JPY</SelectItem>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="SGD">SGD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="paymentTerms">Payment Terms *</Label>
                                    <Select
                                        value={formData.paymentTerms}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Net">Net</SelectItem>
                                            <SelectItem value="Net 30">Net 30</SelectItem>
                                            <SelectItem value="Net 60">Net 60</SelectItem>
                                            <SelectItem value="Net 90">Net 90</SelectItem>
                                            <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="invoicingCycle">Invoicing Cycle *</Label>
                                    <Select
                                        value={formData.invoicingCycle}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, invoicingCycle: value }))}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                            <SelectItem value="Weekly">Weekly</SelectItem>
                                            <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                                            <SelectItem value="Annually">Annually</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="billingDay">Billing Day *</Label>
                                    <Select
                                        value={formData.billingDay}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, billingDay: value }))}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Last business day">Last business day</SelectItem>
                                            <SelectItem value="1st of month">1st of month</SelectItem>
                                            <SelectItem value="15th of month">15th of month</SelectItem>
                                            <SelectItem value="End of month">End of month</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="taxWithholding">Tax / Withholding *</Label>
                                    <Select
                                        value={formData.taxWithholding}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, taxWithholding: value }))}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0%">0%</SelectItem>
                                            <SelectItem value="10%">10%</SelectItem>
                                            <SelectItem value="15%">15%</SelectItem>
                                            <SelectItem value="20%">20%</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* Legal / Compliance Section */}
                        <section className="border-b pb-6">
                            <h2 className="text-xl font-semibold mb-4">{t('sales.msaDetail.sections.legalCompliance')}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="ipOwnership">IP Ownership *</Label>
                                    <Select
                                        value={formData.ipOwnership}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, ipOwnership: value }))}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Client">Client</SelectItem>
                                            <SelectItem value="LandBridge">LandBridge</SelectItem>
                                            <SelectItem value="Joint">Joint</SelectItem>
                                            <SelectItem value="Work for Hire">Work for Hire</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="governingLaw">Governing Law *</Label>
                                    <Select
                                        value={formData.governingLaw}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, governingLaw: value }))}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="JP">JP (Japan)</SelectItem>
                                            <SelectItem value="US">US (United States)</SelectItem>
                                            <SelectItem value="SG">SG (Singapore)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* Contacts Section */}
                        <section className="border-b pb-6">
                            <h2 className="text-xl font-semibold mb-4">{t('sales.msaDetail.sections.contacts')}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="clientContact">Client *</Label>
                                    <Select
                                        value={formData.clientContactId?.toString() || ''}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, clientContactId: parseInt(value) }))}
                                        disabled={!isEditable || (!!formData.opportunityId && !!formData.clientContactId)}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue placeholder="Select client contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clientUsers.map(client => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    {client.fullName} ({client.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="landbridgeContact">LandBridge *</Label>
                                    <Select
                                        value={formData.landbridgeContactId?.toString() || ''}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, landbridgeContactId: parseInt(value) }))}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                            <SelectValue placeholder="Select LandBridge contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {salesUsers.map(user => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.fullName} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* Attachments Section */}
                        <section className="border-b pb-6">
                            <h2 className="text-xl font-semibold mb-4">{t('sales.msaDetail.sections.attachments')}</h2>
                            {isEditable && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        accept="application/pdf"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="fileUpload"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="text-gray-600">{t('sales.msaDetail.attachments.upload')}</span>
                                    </label>
                                </div>
                            )}

                            {/* Existing attachments */}
                            {contractDetail.attachments && contractDetail.attachments.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {contractDetail.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-sm">{attachment.fileName}</span>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewAttachment(attachment.s3Key)}
                                                    title="View attachment"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                {isEditable && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteAttachment(attachment.s3Key)}
                                                        title="Delete attachment"
                                                    >
                                                        <X className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New attachments */}
                            {formData.attachments && formData.attachments.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {formData.attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                            <span className="text-sm">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleFileRemove(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Internal Review Workflow Section - Hide when status is Client Under Review */}
                        {!isClientUnderReview && (
                            <section className="border-b pb-6">
                                <h2 className="text-xl font-semibold mb-4">{t('sales.msaDetail.sections.internalReview')}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="reviewer">{t('sales.msaDetail.fields.reviewer')}</Label>
                                        <Select
                                            value={formData.reviewerId?.toString() || ''}
                                            onValueChange={(value) => {
                                                const selectedReviewerId = parseInt(value);
                                                const currentUserId = Number(user?.id);
                                                const isSameUser = Number(selectedReviewerId) === currentUserId && selectedReviewerId !== 0 && currentUserId !== 0;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    reviewerId: selectedReviewerId,
                                                    // Clear reviewAction and reviewNotes if reviewer is not current user
                                                    reviewAction: isSameUser ? prev.reviewAction : null,
                                                    reviewNotes: isSameUser ? prev.reviewNotes : '',
                                                }));
                                            }}
                                            disabled={!isEditable}
                                        >
                                            <SelectTrigger className={!isEditable ? 'bg-gray-100' : ''}>
                                                <SelectValue placeholder="Select reviewer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {salesUsers.filter(u => u.role === 'SALES_MANAGER').map(user => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        {user.fullName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {formData.reviewerId && (() => {
                                        // Ensure consistent comparison - convert both to numbers
                                        const reviewerId = Number(formData.reviewerId);
                                        // Get user ID from localStorage directly to ensure we have the correct logged-in user
                                        const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
                                        let currentUserId = Number(user?.id);

                                        // Fallback: try to get from localStorage if user?.id is not correct
                                        if (storedUserStr) {
                                            try {
                                                const storedUser = JSON.parse(storedUserStr);
                                                if (storedUser?.id) {
                                                    currentUserId = Number(storedUser.id);
                                                }
                                            } catch (e) {
                                                console.error('Error parsing stored user:', e);
                                            }
                                        }

                                        const isReviewerCurrentUser = reviewerId === currentUserId && reviewerId !== 0 && currentUserId !== 0;
                                        // Allow reviewer to review when status is Internal Review or Under Review, even if not editable
                                        // Disable only if: not the reviewer OR (not editable AND not under review AND not client under review)
                                        // Note: When status is Client Under Review, reviewer cannot review anymore (already approved)
                                        const isDisabled = !isReviewerCurrentUser || (!isEditable && !isUnderReview && !isClientUnderReview);

                                        // Debug log (remove in production)
                                        if (process.env.NODE_ENV === 'development') {
                                            console.log('Reviewer check:', {
                                                reviewerId,
                                                currentUserId,
                                                userObjectId: user?.id,
                                                isReviewerCurrentUser,
                                                isEditable,
                                                isDisabled,
                                                reviewerIdType: typeof formData.reviewerId,
                                                userIdType: typeof user?.id,
                                                storedUser: storedUserStr ? JSON.parse(storedUserStr) : null
                                            });
                                        }

                                        return (
                                            <>
                                                <div>
                                                    <Label htmlFor="reviewAction">{t('sales.msaDetail.fields.actions')}</Label>
                                                    <div className="relative">
                                                        {isDisabled && (
                                                            <div
                                                                className="absolute inset-0 z-50 bg-gray-100/90 cursor-not-allowed rounded-md"
                                                                style={{ top: 0, height: '100%' }}
                                                                onClick={(e) => e.preventDefault()}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                            />
                                                        )}
                                                        <Select
                                                            value={formData.reviewAction || ''}
                                                            onValueChange={(value) => {
                                                                if (!isDisabled) {
                                                                    setFormData(prev => ({ ...prev, reviewAction: value }));
                                                                }
                                                            }}
                                                            disabled={isDisabled}
                                                        >
                                                            <SelectTrigger
                                                                className={isDisabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
                                                                aria-disabled={isDisabled}
                                                                tabIndex={isDisabled ? -1 : 0}
                                                            >
                                                                <SelectValue placeholder="Select action" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="APPROVE">Approve</SelectItem>
                                                                <SelectItem value="REQUEST_REVISION">Request Revision</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="col-span-2">
                                                    <Label htmlFor="reviewNotes">{t('sales.msaDetail.fields.reviewNotes')}</Label>
                                                    <div className="relative">
                                                        {isDisabled && (
                                                            <div
                                                                className="absolute inset-0 z-50 bg-gray-100/90 cursor-not-allowed rounded-md"
                                                                style={{ top: 0, height: '100%' }}
                                                                onClick={(e) => e.preventDefault()}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                            />
                                                        )}
                                                        <Textarea
                                                            id="reviewNotes"
                                                            placeholder="Lorem ip sum"
                                                            value={formData.reviewNotes}
                                                            onChange={(e) => {
                                                                if (!isDisabled) {
                                                                    setFormData(prev => ({ ...prev, reviewNotes: e.target.value }));
                                                                }
                                                            }}
                                                            disabled={isDisabled}
                                                            readOnly={isDisabled}
                                                            className={isDisabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
                                                            rows={4}
                                                            style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
                                                            tabIndex={isDisabled ? -1 : 0}
                                                        />
                                                    </div>
                                                </div>

                                                {(isEditable || isUnderReview) && isReviewerCurrentUser && !isClientUnderReview && (
                                                    <div className="col-span-2">
                                                        <Button
                                                            type="button"
                                                            onClick={handleReviewSubmit}
                                                            disabled={submitting || !formData.reviewAction}
                                                            className="bg-gray-800 text-white"
                                                        >
                                                            {submitting ? t('sales.msaDetail.actions.submitReview') + '...' : t('sales.msaDetail.actions.submitReview')}
                                                        </Button>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </section>
                        )}

                        {/* Show review result when status is Client Under Review */}
                        {isClientUnderReview && contractDetail?.reviewAction && (
                            <section className="border-b pb-6">
                                <h2 className="text-xl font-semibold mb-4">{t('sales.msaDetail.sections.reviewResult')}</h2>
                                <div className="p-4 bg-gray-50 rounded-md border">
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="font-medium">Action: </span>
                                            <span className={contractDetail.reviewAction === 'APPROVE' ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
                          {contractDetail.reviewAction === 'APPROVE' ? 'Approved' : 'Request Revision'}
                        </span>
                                        </div>
                                        {contractDetail.reviewNotes && (
                                            <div>
                                                <span className="font-medium">Notes: </span>
                                                <span>{contractDetail.reviewNotes}</span>
                                            </div>
                                        )}
                                        {contractDetail.reviewerName && (
                                            <div>
                                                <span className="font-medium">Reviewed by: </span>
                                                <span>{contractDetail.reviewerName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* History Section */}
                        {contractDetail.history && contractDetail.history.length > 0 && (
                            <section className="bg-white border rounded-lg p-6 mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    <span className="mr-2">■</span>
                                    {t('sales.msaDetail.sections.history')}
                                </h2>
                                <div className="space-y-2">
                                    {contractDetail.history.map((item) => (
                                        <div key={item.id} className="text-sm border-b pb-2">
                                            <div className="flex items-start gap-2">
                                                <span className="text-gray-600 font-medium">[{item.date}]</span>
                                                <span className="text-gray-900">{item.description}</span>
                                            </div>
                                            {item.documentLink && (
                                                <a
                                                    href={item.documentLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 underline ml-2 text-xs"
                                                >
                                                    {item.documentName || 'Document'}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Actions */}
                        <section className="flex gap-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={submitting}
                            >
                                {t('sales.msaDetail.actions.back')}
                            </Button>
                            {isEditable && (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleSubmit('draft')}
                                        disabled={submitting}
                                    >
                                        {t('sales.msaDetail.actions.save')} as Draft
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => handleSubmit('save')}
                                        disabled={submitting}
                                        className="bg-gray-800 text-white"
                                    >
                                        {submitting ? t('sales.msaDetail.actions.save') + '...' : 'Update Contract'}
                                    </Button>
                                </>
                            )}
                        </section>
                    </form>
                </main>
            </div>

            {/* Create Change Request Modal */}
            {contractDetail && (
                <CreateMSAChangeRequestModal
                    isOpen={isCreateChangeRequestModalOpen}
                    onClose={() => setIsCreateChangeRequestModalOpen(false)}
                    msaContractId={contractDetail.id}
                    salesUsers={salesUsers}
                    token={token || ''}
                    onSuccess={() => {
                        // Reload change requests list (placeholder for now)
                        console.log('Change request created successfully');
                    }}
                />
            )}

            {/* Change Request Detail Modal */}
            {contractDetail && selectedChangeRequestId && (
                <SalesChangeRequestDetailModal
                    isOpen={isChangeRequestDetailModalOpen}
                    onClose={() => {
                        setIsChangeRequestDetailModalOpen(false);
                        setSelectedChangeRequestId(null);
                    }}
                    contractId={contractDetail.id}
                    changeRequestId={selectedChangeRequestId}
                    contractType="MSA"
                    salesUsers={salesUsers}
                    token={token || ''}
                    currentUserId={user?.id || 0}
                    onSuccess={() => {
                        // Reload contract detail
                        if (token && contractId) {
                            loadContractDetail();
                        }
                    }}
                />
            )}
        </div>
    );
}

