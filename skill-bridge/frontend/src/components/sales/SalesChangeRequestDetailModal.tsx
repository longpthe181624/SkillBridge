'use client';

import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Upload, Trash2, Eye, Calendar as CalendarIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  getChangeRequestDetailForSOW,
  updateChangeRequestForSOW,
  submitChangeRequestForSOW,
  submitChangeRequestReviewForSOW,
  rejectChangeRequestForSOW,
  getChangeRequestPreviewForSOW,
  getSOWContractAppendix,
  getSOWContractDetail,
  ContractAppendix,
  ChangeRequestPreview,
  SalesChangeRequestDetail,
  SalesUser,
  CreateChangeRequestFormData,
  SOWContractDetail,
} from '@/services/salesSOWContractService';
import {
  getChangeRequestDetailForMSA,
  updateChangeRequestForMSA,
  submitChangeRequestForMSA,
  submitChangeRequestReviewForMSA,
  SalesChangeRequestDetail as MSASalesChangeRequestDetail,
  CreateMSAChangeRequestFormData,
} from '@/services/salesMSAContractService';
import { getPresignedUrl } from '@/services/salesMSAContractService';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const MAX_ATTACHMENT_FILES = 1;

interface SalesChangeRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: number;
  changeRequestId: number;
  contractType: 'MSA' | 'SOW';
  salesUsers: SalesUser[];
  token: string;
  currentUserId: number;
  onSuccess: () => void;
  engagementType?: 'Fixed Price' | 'Retainer'; // For SOW contracts
}

