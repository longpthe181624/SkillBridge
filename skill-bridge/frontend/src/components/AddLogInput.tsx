'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddLogInputProps {
  isVisible: boolean;
  onSubmit: (message: string) => Promise<void>;
  onCancel?: () => void;
}

export default function AddLogInput({
  isVisible,
  onSubmit,
  onCancel,
}: AddLogInputProps) {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isVisible) return null;

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError(t('client.contactDetail.logs.messageRequired'));
      return;
    }

    if (message.length > 500) {
      setError('Communication log message must not exceed 500 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(message.trim());
      setMessage('');
      onCancel?.();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('client.contactDetail.logs.addFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMessage('');
    setError('');
    onCancel?.();
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <Textarea
        value={message}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue.length <= 500) {
            setMessage(newValue);
            setError('');
          } else {
            setError('Communication log message must not exceed 500 characters');
          }
        }}
        placeholder={t('client.contactDetail.logs.messagePlaceholder')}
        rows={3}
        maxLength={500}
        className="mb-3"
      />
      <div className="text-sm text-gray-500 mb-3">
        {message.length}/500 characters
      </div>
      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {t('client.contactDetail.logs.cancel')}
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={loading || !message.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? t('client.contactDetail.logs.adding') : t('client.contactDetail.logs.add')}
        </Button>
      </div>
    </div>
  );
}

