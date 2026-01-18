'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UpdateUserRequest, getUserById, updateUser } from '@/services/adminUserService';
import { useToast } from '@/components/ui/use-toast';

interface EditUserModalProps {
    open: boolean;
    userId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditUserModal({ open, userId, onClose, onSuccess }: EditUserModalProps) {
    const { toast } = useToast();
    const [formData, setFormData] = useState<UpdateUserRequest>({
        fullName: '',
        role: undefined as any, // Will be 'SALES_MANAGER' | 'SALES_REP'
        phone: ''
    });
    const [originalData, setOriginalData] = useState<UpdateUserRequest | null>(null);
    const [email, setEmail] = useState<string>(''); // Email is read-only, stored separately
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Map role from database to UI
    const mapRoleToUI = (role: string): 'SALES_MANAGER' | 'SALES_REP' => {
        if (role === 'SALES_MANAGER') return 'SALES_MANAGER';
        if (role === 'SALES_REP') return 'SALES_REP';
        return 'SALES_REP'; // Default
    };

    // Load user data when modal opens
    const loadUserData = useCallback(async () => {
        if (!userId) return;

        setLoadingData(true);
        try {
            const user: User = await getUserById(userId);
            const initialData: UpdateUserRequest = {
                fullName: user.fullName || '',
                role: mapRoleToUI(user.role),
                phone: user.phone || ''
            };
            setFormData(initialData);
            setOriginalData(initialData);
            setEmail(user.email || ''); // Store email separately (read-only)
            setIsDirty(false);
        } catch (error: any) {
            console.error('Failed to load user:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to load user data.',
                variant: 'destructive',
            });
            onClose();
        } finally {
            setLoadingData(false);
        }
    }, [userId, onClose, toast]);

    // Load data when modal opens
    useEffect(() => {
        if (open && userId) {
            loadUserData();
        } else {
            // Reset form when modal closes
            setFormData({
                fullName: '',
                role: undefined as any,
                phone: ''
            });
            setOriginalData(null);
            setEmail('');
            setErrors({});
            setIsDirty(false);
        }
    }, [open, userId, loadUserData]);

    // Track dirty state (email is NOT included in dirty check)
    useEffect(() => {
        if (originalData) {
            const hasChanges =
                formData.fullName !== originalData.fullName ||
                formData.role !== originalData.role ||
                formData.phone !== originalData.phone;
            setIsDirty(hasChanges);
        }
    }, [formData, originalData]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'User name is required';
        } else if (formData.fullName.length > 255) {
            newErrors.fullName = 'User name must not exceed 255 characters';
        }

        if (!formData.role) {
            newErrors.role = 'Role is required';
        } else if (formData.role !== 'SALES_MANAGER' && formData.role !== 'SALES_REP') {
            newErrors.role = 'Role must be either Sale Manager or Sale Rep';
        }

        // Email validation is NOT needed (field is disabled/read-only)

        if (formData.phone && formData.phone.length > 50) {
            newErrors.phone = 'Phone number must not exceed 50 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Clear error for this field when user starts typing
        if (errors[id]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const handleRoleChange = (value: string) => {
        setFormData(prev => ({ ...prev, role: value as 'SALES_MANAGER' | 'SALES_REP' }));
        if (errors.role) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.role;
                return newErrors;
            });
        }
    };

    const handleBlur = (field: string) => {
        // Validate field on blur
        if (field === 'fullName' && !formData.fullName.trim()) {
            setErrors(prev => ({ ...prev, fullName: 'User name is required' }));
        } else if (field === 'role' && !formData.role) {
            setErrors(prev => ({ ...prev, role: 'Role is required' }));
        }
        // Email validation is NOT needed (field is disabled/read-only)
    };

    const handleClose = () => {
        if (isDirty) {
            if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: 'Validation Error',
                description: 'Please correct the errors in the form.',
                variant: 'destructive',
            });
            return;
        }

        if (!userId) {
            toast({
                title: 'Error',
                description: 'User ID is missing.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        try {
            await updateUser(userId, formData);
            toast({
                title: 'Success',
                description: 'User updated successfully.',
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Failed to update user:', error);
            const errorMessage = error.message || 'Failed to update user.';
            setErrors(prev => ({ ...prev, api: errorMessage }));

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                {loadingData ? (
                    <div className="flex justify-center items-center h-40">
                        Loading user data...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullName" className="text-right">
                                User name <span className="text-red-500">*</span>
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('fullName')}
                                    className={errors.fullName ? 'border-red-500' : ''}
                                    placeholder="Yamada Taro"
                                    disabled={loading}
                                    maxLength={255}
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role <span className="text-red-500">*</span>
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={formData.role}
                                    onValueChange={handleRoleChange}
                                    disabled={loading}
                                >
                                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SALES_MANAGER">Sale Manager</SelectItem>
                                        <SelectItem value="SALES_REP">Sale Rep</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    className="bg-gray-100"
                                    placeholder="yamada.taro@landbridge.co.jp"
                                    disabled
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be edited</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Phone Number
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={errors.phone ? 'border-red-500' : ''}
                                    placeholder="070-3359-2653"
                                    disabled={loading}
                                    maxLength={50}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {errors.api && (
                            <div className="col-span-4 text-center">
                                <p className="text-red-500 text-sm">{errors.api}</p>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading || !isDirty}>
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

