'use client';

/**
 * Contact Page Component
 * Story-04: Guest Contact Request
 * Allows guests to submit contact requests without authentication
 */

import React, { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitContactForm, type ContactFormData } from '@/services/contactService';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    title: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('contact.validation.name.required');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('contact.validation.name.minLength');
    } else if (formData.name.trim().length > 100) {
      newErrors.name = t('contact.validation.name.maxLength');
    }

    // Company name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = t('contact.validation.companyName.required');
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = t('contact.validation.companyName.minLength');
    } else if (formData.companyName.trim().length > 100) {
      newErrors.companyName = t('contact.validation.companyName.maxLength');
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = t('contact.validation.phone.required');
    } else if (!/^[\d\-\+\(\)\s]+$/.test(formData.phone.trim())) {
      newErrors.phone = t('contact.validation.phone.invalid');
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('contact.validation.email.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('contact.validation.email.invalid');
    }

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = t('contact.validation.title.required');
    } else if (formData.title.trim().length < 2) {
      newErrors.title = t('contact.validation.title.minLength');
    } else if (formData.title.trim().length > 255) {
      newErrors.title = t('contact.validation.title.maxLength');
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t('contact.validation.message.required');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.validation.message.minLength');
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = t('contact.validation.message.maxLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitContactForm(formData);
      
      if (response.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(response.message || t('contact.error.submit'));
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t('contact.error.submit'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev: ContactFormData) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Partial<Record<keyof ContactFormData, string>>) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <AppHeader currentPage="contact" />
        <main className="container mx-auto px-4 py-16 md:py-24">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('contact.success.title')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('contact.success.description')}
              </p>
              <p className="text-md text-gray-500 dark:text-gray-500">
                {t('contact.success.emailSent')} {formData.email}.
              </p>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    companyName: '',
                    phone: '',
                    email: '',
                    title: '',
                    message: ''
                  });
                }}
                variant="outline"
                className="mt-4"
              >
                {t('contact.success.submitAnother')}
              </Button>
            </CardContent>
          </Card>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <AppHeader currentPage="contact" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('contact.description')}
            </p>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t('contact.form.name')} <span className="text-red-500">{t('contact.form.required')}</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                    placeholder={t('contact.form.placeholder.name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Company Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    {t('contact.form.companyName')} <span className="text-red-500">{t('contact.form.required')}</span>
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('companyName', e.target.value)}
                    placeholder={t('contact.form.placeholder.companyName')}
                    className={errors.companyName ? 'border-red-500' : ''}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.companyName}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {t('contact.form.phone')} <span className="text-red-500">{t('contact.form.required')}</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                    placeholder={t('contact.form.placeholder.phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t('contact.form.email')} <span className="text-red-500">{t('contact.form.required')}</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                    placeholder={t('contact.form.placeholder.email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Title Field */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {t('contact.form.title')} <span className="text-red-500">{t('contact.form.required')}</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                    placeholder={t('contact.form.placeholder.title')}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message">
                    {t('contact.form.message')} <span className="text-red-500">{t('contact.form.required')}</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('message', e.target.value)}
                    placeholder={t('contact.form.placeholder.message')}
                    rows={5}
                    className={errors.message ? 'border-red-500' : ''}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Error */}
                {submitError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {submitError}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('contact.form.submitting')}
                    </>
                  ) : (
                    t('contact.form.submit')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

