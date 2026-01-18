'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClientSidebar } from '@/components/design-patterns/client/ClientSidebar';
import { ClientHeader } from '@/components/design-patterns/client/ClientHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    getContractDetail,
    approveContract,
    addComment,
    cancelContract,
    createChangeRequest,
    saveChangeRequestDraft,
    CreateChangeRequestData,
    getChangeRequestDetail,
    updateChangeRequest,
    submitChangeRequest,
    approveChangeRequest,
    requestForChange,
    terminateChangeRequest,
    UpdateChangeRequestData,
    getSOWContractVersions
} from '@/services/contractService';
import { getPresignedUrl } from '@/services/contactService';
import { ContractDetail } from '@/types/contract';
import CommentModal from '@/components/CommentModal';
import CreateChangeRequestModal, { ChangeRequestFormData } from '@/components/CreateChangeRequestModal';
import ChangeRequestDetailModal from '@/components/ChangeRequestDetailModal';
import Link from 'next/link';
import { ChevronRight, Eye, Plus, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function ContractDetailPage() {
    const { contractId } = useParams();
    const { token, isAuthenticated, loading: authLoading } = useAuth();
    const { t } = useLanguage();
    const { toast } = useToast();
    const router = useRouter();

    const [contract, setContract] = useState<ContractDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showCreateChangeRequestModal, setShowCreateChangeRequestModal] = useState(false);
    const [showChangeRequestDetailModal, setShowChangeRequestDetailModal] = useState(false);
    const [selectedChangeRequestId, setSelectedChangeRequestId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('contract-info');
    const [changeRequestPage, setChangeRequestPage] = useState(0);
    const changeRequestPageSize = 5; // Show 5 items per page

    // Version management (for Retainer SOW)
    const [versions, setVersions] = useState<ContractDetail[]>([]);
    const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
    const [loadingVersions, setLoadingVersions] = useState(false);

    // Detect SOW type
    const isSOW = contract?.contractType === 'SOW';
    const isFixedPrice = contract?.engagementType === 'Fixed Price';
    const isRetainer = contract?.engagementType === 'Retainer';

  const TruncatedText = ({ value, widthClass = 'max-w-[220px]' }: { value: React.ReactNode; widthClass?: string }) => {
    const hasValue = value !== null && value !== undefined && value !== '';
    const display = hasValue ? value : '-';

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-block truncate align-middle ${widthClass}`}>
            {display}
          </span>
        </TooltipTrigger>
        {hasValue && (
          <TooltipContent side="top">
            <span className="whitespace-pre-wrap">{display}</span>
          </TooltipContent>
        )}
      </Tooltip>
    );
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    }
  }, [isAuthenticated, authLoading, router]);

    // Fetch contract detail
    useEffect(() => {
        const fetchContractDetail = async () => {
            if (!token || !contractId || !isAuthenticated) return;

            try {
                setLoading(true);
                setError(null);
                const data = await getContractDetail(token, parseInt(contractId as string));
                setContract(data);
                setSelectedVersionId(data.internalId);
                setChangeRequestPage(0); // Reset to first page when contract changes

                // Load versions if Retainer SOW
                if (data.contractType === 'SOW' && data.engagementType === 'Retainer') {
                    try {
                        setLoadingVersions(true);
                        const allVersions = await getSOWContractVersions(token, parseInt(contractId as string));
                        setVersions(allVersions);
                        // If no versions returned or only one, use current contract
                        if (allVersions.length === 0) {
                            setVersions([data]);
                        }
                    } catch (error) {
                        console.error('Error loading versions:', error);
                        // Fallback to single version
                        setVersions([data]);
                    } finally {
                        setLoadingVersions(false);
                    }
                }
            } catch (err) {
                console.error('Error fetching contract detail:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch contract detail');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && token) {
            fetchContractDetail();
        }
    }, [contractId, token, isAuthenticated]);

    // Load contract detail when version changes
    useEffect(() => {
        if (!token || !selectedVersionId || !isAuthenticated) return;

        const loadVersionDetail = async () => {
            try {
                setLoading(true);
                const detail = await getContractDetail(token, selectedVersionId);
                setContract(detail);
            } catch (error) {
                console.error('Error loading version detail:', error);
                alert('Failed to load version detail');
            } finally {
                setLoading(false);
            }
        };

        // Only load if selectedVersionId is different from the currently displayed contract
        if (selectedVersionId !== contract?.internalId) {
            loadVersionDetail();
        }
    }, [token, selectedVersionId, contract?.internalId, isAuthenticated]);

    const handleApprove = () => {
        setShowApproveModal(true);
    };

    const handleApproveConfirm = async () => {
        if (!token || !contractId) return;

        try {
            setActionLoading(true);
            await approveContract(token, parseInt(contractId as string));
            // Refresh contract detail
            const data = await getContractDetail(token, parseInt(contractId as string));
            setContract(data);
            setShowApproveModal(false);
            toast({
                variant: "success",
                title: t('client.contractDetail.approve.success'),
            });
        } catch (err) {
            console.error('Error approving contract:', err);
            toast({
                variant: "destructive",
                title: t('client.contractDetail.approve.error'),
                description: err instanceof Error ? err.message : '',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleComment = () => {
        setShowCommentModal(true);
    };

    const handleCommentSubmit = async (message: string) => {
        if (!token || !contractId) return;

        try {
            await addComment(token, parseInt(contractId as string), message);
            // Refresh contract detail
            const data = await getContractDetail(token, parseInt(contractId as string));
            setContract(data);
            toast({
                variant: "success",
                title: t('client.contractDetail.requestForChange.success'),
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t('client.contractDetail.requestForChange.error'),
                description: error.message || '',
            });
            throw error; // Re-throw to be handled by CommentModal
        }
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const handleCancelSubmit = async (reason: string) => {
        if (!token || !contractId) return;

        try {
            setActionLoading(true);
            await cancelContract(token, parseInt(contractId as string), reason);
            // Refresh contract detail
            const data = await getContractDetail(token, parseInt(contractId as string));
            setContract(data);
            setShowCancelModal(false);
            toast({
                variant: "success",
                title: t('client.contractDetail.cancel.success'),
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t('client.contractDetail.cancel.error'),
                description: error.message || '',
            });
            throw error; // Re-throw to be handled by CancelModal
        } finally {
            setActionLoading(false);
        }
    };

    // Handle view attachment
    const handleViewAttachment = async (e: React.MouseEvent<HTMLAnchorElement>, s3Key: string) => {
        e.preventDefault();
        if (!token) {
            alert('Please login to view the document');
            return;
        }

        try {
            // Check if it's an S3 key (contains "contracts/" or starts with "contracts/")
            // or if it's a local file path (starts with "/uploads/")
            if (s3Key.startsWith('contracts/') || s3Key.includes('contracts/')) {
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
                    if (extractedKey.startsWith('contracts/')) {
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
            alert(error.message || 'Failed to open document');
        }
    };

    const getStatusVariant = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'default';
            case 'under review':
                return 'secondary';
            case 'draft':
                return 'outline';
            case 'pending':
                return 'secondary';
            case 'processing':
                return 'secondary';
            case 'request for change':
                return 'destructive';
            case 'approved':
                return 'default';
            case 'completed':
                return 'secondary';
            case 'terminated':
                return 'destructive';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusTranslationKey = (status: string): string => {
        // Map status to translation key
        const statusMap: Record<string, string> = {
            'Under Review': 'underReview',
            'Request for Change': 'requestforchange',
            'Active': 'active',
            'Draft': 'draft',
            'Pending': 'pending',
            'Processing': 'processing',
            'Approved': 'approved',
            'Completed': 'completed',
            'Terminated': 'terminated',
            'Cancelled': 'cancelled',
        };

        return statusMap[status] || status.toLowerCase().replace(/\s+/g, '');
    };

    // Render MSA Detail
    const renderMSADetail = () => {
        if (!contract) return null;

        return (
            <>
                {/* Overview Section */}
                <Card className="mb-6 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.overview')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.msaId')}</label>
                                <p className="font-medium">{contract.id}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.effectiveStart')}</label>
                                <p className="font-medium">{contract.effectiveStart || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.effectiveEnd')}</label>
                                <p className="font-medium">{contract.effectiveEnd || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.status')}</label>
                                <div className="mt-1">
                                    <Badge variant={getStatusVariant(contract.status) as any}>
                                        {t(`client.contractDetail.status.${getStatusTranslationKey(contract.status)}`) || contract.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Commercial Terms Section */}
                <Card className="mb-6 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.commercialTerms')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.currency')}</label>
                                <p className="font-medium">{contract.currency || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.paymentTerms')}</label>
                                <p className="font-medium">{contract.paymentTerms || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.invoicingCycle')}</label>
                                <p className="font-medium">{contract.invoicingCycle || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.billingDay')}</label>
                                <p className="font-medium">{contract.billingDay || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.taxWithholding')}</label>
                                <p className="font-medium">{contract.taxWithholding || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Legal / Compliance Section */}
                <Card className="mb-6 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.legalCompliance')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.ipOwnership')}</label>
                                <p className="font-medium">{contract.ipOwnership || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.governingLaw')}</label>
                                <p className="font-medium">{contract.governingLaw || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contacts Section */}
                <Card className="mb-6 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.contacts')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.client')}</label>
                                <p className="font-medium">
                                    {contract.clientContact.name} ({contract.clientContact.email})
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.landbridge')}</label>
                                <p className="font-medium">
                                    {contract.landbridgeContact.name} ({contract.landbridgeContact.email})
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attachments Section */}
                {contract.attachments && contract.attachments.length > 0 && (
                    <Card className="mb-6 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                <span className="mr-2">■</span>
                                {t('client.contractDetail.sections.attachments')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {contract.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-700">{attachment.fileName}</span>
                                        <a
                                            href="#"
                                            onClick={(e) => handleViewAttachment(e, attachment.s3Key)}
                                            className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1 cursor-pointer"
                                        >
                                            {t('client.contractDetail.attachments.view')}
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* History Section */}
                <Card className="mb-6 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            <span className="mr-2">■</span>
                            {t('client.contractDetail.sections.history')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!contract.history || contract.history.length === 0 ? (
                            <p className="text-gray-500">{t('client.contractDetail.history.empty')}</p>
                        ) : (
                            <ul className="space-y-2">
                                {contract.history.map((item) => (
                                    <li key={item.id} className="text-sm">
                                        <span className="text-gray-600">[{item.date}]</span>{' '}
                                        {item.description}
                                        {item.documentLink && (
                                            <a
                                                href={item.documentLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline ml-2"
                                            >
                                                {item.documentName || 'Document'}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </>
        );
    };

    // Render SOW Contract Info
    const renderContractInfo = () => {
        if (!contract) return null;

        return (
            <>
                {/* Overview Section */}
                <Card className="mb-6 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.overview')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.sowId')}</label>
                                <p className="font-medium">{contract.id}</p>
                            </div>
                            {contract.parentMSA && (
                                <div>
                                    <label className="text-sm text-gray-600">{t('client.contractDetail.fields.parentMSA')}</label>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{contract.parentMSA.id}</p>
                                        <Badge variant={getStatusVariant(contract.parentMSA.status) as any}>
                                            {contract.parentMSA.status}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                            {contract.projectName && (
                                <div>
                                    <label className="text-sm text-gray-600">{t('client.contractDetail.fields.projectName')}</label>
                                    <p className="font-medium">{contract.projectName}</p>
                                </div>
                            )}
                            {contract.value != null && (
                                <div>
                                    <label className="text-sm text-gray-600">{t('client.contractDetail.fields.value')}</label>
                                    <p className="font-medium">¥{contract.value.toLocaleString()}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.period')}</label>
                                <p className="font-medium">
                                    {contract.effectiveStart || '-'} - {contract.effectiveEnd || '-'}
                                </p>
                            </div>
                            {contract.engagementType && (
                                <div>
                                    <label className="text-sm text-gray-600">{t('client.contractDetail.fields.engagementType')}</label>
                                    <div className="mt-1">
                                        <Badge variant="outline">
                                            {contract.engagementType}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                            {isFixedPrice && contract.invoicingCycle && (
                                <div>
                                    <label className="text-sm text-gray-600">{t('client.contractDetail.fields.invoicingCycle')}</label>
                                    <p className="font-medium">{contract.invoicingCycle}</p>
                                </div>
                            )}
                            {contract.billingDay && (
                                <div>
                                    <label className="text-sm text-gray-600">{t('client.contractDetail.fields.billingDay')}</label>
                                    <p className="font-medium">{contract.billingDay}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm text-gray-600">{t('client.contractDetail.fields.status')}</label>
                                <div className="mt-1">
                                    <Badge variant={getStatusVariant(contract.status) as any}>
                                        {t(`client.contractDetail.status.${getStatusTranslationKey(contract.status)}`) || contract.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Scope Summary Section */}
                {contract.scopeSummary && (
                    <Card className="mb-6 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.scopeSummary')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{contract.scopeSummary}</p>
                        </CardContent>
                    </Card>
                )}

        {/* Fixed Price SOW - Milestone Deliverables */}
        {isFixedPrice && contract.milestones && contract.milestones.length > 0 && (
          <Card className="mb-6 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.milestoneDeliverables')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('client.contractDetail.table.milestone')}</TableHead>
                    <TableHead>{t('client.contractDetail.table.deliveryNote')}</TableHead>
                    <TableHead>{t('client.contractDetail.table.acceptanceCriteria')}</TableHead>
                    <TableHead>{t('client.contractDetail.table.plannedEnd')}</TableHead>
                    <TableHead>{t('client.contractDetail.table.paymentPercentage')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contract.milestones.map((milestone) => (
                    <TableRow key={milestone.id}>
                      <TableCell>
                        <TruncatedText value={milestone.milestone} widthClass="max-w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <TruncatedText value={milestone.deliveryNote} widthClass="max-w-[240px]" />
                      </TableCell>
                      <TableCell>
                        <TruncatedText value={milestone.acceptanceCriteria} widthClass="max-w-[260px]" />
                      </TableCell>
                      <TableCell>
                        <TruncatedText value={milestone.plannedEnd} widthClass="max-w-[140px]" />
                      </TableCell>
                      <TableCell>
                        <TruncatedText value={milestone.paymentPercentage} widthClass="max-w-[120px]" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Fixed Price SOW - Billing Details */}
        {isFixedPrice && contract.billingDetails && contract.billingDetails.length > 0 && (
          <Card className="mb-6 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.billingDetails')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('client.contractDetail.table.billingName')}</TableHead>
                    <TableHead>{t('client.contractDetail.table.milestone')}</TableHead>
                    <TableHead>{t('client.contractDetail.table.amount')}</TableHead>
                    <TableHead>{t('client.contractDetail.table.percentage')}</TableHead>
                    <TableHead>{t('client.contractDetail.table.invoiceDate')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contract.billingDetails.map((billing) => (
                    <TableRow key={billing.id}>
                      <TableCell>
                        <TruncatedText value={billing.billingName} widthClass="max-w-[220px]" />
                      </TableCell>
                      <TableCell>
                        <TruncatedText value={billing.milestone} widthClass="max-w-[200px]" />
                      </TableCell>
                      <TableCell>{billing.amount}</TableCell>
                      <TableCell>{billing.percentage || '-'}</TableCell>
                      <TableCell>{billing.invoiceDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

                {/* Retainer SOW - Delivery Items */}
                {isRetainer && contract.deliveryItems && contract.deliveryItems.length > 0 && (
                    <Card className="mb-6 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.deliveryItems')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('client.contractDetail.table.milestone')}</TableHead>
                                        <TableHead>{t('client.contractDetail.table.deliveryNote')}</TableHead>
                                        <TableHead>{t('client.contractDetail.table.amount')}</TableHead>
                                        <TableHead>{t('client.contractDetail.table.paymentDate')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contract.deliveryItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.milestone}</TableCell>
                                            <TableCell>{item.deliveryNote}</TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell>{item.paymentDate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Retainer SOW - Engaged Engineer Section */}
                {isRetainer && contract.engagedEngineers && contract.engagedEngineers.length > 0 && (
                    <Card className="mb-6 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.engagedEngineer') || 'Engaged Engineer'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('client.contractDetail.table.engineerLevel') || 'Engineer Level'}</TableHead>
                                        <TableHead>{t('client.contractDetail.table.startDate') || 'Start Date'}</TableHead>
                                        <TableHead>{t('client.contractDetail.table.endDate') || 'End Date'}</TableHead>
                                        <TableHead>{t('client.contractDetail.table.rating') || 'Rating'}</TableHead>
                                        <TableHead>{t('client.contractDetail.table.salary') || 'Salary'}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contract.engagedEngineers.map((engineer) => (
                                        <TableRow key={engineer.id || (engineer.engineerLevel + engineer.startDate)}>
                                            <TableCell>{engineer.engineerLevel}</TableCell>
                                            <TableCell>{engineer.startDate}</TableCell>
                                            <TableCell>{engineer.endDate}</TableCell>
                                            <TableCell>{typeof engineer.rating === 'number' ? engineer.rating : engineer.rating}%</TableCell>
                                            <TableCell>¥{parseFloat(String(engineer.salary || '0')).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Retainer SOW - Billing Details */}
                {isRetainer && contract.retainerBillingDetails && contract.retainerBillingDetails.length > 0 && (
                    <Card className="mb-6 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.billingDetails')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('client.contractDetail.table.paymentDate')}</TableHead>
                                        <TableHead>{t('client.contractDetail.table.deliveryNote')}</TableHead>
                                        <TableHead>{t('client.contractDetail.table.amount')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contract.retainerBillingDetails.map((billing) => (
                                        <TableRow key={billing.id}>
                                            <TableCell>{billing.paymentDate}</TableCell>
                                            <TableCell>{billing.deliveryNote}</TableCell>
                                            <TableCell>{billing.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Change Request Section (in Contract Info tab) */}
                {contract.changeRequests && contract.changeRequests.length > 0 && (
                    <Card className="mb-6 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">{t('client.contractDetail.sections.changeRequest')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderChangeRequestTable(contract.changeRequests)}
                        </CardContent>
                    </Card>
                )}

                {/* Attachments Section */}
                {contract.attachments && contract.attachments.length > 0 && (
                    <Card className="mb-6 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                <span className="mr-2">■</span>
                                {t('client.contractDetail.sections.attachments')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {contract.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-700">{attachment.fileName}</span>
                                        <a
                                            href="#"
                                            onClick={(e) => handleViewAttachment(e, attachment.s3Key)}
                                            className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1 cursor-pointer"
                                        >
                                            {t('client.contractDetail.attachments.view')}
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* History Section */}
                <Card className="mb-6 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            <span className="mr-2">■</span>
                            {t('client.contractDetail.sections.history')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!contract.history || contract.history.length === 0 ? (
                            <p className="text-gray-500">{t('client.contractDetail.history.empty')}</p>
                        ) : (
                            <ul className="space-y-2">
                                {contract.history.map((item) => (
                                    <li key={item.id} className="text-sm">
                                        <span className="text-gray-600">[{item.date}]</span>{' '}
                                        {item.description}
                                        {item.documentLink && (
                                            <a
                                                href={item.documentLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline ml-2"
                                            >
                                                {item.documentName || 'Document'}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </>
        );
    };

    // Render Change Requests Tab
    const renderChangeRequests = () => {
        const changeRequests = contract?.changeRequests || [];
        const totalPages = Math.ceil(changeRequests.length / changeRequestPageSize);
        const startIndex = changeRequestPage * changeRequestPageSize;
        const endIndex = startIndex + changeRequestPageSize;
        const paginatedChangeRequests = changeRequests.slice(startIndex, endIndex);

        return (
            <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        {t('client.contractDetail.sections.changeRequest')}
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreateChangeRequestModal(true)}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('client.contractDetail.changeRequests.newChangeRequest')}
                    </Button>
                </CardHeader>
                <CardContent>
                    {changeRequests.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">{t('client.contractDetail.changeRequests.empty')}</p>
                    ) : (
                        <>
                            {renderChangeRequestTable(paginatedChangeRequests)}
                            {totalPages > 1 && (
                                <div className="flex justify-end gap-2 mt-4">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        const pageNum = i;
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={pageNum === changeRequestPage ? 'default' : 'outline'}
                                                onClick={() => setChangeRequestPage(pageNum)}
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
                                                onClick={() => setChangeRequestPage(totalPages - 1)}
                                                className="h-8 w-8"
                                            >
                                                {totalPages}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        );
    };

    // Render Change Request Table
    const renderChangeRequestTable = (changeRequests: NonNullable<ContractDetail['changeRequests']>) => {
        if (!changeRequests || changeRequests.length === 0) return null;

        return (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('client.contractDetail.changeRequests.table.crId')}</TableHead>
                            <TableHead>{t('client.contractDetail.changeRequests.table.type')}</TableHead>
                            <TableHead>{t('client.contractDetail.changeRequests.table.summary')}</TableHead>
                            <TableHead>{t('client.contractDetail.changeRequests.table.effectiveFrom')}</TableHead>
                            <TableHead>{t('client.contractDetail.changeRequests.table.effectiveUntil')}</TableHead>
                            <TableHead>{t('client.contractDetail.changeRequests.table.expectedExtraCost')}</TableHead>
                            <TableHead>{t('client.contractDetail.changeRequests.table.costEstimatedByLandbridge')}</TableHead>
                            <TableHead>{t('client.contractDetail.changeRequests.table.status')}</TableHead>
                            <TableHead>{t('client.contractDetail.changeRequests.table.action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {changeRequests.map((cr) => (
                            <TableRow key={cr.id}>
                                <TableCell className="font-medium">{cr.changeRequestId}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{cr.type}</Badge>
                                </TableCell>
                                <TableCell className="max-w-md">{cr.summary}</TableCell>
                                <TableCell>{cr.effectiveFrom || '-'}</TableCell>
                                <TableCell>{cr.effectiveUntil || '-'}</TableCell>
                <TableCell>{cr.expectedExtraCost || '-'}</TableCell>
                <TableCell>{cr.costEstimatedByLandbridge || '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(cr.status) as any}>
                                        {cr.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setSelectedChangeRequestId(cr.id);
                                            setShowChangeRequestDetailModal(true);
                                        }}
                                        className="h-8 w-8"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <ClientSidebar />
                <div className="flex-1 flex flex-col">
                    <ClientHeader titleKey="client.header.title.contractManagement" />
                    <main className="flex-1 p-6 bg-gray-50">
                        <div className="text-center py-8">{t('client.contractDetail.loading')}</div>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !contract) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <ClientSidebar />
                <div className="flex-1 flex flex-col">
                    <ClientHeader titleKey="client.header.title.contractManagement" />
                    <main className="flex-1 p-6 bg-gray-50">
                        <div className="text-center py-8 text-red-600">
                            {error || t('client.contractDetail.error.notFound')}
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <ClientSidebar />
            <div className="flex-1 flex flex-col">
                <ClientHeader titleKey="client.header.title.contractManagement" />
                <main className="flex-1 p-6 bg-gray-50">
                    {/* Breadcrumbs */}
                    <nav className="mb-4 text-sm text-gray-600">
                        <Link
                            href="/client/contracts"
                            className="hover:text-blue-600 hover:underline"
                        >
                            {t('client.contractDetail.breadcrumb.list')}
                        </Link>
                        <span className="mx-2"> <ChevronRight className="inline w-4 h-4" /> </span>
                        <span className="text-gray-900">{t('client.contractDetail.breadcrumb.detail')}</span>
                    </nav>

                    {/* Render MSA Detail */}
                    {!isSOW && contract.contractType === 'MSA' && (
                        <div className="mb-6">
                            {renderMSADetail()}
                        </div>
                    )}

                    {/* Tabs for SOW */}
                    {isSOW && (
                        <Tabs
                            value={activeTab}
                            onValueChange={(value) => {
                                setActiveTab(value);
                                setChangeRequestPage(0); // Reset to first page when switching tabs
                            }}
                            className="mb-6"
                        >
                            <TabsList className="bg-white">
                                <TabsTrigger value="contract-info">
                                    {t('client.contractDetail.tabs.contractInfo')}
                                </TabsTrigger>
                                <TabsTrigger value="change-requests">
                                    {t('client.contractDetail.tabs.changeRequests')}
                                </TabsTrigger>
                            </TabsList>

                            {/* Contract Info Tab */}
                            <TabsContent value="contract-info" className="mt-4">
                                {/* Version Tabs (for Retainer SOW with multiple versions) */}
                                {isRetainer && versions.length > 1 && (
                                    <div className="mb-6 border-b border-gray-200 pb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-700">Version:</span>
                                            {versions.map((version, index) => {
                                                // Get version number from contract detail (if available)
                                                const versionNumber = (version as any).version || index + 1;
                                                return (
                                                    <button
                                                        key={version.internalId}
                                                        onClick={() => setSelectedVersionId(version.internalId)}
                                                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                                            selectedVersionId === version.internalId
                                                                ? 'border-blue-600 text-blue-600'
                                                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        V{versionNumber}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {renderContractInfo()}
                            </TabsContent>

                            {/* Change Requests Tab */}
                            <TabsContent value="change-requests" className="mt-4">
                                {renderChangeRequests()}
                            </TabsContent>
                        </Tabs>
                    )}


                    {/* Action Buttons - Show for both MSA and SOW, but hide when on Change Request tab */}
                    {activeTab !== 'change-requests' && (
                        <Card className="bg-white">
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    {/* Show buttons only when status is Under Review */}
                                    {contract.status === 'Under Review' && (
                                        <>
                                            <Button
                                                variant="outline"
                                                onClick={handleApprove}
                                                disabled={actionLoading}
                                            >
                                                {t('client.contractDetail.actions.approve')}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleComment}
                                                disabled={actionLoading}
                                            >
                                                {t('client.contractDetail.actions.requestForChange')}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleCancel}
                                                disabled={actionLoading}
                                                className="text-red-600 border-red-600 hover:bg-red-50"
                                            >
                                                {t('client.contractDetail.actions.cancelContract')}
                                            </Button>
                                        </>
                                    )}
                                    {/* Show cancel button when status is Active */}
                                    {contract.status === 'Active' && (
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={actionLoading}
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                        >
                                            {t('client.contractDetail.actions.cancelContract')}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Comment Modal (Request For Change) */}
                    <CommentModal
                        isOpen={showCommentModal}
                        onClose={() => setShowCommentModal(false)}
                        onSubmit={handleCommentSubmit}
                    />

                    {/* Approve Confirmation Dialog */}
                    <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{t('client.contractDetail.approve.confirm')}</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <p className="text-sm text-gray-600">
                                    {t('client.contractDetail.approve.confirmMessage') || 'Are you sure you want to approve this contract?'}
                                </p>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowApproveModal(false)}
                                    disabled={actionLoading}
                                >
                                    {t('client.contractDetail.actions.cancel') || 'Cancel'}
                                </Button>
                                <Button
                                    onClick={handleApproveConfirm}
                                    disabled={actionLoading}
                                    variant="default"
                                >
                                    {actionLoading
                                        ? (t('client.contractDetail.actions.processing') || 'Processing...')
                                        : (t('client.contractDetail.actions.approve') || 'Approve')}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Cancel Modal */}
                    <CommentModal
                        isOpen={showCancelModal}
                        onClose={() => setShowCancelModal(false)}
                        onSubmit={handleCancelSubmit}
                        title={t('client.contractDetail.cancel.title')}
                        messageLabel={t('client.contractDetail.cancel.reasonLabel')}
                        messagePlaceholder={t('client.contractDetail.cancel.reasonPlaceholder')}
                        submitLabel={t('client.contractDetail.cancel.submit')}
                    />

                    {/* Create Change Request Modal */}
                    {contract && (
                        <>
                            <CreateChangeRequestModal
                                isOpen={showCreateChangeRequestModal}
                                onClose={() => setShowCreateChangeRequestModal(false)}
                                contractId={parseInt(contractId as string)}
                                contractType={contract.engagementType === 'Fixed Price' ? 'Fixed Price' : 'Retainer'}
                                onSubmit={async (data: ChangeRequestFormData) => {
                                    if (!token) return;
                                    const requestData: CreateChangeRequestData = {
                                        title: data.title,
                                        type: data.type,
                                        description: data.description,
                                        reason: data.reason,
                                        desiredStartDate: data.desiredStartDate,
                                        desiredEndDate: data.desiredEndDate,
                                        expectedExtraCost: data.expectedExtraCost,
                                        attachments: data.attachments,
                                    };
                                    await createChangeRequest(token, parseInt(contractId as string), requestData);
                                    // Refresh contract detail
                                    const updatedContract = await getContractDetail(token, parseInt(contractId as string));
                                    setContract(updatedContract);
                                }}
                                onSaveDraft={async (data: ChangeRequestFormData) => {
                                    if (!token) return;
                                    const requestData: Partial<CreateChangeRequestData> = {
                                        title: data.title,
                                        type: data.type,
                                        description: data.description,
                                        reason: data.reason,
                                        desiredStartDate: data.desiredStartDate,
                                        desiredEndDate: data.desiredEndDate,
                                        expectedExtraCost: data.expectedExtraCost,
                                        attachments: data.attachments,
                                    };
                                    await saveChangeRequestDraft(token, parseInt(contractId as string), requestData);
                                    // Refresh contract detail
                                    const updatedContract = await getContractDetail(token, parseInt(contractId as string));
                                    setContract(updatedContract);
                                }}
                            />

                            {/* Change Request Detail Modal */}
                            {selectedChangeRequestId && (
                                <ChangeRequestDetailModal
                                    isOpen={showChangeRequestDetailModal}
                                    onClose={() => {
                                        setShowChangeRequestDetailModal(false);
                                        setSelectedChangeRequestId(null);
                                    }}
                                    changeRequestId={selectedChangeRequestId}
                                    contractId={parseInt(contractId as string)}
                                    contractType={contract.engagementType === 'Fixed Price' ? 'Fixed Price' : 'Retainer'}
                                    onStatusChange={async () => {
                                        if (!token) return;
                                        const updatedContract = await getContractDetail(token, parseInt(contractId as string));
                                        setContract(updatedContract);
                                    }}
                                    getChangeRequestDetail={async (contractId: number, changeRequestId: number) => {
                                        if (!token) throw new Error('No token');
                                        return await getChangeRequestDetail(token, contractId, changeRequestId);
                                    }}
                                    updateChangeRequest={async (contractId: number, changeRequestId: number, data: UpdateChangeRequestData) => {
                                        if (!token) throw new Error('No token');
                                        await updateChangeRequest(token, contractId, changeRequestId, data);
                                    }}
                                    submitChangeRequest={async (contractId: number, changeRequestId: number) => {
                                        if (!token) throw new Error('No token');
                                        await submitChangeRequest(token, contractId, changeRequestId);
                                    }}
                                    approveChangeRequest={async (contractId: number, changeRequestId: number) => {
                                        if (!token) throw new Error('No token');
                                        await approveChangeRequest(token, contractId, changeRequestId);
                                    }}
                                    requestForChange={async (contractId: number, changeRequestId: number, message?: string) => {
                                        if (!token) throw new Error('No token');
                                        await requestForChange(token, contractId, changeRequestId, message);
                                    }}
                                    terminateChangeRequest={async (contractId: number, changeRequestId: number) => {
                                        if (!token) throw new Error('No token');
                                        await terminateChangeRequest(token, contractId, changeRequestId);
                                    }}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

