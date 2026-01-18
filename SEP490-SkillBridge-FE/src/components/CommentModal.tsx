'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (message: string) => Promise<void>;
    title?: string;
    messageLabel?: string;
    messagePlaceholder?: string;
    submitLabel?: string;
}

export default function CommentModal({
                                         isOpen,
                                         onClose,
                                         onSubmit,
                                         title,
                                         messageLabel,
                                         messagePlaceholder,
                                         submitLabel,
                                     }: CommentModalProps) {
    const { t } = useLanguage();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!message || message.trim().length === 0) {
            setError(t('client.contractDetail.comment.messageRequired') || t('client.contactDetail.comment.messageRequired'));
            return;
        }

        setLoading(true);

        try {
            await onSubmit(message.trim());
            setMessage('');
            setError('');
            onClose();
        } catch (error: any) {
            setError(error.message || t('client.contactDetail.comment.submitFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setMessage('');
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
                    {title || t('client.contractDetail.comment.title') || t('client.contactDetail.comment.title')}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Message Input */}
                    <div className="mb-6">
                        <Label htmlFor="message">
                            {messageLabel || t('client.contractDetail.comment.messageLabel') || t('client.contactDetail.comment.messageLabel')}
                        </Label>
                        <Textarea
                            id="message"
                            placeholder={messagePlaceholder || t('client.contractDetail.comment.messagePlaceholder') || t('client.contactDetail.comment.messagePlaceholder')}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
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
                            {loading
                                ? (t('client.contractDetail.comment.submitting') || t('client.contactDetail.comment.submitting'))
                                : (submitLabel || t('client.contractDetail.comment.submit') || t('client.contactDetail.comment.submit'))}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

