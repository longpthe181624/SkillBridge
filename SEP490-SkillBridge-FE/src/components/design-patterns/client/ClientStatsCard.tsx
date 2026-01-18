import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ClientStatsCardProps {
  value: string
  label: string
  className?: string
}

export function ClientStatsCard({ value, label, className }: ClientStatsCardProps) {
  return (
    <Card className={cn("bg-white border border-gray-200 shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="text-3xl font-bold text-blue-600 mb-2">{value}</div>
        <div className="text-gray-600">{label}</div>
      </CardContent>
    </Card>
  )
}
