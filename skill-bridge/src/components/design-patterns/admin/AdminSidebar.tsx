import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  isActive?: boolean
  badge?: string
}

interface AdminSidebarProps {
  items: NavigationItem[]
  className?: string
}

export function AdminSidebar({ items, className }: AdminSidebarProps) {
  return (
    <aside className={cn("w-64 bg-gray-800 min-h-screen", className)}>
      <nav className="p-4">
        <div className="space-y-2">
          {items.map((item) => (
            <Button
              key={item.id}
              variant={item.isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start px-4 py-3 h-auto",
                item.isActive 
                  ? "bg-gray-700 text-white hover:bg-gray-700" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge className="bg-orange-500 text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </nav>
    </aside>
  )
}