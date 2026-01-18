'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPassword } from '@/services/authService';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({
                                                isOpen,
                                                onClose,
                                            }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const validateEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            await forgotPassword(email);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setEmail('');
            }, 3000);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-8 w-full max-w-md relative border border-gray-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl font-bold hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-normal text-gray-800 text-center mb-6">
                    Forgot password
                </h2>

                {success ? (
                    <div className="text-center py-4">
                        <p className="text-green-600 mb-4">
                            If an account exists with this email, a password reset link has been sent.
                        </p>
                        <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Back to login
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="mb-6">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="abc@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={error ? 'border-red-500' : ''}
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-1">{error}</p>
                            )}
                        </div>

                        {/* Send Button */}
                        <Button
                            type="submit"
                            className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send'}
                        </Button>

                        {/* Back to Login Link */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-sm text-gray-600 underline hover:text-gray-800"
                            >
                                Back to login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

