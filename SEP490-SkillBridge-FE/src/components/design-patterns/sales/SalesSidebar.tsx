'use client';

import { usePathname } from 'next/navigation';
import { Grid, Mail, FileText } from 'lucide-react';

export default function SalesSidebar() {
    const pathname = usePathname();

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
                        <span>Dashboard</span>
                    </a>
                    <a
                        href="/sales/contacts"
                        className={getMenuItemClass('/sales/contacts')}
                    >
                        <Mail className="w-5 h-5" />
                        <span>Contact</span>
                    </a>
                    <a
                        href="/sales/opportunities"
                        className={getMenuItemClass('/sales/opportunities')}
                    >
                        <FileText className="w-5 h-5" />
                        <span>Opportunities</span>
                    </a>
                    <a
                        href="/sales/contracts"
                        className={getMenuItemClass('/sales/contracts')}
                    >
                        <FileText className="w-5 h-5" />
                        <span>Contract</span>
                    </a>
                </div>
            </nav>
        </aside>
    );
}

