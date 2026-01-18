'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

export default function LoginPage() {
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = language === 'ja' ? 'メールアドレスを入力してください' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'ja' ? '有効なメールアドレスを入力してください' : 'Email is invalid';
    }

    if (!formData.password || formData.password.trim() === '') {
      newErrors.password = language === 'ja' ? 'パスワードを入力してください' : 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = language === 'ja' ? 'パスワードは8文字以上である必要があります' : 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      setErrors({ 
        submit: language === 'ja' 
          ? 'ログインに失敗しました。メールアドレスまたはパスワードを確認してください。' 
          : error.message || 'Login failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const loginTranslations = {
    en: {
      title: 'Login',
      email: 'Mail address',
      password: 'Password',
      login: 'Login',
      loggingIn: 'Logging in...',
    },
    ja: {
      title: 'ログイン',
      email: 'メールアドレス',
      password: 'パスワード',
      login: 'ログイン',
      loggingIn: 'ログイン中...',
    },
  };

  const translations = loginTranslations[language as keyof typeof loginTranslations] || loginTranslations.en;

  return (
    <div className="min-h-screen flex relative" style={{
      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #FFFFFF 100%)'
    }}>
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/50 transition-colors bg-white/80 backdrop-blur-sm"
          >
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium">{language === 'ja' ? '日本語' : 'English'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showLanguageDropdown && (
            <>
              <div 
                className="fixed inset-0 z-0" 
                onClick={() => setShowLanguageDropdown(false)}
              />
              <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10 min-w-[150px]">
                <button
                  onClick={() => {
                    setLanguage('ja');
                    setShowLanguageDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>日本語</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLanguageDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span>English</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Container - Flexible Layout */}
      <div className="w-full flex items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-blue-600">
              SKILL BRIDGE_
            </h1>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-auto lg:flex-1 flex items-center justify-center lg:justify-center xl:justify-end p-6 md:p-8 lg:pr-12 xl:pr-36">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-normal mb-8 text-center text-gray-900">
              {translations.title}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-6">
                <Label htmlFor="email" className="text-sm text-gray-700 mb-2 block">
                  {translations.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={emailFocused ? '' : 'example@landbridge.co.jp'}
                  value={formData.email}
                  onChange={handleEmailChange}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => {
                    setEmailFocused(false);
                  }}
                  className={`bg-blue-50 border-blue-200 rounded-md h-12 px-4 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <Label htmlFor="password" className="text-sm text-gray-700 mb-2 block">
                  {translations.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={passwordFocused ? '' : '••••••••••'}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => {
                      setPasswordFocused(false);
                    }}
                    className={`bg-blue-50 border-blue-200 rounded-md h-12 px-4 pr-12 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="mb-6 text-red-500 text-sm text-center">{errors.submit}</div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-base"
                disabled={loading}
              >
                {loading ? translations.loggingIn : translations.login}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                {language === 'ja' ? 'パスワードを忘れた場合' : 'Forgot password'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}

