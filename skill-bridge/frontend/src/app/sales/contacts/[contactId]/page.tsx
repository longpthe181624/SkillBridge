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
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SalesContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.contactId as string;
  const { toast } = useToast();
  const { t } = useLanguage();
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

    // Validate datetime if provided
    if (formData.onlineMtgDateTime) {
      try {
        const selectedDate = new Date(formData.onlineMtgDateTime);
        const now = new Date();
        const maxDate = new Date(now);
        maxDate.setFullYear(now.getFullYear() + 10);

        if (selectedDate < now) {
          toast({
            variant: "destructive",
            title: t('sales.contactDetail.messages.error'),
            description: 'Meeting date cannot be in the past',
          });
          return;
        }

        if (selectedDate > maxDate) {
          toast({
            variant: "destructive",
            title: t('sales.contactDetail.messages.error'),
            description: 'Meeting date cannot be more than 10 years in the future',
          });
          return;
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: t('sales.contactDetail.messages.error'),
          description: 'Invalid date format',
        });
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);
      const contactIdNum = parseInt(contactId);
      const updatedContact = await updateSalesContact(contactIdNum, formData, token);
      setContact(updatedContact);
      toast({
        variant: "success",
        title: t('sales.contactDetail.messages.success'),
        description: t('sales.contactDetail.messages.saveSuccess'),
      });
    } catch (error: any) {
      console.error('Error saving contact:', error);
      setError(error.message || 'Failed to save contact');
      toast({
        variant: "destructive",
        title: t('sales.contactDetail.messages.error'),
        description: error.message || t('sales.contactDetail.messages.saveError'),
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
        title: t('sales.contactDetail.messages.error'),
        description: t('sales.contactDetail.messages.fillMtgFields'),
      });
      return;
    }

    // Validate datetime is within valid range (now to 10 years from now)
    try {
      const selectedDate = new Date(formData.onlineMtgDateTime);
      const now = new Date();
      const maxDate = new Date(now);
      maxDate.setFullYear(now.getFullYear() + 10);

      if (selectedDate < now) {
        toast({
          variant: "destructive",
          title: t('sales.contactDetail.messages.error'),
          description: 'Meeting date cannot be in the past',
        });
        return;
      }

      if (selectedDate > maxDate) {
        toast({
          variant: "destructive",
          title: t('sales.contactDetail.messages.error'),
          description: 'Meeting date cannot be more than 10 years in the future',
        });
        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('sales.contactDetail.messages.error'),
        description: 'Invalid date format',
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
        title: t('sales.contactDetail.messages.success'),
        description: t('sales.contactDetail.messages.emailSentSuccess'),
      });
    } catch (error: any) {
      console.error('Error sending email:', error);
      setError(error.message || 'Failed to send meeting email');
      toast({
        variant: "destructive",
        title: t('sales.contactDetail.messages.error'),
        description: error.message || t('sales.contactDetail.messages.emailSendError'),
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user || !token) {
    return <div>{t('sales.contactDetail.loading')}</div>;
  }

  if (loading) {
    return <div>{t('sales.contactDetail.loading')}</div>;
  }

  if (error && !contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push('/sales/contacts')}>{t('sales.contactDetail.actions.backToList')}</Button>
        </div>
      </div>
    );
  }

  if (!contact) {
    return <div>{t('sales.contactDetail.notFound')}</div>;
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
              <h2 className="text-xl font-semibold text-gray-900">{t('sales.contactDetail.title')}</h2>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{user?.fullName || 'Admin'}</span>
                </div>
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
              {t('sales.contactDetail.breadcrumb.list')}
            </a>
            <span className="mx-2">/</span>
            <span>{t('sales.contactDetail.breadcrumb.detail')}</span>
          </div>

          {/* Page Title */}
          <h1 className="text-2xl font-bold mb-6">{t('sales.contactDetail.pageTitle')}</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          {/* Contact Info Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{t('sales.contactDetail.sections.contactInfo')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">{t('sales.contactDetail.fields.contactId')}</label>
                <p className="text-base font-medium">{contact.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('sales.contactDetail.fields.dateReceived')}</label>
                <p className="text-base font-medium">{contact.dateReceived}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('sales.contactDetail.fields.clientName')}</label>
                <p className="text-base font-medium">{contact.clientName || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('sales.contactDetail.fields.email')}</label>
                <p className="text-base font-medium">{contact.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('sales.contactDetail.fields.phone')}</label>
                <p className="text-base font-medium">{contact.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('sales.contactDetail.fields.clientCompany')}</label>
                <p className="text-base font-medium">{contact.clientCompany || '-'}</p>
              </div>
            </div>
          </div>

          {/* Consultation Request Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{t('sales.contactDetail.sections.consultationRequest')}</h2>
            <Textarea
              value={contact.consultationRequest || ''}
              readOnly
              className="min-h-[100px]"
            />
          </div>

          {/* Classification Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{t('sales.contactDetail.sections.classification')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">{t('sales.contactDetail.fields.requestType')}</label>
                <Select
                  value={formData.requestType || ''}
                  onValueChange={(value) => setFormData({ ...formData, requestType: value })}
                  disabled={!isSalesManager}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('sales.contactDetail.placeholders.selectRequestType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROJECT">{t('sales.contactDetail.requestType.project')}</SelectItem>
                    <SelectItem value="HIRING">{t('sales.contactDetail.requestType.hiring')}</SelectItem>
                    <SelectItem value="CONSULTATION">{t('sales.contactDetail.requestType.consultation')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">{t('sales.contactDetail.fields.status')}</label>
                <Select
                  value={formData.status || ''}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={!isAssigned}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('sales.contactDetail.placeholders.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">{t('sales.contactDetail.status.new')}</SelectItem>
                    <SelectItem value="Inprogress">{t('sales.contactDetail.status.inProgress')}</SelectItem>
                    <SelectItem value="Converted to Opportunity">{t('sales.contactDetail.status.convertedToOpportunity')}</SelectItem>
                    <SelectItem value="Closed">{t('sales.contactDetail.status.closed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">{t('sales.contactDetail.fields.priority')}</label>
                <Select
                  value={formData.priority || ''}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  disabled={!isSalesManager}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('sales.contactDetail.placeholders.selectPriority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">{t('sales.contactDetail.priority.normal')}</SelectItem>
                    <SelectItem value="High">{t('sales.contactDetail.priority.high')}</SelectItem>
                    <SelectItem value="Urgent">{t('sales.contactDetail.priority.urgent')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">{t('sales.contactDetail.fields.assignee')}</label>
                <Select
                  value={formData.assigneeUserId?.toString() || ''}
                  onValueChange={(value) => setFormData({ ...formData, assigneeUserId: parseInt(value) })}
                  disabled={!isSalesManager}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('sales.contactDetail.placeholders.selectAssignee')} />
                  </SelectTrigger>
                  <SelectContent>
                    {salesMen.map((salesMan) => (
                      <SelectItem key={salesMan.id} value={salesMan.id.toString()}>
                        {salesMan.fullName} ({salesMan.role === 'SALES_MANAGER' ? t('sales.contactDetail.roles.manager') : t('sales.contactDetail.roles.salesRep')})
                      </SelectItem>
                    ))}
                    {salesMen.length === 0 && contact.assigneeUserId && (
                      <SelectItem value={contact.assigneeUserId.toString()}>
                        {contact.assigneeName || t('sales.contactDetail.unknown')}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Converted to Opportunity Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <label className="text-sm text-gray-600">{t('sales.contactDetail.fields.convertedToOpportunity')}</label>
            <p className="text-base font-medium">
              {contact.convertedToOpportunity ? t('sales.contactDetail.converted.yes') : t('sales.contactDetail.converted.no')}
            </p>
          </div>

          {/* Internal Notes Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <label className="text-sm text-gray-600 mb-2 block">{t('sales.contactDetail.fields.internalNotes')}</label>
            <Textarea
              value={formData.internalNotes || ''}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
              disabled={!isAssigned}
              className="min-h-[100px]"
            />
          </div>

          {/* Communication Status Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{t('sales.contactDetail.sections.communicationStatus')}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">{t('sales.contactDetail.fields.onlineMtgLink')}</label>
                <Input
                  value={formData.onlineMtgLink || ''}
                  onChange={(e) => setFormData({ ...formData, onlineMtgLink: e.target.value })}
                  disabled={!isAssigned}
                  placeholder={t('sales.contactDetail.placeholders.onlineMtgLink')}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">{t('sales.contactDetail.fields.onlineMtgDateTime')}</label>
                <Input
                  type="datetime-local"
                  min={(() => {
                    // Set minimum to current date/time
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    return `${year}-${month}-${day}T${hours}:${minutes}`;
                  })()}
                  max={(() => {
                    // Set maximum to 10 years from now
                    const now = new Date();
                    const maxDate = new Date(now);
                    maxDate.setFullYear(now.getFullYear() + 10);
                    const year = maxDate.getFullYear();
                    const month = String(maxDate.getMonth() + 1).padStart(2, '0');
                    const day = String(maxDate.getDate()).padStart(2, '0');
                    const hours = String(maxDate.getHours()).padStart(2, '0');
                    const minutes = String(maxDate.getMinutes()).padStart(2, '0');
                    return `${year}-${month}-${day}T${hours}:${minutes}`;
                  })()}
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
                {t('sales.contactDetail.actions.sendMtgEmail')}
              </Button>
            </div>
          </div>

          {/* Communication Log Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{t('sales.contactDetail.sections.communicationLog')}</h2>
              {isAssigned && (
                <Button
                  variant="outline"
                  onClick={() => setShowAddLog(!showAddLog)}
                >
                  {t('sales.contactDetail.actions.addLog')}
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
                  placeholder={t('sales.contactDetail.placeholders.logMessage')}
                  maxLength={500}
                  className="mb-2"
                />
                <div className="text-sm text-gray-500 mb-2">
                  {newLogMessage.length}/500 characters
                </div>
                {error && (
                  <p className="text-red-500 text-sm mb-2">{error}</p>
                )}
                <Button onClick={handleAddLog}>{t('sales.contactDetail.actions.add')}</Button>
              </div>
            )}
            <div className="space-y-2">
              {contact.communicationLogs.length === 0 ? (
                <p className="text-gray-500">{t('sales.contactDetail.communicationLog.empty')}</p>
              ) : (
                contact.communicationLogs.map((log) => (
                  <div key={log.id} className="border-b pb-2">
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-gray-500">
                      {log.createdAt} {t('sales.contactDetail.communicationLog.by')} {log.createdByName || t('sales.contactDetail.unknown')}
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
              {t('sales.contactDetail.actions.cancel')}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? t('sales.contactDetail.actions.saving') : t('sales.contactDetail.actions.save')}
            </Button>
            {isAssigned && (
              <Button
                onClick={handleConvertToOpportunity}
                disabled={contact.convertedToOpportunity}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {t('sales.contactDetail.actions.convertToOpportunity')}
              </Button>
            )}
          </div>

          {/* Convert to Opportunity Confirmation Dialog */}
          <Dialog open={showConvertModal} onOpenChange={setShowConvertModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('sales.contactDetail.dialog.convertToOpportunity.title')}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-gray-600">
                  {t('sales.contactDetail.dialog.convertToOpportunity.message')}
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConvertModal(false)}
                >
                  {t('sales.contactDetail.actions.cancel')}
                </Button>
                <Button
                  onClick={handleConvertConfirm}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {t('sales.contactDetail.actions.convert')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}

