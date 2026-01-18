import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AdminStatsCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  iconColor?: 'blue' | 'orange' | 'green' | 'purple' | 'red' | 'yellow'
  className?: string
}

export function AdminStatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  iconColor = 'orange',
  className 
}: AdminStatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getIconBgColor = () => {
    switch (iconColor) {
      case 'blue':
        return 'bg-blue-100'
      case 'orange':
        return 'bg-orange-100'
      case 'green':
        return 'bg-green-100'
      case 'purple':
        return 'bg-purple-100'
      case 'red':
        return 'bg-red-100'
      case 'yellow':
        return 'bg-yellow-100'
      default:
        return 'bg-orange-100'
    }
  }

  const getIconTextColor = () => {
    switch (iconColor) {
      case 'blue':
        return 'text-blue-600'
      case 'orange':
        return 'text-orange-600'
      case 'green':
        return 'text-green-600'
      case 'purple':
        return 'text-purple-600'
      case 'red':
        return 'text-red-600'
      case 'yellow':
        return 'text-yellow-600'
      default:
        return 'text-orange-600'
    }
  }

  return (
    <Card className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {change && (
              <p className={cn("text-sm mt-2", getChangeColor())}>
                {change}
              </p>
            )}
          </div>
          {icon && (
            <div className={cn("p-3 rounded-lg", getIconBgColor())}>
              <div className={cn("w-6 h-6", getIconTextColor())}>
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}