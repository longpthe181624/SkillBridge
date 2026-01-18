'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Grid, Mail, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SalesSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login
    router.push('/sales/login');
  };

  const isActive = (path: string) => {
    if (path === '/sales/dashboard') {
      return pathname === '/sales/dashboard';
    }
    if (path === '/sales/contacts') {
      return pathname.startsWith('/sales/contacts');
    }
    if (path === '/sales/opportunities') {
      return pathname.startsWith('/sales/opportunities');
    }
    if (path === '/sales/contracts') {
      return pathname.startsWith('/sales/contracts');
    }
    return false;
  };

  const getMenuItemClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-3 px-4 py-3 rounded transition-colors ${
      active
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;
  };

  return (
    <aside className="w-64 bg-gray-800 min-h-screen flex flex-col">
      {/* Logo/Title */}
      <div className="p-6 border-b border-gray-700">
        <h1
          className="text-xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          SKILL BRIDGE_
        </h1>
      </div>
      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <a
            href="/sales/dashboard"
            className={getMenuItemClass('/sales/dashboard')}
          >
            <Grid className="w-5 h-5" />
            <span>{t('sales.sidebar.dashboard')}</span>
          </a>
          <a
            href="/sales/contacts"
            className={getMenuItemClass('/sales/contacts')}
          >
            <Mail className="w-5 h-5" />
            <span>{t('sales.sidebar.contact')}</span>
          </a>
          <a
            href="/sales/opportunities"
            className={getMenuItemClass('/sales/opportunities')}
          >
            <FileText className="w-5 h-5" />
            <span>{t('sales.sidebar.opportunities')}</span>
          </a>
          <a
            href="/sales/contracts"
            className={getMenuItemClass('/sales/contracts')}
          >
            <FileText className="w-5 h-5" />
            <span>{t('sales.sidebar.contract')}</span>
          </a>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-3 h-auto text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={handleLogout}
        >
          <div className="flex items-center space-x-3">
            <LogOut className="w-5 h-5" />
            <span>{t('sales.sidebar.logout')}</span>
          </div>
        </Button>
      </div>
    </aside>
  );
}

