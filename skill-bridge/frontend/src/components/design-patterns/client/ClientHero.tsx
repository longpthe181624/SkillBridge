import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ClientHeroProps {
  className?: string
}

export function ClientHero({ className }: ClientHeroProps) {
  return (
    <section className={cn("text-center mb-12 py-16", className)}>
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
        SKILL BRIDGE
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        日本とベトナムを結ぶ架け橋、オフショア開発プラットフォーム
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3">
          Primary Button
        </Button>
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3">
          Secondary Button
        </Button>
      </div>
    </section>
  )
}
