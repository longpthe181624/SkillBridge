'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Upload, X, Calendar as CalendarIcon, Trash2, Plus } from 'lucide-react';
import SalesSidebar from '@/components/design-patterns/sales/SalesSidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  createMSAContract,
  getApprovedOpportunities,
  getOpportunityDetails,
  getSalesUsers,
  getClientUsers,
  CreateMSAFormData,
  Opportunity,
  SalesUser,
  ClientUser,
} from '@/services/salesMSAContractService';
import {
  createSOWContract,
  getActiveMSAContracts,
  getMSADetails,
  CreateSOWFormData,
  DeliveryItem,
  EngagedEngineer,
  MilestoneDeliverable,
  BillingDetail,
  MSAContract,
} from '@/services/salesSOWContractService';

function CreateMSAPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityIdParam = searchParams.get('opportunityId');
  const { t, language } = useLanguage();

  // Calculate min and max dates: 5 years ago to 10 years in the future
  const today = new Date();
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - 5);
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 10);
  const minDateStr = minDate.toISOString().split('T')[0];
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sowValidationErrors, setSowValidationErrors] = useState<{[key: string]: boolean}>({});
  const [msaValidationErrors, setMsaValidationErrors] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();
const MAX_ATTACHMENT_FILES = 1;
  
  // Data for dropdowns
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [salesUsers, setSalesUsers] = useState<SalesUser[]>([]);
  const [clientUsers, setClientUsers] = useState<ClientUser[]>([]);
  const [activeMSAs, setActiveMSAs] = useState<MSAContract[]>([]);
  const [msaBillingDay, setMsaBillingDay] = useState<string | null>(null); // Store MSA billing day
  
  // SOW Form data
  const [sowFormData, setSowFormData] = useState<CreateSOWFormData>({
    msaId: null,
    clientId: null,
    clientName: '',
    engagementType: 'Retainer',
    effectiveStart: null,
    effectiveEnd: null,
    status: 'Draft',
    assigneeUserId: null,
    note: '',
    scopeSummary: '',
    projectName: '',
    contractValue: 0,
    deliveryItems: [],
    engagedEngineers: [{
      engineerLevel: '',
      startDate: '',
      endDate: '',
      billingType: 'Monthly',
      hourlyRate: 0,
      hours: 0,
      subtotal: 0,
      rating: 100,
      salary: 0,
    }],
    milestoneDeliverables: [],
    billingDetails: [{
      paymentDate: '',
      deliveryNote: '',
      amount: 0,
    }],
    attachments: [],
    reviewerId: null,
    reviewNotes: '',
    reviewAction: null,
  });
  
  // Form data
  const [formData, setFormData] = useState<CreateMSAFormData>({
    opportunityId: opportunityIdParam || null,
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

  // Load user and token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Pre-select assignee if user is Sales Man
        if (parsedUser.role === 'SALES_REP') {
          setFormData(prev => ({ ...prev, assigneeUserId: parsedUser.id }));
        }
        
        // Pre-select landbridge contact
        setFormData(prev => ({ ...prev, landbridgeContactId: parsedUser.id }));
        
        // Pre-select assignee for SOW if user is Sales Man
        if (parsedUser.role === 'SALES_REP') {
          setSowFormData(prev => ({ ...prev, assigneeUserId: parsedUser.id }));
        }
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    } else {
      router.push('/sales/login');
    }
  }, [router]);

  // Load dropdown data
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [opps, sales, clients, msas] = await Promise.all([
          getApprovedOpportunities(token),
          getSalesUsers(token),
          getClientUsers(token),
          getActiveMSAContracts(token),
        ]);
        
        setOpportunities(opps);
        setSalesUsers(sales);
        setClientUsers(clients);
        // Sort MSA contracts by contractId in descending order for dropdown
        const sortedMsas = [...msas].sort((a, b) => {
          const idA = Number(a.contractId);
          const idB = Number(b.contractId);
          if (!isNaN(idA) && !isNaN(idB)) {
            return idB - idA;
          }
          // Fallback to string compare when not numeric
          return String(b.contractId).localeCompare(String(a.contractId));
        });
        setActiveMSAs(sortedMsas);
        
        // Load opportunity details if pre-selected
        if (opportunityIdParam && clients.length > 0) {
          try {
            const oppDetails = await getOpportunityDetails(opportunityIdParam, token);
            
            // Find clientId and clientContactId from clientEmail in clientUsers list
            let clientId: number | null = null;
            let clientContactId: number | null = null;
            if (oppDetails.clientEmail) {
              const clientUser = clients.find(u => 
                u.email && u.email.toLowerCase() === oppDetails.clientEmail?.toLowerCase()
              );
              if (clientUser) {
                clientId = clientUser.id;
                clientContactId = clientUser.id; // Auto-fill client contact
              }
            }
            
            setFormData(prev => ({
              ...prev,
              opportunityId: oppDetails.opportunityId,
              clientId: clientId || oppDetails.clientId || null,
              clientName: oppDetails.clientName,
              clientContactId: clientContactId || null, // Auto-fill client contact
            }));
          } catch (e) {
            console.error('Error loading opportunity details:', e);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, opportunityIdParam]);

  // Handle opportunity selection
  const handleOpportunityChange = async (opportunityId: string) => {
    if (!token) return;
    
    try {
      const oppDetails = await getOpportunityDetails(opportunityId, token);
      
      // Ensure clientUsers are loaded
      let clientsToUse = clientUsers;
      if (clientsToUse.length === 0) {
        clientsToUse = await getClientUsers(token);
        setClientUsers(clientsToUse);
      }
      
      // Find clientId and clientContactId from clientEmail in clientUsers list
      let clientId: number | null = null;
      let clientContactId: number | null = null;
      
      if (oppDetails.clientEmail) {
        // Find client user by email (case-insensitive)
        const clientUser = clientsToUse.find(u => 
          u.email && u.email.toLowerCase() === oppDetails.clientEmail?.toLowerCase()
        );
        
        if (clientUser) {
          clientId = clientUser.id;
          clientContactId = clientUser.id; // Auto-fill client contact
          console.log('Found client user:', clientUser);
        } else {
          console.warn('Client user not found for email:', oppDetails.clientEmail);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        opportunityId: oppDetails.opportunityId,
        clientId: clientId || oppDetails.clientId || null,
        clientName: oppDetails.clientName,
        clientContactId: clientContactId || null, // Auto-fill client contact (don't keep previous)
      }));
    } catch (error) {
      console.error('Error loading opportunity details:', error);
    }
  };

  // Handle client selection (when no opportunity selected)
  const handleClientChange = (clientId: string) => {
    const selectedClient = clientUsers.find(c => c.id.toString() === clientId);
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        clientId: selectedClient.id,
        clientName: selectedClient.fullName,
        clientContactId: selectedClient.id, // Auto-fill client contact
      }));
    }
  };

  // Handle opportunity clear
  const handleOpportunityClear = () => {
    setFormData(prev => ({
      ...prev,
      opportunityId: null,
      clientId: null,
      clientName: '',
      clientContactId: null,
    }));
  };

  const getValidatedAttachmentFiles = (incomingFiles: File[], currentLength: number) => {
    if (currentLength >= MAX_ATTACHMENT_FILES) {
      toast({
        title: 'Attachment limit reached',
        description: `You can upload up to ${MAX_ATTACHMENT_FILES} attachment.`,
      });
      return [];
    }

    const pdfFiles = incomingFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      toast({
        title: 'Invalid file type',
        description: 'Only PDF files are allowed.',
        variant: 'destructive',
      });
      return [];
    }

    const remainingSlots = MAX_ATTACHMENT_FILES - currentLength;
    const filesToAdd = pdfFiles.slice(0, remainingSlots);

    if (pdfFiles.length > remainingSlots) {
      toast({
        title: 'Attachment limit reached',
        description: `Only ${MAX_ATTACHMENT_FILES} attachment is allowed.`,
      });
    }

    return filesToAdd;
  };

  const addMsaAttachments = (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) return;

    setFormData(prev => {
      const current = prev.attachments || [];
      const filesToAdd = getValidatedAttachmentFiles(incomingFiles, current.length);
      if (filesToAdd.length === 0) {
        return prev;
      }

      return {
        ...prev,
        attachments: [...current, ...filesToAdd],
      };
    });
  };

  const addSowAttachments = (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) return;

    setSowFormData(prev => {
      const current = prev.attachments || [];
      const filesToAdd = getValidatedAttachmentFiles(incomingFiles, current.length);
      if (filesToAdd.length === 0) {
        return prev;
      }

      return {
        ...prev,
        attachments: [...current, ...filesToAdd],
      };
    });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addMsaAttachments(files);
    e.target.value = '';
  };

  const handleFileRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || [],
    }));
  };

  // Handle form submission
  const handleSubmit = async (action: 'save' | 'draft') => {
    if (!token) return;

    // Validate required fields for MSA
    const errors: {[key: string]: boolean} = {};
    let hasError = false;
    const errorMessages: string[] = [];

    if (!formData.clientId) {
      errors.clientId = true;
      hasError = true;
      errorMessages.push('Client is required');
    }
    if (!formData.effectiveStart) {
      errors.effectiveStart = true;
      hasError = true;
      errorMessages.push('Effective Start date is required');
    }
    if (!formData.effectiveEnd) {
      errors.effectiveEnd = true;
      hasError = true;
      errorMessages.push('Effective End date is required');
    }
    // Validate Effective End >= Effective Start
    if (formData.effectiveStart && formData.effectiveEnd) {
      const startDate = new Date(formData.effectiveStart);
      const endDate = new Date(formData.effectiveEnd);
      if (endDate < startDate) {
        errors.effectiveEnd = true;
        hasError = true;
        errorMessages.push('Effective End date must be on or after Effective Start date');
      }
    }
    if (!formData.clientContactId) {
      errors.clientContactId = true;
      hasError = true;
      errorMessages.push('Client Contact is required');
    }
    if (!formData.landbridgeContactId) {
      errors.landbridgeContactId = true;
      hasError = true;
      errorMessages.push('LandBridge Contact is required');
    }
    if (!formData.assigneeUserId) {
      errors.assigneeUserId = true;
      hasError = true;
      errorMessages.push('Assignee is required');
    }
    // When saving, reviewer must be assigned to move forward
    if (action === 'save' && !formData.reviewerId) {
      errors.reviewerId = true;
      hasError = true;
      errorMessages.push('Reviewer is required to save the contract');
    }

    if (hasError) {
      setMsaValidationErrors(errors);
      toast({
        title: 'Validation Error',
        description: errorMessages.join(', '),
        variant: 'destructive',
      });
      return;
    }

    // Clear validation errors if validation passes
    setMsaValidationErrors({});

    try {
      setSubmitting(true);
      
      const dataToSubmit = {
        ...formData,
        // If saving (not draft) and reviewer is assigned → move to Internal Review
        status: action === 'draft'
          ? 'Draft'
          : (formData.reviewerId ? 'Internal Review' : formData.status),
      };
      
      const result = await createMSAContract(dataToSubmit, token);
      
      toast({
        title: 'Success',
        description: 'MSA contract created successfully',
        variant: 'success',
      });
      
      // Navigate to contract detail or list
      router.push(`/sales/contracts/${result.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create contract',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push('/sales/contracts');
    }
  };

  // SOW Handlers
  const handleMSAChange = async (msaId: string) => {
    if (!token || !msaId) return;
    
    try {
      const msaDetails = await getMSADetails(msaId, token);
      const billingDay = msaDetails.billingDay || null;
      setMsaBillingDay(billingDay);
      setSowFormData(prev => {
        const updated = {
          ...prev,
          msaId: msaId,
          clientId: msaDetails.clientId,
          clientName: msaDetails.clientName || '',
        };
        
        // Re-generate billing details if Fixed Price with milestones
        if (prev.engagementType === 'Fixed Price' && prev.milestoneDeliverables.length > 0 && billingDay) {
          const contractValue = prev.contractValue || 0;
          const billingDetails: BillingDetail[] = prev.milestoneDeliverables.map(milestone => {
            const invoiceDate = calculateInvoiceDate(milestone.plannedEnd, billingDay);
            return {
              billingName: milestone.milestone ? `${milestone.milestone} Payment` : 'Payment',
              milestone: milestone.milestone,
              paymentDate: invoiceDate,
              deliveryNote: milestone.deliveryNote,
              amount: (contractValue * (milestone.paymentPercentage || 0)) / 100,
              percentage: milestone.paymentPercentage,
            };
          });
          updated.billingDetails = billingDetails;
        }
        
        return updated;
      });
    } catch (error) {
      console.error('Error loading MSA details:', error);
    }
  };

  const handleSOWSubmit = async (action: 'save' | 'draft') => {
    if (!token) return;

    // Validate required fields
    const errors: {[key: string]: boolean} = {};
    let hasError = false;

    if (!sowFormData.assigneeUserId) {
      errors.assigneeUserId = true;
      hasError = true;
    }
    if (!sowFormData.msaId) {
      errors.msaId = true;
      hasError = true;
    }
    if (!sowFormData.clientId) {
      errors.clientId = true;
      hasError = true;
    }
    if (!sowFormData.effectiveStart) {
      errors.effectiveStart = true;
      hasError = true;
    }
    if (!sowFormData.effectiveEnd) {
      errors.effectiveEnd = true;
      hasError = true;
    }
    // Validate Effective End >= Effective Start
    if (sowFormData.effectiveStart && sowFormData.effectiveEnd) {
      const startDate = new Date(sowFormData.effectiveStart);
      const endDate = new Date(sowFormData.effectiveEnd);
      if (endDate < startDate) {
        errors.effectiveEnd = true;
        hasError = true;
      }
    }
    // When saving (not draft), reviewer must be assigned
    if (action === 'save' && !sowFormData.reviewerId) {
      errors.reviewerId = true;
      hasError = true;
    }

    if (sowFormData.engagementType === 'Fixed Price') {
      if (!sowFormData.contractValue || sowFormData.contractValue <= 0) {
        errors.contractValue = true;
        hasError = true;
      }
      if (!sowFormData.milestoneDeliverables || sowFormData.milestoneDeliverables.length === 0) {
        errors.milestoneDeliverables = true;
        hasError = true;
      }
    } else if (sowFormData.engagementType === 'Retainer') {
      if (!sowFormData.engagedEngineers || sowFormData.engagedEngineers.length === 0) {
        errors.engagedEngineers = true;
        hasError = true;
      } else {
        // Validate each engaged engineer's dates
        sowFormData.engagedEngineers.forEach((engineer, index) => {
          if (!engineer.startDate) {
            errors[`engineerStartDate_${index}`] = true;
            hasError = true;
          }
          if (!engineer.endDate) {
            errors[`engineerEndDate_${index}`] = true;
            hasError = true;
          }
          // Validate End Date >= Start Date
          if (engineer.startDate && engineer.endDate) {
            const startDate = new Date(engineer.startDate);
            const endDate = new Date(engineer.endDate);
            if (endDate < startDate) {
              errors[`engineerEndDate_${index}`] = true;
              hasError = true;
            }
          }
        });
      }
      if (!sowFormData.billingDetails || sowFormData.billingDetails.length === 0) {
        errors.billingDetails = true;
        hasError = true;
      }
    }

    if (hasError) {
      setSowValidationErrors(errors);
      const errorMessages: string[] = [];
      if (errors.assigneeUserId) errorMessages.push('Assignee is required');
      if (errors.msaId) errorMessages.push('MSA Contract is required');
      if (errors.clientId) errorMessages.push('Client is required');
      if (errors.effectiveStart) errorMessages.push('Effective Start date is required');
      if (errors.effectiveEnd) {
        if (sowFormData.effectiveStart && sowFormData.effectiveEnd && new Date(sowFormData.effectiveEnd) < new Date(sowFormData.effectiveStart)) {
          errorMessages.push('Effective End date must be on or after Effective Start date');
        } else {
          errorMessages.push('Effective End date is required');
        }
      }
      if (errors.reviewerId) errorMessages.push('Reviewer is required to save the contract');
      if (errors.contractValue) errorMessages.push('Contract Value is required');
      if (errors.milestoneDeliverables) errorMessages.push('At least one Milestone Deliverable is required');
      if (errors.engagedEngineers) errorMessages.push('At least one Engaged Engineer is required');
      // Add specific error messages for engineer date validations
      sowFormData.engagedEngineers?.forEach((engineer, index) => {
        if (errors[`engineerStartDate_${index}`]) {
          errorMessages.push(`Engaged Engineer ${index + 1}: Start Date is required`);
        }
        if (errors[`engineerEndDate_${index}`]) {
          if (engineer.startDate && engineer.endDate && new Date(engineer.endDate) < new Date(engineer.startDate)) {
            errorMessages.push(`Engaged Engineer ${index + 1}: End Date must be on or after Start Date`);
          } else {
            errorMessages.push(`Engaged Engineer ${index + 1}: End Date is required`);
          }
        }
      });
      if (errors.billingDetails) errorMessages.push('At least one Billing Detail is required');
      
      toast({
        title: 'Validation Error',
        description: errorMessages.join(', '),
        variant: 'destructive',
      });
      return;
    }

    // Clear validation errors if validation passes
    setSowValidationErrors({});

    try {
      setSubmitting(true);
      
      const dataToSubmit = {
        ...sowFormData,
        // If saving (not draft) and reviewer is assigned → move to Internal Review
        status: action === 'draft'
          ? 'Draft'
          : (sowFormData.reviewerId ? 'Internal Review' : sowFormData.status),
      };
      
      const result = await createSOWContract(dataToSubmit, token);
      
      toast({
        title: 'Success',
        description: 'SOW contract created successfully',
        variant: 'success',
      });
      
      // Navigate to SOW contract detail
      router.push(`/sales/contracts/sow/${result.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create SOW contract',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Format currency helper (without ¥ symbol for input value)
  const formatCurrency = (value: number): string => {
    if (value === 0) return '';
    return value.toLocaleString('ja-JP');
  };

  // Parse currency helper
  const parseCurrency = (value: string): number => {
    const rawValue = value.replace(/¥|,/g, '').trim();
    return rawValue === '' ? 0 : parseFloat(rawValue) || 0;
  };

  // Calculate invoice date based on Planned End and Billing Day
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

  // Add/remove engaged engineers (Retainer)
  const addEngagedEngineer = () => {
    setSowFormData(prev => ({
      ...prev,
      engagedEngineers: [...prev.engagedEngineers, {
        engineerLevel: '',
        startDate: '',
        endDate: '',
        billingType: 'Monthly',
        hourlyRate: 0,
        hours: 0,
        subtotal: 0,
        rating: 100,
        salary: 0,
      }],
    }));
  };

  const removeEngagedEngineer = (index: number) => {
    if (sowFormData.engagedEngineers.length > 1) {
      setSowFormData(prev => ({
        ...prev,
        engagedEngineers: prev.engagedEngineers.filter((_, i) => i !== index),
      }));
    }
  };

  const updateEngagedEngineer = (index: number, field: keyof EngagedEngineer, value: any) => {
    setSowFormData(prev => {
      const updated = [...prev.engagedEngineers];
      const engineer = { ...updated[index], [field]: value };
      
      // Handle billing type changes
      if (field === 'billingType') {
        if (value === 'Hourly') {
          engineer.hourlyRate = engineer.hourlyRate || 0;
          engineer.hours = engineer.hours || 0;
          engineer.subtotal = (engineer.hourlyRate || 0) * (engineer.hours || 0);
          engineer.salary = engineer.subtotal;
        } else {
          engineer.hourlyRate = undefined;
          engineer.hours = undefined;
          engineer.subtotal = undefined;
        }
      }
      
      // Auto-calculate subtotal for hourly billing
      if (field === 'hourlyRate' || field === 'hours') {
        if (engineer.billingType === 'Hourly') {
          engineer.subtotal = (engineer.hourlyRate || 0) * (engineer.hours || 0);
          engineer.salary = engineer.subtotal;
        }
      }
      
      // Clear validation errors when dates are updated and valid
      if (field === 'startDate' || field === 'endDate') {
        if (field === 'startDate' && engineer.endDate) {
          const startDate = new Date(value);
          const endDate = new Date(engineer.endDate);
          if (endDate >= startDate) {
            setSowValidationErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[`engineerEndDate_${index}`];
              return newErrors;
            });
          }
        } else if (field === 'endDate' && engineer.startDate) {
          const startDate = new Date(engineer.startDate);
          const endDate = new Date(value);
          if (endDate >= startDate) {
            setSowValidationErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[`engineerEndDate_${index}`];
              return newErrors;
            });
          }
        }
      }
      
      updated[index] = engineer;
      return { ...prev, engagedEngineers: updated };
    });
  };

  // Add/remove billing details (Retainer)
  const addBillingDetail = () => {
    setSowFormData(prev => ({
      ...prev,
      billingDetails: [...prev.billingDetails, {
        paymentDate: '',
        deliveryNote: '',
        amount: 0,
      }],
    }));
  };

  const removeBillingDetail = (index: number) => {
    if (sowFormData.billingDetails.length > 1) {
      setSowFormData(prev => ({
        ...prev,
        billingDetails: prev.billingDetails.filter((_, i) => i !== index),
      }));
    }
  };

  const updateBillingDetail = (index: number, field: keyof BillingDetail, value: any) => {
    setSowFormData(prev => {
      const updated = [...prev.billingDetails];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, billingDetails: updated };
    });
  };

  // Auto-generate billing details from milestone deliverables (Fixed Price)
  const autoGenerateFixedPriceBillingDetails = () => {
    setSowFormData(prev => {
      if (prev.engagementType === 'Fixed Price' && prev.milestoneDeliverables.length > 0) {
        const contractValue = prev.contractValue || 0;
        // Use current msaBillingDay from state
        const currentBillingDay = msaBillingDay;
        const billingDetails: BillingDetail[] = prev.milestoneDeliverables.map(milestone => {
          // Calculate invoice date based on Planned End and Billing Day
          const invoiceDate = calculateInvoiceDate(milestone.plannedEnd, currentBillingDay);
          
          return {
            billingName: milestone.milestone ? `${milestone.milestone} Payment` : 'Payment',
            milestone: milestone.milestone,
            paymentDate: invoiceDate, // Use calculated invoice date
            deliveryNote: milestone.deliveryNote,
            amount: (contractValue * (milestone.paymentPercentage || 0)) / 100,
            percentage: milestone.paymentPercentage,
          };
        });
        return { ...prev, billingDetails };
      }
      return prev;
    });
  };

  // Add/remove milestone deliverables (Fixed Price)
  const addMilestoneDeliverable = () => {
    setSowFormData(prev => {
      const newMilestone = {
        milestone: '',
        deliveryNote: '',
        acceptanceCriteria: '',
        plannedEnd: '',
        paymentPercentage: 0,
      };
      const updated = [...prev.milestoneDeliverables, newMilestone];
      
      return { ...prev, milestoneDeliverables: updated };
    });
    // Auto-generate billing details after state update
    setTimeout(() => autoGenerateFixedPriceBillingDetails(), 0);
  };

  const removeMilestoneDeliverable = (index: number) => {
    setSowFormData(prev => {
      const updated = prev.milestoneDeliverables.filter((_, i) => i !== index);
      return { ...prev, milestoneDeliverables: updated };
    });
    // Auto-generate billing details after state update
    setTimeout(() => autoGenerateFixedPriceBillingDetails(), 0);
  };

  const updateMilestoneDeliverable = (index: number, field: keyof MilestoneDeliverable, value: any) => {
    setSowFormData(prev => {
      const updated = [...prev.milestoneDeliverables];

      if (field === 'paymentPercentage') {
        const newVal = Math.max(0, Math.min(100, parseFloat(value) || 0));
        const otherTotal = prev.milestoneDeliverables.reduce((sum, item, i) => i === index ? sum : sum + (item.paymentPercentage || 0), 0);

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

        updated[index] = { ...updated[index], paymentPercentage: newVal };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }

      return { ...prev, milestoneDeliverables: updated };
    });
    // Auto-generate billing details after state update
    setTimeout(() => autoGenerateFixedPriceBillingDetails(), 0);
  };

  // Handle SOW file upload
  const handleSOWFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addSowAttachments(files);
    e.target.value = '';
  };

  const handleSOWFileRemove = (index: number) => {
    setSowFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || [],
    }));
  };

  if (!user || !token || loading) {
    return <div className="flex items-center justify-center min-h-screen">{t('sales.createMsa.loading')}</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SalesSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{t('sales.createMsa.title')}</h2>
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
            <a href="/sales/contracts" className="hover:underline">{t('sales.createMsa.breadcrumb.list')}</a>
            <span className="mx-2">/</span>
            <span id="breadcrumb-text">{t('sales.createMsa.breadcrumb.msa')}</span>
          </div>

          {/* Form Title */}
          <h1 className="text-2xl font-bold mb-6">{t('sales.createMsa.title.msa')}</h1>

          {/* Tabs */}
          <Tabs 
            defaultValue="msa" 
            className="w-full"
            onValueChange={(value) => {
              // Update breadcrumb and title based on active tab
              const breadcrumbText = document.getElementById('breadcrumb-text');
              const formTitle = document.getElementById('form-title');
              if (breadcrumbText && formTitle) {
                if (value === 'sow') {
                  breadcrumbText.textContent = t('sales.createMsa.breadcrumb.sow');
                  formTitle.textContent = t('sales.createMsa.title.sow');
                } else {
                  breadcrumbText.textContent = t('sales.createMsa.breadcrumb.msa');
                  formTitle.textContent = t('sales.createMsa.title.msa');
                }
              }
            }}
          >
            <TabsList>
              <TabsTrigger value="msa">{t('sales.createMsa.tabs.msa')}</TabsTrigger>
              <TabsTrigger value="sow">{t('sales.createMsa.tabs.sow')}</TabsTrigger>
            </TabsList>

            {/* MSA Tab */}
            <TabsContent value="msa" className="mt-6">
              <form className="space-y-8">
            {/* MSA Summary Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">{t('sales.createMsa.sections.msaSummary')}</h2>
              <div className="grid grid-cols-2 gap-4">
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
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="client">
                    Client <span className="text-red-500">*</span>
                  </Label>
                  {formData.opportunityId ? (
                    <Input
                      id="client"
                      value={formData.clientName}
                      readOnly
                      className={`bg-gray-100 ${msaValidationErrors.clientId ? 'border-red-500' : ''}`}
                    />
                  ) : (
                    <Select
                      value={formData.clientId?.toString() || ''}
                      onValueChange={handleClientChange}
                    >
                      <SelectTrigger className={msaValidationErrors.clientId ? 'border-red-500' : ''}>
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
                  {msaValidationErrors.clientId && (
                    <p className="text-sm text-red-500 mt-1">Client is required</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="effectiveStart">
                    Effective Start <span className="text-red-500">*</span>
                  </Label>
                  <DateInput
                    id="effectiveStart"
                    value={formData.effectiveStart || ''}
                    onChange={(value) => setFormData(prev => ({ ...prev, effectiveStart: value }))}
                    min={minDateStr}
                    max={maxDateStr}
                    className={msaValidationErrors.effectiveStart ? 'border-red-500' : ''}
                  />
                  {msaValidationErrors.effectiveStart && (
                    <p className="text-sm text-red-500 mt-1">Effective Start date is required</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="effectiveEnd">
                    Effective End <span className="text-red-500">*</span>
                  </Label>
                  <DateInput
                    id="effectiveEnd"
                    value={formData.effectiveEnd || ''}
                    onChange={(newEndDate) => {
                      setFormData(prev => {
                        // Clear validation error when user changes the date
                        if (msaValidationErrors.effectiveEnd && prev.effectiveStart) {
                          const startDate = new Date(prev.effectiveStart);
                          const endDate = new Date(newEndDate);
                          if (endDate >= startDate) {
                            setMsaValidationErrors(prevErrors => {
                              const newErrors = { ...prevErrors };
                              delete newErrors.effectiveEnd;
                              return newErrors;
                            });
                          }
                        }
                        return { ...prev, effectiveEnd: newEndDate };
                      });
                    }}
                    min={formData.effectiveStart || minDateStr}
                    max={maxDateStr}
                    className={msaValidationErrors.effectiveEnd ? 'border-red-500' : ''}
                  />
                  {msaValidationErrors.effectiveEnd && (
                    <p className="text-sm text-red-500 mt-1">
                      {formData.effectiveStart && formData.effectiveEnd && new Date(formData.effectiveEnd) < new Date(formData.effectiveStart)
                        ? 'Effective End date must be on or after Effective Start date'
                        : 'Effective End date is required'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="assignee">
                    Assignee <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.assigneeUserId?.toString() || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, assigneeUserId: parseInt(value) }))}
                  >
                    <SelectTrigger className={msaValidationErrors.assigneeUserId ? 'border-red-500' : ''}>
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
                  {msaValidationErrors.assigneeUserId && (
                    <p className="text-sm text-red-500 mt-1">Assignee is required</p>
                  )}
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
              <h2 className="text-xl font-semibold mb-4">{t('sales.createMsa.sections.commercialTerms')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">
                    Currency <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="paymentTerms">
                    Payment Terms <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="invoicingCycle">
                    Invoicing Cycle <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.invoicingCycle}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, invoicingCycle: value }))}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="billingDay">
                    Billing Day <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.billingDay}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, billingDay: value }))}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="taxWithholding">
                    Tax / Withholding <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.taxWithholding}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, taxWithholding: value }))}
                  >
                    <SelectTrigger>
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
              <h2 className="text-xl font-semibold mb-4">{t('sales.createMsa.sections.legalCompliance')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ipOwnership">
                    IP Ownership <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.ipOwnership}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, ipOwnership: value }))}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="governingLaw">
                    Governing Law <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.governingLaw}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, governingLaw: value }))}
                  >
                    <SelectTrigger>
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
              <h2 className="text-xl font-semibold mb-4">{t('sales.createMsa.sections.contacts')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientContact">
                    Client <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.clientContactId?.toString() || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, clientContactId: parseInt(value) }))}
                    disabled={!!formData.opportunityId && !!formData.clientContactId}
                  >
                    <SelectTrigger className={`${formData.opportunityId && formData.clientContactId ? 'bg-gray-100' : ''} ${msaValidationErrors.clientContactId ? 'border-red-500' : ''}`}>
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
                  {formData.opportunityId && formData.clientContactId && (
                    <p className="text-xs text-gray-500 mt-1">Auto-filled from Opportunity</p>
                  )}
                  {msaValidationErrors.clientContactId && (
                    <p className="text-sm text-red-500 mt-1">Client Contact is required</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="landbridgeContact">
                    LandBridge <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.landbridgeContactId?.toString() || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, landbridgeContactId: parseInt(value) }))}
                  >
                    <SelectTrigger className={msaValidationErrors.landbridgeContactId ? 'border-red-500' : ''}>
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
                  {msaValidationErrors.landbridgeContactId && (
                    <p className="text-sm text-red-500 mt-1">LandBridge Contact is required</p>
                  )}
                </div>
              </div>
            </section>

            {/* Attachments Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">{t('sales.createMsa.sections.attachments')}</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="fileUpload"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-gray-600">
                          {t('sales.createMsa.attachments.upload')} (PDF, max 1 file)
                        </span>
                </label>
              </div>
              
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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

            {/* Internal Review Workflow Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Internal Review Workflow</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reviewer">Assign Reviewer</Label>
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
                  >
                    <SelectTrigger className={msaValidationErrors.reviewerId ? 'border-red-500' : ''}>
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
                  {msaValidationErrors.reviewerId && (
                    <p className="text-sm text-red-500 mt-1">Reviewer is required</p>
                  )}
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
                  
                  // Debug log (remove in production)
                  if (process.env.NODE_ENV === 'development') {
                    console.log('Reviewer check:', {
                      reviewerId,
                      currentUserId,
                      userObjectId: user?.id,
                      isReviewerCurrentUser,
                      reviewerIdType: typeof formData.reviewerId,
                      userIdType: typeof user?.id,
                      storedUser: storedUserStr ? JSON.parse(storedUserStr) : null
                    });
                  }
                  
                  return (
                    <>
                      <div>
                        <Label htmlFor="reviewAction">Actions</Label>
                        <div className="relative">
                          {!isReviewerCurrentUser && (
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
                              if (isReviewerCurrentUser) {
                                setFormData(prev => ({ ...prev, reviewAction: value }));
                              }
                            }}
                            disabled={!isReviewerCurrentUser}
                          >
                            <SelectTrigger 
                              className={!isReviewerCurrentUser ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
                              aria-disabled={!isReviewerCurrentUser}
                              tabIndex={!isReviewerCurrentUser ? -1 : 0}
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
                        <Label htmlFor="reviewNotes">Review Notes</Label>
                        <div className="relative">
                          {!isReviewerCurrentUser && (
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
                              if (isReviewerCurrentUser) {
                                setFormData(prev => ({ ...prev, reviewNotes: e.target.value }));
                              }
                            }}
                            disabled={!isReviewerCurrentUser}
                            readOnly={!isReviewerCurrentUser}
                            className={!isReviewerCurrentUser ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
                            rows={4}
                            style={{ pointerEvents: !isReviewerCurrentUser ? 'none' : 'auto' }}
                            tabIndex={!isReviewerCurrentUser ? -1 : 0}
                          />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </section>

                {/* Actions */}
                <section className="flex gap-4 justify-end">
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
                    onClick={() => handleSubmit('save')}
                    disabled={submitting}
                    className="bg-gray-800 text-white"
                  >
                    {submitting ? 'Saving...' : 'Save Contract'}
                  </Button>
                </section>
              </form>
            </TabsContent>

            {/* SOW Tab */}
            <TabsContent value="sow" className="mt-6">
              <form className="space-y-8">
                {/* SOW Summary Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">SOW Summary</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sow-msaId">
                        MSA ID <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={sowFormData.msaId || ''}
                        onValueChange={handleMSAChange}
                      >
                        <SelectTrigger className={sowValidationErrors.msaId ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select MSA" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeMSAs.map(msa => (
                            <SelectItem key={msa.id} value={msa.contractId}>
                              {msa.contractId} - {msa.contractName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {sowValidationErrors.msaId && (
                        <p className="text-sm text-red-500 mt-1">MSA Contract is required</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sow-client">Client</Label>
                      <Input
                        id="sow-client"
                        value={sowFormData.clientName || ''}
                        readOnly
                        className={`bg-gray-100 ${sowValidationErrors.clientId ? 'border-red-500' : ''}`}
                      />
                      {sowValidationErrors.clientId && (
                        <p className="text-sm text-red-500 mt-1">Client is required</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sow-engagementType">
                        Engagement Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={sowFormData.engagementType}
                        onValueChange={(value: 'Fixed Price' | 'Retainer') => {
                          setSowFormData(prev => ({
                            ...prev,
                            engagementType: value,
                            engagedEngineers: value === 'Retainer' ? (prev.engagedEngineers.length > 0 ? prev.engagedEngineers : [{
                              engineerLevel: '',
                              startDate: '',
                              endDate: '',
                              rating: 100,
                              salary: 0,
                            }]) : [],
                            milestoneDeliverables: value === 'Fixed Price' ? prev.milestoneDeliverables : [],
                            contractValue: value === 'Fixed Price' ? prev.contractValue : 0,
                            billingDetails: value === 'Retainer' ? (prev.billingDetails.length > 0 ? prev.billingDetails : [{
                              paymentDate: '',
                              deliveryNote: '',
                              amount: 0,
                            }]) : [],
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Retainer">Retainer</SelectItem>
                          <SelectItem value="Fixed Price">Fixed Price</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="sow-assignee">
                        Assignee <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={sowFormData.assigneeUserId?.toString() || ''}
                        onValueChange={(value) => {
                          setSowFormData(prev => ({ ...prev, assigneeUserId: parseInt(value) }));
                          // Clear error when user selects a value
                          if (sowValidationErrors.assigneeUserId) {
                            setSowValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.assigneeUserId;
                              return newErrors;
                            });
                          }
                        }}
                      >
                        <SelectTrigger className={sowValidationErrors.assigneeUserId ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select assignee *" />
                        </SelectTrigger>
                        <SelectContent>
                          {salesUsers.filter(u => u.role === 'SALES_REP').map(user => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {sowValidationErrors.assigneeUserId && (
                        <p className="text-sm text-red-500 mt-1">Assignee is required</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sow-effectiveStart">
                        Effective Start <span className="text-red-500">*</span>
                      </Label>
                      <DateInput
                        id="sow-effectiveStart"
                        value={sowFormData.effectiveStart || ''}
                        onChange={(value) => {
                          setSowFormData(prev => ({ ...prev, effectiveStart: value }));
                        }}
                        min={minDateStr}
                        max={maxDateStr}
                        className={sowValidationErrors.effectiveStart ? 'border-red-500' : ''}
                      />
                      {sowValidationErrors.effectiveStart && (
                        <p className="text-sm text-red-500 mt-1">Effective Start date is required</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sow-effectiveEnd">
                        Effective End <span className="text-red-500">*</span>
                      </Label>
                      <DateInput
                        id="sow-effectiveEnd"
                        value={sowFormData.effectiveEnd || ''}
                        onChange={(newEndDate) => {
                          setSowFormData(prev => {
                            // Clear validation error when user changes the date
                            if (sowValidationErrors.effectiveEnd && prev.effectiveStart) {
                              const startDate = new Date(prev.effectiveStart);
                              const endDate = new Date(newEndDate);
                              if (endDate >= startDate) {
                                setSowValidationErrors(prevErrors => {
                                  const newErrors = { ...prevErrors };
                                  delete newErrors.effectiveEnd;
                                  return newErrors;
                                });
                              }
                            }
                            return { ...prev, effectiveEnd: newEndDate };
                          });
                        }}
                        min={sowFormData.effectiveStart || minDateStr}
                        max={maxDateStr}
                        className={sowValidationErrors.effectiveEnd ? 'border-red-500' : ''}
                      />
                      {sowValidationErrors.effectiveEnd && (
                        <p className="text-sm text-red-500 mt-1">
                          {sowFormData.effectiveStart && sowFormData.effectiveEnd && new Date(sowFormData.effectiveEnd) < new Date(sowFormData.effectiveStart)
                            ? 'Effective End date must be on or after Effective Start date'
                            : 'Effective End date is required'}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sow-projectName">Project Name</Label>
                      <Input
                        id="sow-projectName"
                        value={sowFormData.projectName || ''}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 255);
                          setSowFormData(prev => ({ ...prev, projectName: value }));
                        }}
                        placeholder="Enter project name"
                        maxLength={255}
                      />
                    </div>

                    {sowFormData.engagementType === 'Fixed Price' && (
                      <div>
                        <Label htmlFor="sow-contractValue">
                          Value (Total Contract Value) <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                          <Input
                            id="sow-contractValue"
                            type="text"
                            value={sowFormData.contractValue ? formatCurrency(sowFormData.contractValue) : ''}
                            onChange={(e) => {
                              // Remove ¥ and commas, then parse
                              const rawValue = e.target.value.replace(/¥|,/g, '').trim();
                              const value = rawValue === '' ? 0 : parseFloat(rawValue) || 0;
                              setSowFormData(prev => ({ ...prev, contractValue: value }));
                              // Auto-generate billing details after state update
                              setTimeout(() => autoGenerateFixedPriceBillingDetails(), 0);
                            }}
                            onBlur={(e) => {
                              // Ensure value is formatted on blur
                              const rawValue = e.target.value.replace(/¥|,/g, '').trim();
                              const value = rawValue === '' ? 0 : parseFloat(rawValue) || 0;
                              setSowFormData(prev => ({ ...prev, contractValue: value }));
                            }}
                            placeholder="0"
                            className={`pl-8 ${sowValidationErrors.contractValue ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {sowValidationErrors.contractValue && (
                          <p className="text-sm text-red-500 mt-1">Contract Value is required</p>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                {/* Note Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Note</h2>
                  <Textarea
                    placeholder="Lorem Ipsum is simply dummy text"
                    value={sowFormData.note}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 500) {
                        setSowFormData(prev => ({ ...prev, note: value }));
                      }
                    }}
                    maxLength={500}
                    rows={4}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {sowFormData.note?.length || 0}/500 characters
                  </p>
                </section>

                {/* Scope Summary Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Scope summary</h2>
                  <Textarea
                    placeholder="Lorem Ipsum is simply dummy text"
                    value={sowFormData.scopeSummary}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 5000) {
                        setSowFormData(prev => ({ ...prev, scopeSummary: value }));
                      }
                    }}
                    maxLength={5000}
                    rows={4}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {sowFormData.scopeSummary?.length || 0}/5000 characters
                  </p>
                </section>

                {/* Engaged Engineer Section (Retainer) */}
                {sowFormData.engagementType === 'Retainer' && (
                  <section className="border-b pb-6">
                    <h2 className="text-xl font-semibold mb-4">Engaged Engineer</h2>
                    {sowFormData.engagedEngineers.map((engineer, index) => {
                      const billingType = engineer.billingType || 'Monthly';
                      const isHourly = billingType === 'Hourly';
                      
                      return (
                        <div key={index} className="mb-4 p-4 border rounded-lg">
                          {!isHourly ? (
                            // Monthly billing - all fields in one row (6 columns)
                            <div className="grid grid-cols-6 gap-4">
                              <div>
                                <Label>
                                  Engineer Level <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  value={engineer.engineerLevel}
                                  onChange={(e) => updateEngagedEngineer(index, 'engineerLevel', e.target.value)}
                                  className={sowValidationErrors[`engineerLevel_${index}`] ? 'border-red-500' : ''}
                                  placeholder="e.g., Middle Backend"
                                />
                              </div>
                              <div>
                                <Label>
                                  Start Date <span className="text-red-500">*</span>
                                </Label>
                                <DateInput
                                  value={engineer.startDate}
                                  onChange={(value) => updateEngagedEngineer(index, 'startDate', value)}
                                  min={minDateStr}
                                  max={maxDateStr}
                                  className={sowValidationErrors[`engineerStartDate_${index}`] ? 'border-red-500' : ''}
                                />
                              </div>
                              <div>
                                <Label>
                                  End Date <span className="text-red-500">*</span>
                                </Label>
                                <DateInput
                                  value={engineer.endDate}
                                  onChange={(value) => updateEngagedEngineer(index, 'endDate', value)}
                                  min={engineer.startDate ? (new Date(engineer.startDate) > new Date(minDateStr) ? engineer.startDate : minDateStr) : minDateStr}
                                  max={maxDateStr}
                                  className={sowValidationErrors[`engineerEndDate_${index}`] ? 'border-red-500' : ''}
                                />
                                {sowValidationErrors[`engineerEndDate_${index}`] && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {engineer.startDate && engineer.endDate && new Date(engineer.endDate) < new Date(engineer.startDate)
                                      ? 'End Date must be on or after Start Date'
                                      : 'End Date is required'}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label>
                                  Billing Type <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                  value={billingType}
                                  onValueChange={(value) => updateEngagedEngineer(index, 'billingType', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Hourly">Hourly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>
                                  Rating (%) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  value={engineer.rating ? `${engineer.rating}%` : ''}
                                  onChange={(e) => {
                                    const value = e.target.value.replace('%', '').trim();
                                    const rating = value === '' ? 0 : parseFloat(value) || 0;
                                    updateEngagedEngineer(index, 'rating', rating);
                                  }}
                                  className={sowValidationErrors[`engineerRating_${index}`] ? 'border-red-500' : ''}
                                  placeholder="100%"
                                />
                              </div>
                              <div>
                                <Label>
                                  Salary (¥/month) <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                  <Input
                                    type="text"
                                    value={formatCurrency(engineer.salary)}
                                    onChange={(e) => {
                                      const rawValue = e.target.value.replace(/¥|,/g, '').trim();
                                      // Only allow up to 9 digits
                                      if (rawValue === '' || /^\d{0,9}$/.test(rawValue)) {
                                        const salary = rawValue === '' ? 0 : parseFloat(rawValue) || 0;
                                        updateEngagedEngineer(index, 'salary', salary);
                                      }
                                    }}
                                    className={`pl-8 ${sowValidationErrors[`engineerSalary_${index}`] ? 'border-red-500' : ''}`}
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Hourly billing - all fields in one row (7 columns)
                            <div className="grid grid-cols-7 gap-4">
                              <div>
                                <Label>
                                  Engineer Level <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  value={engineer.engineerLevel}
                                  onChange={(e) => updateEngagedEngineer(index, 'engineerLevel', e.target.value)}
                                  className={sowValidationErrors[`engineerLevel_${index}`] ? 'border-red-500' : ''}
                                  placeholder="e.g., Middle Backend"
                                />
                              </div>
                              <div>
                                <Label>
                                  Start Date <span className="text-red-500">*</span>
                                </Label>
                                <DateInput
                                  value={engineer.startDate}
                                  onChange={(value) => updateEngagedEngineer(index, 'startDate', value)}
                                  min={minDateStr}
                                  max={maxDateStr}
                                  className={sowValidationErrors[`engineerStartDate_${index}`] ? 'border-red-500' : ''}
                                />
                              </div>
                              <div>
                                <Label>
                                  End Date <span className="text-red-500">*</span>
                                </Label>
                                <DateInput
                                  value={engineer.endDate}
                                  onChange={(value) => updateEngagedEngineer(index, 'endDate', value)}
                                  min={engineer.startDate ? (new Date(engineer.startDate) > new Date(minDateStr) ? engineer.startDate : minDateStr) : minDateStr}
                                  max={maxDateStr}
                                  className={sowValidationErrors[`engineerEndDate_${index}`] ? 'border-red-500' : ''}
                                />
                                {sowValidationErrors[`engineerEndDate_${index}`] && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {engineer.startDate && engineer.endDate && new Date(engineer.endDate) < new Date(engineer.startDate)
                                      ? 'End Date must be on or after Start Date'
                                      : 'End Date is required'}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label>
                                  Billing Type <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                  value={billingType}
                                  onValueChange={(value) => updateEngagedEngineer(index, 'billingType', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Hourly">Hourly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>
                                  Hourly Rate (¥/h) <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                  <Input
                                    type="text"
                                    value={formatCurrency(engineer.hourlyRate || 0)}
                                    onChange={(e) => {
                                      const rawValue = e.target.value.replace(/¥|,/g, '').trim();
                                      // Only allow up to 9 digits
                                      if (rawValue === '' || /^\d{0,9}$/.test(rawValue)) {
                                        const hourlyRate = rawValue === '' ? 0 : parseFloat(rawValue) || 0;
                                        updateEngagedEngineer(index, 'hourlyRate', hourlyRate);
                                      }
                                    }}
                                    className={`pl-8 ${sowValidationErrors[`engineerHourlyRate_${index}`] ? 'border-red-500' : ''}`}
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>
                                  Hours <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  type="number"
                                  value={engineer.hours || ''}
                                  onChange={(e) => {
                                    const hours = parseFloat(e.target.value) || 0;
                                    updateEngagedEngineer(index, 'hours', hours);
                                  }}
                                  className={sowValidationErrors[`engineerHours_${index}`] ? 'border-red-500' : ''}
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
                                    value={formatCurrency(engineer.subtotal || 0)}
                                    disabled
                                    className="pl-8 bg-gray-50"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {sowFormData.engagedEngineers.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEngagedEngineer(index)}
                              className="mt-2"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </div>
                      );
                    })}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addEngagedEngineer}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Engineer
                    </Button>
                  </section>
                )}

                {/* Milestone Deliverables Section (Fixed Price) */}
                {sowFormData.engagementType === 'Fixed Price' && (
                  <section className="border-b pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Milestone Deliverables</h2>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addMilestoneDeliverable}
                      >
                        +
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Milestone</th>
                            <th className="border border-gray-300 p-2 text-left">Delivery note</th>
                            <th className="border border-gray-300 p-2 text-left">Acceptance Criteria</th>
                            <th className="border border-gray-300 p-2 text-left">Planned End</th>
                            <th className="border border-gray-300 p-2 text-left">Payment (%)</th>
                            <th className="border border-gray-300 p-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sowFormData.milestoneDeliverables.map((milestone, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 p-2">
                                <Input
                                  value={milestone.milestone}
                                  onChange={(e) => updateMilestoneDeliverable(index, 'milestone', e.target.value)}
                                  placeholder="e.g., Kickoff"
                                />
                              </td>
                              <td className="border border-gray-300 p-2">
                                <Input
                                  value={milestone.deliveryNote}
                                  onChange={(e) => updateMilestoneDeliverable(index, 'deliveryNote', e.target.value)}
                                  placeholder="e.g., Setup environment, project plan"
                                />
                              </td>
                              <td className="border border-gray-300 p-2">
                                <Input
                                  value={milestone.acceptanceCriteria}
                                  onChange={(e) => updateMilestoneDeliverable(index, 'acceptanceCriteria', e.target.value)}
                                  placeholder="e.g., Client sign-off on plan"
                                />
                              </td>
                              <td className="border border-gray-300 p-2">
                                <DateInput
                                  value={milestone.plannedEnd}
                                  onChange={(value) => updateMilestoneDeliverable(index, 'plannedEnd', value)}
                                />
                              </td>
                              <td className="border border-gray-300 p-2">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={milestone.paymentPercentage || ''}
                                  onChange={(e) => updateMilestoneDeliverable(index, 'paymentPercentage', parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </td>
                              <td className="border border-gray-300 p-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMilestoneDeliverable(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Billing Details Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Billing details</h2>
                  <div className="overflow-x-auto">
                    {sowFormData.engagementType === 'Retainer' ? (
                      <>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">
                                  Payment Date <span className="text-red-500">*</span>
                                </th>
                                <th className="border border-gray-300 p-2 text-left">
                                  Delivery note <span className="text-red-500">*</span>
                                </th>
                                <th className="border border-gray-300 p-2 text-left">
                                  Amount <span className="text-red-500">*</span>
                                </th>
                                <th className="border border-gray-300 p-2 text-left">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sowFormData.billingDetails.map((detail, index) => (
                                <tr key={index}>
                                  <td className="border border-gray-300 p-2">
                                    <DateInput
                                      value={detail.paymentDate}
                                      onChange={(value) => updateBillingDetail(index, 'paymentDate', value)}
                                      className={sowValidationErrors[`billingPaymentDate_${index}`] ? 'border-red-500' : ''}
                                    />
                                  </td>
                                  <td className="border border-gray-300 p-2">
                                    <Input
                                      value={detail.deliveryNote}
                                      onChange={(e) => updateBillingDetail(index, 'deliveryNote', e.target.value)}
                                      className={sowValidationErrors[`billingDeliveryNote_${index}`] ? 'border-red-500' : ''}
                                      placeholder="e.g., 2 Middle Backend(100%)"
                                    />
                                  </td>
                                  <td className="border border-gray-300 p-2">
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                      <Input
                                        type="text"
                                        value={formatCurrency(detail.amount)}
                                        onChange={(e) => {
                                          const rawValue = e.target.value.replace(/¥|,/g, '').trim();
                                          // Only allow up to 9 digits
                                          if (rawValue === '' || /^\d{0,9}$/.test(rawValue)) {
                                            const amount = rawValue === '' ? 0 : parseFloat(rawValue) || 0;
                                            updateBillingDetail(index, 'amount', amount);
                                          }
                                        }}
                                        className={`pl-8 ${sowValidationErrors[`billingAmount_${index}`] ? 'border-red-500' : ''}`}
                                        placeholder="0"
                                      />
                                    </div>
                                  </td>
                                  <td className="border border-gray-300 p-2">
                                    {sowFormData.billingDetails.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeBillingDetail(index)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addBillingDetail}
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Billing Detail
                        </Button>
                      </>
                    ) : (
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Billing name</th>
                            <th className="border border-gray-300 p-2 text-left">Milestone</th>
                            <th className="border border-gray-300 p-2 text-left">Amount</th>
                            <th className="border border-gray-300 p-2 text-left">%</th>
                            <th className="border border-gray-300 p-2 text-left">Invoice Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sowFormData.billingDetails.map((detail, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 p-2">{detail.billingName}</td>
                              <td className="border border-gray-300 p-2">{detail.milestone}</td>
                              <td className="border border-gray-300 p-2">{formatCurrency(detail.amount)}</td>
                              <td className="border border-gray-300 p-2">{detail.percentage}%</td>
                              <td className="border border-gray-300 p-2">{detail.paymentDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </section>

                {/* Attachments Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Attachments</h2>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = Array.from(e.dataTransfer.files || []);
                      addSowAttachments(files);
                    }}
                  >
                    <input
                      type="file"
                      id="sow-file-upload"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handleSOWFileUpload}
                    />
                    <label htmlFor="sow-file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Click or Drag & Drop PDF here (max 1 file)</p>
                    </label>
                  </div>
                  {sowFormData.attachments && sowFormData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {sowFormData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSOWFileRemove(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Internal Review Workflow Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">Internal Review Workflow</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sow-reviewer">Assign Reviewer</Label>
                    <Select
                        value={sowFormData.reviewerId?.toString() || ''}
                        onValueChange={(value) => {
                          const selectedReviewerId = parseInt(value);
                          const currentUserId = Number(user?.id);
                          const isSameUser = Number(selectedReviewerId) === currentUserId && selectedReviewerId !== 0 && currentUserId !== 0;
                          setSowFormData(prev => ({
                            ...prev,
                            reviewerId: selectedReviewerId,
                            reviewAction: isSameUser ? prev.reviewAction : null,
                            reviewNotes: isSameUser ? prev.reviewNotes : '',
                          }));
                        }}
                    >
                      <SelectTrigger className={sowValidationErrors.reviewerId ? 'border-red-500' : ''}>
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
                    {sowValidationErrors.reviewerId && (
                      <p className="text-sm text-red-500 mt-1">Reviewer is required</p>
                    )}
                    </div>

                    {sowFormData.reviewerId && (() => {
                      const reviewerId = Number(sowFormData.reviewerId);
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
                      
                      return (
                        <>
                          <div>
                            <Label htmlFor="sow-reviewAction">Actions</Label>
                            <div className="relative">
                              {!isReviewerCurrentUser && (
                                <div 
                                  className="absolute inset-0 z-50 bg-gray-100/90 cursor-not-allowed rounded-md"
                                  style={{ top: 0, height: '100%' }}
                                  onClick={(e) => e.preventDefault()}
                                  onMouseDown={(e) => e.preventDefault()}
                                />
                              )}
                              <Select
                                value={sowFormData.reviewAction || ''}
                                onValueChange={(value) => {
                                  if (isReviewerCurrentUser) {
                                    setSowFormData(prev => ({ ...prev, reviewAction: value }));
                                  }
                                }}
                                disabled={!isReviewerCurrentUser}
                              >
                                <SelectTrigger 
                                  className={!isReviewerCurrentUser ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
                                  aria-disabled={!isReviewerCurrentUser}
                                  tabIndex={!isReviewerCurrentUser ? -1 : 0}
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
                            <Label htmlFor="sow-reviewNotes">Review Notes</Label>
                            <div className="relative">
                              {!isReviewerCurrentUser && (
                                <div 
                                  className="absolute inset-0 z-50 bg-gray-100/90 cursor-not-allowed rounded-md"
                                  style={{ top: 0, height: '100%' }}
                                  onClick={(e) => e.preventDefault()}
                                  onMouseDown={(e) => e.preventDefault()}
                                />
                              )}
                              <Textarea
                                id="sow-reviewNotes"
                                placeholder="Lorem ip sum"
                                value={sowFormData.reviewNotes}
                                onChange={(e) => {
                                  if (isReviewerCurrentUser) {
                                    setSowFormData(prev => ({ ...prev, reviewNotes: e.target.value }));
                                  }
                                }}
                                disabled={!isReviewerCurrentUser}
                                readOnly={!isReviewerCurrentUser}
                                className={!isReviewerCurrentUser ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
                                rows={4}
                                style={{ pointerEvents: !isReviewerCurrentUser ? 'none' : 'auto' }}
                                tabIndex={!isReviewerCurrentUser ? -1 : 0}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </section>

                {/* Actions */}
                <section className="flex gap-4 justify-end">
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
                    onClick={() => handleSOWSubmit('save')}
                    disabled={submitting}
                    className="bg-gray-800 text-white"
                  >
                    {submitting ? 'Saving...' : 'Save Contract'}
                  </Button>
                </section>
              </form>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default function CreateMSAPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen">
        <SalesSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CreateMSAPageContent />
    </Suspense>
  );
}

