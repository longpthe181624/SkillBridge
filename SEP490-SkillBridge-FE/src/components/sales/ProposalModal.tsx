'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { Proposal } from '@/services/salesOpportunityDetailService';
import { SalesUser } from '@/services/salesContactDetailService';

interface ProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    proposal: Proposal | null;
    opportunityId: string;
    salesManagers: SalesUser[];
    onSave: (title: string, files: File[], reviewerId: number | null) => Promise<void>;
    onSaveDraft: (title: string, files: File[], reviewerId: number | null) => Promise<void>;
}

export default function ProposalModal({
                                          isOpen,
                                          onClose,
                                          proposal,
                                          opportunityId,
                                          salesManagers,
                                          onSave,
                                          onSaveDraft,
                                      }: ProposalModalProps) {
    const [title, setTitle] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [reviewerId, setReviewerId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; files?: string; reviewerId?: string; submit?: string }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const isEditMode = proposal !== null;

    // Initialize form data when proposal changes
    useEffect(() => {
        if (proposal) {
            setTitle(proposal.title || '');
            setFiles([]); // Files are already uploaded, don't pre-populate
            setReviewerId(proposal.reviewerId || null);
        } else {
            setTitle('');
            setFiles([]);
            setReviewerId(null);
        }
        setErrors({});
    }, [proposal, isOpen]);

    const validateForm = (requireReviewer: boolean = false): boolean => {
        const newErrors: { title?: string; files?: string; reviewerId?: string } = {};

        if (!title || title.trim() === '') {
            newErrors.title = 'Title is required';
        } else if (title.trim().length > 255) {
            newErrors.title = 'Title must not exceed 255 characters';
        }

        // Validate reviewerId if required
        if (requireReviewer && !reviewerId) {
            newErrors.reviewerId = 'Reviewer is required';
        }

        // Validate file count (max 1 file)
        if (files.length > 1) {
            newErrors.files = 'You can upload up to 1 attachment';
        }
        
        // Validate file size (max 10MB per file)
        const maxSize = 10 * 1024 * 1024; // 10MB
        files.forEach((file) => {
            if (file.size > maxSize) {
                newErrors.files = `File ${file.name} exceeds maximum size of 10MB`;
            }
            // Validate PDF only
            if (file.type !== 'application/pdf') {
                newErrors.files = `File ${file.name} must be a PDF file`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const maxSize = 10 * 1024 * 1024; // 10MB
            const newErrors: { files?: string } = {};

            // Check if already has a file
            if (files.length >= 1) {
                newErrors.files = 'You can upload up to 1 attachment';
                setErrors(newErrors);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            // Validate each file
            const validFiles: File[] = [];
            selectedFiles.forEach((file) => {
                if (file.type !== 'application/pdf') {
                    newErrors.files = `File ${file.name} must be a PDF file`;
                } else if (file.size > maxSize) {
                    newErrors.files = `File ${file.name} exceeds maximum size of 10MB`;
                } else {
                    validFiles.push(file);
                }
            });

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                // Only take the first file
                setFiles(validFiles.slice(0, 1));
                setErrors({});
            }
        }
    };

    const handleFileRemove = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            const maxSize = 10 * 1024 * 1024; // 10MB
            const newErrors: { files?: string } = {};

            // Check if already has a file
            if (files.length >= 1) {
                newErrors.files = 'You can upload up to 1 attachment';
                setErrors(newErrors);
                return;
            }

            // Validate each file
            const validFiles: File[] = [];
            droppedFiles.forEach((file) => {
                if (file.type !== 'application/pdf') {
                    newErrors.files = `File ${file.name} must be a PDF file`;
                } else if (file.size > maxSize) {
                    newErrors.files = `File ${file.name} exceeds maximum size of 10MB`;
                } else {
                    validFiles.push(file);
                }
            });

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
            } else {
                // Only take the first file
                setFiles(validFiles.slice(0, 1));
                setErrors({});
            }
        }
    };

    const handleSave = async () => {
        // When saving (not draft), reviewerId is required
        if (!validateForm(true)) {
            return;
        }

        setLoading(true);
        try {
            await onSave(title, files, reviewerId);
            setTitle('');
            setFiles([]);
            setReviewerId(null);
            setErrors({});
            onClose();
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to save proposal' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        // When saving as draft, reviewerId is not required
        if (!validateForm(false)) {
            return;
        }

        setLoading(true);
        try {
            await onSaveDraft(title, files, reviewerId);
            setTitle('');
            setFiles([]);
            setReviewerId(null);
            setErrors({});
            onClose();
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to save draft' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setTitle('');
        setFiles([]);
        setReviewerId(null);
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Proposal' : 'Create Proposal'}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Title Field */}
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">Title</label>
                        <Input
                            value={title}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 255) {
                                    setTitle(value);
                                }
                            }}
                            maxLength={255}
                            placeholder="Enter proposal title"
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    {/* Assign Reviewer Field */}
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                            Assign Reviewer <span className="text-gray-400">(optional for draft)</span>
                        </label>
                        <Select
                            value={reviewerId?.toString() || ''}
                            onValueChange={(value) => {
                                setReviewerId(value ? parseInt(value) : null);
                                if (errors.reviewerId) {
                                    setErrors({ ...errors, reviewerId: undefined });
                                }
                            }}
                        >
                            <SelectTrigger className={errors.reviewerId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select reviewer" />
                            </SelectTrigger>
                            <SelectContent>
                                {salesManagers.map((manager) => (
                                    <SelectItem key={manager.id} value={manager.id.toString()}>
                                        {manager.fullName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.reviewerId && <p className="text-red-500 text-sm mt-1">{errors.reviewerId}</p>}
                    </div>

                    {/* Documents Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">■ Documents</h3>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                isDragging
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-blue-500'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                            <p className="text-gray-600">Click or Drag & Drop PDF here (PDF, max 10MB, 1 file)</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>
                        {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>}

                        {/* Uploaded Files List */}
                        {files.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {files.map((file, index) => (
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

                        {/* Existing Files (if editing) */}
                        {isEditMode && proposal && proposal.attachments && proposal.attachments.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Existing files:</p>
                                <div className="space-y-2">
                                    {proposal.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <a
                                                href={attachment}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {attachment.split('/').pop() || `File ${index + 1}`}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                            {errors.submit}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                        Draft
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

