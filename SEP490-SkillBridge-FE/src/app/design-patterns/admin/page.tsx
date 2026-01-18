"use client";

import React from 'react';
import { AdminHeader, AdminSidebar, AdminStatsCard, AdminContactForm, AdminContactsTable, AdminStatusBadges } from '@/components/design-patterns/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export default function AdminDesignPattern() {
    const contacts = [
        {
            id: "1",
            company: "Tech Corp",
            industry: "Technology",
            contactPerson: "Alice Johnson",
            email: "alice@example.com",
            status: "New",
            priority: "High",
            created: "2024-01-15"
        },
        {
            id: "2",
            company: "Startup Inc",
            industry: "Startup",
            contactPerson: "Bob Williams",
            email: "bob@example.com",
            status: "InProgress",
            priority: "Medium",
            created: "2024-01-20"
        },
        {
            id: "3",
            company: "Enterprise Ltd",
            industry: "Enterprise",
            contactPerson: "Charlie Brown",
            email: "charlie@example.com",
            status: "Converted",
            priority: "Low",
            created: "2024-01-10"
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar items={[
                { id: 'dashboard', label: 'Dashboard', icon: <span>📊</span>, isActive: true },
                { id: 'contacts', label: 'Contacts', icon: <span>👥</span>, badge: '5' },
                { id: 'projects', label: 'Projects', icon: <span>📁</span> },
                { id: 'reports', label: 'Reports', icon: <span>📈</span> },
                { id: 'settings', label: 'Settings', icon: <span>⚙️</span> }
            ]} />
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 p-8 space-y-8">
                    <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>

                    <section>
                        <h2 className="text-3xl font-bold mb-6 text-orange-700">Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AdminStatsCard title="New Contacts" value="150" change="+5% from last week" changeType="positive" />
                            <AdminStatsCard title="Opportunities" value="75" change="+10% from last week" changeType="positive" />
                            <AdminStatsCard title="Pending Reviews" value="20" change="-2% from last week" changeType="negative" />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-6 text-orange-700">Create New Contact</h2>
                        <AdminContactForm />
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-6 text-orange-700">Recent Contacts</h2>
                        <AdminContactsTable contacts={contacts} />
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-6 text-orange-700">Status Badges</h2>
                        <AdminStatusBadges badges={[
                            { label: 'New', variant: 'new' },
                            { label: 'In Progress', variant: 'in-progress' },
                            { label: 'Verified', variant: 'verified' },
                            { label: 'Converted', variant: 'converted' },
                            { label: 'Closed', variant: 'closed' },
                            { label: 'High Priority', variant: 'high' },
                            { label: 'Medium Priority', variant: 'medium' },
                            { label: 'Low Priority', variant: 'low' },
                            { label: 'Urgent', variant: 'urgent' }
                        ]} />
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-6 text-orange-700">Shadcn/ui Components Showcase</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Buttons</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    <Button>Primary Button</Button>
                                    <Button variant="secondary">Secondary Button</Button>
                                    <Button variant="outline">Outline Button</Button>
                                    <Button variant="destructive">Destructive Button</Button>
                                    <Button variant="ghost">Ghost Button</Button>
                                    <Button variant="link">Link Button</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Inputs</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Input placeholder="Text Input" />
                                    <Input type="email" placeholder="Email Input" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Badges</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    <Badge>Default</Badge>
                                    <Badge variant="secondary">Secondary</Badge>
                                    <Badge variant="outline">Outline</Badge>
                                    <Badge variant="destructive">Destructive</Badge>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Dialog (Modal)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Open Dialog</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-3">
                                <CardHeader>
                                    <CardTitle>Table</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {contacts.map((contact) => (
                                                <TableRow key={contact.id}>
                                                    <TableCell>{contact.id}</TableCell>
                                                    <TableCell>{contact.contactPerson}</TableCell>
                                                    <TableCell>{contact.email}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={contact.status === 'New' ? 'default' : 'secondary'}>
                                                            {contact.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => alert(`View ${contact.contactPerson}`)}>
                                                                    View
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => alert(`Edit ${contact.contactPerson}`)}>
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => alert(`Delete ${contact.contactPerson}`)}>
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
