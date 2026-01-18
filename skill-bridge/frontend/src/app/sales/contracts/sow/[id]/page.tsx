'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Upload, X, Eye, Plus, Bell } from 'lucide-react';
import SalesSidebar from '@/components/design-patterns/sales/SalesSidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getSOWContractDetail,
  getSOWContractVersions,
  getSalesUsers,
  submitSOWReview,
  getChangeRequestsForSOW,
  updateSOWContract,
  getSOWContractAppendices,
  getSOWContractBaseline,
  getSOWContractCurrentState,
  getSOWContractEvents,
  updateBillingDetailPaymentStatus,
  ContractAppendix,
  BaselineData,
  CurrentState,
  SOWContractDetail,
  SalesUser,
  ChangeRequestListItem,
  ChangeRequestsListResponse,
  ResourceEvent,
  EventsResponse,
} from '@/services/salesSOWContractService';
import { getPresignedUrl } from '@/services/salesMSAContractService';
import CreateChangeRequestModal from '@/components/sales/CreateChangeRequestModal';
import SalesChangeRequestDetailModal from '@/components/sales/SalesChangeRequestDetailModal';
import CreateProjectCloseRequestModal from '@/components/CreateProjectCloseRequestModal';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useToast } from '@/components/ui/use-toast';
import {
  createProjectCloseRequest,
  resubmitProjectCloseRequest,
  getLatestProjectCloseRequest,
  ProjectCloseRequestDetail,
} from '@/services/projectCloseRequestService';

