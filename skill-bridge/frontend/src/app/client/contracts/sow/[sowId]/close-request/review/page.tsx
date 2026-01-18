'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClientSidebar } from '@/components/design-patterns/client/ClientSidebar';
import { ClientHeader } from '@/components/design-patterns/client/ClientHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import {
  getLatestProjectCloseRequest,
  approveProjectCloseRequest,
  rejectProjectCloseRequest,
  ProjectCloseRequestDetail,
} from '@/services/projectCloseRequestService';

export default function ReviewProjectCloseRequestPage() {
  const router = useRouter();
  const params = useParams();
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const sowId = params?.sowId ? parseInt(params.sowId as string) : null;

  const [closeRequest, setCloseRequest] = useState<ProjectCloseRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonError, setRejectReasonError] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/client/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load close request
  useEffect(() => {
    const loadCloseRequest = async () => {
      if (!token || !sowId || !isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getLatestProjectCloseRequest(sowId, token);
        setCloseRequest(data);
      } catch (err: any) {
        console.error('Error loading close request:', err);
        setError(err.message || 'Failed to load close request');
      } finally {
        setLoading(false);
      }
    };

    loadCloseRequest();
  }, [token, sowId, isAuthenticated]);

  // Format date helper
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');
    } catch (e) {
      return dateStr;
    }
  };

  // Parse links (one per line)
  const parseLinks = (linksStr: string | undefined): string[] => {
    if (!linksStr) return [];
    return linksStr.split('\n').filter(link => link.trim().length > 0);
  };

  // Handle approve
  const handleApprove = async () => {
    if (!token || !closeRequest) return;

    try {
      setActionLoading(true);
      await approveProjectCloseRequest(closeRequest.id, { confirm: true }, token);
      
      toast({
        title: 'Success',
        description: 'Project has been marked as completed.',
      });

      // Reload close request to get updated status
      const updated = await getLatestProjectCloseRequest(sowId!, token);
      setCloseRequest(updated);

      // Redirect to contracts list after a delay
      setTimeout(() => {
        router.push('/client/contracts');
      }, 2000);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to approve close request',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
      setShowApproveModal(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!token || !closeRequest) return;

    // Validate reason
    if (!rejectReason || rejectReason.trim().length === 0) {
      setRejectReasonError('Rejection reason is required');
      return;
    }

    if (rejectReason.length > 2000) {
      setRejectReasonError('Rejection reason must not exceed 2000 characters');
      return;
    }

    try {
      setActionLoading(true);
      await rejectProjectCloseRequest(closeRequest.id, { reason: rejectReason.trim() }, token);
      
      toast({
        title: 'Success',
        description: 'Close request has been rejected and sent back to LandBridge.',
      });

      // Reload close request to get updated status
      const updated = await getLatestProjectCloseRequest(sowId!, token);
      setCloseRequest(updated);

      setShowRejectModal(false);
      setRejectReason('');
      setRejectReasonError('');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to reject close request',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <ClientSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !closeRequest) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <ClientSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error || 'Close request not found'}</p>
                <Button onClick={() => router.push('/client/contracts')}>
                  Back to Contracts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Only show if status is Pending
  if (closeRequest.status !== 'Pending') {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <ClientSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  This close request has already been {closeRequest.status === 'ClientApproved' ? 'approved' : 'rejected'}.
                </p>
                <Button onClick={() => router.push('/client/contracts')}>
                  Back to Contracts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const links = parseLinks(closeRequest.links);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 p-6">
          {/* Breadcrumbs */}
          <div className="mb-4 text-sm text-gray-600">
            <a href="/client/contracts" className="hover:underline">Contracts</a>
            <span className="mx-2">/</span>
            <span>Review Close Request</span>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Review Project Close Request</h1>
            <p className="text-gray-600 mt-1">Please review the project close request and approve or reject it.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* SOW Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle>SOW Contract Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Contract Name</Label>
                      <p className="text-gray-900 mt-1">{closeRequest.sowContractName || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Period</Label>
                      <p className="text-gray-900 mt-1">{closeRequest.sowPeriod || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Status</Label>
                      <Badge className="bg-green-100 text-green-800 mt-1">
                        {closeRequest.sowStatus || 'Active'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Requested By</Label>
                      <p className="text-gray-900 mt-1">
                        {closeRequest.requestedBy?.name || 'N/A'}
                        {closeRequest.requestedBy?.email && (
                          <span className="text-gray-500 text-sm ml-2">({closeRequest.requestedBy.email})</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Request Date</Label>
                      <p className="text-gray-900 mt-1">{formatDate(closeRequest.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Close Request Message Card */}
              {closeRequest.message && (
                <Card>
                  <CardHeader>
                    <CardTitle>Message from LandBridge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 whitespace-pre-line">{closeRequest.message}</p>
                  </CardContent>
                </Card>
              )}

              {/* Links Card */}
              {links.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {links.map((link, index) => (
                        <a
                          key={index}
                          href={link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="break-all">{link.trim()}</span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Action Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => setShowApproveModal(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={actionLoading}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Project Closure
                  </Button>
                  
                  <Button
                    onClick={() => setShowRejectModal(true)}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    disabled={actionLoading}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject & Send Reason
                  </Button>

                  <Button
                    onClick={() => router.push('/client/contracts')}
                    variant="ghost"
                    className="w-full"
                  >
                    Back to Contracts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Approve Confirmation Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Project Closure</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to approve project closure? The SOW will be marked as completed.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveModal(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? 'Approving...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reject Project Close Request</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-gray-700">
              Please provide a reason for rejecting the close request. This will be sent back to LandBridge.
            </p>
            <div>
              <Label htmlFor="rejectReason" className="text-sm font-medium text-gray-700 mb-2 block">
                Rejection Reason *
              </Label>
              <Textarea
                id="rejectReason"
                rows={6}
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  if (rejectReasonError) {
                    setRejectReasonError('');
                  }
                }}
                placeholder="Please provide a reason for rejecting the close request..."
                className={rejectReasonError ? 'border-red-500' : ''}
                maxLength={2000}
              />
              <div className="flex justify-between items-center mt-1">
                {rejectReasonError && (
                  <span className="text-sm text-red-500">{rejectReasonError}</span>
                )}
                <span className="text-sm text-gray-500 ml-auto">
                  {rejectReason.length}/2000 characters
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
                setRejectReasonError('');
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? 'Submitting...' : 'Submit Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

