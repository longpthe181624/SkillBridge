"use client";

import React from 'react';
import { ClientHeader, ClientHero, ClientStatsCard, ClientContactForm, ClientEngineerTable, ClientStatusBadges, ClientFooter } from '@/components/design-patterns/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ClientDesignPattern() {
    const engineers = [
        { id: '1', name: 'John Doe', title: 'Senior React Developer', skills: ['React', 'TypeScript', 'Node.js'], experience: '5 years', location: 'Tokyo, Japan', status: 'Available' },
        { id: '2', name: 'Jane Smith', title: 'Angular Specialist', skills: ['Angular', 'RxJS', 'Material UI'], experience: '7 years', location: 'Ho Chi Minh, Vietnam', status: 'Available' },
        { id: '3', name: 'Peter Jones', title: 'Vue.js Expert', skills: ['Vue.js', 'Nuxt.js', 'Vuetify'], experience: '3 years', location: 'Osaka, Japan', status: 'Busy' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <ClientHeader />

            <main className="container mx-auto px-4 py-8 space-y-12">
                <ClientHero />

                <section>
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Key Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ClientStatsCard value="1,200" label="Total Engineers" />
                        <ClientStatsCard value="50" label="Available Projects" />
                        <ClientStatsCard value="800+" label="Happy Clients" />
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Contact Us</h2>
                    <ClientContactForm />
                </section>

                <section>
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Engineer Showcase</h2>
                    <ClientEngineerTable engineers={engineers} />
                </section>

                <section>
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Status Badges</h2>
                    <ClientStatusBadges badges={[
                        { label: 'Available', variant: 'available' },
                        { label: 'Busy', variant: 'busy' },
                        { label: 'Unavailable', variant: 'unavailable' },
                        { label: 'New', variant: 'new' }
                    ]} />
                </section>

                <section>
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Shadcn/ui Components Showcase</h2>
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
                                            <TableHead>Skill</TableHead>
                                            <TableHead>Experience</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {engineers.map((engineer) => (
                                            <TableRow key={engineer.id}>
                                                <TableCell>{engineer.id}</TableCell>
                                                <TableCell>{engineer.name}</TableCell>
                                                <TableCell>{engineer.skills.join(', ')}</TableCell>
                                                <TableCell>{engineer.experience} years</TableCell>
                                                <TableCell>
                                                    <Badge variant={engineer.status === 'Available' ? 'default' : 'secondary'}>
                                                        {engineer.status}
                                                    </Badge>
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

            <ClientFooter />
        </div>
    );
}
