'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPassword } from '@/services/authService';
import { useLanguage } from '@/contexts/LanguageContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const translations = {
    en: {
      title: 'Forgot password',
      email: 'Email',
      send: 'Send',
      sending: 'Sending...',
      backToLogin: 'Back to login',
      success: 'If an account exists with this email, a password reset link has been sent.',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email address',
      failed: 'Failed to send reset email',
    },
    ja: {
      title: 'パスワードを忘れた場合',
      email: 'メールアドレス',
      send: '送信',
      sending: '送信中...',
      backToLogin: 'ログインに戻る',
      success: 'このメールアドレスにアカウントが存在する場合、パスワードリセットリンクが送信されました。',
      emailRequired: 'メールアドレスを入力してください',
      emailInvalid: '有効なメールアドレスを入力してください',
      failed: 'リセットメールの送信に失敗しました',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t.emailRequired);
      return;
    }

    if (!validateEmail(email)) {
      setError(t.emailInvalid);
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
      setError(error instanceof Error ? error.message : t.failed);
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
          {t.title}
        </h2>

        {success ? (
          <div className="text-center py-4">
            <p className="text-green-600 mb-4">
              {t.success}
            </p>
            <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {t.backToLogin}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={language === 'ja' ? 'example@landbridge.co.jp' : 'abc@gmail.com'}
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
              {loading ? t.sending : t.send}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-gray-600 underline hover:text-gray-800"
              >
                {t.backToLogin}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

