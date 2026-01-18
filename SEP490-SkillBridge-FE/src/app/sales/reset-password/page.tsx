'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '@/services/authService';

function SalesResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            setErrors({ submit: language === 'ja' ? 'リセットトークンが見つかりません' : 'Reset token not found' });
        } else {
            setToken(tokenParam);
        }
    }, [searchParams, language]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.newPassword || formData.newPassword.trim() === '') {
            newErrors.newPassword = language === 'ja' ? '新しいパスワードを入力してください' : 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = language === 'ja' ? 'パスワードは8文字以上である必要があります' : 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword || formData.confirmPassword.trim() === '') {
            newErrors.confirmPassword = language === 'ja' ? '確認パスワードを入力してください' : 'Confirm password is required';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = language === 'ja' ? 'パスワードが一致しません' : 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !token) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            await resetPassword({
                token,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            setSuccess(true);
            setTimeout(() => {
                router.push('/sales/login');
            }, 2000);
        } catch (error: any) {
            setErrors({
                submit: error.message || (language === 'ja' ? 'パスワードのリセットに失敗しました' : 'Failed to reset password')
            });
        } finally {
            setLoading(false);
        }
    };

    const translations = {
        en: {
            title: 'Reset Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            reset: 'Reset Password',
            resetting: 'Resetting...',
            success: 'Password reset successfully. Redirecting to login...',
            backToLogin: 'Back to Login',
        },
        ja: {
            title: 'パスワードリセット',
            newPassword: '新しいパスワード',
            confirmPassword: '確認パスワード',
            reset: 'パスワードをリセット',
            resetting: 'リセット中...',
            success: 'パスワードが正常にリセットされました。ログインページにリダイレクトしています...',
            backToLogin: 'ログインに戻る',
        },
    };

    const t = translations[language as keyof typeof translations] || translations.en;

    return (
        <div className="min-h-screen flex relative" style={{
            background: 'linear-gradient(135deg, #FFB366 0%, #FFD4A3 40%, #FFFFFF 80%)'
        }}>
            <div className="w-full flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-8 border border-gray-200">
                    <h2 className="text-4xl font-normal mb-8 text-center text-gray-900">
                        {t.title}
                    </h2>

                    {success ? (
                        <div className="text-center py-4">
                            <p className="text-green-600 mb-4">{t.success}</p>
                            <Button
                                onClick={() => router.push('/sales/login')}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                {t.backToLogin}
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {/* New Password Input */}
                            <div className="mb-6">
                                <Label htmlFor="newPassword" className="text-sm text-gray-700 mb-2 block">
                                    {t.newPassword}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder="••••••••••"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        className={`bg-orange-50 border-orange-200 rounded-md h-12 px-4 pr-12 ${
                                            errors.newPassword ? 'border-red-500' : ''
                                        }`}
                                        disabled={loading || !token}
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
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                                )}
                            </div>

                            {/* Confirm Password Input */}
                            <div className="mb-6">
                                <Label htmlFor="confirmPassword" className="text-sm text-gray-700 mb-2 block">
                                    {t.confirmPassword}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className={`bg-orange-50 border-orange-200 rounded-md h-12 px-4 pr-12 ${
                                            errors.confirmPassword ? 'border-red-500' : ''
                                        }`}
                                        disabled={loading || !token}
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
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {errors.submit && (
                                <div className="mb-6 text-red-500 text-sm text-center">{errors.submit}</div>
                            )}

                            {/* Reset Password Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-base"
                                disabled={loading || !token}
                            >
                                {loading ? t.resetting : t.reset}
                            </Button>

                            {/* Back to Login Link */}
                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    onClick={() => router.push('/sales/login')}
                                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                                >
                                    {t.backToLogin}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SalesResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <SalesResetPasswordForm />
        </Suspense>
    );
}

