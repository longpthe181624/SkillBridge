'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface CancelConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => Promise<void>;
}

export default function CancelConsultationModal({
                                                    isOpen,
                                                    onClose,
                                                    onSubmit,
                                                }: CancelConsultationModalProps) {
    const { t } = useLanguage();
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!reason || reason.trim().length === 0) {
            setError(t('client.contactDetail.cancel.reasonRequired'));
            return;
        }

        setLoading(true);

        try {
            await onSubmit(reason.trim());
            setReason('');
            setError('');
            onClose();
        } catch (error: any) {
            setError(error.message || t('client.contactDetail.cancel.submitFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setReason('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-8 w-full max-w-xl relative border border-gray-200">
                {/* Close Button */}
                <button
                    onClick={handleCancel}
                    className="absolute top-4 right-4 text-2xl font-bold hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-normal text-gray-800 text-center mb-6">
                    {t('client.contactDetail.cancel.title')}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Message Input */}
                    <div className="mb-6">
                        <Label htmlFor="reason">{t('client.contactDetail.cancel.messageLabel')}</Label>
                        <Textarea
                            id="reason"
                            placeholder={t('client.contactDetail.cancel.messagePlaceholder')}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className={error ? 'border-red-500' : ''}
                        />
                    </div>

                    {error && (
                        <div className="mb-4">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                            disabled={loading}
                        >
                            {loading ? t('client.contactDetail.cancel.cancelling') : t('client.contactDetail.cancel.submit')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

