'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateSubSkillModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: { name: string }) => Promise<void>;
  parentSkillName: string;
}

export default function CreateSubSkillModal({ 
  open, 
  onClose, 
  onSubmit, 
  parentSkillName 
}: CreateSubSkillModalProps) {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
    
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit({ name: name.trim() });
      setName('');
      setErrors({});
    } catch (error) {
      // Error is handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Sub Skill</DialogTitle>
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
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
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

