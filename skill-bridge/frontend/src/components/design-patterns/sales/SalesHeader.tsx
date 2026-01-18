'use client';

import { useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

interface SalesHeaderProps {
  title?: string;
  titleKey?: string;
  className?: string;
  darkMode?: boolean;
}

export default function SalesHeader({ title, titleKey, className, darkMode = false }: SalesHeaderProps) {
  const { t, language } = useLanguage();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userInitials, setUserInitials] = useState('U');

  // Get user from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Get initials
          if (userData.fullName) {
            const parts = userData.fullName.split(' ');
            if (parts.length >= 2) {
              setUserInitials(`${parts[0][0]}${parts[1][0]}`.toUpperCase());
            } else {
              setUserInitials(userData.fullName.substring(0, 2).toUpperCase());
            }
          } else if (userData.email) {
            setUserInitials(userData.email.substring(0, 2).toUpperCase());
          }
        }
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  const displayTitle = titleKey ? t(titleKey) : (title || '');
  const userName = user?.fullName || user?.email || user?.name || 'User';
  
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const changePasswordLabel = language === 'ja' ? 'パスワード変更' : 'Change Password';

  if (darkMode) {
    return (
      <>
        <header className={cn("bg-gray-800 text-white", className)}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{displayTitle}</h2>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                      <Avatar className="w-8 h-8 bg-blue-600">
                        <AvatarFallback className="text-white font-medium text-sm">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white">{userName}</span>
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
      <header className={cn("bg-white border-b border-gray-200", className)}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{displayTitle}</h2>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8 bg-blue-600">
                      <AvatarFallback className="text-white font-medium text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-900 text-sm">{userName}</span>
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