export default function SOWContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const contractId = params?.id ? parseInt(params.id as string) : null;

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Data for dropdowns
  const [salesUsers, setSalesUsers] = useState<SalesUser[]>([]);
  
  // Contract detail
  const [contractDetail, setContractDetail] = useState<SOWContractDetail | null>(null);
  
  // Appendices management (for Retainer SOW - Event-based)
  const [appendices, setAppendices] = useState<ContractAppendix[]>([]);
  const [loadingAppendices, setLoadingAppendices] = useState(false);
  
  // Baseline and Events (for Retainer SOW - Event-based)
  const [baselineData, setBaselineData] = useState<BaselineData | null>(null);
  const [currentState, setCurrentState] = useState<CurrentState | null>(null);
  const [loadingBaseline, setLoadingBaseline] = useState(false);
  const [showBaseline, setShowBaseline] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [resourceEvents, setResourceEvents] = useState<ResourceEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  
  // Form data for review
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<string | null>(null);
  
  // Change requests data
  const [changeRequests, setChangeRequests] = useState<ChangeRequestListItem[]>([]);
  const [changeRequestsLoading, setChangeRequestsLoading] = useState(false);
  const [changeRequestsError, setChangeRequestsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  
  // Modal state
  const [isCreateChangeRequestModalOpen, setIsCreateChangeRequestModalOpen] = useState(false);
  
  const [selectedChangeRequestId, setSelectedChangeRequestId] = useState<number | null>(null);
  const [isChangeRequestDetailModalOpen, setIsChangeRequestDetailModalOpen] = useState(false);
  
  // Project Close Request state
  const [closeRequest, setCloseRequest] = useState<ProjectCloseRequestDetail | null>(null);
  const [loadingCloseRequest, setLoadingCloseRequest] = useState(false);
  const [isCreateCloseRequestModalOpen, setIsCreateCloseRequestModalOpen] = useState(false);

  // Check if contract is editable (Draft status or Request for Change)
  const isEditable = contractDetail?.status === 'Draft' || 
                     contractDetail?.status === 'draft' ||
                     contractDetail?.status === 'Request for Change' ||
                     contractDetail?.status === 'Request_for_Change' ||
                     contractDetail?.status === 'RequestForChange';
  
  // Check if status is Under Review - for reviewer to submit review
  const isUnderReview = contractDetail?.status === 'Under Review' || 
                        contractDetail?.status === 'Under review' || 
                        contractDetail?.status === 'Under_Review' ||
                        contractDetail?.status === 'Internal Review';
  
  // Check if status is Client Under Review
  const isClientUnderReview = contractDetail?.status === 'Client Under Review' || 
                              contractDetail?.status === 'Client under review';
  
  // Check if contract can be edited when status is Request_for_Change and engagementType is Retainer
  const canEditForRequestForChange = contractDetail?.status === 'Request_for_Change' || 
                                      contractDetail?.status === 'Request for Change' ||
                                      contractDetail?.status === 'RequestForChange';
  const isRetainerRequestForChange = canEditForRequestForChange && contractDetail?.engagementType === 'Retainer';
  const isFixedPriceRequestForChange = canEditForRequestForChange && contractDetail?.engagementType === 'Fixed Price';
  
  // State for edited Engaged Engineers
  const [editedEngagedEngineers, setEditedEngagedEngineers] = useState<Array<{
    id?: number;
    engineerLevel: string;
    startDate: string;
    endDate: string;
    billingType?: string;
    hourlyRate?: number;
    hours?: number;
    subtotal?: number;
    rating: number;
    salary: number;
  }>>([]);
  const [engagedEngineersDirty, setEngagedEngineersDirty] = useState(false);
  
  // State for edited Billing Details
  const [editedBillingDetails, setEditedBillingDetails] = useState<Array<{
    id?: number;
    paymentDate: string;
    deliveryNote: string;
    amount: number;
    isPaid?: boolean;
  }>>([]);

  // Fixed Price editable data for Request for Change
  const [editedMilestones, setEditedMilestones] = useState<Array<{
    id?: number;
    milestone: string;
    deliveryNote: string;
    acceptanceCriteria: string;
    plannedEnd: string;
    paymentPercentage: number;
  }>>([]);

  const [editedFixedPriceBilling, setEditedFixedPriceBilling] = useState<Array<{
    id?: number;
    billingName: string;
    milestone: string;
    amount: number;
    percentage?: number | null;
    invoiceDate: string;
    isPaid?: boolean;
  deliveryNote?: string;
  }>>([]);
  
  // State for edited contract fields
  const [editedFields, setEditedFields] = useState<{
    projectName?: string;
    effectiveStart?: string;
    effectiveEnd?: string;
    note?: string;
    scopeSummary?: string;
    assigneeUserId?: number;
    value?: number;
  }>({});
  
  // Initialize edited fields when contract detail loads and isEditable is true
  useEffect(() => {
    if (isEditable && contractDetail) {
      setEditedFields({
        projectName: contractDetail.projectName || '',
        effectiveStart: contractDetail.effectiveStart || '',
        effectiveEnd: contractDetail.effectiveEnd || '',
        note: contractDetail.note || '',
        scopeSummary: contractDetail.scopeSummary || '',
        assigneeUserId: contractDetail.assigneeUserId || undefined,
        value: (contractDetail.engagementType === 'Retainer' && isRetainerRequestForChange) ||
               (contractDetail.engagementType === 'Fixed Price' && isFixedPriceRequestForChange)
          ? (typeof contractDetail.value === 'number' ? contractDetail.value : Number(contractDetail.value || 0))
          : undefined,
      });
    }
  }, [isEditable, contractDetail, isRetainerRequestForChange, isFixedPriceRequestForChange]);
  
  // Initialize edited data when contract detail loads and isRetainerRequestForChange is true
  useEffect(() => {
    if (isRetainerRequestForChange && contractDetail) {
      if (contractDetail.engagedEngineers && contractDetail.engagedEngineers.length > 0) {
        setEditedEngagedEngineers(contractDetail.engagedEngineers.map(eng => ({
          id: eng.id,
          engineerLevel: eng.engineerLevel || '',
          startDate: eng.startDate || '',
          endDate: eng.endDate || '',
          billingType: eng.billingType || 'Monthly',
          hourlyRate: eng.hourlyRate,
          hours: eng.hours,
          subtotal: eng.subtotal,
          rating: eng.rating || 100,
          salary: eng.salary || 0,
        })));
        setEngagedEngineersDirty(false);
      }
      if (contractDetail.engagementType === 'Retainer' && contractDetail.billingDetails && contractDetail.billingDetails.length > 0) {
        setEditedBillingDetails(contractDetail.billingDetails.map(billing => ({
          id: billing.id,
          paymentDate: billing.invoiceDate || '',
          deliveryNote: billing.deliveryNote || '',
          amount: billing.amount || 0,
          isPaid: billing.isPaid,
        })));
      } else if (contractDetail.engagementType === 'Retainer') {
        setEditedBillingDetails([]);
      }
    }
  }, [isRetainerRequestForChange, contractDetail]);

  // Initialize edited data when contract detail loads and isFixedPriceRequestForChange is true
  useEffect(() => {
    if (isFixedPriceRequestForChange && contractDetail) {
      if (contractDetail.milestoneDeliverables && contractDetail.milestoneDeliverables.length > 0) {
        setEditedMilestones(contractDetail.milestoneDeliverables.map(m => ({
          id: m.id,
          milestone: m.milestone || '',
          deliveryNote: m.deliveryNote || '',
          acceptanceCriteria: m.acceptanceCriteria || '',
          plannedEnd: m.plannedEnd || '',
          paymentPercentage: typeof m.paymentPercentage === 'number' ? m.paymentPercentage : Number(m.paymentPercentage || 0),
        })));
      } else {
        setEditedMilestones([{
          milestone: '',
          deliveryNote: '',
          acceptanceCriteria: '',
          plannedEnd: '',
          paymentPercentage: 0,
        }]);
      }

      if (contractDetail.billingDetails && contractDetail.billingDetails.length > 0) {
        setEditedFixedPriceBilling(contractDetail.billingDetails.map((b: any) => ({
          id: b.id,
          billingName: b.billingName || '',
          milestone: b.milestone || '',
          amount: typeof b.amount === 'number' ? b.amount : Number(b.amount || 0),
          percentage: typeof b.percentage === 'number' ? b.percentage : (b.percentage ? Number(b.percentage) : null),
          invoiceDate: b.invoiceDate || '',
          isPaid: b.isPaid || false,
          deliveryNote: b.deliveryNote || '',
        })));
      } else {
        setEditedFixedPriceBilling([{
          billingName: '',
          milestone: '',
          amount: 0,
          percentage: null,
          invoiceDate: '',
          deliveryNote: '',
        }]);
      }
    }
  }, [isFixedPriceRequestForChange, contractDetail]);

  // Calculate invoice date based on Planned End and Billing Day (same logic as create SOW)
  const calculateInvoiceDate = (plannedEnd: string, billingDay: string | null): string => {
    if (!plannedEnd || !billingDay) {
      return plannedEnd || '';
    }

    try {
      const plannedDate = new Date(plannedEnd);
      const plannedYear = plannedDate.getFullYear();
      const plannedMonth = plannedDate.getMonth();
      const plannedDay = plannedDate.getDate();

      // Parse billing day
      let billingDayNumber: number;
      if (billingDay.toLowerCase().includes('last business day') || billingDay.toLowerCase().includes('last')) {
        // For "Last business day", use the last day of the month
        const lastDay = new Date(plannedYear, plannedMonth + 1, 0).getDate();
        billingDayNumber = lastDay;
      } else {
        // Try to extract number from billing day (e.g., "15", "15th", "Day 15")
        const match = billingDay.match(/\d+/);
        billingDayNumber = match ? parseInt(match[0]) : plannedDay;
      }

      // Determine invoice date
      let invoiceDate: Date;
      if (plannedDay > billingDayNumber) {
        // Planned End > Billing Day: use Billing Day of next month
        invoiceDate = new Date(plannedYear, plannedMonth + 1, billingDayNumber);
      } else {
        // Planned End <= Billing Day: use Billing Day of current month
        invoiceDate = new Date(plannedYear, plannedMonth, billingDayNumber);
      }

      // Format as YYYY-MM-DD
      const year = invoiceDate.getFullYear();
      const month = String(invoiceDate.getMonth() + 1).padStart(2, '0');
      const day = String(invoiceDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error calculating invoice date:', error);
      return plannedEnd;
    }
  };

  // Recalculate Fixed Price billing when milestones change (RFC)
  useEffect(() => {
    if (!isFixedPriceRequestForChange) return;
    const contractValue = editedFields.value !== undefined
      ? editedFields.value
      : (typeof contractDetail?.value === 'number' ? contractDetail.value : Number(contractDetail?.value || 0));
    const billingDay = contractDetail?.billingDay || null;
    const recalculated = editedMilestones.map(m => {
      // Calculate invoice date based on Planned End and Billing Day
      const invoiceDate = calculateInvoiceDate(m.plannedEnd || '', billingDay);
      return {
        billingName: m.milestone ? `${m.milestone} Payment` : 'Payment',
        milestone: m.milestone || '',
        amount: Math.round(((contractValue || 0) * (m.paymentPercentage || 0)) / 100),
        percentage: m.paymentPercentage ?? null,
        invoiceDate: invoiceDate,
        isPaid: false,
        deliveryNote: m.deliveryNote || '',
      };
    });
    setEditedFixedPriceBilling(recalculated);
  }, [editedMilestones, isFixedPriceRequestForChange, contractDetail?.value, contractDetail?.billingDay, editedFields.value]);

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

  // Redirect if not authenticated or not sales user
  useEffect(() => {
    if (user && user.role !== 'SALES_MANAGER' && user.role !== 'SALES_REP') {
      router.push('/sales/login');
    }
  }, [user, router]);

  // Load close request
  const loadCloseRequest = async () => {
    if (!token || !contractId) return;
    
    try {
      setLoadingCloseRequest(true);
      const closeReq = await getLatestProjectCloseRequest(contractId, token);
      setCloseRequest(closeReq); // Can be null if no close request exists
    } catch (error: any) {
      console.error('Error loading close request:', error);
      setCloseRequest(null);
    } finally {
      setLoadingCloseRequest(false);
    }
  };

  // Load contract detail and dropdown data
  useEffect(() => {
    if (!token || !contractId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [detail, sales] = await Promise.all([
          getSOWContractDetail(contractId, token),
          getSalesUsers(token),
        ]);
        
        setContractDetail(detail);
        setSalesUsers(sales);
        
        // Populate review form data
        setReviewNotes(detail.reviewNotes || '');
        setReviewAction(detail.reviewAction || null);
        
        // Load close request if SOW is Active
        if (detail.status === 'Active' || detail.status === 'active') {
          loadCloseRequest();
        }
        
        // Load appendices, baseline, and current state if Retainer SOW (Event-based system)
        if (detail.engagementType === 'Retainer') {
          try {
            setLoadingAppendices(true);
            const allAppendices = await getSOWContractAppendices(contractId, token);
            setAppendices(allAppendices);
          } catch (error) {
            console.error('Error loading appendices:', error);
            setAppendices([]);
          } finally {
            setLoadingAppendices(false);
          }
          
          // Load baseline and current state (optional - only when user clicks to view)
          // We'll load them on demand
        }
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load SOW contract detail');
        router.push('/sales/contracts');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, contractId, router]);
  
  // Note: Version-based loading removed - Event-based system doesn't use versions
  // Contract detail is loaded once in the first useEffect

  // Format currency helper
  const formatCurrency = (value: number | null | undefined): string => {
    if (value == null || value === 0) return '-';
    return `¥${value.toLocaleString('ja-JP')}`;
  };

  // Format date helper
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');
    } catch {
      return dateStr;
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

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!token || !contractId || !reviewAction) return;

    try {
      setSubmitting(true);
      await submitSOWReview(contractId, reviewNotes || '', reviewAction, token);
      toast({
        title: 'Success',
        description: 'Review submitted successfully',
      });
      // Reload contract detail to get updated status and review info
      const detail = await getSOWContractDetail(contractId, token);
      setContractDetail(detail);
      setReviewNotes(detail.reviewNotes || '');
      setReviewAction(detail.reviewAction || null);
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

  // Handle payment status update
  const handlePaymentStatusChange = async (billingDetailId: number, isPaid: boolean) => {
    if (!token || !contractId || !contractDetail?.engagementType) return;

    try {
      await updateBillingDetailPaymentStatus(
        contractId,
        billingDetailId,
        isPaid,
        contractDetail.engagementType,
        token
      );
      
      // Update local state
      setContractDetail(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          billingDetails: prev.billingDetails?.map(billing => 
            billing.id === billingDetailId 
              ? { ...billing, isPaid } 
              : billing
          ) || []
        };
      });

      toast({
        title: 'Success',
        description: `Payment status updated to ${isPaid ? 'paid' : 'unpaid'}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment status',
        variant: 'destructive',
      });
    }
  };

  // Check for overdue payments and create notice message
  const getOverduePaymentsNotice = () => {
    // Only show notice for Sales Manager or Sales Rep assigned to the contract
    if (!user || !contractDetail?.billingDetails || !contractDetail?.assigneeUserId) return null;
    
    // Check if current user is Sales Manager or the assigned Sales Rep
    const isSalesManager = user.role === 'SALES_MANAGER';
    const isAssignedSalesRep = user.role === 'SALES_REP' && contractDetail.assigneeUserId === user.id;
    
    if (!isSalesManager && !isAssignedSalesRep) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueBillingDetails = contractDetail.billingDetails.filter(billing => {
      if (billing.isPaid) return false; // Skip paid items
      
      const paymentDateStr = (billing as any).invoiceDate || (billing as any).paymentDate;
      if (!paymentDateStr) return false;
      
      const paymentDate = new Date(paymentDateStr);
      paymentDate.setHours(0, 0, 0, 0);
      
      return paymentDate < today;
    });

    if (overdueBillingDetails.length === 0) return null;

    const overdueCount = overdueBillingDetails.length;
    const overdueTotal = overdueBillingDetails.reduce((sum, billing) => sum + billing.amount, 0);

    return {
      count: overdueCount,
      total: overdueTotal,
      details: overdueBillingDetails,
      message: `Warning: ${overdueCount} billing detail(s) with total amount of ${formatCurrency(overdueTotal)} are overdue. Please update payment status.`
    };
  };

  const overdueNotice = getOverduePaymentsNotice();
  
  // Helpers for Fixed Price editable fields (RFC)
  const addMilestoneRow = () => {
    setEditedMilestones(prev => [...prev, {
      milestone: '',
      deliveryNote: '',
      acceptanceCriteria: '',
      plannedEnd: '',
      paymentPercentage: 0,
    }]);
  };

  const updateMilestoneField = (index: number, field: keyof (typeof editedMilestones)[number], value: any) => {
    setEditedMilestones(prev => {
      const updated = [...prev];

      if (field === 'paymentPercentage') {
        const newVal = Math.max(0, Math.min(100, parseFloat(value) || 0));
        const currentVal = updated[index].paymentPercentage ?? 0;
        const otherTotal = prev.reduce((sum, item, i) => i === index ? sum : sum + (item.paymentPercentage ?? 0), 0);

        if (newVal > 100) {
          toast({
            title: 'Validation Error',
            description: 'Payment (%) for a milestone cannot exceed 100%',
            variant: 'destructive',
          });
          return prev;
        }

        if (otherTotal + newVal > 100) {
          toast({
            title: 'Validation Error',
            description: 'Total Payment (%) across milestones cannot exceed 100%',
            variant: 'destructive',
          });
          return prev;
        }

        updated[index].paymentPercentage = newVal;
      } else {
        (updated[index] as any)[field] = value;
      }

      return updated;
    });
  };

  const removeMilestoneRow = (index: number) => {
    setEditedMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const addFixedPriceBillingRow = () => {
    setEditedFixedPriceBilling(prev => [...prev, {
      billingName: '',
      milestone: '',
      amount: 0,
      percentage: null,
      invoiceDate: '',
      deliveryNote: '',
    }]);
  };

  const updateFixedPriceBillingField = (index: number, field: keyof (typeof editedFixedPriceBilling)[number], value: any) => {
    setEditedFixedPriceBilling(prev => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  // Helper: compare engaged engineers to detect changes (Retainer RFC)
  const haveEngagedEngineersChanged = () => {
    if (!isRetainerRequestForChange) return false;
    const original = contractDetail?.engagedEngineers || [];
    const edited = editedEngagedEngineers || [];
    if (original.length !== edited.length) return true;

    const normalize = (eng: any) => ({
      id: eng.id ?? null,
      engineerLevel: eng.engineerLevel || '',
      startDate: eng.startDate || '',
      endDate: eng.endDate || '',
      billingType: eng.billingType || 'Monthly',
      hourlyRate: eng.hourlyRate ?? null,
      hours: eng.hours ?? null,
      subtotal: eng.subtotal ?? null,
      rating: eng.rating ?? 0,
      salary: eng.salary ?? 0,
    });

    for (let i = 0; i < original.length; i++) {
      const a = normalize(original[i]);
      const b = normalize(edited[i]);
      const keys = Object.keys(a) as Array<keyof typeof a>;
      const changed = keys.some(k => {
        const av = a[k];
        const bv = b[k as keyof typeof b];
        // handle number/null equality
        if (av === null && bv === null) return false;
        return av !== bv;
      });
      if (changed) return true;
    }
    return false;
  };

  // Helper: get only changed/new engaged engineers to send in payload (avoid resending unchanged)
  const getChangedEngagedEngineers = () => {
    if (!isRetainerRequestForChange) return [];
    const original = contractDetail?.engagedEngineers || [];
    const edited = editedEngagedEngineers || [];
    const originalMap = new Map<number, any>();
    original.forEach((eng) => {
      if (eng.id != null) originalMap.set(eng.id, eng);
    });

    const normalize = (eng: any) => ({
      id: eng.id ?? null,
      engineerLevel: eng.engineerLevel || '',
      startDate: eng.startDate || '',
      endDate: eng.endDate || '',
      billingType: eng.billingType || 'Monthly',
      hourlyRate: eng.hourlyRate ?? null,
      hours: eng.hours ?? null,
      subtotal: eng.subtotal ?? null,
      rating: eng.rating ?? 0,
      salary: eng.salary ?? 0,
    });

    const changed: typeof edited = [];

    edited.forEach((eng) => {
      if (!eng.id) {
        // New row
        changed.push(eng);
        return;
      }
      const orig = originalMap.get(eng.id);
      if (!orig) {
        // Safety: id not found, treat as new
        changed.push(eng);
        return;
      }
      const a = normalize(orig);
      const b = normalize(eng);
      const keys = Object.keys(a) as Array<keyof typeof a>;
      const hasDiff = keys.some((k) => {
        const av = a[k];
        const bv = b[k as keyof typeof b];
        if (av === null && bv === null) return false;
        return av !== bv;
      });
      if (hasDiff) {
        changed.push(eng);
      }
    });

    return changed;
  };

  const removeFixedPriceBillingRow = (index: number) => {
    setEditedFixedPriceBilling(prev => prev.filter((_, i) => i !== index));
  };

  const isRequestForChangeStatus = canEditForRequestForChange;
  
  // Check if user can see notification (Sales Manager or assigned Sales Rep)
  const canSeeNotification = user && contractDetail?.assigneeUserId && 
    (user.role === 'SALES_MANAGER' || (user.role === 'SALES_REP' && contractDetail.assigneeUserId === user.id));
  
  // Handle save contract changes when status is Draft or Request_for_Change
  const handleSaveContractChanges = async () => {
    if (!token || !contractId || !isEditable) return;
    
    // Validate Effective End >= Effective Start
    if (editedFields.effectiveStart && editedFields.effectiveEnd && editedFields.effectiveEnd < editedFields.effectiveStart) {
      toast({
        title: 'Validation Error',
        description: 'Effective End date must be on or after Effective Start date',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Prepare update data
      const updateData: any = {
        projectName: editedFields.projectName,
        effectiveStart: editedFields.effectiveStart,
        effectiveEnd: editedFields.effectiveEnd,
        note: editedFields.note,
        scopeSummary: editedFields.scopeSummary,
        assigneeUserId: editedFields.assigneeUserId ?? contractDetail.assigneeUserId,
      };
      
      // Add engagedEngineers and billingDetails for Retainer Request_for_Change
      if (isRetainerRequestForChange) {
        const changedEngs = getChangedEngagedEngineers();
        if (changedEngs.length > 0) {
          updateData.engagedEngineers = changedEngs;
        }
        updateData.billingDetails = editedBillingDetails;
        // Add value if edited
        if (editedFields.value !== undefined) {
          updateData.contractValue = editedFields.value;
        }
      }

      // Add milestones and billing for Fixed Price Request_for_Change
      if (isFixedPriceRequestForChange) {
        updateData.milestoneDeliverables = editedMilestones;
        updateData.fixedPriceBillingDetails = editedFixedPriceBilling;
        // Add value if edited
        if (editedFields.value !== undefined) {
          updateData.contractValue = editedFields.value;
        }
      }
      
      // Call API to update SOW contract
      await updateSOWContract(contractId, updateData, token);
      
      toast({
        title: 'Success',
        description: 'Contract updated successfully',
        variant: 'success',
      });
      
      // Reload contract detail to get updated data
      const detail = await getSOWContractDetail(contractId, token);
      setContractDetail(detail);
      
      // Update edited fields with latest data
      setEditedFields({
        projectName: detail.projectName || '',
        effectiveStart: detail.effectiveStart || '',
        effectiveEnd: detail.effectiveEnd || '',
        note: detail.note || '',
        scopeSummary: detail.scopeSummary || '',
        assigneeUserId: detail.assigneeUserId || undefined,
      });
      
      // Update editedEngagedEngineers and editedBillingDetails with latest data
      if (detail.engagedEngineers && detail.engagedEngineers.length > 0) {
        setEditedEngagedEngineers(detail.engagedEngineers.map(eng => ({
          id: eng.id,
          engineerLevel: eng.engineerLevel || '',
          startDate: eng.startDate || '',
          endDate: eng.endDate || '',
          billingType: eng.billingType || 'Monthly',
          hourlyRate: eng.hourlyRate,
          hours: eng.hours,
          subtotal: eng.subtotal,
          rating: eng.rating || 100,
          salary: eng.salary || 0,
        })));
        setEngagedEngineersDirty(false);
      } else {
        setEditedEngagedEngineers([]);
        setEngagedEngineersDirty(false);
      }
      if (detail.engagementType === 'Retainer' && detail.billingDetails && detail.billingDetails.length > 0) {
        setEditedBillingDetails(detail.billingDetails.map(billing => ({
          id: billing.id,
          paymentDate: billing.invoiceDate || '',
          deliveryNote: billing.deliveryNote || '',
          amount: billing.amount || 0,
          isPaid: billing.isPaid,
        })));
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save contract changes',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Load change requests
  const loadChangeRequests = async (page: number = 0) => {
    if (!token || !contractId) return;
    
    try {
      setChangeRequestsLoading(true);
      setChangeRequestsError(null);
      const response = await getChangeRequestsForSOW(contractId, page, pageSize, token);
      setChangeRequests(response.content);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      console.error('Error loading change requests:', error);
      setChangeRequestsError(error.message || 'Failed to load change requests');
      setChangeRequests([]);
    } finally {
      setChangeRequestsLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadChangeRequests(page);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    const statusLower = status.toLowerCase().replace(/\s+/g, '');
    switch (statusLower) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
      case 'underreview':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'requestforchange':
        return 'bg-orange-100 text-orange-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle view change request
  const handleViewChangeRequest = (changeRequestId: number) => {
    setSelectedChangeRequestId(changeRequestId);
    setIsChangeRequestDetailModalOpen(true);
  };

  // Check if Close Request button should be displayed
  const canShowCloseRequestButton = (): boolean => {
    if (!contractDetail) return false;
    
    // SOW must be Active
    if (contractDetail.status !== 'Active' && contractDetail.status !== 'active') {
      return false;
    }
    
    // SOW end_date must be <= today
    if (contractDetail.effectiveEnd) {
      // Parse date string (YYYY-MM-DD) and compare only date part
      const endDateStr = contractDetail.effectiveEnd.split('T')[0]; // Remove time if present
      const endDate = new Date(endDateStr + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Allow if endDate is today or in the past (endDate <= today)
      if (endDate > today) {
        return false;
      }
    }
    
    // No existing Pending Close Request
    if (closeRequest && closeRequest.status === 'Pending') {
      return false;
    }
    
    return true;
  };

  // Handle create close request
  const handleCreateCloseRequest = async (data: { message: string; links: string }) => {
    if (!token || !contractId) return;
    
    try {
      await createProjectCloseRequest(contractId, data, token);
      toast({
        title: 'Success',
        description: 'Project close request created successfully',
      });
      // Reload close request
      await loadCloseRequest();
      // Reload contract detail to update status if needed
      const detail = await getSOWContractDetail(contractId, token);
      setContractDetail(detail);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create close request',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Handle resubmit close request
  const handleResubmitCloseRequest = async (closeRequestId: number, data: { message: string; links: string }) => {
    if (!token || !contractId) return;
    
    try {
      await resubmitProjectCloseRequest(contractId, closeRequestId, data, token);
      toast({
        title: 'Success',
        description: 'Project close request resubmitted successfully',
      });
      // Reload close request
      await loadCloseRequest();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resubmit close request',
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (!user || !token || loading || !contractDetail) {
    return <div className="flex items-center justify-center min-h-screen">{t('sales.sowDetail.loading')}</div>;
  }

  // Check if reviewer is current user
  const reviewerId = Number(contractDetail.reviewerId);
  const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  let currentUserId = Number(user?.id);
  
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
  const isReviewDisabled = !isReviewerCurrentUser || (!isEditable && !isUnderReview);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SalesSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{t('sales.sowDetail.title')}</h2>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                
                {/* Notification Bell */}
                {canSeeNotification && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5 text-gray-600" />
                        {overdueNotice && overdueNotice.count > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {overdueNotice.count}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      {overdueNotice ? (
                        <div className="p-2">
                          <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                            Overdue Payment Notice
                          </div>
                          <div className="px-2 py-1 text-sm text-gray-600 mb-2">
                            {overdueNotice.message}
                          </div>
                          <div className="border-t pt-2 max-h-60 overflow-y-auto">
                            {overdueNotice.details.map((billing, index) => {
                              const paymentDateStr = (billing as any).invoiceDate || (billing as any).paymentDate;
                              return (
                                <div key={index} className="px-2 py-2 hover:bg-gray-50 rounded">
                                  <div className="text-sm font-medium text-gray-900">
                                    {(billing as any).billingName || (billing as any).milestone || 'Billing Detail'}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Date: {formatDate(paymentDateStr)} • Amount: {formatCurrency(billing.amount)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No overdue payments
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
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
            <a href="/sales/contracts" className="hover:underline">{t('sales.sowDetail.breadcrumb.list')}</a>
            <span className="mx-2">/</span>
            <span>{t('sales.sowDetail.breadcrumb.detail')} - {contractDetail.contractId}</span>
          </div>

          {/* Form Title */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{t('sales.sowDetail.title')}</h1>
            {!isEditable && (
              <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold">
                Read Only - Status: {contractDetail.status}
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs 
            defaultValue="contract-info" 
            className="w-full"
            onValueChange={(value: string) => {
              // Load change requests when Change Requests tab is opened
              if (value === 'change-requests' && changeRequests.length === 0 && !changeRequestsLoading) {
                loadChangeRequests(0);
              }
            }}
          >
            <TabsList>
              <TabsTrigger value="contract-info">{t('sales.sowDetail.tabs.contractInfo')}</TabsTrigger>
              <TabsTrigger value="change-requests">{t('sales.sowDetail.tabs.changeRequests')}</TabsTrigger>
            </TabsList>

            {/* Contract Info Tab */}
            <TabsContent value="contract-info" className="mt-6">
              {/* Appendices Section (for Retainer SOW - Event-based) */}
              {contractDetail?.engagementType === 'Retainer' && (
                <div className="mb-6 border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold mb-4">{t('sales.sowDetail.sections.appendices') || 'Contract Appendices'}</h2>
                  {loadingAppendices ? (
                    <div className="text-gray-500">Loading appendices...</div>
                  ) : appendices.length > 0 ? (
                    <div className="space-y-3">
                      {appendices.map((appendix) => (
                        <div
                          key={appendix.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-blue-600">{appendix.appendixNumber}</span>
                                {appendix.signedAt && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {t('sales.sowDetail.appendix.signed') || 'Signed'}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-medium text-gray-900 mb-1">{appendix.title}</h3>
                              <p className="text-sm text-gray-600 whitespace-pre-line">{appendix.summary}</p>
                              {appendix.signedAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                  {t('sales.sowDetail.appendix.signedAt') || 'Signed at'}: {formatDate(appendix.signedAt)}
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
                                {t('sales.sowDetail.appendix.viewPDF') || 'View PDF'}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      {t('sales.sowDetail.appendices.empty') || 'No appendices yet. Appendices will be created when Change Requests are approved.'}
                    </div>
                  )}
                </div>
              )}
              
              {/* Baseline & Events Section (for Retainer SOW - Event-based) */}
              {contractDetail?.engagementType === 'Retainer' && (
                <div className="mb-6 border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{t('sales.sowDetail.sections.baselineEvents') || 'Baseline & Events'}</h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (!showBaseline && !baselineData) {
                            setLoadingBaseline(true);
                            try {
                              const data = await getSOWContractBaseline(contractId!, token!);
                              setBaselineData(data);
                              const current = await getSOWContractCurrentState(contractId!, token!);
                              setCurrentState(current);
                            } catch (error) {
                              console.error('Error loading baseline:', error);
                              alert('Failed to load baseline data');
                            } finally {
                              setLoadingBaseline(false);
                            }
                          }
                          setShowBaseline(!showBaseline);
                        }}
                      >
                        {showBaseline ? 'Hide Baseline' : 'View Baseline'}
                      </Button>
                    </div>
                  </div>
                  
                  {loadingBaseline && (
                    <div className="text-gray-500 text-sm">Loading baseline data...</div>
                  )}
                  
                  {showBaseline && baselineData && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <h3 className="font-semibold mb-2">{t('sales.sowDetail.baseline.engineers') || 'Baseline Engineers'}</h3>
                        {baselineData.engineers.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('sales.sowDetail.baseline.role') || 'Role'}</TableHead>
                                <TableHead>{t('sales.sowDetail.baseline.level') || 'Level'}</TableHead>
                                <TableHead>{t('sales.sowDetail.baseline.rating') || 'Rating'}</TableHead>
                                <TableHead>{t('sales.sowDetail.baseline.unitRate') || 'Unit Rate'}</TableHead>
                                <TableHead>{t('sales.sowDetail.baseline.startDate') || 'Start Date'}</TableHead>
                                <TableHead>{t('sales.sowDetail.baseline.endDate') || 'End Date'}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {baselineData.engineers.map((eng) => (
                                <TableRow key={eng.id}>
                                  <TableCell>{eng.role}</TableCell>
                                  <TableCell>{eng.level}</TableCell>
                                  <TableCell>{eng.rating}%</TableCell>
                                  <TableCell>{formatCurrency(eng.unitRate)}</TableCell>
                                  <TableCell>{formatDate(eng.startDate)}</TableCell>
                                  <TableCell>{formatDate(eng.endDate)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p className="text-gray-500 text-sm">No baseline engineers</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">{t('sales.sowDetail.baseline.billing') || 'Baseline Billing'}</h3>
                        {baselineData.billing.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('sales.sowDetail.baseline.billingMonth') || 'Billing Month'}</TableHead>
                                <TableHead>{t('sales.sowDetail.baseline.amount') || 'Amount'}</TableHead>
                                <TableHead>{t('sales.sowDetail.baseline.description') || 'Description'}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {baselineData.billing.map((bill) => (
                                <TableRow key={bill.id}>
                                  <TableCell>{formatDate(bill.billingMonth)}</TableCell>
                                  <TableCell>{formatCurrency(bill.amount)}</TableCell>
                                  <TableCell>{bill.description}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p className="text-gray-500 text-sm">No baseline billing</p>
                        )}
                      </div>
                      
                      {currentState && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-semibold mb-2">{t('sales.sowDetail.currentState.title') || 'Current State (Baseline + Events)'}</h3>
                          <p className="text-sm text-gray-700 mb-2">
                            {t('sales.sowDetail.currentState.description') || 'This is the calculated current state based on baseline plus all approved events.'}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">{t('sales.sowDetail.currentState.engineers') || 'Current Engineers'}: {currentState.engineers.length}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{t('sales.sowDetail.currentState.billing') || 'Current Billing'}: {formatCurrency(currentState.billing.amount)}</p>
                              <p className="text-xs text-gray-600">{t('sales.sowDetail.currentState.month') || 'Month'}: {formatDate(currentState.billing.month)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {showEvents && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-4">{t('sales.sowDetail.events.resourceEvents') || 'Resource Events'}</h3>
                      {loadingEvents ? (
                        <div className="text-gray-500 text-sm py-4">Loading events...</div>
                      ) : resourceEvents.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('sales.sowDetail.events.effectiveDate') || 'Effective Date'}</TableHead>
                                <TableHead>{t('sales.sowDetail.events.crNo') || 'CR No.'}</TableHead>
                                <TableHead>{t('sales.sowDetail.events.appendix') || 'Appendix'}</TableHead>
                                <TableHead>{t('sales.sowDetail.events.action') || 'Action'}</TableHead>
                                <TableHead>{t('sales.sowDetail.events.engineer') || 'Engineer'}</TableHead>
                                <TableHead>{t('sales.sowDetail.events.fieldChanges') || 'Field Changes'}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {resourceEvents.map((event) => {
                                // Find CR info
                                const cr = changeRequests.find(cr => cr.id === event.changeRequestId);
                                const crNo = cr?.changeRequestId || `CR-${event.changeRequestId}`;
                                
                                // Find Appendix info
                                const appendix = appendices.find(ap => ap.changeRequestId === event.changeRequestId);
                                const appendixNo = appendix?.appendixNumber || '-';
                                
                                // Build engineer info
                                const engineerInfo = event.level && event.role 
                                  ? `${event.level} ${event.role}`
                                  : event.level || event.role || '-';
                                
                                // Build field changes
                                const fieldChanges: string[] = [];
                                
                                if (event.action === 'ADD') {
                                  // For ADD: show new values
                                  const addInfo: string[] = [];
                                  if (engineerInfo && engineerInfo !== '-') {
                                    addInfo.push(engineerInfo);
                                  }
                                  if (event.ratingNew !== null && event.ratingNew !== undefined) {
                                    addInfo.push(`Rating: ${event.ratingNew}%`);
                                  }
                                  if (event.unitRateNew !== null && event.unitRateNew !== undefined) {
                                    addInfo.push(`Salary: ¥${formatCurrency(typeof event.unitRateNew === 'number' ? event.unitRateNew : parseFloat(event.unitRateNew.toString()))}`);
                                  }
                                  if (event.startDateNew) {
                                    addInfo.push(`Start: ${formatDate(event.startDateNew)}`);
                                  }
                                  if (event.endDateNew) {
                                    addInfo.push(`End: ${formatDate(event.endDateNew)}`);
                                  }
                                  if (addInfo.length > 0) {
                                    fieldChanges.push(`Added: ${addInfo.join(', ')}`);
                                  }
                                } else if (event.action === 'REMOVE') {
                                  // For REMOVE: show removed engineer
                                  fieldChanges.push(`Removed: ${engineerInfo}`);
                                } else if (event.action === 'MODIFY') {
                                  // For MODIFY: show old → new changes
                                  if (event.ratingOld !== null && event.ratingOld !== undefined && 
                                      event.ratingNew !== null && event.ratingNew !== undefined) {
                                    const oldVal = typeof event.ratingOld === 'number' ? event.ratingOld : parseFloat(event.ratingOld.toString());
                                    const newVal = typeof event.ratingNew === 'number' ? event.ratingNew : parseFloat(event.ratingNew.toString());
                                    fieldChanges.push(`Rating: ${oldVal}% → ${newVal}%`);
                                  }
                                  if (event.unitRateOld !== null && event.unitRateOld !== undefined && 
                                      event.unitRateNew !== null && event.unitRateNew !== undefined) {
                                    const oldVal = typeof event.unitRateOld === 'number' ? event.unitRateOld : parseFloat(event.unitRateOld.toString());
                                    const newVal = typeof event.unitRateNew === 'number' ? event.unitRateNew : parseFloat(event.unitRateNew.toString());
                                    fieldChanges.push(`Salary: ¥${formatCurrency(oldVal)} → ¥${formatCurrency(newVal)}`);
                                  }
                                  if (event.startDateOld && event.startDateNew) {
                                    fieldChanges.push(`Start Date: ${formatDate(event.startDateOld)} → ${formatDate(event.startDateNew)}`);
                                  }
                                  if (event.endDateOld && event.endDateNew) {
                                    fieldChanges.push(`End Date: ${formatDate(event.endDateOld)} → ${formatDate(event.endDateNew)}`);
                                  }
                                  // If level or role changed
                                  if (event.level || event.role) {
                                    const oldLevel = event.level || '';
                                    const oldRole = event.role || '';
                                    fieldChanges.push(`Engineer: ${oldLevel} ${oldRole}`.trim());
                                  }
                                }
                                
                                return (
                                  <TableRow key={event.id}>
                                    <TableCell>{formatDate(event.effectiveStart)}</TableCell>
                                    <TableCell>{crNo}</TableCell>
                                    <TableCell>{appendixNo}</TableCell>
                                    <TableCell>
                                      <Badge variant={event.action === 'ADD' ? 'default' : event.action === 'REMOVE' ? 'destructive' : 'secondary'}>
                                        {event.action}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{engineerInfo}</TableCell>
                                    <TableCell>
                                      <div className="text-sm">
                                        {fieldChanges.length > 0 ? (
                                          fieldChanges.map((change, idx) => (
                                            <div key={idx}>{change}</div>
                                          ))
                                        ) : (
                                          <span className="text-gray-400">-</span>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm py-4 border rounded-lg bg-gray-50 text-center">
                          {t('sales.sowDetail.events.noEvents') || 'No resource events found.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <form className="space-y-8">
            {/* Overview Section */}
            <section className="border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{t('sales.sowDetail.sections.overview')}</h2>
                {/* Project Close Request Button */}
                {canShowCloseRequestButton() && (
                  <Button
                    type="button"
                    onClick={() => setIsCreateCloseRequestModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    title="This button is available when the contract end date has passed and the SOW is still active."
                  >
                    Project Close Request
                  </Button>
                )}
                {/* Close Request Status Badge */}
                {closeRequest && (
                  <Badge 
                    className={
                      closeRequest.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : closeRequest.status === 'ClientApproved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {closeRequest.status === 'Pending' 
                      ? 'Close Request Pending'
                      : closeRequest.status === 'ClientApproved'
                      ? 'Project Closed'
                      : 'Close Request Rejected'}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>SOW ID</Label>
                  <Input
                    value={contractDetail.contractId}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label>Parent MSA</Label>
                  <Input
                    value={contractDetail.msaId || 'N/A'}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={isEditable ? (editedFields.projectName || '') : (contractDetail.projectName || '')}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 255) {
                        setEditedFields(prev => ({ ...prev, projectName: value }));
                      }
                    }}
                    disabled={!isEditable}
                    maxLength={255}
                    className={!isEditable ? 'bg-gray-100' : ''}
                  />
                  {isEditable && (
                    <p className="text-sm text-gray-500 mt-1">
                      {(editedFields.projectName || '').length}/255 characters
                    </p>
                  )}
                </div>

                {(contractDetail.engagementType === 'Fixed Price' || 
                  (contractDetail.engagementType === 'Retainer' && isRetainerRequestForChange)) && (
                  <div>
                    <Label>
                      {contractDetail.engagementType === 'Fixed Price' ? 'Value' : 'Value (Total Contract Value)'}
                      {(contractDetail.engagementType === 'Retainer' && isRetainerRequestForChange) || 
                       (contractDetail.engagementType === 'Fixed Price' && isFixedPriceRequestForChange) ? (
                        <span className="text-red-500">*</span>
                      ) : null}
                    </Label>
                    {contractDetail.engagementType === 'Fixed Price' && isFixedPriceRequestForChange ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                        <Input
                          type="text"
                          value={editedFields.value !== undefined 
                            ? (editedFields.value ? formatCurrency(editedFields.value) : '')
                            : (contractDetail.value ? formatCurrency(contractDetail.value) : '')}
                          onChange={(e) => {
                            // Remove ¥ and commas, then parse
                            const rawValue = e.target.value.replace(/¥|,/g, '').trim();
                            const value = rawValue === '' ? 0 : parseFloat(rawValue) || 0;
                            setEditedFields(prev => ({ ...prev, value }));
                          }}
                          onBlur={(e) => {
                            // Ensure value is formatted on blur
                            const rawValue = e.target.value.replace(/¥|,/g, '').trim();
                            const value = rawValue === '' ? 0 : parseFloat(rawValue) || 0;
                            setEditedFields(prev => ({ ...prev, value }));
                          }}
                          placeholder="0"
                          className="pl-8"
                        />
                      </div>
                    ) : contractDetail.engagementType === 'Fixed Price' ? (
                      <Input
                        value={formatCurrency(contractDetail.value)}
                        readOnly
                        className="bg-gray-100"
                      />
                    ) : (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                        <Input
                          type="text"
                          value={editedFields.value !== undefined 
                            ? (editedFields.value ? formatCurrency(editedFields.value) : '')
                            : (contractDetail.value ? formatCurrency(contractDetail.value) : '')}
                          onChange={(e) => {
                            // Remove ¥ and commas, then parse
                            const rawValue = e.target.value.replace(/¥|,/g, '').trim();
                            const value = rawValue === '' ? 0 : parseFloat(rawValue) || 0;
                            setEditedFields(prev => ({ ...prev, value }));
                          }}
                          onBlur={(e) => {
                            // Ensure value is formatted on blur
                            const rawValue = e.target.value.replace(/¥|,/g, '').trim();
                            const value = rawValue === '' ? 0 : parseFloat(rawValue) || 0;
                            setEditedFields(prev => ({ ...prev, value }));
                          }}
                          placeholder="0"
                          className="pl-8"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label>Effective Start *</Label>
                  <Input
                    type="date"
                    value={isEditable ? (editedFields.effectiveStart || '') : (contractDetail.effectiveStart || '')}
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      // If end date exists and is before new start date, update end date
                      if (editedFields.effectiveEnd && newStartDate && editedFields.effectiveEnd < newStartDate) {
                        toast({
                          title: 'Validation Error',
                          description: 'Effective End date must be on or after Effective Start date. End date will be updated.',
                          variant: 'destructive',
                        });
                        setEditedFields(prev => ({ ...prev, effectiveStart: newStartDate, effectiveEnd: newStartDate }));
                      } else {
                        setEditedFields(prev => ({ ...prev, effectiveStart: newStartDate }));
                      }
                    }}
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
                    className={!isEditable ? 'bg-gray-100' : ''}
                  />
                </div>

                <div>
                  <Label>Effective End *</Label>
                  <Input
                    type="date"
                    value={isEditable ? (editedFields.effectiveEnd || '') : (contractDetail.effectiveEnd || '')}
                    onChange={(e) => {
                      const newEndDate = e.target.value;
                      // Validate that end date is not before start date
                      if (editedFields.effectiveStart && newEndDate && newEndDate < editedFields.effectiveStart) {
                        toast({
                          title: 'Validation Error',
                          description: 'Effective End date must be on or after Effective Start date',
                          variant: 'destructive',
                        });
                        return;
                      }
                      setEditedFields(prev => ({ ...prev, effectiveEnd: newEndDate }));
                    }}
                    disabled={!isEditable}
                    min={(() => {
                      // Set min to effectiveStart if available, otherwise 5 years ago
                      if (editedFields.effectiveStart) {
                        return editedFields.effectiveStart;
                      }
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
                    className={!isEditable ? 'bg-gray-100' : ''}
                  />
                </div>

                <div>
                  <Label>Engagement Type</Label>
                  <Input
                    value={contractDetail.engagementType || ''}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label>Assignee *</Label>
                  <Select
                    value={(() => {
                      const raw = isEditable ? (editedFields.assigneeUserId ?? contractDetail.assigneeUserId) : contractDetail.assigneeUserId;
                      return raw != null ? raw.toString() : '';
                    })()}
                    onValueChange={(value: string) => setEditedFields(prev => ({ ...prev, assigneeUserId: parseInt(value, 10) }))}
                    disabled={!isEditable || isFixedPriceRequestForChange}
                  >
                    <SelectTrigger className={!isEditable || isFixedPriceRequestForChange ? 'bg-gray-100' : ''}>
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
              </div>
            </section>

            {/* Close Request Rejection Info Section */}
            {closeRequest && closeRequest.status === 'Rejected' && (
              <section className="border-b pb-6 bg-red-50 rounded-lg p-4 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Close Request Rejected</h3>
                    {closeRequest.clientRejectReason && (
                      <div className="bg-white border border-red-200 rounded p-3 mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Client Rejection Reason:</p>
                        <p className="text-sm text-gray-900 whitespace-pre-line">{closeRequest.clientRejectReason}</p>
                      </div>
                    )}
                    {closeRequest.updatedAt && (
                      <p className="text-xs text-gray-600">
                        Rejected on: {formatDate(closeRequest.updatedAt)}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={() => setIsCreateCloseRequestModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Update & Resubmit Close Request
                  </Button>
                </div>
              </section>
            )}

            {/* Note Section */}
            {(contractDetail.note || isEditable) && (
              <section className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Note</h2>
                <Textarea
                  value={isEditable ? (editedFields.note || '') : (contractDetail.note || '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 500) {
                      setEditedFields(prev => ({ ...prev, note: value }));
                    }
                  }}
                  disabled={!isEditable}
                  maxLength={500}
                  className={!isEditable ? 'bg-gray-100 min-h-[100px]' : 'min-h-[100px]'}
                />
                {isEditable && (
                  <p className="text-sm text-gray-500 mt-1">
                    {(editedFields.note || '').length}/500 characters
                  </p>
                )}
              </section>
            )}

            {/* Scope Summary Section */}
            {(contractDetail.scopeSummary || isEditable) && (
              <section className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Scope Summary</h2>
                <Textarea
                  value={isEditable ? (editedFields.scopeSummary || '') : (contractDetail.scopeSummary || '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 5000) {
                      setEditedFields(prev => ({ ...prev, scopeSummary: value }));
                    }
                  }}
                  disabled={!isEditable}
                  maxLength={5000}
                  className={!isEditable ? 'bg-gray-100 min-h-[100px]' : 'min-h-[100px]'}
                />
                {isEditable && (
                  <p className="text-sm text-gray-500 mt-1">
                    {(editedFields.scopeSummary || '').length}/5000 characters
                  </p>
                )}
              </section>
            )}

            {/* Milestone Deliverables Section (Fixed Price) */}
            {contractDetail.engagementType === 'Fixed Price' && (
              <section className="border-b pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold mb-4">Milestone Deliverables</h2>
                  {isFixedPriceRequestForChange && (
                    <Button type="button" variant="outline" size="sm" onClick={addMilestoneRow}>
                      <Plus className="w-4 h-4 mr-2" /> Add Milestone
                    </Button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Milestone</th>
                        <th className="border border-gray-300 p-2 text-left">Delivery Note</th>
                        <th className="border border-gray-300 p-2 text-left">Acceptance Criteria</th>
                        <th className="border border-gray-300 p-2 text-left">Planned End</th>
                        <th className="border border-gray-300 p-2 text-left">Payment (%)</th>
                        {isFixedPriceRequestForChange && <th className="border border-gray-300 p-2 text-left">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(isFixedPriceRequestForChange ? editedMilestones : (contractDetail.milestoneDeliverables || [])).map((milestone, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-2">
                            {isFixedPriceRequestForChange ? (
                              <Input
                                value={milestone.milestone}
                                onChange={(e) => updateMilestoneField(index, 'milestone', e.target.value)}
                              />
                            ) : (
                              milestone.milestone
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {isFixedPriceRequestForChange ? (
                              <Input
                                value={milestone.deliveryNote}
                                onChange={(e) => updateMilestoneField(index, 'deliveryNote', e.target.value)}
                              />
                            ) : (
                              milestone.deliveryNote
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {isFixedPriceRequestForChange ? (
                              <Input
                                value={milestone.acceptanceCriteria}
                                onChange={(e) => updateMilestoneField(index, 'acceptanceCriteria', e.target.value)}
                              />
                            ) : (
                              milestone.acceptanceCriteria
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {isFixedPriceRequestForChange ? (
                              <Input
                                type="date"
                                value={milestone.plannedEnd}
                                onChange={(e) => updateMilestoneField(index, 'plannedEnd', e.target.value)}
                              />
                            ) : (
                              formatDate(milestone.plannedEnd)
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {isFixedPriceRequestForChange ? (
                              <Input
                                type="number"
                                value={milestone.paymentPercentage ?? 0}
                                onChange={(e) => updateMilestoneField(index, 'paymentPercentage', parseFloat(e.target.value) || 0)}
                                min={0}
                                max={100}
                                step={0.1}
                              />
                            ) : (
                              `${milestone.paymentPercentage}%`
                            )}
                          </td>
                          {isFixedPriceRequestForChange && (
                            <td className="border border-gray-300 p-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMilestoneRow(index)}
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Engaged Engineer Section (Retainer) */}
            {contractDetail.engagementType === 'Retainer' && contractDetail.engagedEngineers && contractDetail.engagedEngineers.length > 0 && (
              <section className="border-b pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{t('sales.sowDetail.sections.engagedEngineer')}</h2>
                  {isRetainerRequestForChange && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditedEngagedEngineers([...editedEngagedEngineers, {
                          engineerLevel: '',
                          startDate: '',
                          endDate: '',
                          billingType: 'Monthly',
                          hourlyRate: 0,
                          hours: 0,
                          subtotal: 0,
                          rating: 100,
                          salary: 0,
                        }]);
                      setEngagedEngineersDirty(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Engineer
                    </Button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">{t('sales.sowDetail.engagedEngineer.engineerLevel')}</th>
                        <th className="border border-gray-300 p-2 text-left">{t('sales.sowDetail.engagedEngineer.startDate')}</th>
                        <th className="border border-gray-300 p-2 text-left">{t('sales.sowDetail.engagedEngineer.endDate')}</th>
                        <th className="border border-gray-300 p-2 text-left">Billing Type</th>
                        <th className="border border-gray-300 p-2 text-left">Rating (%)</th>
                        <th className="border border-gray-300 p-2 text-left">Salary (¥/month)</th>
                        <th className="border border-gray-300 p-2 text-left">Hourly Rate (¥/h)</th>
                        <th className="border border-gray-300 p-2 text-left">Hours</th>
                        <th className="border border-gray-300 p-2 text-left">Subtotal</th>
                        {isRetainerRequestForChange && (
                          <th className="border border-gray-300 p-2 text-left">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(isRetainerRequestForChange ? editedEngagedEngineers : contractDetail.engagedEngineers).map((engineer, index) => {
                        const billingType = engineer.billingType || 'Monthly';
                        const isHourly = billingType === 'Hourly';
                        
                        return (
                          <tr key={index}>
                            <td className="border border-gray-300 p-2">
                              {isRetainerRequestForChange ? (
                                <Input
                                  value={engineer.engineerLevel}
                                  onChange={(e) => {
                                    const updated = [...editedEngagedEngineers];
                                    updated[index].engineerLevel = e.target.value;
                                    setEditedEngagedEngineers(updated);
                                  setEngagedEngineersDirty(true);
                                  }}
                                  className="w-full"
                                />
                              ) : (
                                engineer.engineerLevel
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isRetainerRequestForChange ? (
                                <Input
                                  type="date"
                                  value={engineer.startDate}
                                  onChange={(e) => {
                                    const updated = [...editedEngagedEngineers];
                                    updated[index].startDate = e.target.value;
                                    setEditedEngagedEngineers(updated);
                                  setEngagedEngineersDirty(true);
                                  }}
                                  className="w-full"
                                />
                              ) : (
                                formatDate(engineer.startDate)
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isRetainerRequestForChange ? (
                                <Input
                                  type="date"
                                  value={engineer.endDate}
                                  onChange={(e) => {
                                    const updated = [...editedEngagedEngineers];
                                    updated[index].endDate = e.target.value;
                                    setEditedEngagedEngineers(updated);
                                  setEngagedEngineersDirty(true);
                                  }}
                                  className="w-full"
                                />
                              ) : (
                                formatDate(engineer.endDate)
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isRetainerRequestForChange ? (
                                <Select
                                  value={billingType}
                                  onValueChange={(value: string) => {
                                    const updated = [...editedEngagedEngineers];
                                    updated[index].billingType = value;
                                    if (value === 'Hourly') {
                                      updated[index].hourlyRate = updated[index].hourlyRate || 0;
                                      updated[index].hours = updated[index].hours || 0;
                                      updated[index].subtotal = (updated[index].hourlyRate || 0) * (updated[index].hours || 0);
                                    } else {
                                      updated[index].hourlyRate = undefined;
                                      updated[index].hours = undefined;
                                      updated[index].subtotal = undefined;
                                    }
                                    setEditedEngagedEngineers(updated);
                                    setEngagedEngineersDirty(true);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Hourly">Hourly</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                billingType
                              )}
                            </td>
                            {/* Rating (%) - Only for Monthly */}
                            <td className="border border-gray-300 p-2">
                              {!isHourly ? (
                                isRetainerRequestForChange ? (
                                  <Input
                                    type="number"
                                    value={engineer.rating || ''}
                                    onChange={(e) => {
                                      const updated = [...editedEngagedEngineers];
                                      updated[index].rating = parseFloat(e.target.value) || 0;
                                      setEditedEngagedEngineers(updated);
                                  setEngagedEngineersDirty(true);
                                    }}
                                    className="w-full"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    placeholder="0"
                                  />
                                ) : (
                                  `${engineer.rating || 0}%`
                                )
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            {/* Salary (¥/month) - Only for Monthly */}
                            <td className="border border-gray-300 p-2">
                              {!isHourly ? (
                                isRetainerRequestForChange ? (
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                    <Input
                                      type="text"
                                      value={typeof engineer.salary === 'number' ? engineer.salary.toLocaleString() : ''}
                                      onChange={(e) => {
                                        const updated = [...editedEngagedEngineers];
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        // Only allow up to 9 digits
                                        if (value.length <= 9) {
                                          updated[index].salary = parseFloat(value) || 0;
                                          setEditedEngagedEngineers(updated);
                                          setEngagedEngineersDirty(true);
                                        }
                                      }}
                                      className="w-full pl-8"
                                    />
                                  </div>
                                ) : (
                                  formatCurrency(engineer.salary || 0)
                                )
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            {/* Hourly Rate (¥/h) - Only for Hourly */}
                            <td className="border border-gray-300 p-2">
                              {isHourly ? (
                                isRetainerRequestForChange ? (
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                    <Input
                                      type="text"
                                      value={typeof engineer.hourlyRate === 'number' ? engineer.hourlyRate.toLocaleString() : ''}
                                      onChange={(e) => {
                                        const updated = [...editedEngagedEngineers];
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        // Only allow up to 9 digits
                                        if (value.length <= 9) {
                                          updated[index].hourlyRate = parseFloat(value) || 0;
                                          updated[index].subtotal = (updated[index].hourlyRate || 0) * (updated[index].hours || 0);
                                          updated[index].salary = updated[index].subtotal;
                                          setEditedEngagedEngineers(updated);
                                          setEngagedEngineersDirty(true);
                                        }
                                      }}
                                      className="w-full pl-8"
                                    />
                                  </div>
                                ) : (
                                  formatCurrency(engineer.hourlyRate || 0)
                                )
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            {/* Hours - Only for Hourly */}
                            <td className="border border-gray-300 p-2">
                              {isHourly ? (
                                isRetainerRequestForChange ? (
                                  <Input
                                    type="number"
                                    value={engineer.hours || ''}
                                    onChange={(e) => {
                                      const updated = [...editedEngagedEngineers];
                                      updated[index].hours = parseFloat(e.target.value) || 0;
                                      updated[index].subtotal = (updated[index].hourlyRate || 0) * (updated[index].hours || 0);
                                      updated[index].salary = updated[index].subtotal;
                                      setEditedEngagedEngineers(updated);
                                    setEngagedEngineersDirty(true);
                                    }}
                                    className="w-full"
                                    min="0"
                                    step="0.5"
                                  />
                                ) : (
                                  engineer.hours || 0
                                )
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            {/* Subtotal - Only for Hourly */}
                            <td className="border border-gray-300 p-2">
                              {isHourly ? (
                                isRetainerRequestForChange ? (
                                  formatCurrency(engineer.subtotal || 0)
                                ) : (
                                  formatCurrency(engineer.subtotal || 0)
                                )
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            {isRetainerRequestForChange && (
                              <td className="border border-gray-300 p-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updated = editedEngagedEngineers.filter((_, i) => i !== index);
                                    setEditedEngagedEngineers(updated);
                                    setEngagedEngineersDirty(true);
                                  }}
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </Button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Billing Details Section */}
            {contractDetail.billingDetails && contractDetail.billingDetails.length > 0 && (
              <section className="border-b pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Billing Details</h2>
                  {isRetainerRequestForChange && contractDetail.engagementType === 'Retainer' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditedBillingDetails([...editedBillingDetails, {
                          paymentDate: '',
                          deliveryNote: '',
                          amount: 0,
                        }]);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Billing
                    </Button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        {contractDetail.engagementType === 'Fixed Price' && (
                          <>
                            <th className="border border-gray-300 p-2 text-left">Billing Name</th>
                            <th className="border border-gray-300 p-2 text-left">Milestone</th>
                            <th className="border border-gray-300 p-2 text-left">Amount</th>
                            <th className="border border-gray-300 p-2 text-left">%</th>
                            <th className="border border-gray-300 p-2 text-left">Invoice Date</th>
                            <th className="border border-gray-300 p-2 text-left">Payment Status</th>
                          </>
                        )}
                        {contractDetail.engagementType === 'Retainer' && (
                          <>
                            <th className="border border-gray-300 p-2 text-left">Payment Date</th>
                            <th className="border border-gray-300 p-2 text-left">Delivery Note</th>
                            <th className="border border-gray-300 p-2 text-left">Amount</th>
                            <th className="border border-gray-300 p-2 text-left">Payment Status</th>
                            {isRetainerRequestForChange && (
                              <th className="border border-gray-300 p-2 text-left">Actions</th>
                            )}
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(isRetainerRequestForChange && contractDetail.engagementType === 'Retainer' ? editedBillingDetails : 
                        isFixedPriceRequestForChange && contractDetail.engagementType === 'Fixed Price' ? editedFixedPriceBilling : 
                        contractDetail.billingDetails || []).map((billing, index) => (
                        <tr key={index}>
                          {contractDetail.engagementType === 'Fixed Price' && (
                            <>
                              <td className="border border-gray-300 p-2">
                                {(billing as any).billingName || ''}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {(billing as any).milestone || ''}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {formatCurrency(billing.amount)}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {(billing as any).percentage ? `${(billing as any).percentage}%` : ''}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {formatDate((billing as any).invoiceDate || '')}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {billing.id ? (
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={billing.isPaid || false}
                                      onChange={(e) => handlePaymentStatusChange(billing.id!, e.target.checked)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      disabled={!token || !contractDetail?.assigneeUserId || (contractDetail?.assigneeUserId !== user?.id && user?.role !== 'SALES_MANAGER') || (contractDetail?.status !== 'Active' && contractDetail?.status !== 'active')}
                                    />
                                    <span className="text-sm">{billing.isPaid ? 'Paid' : 'Unpaid'}</span>
                                  </label>
                                ) : (
                                  <span className="text-sm text-gray-400">N/A</span>
                                )}
                              </td>
                            </>
                          )}
                          {contractDetail.engagementType === 'Retainer' && (
                            <>
                              <td className="border border-gray-300 p-2">
                                {isRetainerRequestForChange ? (
                                  <Input
                                    type="date"
                                    value={(billing as any).paymentDate || (billing as any).invoiceDate || ''}
                                    onChange={(e) => {
                                      const updated = [...editedBillingDetails];
                                      updated[index].paymentDate = e.target.value;
                                      setEditedBillingDetails(updated);
                                    }}
                                    className="w-full"
                                  />
                                ) : (
                                  formatDate((billing as any).invoiceDate || '')
                                )}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {isRetainerRequestForChange ? (
                                  <Input
                                    value={billing.deliveryNote || ''}
                                    onChange={(e) => {
                                      const updated = [...editedBillingDetails];
                                      updated[index].deliveryNote = e.target.value;
                                      setEditedBillingDetails(updated);
                                    }}
                                    className="w-full"
                                  />
                                ) : (
                                  billing.deliveryNote || ''
                                )}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {isRetainerRequestForChange ? (
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                    <Input
                                      type="text"
                                      value={typeof billing.amount === 'number' ? billing.amount.toLocaleString() : ''}
                                      onChange={(e) => {
                                        const updated = [...editedBillingDetails];
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        // Only allow up to 9 digits
                                        if (value.length <= 9) {
                                          updated[index].amount = parseFloat(value) || 0;
                                          setEditedBillingDetails(updated);
                                        }
                                      }}
                                      className="w-full pl-8"
                                      placeholder="0"
                                    />
                                  </div>
                                ) : (
                                  formatCurrency(billing.amount)
                                )}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {billing.id ? (
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={billing.isPaid || false}
                                      onChange={(e) => handlePaymentStatusChange(billing.id!, e.target.checked)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      disabled={!token || !contractDetail?.assigneeUserId || (contractDetail?.assigneeUserId !== user?.id && user?.role !== 'SALES_MANAGER') || (contractDetail?.status !== 'Active' && contractDetail?.status !== 'active')}
                                    />
                                    <span className="text-sm">{billing.isPaid ? 'Paid' : 'Unpaid'}</span>
                                  </label>
                                ) : (
                                  <span className="text-sm text-gray-400">N/A</span>
                                )}
                              </td>
                              {isRetainerRequestForChange && (
                                <td className="border border-gray-300 p-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updated = editedBillingDetails.filter((_, i) => i !== index);
                                      setEditedBillingDetails(updated);
                                    }}
                                  >
                                    <X className="w-4 h-4 text-red-500" />
                                  </Button>
                                </td>
                              )}
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Save Button Section - Show when isEditable and not Request for Change (RFC has actions at bottom) */}
            {isEditable && !isRequestForChangeStatus && (
              <section className="border-b pb-6">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveContractChanges}
                    disabled={submitting}
                    className="bg-gray-800 text-white"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </section>
            )}

            {/* Contacts Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Contacts</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client</Label>
                  <Input
                    value={contractDetail.clientContactName || contractDetail.clientName || ''}
                    readOnly
                    className="bg-gray-100"
                  />
                  {contractDetail.clientContactEmail && (
                    <p className="text-sm text-gray-500 mt-1">{contractDetail.clientContactEmail}</p>
                  )}
                </div>

                <div>
                  <Label>LandBridge</Label>
                  <Input
                    value={contractDetail.landbridgeContactName || ''}
                    readOnly
                    className="bg-gray-100"
                  />
                  {contractDetail.landbridgeContactEmail && (
                    <p className="text-sm text-gray-500 mt-1">{contractDetail.landbridgeContactEmail}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Attachments Section */}
            {contractDetail.attachments && contractDetail.attachments.length > 0 && (
              <section className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">{t('sales.sowDetail.sections.attachments')}</h2>
                <div className="space-y-2">
                  {contractDetail.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{attachment.fileName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAttachment(attachment.s3Key)}
                        title="View attachment"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Internal Review Workflow Section - Hide when status is Client Under Review */}
            {!isClientUnderReview && (
              <section className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">{t('sales.sowDetail.sections.internalReview')}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('sales.sowDetail.fields.reviewer')}</Label>
                    <Input
                      value={contractDetail.reviewerName || 'Not assigned'}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>

                  {contractDetail.reviewerId && (
                    <>
                      <div>
                        <Label>{t('sales.sowDetail.fields.actions')}</Label>
                        <div className="relative">
                          {isReviewDisabled && (
                            <div 
                              className="absolute inset-0 z-50 bg-gray-100/90 cursor-not-allowed rounded-md"
                              onClick={(e) => e.preventDefault()}
                              onMouseDown={(e) => e.preventDefault()}
                            />
                          )}
                          <Select
                            value={reviewAction || ''}
                            onValueChange={(value: string) => {
                              if (!isReviewDisabled) {
                                setReviewAction(value);
                              }
                            }}
                            disabled={isReviewDisabled}
                          >
                          <SelectTrigger 
                              className={isReviewDisabled ? 'bg-gray-100 cursor-not-allowed text-gray-800' : ''}
                              aria-disabled={isReviewDisabled}
                              tabIndex={isReviewDisabled ? -1 : 0}
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
                        <Label>{t('sales.sowDetail.fields.reviewNotes')}</Label>
                        <div className="relative">
                          {isReviewDisabled && (
                            <div 
                              className="absolute inset-0 z-50 bg-gray-100/90 cursor-not-allowed rounded-md"
                              onClick={(e) => e.preventDefault()}
                              onMouseDown={(e) => e.preventDefault()}
                            />
                          )}
                          <Textarea
                            placeholder="Enter review notes"
                            value={reviewNotes}
                            onChange={(e) => {
                              if (!isReviewDisabled) {
                                setReviewNotes(e.target.value);
                              }
                            }}
                            disabled={isReviewDisabled}
                            readOnly={isReviewDisabled}
                            className={isReviewDisabled ? 'bg-gray-100 cursor-not-allowed text-gray-800' : ''}
                            rows={4}
                          />
                        </div>
                      </div>

                      {!isReviewDisabled && (
                        <div className="col-span-2">
                          <Button
                            type="button"
                            onClick={handleReviewSubmit}
                            disabled={submitting || !reviewAction}
                            className="bg-gray-800 text-white"
                          >
                            {submitting ? t('sales.sowDetail.actions.submitReview') + '...' : t('sales.sowDetail.actions.submitReview')}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>
            )}

            {/* Review Result Section - Show when status is Client Under Review */}
            {isClientUnderReview && contractDetail.reviewAction && (
              <section className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">{t('sales.sowDetail.sections.reviewResult')}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reviewer</Label>
                    <Input
                      value={contractDetail.reviewerName || 'N/A'}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <Label>Action</Label>
                    <Input
                      value={contractDetail.reviewAction === 'APPROVE' ? 'Approve' : contractDetail.reviewAction}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  {contractDetail.reviewNotes && (
                    <div className="col-span-2">
                      <Label>Review Notes</Label>
                      <Textarea
                        value={contractDetail.reviewNotes}
                        readOnly
                        className="bg-gray-100"
                        rows={4}
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* History Section */}
            {contractDetail.history && contractDetail.history.length > 0 && (
              <section className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">History</h2>
                <div className="space-y-4">
                  {contractDetail.history.map((historyItem) => (
                    <div key={historyItem.id} className="border-l-4 border-gray-300 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{historyItem.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(historyItem.date)}</p>
                        </div>
                        {historyItem.documentLink && historyItem.documentName && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAttachment(historyItem.documentLink!)}
                            title="View document"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {historyItem.documentName}
                          </Button>
                        )}
                      </div>
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
                    {t('sales.sowDetail.actions.back')}
                  </Button>
                  {isEditable && isRequestForChangeStatus && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveContractChanges}
                        disabled={submitting}
                        className="bg-gray-800 text-white"
                      >
                        {submitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  )}
                </section>
              </form>
            </TabsContent>

            {/* Change Requests Tab */}
            <TabsContent value="change-requests" className="mt-6">
              <div className="space-y-4">
                {/* Header with New Change Request button */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('sales.sowDetail.sections.changeRequests')}</h2>
                  {(() => {
                    const showButton = (contractDetail.engagementType === 'Retainer' || contractDetail.engagementType === 'Fixed Price') && 
                                     (contractDetail.status === 'Active' || contractDetail.status === 'active');
                    return showButton ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-blue-600 text-blue-600"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Force re-render by setting to false first, then true
                          setIsCreateChangeRequestModalOpen(false);
                          setTimeout(() => {
                            setIsCreateChangeRequestModalOpen(true);
                          }, 10);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('sales.sowDetail.actions.createChangeRequest')}
                      </Button>
                    ) : null;
                  })()}
                </div>
                
                {/* Loading state */}
                {changeRequestsLoading && (
                  <div className="text-center py-8 text-gray-500">{t('sales.sowDetail.changeRequests.loading')}</div>
                )}
                
                {/* Error state */}
                {changeRequestsError && (
                  <div className="text-center py-8 text-red-500">{changeRequestsError}</div>
                )}
                
                {/* Table */}
                {!changeRequestsLoading && !changeRequestsError && (
                  <>
                    {changeRequests.length > 0 ? (
                      <>
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('sales.sowDetail.changeRequests.table.crId')}</TableHead>
                                <TableHead>{t('sales.sowDetail.changeRequests.table.type')}</TableHead>
                                <TableHead>{t('sales.sowDetail.changeRequests.table.summary')}</TableHead>
                                <TableHead>{t('sales.sowDetail.changeRequests.table.effectiveFrom')}</TableHead>
                                <TableHead>{t('sales.sowDetail.changeRequests.table.effectiveUntil')}</TableHead>
                                <TableHead className="text-right">{t('sales.sowDetail.changeRequests.table.expectedExtraCost')}</TableHead>
                                <TableHead className="text-right">{t('sales.sowDetail.changeRequests.table.costEstimatedByLandbridge')}</TableHead>
                                <TableHead>{t('sales.sowDetail.changeRequests.table.status')}</TableHead>
                                <TableHead>{t('sales.sowDetail.changeRequests.table.action')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {changeRequests.map((cr) => (
                                <TableRow key={cr.id}>
                                  <TableCell className="font-medium">{cr.changeRequestId}</TableCell>
                                  <TableCell>{cr.type}</TableCell>
                                  <TableCell className="max-w-xs truncate" title={cr.summary}>
                                    {cr.summary.length > 50 ? `${cr.summary.substring(0, 50)}...` : cr.summary}
                                  </TableCell>
                                  <TableCell>{formatDate(cr.effectiveFrom)}</TableCell>
                                  <TableCell>{formatDate(cr.effectiveUntil)}</TableCell>
                                  <TableCell className="text-right">{formatCurrency(cr.expectedExtraCost)}</TableCell>
                                  <TableCell className="text-right">{formatCurrency(cr.costEstimatedByLandbridge)}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusBadgeColor(cr.status)}>
                                      {cr.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewChangeRequest(cr.id)}
                                      title="View change request"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 0}
                            >
                              {t('sales.sowDetail.changeRequests.pagination.previous')}
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                              <Button
                                key={page}
                                type="button"
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className={currentPage === page ? 'bg-blue-600 text-white' : ''}
                              >
                                {page + 1}
                              </Button>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage >= totalPages - 1}
                            >
                              {t('sales.sowDetail.changeRequests.pagination.next')}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="border rounded-lg p-8 text-center text-gray-500">
                        <p className="text-lg mb-2">{t('sales.sowDetail.changeRequests.emptyMessage')}</p>
                        <p className="text-sm">{t('sales.sowDetail.changeRequests.emptyAction')}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Create Change Request Modal */}
      {contractDetail && contractDetail.id ? (
        <CreateChangeRequestModal
          key={`create-cr-modal-${contractDetail.id}-${isCreateChangeRequestModalOpen}`}
          isOpen={isCreateChangeRequestModalOpen}
          onClose={() => {
            setIsCreateChangeRequestModalOpen(false);
          }}
          sowContractId={contractDetail.id}
          engagementType={contractDetail.engagementType || 'Retainer'}
          salesUsers={salesUsers}
          token={token || ''}
          currentUserId={user?.id || 0}
          onSuccess={() => {
            setIsCreateChangeRequestModalOpen(false);
            // Reload change requests list
            loadChangeRequests(0);
          }}
        />
      ) : null}
      
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
          contractType="SOW"
          engagementType={contractDetail.engagementType}
          salesUsers={salesUsers}
          token={token || ''}
          currentUserId={user?.id || 0}
          onSuccess={() => {
            // Reload change requests list and contract detail
            loadChangeRequests(0);
            if (token && contractId) {
              // Reload contract detail
              getSOWContractDetail(contractId, token).then(detail => {
                setContractDetail(detail);
                setReviewNotes(detail.reviewNotes || '');
                setReviewAction(detail.reviewAction || null);
              }).catch(error => {
                console.error('Error reloading contract detail:', error);
              });
            }
          }}
        />
      )}

      {/* Create Project Close Request Modal */}
      {contractDetail && contractId && (
        <CreateProjectCloseRequestModal
          isOpen={isCreateCloseRequestModalOpen}
          onClose={() => {
            setIsCreateCloseRequestModalOpen(false);
          }}
          sowId={contractId}
          existingCloseRequest={closeRequest ? {
            id: closeRequest.id,
            message: closeRequest.message,
            links: closeRequest.links,
            status: closeRequest.status,
          } : null}
          onSubmit={handleCreateCloseRequest}
          onResubmit={handleResubmitCloseRequest}
        />
      )}
    </div>
  );
}

