/**
 * App Header Component
 * Shared header component for all pages
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface AppHeaderProps {
  currentPage?: 'home' | 'engineers' | 'services' | 'contact';
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentPage = 'home' }) => {
  const { t } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const linkClass = (page: string) => {
    const baseClass = "font-medium transition-colors";
    return currentPage === page
      ? `${baseClass} text-blue-600 dark:text-blue-400`
      : `${baseClass} text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400`;
  };

  // Get user initials from full name
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userName = user?.fullName || user?.email || 'User';
  const initials = getInitials(user?.fullName || user?.email);

  // Get dashboard URL based on user role
  const getDashboardUrl = (role?: string) => {
    if (!role) return '/client/dashboard';
    
    const roleUpper = role.toUpperCase();
    if (roleUpper === 'SALES_MANAGER' || roleUpper === 'SALES_REP') {
      return '/sales/opportunities';
    } else if (roleUpper === 'ADMIN') {
      return '/admin/user';
    } else {
      // Default to client dashboard
      return '/client/contacts';
    }
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

          {/* Language Switcher & User/Login */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {!authLoading && isAuthenticated && user ? (
              <Link href={getDashboardUrl(user.role)}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <Avatar className="w-8 h-8 bg-blue-600">
                    <AvatarFallback className="text-white text-sm font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                    {userName}
                  </span>
                </div>
              </Link>
            ) : (
              <Link href="/client/login">
                <Button variant="outline" className="font-medium">
                  {t('navigation.login')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

