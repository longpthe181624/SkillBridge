'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Activity } from '@/services/dashboardService';
import { useRouter } from 'next/navigation';

interface ActivityTimelineProps {
    activities: Activity[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
    const router = useRouter();

    const handleActivityClick = (activity: Activity) => {
        // Navigate to relevant detail page based on entity type
        switch (activity.entityType) {
            case 'contact':
                router.push(`/client/contacts/${activity.entityId}`);
                break;
            case 'proposal':
                router.push(`/client/proposals`);
                break;
            case 'contract':
                router.push(`/client/contracts/${activity.entityId}`);
                break;
            case 'changeRequest':
                // Change requests are accessed through contracts
                router.push(`/client/contracts`);
                break;
            default:
                break;
        }
    };

    if (activities.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-gray-500 text-center">No recent activities</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-3">
                    {activities.map((activity, index) => (
                        <div
                            key={`${activity.entityType}-${activity.entityId}-${index}`}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleActivityClick(activity)}
                        >
                            <div className="flex-shrink-0">
                                <span className="text-sm text-gray-600">[{activity.date}]</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900">{activity.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

