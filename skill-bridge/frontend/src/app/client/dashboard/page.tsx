'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClientSidebar } from '@/components/design-patterns/client/ClientSidebar';
import { ClientHeader } from '@/components/design-patterns/client/ClientHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { 
  getDashboardSummary,
  getDashboardActivities,
  getDashboardAlerts,
  DashboardSummary,
  ActivitiesResponse,
  AlertsResponse
} from '@/services/dashboardService';
import SummaryCards from '@/components/dashboard/SummaryCards';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import AlertsSection from '@/components/dashboard/AlertsSection';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [activities, setActivities] = useState<ActivitiesResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch dashboard data
  const fetchDashboardData = async (isRefresh = false) => {
    if (!token || !isAuthenticated) return;
    
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch all data in parallel
      const [summaryData, activitiesData, alertsData] = await Promise.all([
        getDashboardSummary(token),
        getDashboardActivities(token, 10),
        getDashboardAlerts(token, 10)
      ]);

      setSummary(summaryData);
      setActivities(activitiesData);
      setAlerts(alertsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDashboardData();
    }
  }, [isAuthenticated, token]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, token]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <ClientSidebar />
        <div className="flex-1 flex flex-col">
          <ClientHeader titleKey="client.header.title.dashboard" />
          <main className="flex-1 p-6 bg-gray-50">
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <ClientSidebar />
        <div className="flex-1 flex flex-col">
          <ClientHeader titleKey="client.header.title.dashboard" />
          <main className="flex-1 p-6 bg-gray-50">
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <Button onClick={handleRefresh} className="mt-4">
                Retry
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClientSidebar />
      <div className="flex-1 flex flex-col">
        <ClientHeader title="Dashboard" />
        <main className="flex-1 p-6 bg-gray-50">
          {/* Refresh Button */}
          <div className="mb-4 flex justify-end">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Summary Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
            <SummaryCards summary={summary} />
          </div>

          {/* Recent Activity Timeline Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Timeline</h2>
            <ActivityTimeline activities={activities?.activities || []} />
          </div>

          {/* Alerts / Notifications Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">■ Alerts / Notifications</h2>
            <AlertsSection alerts={alerts?.alerts || []} />
          </div>
        </main>
      </div>
    </div>
  );
}

