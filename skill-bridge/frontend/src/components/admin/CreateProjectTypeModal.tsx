'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateProjectTypeRequest } from '@/services/adminProjectTypeService';

interface CreateProjectTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: CreateProjectTypeRequest) => Promise<void>;
}

export default function CreateProjectTypeModal({ open, onClose, onSubmit }: CreateProjectTypeModalProps) {
  const [formData, setFormData] = useState<CreateProjectTypeRequest>({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project type name is required';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      });
      // Reset form
      setFormData({
        name: '',
        description: '',
      });
      setErrors({});
    } catch (error) {
      // Error is handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create new Project Type</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Type Name */}
          <div>
            <Label htmlFor="projectTypeName">Project Type Name <span className="text-red-500">*</span></Label>
            <Input
              id="projectTypeName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Healthcare"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= 500) {
                  setFormData({ ...formData, description: newValue });
                  if (errors.description) {
                    const newErrors = { ...errors };
                    delete newErrors.description;
                    setErrors(newErrors);
                  }
                } else {
                  setErrors({ ...errors, description: 'Description must not exceed 500 characters' });
                }
              }}
              placeholder="dental clinic"
              rows={3}
              maxLength={500}
              className={errors.description ? 'border-red-500' : ''}
            />
            <div className="text-sm text-gray-500 mt-1">
              {(formData.description || '').length}/500 characters
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-gray-800 text-white hover:bg-gray-900">
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