export default function SalesChangeRequestDetailModal({
  isOpen,
  onClose,
  contractId,
  changeRequestId,
  contractType,
  salesUsers,
  token,
  currentUserId,
  onSuccess,
  engagementType,
}: SalesChangeRequestDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detail, setDetail] = useState<SalesChangeRequestDetail | MSASalesChangeRequestDetail | null>(null);
  const { toast } = useToast();
  
  // Form state for editing
  const [formData, setFormData] = useState<CreateChangeRequestFormData | CreateMSAChangeRequestFormData | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<string>('');
  const [preview, setPreview] = useState<ChangeRequestPreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  // Baseline data from contract detail (for Retainer)
  const [baselineResources, setBaselineResources] = useState<SOWContractDetail['engagedEngineers'] | null>(null);
  const [baselineBilling, setBaselineBilling] = useState<SOWContractDetail['billingDetails'] | null>(null);
  const [appendix, setAppendix] = useState<ContractAppendix | null>(null);
  const [loadingAppendix, setLoadingAppendix] = useState(false);
  const { t, language } = useLanguage();
  const sowDetail = contractType === 'SOW' ? (detail as SalesChangeRequestDetail | null) : null;
  
  // Track sign (+ or -) for each billing adjustment (for Retainer contracts)
  const [billingSigns, setBillingSigns] = useState<{ [index: number]: '+' | '-' }>({});

  // Helpers for editable Processing state (Retainer)
  const addEngagedEngineer = () => {
    if (!canEditProcessing) return;
    setFormData(prev => prev ? {
      ...prev,
      engagedEngineers: [...(prev.engagedEngineers ?? []), {
        baseEngineerId: null,
        engineerId: null,
        action: 'ADD' as const,
        level: '',
        role: '',
        engineerLevel: '',
        startDate: detail?.effectiveFrom || '',
        endDate: detail?.effectiveUntil || null,
        billingType: 'Monthly',
        hourlyRate: 0,
        hours: 0,
        subtotal: 0,
        rating: 100,
        salary: 0,
      }],
    } : prev);
  };

  const removeEngagedEngineer = (index: number) => {
    if (!canEditProcessing) return;
    setFormData(prev => prev ? {
      ...prev,
      engagedEngineers: (prev.engagedEngineers ?? []).filter((_, i) => i !== index),
    } : prev);
  };

  const addBillingAdjustment = () => {
    if (!canEditProcessing) return;
    const newIndex = formData?.billingDetails?.length ?? 0;
    setFormData(prev => prev ? {
      ...prev,
      billingDetails: [...(prev.billingDetails ?? []), {
        paymentDate: '',
        deliveryNote: '',
        amount: 0,
      }],
    } : prev);
    // Set default sign to '+' for new billing detail
    setBillingSigns(prev => ({
      ...prev,
      [newIndex]: '+',
    }));
  };

  const removeBillingAdjustment = (index: number) => {
    if (!canEditProcessing) return;
    setFormData(prev => prev ? {
      ...prev,
      billingDetails: (prev.billingDetails ?? []).filter((_, i) => i !== index),
    } : prev);
    // Remove sign for this index and reindex
    setBillingSigns(prev => {
      const newSigns: { [index: number]: '+' | '-' } = {};
      Object.keys(prev).forEach(key => {
        const idx = parseInt(key);
        if (idx < index) {
          newSigns[idx] = prev[idx];
        } else if (idx > index) {
          newSigns[idx - 1] = prev[idx];
        }
      });
      return newSigns;
    });
  };

  // Update engaged engineer (similar to CreateChangeRequestModal)
  const updateEngagedEngineer = (index: number, field: string, value: any) => {
    if (!canEditProcessing) return;
    setFormData(prev => prev ? {
      ...prev,
      engagedEngineers: (prev.engagedEngineers ?? []).map((engineer, i) => {
        if (i === index) {
          // Cast to any to allow dynamic property access
          const updated: any = { ...engineer, [field]: value };
          
          // If updating engineerLevel, also update level and role (if they exist in type)
          if (field === 'engineerLevel') {
            const parts = (value as string).split(' ');
            updated.level = parts[0] || '';
            updated.role = parts.slice(1).join(' ') || '';
          }
          
          // If updating level or role, update engineerLevel
          if (field === 'level' || field === 'role') {
            const level = field === 'level' ? value : (updated.level || '');
            const role = field === 'role' ? value : (updated.role || '');
            updated.engineerLevel = `${level || ''} ${role || ''}`.trim();
          }
          
          // Handle billing type changes
          if (field === 'billingType') {
            updated.billingType = value;
            if (value === 'Hourly') {
              updated.hourlyRate = updated.hourlyRate || 0;
              updated.hours = updated.hours || 0;
              updated.subtotal = (updated.hourlyRate || 0) * (updated.hours || 0);
              updated.salary = updated.subtotal;
            } else {
              updated.hourlyRate = undefined;
              updated.hours = undefined;
              updated.subtotal = undefined;
            }
          }
          
          // Auto-calculate subtotal for hourly billing
          if (field === 'hourlyRate' || field === 'hours') {
            if (updated.billingType === 'Hourly') {
              updated.subtotal = (updated.hourlyRate || 0) * (updated.hours || 0);
              updated.salary = updated.subtotal;
            }
          }
          
          return updated;
        }
        return engineer;
      }),
    } : prev);
  };

  // Update billing detail (similar to CreateChangeRequestModal)
  const updateBillingDetail = (index: number, field: string, value: any) => {
    if (!canEditProcessing) return;
    setFormData(prev => prev ? {
      ...prev,
      billingDetails: (prev.billingDetails ?? []).map((billing, i) => 
        i === index ? { ...billing, [field]: value } : billing
      ),
    } : prev);
  };
  
  // Get current user info
  const currentUser = salesUsers.find(u => u.id === currentUserId);
  const isSalesRep = currentUser?.role === 'SALES_REP';
  const isSalesManager = currentUser?.role === 'SALES_MANAGER';
  
  // Check if editable
  const isDraft = detail?.status === 'Draft';
  const isUnderInternalReview = detail?.status === 'Under Internal Review';
  const isProcessing = detail?.status && detail.status.toLowerCase() === 'processing';
  const isRequestForChange = detail?.status && detail.status.toLowerCase() === 'request for change';
  const isCreator = detail?.createdById ? detail.createdById === currentUserId : false;
  const isReviewer = isUnderInternalReview && detail?.internalReviewerId === currentUserId;
  const isAssignedReviewer = isProcessing && detail?.internalReviewerId === currentUserId;
  const canEdit = isDraft && isCreator;
  const canReview = isUnderInternalReview && isReviewer;
  // Allow editing Impact Analysis and Approval & Workflow when status is Processing or Request for Change
  const canEditProcessing = isProcessing || isRequestForChange;
  
  // Check if this is a Retainer SOW with new CR types
  const isRetainerSOW = contractType === 'SOW' && engagementType === 'Retainer';
  const crType = detail?.type || '';
  const isNewRetainerCRType = isRetainerSOW && (
    crType === 'RESOURCE_CHANGE' ||
    crType === 'SCHEDULE_CHANGE' ||
    crType === 'SCOPE_ADJUSTMENT'
  );
  
  // Get effective start date for past data protection
  const effectiveStartDate = detail?.effectiveFrom ? new Date(detail.effectiveFrom) : null;
  
  // Helper: Check if a date is in the past (before effective_start)
  const isPastDate = (dateString: string | null | undefined): boolean => {
    if (!dateString || !effectiveStartDate) return false;
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const effectiveStart = new Date(effectiveStartDate);
    effectiveStart.setHours(0, 0, 0, 0);
    return date < effectiveStart;
  };

  // Load change request detail
  useEffect(() => {
    if (isOpen && contractId && changeRequestId && token) {
      loadDetail();
      // Load baseline contract detail for Retainer SOW to display current resources/billing
      if (isRetainerSOW) {
        loadContractBaseline();
      }
    }
  }, [isOpen, contractId, changeRequestId, token, isRetainerSOW]);

  const loadDetail = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      let data: SalesChangeRequestDetail | MSASalesChangeRequestDetail;
      if (contractType === 'SOW') {
        data = await getChangeRequestDetailForSOW(contractId, changeRequestId, token);
      } else {
        data = await getChangeRequestDetailForMSA(contractId, changeRequestId, token);
      }
      setDetail(data);
      
      // Initialize form data
      if (data) {
        const form: any = {
          title: data.title,
          type: data.type,
          summary: data.summary,
          effectiveFrom: data.effectiveFrom || '',
          effectiveUntil: data.effectiveUntil || '',
          references: data.references || '',
          engagedEngineers: data.engagedEngineers || [],
          billingDetails: data.billingDetails || [],
          internalReviewerId: data.internalReviewerId,
          comment: data.comment || '',
          attachments: [],
        };
        // Add impact analysis if available (for Fixed Price SOW)
        if (contractType === 'SOW' && engagementType === 'Fixed Price') {
          const detailData = data as SalesChangeRequestDetail;
          if (detailData.devHours !== undefined || detailData.testHours !== undefined || detailData.newEndDate || detailData.delayDuration !== undefined || detailData.additionalCost !== undefined) {
            form.impactAnalysis = {
              devHours: detailData.devHours || 0,
              testHours: detailData.testHours || 0,
              newEndDate: detailData.newEndDate || '',
              delayDuration: detailData.delayDuration || 0,
              additionalCost: detailData.additionalCost || 0,
            };
          }
        }
        setFormData(form);
        setReviewNotes(data.reviewNotes || '');
        setReviewAction(data.reviewAction || '');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to load change request detail');
    } finally {
      setLoading(false);
    }
  };

  // Load baseline contract detail (for Retainer SOW)
  const loadContractBaseline = async () => {
    try {
      const detail = await getSOWContractDetail(contractId, token);
      setBaselineResources(detail.engagedEngineers || []);
      setBaselineBilling(detail.billingDetails || []);
    } catch (error) {
      console.error('[SalesChangeRequestDetailModal] Error loading contract baseline:', error);
      setBaselineResources(null);
      setBaselineBilling(null);
    }
  };

  const handleSave = async () => {
    if (!formData || (!canEdit && !canEditProcessing)) return;
    
    setSubmitting(true);
    setErrorMessage(null);
    try {
      if (contractType === 'SOW') {
        await updateChangeRequestForSOW(contractId, changeRequestId, formData as CreateChangeRequestFormData, token);
      } else {
        await updateChangeRequestForMSA(contractId, changeRequestId, formData as CreateMSAChangeRequestFormData, token);
      }
      toast({
        title: 'Success',
        description: 'Change request updated successfully',
        variant: 'success',
      });
      loadDetail();
      onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update change request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData || !canEdit || !formData.internalReviewerId) {
      setErrorMessage('Internal reviewer is required');
      return;
    }
    
    setSubmitting(true);
    setErrorMessage(null);
    try {
      if (contractType === 'SOW') {
        await submitChangeRequestForSOW(contractId, changeRequestId, formData.internalReviewerId, token);
      } else {
        await submitChangeRequestForMSA(contractId, changeRequestId, formData.internalReviewerId, token);
      }
      toast({
        title: 'Success',
        description: 'Change request submitted successfully',
        variant: 'success',
      });
      onClose();
      onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to submit change request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    // Allow Processing (Fixed Price / non-Retainer) even if reviewAction not set by UI
    if (!canReview && !canEditProcessing) return;
    const effectiveAction = reviewAction || (
      (canEditProcessing && !isRetainerSOW)
        ? (isSalesManager ? 'APPROVE' : 'REQUEST_REVISION')
        : ''
    );
    if (!effectiveAction) return;
    
    setSubmitting(true);
    setErrorMessage(null);
    try {
      // If status is Processing, first update the change request with impact analysis (if Fixed Price SOW)
      if (canEditProcessing && contractType === 'SOW' && engagementType === 'Fixed Price') {
        const sowFormData = formData as CreateChangeRequestFormData;
        if (sowFormData?.impactAnalysis) {
          await updateChangeRequestForSOW(contractId, changeRequestId, sowFormData, token);
        }
      }
      
      if (contractType === 'SOW') {
        await submitChangeRequestReviewForSOW(
          contractId,
          changeRequestId,
          effectiveAction as 'APPROVE' | 'REQUEST_REVISION',
          reviewNotes,
          token
        );
      } else {
        await submitChangeRequestReviewForMSA(
          contractId,
          changeRequestId,
          effectiveAction as 'APPROVE' | 'REQUEST_REVISION',
          reviewNotes,
          token
        );
      }
      toast({
        title: 'Success',
        description: 'Review submitted successfully',
        variant: 'success',
      });
      onClose();
      onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle approve for Retainer SOW Processing CRs
  const handleApprove = async () => {
    if (!isRetainerSOW || !isProcessing) return;
    
    setSubmitting(true);
    setErrorMessage(null);
    try {
      // First save any changes
      if (formData && canEditProcessing) {
        await updateChangeRequestForSOW(contractId, changeRequestId, formData as CreateChangeRequestFormData, token);
      }

      // Sales approval should move to Client Under Review (not final Approved)
      await submitChangeRequestReviewForSOW(contractId, changeRequestId, 'APPROVE', reviewNotes || '', token);

      // Reload CR detail to get updated status
      const updatedDetail = await getChangeRequestDetailForSOW(contractId, changeRequestId, token);
      setDetail(updatedDetail);

      toast({
        title: 'Success',
        description: 'Change request sent to client for review.',
        variant: 'success',
      });
      onClose();
      onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to approve change request');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Load appendix if CR is already approved
  useEffect(() => {
    if (!isOpen || !detail || contractType !== 'SOW' || !isRetainerSOW) return;
    
    // Check if CR is approved and has appendix
    const isApproved = detail.status === 'Approved' || detail.status === 'Active';
    const detailWithAppendix = detail as SalesChangeRequestDetail;
    if (isApproved && detailWithAppendix.appendixId) {
      setLoadingAppendix(true);
      getSOWContractAppendix(contractId, detailWithAppendix.appendixId, token)
        .then(setAppendix)
        .catch(err => console.error('Error loading appendix:', err))
        .finally(() => setLoadingAppendix(false));
    } else {
      setAppendix(null);
    }
  }, [isOpen, detail, contractId, contractType, isRetainerSOW, token]);
  
  // Handle reject for Retainer SOW Processing CRs
  const handleReject = async () => {
    if (!isRetainerSOW || !isProcessing) return;
    
    const reason = prompt('Please enter rejection reason:');
    if (reason === null) return; // User cancelled
    
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await rejectChangeRequestForSOW(contractId, changeRequestId, reason || null, token);
      toast({
        title: 'Success',
        description: 'Change request rejected successfully',
        variant: 'success',
      });
      onClose();
      onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to reject change request');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle submit for Sales Rep in Processing status
  const handleSubmitForProcessing = async () => {
    if (!isRetainerSOW || !isProcessing || !isSalesRep) return;
    
    if (!formData?.internalReviewerId) {
      setErrorMessage('Please select an internal reviewer before submitting.');
      return;
    }
    
    setSubmitting(true);
    setErrorMessage(null);
    try {
      // First save any changes
      if (formData) {
        await updateChangeRequestForSOW(contractId, changeRequestId, formData as CreateChangeRequestFormData, token);
      }
      
      // Submit to Internal Review
      await submitChangeRequestForSOW(contractId, changeRequestId, formData!.internalReviewerId!, token);
      
      toast({
        title: 'Success',
        description: 'Change request submitted for internal review.',
        variant: 'success',
      });
      onClose();
      onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to submit change request');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Processing (Fixed Price) for Sales Rep: save and submit to Under Internal Review
  const handleSaveProcessingFixedPriceRep = async () => {
    if (isRetainerSOW || !isProcessing || !isSalesRep) return;

    if (!formData?.internalReviewerId) {
      setErrorMessage('Please select an internal reviewer before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      // Save changes first
      if (formData) {
        await updateChangeRequestForSOW(contractId, changeRequestId, formData as CreateChangeRequestFormData, token);
      }
      // Submit to move status to Under Internal Review
      await submitChangeRequestForSOW(contractId, changeRequestId, formData!.internalReviewerId!, token);

      toast({
        title: 'Success',
        description: 'Change request submitted for internal review.',
        variant: 'success',
      });
      onClose();
      onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to submit change request');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Load preview
  const loadPreview = async () => {
    if (!isRetainerSOW || !contractId || !changeRequestId) return;
    
    setLoadingPreview(true);
    try {
      const previewData = await getChangeRequestPreviewForSOW(contractId, changeRequestId, token);
      setPreview(previewData);
      setShowPreview(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to load preview');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleViewAttachment = async (filePath: string) => {
    try {
      const response = await getPresignedUrl(filePath, token);
      window.open(response.presignedUrl, '_blank');
    } catch (error: any) {
      alert('Failed to open attachment: ' + error.message);
    }
  };

  // Format currency helper (without ¥ symbol for input value)
  const formatCurrency = (value: number | null | undefined): string => {
    if (value == null || value === 0) return '';
    return value.toLocaleString('ja-JP');
  };

  // Parse currency helper
  const parseCurrency = (value: string): number => {
    const rawValue = value.replace(/¥|,/g, '').trim();
    return rawValue === '' ? 0 : parseFloat(rawValue) || 0;
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-500';
      case 'Under Internal Review':
        return 'bg-yellow-500';
      case 'Client Under Review':
        return 'bg-blue-500';
      case 'Approved':
        return 'bg-green-500';
      case 'Request for Change':
        return 'bg-orange-500';
      case 'Active':
        return 'bg-green-600';
      case 'Terminated':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!formData) {
      e.target.value = '';
      return;
    }

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== files.length) {
      setErrorMessage(t('sales.createChangeRequest.messages.onlyPdf'));
      e.target.value = '';
      return;
    }

    const oversizedFiles = pdfFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrorMessage(t('sales.createChangeRequest.messages.fileSizeLimit'));
      e.target.value = '';
      return;
    }

    setFormData(prev => {
      if (!prev) return prev;

      const current = prev.attachments || [];
      if (current.length >= MAX_ATTACHMENT_FILES) {
        setErrorMessage(t('sales.createChangeRequest.messages.fileLimit'));
        return prev;
      }

      const remainingSlots = MAX_ATTACHMENT_FILES - current.length;
      const filesToAdd = pdfFiles.slice(0, remainingSlots);
      if (filesToAdd.length === 0) {
        setErrorMessage(t('sales.createChangeRequest.messages.fileLimit'));
        return prev;
      }

      if (pdfFiles.length > remainingSlots) {
        setErrorMessage(t('sales.createChangeRequest.messages.fileLimit'));
      } else {
        setErrorMessage(null);
      }

      return {
        ...prev,
        attachments: [...current, ...filesToAdd],
      };
    });

    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">{t('sales.changeRequestDetail.title')}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">{t('sales.changeRequestDetail.loading')}</div>
          ) : errorMessage ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          ) : !detail ? (
            <div className="text-center py-8">{t('sales.changeRequestDetail.noData')}</div>
          ) : (
            <>
              {/* Overview Section */}
              <section className="border-b pb-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.overview')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('sales.changeRequestDetail.fields.crId')}</Label>
                    <Input value={detail.changeRequestId} readOnly className="bg-gray-100" />
                  </div>
                  <div>
                    <Label>{t('sales.changeRequestDetail.fields.crTitle')}</Label>
                    <Input
                      value={formData?.title || detail.title}
                      onChange={(e) => setFormData(prev => prev ? { ...prev, title: e.target.value } : null)}
                      readOnly={!canEdit}
                      className={canEdit ? '' : 'bg-gray-100'}
                    />
                  </div>
                  <div>
                    <Label>{t('sales.changeRequestDetail.fields.type')}</Label>
                    {canEdit ? (
                      <Select
                        value={formData?.type || detail.type}
                        onValueChange={(value: string) => setFormData(prev => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            type: value as any
                          };
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {contractType === 'MSA' ? (
                            <>
                              <SelectItem value="Add Scope">Add Scope</SelectItem>
                              <SelectItem value="Remove Scope">Remove Scope</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </>
                          ) : engagementType === 'Retainer' ? (
                            <>
                              <SelectItem value="RESOURCE_CHANGE">Resource Change</SelectItem>
                              <SelectItem value="SCHEDULE_CHANGE">Schedule Change</SelectItem>
                              <SelectItem value="SCOPE_ADJUSTMENT">Scope Adjustment</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="Extend Schedule">Extend Schedule</SelectItem>
                              <SelectItem value="Rate Change">Rate Change</SelectItem>
                              <SelectItem value="Increase Resource">Increase Resource</SelectItem>
                              <SelectItem value="Add Scope">Add Scope</SelectItem>
                              <SelectItem value="Remove Scope">Remove Scope</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={detail.type} readOnly className="bg-gray-100" />
                    )}
                  </div>
                  <div>
                    <Label>{t('sales.changeRequestDetail.fields.effectiveFrom')}</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={formData?.effectiveFrom || detail.effectiveFrom || ''}
                        onChange={(e) => setFormData(prev => prev ? { ...prev, effectiveFrom: e.target.value } : null)}
                        readOnly={!(canEdit || canEditProcessing)}
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
                        className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${(canEdit || canEditProcessing) ? '' : 'bg-gray-100'}`}
                        lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                      />
                      {(canEdit || canEditProcessing) && (
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
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>{t('sales.changeRequestDetail.fields.effectiveUntil')}</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={formData?.effectiveUntil || detail.effectiveUntil || ''}
                        onChange={(e) => setFormData(prev => prev ? { ...prev, effectiveUntil: e.target.value } : null)}
                        readOnly={!(canEdit || canEditProcessing)}
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
                        className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${(canEdit || canEditProcessing) ? '' : 'bg-gray-100'}`}
                        lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                      />
                      {(canEdit || canEditProcessing) && (
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
                      )}
                    </div>
                  </div>
              {contractType === 'SOW' && sowDetail?.desiredStartDate && (
                <div>
                  <Label>Clients' Desired Start Date</Label>
                  <Input value={formatDate(sowDetail.desiredStartDate)} readOnly className="bg-gray-100" />
                </div>
              )}
              {contractType === 'SOW' && sowDetail?.desiredEndDate && (
                <div>
                  <Label>Clients' Desired End Date</Label>
                  <Input value={formatDate(sowDetail.desiredEndDate)} readOnly className="bg-gray-100" />
                </div>
              )}
              {contractType === 'SOW' && sowDetail?.expectedExtraCost != null && (
                <div>
                  <Label>Client's Expected Extra Cost</Label>
                  <Input value={formatCurrency(sowDetail.expectedExtraCost)} readOnly className="bg-gray-100" />
                </div>
              )}
                  <div>
                    <Label>Created By</Label>
                    <Input value={detail.createdBy} readOnly className="bg-gray-100" />
                  </div>
                  <div>
                    <Label>Created Date</Label>
                    <Input value={formatDate(detail.createdDate)} readOnly className="bg-gray-100" />
                  </div>
                </div>
                <div className="mt-4">
                    <Label>{t('sales.changeRequestDetail.fields.status')}</Label>
                  <div className="mt-2">
                    <Badge className={getStatusBadgeColor(detail.status)}>
                      {detail.status}
                    </Badge>
                  </div>
                </div>
              </section>

              {/* Change Summary Section */}
              <section className="border-b pb-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.changeSummary')}</h3>
                <Textarea
                  value={formData?.summary || detail.summary}
                  onChange={(e) => setFormData(prev => prev ? { ...prev, summary: e.target.value } : null)}
                  readOnly={!canEdit}
                  className={canEdit ? '' : 'bg-gray-100'}
                  rows={4}
                  placeholder="Enter Change summary of the change request"
                />
              </section>

              {/* Reason Section - Only for Fixed Price SOW */}
              {contractType === 'SOW' && engagementType === 'Fixed Price' && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.reason') || 'Reason'}</h3>
                  <Textarea
                    value={formData?.comment || detail.comment || ''}
                    onChange={(e) => setFormData(prev => prev ? { ...prev, comment: e.target.value } : null)}
                    readOnly={!canEdit && !canEditProcessing}
                    className={(canEdit || canEditProcessing) ? '' : 'bg-gray-100'}
                    rows={4}
                  />
                </section>
              )}

              {/* References Section */}
              <section className="border-b pb-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.references')}</h3>
                <Input
                  value={formData?.references || detail.references || ''}
                  onChange={(e) => setFormData(prev => prev ? { ...prev, references: e.target.value } : null)}
                  readOnly={!canEdit}
                  className={canEdit ? '' : 'bg-gray-100'}
                  placeholder="Enter references"
                />
              </section>

              {/* Engaged Engineer Section - Only for MSA Fixed Price and SOW Retainer */}
              {(contractType === 'MSA' || (contractType === 'SOW' && detail.engagedEngineers && detail.engagedEngineers.length > 0)) && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.engagedEngineer')}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('sales.changeRequestDetail.fields.engineerLevel')}</TableHead>
                        <TableHead>{t('sales.changeRequestDetail.fields.startDate')}</TableHead>
                        <TableHead>{t('sales.changeRequestDetail.fields.endDate')}</TableHead>
                        <TableHead>{t('sales.changeRequestDetail.fields.rating')}</TableHead>
                        <TableHead>{t('sales.changeRequestDetail.fields.salary')}</TableHead>
                        {canEdit && <TableHead>{t('sales.changeRequestDetail.actions.remove')}</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(formData?.engagedEngineers || detail.engagedEngineers || []).map((engineer, index) => {
                        // Check if this engineer is in the past (for Retainer SOW with new CR types)
                        const isPastEngineer = isNewRetainerCRType && isPastDate(engineer.endDate);
                        // For RESOURCE_CHANGE, if engineer comes from contract (has startDate and engineerLevel), only allow edit Engineer Level
                        // Start date is always editable (except for past engineers)
                        const isFromContract = isNewRetainerCRType && crType === 'RESOURCE_CHANGE' && engineer.startDate && engineer.engineerLevel;
                        const canEditEngineerLevel = (canEdit || canEditProcessing) && !isPastEngineer && !isFromContract;
                        const canEditStartDate = (canEdit || canEditProcessing) && !isPastEngineer; // Always allow editing start date (except past)
                        const canEditEndDate = (canEdit || canEditProcessing) && !isPastEngineer;
                        const canEditRating = (canEdit || canEditProcessing) && !isPastEngineer;
                        const canEditSalary = (canEdit || canEditProcessing) && !isPastEngineer;
                        const canRemoveEngineer = (canEdit || canEditProcessing) && !isPastEngineer && !isFromContract;
                        
                        return (
                          <TableRow key={index} className={isPastEngineer ? 'bg-gray-50' : ''}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {(isPastEngineer || isFromContract) && <span className="text-gray-400" title={isPastEngineer ? "Past data - read only" : "From contract - read only"}>🔒</span>}
                                <Input
                                  value={engineer.engineerLevel}
                                  onChange={(e) => {
                                    const updated = [...(formData?.engagedEngineers || [])];
                                    updated[index] = { ...updated[index], engineerLevel: e.target.value };
                                    setFormData(prev => prev ? { ...prev, engagedEngineers: updated } : null);
                                  }}
                                  readOnly={!canEditEngineerLevel}
                                  className={canEditEngineerLevel ? '' : 'bg-gray-100'}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="relative">
                                <Input
                                  type="date"
                                  value={engineer.startDate || ''}
                                  onChange={(e) => {
                                    const updated = [...(formData?.engagedEngineers || [])];
                                    updated[index] = { ...updated[index], startDate: e.target.value };
                                    setFormData(prev => prev ? { ...prev, engagedEngineers: updated } : null);
                                  }}
                                  readOnly={!canEditStartDate}
                                  className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${canEditStartDate ? '' : 'bg-gray-100'}`}
                                  lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                                />
                                {canEditStartDate && (
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
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="relative">
                                <Input
                                  type="date"
                                  value={engineer.endDate || ''}
                                  onChange={(e) => {
                                    const updated = [...(formData?.engagedEngineers || [])];
                                    updated[index] = { ...updated[index], endDate: e.target.value };
                                    setFormData(prev => prev ? { ...prev, engagedEngineers: updated } : null);
                                  }}
                                  readOnly={!canEditEndDate}
                                  className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${canEditEndDate ? '' : 'bg-gray-100'}`}
                                  lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                                />
                                {canEditEndDate && (
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
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={engineer.rating ?? ''}
                                onChange={(e) => {
                                  const updated = [...(formData?.engagedEngineers || [])];
                                  updated[index] = { ...updated[index], rating: parseFloat(e.target.value) || 0 };
                                  setFormData(prev => prev ? { ...prev, engagedEngineers: updated } : null);
                                }}
                                readOnly={!canEditRating}
                                className={canEditRating ? '' : 'bg-gray-100'}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={engineer.salary ?? ''}
                                onChange={(e) => {
                                  const updated = [...(formData?.engagedEngineers || [])];
                                  updated[index] = { ...updated[index], salary: parseFloat(e.target.value) || 0 };
                                  setFormData(prev => prev ? { ...prev, engagedEngineers: updated } : null);
                                }}
                                readOnly={!canEditSalary}
                                className={canEditSalary ? '' : 'bg-gray-100'}
                              />
                            </TableCell>
                            {canRemoveEngineer && (
                              <TableCell>
                                {(formData?.engagedEngineers || []).length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updated = [...(formData?.engagedEngineers || [])];
                                      updated.splice(index, 1);
                                      setFormData(prev => prev ? { ...prev, engagedEngineers: updated } : null);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = [...(formData?.engagedEngineers || []), {
                          engineerLevel: '',
                          startDate: '',
                          endDate: '',
                          rating: 0,
                          salary: 0,
                        }];
                        setFormData(prev => prev ? { ...prev, engagedEngineers: updated } : null);
                      }}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('sales.changeRequestDetail.actions.addRow')}
                    </Button>
                  )}
                </section>
              )}

              {/* Billing Details Section - Only for MSA Fixed Price and SOW Retainer */}
              {(contractType === 'MSA' || (contractType === 'SOW' && detail.billingDetails && detail.billingDetails.length > 0)) && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.billingDetails')}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('sales.changeRequestDetail.fields.paymentDate')}</TableHead>
                        <TableHead>{t('sales.changeRequestDetail.fields.deliveryNote')}</TableHead>
                        <TableHead>{t('sales.changeRequestDetail.fields.amount')}</TableHead>
                        {canEdit && <TableHead>{t('sales.changeRequestDetail.actions.remove')}</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(formData?.billingDetails || detail.billingDetails || []).map((billing, index) => {
                        // Check if billing date is in the past (for Retainer SOW with new CR types)
                        const isPastBilling = isNewRetainerCRType && (
                          isPastDate(billing.paymentDate) || 
                          (billing.paymentDate && new Date(billing.paymentDate) < new Date(new Date().setHours(0, 0, 0, 0)))
                        );
                        const canEditBilling = (canEdit || canEditProcessing) && !isPastBilling;
                        
                        return (
                        <TableRow key={index} className={isPastBilling ? 'bg-gray-50' : ''}>
                          <TableCell>
                            <div className="relative flex items-center gap-2">
                              {isPastBilling && <span className="text-gray-400" title="Past billing - read only">🔒</span>}
                              <Input
                                type="date"
                                value={billing.paymentDate}
                                onChange={(e) => {
                                  const updated = [...(formData?.billingDetails || [])];
                                  updated[index] = { ...updated[index], paymentDate: e.target.value };
                                  setFormData(prev => prev ? { ...prev, billingDetails: updated } : null);
                                }}
                                readOnly={!canEditBilling}
                                className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${canEditBilling ? '' : 'bg-gray-100'}`}
                                lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                              />
                              {canEditBilling && (
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
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={billing.deliveryNote}
                              onChange={(e) => {
                                const updated = [...(formData?.billingDetails || [])];
                                updated[index] = { ...updated[index], deliveryNote: e.target.value };
                                setFormData(prev => prev ? { ...prev, billingDetails: updated } : null);
                              }}
                              readOnly={!canEditBilling}
                              className={canEditBilling ? '' : 'bg-gray-100'}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={billing.amount}
                              onChange={(e) => {
                                const updated = [...(formData?.billingDetails || [])];
                                updated[index] = { ...updated[index], amount: parseFloat(e.target.value) || 0 };
                                setFormData(prev => prev ? { ...prev, billingDetails: updated } : null);
                              }}
                              readOnly={!canEditBilling}
                              className={canEditBilling ? '' : 'bg-gray-100'}
                            />
                          </TableCell>
                          {canEditBilling && (
                            <TableCell>
                              {(formData?.billingDetails || []).length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updated = [...(formData?.billingDetails || [])];
                                    updated.splice(index, 1);
                                    setFormData(prev => prev ? { ...prev, billingDetails: updated } : null);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      )})}
                    </TableBody>
                  </Table>
                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = [...(formData?.billingDetails || []), {
                          paymentDate: '',
                          deliveryNote: '',
                          amount: 0,
                        }];
                        setFormData(prev => prev ? { ...prev, billingDetails: updated } : null);
                      }}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('sales.changeRequestDetail.actions.addRow')}
                    </Button>
                  )}
                </section>
              )}

              {/* Impact Analysis Section - Only for Fixed Price SOW when status is Processing */}
              {isProcessing && contractType === 'SOW' && engagementType === 'Fixed Price' && (() => {
                const sowFormData = formData as CreateChangeRequestFormData | null;
                const sowDetail = detail as SalesChangeRequestDetail | null;
                return (
                  <section className="border-b pb-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.impactAnalysis') || 'Impact Analysis'}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="devHours">{t('sales.createChangeRequest.fields.devHours') || 'Dev Hours'} *</Label>
                        <Input
                          id="devHours"
                          type="number"
                          value={sowFormData?.impactAnalysis?.devHours ?? sowDetail?.devHours ?? ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          const currentFormData = (formData as CreateChangeRequestFormData) || {
                            title: detail?.title || '',
                            type: detail?.type || '',
                            summary: detail?.summary || '',
                            effectiveFrom: detail?.effectiveFrom || '',
                            effectiveUntil: detail?.effectiveUntil || '',
                            engagedEngineers: [],
                            billingDetails: [],
                            impactAnalysis: { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 },
                            internalReviewerId: detail?.internalReviewerId || 0,
                            comment: detail?.comment || '',
                            action: 'save' as const,
                          } as CreateChangeRequestFormData;
                          setFormData({
                            ...currentFormData,
                            impactAnalysis: {
                              ...(currentFormData.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                              devHours: value,
                            }
                          } as CreateChangeRequestFormData);
                        }}
                        placeholder={t('sales.createChangeRequest.placeholders.devHours') || '0'}
                        readOnly={!canEditProcessing}
                        className={canEditProcessing ? '' : 'bg-gray-100'}
                      />
                    </div>
                      <div>
                        <Label htmlFor="testHours">{t('sales.createChangeRequest.fields.testHours') || 'Test Hours'} *</Label>
                        <Input
                          id="testHours"
                          type="number"
                          value={sowFormData?.impactAnalysis?.testHours ?? sowDetail?.testHours ?? ''}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            const currentFormData = (formData as CreateChangeRequestFormData) || {
                              title: detail?.title || '',
                              type: detail?.type || '',
                              summary: detail?.summary || '',
                              effectiveFrom: detail?.effectiveFrom || '',
                              effectiveUntil: detail?.effectiveUntil || '',
                              engagedEngineers: [],
                              billingDetails: [],
                              impactAnalysis: { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 },
                              internalReviewerId: detail?.internalReviewerId || 0,
                              comment: detail?.comment || '',
                              action: 'save' as const,
                            } as CreateChangeRequestFormData;
                            setFormData({
                              ...currentFormData,
                              impactAnalysis: {
                                ...(currentFormData.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                                testHours: value,
                              }
                            } as CreateChangeRequestFormData);
                          }}
                        placeholder={t('sales.createChangeRequest.placeholders.testHours') || '0'}
                        readOnly={!canEditProcessing}
                        className={canEditProcessing ? '' : 'bg-gray-100'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newEndDate">{t('sales.createChangeRequest.fields.newEndDate') || 'New End Date'} *</Label>
                      <div className="relative">
                        <Input
                          id="newEndDate"
                          type="date"
                          value={sowFormData?.impactAnalysis?.newEndDate ?? sowDetail?.newEndDate ?? ''}
                          onChange={(e) => {
                            const currentFormData = (formData as CreateChangeRequestFormData) || {
                              title: detail?.title || '',
                              type: detail?.type || '',
                              summary: detail?.summary || '',
                              effectiveFrom: detail?.effectiveFrom || '',
                              effectiveUntil: detail?.effectiveUntil || '',
                              engagedEngineers: [],
                              billingDetails: [],
                              impactAnalysis: { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 },
                              internalReviewerId: detail?.internalReviewerId || 0,
                              comment: detail?.comment || '',
                              action: 'save' as const,
                            } as CreateChangeRequestFormData;
                            setFormData({
                              ...currentFormData,
                              impactAnalysis: {
                                ...(currentFormData.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                                newEndDate: e.target.value,
                              }
                            } as CreateChangeRequestFormData);
                          }}
                          readOnly={!canEditProcessing}
                          className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${canEditProcessing ? '' : 'bg-gray-100'}`}
                          lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                        />
                        {canEditProcessing && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const input = document.getElementById('newEndDate') as HTMLInputElement;
                              input?.showPicker?.();
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
                      <Label htmlFor="delayDuration">{t('sales.createChangeRequest.fields.delayDuration') || 'Delay Duration'} *</Label>
                      <div className="flex items-center">
                        <Input
                          id="delayDuration"
                          type="number"
                          value={sowFormData?.impactAnalysis?.delayDuration ?? sowDetail?.delayDuration ?? ''}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            const currentFormData = (formData as CreateChangeRequestFormData) || {
                              title: detail?.title || '',
                              type: detail?.type || '',
                              summary: detail?.summary || '',
                              effectiveFrom: detail?.effectiveFrom || '',
                              effectiveUntil: detail?.effectiveUntil || '',
                              engagedEngineers: [],
                              billingDetails: [],
                              impactAnalysis: { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 },
                              internalReviewerId: detail?.internalReviewerId || 0,
                              comment: detail?.comment || '',
                              action: 'save' as const,
                            } as CreateChangeRequestFormData;
                            setFormData({
                              ...currentFormData,
                              impactAnalysis: {
                                ...(currentFormData.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                                delayDuration: value,
                              }
                            } as CreateChangeRequestFormData);
                          }}
                          placeholder={t('sales.createChangeRequest.placeholders.delayDuration') || '0'}
                          readOnly={!canEditProcessing}
                          className={canEditProcessing ? '' : 'bg-gray-100'}
                        />
                        <span className="text-sm text-gray-500 ml-2">days</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="additionalCost">{t('sales.createChangeRequest.fields.additionalCost') || 'Additional Cost'} *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                        <Input
                          id="additionalCost"
                          type="text"
                          value={sowFormData?.impactAnalysis?.additionalCost ? formatCurrency(sowFormData.impactAnalysis.additionalCost) : (sowDetail?.additionalCost ? formatCurrency(sowDetail.additionalCost) : '')}
                          onChange={(e) => {
                            const amount = parseCurrency(e.target.value);
                            const currentFormData = (formData as CreateChangeRequestFormData) || {
                              title: detail?.title || '',
                              type: detail?.type || '',
                              summary: detail?.summary || '',
                              effectiveFrom: detail?.effectiveFrom || '',
                              effectiveUntil: detail?.effectiveUntil || '',
                              engagedEngineers: [],
                              billingDetails: [],
                              impactAnalysis: { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 },
                              internalReviewerId: detail?.internalReviewerId || 0,
                              comment: detail?.comment || '',
                              action: 'save' as const,
                            } as CreateChangeRequestFormData;
                            setFormData({
                              ...currentFormData,
                              impactAnalysis: {
                                ...(currentFormData.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                                additionalCost: amount,
                              }
                            } as CreateChangeRequestFormData);
                          }}
                          placeholder="0"
                          readOnly={!canEditProcessing}
                          className={`pl-8 ${canEditProcessing ? '' : 'bg-gray-100'}`}
                        />
                      </div>
                    </div>
                  </div>
                </section>
                );
              })()}

              {/* Attachments Section */}
              <section className="border-b pb-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.attachments')}</h3>
                {detail.attachments && detail.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {detail.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{attachment.fileName}</span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAttachment(attachment.filePath)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement delete attachment
                                alert('Delete attachment functionality coming soon');
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No attachments</p>
                )}
                {canEdit && (
                  <div className="mt-4">
                    <Label>{t('sales.changeRequestDetail.actions.upload')} (PDF only, max 10MB, 1 file)</Label>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={handleAttachmentChange}
                    />
                  </div>
                )}
              </section>

              {/* Retainer SOW: Current Resources (baseline from contract detail) */}
              {isRetainerSOW && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.currentResources') || 'Current Resources at Effective From'}</h3>
                  {baselineResources && baselineResources.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100">
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.engineerLevel') || 'Engineer Level'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.startDate') || 'Start Date'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.endDate') || 'End Date'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.rating') || 'Rating'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.salary') || 'Salary'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {baselineResources.map((eng, idx) => (
                            <TableRow key={idx} className="bg-white">
                              <TableCell className="text-gray-700">{eng.engineerLevel || '-'}</TableCell>
                              <TableCell className="text-gray-700">{eng.startDate || '-'}</TableCell>
                              <TableCell className="text-gray-700">{eng.endDate || '-'}</TableCell>
                              <TableCell className="text-gray-700">{eng.rating ?? '-'}</TableCell>
                              <TableCell className="text-gray-700">{eng.salary != null ? `¥${eng.salary.toLocaleString('ja-JP')}` : '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">{t('sales.changeRequestDetail.sections.noCurrentResources') || 'No resource data provided.'}</p>
                  )}
                </section>
              )}

              {/* Retainer SOW: Resources After This Change Request (editable in Processing) */}
              {isRetainerSOW && canEditProcessing && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {t('sales.createChangeRequest.sections.resourcesAfterCR') || 'Resources After This Change Request'}
                  </h3>
                  
                  <div className="mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addEngagedEngineer}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t('sales.createChangeRequest.actions.addEngineer') || 'Add Engineer'}
                    </Button>
                  </div>

                  {formData?.engagedEngineers && formData.engagedEngineers.length > 0 ? (
                    <div className="space-y-4">
                      {formData.engagedEngineers.map((engineer, index) => {
                        const isRemoved = (engineer as any).action === 'REMOVE';
                        const isNew = (engineer as any).action === 'ADD' && !(engineer as any).engineerId;
                        
                        return (
                          <div
                            key={index}
                            className={`p-4 border rounded-lg ${isRemoved ? 'opacity-50 line-through bg-gray-100' : ''}`}
                          >
                            {(() => {
                              const billingType = (engineer as any).billingType || 'Monthly';
                              const isHourly = billingType === 'Hourly';
                              
                              return (
                                <>
                                  <div className="grid grid-cols-4 gap-4 mb-4">
                                    <div>
                                      <Label>{t('sales.createChangeRequest.fields.engineerLevel')} *</Label>
                                      <Input
                                        value={engineer.engineerLevel || ''}
                                        onChange={(e) => updateEngagedEngineer(index, 'engineerLevel', e.target.value)}
                                        placeholder={t('sales.createChangeRequest.placeholders.engineerLevel') || 'e.g., Middle BE'}
                                        disabled={isRemoved}
                                      />
                                    </div>
                                    <div>
                                      <Label>{t('sales.createChangeRequest.fields.startDate')} *</Label>
                                      <div className="relative">
                                        <Input
                                          type="date"
                                          value={engineer.startDate || ''}
                                          onChange={(e) => updateEngagedEngineer(index, 'startDate', e.target.value)}
                                          disabled={isRemoved}
                                          className="pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                          lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                                        />
                                        {!isRemoved && (
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
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <Label>{t('sales.createChangeRequest.fields.endDate')}</Label>
                                      <div className="relative">
                                        <Input
                                          type="date"
                                          value={engineer.endDate || ''}
                                          onChange={(e) => updateEngagedEngineer(index, 'endDate', e.target.value || null)}
                                          disabled={isRemoved}
                                          className="pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                          lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                                        />
                                        {!isRemoved && (
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
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Billing Type *</Label>
                                      <Select
                                        key={`billing-type-${index}-${billingType}`}
                                        value={billingType}
                                        onValueChange={(value: string) => {
                                          updateEngagedEngineer(index, 'billingType', value);
                                        }}
                                        disabled={isRemoved}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="z-[10000]">
                                          <SelectItem value="Monthly">Monthly</SelectItem>
                                          <SelectItem value="Hourly">Hourly</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  {!isHourly ? (
                                    // Monthly billing fields
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Rating (%) *</Label>
                                        <Input
                                          type="number"
                                          value={engineer.rating || ''}
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            updateEngagedEngineer(index, 'rating', value);
                                          }}
                                          disabled={isRemoved}
                                          min="0"
                                          max="100"
                                          step="0.5"
                                          placeholder="0-100"
                                        />
                                      </div>
                                      <div>
                                        <Label>Salary (¥/month) *</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                          <Input
                                            type="text"
                                            value={formatCurrency(engineer.salary || 0)}
                                            onChange={(e) => {
                                              const salary = parseCurrency(e.target.value);
                                              updateEngagedEngineer(index, 'salary', salary);
                                            }}
                                            disabled={isRemoved}
                                            className="pl-8"
                                            placeholder="0"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    // Hourly billing fields
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <Label>Hourly Rate (¥/h) *</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                          <Input
                                            type="text"
                                            value={formatCurrency((engineer as any).hourlyRate || 0)}
                                            onChange={(e) => {
                                              const hourlyRate = parseCurrency(e.target.value);
                                              updateEngagedEngineer(index, 'hourlyRate', hourlyRate);
                                            }}
                                            disabled={isRemoved}
                                            className="pl-8"
                                            placeholder="0"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Hours *</Label>
                                        <Input
                                          type="number"
                                          value={(engineer as any).hours || ''}
                                          onChange={(e) => {
                                            const hours = parseFloat(e.target.value) || 0;
                                            updateEngagedEngineer(index, 'hours', hours);
                                          }}
                                          disabled={isRemoved}
                                          min="0"
                                          step="0.5"
                                          placeholder="0"
                                        />
                                      </div>
                                      <div>
                                        <Label>Subtotal</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                          <Input
                                            type="text"
                                            value={formatCurrency((engineer as any).subtotal || 0)}
                                            disabled
                                            className="pl-8 bg-gray-50"
                                            placeholder="0"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                            <div className="mt-2 flex items-center justify-between">
                              {isRemoved ? (
                                <span className="text-gray-500 text-sm">{t('sales.createChangeRequest.actions.removed') || 'Removed'}</span>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  {(engineer as any).action === 'ADD' && t('sales.createChangeRequest.actions.newEngineer') || ''}
                                  {(engineer as any).action === 'MODIFY' && t('sales.createChangeRequest.actions.modified') || ''}
                                </span>
                              )}
                              {(engineer as any).engineerId !== null && (engineer as any).engineerId !== undefined && !isRemoved && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEngagedEngineer(index)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
                              {isNew && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEngagedEngineer(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm py-4 border rounded-lg bg-gray-50 text-center">
                      {t('sales.createChangeRequest.sections.noEngineersAfter') || 'No engineers added yet. Click "Add Engineer" to add resources.'}
                    </div>
                  )}
                </section>
              )}
              
              {/* Retainer SOW: Resources After This Change Request (read-only when not Processing) */}
              {isRetainerSOW && !canEditProcessing && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.resourcesAfter') || 'Resources After This Change Request'}</h3>
                  {formData?.engagedEngineers && formData.engagedEngineers.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.engineerLevel') || 'Engineer Level'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.startDate') || 'Start Date'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.endDate') || 'End Date'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.rating') || 'Rating'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.salary') || 'Salary'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.engagedEngineers.map((eng, idx) => (
                            <TableRow key={idx} className="bg-white">
                              <TableCell className="text-gray-700">{eng.engineerLevel}</TableCell>
                              <TableCell className="text-gray-700">{eng.startDate || '-'}</TableCell>
                              <TableCell className="text-gray-700">{eng.endDate || '-'}</TableCell>
                              <TableCell className="text-gray-700">{eng.rating ?? '-'}</TableCell>
                              <TableCell className="text-gray-700">{eng.salary != null ? `¥${eng.salary.toLocaleString('ja-JP')}` : '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">{t('sales.changeRequestDetail.sections.noResourcesAfter') || 'No resource changes provided.'}</p>
                  )}
                </section>
              )}

              {/* Retainer SOW: Current Billing Schedule (Read-only from contract baseline) */}
              {isRetainerSOW && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.currentBilling') || 'Current Billing Schedule (Read-only)'}</h3>
                  {baselineBilling && baselineBilling.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100">
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.paymentDate') || 'Payment Date'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.deliveryNote') || 'Delivery Note'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.changeRequestDetail.fields.amount') || 'Amount'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {baselineBilling.map((bill, idx) => (
                            <TableRow key={idx} className="bg-white">
                              <TableCell className="text-gray-700">
                                {bill.invoiceDate ? formatDate(bill.invoiceDate) : '-'}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {bill.deliveryNote || '-'}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {bill.amount != null ? `¥${bill.amount.toLocaleString('ja-JP')}` : '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">{t('sales.changeRequestDetail.sections.noBilling') || 'No billing details provided.'}</p>
                  )}
                </section>
              )}

              {/* Retainer SOW: Billing Adjustments in this Change Request */}
              {isRetainerSOW && canEditProcessing && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {t('sales.createChangeRequest.sections.billingAdjustments') || 'Billing Adjustments in this Change Request'}
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('sales.createChangeRequest.fields.paymentDate')} *</TableHead>
                          <TableHead>{t('sales.createChangeRequest.fields.adjustmentNote') || 'Adjustment Note'} *</TableHead>
                          <TableHead>{t('sales.createChangeRequest.fields.adjustmentAmount') || 'Adjustment Amount (±)'} *</TableHead>
                          <TableHead>{t('sales.createChangeRequest.table.action')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData?.billingDetails && formData.billingDetails.length > 0 ? (
                          formData.billingDetails.map((billing, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="relative flex items-center gap-2">
                                  <Input
                                    type="date"
                                    value={billing.paymentDate}
                                    onChange={(e) => updateBillingDetail(index, 'paymentDate', e.target.value)}
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
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={billing.deliveryNote}
                                  onChange={(e) => updateBillingDetail(index, 'deliveryNote', e.target.value)}
                                  placeholder={t('sales.createChangeRequest.placeholders.adjustmentNote') || 'e.g. Increase for adding 1 FE, Remove QA from Feb'}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={billingSigns[index] || (billing.amount < 0 ? '-' : '+')}
                                    onValueChange={(value: '+' | '-') => {
                                      setBillingSigns(prev => ({
                                        ...prev,
                                        [index]: value,
                                      }));
                                      // Update amount with new sign
                                      const currentAmount = Math.abs(billing.amount);
                                      updateBillingDetail(index, 'amount', value === '-' ? -currentAmount : currentAmount);
                                    }}
                                  >
                                    <SelectTrigger className="w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="z-[10000]">
                                      <SelectItem value="+">+</SelectItem>
                                      <SelectItem value="-">-</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                    <Input
                                      type="text"
                                      value={billing.amount !== 0 ? formatCurrency(Math.abs(billing.amount)) : ''}
                                      onChange={(e) => {
                                        let value = e.target.value.trim();
                                        
                                        // If value is empty, set to 0
                                        if (value === '') {
                                          updateBillingDetail(index, 'amount', 0);
                                          return;
                                        }
                                        
                                        // Parse the numeric value (remove commas and currency symbols)
                                        const amount = parseCurrency(value);
                                        const sign = billingSigns[index] || (billing.amount < 0 ? '-' : '+');
                                        updateBillingDetail(index, 'amount', sign === '-' ? -amount : amount);
                                      }}
                                      onKeyDown={(e) => {
                                        // Allow: backspace, delete, tab, escape, enter, numbers, and decimal point
                                        if (
                                          [8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
                                          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                          (e.keyCode === 65 && e.ctrlKey === true) ||
                                          (e.keyCode === 67 && e.ctrlKey === true) ||
                                          (e.keyCode === 86 && e.ctrlKey === true) ||
                                          (e.keyCode === 88 && e.ctrlKey === true) ||
                                          // Allow: home, end, left, right
                                          (e.keyCode >= 35 && e.keyCode <= 40) ||
                                          // Allow numbers and decimal point
                                          ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105))
                                        ) {
                                          return;
                                        }
                                        e.preventDefault();
                                      }}
                                      className="pl-8"
                                      placeholder="e.g. 300,000"
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {formData.billingDetails.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeBillingAdjustment(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                              {t('sales.createChangeRequest.sections.noAdjustments') || 'No adjustments added yet. Click "+ Add Adjustment" to add billing adjustments.'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addBillingAdjustment}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('sales.createChangeRequest.actions.addAdjustment') || '+ Add Adjustment'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    {t('sales.createChangeRequest.sections.billingAdjustmentsNote') || 'These adjustments will be applied on top of the current billing schedule when this Change Request is approved.'}
                  </p>
                </section>
              )}
              
              {/* Retainer SOW: Billing Adjustments (read-only when not Processing) */}
              {isRetainerSOW && !canEditProcessing && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {t('sales.createChangeRequest.sections.billingAdjustments') || 'Billing Adjustments in this Change Request'}
                  </h3>
                  {formData?.billingDetails && formData.billingDetails.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.paymentDate') || 'Payment Date'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.adjustmentNote') || 'Adjustment Note'}</TableHead>
                            <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.adjustmentAmount') || 'Adjustment Amount (±)'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.billingDetails.map((bill, idx) => (
                            <TableRow key={idx} className="bg-white">
                              <TableCell className="text-gray-700">{bill.paymentDate || '-'}</TableCell>
                              <TableCell className="text-gray-700">{bill.deliveryNote || '-'}</TableCell>
                              <TableCell className="text-gray-700">{bill.amount != null ? `¥${bill.amount.toLocaleString('ja-JP')}` : '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">{t('sales.changeRequestDetail.sections.noBillingAdjustments') || 'No billing adjustments provided.'}</p>
                  )}
                </section>
              )}

              {/* Approval & Workflow Section */}
              <section className="border-b pb-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.approvalWorkflow')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('sales.changeRequestDetail.fields.internalReviewer')}</Label>
                    {(canEdit || canEditProcessing) ? (
                      <Select
                        value={formData?.internalReviewerId?.toString() || ''}
                        onValueChange={(value: string) => setFormData(prev => prev ? { ...prev, internalReviewerId: parseInt(value) } : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select reviewer" />
                        </SelectTrigger>
                        <SelectContent>
                          {salesUsers
                            .filter(user => user.role === 'SALES_MANAGER')
                            .map(user => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.fullName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={detail.internalReviewerName || 'Not assigned'}
                        readOnly
                        className="bg-gray-100"
                      />
                    )}
                  </div>
                  
                  {(canReview || (canEditProcessing && isAssignedReviewer && isSalesManager)) && (
                    <>
                      <div>
                        <Label>{t('sales.changeRequestDetail.fields.actions')}</Label>
                        <Select
                          value={reviewAction}
                          onValueChange={setReviewAction}
                          disabled={!canReview && !(isAssignedReviewer && isSalesManager)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="APPROVE">Approve</SelectItem>
                            <SelectItem value="REQUEST_REVISION">Request Revision</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label>{t('sales.changeRequestDetail.fields.reviewNotes')}</Label>
                        <Textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder={t('sales.changeRequestDetail.fields.reviewNotes')}
                          rows={4}
                          readOnly={!canReview && !(isAssignedReviewer && isSalesManager)}
                          className={(!canReview && !(isAssignedReviewer && isSalesManager)) ? 'bg-gray-100' : ''}
                        />
                      </div>
                    </>
                  )}
                  
                  {detail.status === 'Client Under Review' && detail.reviewAction && (
                    <div className="col-span-2">
                      <h4 className="font-semibold mb-2">Review Result</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Reviewer</Label>
                          <Input value={detail.internalReviewerName || 'N/A'} readOnly className="bg-gray-100" />
                        </div>
                        <div>
                          <Label>Action</Label>
                          <Input
                            value={detail.reviewAction === 'APPROVE' ? 'Approved' : 'Request Revision'}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>
                        {detail.reviewNotes && (
                          <div className="col-span-2">
                            <Label>Review Notes</Label>
                            <Textarea value={detail.reviewNotes} readOnly className="bg-gray-100" rows={4} />
                          </div>
                        )}
                        {detail.reviewDate && (
                          <div>
                            <Label>Review Date</Label>
                            <Input value={formatDate(detail.reviewDate)} readOnly className="bg-gray-100" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Comment Section - Only for Retainer SOW and MSA */}
              {!(contractType === 'SOW' && engagementType === 'Fixed Price') && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.comment')}</h3>
                  <Textarea
                    value={formData?.comment || detail.comment || ''}
                    onChange={(e) => setFormData(prev => prev ? { ...prev, comment: e.target.value } : null)}
                    readOnly={!canEdit}
                    className={canEdit ? '' : 'bg-gray-100'}
                    rows={4}
                  />
                </section>
              )}

              {/* History Section */}
              {detail.history && detail.history.length > 0 && (
                <section className="border-b pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">{t('sales.changeRequestDetail.sections.history')}</h3>
                  <div className="space-y-4">
                    {detail.history.map((historyItem) => (
                      <div key={historyItem.id} className="border-l-4 border-gray-300 pl-4 py-2">
                        <p className="text-sm font-medium text-gray-900">{historyItem.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(historyItem.date)} by {historyItem.user}
                        </p>
                        {historyItem.documentLink && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAttachment(historyItem.documentLink!)}
                            className="mt-2"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Document
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {errorMessage}
                </div>
              )}

              {/* Preview Section - For Retainer SOW Processing CRs */}
              {isRetainerSOW && isProcessing && (
                <section className="border-b pb-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Preview Changes</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadPreview}
                      disabled={loadingPreview}
                    >
                      {loadingPreview ? 'Loading...' : showPreview ? 'Refresh Preview' : 'Load Preview'}
                    </Button>
                  </div>
                  {showPreview && preview && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Resources - Before</h4>
                          <div className="max-h-40 overflow-y-auto border rounded p-2">
                            {preview.resources.before.length > 0 ? (
                              <ul className="text-sm space-y-1">
                                {preview.resources.before.map((eng, idx) => (
                                  <li key={idx}>
                                    {eng.engineerLevel} ({eng.rating}%) - {eng.startDate} to {eng.endDate}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 text-sm">No resources</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Resources - After</h4>
                          <div className="max-h-40 overflow-y-auto border rounded p-2">
                            {preview.resources.after.length > 0 ? (
                              <ul className="text-sm space-y-1">
                                {preview.resources.after.map((eng, idx) => (
                                  <li key={idx}>
                                    {eng.engineerLevel} ({eng.rating}%) - {eng.startDate} to {eng.endDate}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 text-sm">No resources</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Billing - Before</h4>
                          <div className="max-h-40 overflow-y-auto border rounded p-2">
                            {preview.billing.before.length > 0 ? (
                              <ul className="text-sm space-y-1">
                                {preview.billing.before.map((bill, idx) => (
                                  <li key={idx}>
                                    {bill.paymentDate}: ¥{bill.amount.toLocaleString('ja-JP')} - {bill.deliveryNote}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 text-sm">No billing</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Billing - After</h4>
                          <div className="max-h-40 overflow-y-auto border rounded p-2">
                            {preview.billing.after.length > 0 ? (
                              <ul className="text-sm space-y-1">
                                {preview.billing.after.map((bill, idx) => (
                                  <li key={idx}>
                                    {bill.paymentDate}: ¥{bill.amount.toLocaleString('ja-JP')} - {bill.deliveryNote}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 text-sm">No billing</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Appendix Section (for Retainer SOW - Event-based) */}
              {isRetainerSOW && (appendix || loadingAppendix) && (
                <section className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {t('sales.changeRequestDetail.sections.appendix') || 'Contract Appendix'}
                  </h3>
                  {loadingAppendix ? (
                    <div className="text-gray-500">Loading appendix...</div>
                  ) : appendix ? (
                    <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-blue-600 text-lg">{appendix.appendixNumber}</span>
                            {appendix.signedAt && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {t('sales.changeRequestDetail.appendix.signed') || 'Signed'}
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">{appendix.title}</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-line mb-3">{appendix.summary}</p>
                          {appendix.signedAt && (
                            <p className="text-xs text-gray-600">
                              {t('sales.changeRequestDetail.appendix.signedAt') || 'Signed at'}: {formatDate(appendix.signedAt)}
                            </p>
                          )}
                        </div>
                        {appendix.pdfPath && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(appendix.pdfPath || '', '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {t('sales.changeRequestDetail.appendix.viewPDF') || 'View PDF'}
                          </Button>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          {t('sales.changeRequestDetail.appendix.createdAt') || 'Created'}: {formatDate(appendix.createdAt)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </section>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                {appendix ? (
                  <Button onClick={onClose} className="bg-blue-600 text-white hover:bg-blue-700">
                    {t('sales.changeRequestDetail.close') || 'Close'}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={onClose} disabled={submitting}>
                    Cancel
                  </Button>
                )}
                {(canEdit || canEditProcessing) && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save Draft'}
                    </Button>
                    {canEdit && (
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting || !formData?.internalReviewerId}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {submitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    )}
                  </>
                )}
                {/* Submit button for Sales Rep in Processing status */}
                {isRetainerSOW && isProcessing && isSalesRep && (
                  <Button
                    onClick={handleSubmitForProcessing}
                    disabled={submitting || !formData?.internalReviewerId}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </Button>
                )}
                {/* Approve button for Sales Manager (assigned reviewer) in Processing status */}
                {isRetainerSOW && isProcessing && isSalesManager && isAssignedReviewer && (
                  <Button
                    onClick={handleApprove}
                    disabled={submitting}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    {submitting ? 'Approving...' : 'Approve'}
                  </Button>
                )}
                {/* Review buttons for other statuses; Processing Fixed Price allows Sales Rep/Manager */}
                {canReview && (
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                )}
                {(!isRetainerSOW && isProcessing) && (
                  isSalesManager ? (
                    <Button
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      {submitting ? 'Approving...' : 'Approve'}
                    </Button>
                  ) : isSalesRep ? (
                    <Button
                      onClick={handleSaveProcessingFixedPriceRep}
                      disabled={submitting}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {submitting ? 'Submitting...' : 'Save Change Request'}
                    </Button>
                  ) : null
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

