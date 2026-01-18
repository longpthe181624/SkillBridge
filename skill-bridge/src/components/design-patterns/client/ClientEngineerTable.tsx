import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface Engineer {
  id: string
  name: string
  title: string
  skills: string[]
  experience: string
  location: string
}

interface ClientEngineerTableProps {
  engineers: Engineer[]
  className?: string
}

export function ClientEngineerTable({ engineers, className }: ClientEngineerTableProps) {
  return (
    <section className={cn("mb-12", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Engineer Profiles</CardTitle>
          <p className="text-gray-600">Browse available engineers</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Engineer</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {engineers.map((engineer) => (
                <TableRow key={engineer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {engineer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-gray-800 font-medium">{engineer.name}</div>
                        <div className="text-gray-600 text-sm">{engineer.title}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {engineer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-800">{engineer.experience}</TableCell>
                  <TableCell className="text-gray-800">{engineer.location}</TableCell>
                  <TableCell>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}