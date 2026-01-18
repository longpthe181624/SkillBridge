import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AdminContactFormProps {
  className?: string
}

export function AdminContactForm({ className }: AdminContactFormProps) {
  return (
    <section className={cn("mb-8", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Create New Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Company Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter company name"
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Contact Person *
                </label>
                <Input
                  type="text"
                  placeholder="Enter contact person name"
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
                  placeholder="Enter email address"
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Cancel
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Create Contact
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
