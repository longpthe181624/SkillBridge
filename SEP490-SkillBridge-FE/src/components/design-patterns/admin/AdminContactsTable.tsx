import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface Contact {
  id: string
  company: string
  industry: string
  contactPerson: string
  email: string
  status: string
  priority: string
  created: string
}

interface AdminContactsTableProps {
  contacts: Contact[]
  className?: string
}

export function AdminContactsTable({ contacts, className }: AdminContactsTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'New': { variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      'In Progress': { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'Verified': { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'Converted': { variant: 'default' as const, className: 'bg-purple-100 text-purple-800' },
      'Closed': { variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['New']
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'Low': { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'Medium': { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'High': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      'Urgent': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    }
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['Medium']
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {priority}
      </Badge>
    )
  }

  return (
    <div className={cn("mb-8", className)}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Contacts</CardTitle>
              <p className="text-gray-600">Manage your client contacts</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              + New Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div className="font-medium text-gray-800">{contact.company}</div>
                    <div className="text-gray-600 text-sm">{contact.industry}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-800">{contact.contactPerson}</div>
                    <div className="text-gray-600 text-sm">{contact.email}</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(contact.status)}
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(contact.priority)}
                  </TableCell>
                  <TableCell className="text-gray-600">{contact.created}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-800">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
