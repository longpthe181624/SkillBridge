'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/services/dashboardService';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

interface AlertsSectionProps {
  alerts: Alert[];
}

export default function AlertsSection({ alerts }: AlertsSectionProps) {
  const router = useRouter();

  const handleAlertClick = (alert: Alert) => {
    // Navigate to relevant detail page based on entity type
    switch (alert.entityType) {
      case 'changeRequest':
        // Change requests are accessed through contracts
        router.push(`/client/contracts`);
        break;
      case 'contract':
        router.push(`/client/contracts/${alert.entityId}`);
        break;
      case 'proposal':
        router.push(`/client/proposals`);
        break;
      case 'contact':
        router.push(`/client/contacts/${alert.entityId}`);
        break;
      default:
        break;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MEDIUM':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'LOW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">No alerts or notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={`${alert.entityType}-${alert.entityId}-${index}`}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-red-500"
              onClick={() => handleAlertClick(alert)}
            >
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge className={getPriorityColor(alert.priority)}>
                    {alert.priority}
                  </Badge>
                </div>
                <p className="text-gray-900">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

