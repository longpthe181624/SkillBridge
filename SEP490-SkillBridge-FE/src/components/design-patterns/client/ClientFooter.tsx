import { cn } from "@/lib/utils"

interface ClientFooterProps {
  className?: string
}

export function ClientFooter({ className }: ClientFooterProps) {
  return (
    <footer className={cn("bg-gray-100 border-t border-gray-200 mt-12", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 SkillBridge Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
