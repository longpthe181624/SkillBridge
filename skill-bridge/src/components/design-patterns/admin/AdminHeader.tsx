import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  notificationCount?: number
  userInitials?: string
  userName?: string
  userRole?: string
  className?: string
}

export function AdminHeader({ 
  notificationCount = 0, 
  userInitials = "SM", 
  userName = "Sales Manager",
  userRole = "Sales Manager",
  className 
}: AdminHeaderProps) {
  return (
    <header className={cn("bg-white border-b border-gray-200 shadow-sm", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-800">SkillBridge Platform</div>
            <Badge variant="outline" className="text-orange-500 border-orange-500">
              Admin/Sales Portal
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            {notificationCount > 0 && (
              <Button variant="ghost" size="icon" className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0 15 0v5z" />
                </svg>
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                  {notificationCount}
                </Badge>
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{userName}</div>
                <div className="text-xs text-gray-500">{userRole}</div>
              </div>
              <Avatar className="w-8 h-8 bg-orange-500">
                <AvatarFallback className="text-white font-medium text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}