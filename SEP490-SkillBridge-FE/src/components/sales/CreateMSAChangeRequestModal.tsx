'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Upload, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createChangeRequestForMSA, CreateMSAChangeRequestFormData, SalesUser } from '@/services/salesMSAContractService';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateMSAChangeRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    msaContractId: number;
    salesUsers: SalesUser[];
    token: string;
    onSuccess: () => void;
}

export default function CreateMSAChangeRequestModal({
                                                        isOpen,
                                                        onClose,
                                                        msaContractId,
                                                        salesUsers,
                                                        token,
                                                        onSuccess,
                                                    }: CreateMSAChangeRequestModalProps) {
    const [formData, setFormData] = useState<CreateMSAChangeRequestFormData>({
        title: '',
        type: 'Add Scope',
        summary: '',
        effectiveFrom: '',
        effectiveUntil: '',
        references: '',
        attachments: [],
        engagedEngineers: [{
            engineerLevel: '',
            startDate: '',
            endDate: '',
            rating: 100,
            salary: 0,
        }],
        billingDetails: [{
            paymentDate: '',
            deliveryNote: '',
            amount: 0,
        }],
        internalReviewerId: 0,
        comment: '',
        action: 'save',
    });

    const [errors, setErrors] = useState<{[key: string]: boolean}>({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { t, language } = useLanguage();

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

    // Validate form
    const validateForm = (): boolean => {
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

        // Validate engaged engineers
        if (formData.engagedEngineers.length === 0) {
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
                if (!engineer.endDate) {
                    newErrors[`engineerEndDate_${index}`] = true;
                    isValid = false;
                }
                // Validate end date > start date
                if (engineer.startDate && engineer.endDate) {
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

        // Validate billing details
        if (formData.billingDetails.length === 0) {
            newErrors.billingDetails = true;
            isValid = false;
        } else {
            formData.billingDetails.forEach((billing, index) => {
                if (!billing.paymentDate) {
                    newErrors[`billingPaymentDate_${index}`] = true;
                    isValid = false;
                }
                if (!billing.deliveryNote || billing.deliveryNote.trim().length === 0) {
                    newErrors[`billingDeliveryNote_${index}`] = true;
                    isValid = false;
                }
                if (billing.amount <= 0) {
                    newErrors[`billingAmount_${index}`] = true;
                    isValid = false;
                }
            });
        }

        if (!formData.internalReviewerId || formData.internalReviewerId === 0) {
            newErrors.internalReviewerId = true;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
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
            const submitData: CreateMSAChangeRequestFormData = {
                ...formData,
                action,
            };

            await createChangeRequestForMSA(msaContractId, submitData, token);
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
            type: 'Add Scope',
            summary: '',
            effectiveFrom: '',
            effectiveUntil: '',
            references: '',
            attachments: [],
            engagedEngineers: [{
                engineerLevel: '',
                startDate: '',
                endDate: '',
                rating: 100,
                salary: 0,
            }],
            billingDetails: [{
                paymentDate: '',
                deliveryNote: '',
                amount: 0,
            }],
            internalReviewerId: 0,
            comment: '',
            action: 'save',
        });
        setErrors({});
        setErrorMessage('');
        onClose();
    };

    // Add engaged engineer
    const addEngagedEngineer = () => {
        setFormData(prev => ({
            ...prev,
            engagedEngineers: [...prev.engagedEngineers, {
                engineerLevel: '',
                startDate: '',
                endDate: '',
                rating: 100,
                salary: 0,
            }],
        }));
    };

    // Remove engaged engineer
    const removeEngagedEngineer = (index: number) => {
        if (formData.engagedEngineers.length > 1) {
            setFormData(prev => ({
                ...prev,
                engagedEngineers: prev.engagedEngineers.filter((_, i) => i !== index),
            }));
        }
    };

    // Update engaged engineer
    const updateEngagedEngineer = (index: number, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            engagedEngineers: prev.engagedEngineers.map((engineer, i) =>
                i === index ? { ...engineer, [field]: value } : engineer
            ),
        }));
        // Clear error for this field
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`engineer${field}_${index}`];
            return newErrors;
        });
    };

    // Add billing detail
    const addBillingDetail = () => {
        setFormData(prev => ({
            ...prev,
            billingDetails: [...prev.billingDetails, {
                paymentDate: '',
                deliveryNote: '',
                amount: 0,
            }],
        }));
    };

    // Remove billing detail
    const removeBillingDetail = (index: number) => {
        if (formData.billingDetails.length > 1) {
            setFormData(prev => ({
                ...prev,
                billingDetails: prev.billingDetails.filter((_, i) => i !== index),
            }));
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
        const pdfFiles = files.filter(file => file.type === 'application/pdf');

        if (pdfFiles.length !== files.length) {
            setErrorMessage(t('sales.createChangeRequest.messages.onlyPdf'));
            if (e.target) {
                e.target.value = '';
            }
            return;
        }

        // Check file size (10MB limit)
        const oversizedFiles = pdfFiles.filter(file => file.size > 10 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setErrorMessage(t('sales.createChangeRequest.messages.fileSizeLimit'));
            if (e.target) {
                e.target.value = '';
            }
            return;
        }

        // Check file count limit (max 1 file)
        const currentAttachments = formData.attachments || [];
        if (currentAttachments.length >= 1) {
            setErrorMessage(t('sales.createChangeRequest.messages.fileLimit'));
            if (e.target) {
                e.target.value = '';
            }
            return;
        }

        setFormData(prev => ({
            ...prev,
            attachments: pdfFiles.slice(0, 1), // Only take first file
        }));
        setErrorMessage('');
        if (e.target) {
            e.target.value = '';
        }
    };

    // Remove attachment
    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: (prev.attachments || []).filter((_, i) => i !== index),
        }));
    };

    if (!isOpen) return null;

    // Filter sales managers for reviewer dropdown
    const salesManagers = salesUsers.filter(u => u.role === 'SALES_MANAGER');

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                                <Label htmlFor="title">{t('sales.createChangeRequest.fields.crTitle')} *</Label>
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
                                <Label htmlFor="type">{t('sales.createChangeRequest.fields.crType')} *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => {
                                        setFormData(prev => ({ ...prev, type: value as any }));
                                        setErrors(prev => ({ ...prev, type: false }));
                                    }}
                                >
                                    <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                                        <SelectValue placeholder={t('sales.createChangeRequest.placeholders.selectCrType')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Add Scope">{t('sales.createChangeRequest.crType.addScope')}</SelectItem>
                                        <SelectItem value="Remove Scope">{t('sales.createChangeRequest.crType.removeScope')}</SelectItem>
                                        <SelectItem value="Other">{t('sales.createChangeRequest.crType.other')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="effectiveFrom">{t('sales.createChangeRequest.fields.effectiveFrom')} *</Label>
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
                                <Label htmlFor="effectiveUntil">{t('sales.createChangeRequest.fields.effectiveUntil')} *</Label>
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
                            <Label htmlFor="summary">{t('sales.createChangeRequest.fields.changeSummary')} *</Label>
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
                                <p className="text-sm text-gray-400 mt-1">PDF files only, max 10MB, up to 1 file</p>
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

                    {/* Engaged Engineer Section */}
                    <section className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.engagedEngineer')}</h3>
                        {formData.engagedEngineers.map((engineer, index) => (
                            <div key={index} className="mb-4 p-4 border rounded-lg">
                                <div className="grid grid-cols-5 gap-4">
                                    <div>
                                        <Label>{t('sales.createChangeRequest.fields.engineerLevel')} *</Label>
                                        <Input
                                            value={engineer.engineerLevel}
                                            onChange={(e) => updateEngagedEngineer(index, 'engineerLevel', e.target.value)}
                                            className={errors[`engineerLevel_${index}`] ? 'border-red-500' : ''}
                                            placeholder={t('sales.createChangeRequest.placeholders.engineerLevel')}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('sales.createChangeRequest.fields.startDate')} *</Label>
                                        <div className="relative">
                                            <Input
                                                type="date"
                                                value={engineer.startDate}
                                                onChange={(e) => updateEngagedEngineer(index, 'startDate', e.target.value)}
                                                className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors[`engineerStartDate_${index}`] ? 'border-red-500' : ''}`}
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
                                    </div>
                                    <div>
                                        <Label>{t('sales.createChangeRequest.fields.endDate')} *</Label>
                                        <div className="relative">
                                            <Input
                                                type="date"
                                                value={engineer.endDate}
                                                onChange={(e) => updateEngagedEngineer(index, 'endDate', e.target.value)}
                                                className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors[`engineerEndDate_${index}`] ? 'border-red-500' : ''}`}
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
                                    </div>
                                    <div>
                                        <Label>{t('sales.createChangeRequest.fields.rating')} *</Label>
                                        <Input
                                            type="text"
                                            value={engineer.rating ? `${engineer.rating}%` : ''}
                                            onChange={(e) => {
                                                const value = e.target.value.replace('%', '').trim();
                                                const rating = value === '' ? 0 : parseFloat(value) || 0;
                                                updateEngagedEngineer(index, 'rating', rating);
                                            }}
                                            className={errors[`engineerRating_${index}`] ? 'border-red-500' : ''}
                                            placeholder={t('sales.createChangeRequest.placeholders.rating')}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('sales.createChangeRequest.fields.salary')} *</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                            <Input
                                                type="text"
                                                value={formatCurrency(engineer.salary)}
                                                onChange={(e) => {
                                                    const salary = parseCurrency(e.target.value);
                                                    updateEngagedEngineer(index, 'salary', salary);
                                                }}
                                                className={`pl-8 ${errors[`engineerSalary_${index}`] ? 'border-red-500' : ''}`}
                                                placeholder={t('sales.createChangeRequest.placeholders.salary')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {formData.engagedEngineers.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeEngagedEngineer(index)}
                                        className="mt-2"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        {t('sales.createChangeRequest.actions.remove')}
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addEngagedEngineer}
                            className="mt-2"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('sales.createChangeRequest.actions.addEngineer')}
                        </Button>
                    </section>

                    {/* Billing Details Section */}
                    <section className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.billingDetails')}</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('sales.createChangeRequest.fields.paymentDate')} *</TableHead>
                                        <TableHead>{t('sales.createChangeRequest.fields.deliveryNote')} *</TableHead>
                                        <TableHead>{t('sales.createChangeRequest.fields.amount')} *</TableHead>
                                        <TableHead>{t('sales.createChangeRequest.table.action')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {formData.billingDetails.map((billing, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="relative">
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
                                                    placeholder={t('sales.createChangeRequest.placeholders.deliveryNote')}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                                                    <Input
                                                        type="text"
                                                        value={formatCurrency(billing.amount)}
                                                        onChange={(e) => {
                                                            const amount = parseCurrency(e.target.value);
                                                            updateBillingDetail(index, 'amount', amount);
                                                        }}
                                                        className={`pl-8 ${errors[`billingAmount_${index}`] ? 'border-red-500' : ''}`}
                                                        placeholder={t('sales.createChangeRequest.placeholders.amount')}
                                                    />
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
                                    ))}
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
                            {t('sales.createChangeRequest.actions.addBillingDetail')}
                        </Button>
                    </section>

                    {/* Approval & Workflow Section */}
                    <section className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">{t('sales.createChangeRequest.sections.approvalWorkflow')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="internalReviewer">{t('sales.createChangeRequest.fields.internalReviewer')} *</Label>
                                <Select
                                    value={formData.internalReviewerId?.toString() || ''}
                                    onValueChange={(value) => {
                                        setFormData(prev => ({ ...prev, internalReviewerId: parseInt(value) }));
                                        setErrors(prev => ({ ...prev, internalReviewerId: false }));
                                    }}
                                >
                                    <SelectTrigger className={errors.internalReviewerId ? 'border-red-500' : ''}>
                                        <SelectValue placeholder={t('sales.createChangeRequest.placeholders.selectReviewer')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salesManagers.map(user => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.fullName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="status">{t('sales.createChangeRequest.fields.status')}</Label>
                                <Input
                                    id="status"
                                    value={formData.action === 'submit' ? t('sales.createChangeRequest.status.underInternalReview') : t('sales.createChangeRequest.status.draft')}
                                    readOnly
                                    className="bg-gray-100"
                                />
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

