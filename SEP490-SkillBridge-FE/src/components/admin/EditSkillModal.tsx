'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';
import { UpdateSkillRequest, Skill, SubSkill } from '@/services/adminSkillService';

interface EditSkillModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (request: UpdateSkillRequest) => Promise<void>;
    skill: Skill | null;
    subSkills: SubSkill[];
}

export default function EditSkillModal({
                                           open,
                                           onClose,
                                           onSubmit,
                                           skill,
                                           subSkills
                                       }: EditSkillModalProps) {
    const [formData, setFormData] = useState<UpdateSkillRequest>({
        name: '',
        description: '',
        subSkills: [],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Initialize form data when skill changes
    useEffect(() => {
        if (skill && open) {
            setFormData({
                name: skill.name || '',
                description: skill.description || '',
                subSkills: subSkills.map(subSkill => ({
                    id: subSkill.id,
                    name: subSkill.name,
                })),
            });
            setErrors({});
        }
    }, [skill, subSkills, open]);

    const handleAddSubSkill = () => {
        setFormData({
            ...formData,
            subSkills: [...(formData.subSkills || []), { name: '' }],
        });
    };

    const handleRemoveSubSkill = (index: number) => {
        const newSubSkills = [...(formData.subSkills || [])];
        newSubSkills.splice(index, 1);
        setFormData({ ...formData, subSkills: newSubSkills });
    };

    const handleSubSkillChange = (index: number, value: string) => {
        const newSubSkills = [...(formData.subSkills || [])];
        newSubSkills[index] = { ...newSubSkills[index], name: value };
        setFormData({ ...formData, subSkills: newSubSkills });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Skill name is required';
        }

        if (formData.subSkills) {
            formData.subSkills.forEach((subSkill, index) => {
                if (!subSkill.name.trim()) {
                    newErrors[`subSkill_${index}`] = 'Sub-skill name is required';
                }
            });
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
                subSkills: formData.subSkills?.filter(s => s.name.trim()) || [],
            });
        } catch (error) {
            // Error is handled by parent
        } finally {
            setLoading(false);
        }
    };

    if (!skill) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Skill</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Skill Name */}
                    <div>
                        <Label htmlFor="skillName">Skill Name</Label>
                        <Input
                            id="skillName"
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

                    {/* Sub Skills */}
                    <div>
                        <Label>Sub Skills</Label>
                        <div className="space-y-2">
                            {formData.subSkills?.map((subSkill, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={subSkill.name}
                                        onChange={(e) => handleSubSkillChange(index, e.target.value)}
                                        placeholder={`Sub Skill ${index + 1}`}
                                        className={errors[`subSkill_${index}`] ? 'border-red-500' : ''}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleRemoveSubSkill(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {formData.subSkills && formData.subSkills.length > 0 && (
                                <div>
                                    {formData.subSkills.map((_, index) => {
                                        const error = errors[`subSkill_${index}`];
                                        return error ? (
                                            <p key={index} className="text-red-500 text-sm mt-1">
                                                {error}
                                            </p>
                                        ) : null;
                                    })}
                                </div>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddSubSkill}
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Sub Skill
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

