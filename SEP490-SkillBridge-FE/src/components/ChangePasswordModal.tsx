'use client';

import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword } from '@/services/authService';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
}

export default function ChangePasswordModal({
                                                isOpen,
                                                onClose,
                                                token,
                                            }: ChangePasswordModalProps) {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const translations = {
        en: {
            title: 'Change Password',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            change: 'Change Password',
            changing: 'Changing...',
            back: 'Back',
            success: 'Password changed successfully',
        },
        ja: {
            title: 'パスワード変更',
            currentPassword: '現在のパスワード',
            newPassword: '新しいパスワード',
            confirmPassword: '確認パスワード',
            change: 'パスワードを変更',
            changing: '変更中...',
            back: '戻る',
            success: 'パスワードが正常に変更されました',
        },
    };

    const tModal = translations[language as keyof typeof translations] || translations.en;

    const validateForm = () => {
        setError('');

        if (!formData.currentPassword) {
            setError(language === 'ja' ? '現在のパスワードを入力してください' : 'Current password is required');
            return false;
        }

        if (!formData.newPassword) {
            setError(language === 'ja' ? '新しいパスワードを入力してください' : 'New password is required');
            return false;
        }

        if (formData.newPassword.length < 8) {
            setError(language === 'ja' ? '新しいパスワードは8文字以上である必要があります' : 'New password must be at least 8 characters long');
            return false;
        }

        if (!formData.confirmPassword) {
            setError(language === 'ja' ? '確認パスワードを入力してください' : 'Confirm password is required');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError(language === 'ja' ? '新しいパスワードと確認パスワードが一致しません' : 'New password and confirm password do not match');
            return false;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError(language === 'ja' ? '新しいパスワードは現在のパスワードと異なる必要があります' : 'New password must be different from current password');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await changePassword(token, formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }, 2000);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : (language === 'ja' ? 'パスワードの変更に失敗しました' : 'Failed to change password'));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setError('');
        setSuccess(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-8 w-full max-w-md relative border border-gray-200">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-2xl font-bold hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-normal text-gray-800 text-center mb-6">
                    {tModal.title}
                </h2>

                {success ? (
                    <div className="text-center py-4">
                        <p className="text-green-600 mb-4">
                            {tModal.success}
                        </p>
                        <Button onClick={handleClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            {tModal.back}
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Current Password Input */}
                        <div className="mb-6">
                            <Label htmlFor="currentPassword" className="text-sm text-gray-700 mb-2 block">
                                {tModal.currentPassword}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    placeholder="••••••••••"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className={`bg-blue-50 border-blue-200 rounded-md h-12 px-4 pr-12 ${
                                        error ? 'border-red-500' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* New Password Input */}
                        <div className="mb-6">
                            <Label htmlFor="newPassword" className="text-sm text-gray-700 mb-2 block">
                                {tModal.newPassword}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="••••••••••"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className={`bg-blue-50 border-blue-200 rounded-md h-12 px-4 pr-12 ${
                                        error ? 'border-red-500' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="mb-6">
                            <Label htmlFor="confirmPassword" className="text-sm text-gray-700 mb-2 block">
                                {tModal.confirmPassword}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className={`bg-blue-50 border-blue-200 rounded-md h-12 px-4 pr-12 ${
                                        error ? 'border-red-500' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4">
                                <p className="text-red-500 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Change Password Button */}
                        <Button
                            type="submit"
                            className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-md font-bold text-base"
                            disabled={loading}
                        >
                            {loading ? tModal.changing : tModal.change}
                        </Button>

                        {/* Back Button */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="text-sm text-gray-600 underline hover:text-gray-800"
                            >
                                {tModal.back}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

