'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/design-patterns/admin/AdminSidebar';
import AdminHeader from '@/components/design-patterns/admin/AdminHeader';
import { getDashboardSummary, AdminDashboardSummary } from '@/services/adminDashboardService';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        if (userData.role !== 'ADMIN') {
          router.push('/admin/login');
        }
      } catch (e) {
        console.error('Error parsing user:', e);
        router.push('/admin/login');
      }
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch dashboard summary
  useEffect(() => {
    if (user) {
      loadDashboardSummary();
    }
  }, [user]);

  const loadDashboardSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error: any) {
      console.error('Error loading dashboard summary:', error);
      setError(error.message || 'Failed to load dashboard summary');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title={t('admin.dashboard.title')} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.dashboard.summary')}</h1>
          
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">{t('admin.dashboard.loading')}</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Engineer Card */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.dashboard.engineer')}</h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {summary.engineers.active}({t('admin.dashboard.active')})
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {summary.engineers.inactive}({t('admin.dashboard.inactive')})
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System User Card */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.dashboard.systemUser')}</h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {summary.systemUsers.active}({t('admin.dashboard.active')})
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {summary.systemUsers.inactive}({t('admin.dashboard.inactive')})
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Card */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.dashboard.skills')}</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.skills.total}({t('admin.dashboard.total')})
                  </div>
                </CardContent>
              </Card>

              {/* Project Type Card */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.dashboard.projectType')}</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.projectTypes.total}({t('admin.dashboard.total')})
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

