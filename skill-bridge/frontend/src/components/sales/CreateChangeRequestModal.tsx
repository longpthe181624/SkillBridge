'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Upload, Trash2, Calendar as CalendarIcon, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { createChangeRequestForSOW, CreateChangeRequestFormData, SalesUser, getSOWContractDetail, SOWContractDetail, getCurrentResources, CurrentResource, CurrentResourcesResponse } from '@/services/salesSOWContractService';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateChangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  sowContractId: number;
  engagementType?: 'Retainer' | 'Fixed Price';
  salesUsers: SalesUser[];
  token: string;
  onSuccess: () => void;
  currentUserId?: number;
}

const MAX_ATTACHMENT_FILES = 1;

export default function CreateChangeRequestModal({
  isOpen,
  onClose,
  sowContractId,
  engagementType = 'Retainer',
  salesUsers,
  token,
  onSuccess,
  currentUserId,
}: CreateChangeRequestModalProps) {
  
  // Initialize form data - use empty arrays for Fixed Price
  const getInitialFormData = (): CreateChangeRequestFormData => {
    const defaultType = engagementType === 'Fixed Price' ? 'Add Scope' : 'RESOURCE_CHANGE';
    return {
      title: '',
      type: defaultType,
      summary: '',
      effectiveFrom: '',
      effectiveUntil: '',
      references: '',
      attachments: [],
      engagedEngineers: engagementType === 'Retainer' ? [{
        engineerLevel: '',
        startDate: '',
        endDate: '',
        billingType: 'Monthly',
        hourlyRate: 0,
        hours: 0,
        subtotal: 0,
        rating: 100,
        salary: 0,
      }] : [],
      billingDetails: [], // For Retainer: billingDetails are now adjustments only, start empty (user adds as needed)
      impactAnalysis: engagementType === 'Fixed Price' ? {
        devHours: 0,
        testHours: 0,
        newEndDate: '',
        delayDuration: 0,
        additionalCost: 0,
      } : undefined,
      internalReviewerId: 0,
      comment: '',
      action: 'save',
      reviewAction: undefined,
    };
  };
  
  const [formData, setFormData] = useState<CreateChangeRequestFormData>(getInitialFormData());

  const [errors, setErrors] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t, language } = useLanguage();
  
  // Contract detail for validation
  const [contractDetail, setContractDetail] = useState<SOWContractDetail | null>(null);
  const [loadingContractDetail, setLoadingContractDetail] = useState(false);
  
  // Track sign (+ or -) for each billing adjustment (for Retainer contracts)
  const [billingSigns, setBillingSigns] = useState<{ [index: number]: '+' | '-' }>({});
  
  // Current resources (Block A - Before) for RESOURCE_CHANGE CRs
  const [currentResources, setCurrentResources] = useState<CurrentResource[]>([]);
  const [loadingCurrentResources, setLoadingCurrentResources] = useState(false);
  const [hasDraftEngineers, setHasDraftEngineers] = useState(false); // Track if user has edited engineers

  // Load contract detail when modal opens (for Fixed Price validation and Retainer current billing)
  useEffect(() => {
    if (isOpen && sowContractId && token && (engagementType === 'Fixed Price' || engagementType === 'Retainer')) {
      const loadContractDetail = async () => {
        try {
          setLoadingContractDetail(true);
          const detail = await getSOWContractDetail(sowContractId, token);
          setContractDetail(detail);
        } catch (error) {
          console.error('[CreateChangeRequestModal] Error loading contract detail:', error);
          // Don't show error to user, just log it
        } finally {
          setLoadingContractDetail(false);
        }
      };
      loadContractDetail();
    } else {
      setContractDetail(null);
    }
  }, [isOpen, engagementType, sowContractId, token]);

  // Load current resources when EffectiveFrom changes for RESOURCE_CHANGE CRs
  useEffect(() => {
    if (isOpen && 
        engagementType === 'Retainer' && 
        formData.type === 'RESOURCE_CHANGE' && 
        formData.effectiveFrom && 
        sowContractId && 
        token) {
      
      // Check if user has draft engineers (has edited)
      const hasDraft = formData.engagedEngineers.length > 0 && 
        formData.engagedEngineers.some(eng => eng.engineerLevel || eng.startDate);
      
      // If user has draft and EffectiveFrom changed, show confirm dialog
      if (hasDraft && hasDraftEngineers) {
        const shouldReload = window.confirm(
          t('sales.createChangeRequest.messages.confirmEffectiveFromChange') || 
          'Change Effective From will reset your resource changes. Continue?'
        );
        if (!shouldReload) {
          return; // User cancelled, don't reload
        }
      }
      
      const loadCurrentResources = async () => {
        try {
          setLoadingCurrentResources(true);
          const response: CurrentResourcesResponse = await getCurrentResources(
            sowContractId,
            formData.effectiveFrom,
            token
          );
          
          setCurrentResources(response.resources);
          
          // Initialize Block B (After) from Block A if form is empty or user confirmed reload
          const isInitialEmptyState = formData.engagedEngineers.length === 0 || 
            (formData.engagedEngineers.length === 1 && !formData.engagedEngineers[0]?.engineerLevel);
          
          if (isInitialEmptyState || (hasDraft && hasDraftEngineers)) {
            setFormData(prev => ({
              ...prev,
              engagedEngineers: response.resources.map(resource => {
                // Parse engineerLevelLabel to get level and role
                const parts = resource.engineerLevelLabel.split(' ');
                const level = parts[0] || '';
                const role = parts.slice(1).join(' ') || resource.role || '';
                
                return {
                  baseEngineerId: resource.baseEngineerId,
                  engineerId: resource.engineerId,
                  action: 'MODIFY' as const,  // Default action
                  level: level,
                  role: role,
                  engineerLevel: resource.engineerLevelLabel,
                  startDate: resource.startDate || '',
                  endDate: resource.endDate || null,
                  rating: resource.rating || 100,
                  salary: resource.unitRate || 0,
                };
              }),
            }));
            setHasDraftEngineers(false);
          }
        } catch (error) {
          console.error('[CreateChangeRequestModal] Error loading current resources:', error);
          setErrorMessage(t('sales.createChangeRequest.messages.failedToLoadResources') || 'Failed to load current resources');
        } finally {
          setLoadingCurrentResources(false);
        }
      };
      
      loadCurrentResources();
    } else {
      // Reset current resources when conditions not met
      setCurrentResources([]);
    }
  }, [isOpen, engagementType, formData.type, formData.effectiveFrom, sowContractId, token]);

  // Reset form data when modal opens or engagementType changes
  useEffect(() => {
    if (isOpen) {
      try {
        const defaultType = engagementType === 'Fixed Price' ? 'Add Scope' : 'RESOURCE_CHANGE';
        const newFormData: CreateChangeRequestFormData = {
          title: '',
          type: defaultType as any,
          summary: '',
          effectiveFrom: '',
          effectiveUntil: '',
          references: '',
          attachments: [],
          engagedEngineers: engagementType === 'Retainer' ? [{
            engineerLevel: '',
            startDate: '',
            endDate: '',
            rating: 100,
            salary: 0,
          }] : [],
          billingDetails: [], // For Retainer: billingDetails are now adjustments only, start empty (user adds as needed)
          impactAnalysis: engagementType === 'Fixed Price' ? {
            devHours: 0,
            testHours: 0,
            newEndDate: '',
            delayDuration: 0,
            additionalCost: 0,
          } : undefined,
          internalReviewerId: 0,
          comment: '',
          action: 'save',
        };
        setFormData(newFormData);
        setErrors({});
        setErrorMessage('');
        setBillingSigns({}); // Reset billing signs when modal opens
        setCurrentResources([]); // Reset current resources
        setHasDraftEngineers(false); // Reset draft flag
      } catch (error) {
        console.error('[CreateChangeRequestModal] Error resetting form data:', error);
      }
    }
  }, [isOpen, engagementType]);

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

  // Format date helper (YYYY-MM-DD to YYYY/MM/DD for display)
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return '';
    return dateStr.replace(/-/g, '/');
  };

  // Parse date helper (YYYY/MM/DD to YYYY-MM-DD)
  const parseDate = (dateStr: string): string => {
    if (!dateStr) return '';
    return dateStr.replace(/\//g, '-');
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      const newErrors: {[key: string]: boolean} = {};
      let isValid = true;

      if (!formData.title || formData.title.trim().length === 0) {
        newErrors.title = true;
        isValid = false;
      }

      if (!formData.type) {
        newErrors.type = true;
        isValid = false;
      }

      if (!formData.summary || formData.summary.trim().length === 0) {
        newErrors.summary = true;
        isValid = false;
      }

      if (!formData.effectiveFrom) {
        newErrors.effectiveFrom = true;
        isValid = false;
      }

      if (!formData.effectiveUntil) {
        newErrors.effectiveUntil = true;
        isValid = false;
      }

      // Validate effective until > effective from
      if (formData.effectiveFrom && formData.effectiveUntil) {
        const fromDate = new Date(formData.effectiveFrom);
        const untilDate = new Date(formData.effectiveUntil);
        if (untilDate <= fromDate) {
          newErrors.effectiveUntil = true;
          isValid = false;
        }
      }

      // Validate engaged engineers (only for Retainer RESOURCE_CHANGE)
      if (engagementType === 'Retainer' && formData.type === 'RESOURCE_CHANGE') {
        // Filter out REMOVED engineers for validation
        const activeEngineers = formData.engagedEngineers.filter(eng => eng.action !== 'REMOVE');
        
        if (!activeEngineers || activeEngineers.length === 0) {
          newErrors.engagedEngineers = true;
          isValid = false;
        } else {
          formData.engagedEngineers.forEach((engineer, index) => {
            // Skip validation for REMOVED engineers
            if (engineer.action === 'REMOVE') {
              return;
            }
            
            // Validate engineerLevel (required)
            if (!engineer.engineerLevel || engineer.engineerLevel.trim().length === 0) {
              newErrors[`engineerLevel_${index}`] = true;
              isValid = false;
            }
            
            // Validate start date
            if (!engineer.startDate) {
              newErrors[`engineerStartDate_${index}`] = true;
              isValid = false;
            } else {
              // Validate start date >= contract start date
              if (contractDetail?.effectiveStart) {
                const startDate = new Date(engineer.startDate);
                const contractStart = new Date(contractDetail.effectiveStart);
                if (startDate < contractStart) {
                  newErrors[`engineerStartDate_${index}`] = true;
                  isValid = false;
                }
              }
            }
            
            // Validate end date (optional, but if provided, must be >= start date)
            if (engineer.endDate) {
              if (engineer.startDate) {
                const startDate = new Date(engineer.startDate);
                const endDate = new Date(engineer.endDate);
                if (endDate < startDate) {
                  newErrors[`engineerEndDate_${index}`] = true;
                  isValid = false;
                }
              }
            }
            
            // Validate rating (0-100)
            if (engineer.rating === null || engineer.rating === undefined || 
                engineer.rating < 0 || engineer.rating > 100) {
              newErrors[`engineerRating_${index}`] = true;
              isValid = false;
            }
            
            // Validate salary (> 0)
            if (!engineer.salary || engineer.salary <= 0) {
              newErrors[`engineerSalary_${index}`] = true;
              isValid = false;
            }
          });
          
          // At least one non-removed engineer required
          if (activeEngineers.length === 0) {
            newErrors.engagedEngineers = true;
            isValid = false;
          }
        }
      } else if (engagementType === 'Retainer') {
        // For non-RESOURCE_CHANGE Retainer CRs, keep old validation
        if (!formData.engagedEngineers || formData.engagedEngineers.length === 0) {
          newErrors.engagedEngineers = true;
          isValid = false;
        } else {
          formData.engagedEngineers.forEach((engineer, index) => {
            if (!engineer.engineerLevel || engineer.engineerLevel.trim().length === 0) {
              newErrors[`engineerLevel_${index}`] = true;
              isValid = false;
            }
            if (!engineer.startDate) {
              newErrors[`engineerStartDate_${index}`] = true;
              isValid = false;
            }
            if (engineer.endDate && engineer.startDate) {
              const startDate = new Date(engineer.startDate);
              const endDate = new Date(engineer.endDate);
              if (endDate <= startDate) {
                newErrors[`engineerEndDate_${index}`] = true;
                isValid = false;
              }
            }
            if (engineer.rating < 0 || engineer.rating > 100) {
              newErrors[`engineerRating_${index}`] = true;
              isValid = false;
            }
            if (engineer.salary <= 0) {
              newErrors[`engineerSalary_${index}`] = true;
              isValid = false;
            }
          });
        }
      }

      // Validate billing adjustments (only for Retainer)
      // Note: Billing adjustments are optional - user may not need to adjust billing
      // But if user adds adjustments, they must be valid
      if (engagementType === 'Retainer' && formData.billingDetails && formData.billingDetails.length > 0) {
        formData.billingDetails.forEach((billing, index) => {
          if (!billing.paymentDate) {
            newErrors[`billingPaymentDate_${index}`] = true;
            isValid = false;
          }
          if (!billing.deliveryNote || billing.deliveryNote.trim().length === 0) {
            newErrors[`billingDeliveryNote_${index}`] = true;
            isValid = false;
          }
          // Adjustment amount can be positive or negative, but not zero
          if (billing.amount === 0) {
            newErrors[`billingAmount_${index}`] = true;
            isValid = false;
          }
        });
      }

      // Validate impact analysis (only for Fixed Price)
      if (engagementType === 'Fixed Price') {
        if (!formData.impactAnalysis) {
          newErrors.impactAnalysis = true;
          isValid = false;
        } else {
          if (!formData.impactAnalysis.devHours || formData.impactAnalysis.devHours <= 0) {
            newErrors.devHours = true;
            isValid = false;
          }
          if (!formData.impactAnalysis.testHours || formData.impactAnalysis.testHours <= 0) {
            newErrors.testHours = true;
            isValid = false;
          }
          if (!formData.impactAnalysis.newEndDate) {
            newErrors.newEndDate = true;
            isValid = false;
          }
          if (!formData.impactAnalysis.delayDuration || formData.impactAnalysis.delayDuration <= 0) {
            newErrors.delayDuration = true;
            isValid = false;
          }
          
          // Validate additionalCost
          // For "Remove Scope", additionalCost can be negative (refund)
          // For other types, additionalCost must be positive
          if (formData.type === 'Remove Scope') {
            // For Remove Scope, additionalCost should be negative (refund)
            if (!formData.impactAnalysis.additionalCost || formData.impactAnalysis.additionalCost >= 0) {
              newErrors.additionalCost = true;
              isValid = false;
            } else {
              // Validate refund amount < total remaining billing details
              const refundAmount = Math.abs(formData.impactAnalysis.additionalCost);
              
              // Get today's date in YYYY-MM-DD format (without time)
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
              
              // Calculate total of remaining billing details (only future invoices, not past/paid ones)
              let totalRemaining = 0;
              if (contractDetail?.billingDetails) {
                for (const billing of contractDetail.billingDetails) {
                  if (billing.invoiceDate && billing.amount) {
                    // Parse invoiceDate (format: YYYY-MM-DD)
                    const invoiceDateStr = billing.invoiceDate.split('T')[0]; // Remove time if present
                        
                    // Only count billing details with invoiceDate in the future (not past/paid)
                    // Compare as strings to avoid timezone issues
                    if (invoiceDateStr > todayStr) {
                      totalRemaining += billing.amount;
                    }
                  }
                }
              }
              
              // Refund amount must be less than total remaining
              if (refundAmount >= totalRemaining) {
                newErrors.additionalCost = true;
                isValid = false;
              }
            }
          } else {
            // For other types, additionalCost must be positive
            if (!formData.impactAnalysis.additionalCost || formData.impactAnalysis.additionalCost <= 0) {
              newErrors.additionalCost = true;
              isValid = false;
            }
          }
        }
      }

      if (!formData.internalReviewerId || formData.internalReviewerId === 0) {
        newErrors.internalReviewerId = true;
        isValid = false;
      }

      setErrors(newErrors);
      return isValid;
    } catch (error) {
      console.error('[CreateChangeRequestModal] Error in validateForm:', error);
      return false;
    }
  };

  // Helper function to check if engineer has changes compared to current resource
  const hasEngineerChanged = (engineer: typeof formData.engagedEngineers[0]): boolean => {
    // If action is REMOVE, always include it
    if (engineer.action === 'REMOVE') {
      return true;
    }
    
    // If action is ADD (new engineer), always include it
    if (engineer.action === 'ADD' || (engineer.baseEngineerId === null && engineer.engineerId === null)) {
      return true;
    }
    
    // If engineer has baseEngineerId, compare with current resource
    if (engineer.baseEngineerId !== null && engineer.baseEngineerId !== undefined) {
      const currentResource = currentResources.find(
        res => res.baseEngineerId === engineer.baseEngineerId
      );
      
      if (!currentResource) {
        // If not found in current resources, consider it changed
        return true;
      }
      
      // Compare all fields
      const parts = currentResource.engineerLevelLabel.split(' ');
      const currentLevel = parts[0] || '';
      const currentRole = parts.slice(1).join(' ') || currentResource.role || '';
      
      const engineerLevel = engineer.level || '';
      const engineerRole = engineer.role || '';
      
      // Normalize dates for comparison (remove time if present)
      const normalizeDate = (date: string | null | undefined): string => {
        if (!date) return '';
        return date.split('T')[0]; // Get YYYY-MM-DD part only
      };
      
      const currentStartDate = normalizeDate(currentResource.startDate);
      const currentEndDate = normalizeDate(currentResource.endDate);
      const engineerStartDate = normalizeDate(engineer.startDate);
      const engineerEndDate = normalizeDate(engineer.endDate);
      
      // Check if any field has changed
      if (engineerLevel !== currentLevel || 
          engineerRole !== currentRole ||
          engineerStartDate !== currentStartDate ||
          engineerEndDate !== currentEndDate ||
          Math.abs((engineer.rating || 0) - (currentResource.rating || 0)) > 0.01 ||
          Math.abs((engineer.salary || 0) - (currentResource.unitRate || 0)) > 0.01) {
        return true; // Has changes
      }
      
      return false; // No changes
    }
    
    // If no baseEngineerId but has engineerId, consider it changed (shouldn't happen normally)
    return true;
  };

  // Handle submit
  const handleSubmit = async (action: 'save' | 'submit') => {
    setErrorMessage('');
    
    if (action === 'submit' && !validateForm()) {
      setErrorMessage(t('sales.createChangeRequest.messages.fillRequiredFields'));
      return;
    }

    setLoading(true);
    try {
      // Filter out engineers with baseEngineerId that haven't changed (unless REMOVE)
      const filteredEngineers = formData.engagedEngineers.filter(engineer => {
        // Always include REMOVE actions
        if (engineer.action === 'REMOVE') {
          return true;
        }
        
        // Always include ADD actions (new engineers)
        if (engineer.action === 'ADD' || (engineer.baseEngineerId === null && engineer.engineerId === null)) {
          return true;
        }
        
        // For MODIFY actions, only include if there are actual changes
        return hasEngineerChanged(engineer);
      });
      
      const submitData: CreateChangeRequestFormData = {
        ...formData,
        engagedEngineers: filteredEngineers,
        action,
      };
      
      await createChangeRequestForSOW(sowContractId, submitData, token);
      onSuccess();
      handleCancel();
    } catch (error: any) {
      setErrorMessage(error.message || t('sales.createChangeRequest.messages.createError'));
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      title: '',
      type: engagementType === 'Fixed Price' ? 'Add Scope' : 'RESOURCE_CHANGE',
      summary: '',
      effectiveFrom: '',
      effectiveUntil: '',
      references: '',
      attachments: [],
      engagedEngineers: engagementType === 'Retainer' ? [{
        engineerLevel: '',
        startDate: '',
        endDate: '',
        rating: 100,
        salary: 0,
      }] : [],
      billingDetails: [], // For Retainer: billingDetails are now adjustments only, start empty (user adds as needed)
      impactAnalysis: engagementType === 'Fixed Price' ? {
        devHours: 0,
        testHours: 0,
        newEndDate: '',
        delayDuration: 0,
        additionalCost: 0,
      } : undefined,
      internalReviewerId: 0,
      comment: '',
      action: 'save',
      reviewAction: undefined,
    });
    setErrors({});
    setErrorMessage('');
    setBillingSigns({}); // Reset billing signs when canceling
    onClose();
  };
  
  console.log('[CreateChangeRequestModal] After handleCancel definition');

  // Add engaged engineer
  const addEngagedEngineer = () => {
    setFormData(prev => ({
      ...prev,
      engagedEngineers: [...prev.engagedEngineers, {
        baseEngineerId: null,
        engineerId: null,
        action: 'ADD' as const,
        level: '',
        role: '',
        engineerLevel: '',
        startDate: formData.effectiveFrom || '',
        endDate: contractDetail?.effectiveEnd || null,
        billingType: 'Monthly',
        hourlyRate: 0,
        hours: 0,
        subtotal: 0,
        rating: 100,
        salary: 0,
      }],
    }));
    setHasDraftEngineers(true);
  };

  // Remove engaged engineer
  const removeEngagedEngineer = (index: number) => {
    const engineer = formData.engagedEngineers[index];
    
    // If engineer has engineerId (exists in current state), mark as REMOVE
    if (engineer.engineerId !== null && engineer.engineerId !== undefined) {
      // Calculate endDate = EffectiveFrom - 1 day
      const effectiveFromDate = formData.effectiveFrom ? new Date(formData.effectiveFrom) : new Date();
      effectiveFromDate.setDate(effectiveFromDate.getDate() - 1);
      const endDateStr = effectiveFromDate.toISOString().split('T')[0];
      
      setFormData(prev => ({
        ...prev,
        engagedEngineers: prev.engagedEngineers.map((eng, i) => 
          i === index 
            ? { ...eng, action: 'REMOVE' as const, endDate: endDateStr }
            : eng
        ),
      }));
    } else {
      // New engineer (ADD), remove from array
      if (formData.engagedEngineers.length > 1) {
        setFormData(prev => ({
          ...prev,
          engagedEngineers: prev.engagedEngineers.filter((_, i) => i !== index),
        }));
      }
    }
    setHasDraftEngineers(true);
  };

  // Update engaged engineer
  const updateEngagedEngineer = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      engagedEngineers: prev.engagedEngineers.map((engineer, i) => {
        if (i === index) {
          const updated = { ...engineer, [field]: value };
          
          // If updating engineerLevel, also update level and role
          if (field === 'engineerLevel') {
            const parts = (value as string).split(' ');
            updated.level = parts[0] || '';
            updated.role = parts.slice(1).join(' ') || '';
          }
          
          // If updating level or role, update engineerLevel
          if (field === 'level' || field === 'role') {
            updated.engineerLevel = `${updated.level || ''} ${updated.role || ''}`.trim();
          }
          
          // Handle billing type changes
          if (field === 'billingType') {
            updated.billingType = value; // Ensure billingType is set
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
          
          // Auto-set action to MODIFY if engineer exists (not new ADD)
          if (engineer.engineerId !== null && engineer.engineerId !== undefined && updated.action !== 'REMOVE') {
            updated.action = 'MODIFY';
          }
          
          return updated;
        }
        return engineer;
      }),
    }));
    setHasDraftEngineers(true);
    
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`engineer${field}_${index}`];
      return newErrors;
    });
  };

  // Add billing detail
  const addBillingDetail = () => {
    const newIndex = formData.billingDetails.length;
    setFormData(prev => ({
      ...prev,
      billingDetails: [...prev.billingDetails, {
        paymentDate: '',
        deliveryNote: '',
        amount: 0,
      }],
    }));
    // Set default sign to '+' for new billing detail
    setBillingSigns(prev => ({
      ...prev,
      [newIndex]: '+',
    }));
  };

  // Remove billing detail
  const removeBillingDetail = (index: number) => {
    if (formData.billingDetails.length > 1) {
      setFormData(prev => ({
        ...prev,
        billingDetails: prev.billingDetails.filter((_, i) => i !== index),
      }));
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
    }
  };

  // Update billing detail
  const updateBillingDetail = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      billingDetails: prev.billingDetails.map((billing, i) => 
        i === index ? { ...billing, [field]: value } : billing
      ),
    }));
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`billing${field}_${index}`];
      return newErrors;
    });
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== files.length) {
      setErrorMessage(t('sales.createChangeRequest.messages.onlyPdf'));
      e.target.value = '';
      return;
    }

    // Check file size (10MB limit)
    const oversizedFiles = pdfFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrorMessage(t('sales.createChangeRequest.messages.fileSizeLimit'));
      e.target.value = '';
      return;
    }

    setFormData(prev => {
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
        setErrorMessage('');
      }

      return {
        ...prev,
        attachments: [...current, ...filesToAdd],
      };
    });

    e.target.value = '';
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index),
    }));
  };

  // Filter sales managers for reviewer dropdown
  const salesManagers: SalesUser[] = React.useMemo(() => {
    try {
      if (salesUsers && salesUsers.length > 0) {
        const filtered = salesUsers.filter(u => {
          const role = u.role?.toUpperCase();
          return role === 'SALES_MANAGER';
        });
        return filtered;
      } else {
        return [];
      }
    } catch (error) {
      console.error('[CreateChangeRequestModal] Error filtering sales managers:', error);
      return [];
    }
  }, [salesUsers]);
  
  // Early return if modal is closed
  if (!isOpen) {
    return null;
  }

  // Render modal directly (same pattern as CreateMSAChangeRequestModal and SalesChangeRequestDetailModal)
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">{t('sales.createChangeRequest.title')}</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); }}>
          {/* Overview Section */}
          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.overview')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">
                  {t('sales.createChangeRequest.fields.crTitle')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    setErrors(prev => ({ ...prev, title: false }));
                  }}
                  className={errors.title ? 'border-red-500' : ''}
                  placeholder={t('sales.createChangeRequest.placeholders.crTitle')}
                />
              </div>
              <div>
                <Label htmlFor="type">
                  {t('sales.createChangeRequest.fields.crType')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  key={`cr-type-select-${engagementType}-${isOpen}`}
                  value={formData.type || (engagementType === 'Fixed Price' ? 'Add Scope' : 'RESOURCE_CHANGE')}
                  onValueChange={async (value) => {
                    const newType = value as any;
                    
                    // If switching to RESOURCE_CHANGE for Retainer, load contract detail
                    if (engagementType === 'Retainer' && newType === 'RESOURCE_CHANGE' && sowContractId && token && !contractDetail) {
                      try {
                        setLoadingContractDetail(true);
                        const detail = await getSOWContractDetail(sowContractId, token);
                        setContractDetail(detail);
                        
                        // Populate engagedEngineers and billingDetails from contract
                        if (detail) {
                          const engineers = detail.engagedEngineers || [];
                          const billing = detail.billingDetails || [];
                          
                          setFormData(prev => {
                            // Reset additionalCost when type changes
                            let newAdditionalCost = prev.impactAnalysis?.additionalCost || 0;
                            
                            // If switching to/from Remove Scope, reset additionalCost
                            if ((prev.type === 'Remove Scope' && newType !== 'Remove Scope') ||
                                (prev.type !== 'Remove Scope' && newType === 'Remove Scope')) {
                              newAdditionalCost = 0;
                            }
                            
                            return {
                              ...prev,
                              type: newType,
                              engagedEngineers: engineers.length > 0 ? engineers.map(eng => ({
                                engineerLevel: eng.engineerLevel || '',
                                startDate: eng.startDate || '',
                                endDate: eng.endDate || '',
                                rating: eng.rating || 100,
                                salary: eng.salary || 0,
                              })) : prev.engagedEngineers,
                              // Don't populate billingDetails from contract - they are now adjustments only
                              // billingDetails should remain empty or user-entered adjustments
                              billingDetails: prev.billingDetails.length > 0 ? prev.billingDetails : [],
                              impactAnalysis: prev.impactAnalysis ? {
                                ...prev.impactAnalysis,
                                additionalCost: newAdditionalCost,
                              } : prev.impactAnalysis,
                            };
                          });
                        }
                      } catch (error) {
                        console.error('[CreateChangeRequestModal] Error loading contract detail:', error);
                      } finally {
                        setLoadingContractDetail(false);
                      }
                    } else {
                      // For other types, just update type
                      setFormData(prev => {
                        // Reset additionalCost when type changes
                        let newAdditionalCost = prev.impactAnalysis?.additionalCost || 0;
                        
                        // If switching to/from Remove Scope, reset additionalCost
                        if ((prev.type === 'Remove Scope' && newType !== 'Remove Scope') ||
                            (prev.type !== 'Remove Scope' && newType === 'Remove Scope')) {
                          newAdditionalCost = 0;
                        }
                        
                        return {
                          ...prev,
                          type: newType,
                          impactAnalysis: prev.impactAnalysis ? {
                            ...prev.impactAnalysis,
                            additionalCost: newAdditionalCost,
                          } : prev.impactAnalysis,
                        };
                      });
                    }
                    setErrors(prev => ({ ...prev, type: false, additionalCost: false }));
                  }}
                >
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('sales.createChangeRequest.placeholders.selectCrType')} />
                  </SelectTrigger>
                  <SelectContent className="z-[10000]">
                    {engagementType === 'Retainer' ? (
                      <>
                        <SelectItem value="RESOURCE_CHANGE">Resource Change</SelectItem>
                        <SelectItem value="SCHEDULE_CHANGE">Schedule Change</SelectItem>
                        <SelectItem value="SCOPE_ADJUSTMENT">Scope Adjustment</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Add Scope">{t('sales.createChangeRequest.crType.addScope')}</SelectItem>
                        <SelectItem value="Remove Scope">{t('sales.createChangeRequest.crType.removeScope')}</SelectItem>
                        <SelectItem value="Other">{t('sales.createChangeRequest.crType.other')}</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500 mt-1">{t('sales.createChangeRequest.messages.required')}</p>
                )}
              </div>
              <div>
                <Label htmlFor="effectiveFrom">
                  {t('sales.createChangeRequest.fields.effectiveFrom')} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="effectiveFrom"
                    type="date"
                    value={formData.effectiveFrom}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, effectiveFrom: e.target.value }));
                      setErrors(prev => ({ ...prev, effectiveFrom: false }));
                    }}
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
                    className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors.effectiveFrom ? 'border-red-500' : ''}`}
                    lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('effectiveFrom') as HTMLInputElement;
                      if (input && 'showPicker' in input) {
                        input.showPicker();
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    <CalendarIcon size={18} />
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="effectiveUntil">
                  {t('sales.createChangeRequest.fields.effectiveUntil')} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="effectiveUntil"
                    type="date"
                    value={formData.effectiveUntil}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, effectiveUntil: e.target.value }));
                      setErrors(prev => ({ ...prev, effectiveUntil: false }));
                    }}
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
                    className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors.effectiveUntil ? 'border-red-500' : ''}`}
                    lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('effectiveUntil') as HTMLInputElement;
                      if (input && 'showPicker' in input) {
                        input.showPicker();
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    <CalendarIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Change Summary Section */}
          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.changeSummary')}</h3>
            <div>
              <Label htmlFor="summary">
                {t('sales.createChangeRequest.fields.changeSummary')} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, summary: e.target.value }));
                  setErrors(prev => ({ ...prev, summary: false }));
                }}
                className={errors.summary ? 'border-red-500' : ''}
                placeholder={t('sales.createChangeRequest.placeholders.changeSummary')}
                rows={4}
              />
            </div>
          </section>

          {/* References Section */}
          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.references')}</h3>
            <div>
              <Label htmlFor="references">{t('sales.createChangeRequest.fields.references')}</Label>
              <Input
                id="references"
                value={formData.references}
                onChange={(e) => setFormData(prev => ({ ...prev, references: e.target.value }))}
                placeholder={t('sales.createChangeRequest.placeholders.references')}
              />
            </div>
          </section>

          {/* Attachments Section */}
          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.attachments')}</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="attachments"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="attachments" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">{t('sales.createChangeRequest.attachments.uploadText')}</p>
                <p className="text-sm text-gray-400 mt-1">{t('sales.createChangeRequest.attachments.fileInfo')}</p>
              </label>
            </div>
            {formData.attachments && formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Engaged Engineer Section - Only for Retainer RESOURCE_CHANGE */}
          {engagementType === 'Retainer' && formData.type === 'RESOURCE_CHANGE' && (
          <section className="border-b pb-6">
            {/* Block A: Current Resources at Effective From (Before) */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {t('sales.createChangeRequest.sections.currentResourcesAt') || 'Current Resources at'} {formData.effectiveFrom ? new Date(formData.effectiveFrom).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '...'}
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      {t('sales.createChangeRequest.tooltips.currentResources') || 
                       `This is the current team at ${formData.effectiveFrom || 'the effective date'}, calculated from Baseline + all previously approved Change Requests.`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {loadingCurrentResources ? (
                <div className="text-gray-500 text-sm py-4">Loading current resources...</div>
              ) : currentResources.length > 0 ? (
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.engineerLevel')} *</TableHead>
                        <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.startDate')}</TableHead>
                        <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.endDate')}</TableHead>
                        <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.rating')}</TableHead>
                        <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.salary')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentResources.map((resource, index) => (
                        <TableRow key={index} className="bg-gray-50">
                          <TableCell className="text-gray-600">{resource.engineerLevelLabel}</TableCell>
                          <TableCell className="text-gray-600">
                            {resource.startDate ? new Date(resource.startDate).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {resource.endDate ? new Date(resource.endDate).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}
                          </TableCell>
                          <TableCell className="text-gray-600">{resource.rating}%</TableCell>
                          <TableCell className="text-gray-600">
                            ¥{formatCurrency(resource.unitRate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-gray-500 text-sm py-4 border rounded-lg bg-gray-50 text-center">
                  {t('sales.createChangeRequest.sections.noCurrentResources') || 'No current resources found. Please ensure Effective From date is set.'}
                </div>
              )}
            </div>

            {/* Block B: Resources After This Change Request (After) */}
            <div>
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

              {formData.engagedEngineers && formData.engagedEngineers.length > 0 ? (
                <div className="space-y-4">
                  {formData.engagedEngineers.map((engineer, index) => {
                    const isRemoved = engineer.action === 'REMOVE';
                    const isNew = engineer.action === 'ADD' && !engineer.engineerId;
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${isRemoved ? 'opacity-50 line-through bg-gray-100' : ''}`}
                      >
                        {(() => {
                          const billingType = engineer.billingType || 'Monthly';
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
                                    className={errors[`engineerLevel_${index}`] ? 'border-red-500' : ''}
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
                                      className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors[`engineerStartDate_${index}`] ? 'border-red-500' : ''}`}
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
                                      className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors[`engineerEndDate_${index}`] ? 'border-red-500' : ''}`}
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
                                    key={`billing-type-${index}-${engineer.billingType || 'Monthly'}`}
                                    value={billingType}
                                    onValueChange={(value) => {
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
                                      className={errors[`engineerRating_${index}`] ? 'border-red-500' : ''}
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
                                        className={`pl-8 ${errors[`engineerSalary_${index}`] ? 'border-red-500' : ''}`}
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
                                        value={formatCurrency(engineer.hourlyRate || 0)}
                                        onChange={(e) => {
                                          const hourlyRate = parseCurrency(e.target.value);
                                          updateEngagedEngineer(index, 'hourlyRate', hourlyRate);
                                        }}
                                        disabled={isRemoved}
                                        className={`pl-8 ${errors[`engineerHourlyRate_${index}`] ? 'border-red-500' : ''}`}
                                        placeholder="0"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Hours *</Label>
                                    <Input
                                      type="number"
                                      value={engineer.hours || ''}
                                      onChange={(e) => {
                                        const hours = parseFloat(e.target.value) || 0;
                                        updateEngagedEngineer(index, 'hours', hours);
                                      }}
                                      disabled={isRemoved}
                                      min="0"
                                      step="0.5"
                                      className={errors[`engineerHours_${index}`] ? 'border-red-500' : ''}
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
                            </>
                          );
                        })()}
                        <div className="mt-2 flex items-center justify-between">
                          {isRemoved ? (
                            <span className="text-gray-500 text-sm">{t('sales.createChangeRequest.actions.removed') || 'Removed'}</span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              {engineer.action === 'ADD' && t('sales.createChangeRequest.actions.newEngineer') || ''}
                              {engineer.action === 'MODIFY' && t('sales.createChangeRequest.actions.modified') || ''}
                            </span>
                          )}
                          {engineer.engineerId !== null && engineer.engineerId !== undefined && !isRemoved && (
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
            </div>
          </section>
          )}

          {/* Billing Section - Only for Retainer: Current Billing Schedule (read-only) + Billing Adjustments */}
          {engagementType === 'Retainer' && (
          <section className="border-b pb-6">
            {/* Section 1: Current Billing Schedule (Read-only) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                {t('sales.createChangeRequest.sections.currentBillingSchedule') || 'Current Billing Schedule (Read-only)'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {t('sales.createChangeRequest.sections.currentBillingScheduleDesc') || 'This is the baseline billing schedule of the contract. Changes should be entered in the adjustments section below.'}
              </p>
              {loadingContractDetail ? (
                <div className="text-gray-500 text-sm py-4">Loading current billing schedule...</div>
              ) : contractDetail && contractDetail.billingDetails && contractDetail.billingDetails.length > 0 ? (
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.paymentDate')}</TableHead>
                        <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.deliveryNote')}</TableHead>
                        <TableHead className="text-gray-600">{t('sales.createChangeRequest.fields.originalAmount') || 'Original Amount'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contractDetail.billingDetails.map((billing, index) => (
                        <TableRow key={index} className="bg-gray-50">
                          <TableCell className="text-gray-600">
                            {billing.invoiceDate ? formatDate(billing.invoiceDate) : '-'}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {billing.deliveryNote || '-'}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {formatCurrency(billing.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50 text-gray-500 text-sm">
                  {t('sales.createChangeRequest.sections.noCurrentBilling') || 'No current billing schedule found.'}
                </div>
              )}
            </div>

            {/* Section 2: Billing Adjustments in this Change Request */}
            <div>
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
                    {formData.billingDetails && formData.billingDetails.length > 0 ? (
                      formData.billingDetails.map((billing, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="relative flex items-center gap-2">
                              <Input
                                type="date"
                                value={billing.paymentDate}
                                onChange={(e) => updateBillingDetail(index, 'paymentDate', e.target.value)}
                                className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors[`billingPaymentDate_${index}`] ? 'border-red-500' : ''}`}
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
                              className={errors[`billingDeliveryNote_${index}`] ? 'border-red-500' : ''}
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
                                  className={`pl-8 ${errors[`billingAmount_${index}`] ? 'border-red-500' : ''}`}
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
                                onClick={() => removeBillingDetail(index)}
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
                onClick={addBillingDetail}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('sales.createChangeRequest.actions.addAdjustment') || '+ Add Adjustment'}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                {t('sales.createChangeRequest.sections.billingAdjustmentsNote') || 'These adjustments will be applied on top of the current billing schedule when this Change Request is approved.'}
              </p>
            </div>
          </section>
          )}

          {/* Impact Analysis Section - Only for Fixed Price */}
          {engagementType === 'Fixed Price' && (
          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.impactAnalysis')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="devHours">{t('sales.createChangeRequest.fields.devHours')} *</Label>
                <Input
                  id="devHours"
                  type="number"
                  value={formData.impactAnalysis?.devHours || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData(prev => ({
                      ...prev,
                      impactAnalysis: {
                        ...(prev.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                        devHours: value,
                      },
                    }));
                    setErrors(prev => ({ ...prev, devHours: false }));
                  }}
                  className={errors.devHours ? 'border-red-500' : ''}
                  placeholder={t('sales.createChangeRequest.placeholders.devHours')}
                />
                {errors.devHours && (
                  <p className="text-sm text-red-500 mt-1">{t('sales.createChangeRequest.messages.required')}</p>
                )}
              </div>
              <div>
                <Label htmlFor="testHours">{t('sales.createChangeRequest.fields.testHours')} *</Label>
                <Input
                  id="testHours"
                  type="number"
                  value={formData.impactAnalysis?.testHours || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData(prev => ({
                      ...prev,
                      impactAnalysis: {
                        ...(prev.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                        testHours: value,
                      },
                    }));
                    setErrors(prev => ({ ...prev, testHours: false }));
                  }}
                  className={errors.testHours ? 'border-red-500' : ''}
                  placeholder={t('sales.createChangeRequest.placeholders.testHours')}
                />
                {errors.testHours && (
                  <p className="text-sm text-red-500 mt-1">{t('sales.createChangeRequest.messages.required')}</p>
                )}
              </div>
              <div>
                <Label htmlFor="newEndDate">{t('sales.createChangeRequest.fields.newEndDate')} *</Label>
                <div className="relative">
                  <Input
                    id="newEndDate"
                    type="date"
                    value={formData.impactAnalysis?.newEndDate || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        impactAnalysis: {
                          ...(prev.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                          newEndDate: e.target.value,
                        },
                      }));
                      setErrors(prev => ({ ...prev, newEndDate: false }));
                    }}
                    className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors.newEndDate ? 'border-red-500' : ''}`}
                    lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('newEndDate') as HTMLInputElement;
                      if (input && 'showPicker' in input) {
                        input.showPicker();
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    <CalendarIcon size={18} />
                  </button>
                </div>
                {errors.newEndDate && (
                  <p className="text-sm text-red-500 mt-1">{t('sales.createChangeRequest.messages.required')}</p>
                )}
              </div>
              <div>
                <Label htmlFor="delayDuration">{t('sales.createChangeRequest.fields.delayDuration')} *</Label>
                <Input
                  id="delayDuration"
                  type="number"
                  value={formData.impactAnalysis?.delayDuration || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData(prev => ({
                      ...prev,
                      impactAnalysis: {
                        ...(prev.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                        delayDuration: value,
                      },
                    }));
                    setErrors(prev => ({ ...prev, delayDuration: false }));
                  }}
                  className={errors.delayDuration ? 'border-red-500' : ''}
                  placeholder={t('sales.createChangeRequest.placeholders.delayDuration')}
                />
                <span className="text-sm text-gray-500 ml-2">days</span>
                {errors.delayDuration && (
                  <p className="text-sm text-red-500 mt-1">{t('sales.createChangeRequest.messages.required')}</p>
                )}
              </div>
              <div>
                <Label htmlFor="additionalCost">
                  {formData.type === 'Remove Scope' 
                    ? t('sales.createChangeRequest.fields.refundAmount') || 'Refund Amount' 
                    : t('sales.createChangeRequest.fields.additionalCost')} *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                  <Input
                    id="additionalCost"
                    type="text"
                    value={formData.impactAnalysis?.additionalCost ? formatCurrency(Math.abs(formData.impactAnalysis.additionalCost)) : ''}
                    onChange={(e) => {
                      const inputValue = e.target.value.trim();
                      if (!inputValue) {
                        // If input is empty, set to 0
                        setFormData(prev => ({
                          ...prev,
                          impactAnalysis: {
                            ...(prev.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                            additionalCost: 0,
                          },
                        }));
                        setErrors(prev => ({ ...prev, additionalCost: false }));
                        return;
                      }
                      
                      const amount = parseCurrency(inputValue);
                      // For Remove Scope, user enters positive refund amount, but we store as negative
                      // For other types, store as positive
                      const finalAmount = formData.type === 'Remove Scope' ? -Math.abs(amount) : Math.abs(amount);
                      setFormData(prev => ({
                        ...prev,
                        impactAnalysis: {
                          ...(prev.impactAnalysis || { devHours: 0, testHours: 0, newEndDate: '', delayDuration: 0, additionalCost: 0 }),
                          additionalCost: finalAmount,
                        },
                      }));
                      setErrors(prev => ({ ...prev, additionalCost: false }));
                    }}
                    className={`pl-8 ${errors.additionalCost ? 'border-red-500' : ''}`}
                    placeholder="0"
                  />
                </div>
                {errors.additionalCost && (
                  <p className="text-sm text-red-500 mt-1">
                    {formData.type === 'Remove Scope' 
                      ? (() => {
                          // Get today's date in YYYY-MM-DD format (without time)
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                          
                          // Calculate total of remaining billing details (only future invoices, not past/paid ones)
                          let totalRemaining = 0;
                          if (contractDetail?.billingDetails) {
                            for (const billing of contractDetail.billingDetails) {
                              if (billing.invoiceDate && billing.amount) {
                                // Parse invoiceDate (format: YYYY-MM-DD)
                                const invoiceDateStr = billing.invoiceDate.split('T')[0]; // Remove time if present
                                    
                                // Only count billing details with invoiceDate in the future (not past/paid)
                                // Compare as strings to avoid timezone issues
                                if (invoiceDateStr > todayStr) {
                                  totalRemaining += billing.amount;
                                }
                              }
                            }
                          }
                          return t('sales.createChangeRequest.messages.refundExceedsRemaining') 
                            || `Refund amount must be less than remaining future billing amount (¥${totalRemaining.toLocaleString('ja-JP')})`;
                        })()
                      : t('sales.createChangeRequest.messages.required')}
                  </p>
                )}
              </div>
            </div>
          </section>
          )}

          {/* Approval & Workflow Section */}
          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.approvalWorkflow')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="internalReviewer">
                  {t('sales.createChangeRequest.fields.internalReviewer')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.internalReviewerId && formData.internalReviewerId > 0 ? formData.internalReviewerId.toString() : ''}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, internalReviewerId: parseInt(value) }));
                    setErrors(prev => ({ ...prev, internalReviewerId: false }));
                  }}
                >
                  <SelectTrigger className={errors.internalReviewerId ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('sales.createChangeRequest.placeholders.selectReviewer')} />
                  </SelectTrigger>
                  <SelectContent className="z-[10000]">
                    {salesManagers.length > 0 ? (
                      salesManagers.map(user => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.fullName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        {t('sales.createChangeRequest.messages.noReviewersAvailable') || 'No reviewers available'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.internalReviewerId && (
                  <p className="text-sm text-red-500 mt-1">{t('sales.createChangeRequest.messages.required')}</p>
                )}
                {salesManagers.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-1">
                    {t('sales.createChangeRequest.messages.noReviewersAvailable') || 'No Sales Managers found. Please check if users have the correct role.'}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="status">{t('sales.createChangeRequest.fields.status')}</Label>
                {/* Enable status field when internal reviewer is current user */}
                {currentUserId && formData.internalReviewerId === currentUserId ? (
                  <Select
                    value={formData.reviewAction || ''}
                    onValueChange={(value) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        reviewAction: value === 'APPROVE' ? 'APPROVE' : value === 'REQUEST_REVISION' ? 'REQUEST_REVISION' : undefined 
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('sales.createChangeRequest.placeholders.selectStatus')} />
                    </SelectTrigger>
                    <SelectContent className="z-[10000]">
                      <SelectItem value="APPROVE">{t('sales.createChangeRequest.status.approve')}</SelectItem>
                      <SelectItem value="REQUEST_REVISION">{t('sales.createChangeRequest.status.requestRevision')}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="status"
                    value={
                      formData.reviewAction === 'APPROVE' 
                        ? (t('sales.createChangeRequest.status.clientUnderReview') || 'Client Under Review')
                        : formData.action === 'submit' 
                        ? t('sales.createChangeRequest.status.underInternalReview') 
                        : t('sales.createChangeRequest.status.draft')
                    }
                    readOnly
                    className="bg-gray-100"
                  />
                )}
              </div>
            </div>
          </section>

          {/* Comment Section */}
          <section className="pb-6">
            <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.comment')}</h3>
            <div>
              <Label htmlFor="comment">{t('sales.createChangeRequest.fields.comment')}</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder={t('sales.createChangeRequest.placeholders.comment')}
                rows={4}
              />
            </div>
          </section>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {t('sales.createChangeRequest.actions.cancel')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit('save')}
              disabled={loading}
            >
              {loading ? t('sales.createChangeRequest.actions.saving') : t('sales.createChangeRequest.actions.save')}
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit('submit')}
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? t('sales.createChangeRequest.actions.submitting') : t('sales.createChangeRequest.actions.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

