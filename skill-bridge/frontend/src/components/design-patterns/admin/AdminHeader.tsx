'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminHeaderProps {
  title?: string;
  titleKey?: string;
  userName?: string;
  darkMode?: boolean;
}

export default function AdminHeader({ title, titleKey, userName, darkMode = false }: AdminHeaderProps) {
  const { language } = useLanguage();
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Get user from localStorage
  let displayUserName = userName || 'Admin';
  let userInitials = 'A';
  
  if (typeof window !== 'undefined' && !userName) {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        displayUserName = user.fullName || user.email || 'Admin';
        // Get initials
        if (user.fullName) {
          const parts = user.fullName.split(' ');
          if (parts.length >= 2) {
            userInitials = `${parts[0][0]}${parts[1][0]}`.toUpperCase();
          } else {
            userInitials = user.fullName.substring(0, 2).toUpperCase();
          }
        } else if (user.email) {
          userInitials = user.email.substring(0, 2).toUpperCase();
        }
      }
    } catch (e) {
      // Ignore error
    }
  }

  const displayTitle = title || 'Master Data';
  
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const changePasswordLabel = language === 'ja' ? 'パスワード変更' : 'Change Password';

  if (darkMode) {
    return (
      <>
        <header className="bg-gray-800">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-white">SKILL BRIDGE</h1>
                <div className="h-6 w-px bg-gray-600"></div>
                <h2 className="text-xl font-semibold text-white">{displayTitle}</h2>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                      <Avatar className="w-8 h-8 bg-orange-500">
                        <AvatarFallback className="text-white font-medium text-sm">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white">{displayUserName}</span>
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

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{displayTitle}</h2>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8 bg-orange-500">
                      <AvatarFallback className="text-white font-medium text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-900">{displayUserName}</span>
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
