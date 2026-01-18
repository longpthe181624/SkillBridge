'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SubSkill } from '@/services/adminSkillService';

interface EditSubSkillModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (subSkillId: number, request: { name: string }) => Promise<void>;
  subSkill: SubSkill | null;
  parentSkillName: string;
}

export default function EditSubSkillModal({ 
  open, 
  onClose, 
  onSubmit, 
  subSkill,
  parentSkillName 
}: EditSubSkillModalProps) {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when subSkill changes
  useEffect(() => {
    if (subSkill && open) {
      setName(subSkill.name || '');
      setErrors({});
    }
  }, [subSkill, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Sub-skill name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subSkill) return;
    
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(subSkill.id, { name: name.trim() });
    } catch (error) {
      // Error is handled by parent
    } finally {
      setLoading(false);
    }
  };

  if (!subSkill) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Sub Skill</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parent Skill */}
          <div>
            <Label htmlFor="parentSkill">Parent Skill</Label>
            <Input
              id="parentSkill"
              value={parentSkillName}
              disabled
              className="bg-gray-100"
            />
          </div>

          {/* Skill Name */}
          <div>
            <Label htmlFor="skillName">Skill Name <span className="text-red-500">*</span></Label>
            <Input
              id="skillName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Flutter"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
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

