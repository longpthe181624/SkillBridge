import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatusBadge {
  label: string
  variant: 'available' | 'busy' | 'unavailable' | 'new'
}

interface ClientStatusBadgesProps {
  badges: StatusBadge[]
  className?: string
}

export function ClientStatusBadges({ badges, className }: ClientStatusBadgesProps) {
  const getBadgeVariant = (variant: string) => {
    switch (variant) {
      case 'available':
        return 'default'
      case 'busy':
        return 'secondary'
      case 'unavailable':
        return 'destructive'
      case 'new':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <section className={cn("mb-12", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Status Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            {badges.map((badge, index) => (
              <Badge 
                key={index} 
                variant={getBadgeVariant(badge.variant)}
                className={cn(
                  badge.variant === 'available' && 'bg-green-100 text-green-800',
                  badge.variant === 'busy' && 'bg-yellow-100 text-yellow-800',
                  badge.variant === 'unavailable' && 'bg-red-100 text-red-800',
                  badge.variant === 'new' && 'bg-blue-100 text-blue-800'
                )}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}