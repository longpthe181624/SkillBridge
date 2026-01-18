'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Grid, Users, FolderOpen, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useLanguage();
    const [masterDataExpanded, setMasterDataExpanded] = useState(true);

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        // Redirect to login
        router.push('/admin/login');
    };

    const isActive = (path: string) => {
        if (path === '/admin/master-data/skill') {
            return pathname === '/admin/master-data/skill';
        }
        if (path === '/admin/master-data/project-type') {
            return pathname === '/admin/master-data/project-type';
        }
        if (pathname?.startsWith('/admin/master-data')) {
            return path === '/admin/master-data';
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
                        href="/admin/dashboard"
                        className={getMenuItemClass('/admin/dashboard')}
                    >
                        <Grid className="w-5 h-5" />
                        <span>Dashboard</span>
                    </a>
                    <a
                        href="/admin/user"
                        className={getMenuItemClass('/admin/user')}
                    >
                        <Users className="w-5 h-5" />
                        <span>User</span>
                    </a>
                    <a
                        href="/admin/engineer"
                        className={getMenuItemClass('/admin/engineer')}
                    >
                        <Users className="w-5 h-5" />
                        <span>Engineer</span>
                    </a>

                    {/* Master Data - Expandable */}
                    <div>
                        <button
                            onClick={() => setMasterDataExpanded(!masterDataExpanded)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded transition-colors ${
                                pathname?.startsWith('/admin/master-data')
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <FolderOpen className="w-5 h-5" />
                                <span>Master Data</span>
                            </div>
                            <ChevronRight
                                className={`w-4 h-4 transition-transform duration-200 ${masterDataExpanded ? 'rotate-90' : ''}`}
                            />
                        </button>

                        {masterDataExpanded && (
                            <div className="ml-4 mt-2 space-y-1">
                                <a
                                    href="/admin/master-data/skill"
                                    className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${
                                        pathname === '/admin/master-data/skill'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <span>Skill</span>
                                </a>
                                <a
                                    href="/admin/master-data/project-type"
                                    className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${
                                        pathname === '/admin/master-data/project-type'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <span>Project Types</span>
                                </a>
                            </div>
                        )}
                    </div>
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
                        <span>Logout</span>
                    </div>
                </Button>
            </div>
        </aside>
    );
}
