'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mail, FileText, FileCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ClientSidebarProps {
    className?: string;
}

export function ClientSidebar({ className }: ClientSidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const { t } = useLanguage();

    const menuItems = [
        {
            id: 'dashboard',
            labelKey: 'client.sidebar.dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            href: '/client/dashboard',
        },
        {
            id: 'contacts',
            labelKey: 'client.sidebar.contactForm',
            icon: <Mail className="w-5 h-5" />,
            href: '/client/contacts',
        },
        {
            id: 'proposals',
            labelKey: 'client.sidebar.proposal',
            icon: <FileText className="w-5 h-5" />,
            href: '/client/proposals',
        },
        {
            id: 'contract',
            labelKey: 'client.sidebar.contract',
            icon: <FileCheck className="w-5 h-5" />,
            href: '/client/contracts',
        },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <aside className={cn("w-64 bg-gray-800 min-h-screen flex flex-col", className)}>
            {/* Logo/Title */}
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-xl font-bold text-white">SKILL BRIDGE</h1>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.id === 'contacts' && pathname?.startsWith('/client/contacts')) ||
                            (item.id === 'proposals' && pathname?.startsWith('/client/proposals')) ||
                            (item.id === 'contract' && pathname?.startsWith('/client/contracts'));

                        return (
                            <Link key={item.id} href={item.href}>
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className={cn(
                                        "w-full justify-start px-4 py-3 h-auto",
                                        isActive
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        {item.icon}
                                        <span>{t(item.labelKey)}</span>
                                    </div>
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700">
                <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-3 h-auto text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={handleLogout}
                >
                    <div className="flex items-center space-x-3">
                        <LogOut className="w-5 h-5" />
                        <span>{t('client.sidebar.logout')}</span>
                    </div>
                </Button>
            </div>
        </aside>
    );
}

