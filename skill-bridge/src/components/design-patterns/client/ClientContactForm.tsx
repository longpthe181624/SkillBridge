import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ClientContactFormProps {
  className?: string
}

export function ClientContactForm({ className }: ClientContactFormProps) {
  return (
    <section className={cn("mb-12", className)}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 text-center">Contact Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Name *
              </label>
              <Input
                type="text"
                placeholder="Enter your name"
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email *
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Company
              </label>
              <Input
                type="text"
                placeholder="Enter your company name"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Message *
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell us about your project requirements"
                required
              />
            </div>
            
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}