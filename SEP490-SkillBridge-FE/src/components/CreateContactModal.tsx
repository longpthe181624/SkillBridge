'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, description: string) => Promise<void>;
}

export default function CreateContactModal({
                                               isOpen,
                                               onClose,
                                               onSubmit,
                                           }: CreateContactModalProps) {
    const { t } = useLanguage();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title || title.trim().length === 0) {
            setError(t('client.createContact.error.titleRequired'));
            return;
        }

        setLoading(true);

        try {
            await onSubmit(title.trim(), description.trim());
            // Reset form
            setTitle('');
            setDescription('');
            setError('');
            onClose();
        } catch (error: any) {
            setError(error.message || t('client.createContact.error.submitFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
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
                    {t('client.createContact.title')}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Title Input */}
                    <div className="mb-6">
                        <Label htmlFor="title">{t('client.createContact.titleLabel')}</Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder={t('client.createContact.titlePlaceholder')}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={error ? 'border-red-500' : ''}
                        />
                    </div>

                    {/* Description Input */}
                    <div className="mb-6">
                        <Label htmlFor="description">{t('client.createContact.descriptionLabel')}</Label>
                        <Textarea
                            id="description"
                            placeholder={t('client.createContact.descriptionPlaceholder')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className={error ? 'border-red-500' : ''}
                        />
                    </div>

                    {error && (
                        <div className="mb-4">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                        <Button
                            type="button"
                            onClick={handleCancel}
                            variant="outline"
                            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            {t('client.createContact.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? t('client.createContact.saving') : t('client.createContact.save')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

