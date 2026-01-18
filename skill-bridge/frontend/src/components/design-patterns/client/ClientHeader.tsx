'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ChangePasswordModal from '@/components/ChangePasswordModal';

interface ClientHeaderProps {
  title?: string;
  titleKey?: string;
  className?: string;
}

export function ClientHeader({ title, titleKey, className }: ClientHeaderProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [showChangePassword, setShowChangePassword] = useState(false);

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
  
  // Get title from translation key or use provided title
  const displayTitle = titleKey ? t(titleKey) : (title || '');

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const changePasswordLabel = language === 'ja' ? 'パスワード変更' : 'Change Password';

  return (
    <>
      <header className={cn("bg-white border-b border-gray-200", className)}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Page Title */}
            <h2 className="text-xl font-semibold text-gray-900">{displayTitle}</h2>

            {/* Language Switcher and User Information */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* User Information with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8 bg-blue-600">
                      <AvatarFallback className="text-white text-sm font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-900 text-sm">
                      {userName}様
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowChangePassword(true)}
                    className="cursor-pointer"
                  >
                    {changePasswordLabel}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {token && (
        <ChangePasswordModal
          isOpen={showChangePassword}
          onClose={() => setShowChangePassword(false)}
          token={token}
        />
      )}
    </>
  );
}
