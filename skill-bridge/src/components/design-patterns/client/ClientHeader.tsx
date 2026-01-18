import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ClientHeaderProps {
  className?: string
}

export function ClientHeader({ className }: ClientHeaderProps) {
  return (
    <header className={cn("bg-white border-b border-gray-200 shadow-sm", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-blue-600">SKILL BRIDGE</div>
            <div className="text-gray-600 text-sm">Client Portal</div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
              Login
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}