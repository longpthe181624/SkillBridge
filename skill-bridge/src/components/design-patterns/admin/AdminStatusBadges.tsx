import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatusBadge {
  label: string
  variant: 'new' | 'in-progress' | 'verified' | 'converted' | 'closed' | 'high' | 'medium' | 'low' | 'urgent'
}

interface AdminStatusBadgesProps {
  badges: StatusBadge[]
  className?: string
}

export function AdminStatusBadges({ badges, className }: AdminStatusBadgesProps) {
  const getBadgeVariant = (variant: string) => {
    switch (variant) {
      case 'new':
        return 'default'
      case 'in-progress':
        return 'secondary'
      case 'verified':
        return 'default'
      case 'converted':
        return 'default'
      case 'closed':
        return 'outline'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'default'
      case 'urgent':
        return 'destructive'
      default:
        return 'default'
    }
  }

  const getBadgeClassName = (variant: string) => {
    switch (variant) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'converted':
        return 'bg-purple-100 text-purple-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={cn("mb-8", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Status Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {badges.map((badge, index) => (
              <Badge 
                key={index} 
                variant={getBadgeVariant(badge.variant)}
                className={getBadgeClassName(badge.variant)}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}