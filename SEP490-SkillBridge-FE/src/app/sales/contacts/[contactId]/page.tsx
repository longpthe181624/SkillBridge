'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Search, Filter, Eye, User, ArrowLeft } from 'lucide-react';
import SalesSidebar from '@/components/design-patterns/sales/SalesSidebar';
import {
    getSalesContactDetail,
    updateSalesContact,
    addCommunicationLog,
    sendMeetingEmail,
    getSalesUsers,
    SalesContactDetail,
    UpdateContactRequest,
    CreateCommunicationLogRequest,
    SalesUser,
} from '@/services/salesContactDetailService';

export default function SalesContactDetailPage() {
    const router = useRouter();
    const params = useParams();
    const contactId = params.contactId as string;
    const { toast } = useToast();
    const [contact, setContact] = useState<SalesContactDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [formData, setFormData] = useState<UpdateContactRequest>({});
    const [newLogMessage, setNewLogMessage] = useState('');
    const [showAddLog, setShowAddLog] = useState(false);
    const [salesMen, setSalesMen] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showConvertModal, setShowConvertModal] = useState(false);

    // Check if user is assigned to this contact
    const isAssigned = contact?.assigneeUserId === user?.id;
    const isSalesManager = user?.role === 'SALES_MANAGER';

    // Load user and token from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                console.error('Error parsing user:', e);
                router.push('/sales/login');
            }
        } else {
            router.push('/sales/login');
        }
    }, [router]);

    // Redirect if not authenticated or not sales user
    useEffect(() => {
        if (user && user.role !== 'SALES_MANAGER' && user.role !== 'SALES_REP') {
            router.push('/sales/login');
        }
    }, [user, router]);

    // Fetch contact detail and sales users
    useEffect(() => {
        if (token && contactId) {
            fetchContactDetail();
            if (isSalesManager) {
                fetchSalesUsers();
            }
        }
    }, [token, contactId, isSalesManager]);

    const fetchSalesUsers = async () => {
        if (!token) return;

        try {
            const users = await getSalesUsers(token);
            setSalesMen(users);
        } catch (error) {
            console.error('Error fetching sales users:', error);
        }
    };

    const fetchContactDetail = async () => {
        if (!token || !contactId) return;

        try {
            setLoading(true);
            setError(null);
            const contactIdNum = parseInt(contactId);
            if (isNaN(contactIdNum)) {
                throw new Error('Invalid contact ID');
            }
            const data = await getSalesContactDetail(contactIdNum, token);
            setContact(data);
            setFormData({
                requestType: data.requestType,
                priority: data.priority,
                assigneeUserId: data.assigneeUserId || undefined,
                status: data.status,
                internalNotes: data.internalNotes || undefined,
                onlineMtgLink: data.onlineMtgLink || undefined,
                onlineMtgDateTime: data.onlineMtgDateTime || undefined,
            });
        } catch (error: any) {
            console.error('Error fetching contact detail:', error);
            setError(error.message || 'Failed to load contact detail');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!token || !contactId) return;

        try {
            setSaving(true);
            setError(null);
            const contactIdNum = parseInt(contactId);
            const updatedContact = await updateSalesContact(contactIdNum, formData, token);
            setContact(updatedContact);
            toast({
                variant: "success",
                title: "Success",
                description: "Contact saved successfully",
            });
        } catch (error: any) {
            console.error('Error saving contact:', error);
            setError(error.message || 'Failed to save contact');
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || 'Failed to save contact',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleConvertToOpportunity = async () => {
        if (!token || !contactId) return;
        setShowConvertModal(true);
    };

    const handleConvertConfirm = async () => {
        if (!contactId) return;
        // Redirect to opportunity create page with contactId
        router.push(`/sales/opportunities/new?contactId=${contactId}`);
    };

    const handleAddLog = async () => {
        if (!newLogMessage.trim() || !token || !contactId) {
            return;
        }

        if (newLogMessage.length > 500) {
            setError('Communication log message must not exceed 500 characters');
            return;
        }

        try {
            setError(null);
            const contactIdNum = parseInt(contactId);
            const request: CreateCommunicationLogRequest = { message: newLogMessage };
            const result = await addCommunicationLog(contactIdNum, request, token);

            if (result) {
                // Success - clear form and refresh
                setNewLogMessage('');
                setShowAddLog(false);
                await fetchContactDetail();
            } else {
                // Failed but no error thrown - just refresh to show current state
                setNewLogMessage('');
                setShowAddLog(false);
                await fetchContactDetail();
            }
        } catch (error: any) {
            // This catch block should rarely be hit now, but keep it for safety
            console.error('Error adding log:', error);
            setNewLogMessage('');
            setShowAddLog(false);
            await fetchContactDetail();
        }
    };

    const handleSendMtgEmail = async () => {
        if (!token || !contactId || !formData.onlineMtgLink || !formData.onlineMtgDateTime) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in Online MTG Link and Online MTG Date time",
            });
            return;
        }

        try {
            setSaving(true);
            setError(null);
            const contactIdNum = parseInt(contactId);

            // Convert datetime-local format (YYYY-MM-DDTHH:mm) to format expected by backend
            const dateTimeForBackend = formData.onlineMtgDateTime.replace('T', ' ');

            const updatedContact = await sendMeetingEmail(
                contactIdNum,
                formData.onlineMtgLink,
                dateTimeForBackend,
                token
            );

            // Update contact and formData with saved values
            setContact(updatedContact);
            setFormData({
                ...formData,
                onlineMtgLink: updatedContact.onlineMtgLink || formData.onlineMtgLink,
                onlineMtgDateTime: updatedContact.onlineMtgDateTime || formData.onlineMtgDateTime,
            });

            toast({
                variant: "success",
                title: "Success",
                description: "Meeting invitation email sent successfully and information saved",
            });
        } catch (error: any) {
            console.error('Error sending email:', error);
            setError(error.message || 'Failed to send meeting email');
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || 'Failed to send meeting email',
            });
        } finally {
            setSaving(false);
        }
    };

    if (!user || !token) {
        return <div>Loading...</div>;
    }

    if (loading) {
        return <div>Loading contact detail...</div>;
    }

    if (error && !contact) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => router.push('/sales/contacts')}>Back to Contact List</Button>
                </div>
            </div>
        );
    }

    if (!contact) {
        return <div>Contact not found</div>;
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Sidebar */}
            <SalesSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Contact management</h2>
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-900">{user?.fullName || 'Admin'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-6 bg-white">
                    {/* Breadcrumbs */}
                    <div className="mb-4">
                        <a
                            href="/sales/contacts"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => {
                                e.preventDefault();
                                router.push('/sales/contacts');
                            }}
                        >
                            Contact Management
                        </a>
                        <span className="mx-2">/</span>
                        <span>Consultation Contact</span>
                    </div>

                    {/* Page Title */}
                    <h1 className="text-2xl font-bold mb-6">Contact Detail</h1>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Contact Info Section */}
                    <div className="bg-white border rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Contact Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Contact ID</label>
                                <p className="text-base font-medium">{contact.id}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Date Received</label>
                                <p className="text-base font-medium">{contact.dateReceived}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Client Name</label>
                                <p className="text-base font-medium">{contact.clientName || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Email</label>
                                <p className="text-base font-medium">{contact.email || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Phone</label>
                                <p className="text-base font-medium">{contact.phone || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Client Company</label>
                                <p className="text-base font-medium">{contact.clientCompany || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Consultation Request Section */}
                    <div className="bg-white border rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Consultation Request</h2>
                        <Textarea
                            value={contact.consultationRequest || ''}
                            readOnly
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Classification Section */}
                    <div className="bg-white border rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Classification</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Request Type</label>
                                <Select
                                    value={formData.requestType || ''}
                                    onValueChange={(value) => setFormData({ ...formData, requestType: value })}
                                    disabled={!isSalesManager}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select request type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PROJECT">Project</SelectItem>
                                        <SelectItem value="HIRING">Hiring</SelectItem>
                                        <SelectItem value="CONSULTATION">Consultation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Status</label>
                                <Select
                                    value={formData.status || ''}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                    disabled={!isAssigned}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="New">New</SelectItem>
                                        <SelectItem value="Inprogress">Inprogress</SelectItem>
                                        <SelectItem value="Converted to Opportunity">Convert to Opportunity</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Priority</label>
                                <Select
                                    value={formData.priority || ''}
                                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                                    disabled={!isSalesManager}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Normal">Normal</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Assignee</label>
                                <Select
                                    value={formData.assigneeUserId?.toString() || ''}
                                    onValueChange={(value) => setFormData({ ...formData, assigneeUserId: parseInt(value) })}
                                    disabled={!isSalesManager}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salesMen.map((salesMan) => (
                                            <SelectItem key={salesMan.id} value={salesMan.id.toString()}>
                                                {salesMan.fullName} ({salesMan.role === 'SALES_MANAGER' ? 'Manager' : 'Sales Rep'})
                                            </SelectItem>
                                        ))}
                                        {salesMen.length === 0 && contact.assigneeUserId && (
                                            <SelectItem value={contact.assigneeUserId.toString()}>
                                                {contact.assigneeName || 'Unknown'}
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Converted to Opportunity Section */}
                    <div className="bg-white border rounded-lg p-6 mb-6">
                        <label className="text-sm text-gray-600">Converted to Opportunity</label>
                        <p className="text-base font-medium">
                            {contact.convertedToOpportunity ? 'Converted' : 'Not yet'}
                        </p>
                    </div>

                    {/* Internal Notes Section */}
                    <div className="bg-white border rounded-lg p-6 mb-6">
                        <label className="text-sm text-gray-600 mb-2 block">Internal Notes</label>
                        <Textarea
                            value={formData.internalNotes || ''}
                            onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                            disabled={!isAssigned}
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Communication Status Section */}
                    <div className="bg-white border rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Communication Status</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Online MTG Link</label>
                                <Input
                                    value={formData.onlineMtgLink || ''}
                                    onChange={(e) => setFormData({ ...formData, onlineMtgLink: e.target.value })}
                                    disabled={!isAssigned}
                                    placeholder="zoom.us/123124541141"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Online MTG Date time</label>
                                <Input
                                    type="datetime-local"
                                    value={formData.onlineMtgDateTime ? (() => {
                                        // Convert from "YYYY/MM/DD HH:mm" to "YYYY-MM-DDTHH:mm" for datetime-local input
                                        const dt = formData.onlineMtgDateTime;
                                        if (dt.includes('/')) {
                                            // Format: "YYYY/MM/DD HH:mm"
                                            const [datePart, timePart] = dt.split(' ');
                                            const [year, month, day] = datePart.split('/');
                                            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart || '00:00'}`;
                                        } else if (dt.includes('T')) {
                                            // Already in datetime-local format
                                            return dt.substring(0, 16);
                                        } else {
                                            // Format: "YYYY-MM-DD HH:mm"
                                            return dt.replace(' ', 'T').substring(0, 16);
                                        }
                                    })() : ''}
                                    onChange={(e) => {
                                        // Keep the value in datetime-local format for now, will convert when sending
                                        setFormData({ ...formData, onlineMtgDateTime: e.target.value });
                                    }}
                                    disabled={!isAssigned}
                                />
                            </div>
                            <Button
                                onClick={handleSendMtgEmail}
                                disabled={!isAssigned || !formData.onlineMtgLink || !formData.onlineMtgDateTime}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Send Mail for MTG
                            </Button>
                        </div>
                    </div>

                    {/* Communication Log Section */}
                    <div className="bg-white border rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Communication Log</h2>
                            {isAssigned && (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAddLog(!showAddLog)}
                                >
                                    +Add Log
                                </Button>
                            )}
                        </div>
                        {showAddLog && isAssigned && (
                            <div className="mb-4">
                                <Textarea
                                    value={newLogMessage}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (newValue.length <= 500) {
                                            setNewLogMessage(newValue);
                                            setError(null);
                                        } else {
                                            setError('Communication log message must not exceed 500 characters');
                                        }
                                    }}
                                    placeholder="Enter log message..."
                                    maxLength={500}
                                    className="mb-2"
                                />
                                <div className="text-sm text-gray-500 mb-2">
                                    {newLogMessage.length}/500 characters
                                </div>
                                {error && (
                                    <p className="text-red-500 text-sm mb-2">{error}</p>
                                )}
                                <Button onClick={handleAddLog}>Add</Button>
                            </div>
                        )}
                        <div className="space-y-2">
                            {contact.communicationLogs.length === 0 ? (
                                <p className="text-gray-500">No communication logs yet</p>
                            ) : (
                                contact.communicationLogs.map((log) => (
                                    <div key={log.id} className="border-b pb-2">
                                        <p className="text-sm">{log.message}</p>
                                        <p className="text-xs text-gray-500">
                                            {log.createdAt} by {log.createdByName || 'Unknown'}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/sales/contacts')}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {saving ? 'Saving...' : 'Save contact'}
                        </Button>
                        {isAssigned && (
                            <Button
                                onClick={handleConvertToOpportunity}
                                disabled={contact.convertedToOpportunity}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Convert to Opportunity
                            </Button>
                        )}
                    </div>

                    {/* Convert to Opportunity Confirmation Dialog */}
                    <Dialog open={showConvertModal} onOpenChange={setShowConvertModal}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Convert to Opportunity</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <p className="text-sm text-gray-600">
                                    Are you sure you want to convert this contact to opportunity?
                                </p>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowConvertModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConvertConfirm}
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Convert
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </div>
    );
}

