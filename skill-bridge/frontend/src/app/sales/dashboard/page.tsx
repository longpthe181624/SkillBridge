'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, RefreshCw } from 'lucide-react';
import SalesSidebar from '@/components/design-patterns/sales/SalesSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  getDashboardSummary,
  getDashboardApprovals,
  getDashboardActivities,
  DashboardSummary,
  ApprovalItem,
  ActivityItem,
} from '@/services/salesDashboardService';

export default function SalesDashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dashboard data
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Load user and token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    } else {
      router.push('/sales/login');
    }
  }, [router]);

  // Redirect if not authenticated or not sales user
  useEffect(() => {
    if (user && user.role !== 'SALES_MANAGER' && user.role !== 'SALES_REP') {
      router.push('/sales/login');
    }
  }, [user, router]);

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const [summaryData, approvalsData, activitiesData] = await Promise.all([
        getDashboardSummary(token),
        getDashboardApprovals(token),
        getDashboardActivities(token),
      ]);

      setSummary(summaryData);
      setApprovals(approvalsData.approvals || []);
      setActivities(activitiesData.activities || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      loadDashboardData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const isSalesManager = user?.role === 'SALES_MANAGER';

  // Format currency
  const formatCurrency = (value: number): string => {
    return `¥${value.toLocaleString('ja-JP')}`;
  };

  // Format date
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  if (!user || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <SalesSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-gray-800 text-white">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t('sales.dashboard.title') || 'Dashboard'}</h2>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-white hover:bg-gray-700"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {t('sales.dashboard.refresh') || 'Refresh'}
                </Button>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{user.name || user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading dashboard...</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Section */}
              <section>
                <h2 className="text-lg font-semibold mb-4">{t('sales.dashboard.summary') || 'Summary'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {/* Contacts Card */}
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/sales/contacts')}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {t('sales.dashboard.contacts') || 'Contacts'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary?.contacts.all || 0}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {summary?.contacts.new || 0} {t('sales.dashboard.new') || '(New)'}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Opportunities Card */}
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/sales/opportunities')}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {t('sales.dashboard.opportunities') || 'Opportunities'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary?.opportunities.all || 0}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {summary?.opportunities.underReview || 0} {t('sales.dashboard.underReview') || '(Under Review)'}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Proposals Card */}
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/sales/opportunities')}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {t('sales.dashboard.proposals') || 'Proposals'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary?.proposals.all || 0}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {summary?.proposals.underReview || 0} {t('sales.dashboard.underReview') || '(Under Review)'}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contracts Card */}
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/sales/contracts')}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {t('sales.dashboard.contracts') || 'Contracts'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary?.contracts.all || 0}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {summary?.contracts.underReview || 0} {t('sales.dashboard.underReview') || 'Under review'}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Change Requests Card */}
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/sales/contracts')}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {t('sales.dashboard.cr') || 'CR'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary?.changeRequests.all || 0}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {summary?.changeRequests.underReview || 0} {t('sales.dashboard.underReview') || 'Under review'}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Revenue Card (Sales Manager only) */}
                  {isSalesManager && summary?.revenue && (
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {t('sales.dashboard.revenue') || 'Revenue'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {summary.revenue.length > 0 ? (
                          <div className="space-y-1">
                            {summary.revenue.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium">{item.month}:</span>{' '}
                                <span className="text-gray-700">{formatCurrency(item.amount)}</span>
                              </div>
                            ))}
                            {summary.revenue.length > 2 && (
                              <div className="text-xs text-gray-400">...</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No revenue data</div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>

              {/* Approvals Waiting from Client Section */}
              <section>
                <h2 className="text-lg font-semibold mb-4">
                  {t('sales.dashboard.approvalsWaiting') || 'Approvals Waiting from Client'}
                </h2>
                <Card>
                  <CardContent className="pt-6">
                    {approvals.length > 0 ? (
                      <div className="space-y-3">
                        {approvals.map((approval) => (
                          <div
                            key={approval.id}
                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              if (approval.entityType === 'PROPOSAL') {
                                router.push(`/sales/opportunities/${approval.entityId}`);
                              } else if (approval.entityType === 'SOW') {
                                router.push(`/sales/contracts/sow/${approval.entityId}`);
                              } else if (approval.entityType === 'MSA') {
                                router.push(`/sales/contracts/${approval.entityId}`);
                              }
                            }}
                          >
                            <div className="text-sm font-medium">{approval.description}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm py-4 text-center">
                        {t('sales.dashboard.noApprovals') || 'No approvals waiting from clients'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Recent Client Activity Section */}
              <section>
                <h2 className="text-lg font-semibold mb-4">
                  {t('sales.dashboard.recentActivity') || 'Recent Client Activity'}
                </h2>
                <Card>
                  <CardContent className="pt-6">
                    {activities.length > 0 ? (
                      <div className="space-y-3">
                        {activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              if (activity.entityType === 'CHANGE_REQUEST') {
                                // Navigate to contract detail with CR tab
                                router.push(`/sales/contracts/sow/${activity.entityId}`);
                              }
                            }}
                          >
                            <div className="text-sm">
                              <span className="font-medium">{activity.description}</span>
                              <span className="text-gray-500 ml-2">({activity.timeAgo})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm py-4 text-center">
                        {t('sales.dashboard.noActivities') || 'No recent client activity'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

