/**
 * App Header Component
 * Shared header component for all pages
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface AppHeaderProps {
    currentPage?: 'home' | 'engineers' | 'services' | 'contact';
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentPage = 'home' }) => {
    const { t } = useLanguage();

    const linkClass = (page: string) => {
        const baseClass = "font-medium transition-colors";
        return currentPage === page
            ? `${baseClass} text-blue-600 dark:text-blue-400`
            : `${baseClass} text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400`;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            SKILL BRIDGE
                        </h1>
                    </Link>

                    {/* Navigation Menu */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/" className={linkClass('home')}>
                            {t('navigation.home')}
                        </Link>
                        <Link href="/engineers" className={linkClass('engineers')}>
                            {t('navigation.engineers')}
                        </Link>
                        <Link href="/services" className={linkClass('services')}>
                            {t('navigation.services')}
                        </Link>
                        <Link href="/contact" className={linkClass('contact')}>
                            {t('navigation.contact')}
                        </Link>
                    </nav>

                    {/* Language Switcher & Login Button */}
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link href="/login">
                            <Button variant="outline" className="font-medium">
                                {t('navigation.login')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;

