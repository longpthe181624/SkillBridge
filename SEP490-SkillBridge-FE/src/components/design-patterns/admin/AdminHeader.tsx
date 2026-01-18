'use client';

import { User } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface AdminHeaderProps {
    title?: string;
    titleKey?: string;
    userName?: string;
}

export default function AdminHeader({ title, titleKey, userName }: AdminHeaderProps) {
    // Get user from localStorage
    let displayUserName = userName || 'Admin';

    if (typeof window !== 'undefined' && !userName) {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                displayUserName = user.fullName || user.email || 'Admin';
            }
        } catch (e) {
            // Ignore error
        }
    }

    const displayTitle = title || 'Master Data';

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{displayTitle}</h2>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-900">{displayUserName}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
