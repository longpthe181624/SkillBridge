'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSummary } from '@/services/dashboardService';
import { useRouter } from 'next/navigation';

interface SummaryCardsProps {
  summary: DashboardSummary | null;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const router = useRouter();

  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <CardTitle className="h-4 bg-gray-200 rounded w-24"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Contacts Card */}
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleCardClick('/client/contacts')}
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold">Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {summary.contacts.inprogress} Inprogress
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {summary.contacts.new} new
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Card */}
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleCardClick('/client/proposals')}
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold">Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {summary.proposals.underReview} Under review
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {summary.proposals.reviewed} Reviewed
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Card */}
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleCardClick('/client/contracts')}
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold">Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {summary.contracts.active} Active
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {summary.contracts.draft} Draft
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Requests Card */}
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleCardClick('/client/contracts')}
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold">Change Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {summary.changeRequests.underReview} Under review
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {summary.changeRequests.approved} Approved
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

