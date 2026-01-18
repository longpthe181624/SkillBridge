'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateProjectCloseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  sowId: number;
  existingCloseRequest?: {
    id: number;
    message?: string;
    links?: string;
    status: string;
  } | null;
  onSubmit: (data: CloseRequestFormData) => Promise<void>;
  onResubmit?: (id: number, data: CloseRequestFormData) => Promise<void>;
}

export interface CloseRequestFormData {
  message: string;
  links: string;
}

const DEFAULT_MESSAGE = "Thank you for working with us. The project scope has been delivered. Please review and confirm project closure.";

export default function CreateProjectCloseRequestModal({
  isOpen,
  onClose,
  sowId: _sowId,
  existingCloseRequest,
  onSubmit,
  onResubmit,
}: CreateProjectCloseRequestModalProps) {
  const { t } = useLanguage();
  const isResubmit = existingCloseRequest?.status === 'Rejected';
  
  const [formData, setFormData] = useState<CloseRequestFormData>({
    message: DEFAULT_MESSAGE,
    links: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Pre-fill form if resubmitting
  useEffect(() => {
    if (isOpen && existingCloseRequest) {
      setFormData({
        message: existingCloseRequest.message || DEFAULT_MESSAGE,
        links: existingCloseRequest.links || '',
      });
    } else if (isOpen && !existingCloseRequest) {
      setFormData({
        message: DEFAULT_MESSAGE,
        links: '',
      });
    }
  }, [isOpen, existingCloseRequest]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Message is optional but recommended
    if (formData.message && formData.message.length > 5000) {
      newErrors.message = 'Message must not exceed 5000 characters';
    }

    // Links is optional
    if (formData.links && formData.links.length > 2000) {
      newErrors.links = 'Links must not exceed 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isResubmit && existingCloseRequest && onResubmit) {
        await onResubmit(existingCloseRequest.id, formData);
      } else {
        await onSubmit(formData);
      }
      // Close modal after successful submission
      onClose();
      // Reset form
      setFormData({
        message: DEFAULT_MESSAGE,
        links: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting close request:', error);
      // Error handling is done in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setFormData({
      message: DEFAULT_MESSAGE,
      links: '',
    });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isResubmit ? 'Update & Resubmit Close Request' : 'Create Project Close Request'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Message Field */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
              Message to Client
            </Label>
            <Textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                if (errors.message) {
                  const { message, ...restErrors } = errors;
                  setErrors(restErrors);
                }
              }}
              placeholder={DEFAULT_MESSAGE}
              className={`w-full ${errors.message ? 'border-red-500' : ''}`}
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.message && (
                <span className="text-sm text-red-500">{errors.message}</span>
              )}
              <span className="text-sm text-gray-500 ml-auto">
                {formData.message.length}/5000 characters
              </span>
            </div>
          </div>

          {/* Links Field */}
          <div>
            <Label htmlFor="links" className="text-sm font-medium text-gray-700 mb-2 block">
              Links
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Handover documents, repository links, feedback forms, etc. (one per line)
            </p>
            <Textarea
              id="links"
              rows={4}
              value={formData.links}
              onChange={(e) => {
                setFormData({ ...formData, links: e.target.value });
                if (errors.links) {
                  const { links, ...restErrors } = errors;
                  setErrors(restErrors);
                }
              }}
              placeholder="https://docs.example.com/handover&#10;https://feedback.example.com/form"
              className={`w-full font-mono text-sm ${errors.links ? 'border-red-500' : ''}`}
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.links && (
                <span className="text-sm text-red-500">{errors.links}</span>
              )}
              <span className="text-sm text-gray-500 ml-auto">
                {formData.links.length}/2000 characters
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Submitting...' : (isResubmit ? 'Resubmit Close Request' : 'Submit Close Request')}
          </Button>
        </div>
      </div>
    </div>
  );
}

