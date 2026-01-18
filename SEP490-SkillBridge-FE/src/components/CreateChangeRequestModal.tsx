'use client';

import { useState, useRef } from 'react';
import { X, Upload, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateChangeRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    contractId: number;
    contractType: 'Fixed Price' | 'Retainer';
    onSubmit: (data: ChangeRequestFormData) => Promise<void>;
    onSaveDraft: (data: ChangeRequestFormData) => Promise<void>;
}

export interface ChangeRequestFormData {
    title: string;
    type: string;
    description: string;
    reason: string;
    attachments: File[];
    desiredStartDate: string; // YYYY/MM/DD
    desiredEndDate: string; // YYYY/MM/DD
    expectedExtraCost: number;
}

export default function CreateChangeRequestModal({
                                                     isOpen,
                                                     onClose,
                                                     contractId,
                                                     contractType,
                                                     onSubmit,
                                                     onSaveDraft,
                                                 }: CreateChangeRequestModalProps) {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState<ChangeRequestFormData>({
        title: '',
        type: '',
        description: '',
        reason: '',
        attachments: [],
        desiredStartDate: '',
        desiredEndDate: '',
        expectedExtraCost: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // CR Type options based on contract type
    const crTypeOptions = contractType === 'Fixed Price'
        ? ['Add Scope', 'Remove Scope', 'Other']
        : ['Extend Schedule', 'Increase Resource', 'Rate Change', 'Other'];

    if (!isOpen) return null;

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title || formData.title.trim().length === 0) {
            newErrors.title = t('client.contractDetail.createChangeRequest.validation.titleRequired');
        } else if (formData.title.length > 255) {
            newErrors.title = t('client.contractDetail.createChangeRequest.validation.titleMaxLength');
        }

        if (!formData.type) {
            newErrors.type = t('client.contractDetail.createChangeRequest.validation.typeRequired');
        }

        if (!formData.description || formData.description.trim().length === 0) {
            newErrors.description = t('client.contractDetail.createChangeRequest.validation.descriptionRequired');
        } else if (formData.description.length > 2000) {
            newErrors.description = t('client.contractDetail.createChangeRequest.validation.descriptionMaxLength');
        }

        if (!formData.reason || formData.reason.trim().length === 0) {
            newErrors.reason = t('client.contractDetail.createChangeRequest.validation.reasonRequired');
        } else if (formData.reason.length > 2000) {
            newErrors.reason = t('client.contractDetail.createChangeRequest.validation.reasonMaxLength');
        }

        if (!formData.desiredStartDate) {
            newErrors.desiredStartDate = t('client.contractDetail.createChangeRequest.validation.startDateRequired');
        }

        if (!formData.desiredEndDate) {
            newErrors.desiredEndDate = t('client.contractDetail.createChangeRequest.validation.endDateRequired');
        } else if (formData.desiredStartDate && formData.desiredEndDate) {
            const startDate = new Date(formData.desiredStartDate);
            const endDate = new Date(formData.desiredEndDate);
            if (endDate <= startDate) {
                newErrors.desiredEndDate = t('client.contractDetail.createChangeRequest.validation.endDateAfterStart');
            }
        }

        if (formData.expectedExtraCost === undefined || formData.expectedExtraCost === null) {
            newErrors.expectedExtraCost = t('client.contractDetail.createChangeRequest.validation.costRequired');
        } else if (formData.expectedExtraCost < 0) {
            newErrors.expectedExtraCost = t('client.contractDetail.createChangeRequest.validation.costPositive');
        }

        // Validate file uploads
        if (formData.attachments.length > 0) {
            const maxSize = 10 * 1024 * 1024; // 10MB
            formData.attachments.forEach((file, index) => {
                if (file.size > maxSize) {
                    const errorMessage = t('client.contractDetail.createChangeRequest.validation.fileSize');
                    newErrors[`attachment_${index}`] = errorMessage.replace('{fileName}', file.name);
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return '';
        // Convert YYYY-MM-DD to YYYY/MM/DD
        return dateString.replace(/-/g, '/');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDraft(false);

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                desiredStartDate: formatDateForBackend(formData.desiredStartDate),
                desiredEndDate: formatDateForBackend(formData.desiredEndDate),
            };
            await onSubmit(submitData);
            resetForm();
            onClose();
        } catch (error: any) {
            setErrors({ submit: error.message || t('client.contractDetail.createChangeRequest.error.submitFailed') });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDraft(true);

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                desiredStartDate: formData.desiredStartDate ? formatDateForBackend(formData.desiredStartDate) : '',
                desiredEndDate: formData.desiredEndDate ? formatDateForBackend(formData.desiredEndDate) : '',
            };
            await onSaveDraft(submitData);
            resetForm();
            onClose();
        } catch (error: any) {
            setErrors({ submit: error.message || t('client.contractDetail.createChangeRequest.error.saveDraftFailed') });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            type: '',
            description: '',
            reason: '',
            attachments: [],
            desiredStartDate: '',
            desiredEndDate: '',
            expectedExtraCost: 0,
        });
        setErrors({});
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData({ ...formData, attachments: [...formData.attachments, ...files] });
        }
    };

    const handleFileRemove = (index: number) => {
        const newAttachments = formData.attachments.filter((_, i) => i !== index);
        setFormData({ ...formData, attachments: newAttachments });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            const files = Array.from(e.dataTransfer.files);
            setFormData({ ...formData, attachments: [...formData.attachments, ...files] });
        }
    };

    const formatCurrency = (value: number): string => {
        return `¥${value.toLocaleString('ja-JP')}`;
    };

    const parseCurrency = (value: string): number => {
        return parseFloat(value.replace(/[¥,]/g, '')) || 0;
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseCurrency(e.target.value);
        setFormData({ ...formData, expectedExtraCost: value });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {t('client.contractDetail.createChangeRequest.title')}
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Overview Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            {t('client.contractDetail.createChangeRequest.sections.overview')}
                        </h3>

                        {/* CR Title */}
                        <div className="mb-4">
                            <Label htmlFor="title">
                                {t('client.contractDetail.createChangeRequest.fields.title')}
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={t('client.contractDetail.createChangeRequest.placeholders.title')}
                                className={errors.title ? 'border-red-500' : ''}
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>

                        {/* CR Type */}
                        <div className="mb-4">
                            <Label htmlFor="type">
                                {t('client.contractDetail.createChangeRequest.fields.type')}
                            </Label>
                            <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                                    <SelectValue placeholder={t('client.contractDetail.createChangeRequest.placeholders.type')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {crTypeOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <Label htmlFor="description">
                                {t('client.contractDetail.createChangeRequest.fields.description')}
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder={t('client.contractDetail.createChangeRequest.placeholders.description')}
                                rows={4}
                                className={errors.description ? 'border-red-500' : ''}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        {/* Reason */}
                        <div className="mb-4">
                            <Label htmlFor="reason">
                                {t('client.contractDetail.createChangeRequest.fields.reason')}
                            </Label>
                            <Textarea
                                id="reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder={t('client.contractDetail.createChangeRequest.placeholders.reason')}
                                rows={4}
                                className={errors.reason ? 'border-red-500' : ''}
                            />
                            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                        </div>
                    </div>

                    {/* Attachments Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            {t('client.contractDetail.createChangeRequest.sections.attachments')}
                        </h3>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                            <p className="text-gray-600">
                                {t('client.contractDetail.createChangeRequest.attachments.uploadText')}
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>
                        {formData.attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {formData.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-700">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleFileRemove(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desired Impact Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            {t('client.contractDetail.createChangeRequest.sections.desiredImpact')}
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Desired Start Date */}
                            <div>
                                <Label htmlFor="desiredStartDate">
                                    {t('client.contractDetail.createChangeRequest.fields.desiredStartDate')}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="desiredStartDate"
                                        type="date"
                                        value={formData.desiredStartDate}
                                        onChange={(e) => setFormData({ ...formData, desiredStartDate: e.target.value })}
                                        className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors.desiredStartDate ? 'border-red-500' : ''}`}
                                        lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('desiredStartDate') as HTMLInputElement;
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
                                {errors.desiredStartDate && <p className="text-red-500 text-sm mt-1">{errors.desiredStartDate}</p>}
                            </div>

                            {/* Desired End Date */}
                            <div>
                                <Label htmlFor="desiredEndDate">
                                    {t('client.contractDetail.createChangeRequest.fields.desiredEndDate')}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="desiredEndDate"
                                        type="date"
                                        value={formData.desiredEndDate}
                                        onChange={(e) => setFormData({ ...formData, desiredEndDate: e.target.value })}
                                        className={`pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors.desiredEndDate ? 'border-red-500' : ''}`}
                                        lang={language === 'ja' ? 'ja-JP' : 'en-US'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('desiredEndDate') as HTMLInputElement;
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
                                {errors.desiredEndDate && <p className="text-red-500 text-sm mt-1">{errors.desiredEndDate}</p>}
                            </div>
                        </div>

                        {/* Expected Extra Cost */}
                        <div>
                            <Label htmlFor="expectedExtraCost">
                                {t('client.contractDetail.createChangeRequest.fields.expectedExtraCost')}
                            </Label>
                            <Input
                                id="expectedExtraCost"
                                type="text"
                                value={formatCurrency(formData.expectedExtraCost)}
                                onChange={handleCurrencyChange}
                                placeholder={t('client.contractDetail.createChangeRequest.placeholders.expectedExtraCost')}
                                className={errors.expectedExtraCost ? 'border-red-500' : ''}
                            />
                            {errors.expectedExtraCost && <p className="text-red-500 text-sm mt-1">{errors.expectedExtraCost}</p>}
                        </div>
                    </div>

                    {errors.submit && (
                        <div className="mb-4">
                            <p className="text-red-500 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            {t('client.contractDetail.createChangeRequest.buttons.cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSaveDraft}
                            disabled={loading}
                        >
                            {t('client.contractDetail.createChangeRequest.buttons.saveDraft')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? t('client.contractDetail.createChangeRequest.buttons.submitting')
                                : t('client.contractDetail.createChangeRequest.buttons.submit')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

