'use client';

import { useState, useEffect } from 'react';
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
import { createUser, CreateUserRequest } from '@/services/adminUserService';
import { useToast } from '@/components/ui/use-toast';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ open, onClose, onSuccess }: CreateUserModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateUserRequest>({
    fullName: '',
    role: undefined as any, // Will be 'SALES_MANAGER' | 'SALES_REP'
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        fullName: '',
        role: undefined as any,
        email: '',
        phone: ''
      });
      setErrors({});
      setIsDirty(false);
    }
  }, [open]);

  // Track dirty state
  useEffect(() => {
    const hasChanges = Boolean(
      formData.fullName.trim() !== '' ||
      formData.role !== undefined ||
      formData.email.trim() !== '' ||
      (formData.phone && formData.phone.trim() !== '')
    );
    setIsDirty(hasChanges);
  }, [formData]);

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 255) {
      newErrors.email = 'Email must not exceed 255 characters';
    }

    if (formData.phone && formData.phone.length > 50) {
      newErrors.phone = 'Phone number must not exceed 50 characters';
    }
    
    // Validate phone format: only numbers and dashes
    if (formData.phone && formData.phone.trim() !== '') {
      const phoneRegex = /^[0-9-]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Phone number can only contain numbers and dashes';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Special handling for phone field: only allow numbers and dashes
    if (id === 'phone') {
      const phoneRegex = /^[0-9-]*$/;
      if (phoneRegex.test(value) || value === '') {
        setFormData(prev => ({ ...prev, [id]: value }));
      }
      // If invalid character, don't update the value
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
    
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
    } else if (field === 'email') {
      if (!formData.email.trim()) {
        setErrors(prev => ({ ...prev, email: 'Email is required' }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    } else if (field === 'role' && !formData.role) {
      setErrors(prev => ({ ...prev, role: 'Role is required' }));
    }
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

    setLoading(true);
    try {
      await createUser(formData);
      toast({
        title: 'Success',
        description: 'User created successfully. Welcome email has been sent.',
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to create user:', error);
      const errorMessage = error.message || 'Failed to create user.';
      
      // Check if error is about email already existing
      if (errorMessage.toLowerCase().includes('email already exists')) {
        setErrors(prev => ({ ...prev, email: 'Email already exists. Please use a different email.' }));
      } else {
        setErrors(prev => ({ ...prev, api: errorMessage }));
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
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
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={errors.email ? 'border-red-500' : ''}
                placeholder="yamada.taro@landbridge.co.jp"
                disabled={loading}
                maxLength={255}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

