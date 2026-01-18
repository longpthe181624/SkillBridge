'use client';

import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import CommentModal from '@/components/CommentModal';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChangeRequestDetail, ImpactAnalysis } from '@/types/contract';

interface ChangeRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  changeRequestId: number;
  contractId: number;
  contractType: 'Fixed Price' | 'Retainer';
  onStatusChange: () => void;
  getChangeRequestDetail: (contractId: number, changeRequestId: number) => Promise<ChangeRequestDetail>;
  updateChangeRequest: (contractId: number, changeRequestId: number, data: UpdateChangeRequestData) => Promise<void>;
  submitChangeRequest: (contractId: number, changeRequestId: number) => Promise<void>;
  approveChangeRequest: (contractId: number, changeRequestId: number) => Promise<void>;
  requestForChange: (contractId: number, changeRequestId: number, message?: string) => Promise<void>;
  terminateChangeRequest: (contractId: number, changeRequestId: number) => Promise<void>;
}

export interface UpdateChangeRequestData {
  title: string;
  type: string;
  description: string;
  reason: string;
  desiredStartDate: string;
  desiredEndDate: string;
  expectedExtraCost: number;
}

export default function ChangeRequestDetailModal({
  isOpen,
  onClose,
  changeRequestId,
  contractId,
  contractType,
  onStatusChange,
  getChangeRequestDetail,
  updateChangeRequest,
  submitChangeRequest,
  approveChangeRequest,
  requestForChange,
  terminateChangeRequest,
}: ChangeRequestDetailModalProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [changeRequest, setChangeRequest] = useState<ChangeRequestDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateChangeRequestData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showRequestForChangeModal, setShowRequestForChangeModal] = useState(false);

  // CR Type options based on contract type
  const crTypeOptions = contractType === 'Fixed Price'
    ? ['Add Scope', 'Remove Scope', 'Other']
    : ['RESOURCE_CHANGE', 'SCHEDULE_CHANGE', 'SCOPE_ADJUSTMENT'];

  // Fetch change request detail on mount
  useEffect(() => {
    if (isOpen && changeRequestId) {
      fetchChangeRequestDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, changeRequestId]);

  // Set editing mode based on status
  useEffect(() => {
    if (changeRequest) {
      setIsEditing(changeRequest.status === 'Draft');
      if (changeRequest.status === 'Draft') {
        setFormData({
          title: changeRequest.title || '',
          type: changeRequest.type || '',
          description: changeRequest.description || '',
          reason: changeRequest.reason || '',
          desiredStartDate: changeRequest.desiredStartDate || '',
          desiredEndDate: changeRequest.desiredEndDate || '',
          expectedExtraCost: parseFloat(changeRequest.expectedExtraCost.replace(/[¥,]/g, '')) || 0,
        });
      }
    }
  }, [changeRequest]);

  const fetchChangeRequestDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChangeRequestDetail(contractId, changeRequestId);
      setChangeRequest(data);
    } catch (err: unknown) {
      console.error('Error fetching change request detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch change request detail');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData || !changeRequest) return;
    
    try {
      setActionLoading(true);
      await updateChangeRequest(contractId, changeRequestId, formData);
      await fetchChangeRequestDetail();
      alert(t('client.contractDetail.changeRequestDetail.success.update'));
    } catch (err: unknown) {
      console.error('Error updating change request:', err);
      alert(err instanceof Error ? err.message : t('client.contractDetail.changeRequestDetail.error.updateFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!changeRequest) return;
    
    if (!confirm(t('client.contractDetail.changeRequestDetail.confirm.submit'))) return;
    
    try {
      setActionLoading(true);
      await submitChangeRequest(contractId, changeRequestId);
      await fetchChangeRequestDetail();
      onStatusChange();
      alert(t('client.contractDetail.changeRequestDetail.success.submit'));
    } catch (err: unknown) {
      console.error('Error submitting change request:', err);
      alert(err instanceof Error ? err.message : t('client.contractDetail.changeRequestDetail.error.submitFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = () => {
    setShowApproveModal(true);
  };

  const handleApproveConfirm = async () => {
    if (!changeRequest) return;
    
    try {
      setActionLoading(true);
      await approveChangeRequest(contractId, changeRequestId);
      await fetchChangeRequestDetail();
      onStatusChange();
      setShowApproveModal(false);
      toast({
        variant: "success",
        title: t('client.contractDetail.changeRequestDetail.success.approve'),
      });
    } catch (err: unknown) {
      console.error('Error approving change request:', err);
      toast({
        variant: "destructive",
        title: t('client.contractDetail.changeRequestDetail.error.approveFailed'),
        description: err instanceof Error ? err.message : '',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestForChange = () => {
    setShowRequestForChangeModal(true);
  };

  const handleRequestForChangeSubmit = async (message: string) => {
    if (!changeRequest) return;
    
    try {
      setActionLoading(true);
      await requestForChange(contractId, changeRequestId, message);
      await fetchChangeRequestDetail();
      onStatusChange();
      setShowRequestForChangeModal(false);
      toast({
        variant: "success",
        title: t('client.contractDetail.changeRequestDetail.success.requestForChange'),
      });
    } catch (err: unknown) {
      console.error('Error requesting for change:', err);
      toast({
        variant: "destructive",
        title: t('client.contractDetail.changeRequestDetail.error.requestForChangeFailed'),
        description: err instanceof Error ? err.message : '',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleTerminate = () => {
    setShowTerminateModal(true);
  };

  const handleTerminateConfirm = async () => {
    if (!changeRequest) return;
    
    try {
      setActionLoading(true);
      await terminateChangeRequest(contractId, changeRequestId);
      await fetchChangeRequestDetail();
      onStatusChange();
      setShowTerminateModal(false);
      toast({
        variant: "success",
        title: t('client.contractDetail.changeRequestDetail.success.terminate'),
      });
    } catch (err: unknown) {
      console.error('Error terminating change request:', err);
      toast({
        variant: "destructive",
        title: t('client.contractDetail.changeRequestDetail.error.terminateFailed'),
        description: err instanceof Error ? err.message : '',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    // Convert YYYY/MM/DD to YYYY-MM-DD for input
    return dateString.replace(/\//g, '-');
  };

  const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    // Convert YYYY-MM-DD to YYYY/MM/DD
    return dateString.replace(/-/g, '/');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'secondary';
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'secondary';
      case 'under review':
        return 'default';
      case 'client under review':
        return 'default';
      case 'active':
        return 'default';
      case 'request for change':
        return 'destructive';
      case 'terminated':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const renderImpactAnalysis = (impactAnalysis: ImpactAnalysis) => {
    if (contractType === 'Fixed Price') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('client.contractDetail.changeRequestDetail.impactAnalysis.devHours')}
              </Label>
              <p className="mt-1 text-sm text-gray-900">
                {impactAnalysis.devHours != null ? `${impactAnalysis.devHours} hour` : '-'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('client.contractDetail.changeRequestDetail.impactAnalysis.testHours')}
              </Label>
              <p className="mt-1 text-sm text-gray-900">
                {impactAnalysis.testHours != null ? `${impactAnalysis.testHours} hour` : '-'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('client.contractDetail.changeRequestDetail.impactAnalysis.newEndDate')}
              </Label>
              <p className="mt-1 text-sm text-gray-900">
                {impactAnalysis.newEndDate || '-'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('client.contractDetail.changeRequestDetail.impactAnalysis.delayDuration')}
              </Label>
              <p className="mt-1 text-sm text-gray-900">
                {impactAnalysis.delayDuration != null ? `${impactAnalysis.delayDuration} days` : '-'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {t('client.contractDetail.changeRequestDetail.impactAnalysis.additionalCost')}
              </Label>
              <p className="mt-1 text-sm text-gray-900">
                {impactAnalysis.additionalCost || '-'}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      // Retainer
      return (
        <div className="space-y-6">
          {/* Engaged Engineer Table */}
          {impactAnalysis.engagedEngineers && impactAnalysis.engagedEngineers.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                {t('client.contractDetail.changeRequestDetail.impactAnalysis.engagedEngineer')}
              </h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('client.contractDetail.changeRequestDetail.impactAnalysis.engineerLevel')}</TableHead>
                    <TableHead>{t('client.contractDetail.changeRequestDetail.impactAnalysis.startDate')}</TableHead>
                    <TableHead>{t('client.contractDetail.changeRequestDetail.impactAnalysis.endDate')}</TableHead>
                    <TableHead>{t('client.contractDetail.changeRequestDetail.impactAnalysis.rating')}</TableHead>
                    <TableHead>{t('client.contractDetail.changeRequestDetail.impactAnalysis.salary')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {impactAnalysis.engagedEngineers.map((engineer, index) => (
                    <TableRow key={index}>
                      <TableCell>{engineer.engineerLevel}</TableCell>
                      <TableCell>{engineer.startDate}</TableCell>
                      <TableCell>{engineer.endDate}</TableCell>
                      <TableCell>{engineer.rating}</TableCell>
                      <TableCell>{engineer.salary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Billing Details Table */}
          {impactAnalysis.billingDetails && impactAnalysis.billingDetails.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                {t('client.contractDetail.changeRequestDetail.impactAnalysis.billingDetails')}
              </h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('client.contractDetail.changeRequestDetail.impactAnalysis.paymentDate')}</TableHead>
                    <TableHead>{t('client.contractDetail.changeRequestDetail.impactAnalysis.deliveryNote')}</TableHead>
                    <TableHead>{t('client.contractDetail.changeRequestDetail.impactAnalysis.amount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {impactAnalysis.billingDetails.map((billing, index) => (
                    <TableRow key={index}>
                      <TableCell>{billing.paymentDate}</TableCell>
                      <TableCell>{billing.deliveryNote}</TableCell>
                      <TableCell>{billing.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <p>{t('client.contractDetail.changeRequestDetail.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !changeRequest) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('client.contractDetail.changeRequestDetail.title')}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-red-600">{error || 'Change request not found'}</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>{t('client.contractDetail.changeRequestDetail.close')}</Button>
          </div>
        </div>
      </div>
    );
  }

  const isDraft = changeRequest.status === 'Draft';
  const isUnderReview = changeRequest.status === 'Under Review' || changeRequest.status === 'Client Under Review';
  // Check for Processing status (case-insensitive)
  const isProcessing = changeRequest.status && changeRequest.status.toLowerCase() === 'processing';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('client.contractDetail.changeRequestDetail.title')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('client.contractDetail.changeRequestDetail.sections.overview')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t('client.contractDetail.changeRequestDetail.fields.crId')}
                </Label>
                <p className="mt-1 text-sm text-gray-900">{changeRequest.changeRequestId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t('client.contractDetail.changeRequestDetail.fields.crTitle')}
                </Label>
                {isEditing && formData ? (
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{changeRequest.title}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t('client.contractDetail.changeRequestDetail.fields.type')}
                </Label>
                {isEditing && formData ? (
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {crTypeOptions.map((option) => {
                        // Map CR type values to display names
                        const displayName = option === 'RESOURCE_CHANGE' ? 'Resource Change' :
                          option === 'SCHEDULE_CHANGE' ? 'Schedule Change' :
                          option === 'SCOPE_ADJUSTMENT' ? 'Scope Adjustment' :
                          option;
                        return (
                          <SelectItem key={option} value={option}>
                            {displayName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{changeRequest.type}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t('client.contractDetail.changeRequestDetail.fields.createdBy')}
                </Label>
                <p className="mt-1 text-sm text-gray-900">{changeRequest.createdBy}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t('client.contractDetail.changeRequestDetail.fields.createdDate')}
                </Label>
                <p className="mt-1 text-sm text-gray-900">{changeRequest.createdDate}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t('client.contractDetail.changeRequestDetail.fields.status')}
                </Label>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(changeRequest.status) as "default" | "secondary" | "destructive" | "outline"}>
                    {changeRequest.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Change Summary Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('client.contractDetail.changeRequestDetail.sections.changeSummary')}
            </h3>
            {isEditing && formData ? (
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full"
              />
            ) : (
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{changeRequest.description}</p>
            )}
          </div>

          {/* Evidence Section */}
          {changeRequest.evidence && changeRequest.evidence.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('client.contractDetail.changeRequestDetail.sections.evidence')}
              </h3>
              <div className="space-y-2">
                {changeRequest.evidence.map((item, index) => (
                  <a
                    key={index}
                    href={item.type === 'link' ? item.value : `#`}
                    target={item.type === 'link' ? '_blank' : undefined}
                    rel={item.type === 'link' ? 'noopener noreferrer' : undefined}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {item.value}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Desired Impact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('client.contractDetail.changeRequestDetail.sections.desiredImpact')}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t('client.contractDetail.changeRequestDetail.fields.desiredStartDate')}
                </Label>
                {isEditing && formData ? (
                  <div className="relative mt-1">
                    <Input
                      type="date"
                      value={formatDateForInput(formData.desiredStartDate)}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        desiredStartDate: formatDateForBackend(e.target.value) 
                      })}
                      className="pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        input?.showPicker?.();
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      <CalendarIcon size={18} />
                    </button>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{changeRequest.desiredStartDate}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t('client.contractDetail.changeRequestDetail.fields.desiredEndDate')}
                </Label>
                {isEditing && formData ? (
                  <div className="relative mt-1">
                    <Input
                      type="date"
                      value={formatDateForInput(formData.desiredEndDate)}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        desiredEndDate: formatDateForBackend(e.target.value) 
                      })}
                      className="pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        input?.showPicker?.();
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      <CalendarIcon size={18} />
                    </button>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{changeRequest.desiredEndDate}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t('client.contractDetail.changeRequestDetail.fields.expectedExtraCost')}
                </Label>
                {isEditing && formData ? (
                  <Input
                    type="number"
                    value={formData.expectedExtraCost}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      expectedExtraCost: parseFloat(e.target.value) || 0 
                    })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{changeRequest.expectedExtraCost}</p>
                )}
              </div>
            </div>
          </div>

          {/* Impact Analysis by Landbridge Section */}
          {(changeRequest.impactAnalysis || (isProcessing && contractType === 'Fixed Price')) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('client.contractDetail.changeRequestDetail.sections.impactAnalysis')}
              </h3>
              {changeRequest.impactAnalysis ? (
                renderImpactAnalysis(changeRequest.impactAnalysis)
              ) : (
                <div className="text-sm text-gray-500 italic">
                  {t('client.contractDetail.changeRequestDetail.impactAnalysis.pending') || 'Impact analysis is being prepared by LandBridge...'}
                </div>
              )}
            </div>
          )}

          {/* History Section */}
          {changeRequest.history && changeRequest.history.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('client.contractDetail.changeRequestDetail.sections.history')}
              </h3>
              <div className="space-y-2">
                {changeRequest.history.map((item) => (
                  <p key={item.id} className="text-sm text-gray-700">
                    - {item.action} By: {item.userName} {item.timestamp}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Section */}
          {changeRequest.attachments && changeRequest.attachments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('client.contractDetail.changeRequestDetail.sections.attachments')}
              </h3>
              <div className="space-y-2">
                {changeRequest.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {attachment.fileName}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Approval & Workflow Section - Show when status is Processing */}
          {isProcessing && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('client.contractDetail.changeRequestDetail.sections.approvalWorkflow') || 'Approval & Workflow'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    {t('client.contractDetail.changeRequestDetail.fields.internalReviewer') || 'Internal Reviewer'}
                  </Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {changeRequest.internalReviewerName || '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    {t('client.contractDetail.changeRequestDetail.fields.status')}
                  </Label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(changeRequest.status) as "default" | "secondary" | "destructive" | "outline"}>
                      {changeRequest.status}
                    </Badge>
                  </div>
                </div>
                {changeRequest.reviewNotes && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {t('client.contractDetail.changeRequestDetail.fields.reviewNotes') || 'Review Notes'}
                    </Label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {changeRequest.reviewNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-2">
          {isDraft && (
            <>
              <Button
                onClick={handleSubmit}
                disabled={actionLoading}
                variant="default"
              >
                {t('client.contractDetail.changeRequestDetail.actions.submitChangeRequest')}
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={actionLoading}
                variant="outline"
              >
                {t('client.contractDetail.changeRequestDetail.actions.saveDraft')}
              </Button>
              <Button
                onClick={handleTerminate}
                disabled={actionLoading}
                variant="outline"
              >
                {t('client.contractDetail.changeRequestDetail.actions.terminateCR')}
              </Button>
            </>
          )}
          {isUnderReview && (
            <>
              <Button
                onClick={handleApprove}
                disabled={actionLoading}
                variant="default"
              >
                {t('client.contractDetail.changeRequestDetail.actions.approve')}
              </Button>
              <Button
                onClick={handleRequestForChange}
                disabled={actionLoading}
                variant="outline"
              >
                {t('client.contractDetail.changeRequestDetail.actions.requestForChange')}
              </Button>
              <Button
                onClick={handleTerminate}
                disabled={actionLoading}
                variant="outline"
              >
                {t('client.contractDetail.changeRequestDetail.actions.terminateCR')}
              </Button>
            </>
          )}
          <Button
            onClick={onClose}
            variant="outline"
          >
            {t('client.contractDetail.changeRequestDetail.actions.close')}
          </Button>
        </div>
      </div>

      {/* Approve Confirmation Dialog */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('client.contractDetail.changeRequestDetail.confirm.approve')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {t('client.contractDetail.changeRequestDetail.confirm.approveMessage') || 'Are you sure you want to approve this change request?'}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveModal(false)}
              disabled={actionLoading}
            >
              {t('client.contractDetail.changeRequestDetail.actions.cancel') || 'Cancel'}
            </Button>
            <Button
              onClick={handleApproveConfirm}
              disabled={actionLoading}
              variant="default"
            >
              {actionLoading 
                ? (t('client.contractDetail.changeRequestDetail.actions.processing') || 'Processing...')
                : (t('client.contractDetail.changeRequestDetail.actions.approve') || 'Approve')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate Confirmation Dialog */}
      <Dialog open={showTerminateModal} onOpenChange={setShowTerminateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('client.contractDetail.changeRequestDetail.confirm.terminate')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {t('client.contractDetail.changeRequestDetail.confirm.terminateMessage') || 'Are you sure you want to terminate this change request? This action cannot be undone.'}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTerminateModal(false)}
              disabled={actionLoading}
            >
              {t('client.contractDetail.changeRequestDetail.actions.cancel') || 'Cancel'}
            </Button>
            <Button
              onClick={handleTerminateConfirm}
              disabled={actionLoading}
              variant="destructive"
            >
              {actionLoading 
                ? (t('client.contractDetail.changeRequestDetail.actions.processing') || 'Processing...')
                : (t('client.contractDetail.changeRequestDetail.actions.terminateCR') || 'Terminate CR')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request for Change Modal */}
      <CommentModal
        isOpen={showRequestForChangeModal}
        onClose={() => setShowRequestForChangeModal(false)}
        onSubmit={handleRequestForChangeSubmit}
        title={t('client.contractDetail.changeRequestDetail.actions.requestForChange') || 'Request For Change'}
        messageLabel={t('client.contractDetail.changeRequestDetail.requestForChange.messageLabel') || 'Message'}
        messagePlaceholder={t('client.contractDetail.changeRequestDetail.requestForChange.messagePlaceholder') || 'Enter your change request message...'}
        submitLabel={t('client.contractDetail.changeRequestDetail.actions.requestForChange') || 'Request For Change'}
      />
    </div>
  );
}

