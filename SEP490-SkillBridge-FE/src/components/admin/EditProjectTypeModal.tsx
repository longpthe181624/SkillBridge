'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UpdateProjectTypeRequest, ProjectType } from '@/services/adminProjectTypeService';

interface EditProjectTypeModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (request: UpdateProjectTypeRequest) => Promise<void>;
    projectType: ProjectType | null;
}

export default function EditProjectTypeModal({
                                                 open,
                                                 onClose,
                                                 onSubmit,
                                                 projectType
                                             }: EditProjectTypeModalProps) {
    const [formData, setFormData] = useState<UpdateProjectTypeRequest>({
        name: '',
        description: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Initialize form data when projectType changes
    useEffect(() => {
        if (projectType && open) {
            setFormData({
                name: projectType.name || '',
                description: projectType.description || '',
            });
            setErrors({});
        }
    }, [projectType, open]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Project type name is required';
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
        } catch (error) {
            // Error is handled by parent
        } finally {
            setLoading(false);
        }
    };

    if (!projectType) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Project Type</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Type Name */}
                    <div>
                        <Label htmlFor="projectTypeName">Project Type Name</Label>
                        <Input
                            id="projectTypeName"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Mobile app"
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
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mobile app"
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
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

