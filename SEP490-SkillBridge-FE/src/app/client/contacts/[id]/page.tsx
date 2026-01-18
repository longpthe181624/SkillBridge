'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClientSidebar } from '@/components/design-patterns/client/ClientSidebar';
import { ClientHeader } from '@/components/design-patterns/client/ClientHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    getContactDetail,
    addCommunicationLog,
    addProposalComment,
    cancelConsultation,
  approveProposal,
  getPresignedUrl
} from '@/services/contactService';
import { ContactDetail, CommunicationLog, ContactProposal } from '@/types/contact';
import { cn } from '@/lib/utils';
import CommentModal from '@/components/CommentModal';
import CancelConsultationModal from '@/components/CancelConsultationModal';
import AddLogInput from '@/components/AddLogInput';
import { Plus, ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactDetailPage() {
    const { id } = useParams();
    const { user, token, isAuthenticated, loading: authLoading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const [contact, setContact] = useState<ContactDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showAddLogInput, setShowAddLogInput] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const contactId = id ? parseInt(id as string, 10) : null;

  // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/client/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Fetch contact detail
    useEffect(() => {
        if (!token || !isAuthenticated || !contactId) return;

        const fetchContactDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getContactDetail(token, contactId);
                setContact(data);
            } catch (error: any) {
                console.error('Error fetching contact detail:', error);
                setError(error.message || 'Failed to fetch contact detail');
            } finally {
                setLoading(false);
            }
        };

        fetchContactDetail();
    }, [token, isAuthenticated, contactId]);

    // Handle add communication log
    const handleAddLog = async (message: string) => {
        if (!token || !contactId) return;

        try {
            setSubmitting(true);
            const newLog = await addCommunicationLog(token, contactId, { message });

            // Refresh contact detail to get updated logs
            if (contact) {
                const updatedContact = await getContactDetail(token, contactId);
                setContact(updatedContact);
            }

            setShowAddLogInput(false);
        } catch (error: any) {
            throw error; // Re-throw to be handled by AddLogInput
        } finally {
            setSubmitting(false);
        }
    };

    // Handle add comment
    const handleAddComment = async (message: string) => {
        if (!token || !contactId) return;

        try {
            await addProposalComment(token, contactId, { message });

            // Refresh contact detail
            if (contact) {
                const updatedContact = await getContactDetail(token, contactId);
                setContact(updatedContact);
            }
        } catch (error: any) {
            throw error; // Re-throw to be handled by CommentModal
        }
    };

    // Handle cancel consultation
    const handleCancelConsultation = async (reason: string) => {
        if (!token || !contactId) return;

        try {
            await cancelConsultation(token, contactId, { reason });

            // Refresh contact detail
            if (contact) {
                const updatedContact = await getContactDetail(token, contactId);
                setContact(updatedContact);
            }

            // Optionally redirect to contact list
            // router.push('/client/contacts');
        } catch (error: any) {
            throw error; // Re-throw to be handled by CancelConsultationModal
        }
    };

    // Handle approve proposal
    const handleApproveProposal = async () => {
        if (!token || !contactId) return;

        try {
            await approveProposal(token, contactId);

            // Refresh contact detail
            if (contact) {
                const updatedContact = await getContactDetail(token, contactId);
                setContact(updatedContact);
            }
        } catch (error: any) {
            console.error('Error approving proposal:', error);
            alert(error.message || 'Failed to approve proposal');
        }
    };

  // Handle file click to view PDF
  const handleFileClick = async (e: React.MouseEvent<HTMLAnchorElement>, proposalLink: string) => {
    e.preventDefault();
    if (!token) {
      alert('Please login to view the document');
      return;
    }

    try {
      // Check if it's an S3 key (contains "proposals/" or starts with "proposals/")
      // or if it's a local file path (starts with "/uploads/")
      if (proposalLink.startsWith('proposals/') || proposalLink.includes('proposals/')) {
        // It's an S3 key, get presigned URL
        const response = await getPresignedUrl(proposalLink, token);
        window.open(response.presignedUrl, '_blank');
      } else if (proposalLink.startsWith('/uploads/')) {
        // It's a local file, open directly
        window.open(proposalLink, '_blank');
      } else if (proposalLink.startsWith('http://') || proposalLink.startsWith('https://')) {
        // It's already a URL (legacy), try to extract S3 key or open directly
        // Try to extract S3 key from URL
        const urlParts = proposalLink.split('/');
        const bucketIndex = urlParts.findIndex(part => part.includes('skillbridge') || part.includes('s3'));
        if (bucketIndex >= 0 && bucketIndex < urlParts.length - 1) {
          // Extract key after bucket name
          const keyParts = urlParts.slice(bucketIndex + 1);
          const extractedKey = keyParts.join('/');
          if (extractedKey.startsWith('proposals/')) {
            const response = await getPresignedUrl(extractedKey, token);
            window.open(response.presignedUrl, '_blank');
          } else {
            window.open(proposalLink, '_blank');
          }
        } else {
          window.open(proposalLink, '_blank');
        }
      } else {
        // Assume it's an S3 key
        const response = await getPresignedUrl(proposalLink, token);
        window.open(response.presignedUrl, '_blank');
      }
    } catch (error: any) {
      console.error('Error getting presigned URL:', error);
      alert(error.message || 'Failed to open document');
    }
  };

    // Show loading or auth check
    if (authLoading) {
        return (
            <div className="flex min-h-screen">
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    // Show error state
    if (error && !loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <ClientSidebar />
                <div className="flex-1 flex flex-col">
                    <ClientHeader titleKey="client.header.title.contactManagement" />
                    <div className="flex-1 p-6 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-500 mb-4">{error}</p>
                            <Button onClick={() => router.push('/client/contacts')}>
                                {t('client.contactDetail.actions.back')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading state
    if (loading || !contact) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <ClientSidebar />
                <div className="flex-1 flex flex-col">
                    <ClientHeader titleKey="client.header.title.contactManagement" />
                    <div className="flex-1 p-6 flex items-center justify-center">
                        <p className="text-gray-500">{t('client.contactDetail.loading')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Sidebar */}
            <ClientSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <ClientHeader titleKey="client.header.title.contactManagement" />

                {/* Main Content Area */}
                <div className="flex-1 p-6 bg-gray-50">
                    {/* Breadcrumbs */}
                    <nav className="mb-4 text-sm text-gray-600">
                        <Link
                            href="/client/contacts"
                            className="hover:text-blue-600 hover:underline"
                        >
                            {t('client.contactDetail.breadcrumb.list')}
                        </Link>
                        <span className="mx-2"> <ChevronRight className="inline w-4 h-4" /> </span>
                        <span className="text-gray-900">{t('client.contactDetail.breadcrumb.detail')}</span>
                    </nav>

                    {/* Page Title */}
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">
                        {t('client.contactDetail.title')}
                    </h1>

                    {/* Contact Info Section */}
                    <Card className="mb-6 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {t('client.contactDetail.sections.contactInfo')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{t('client.contactDetail.fields.contactId')}</p>
                                    <p className="text-base font-medium text-gray-900">{contact.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{t('client.contactDetail.fields.clientName')}</p>
                                    <p className="text-base font-medium text-gray-900">{contact.clientName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{t('client.contactDetail.fields.phone')}</p>
                                    <p className="text-base font-medium text-gray-900">{contact.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{t('client.contactDetail.fields.dateReceived')}</p>
                                    <p className="text-base font-medium text-gray-900">{contact.dateReceived}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{t('client.contactDetail.fields.email')}</p>
                                    <p className="text-base font-medium text-gray-900">{contact.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{t('client.contactDetail.fields.clientCompany')}</p>
                                    <p className="text-base font-medium text-gray-900">{contact.clientCompany || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Consultation Request Section */}
                    <Card className="mb-6 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {t('client.contactDetail.sections.consultationRequest')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-base text-gray-700 whitespace-pre-wrap">
                                {contact.consultationRequest || '-'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Online Meeting Section */}
                    {(contact.onlineMtgDate || contact.onlineMtgLink) && (
                        <Card className="mb-6 bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    {t('client.contactDetail.sections.onlineMeeting')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {contact.onlineMtgDate && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">{t('client.contactDetail.fields.meetingDate')}</p>
                                            <p className="text-base font-medium text-gray-900">{contact.onlineMtgDate}</p>
                                        </div>
                                    )}
                                    {contact.onlineMtgLink && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">{t('client.contactDetail.fields.meetingLink')}</p>
                                            <a
                                                href={contact.onlineMtgLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1"
                                            >
                                                {contact.onlineMtgLink}
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Communication Log Section */}
                    <Card className="mb-6 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {t('client.contactDetail.sections.communicationLog')}
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAddLogInput(!showAddLogInput)}
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {t('client.contactDetail.logs.addLog')}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {/* Add Log Input (Inline) */}
                            <AddLogInput
                                isVisible={showAddLogInput}
                                onSubmit={handleAddLog}
                                onCancel={() => setShowAddLogInput(false)}
                            />

                            {/* Log Entries */}
                            {contact.communicationLogs && contact.communicationLogs.length > 0 ? (
                                <div className="mt-4 space-y-4">
                                    {contact.communicationLogs.map((log: CommunicationLog) => (
                                        <div key={log.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-sm text-gray-600">{log.createdAt}</p>
                                                {log.createdByName && (
                                                    <p className="text-sm text-gray-600">{log.createdByName}</p>
                                                )}
                                            </div>
                                            <p className="text-base text-gray-900 whitespace-pre-wrap">{log.message}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    {t('client.contactDetail.logs.noLogs')}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Proposal Section */}
          {(() => {
            // Get the most recent reviewable proposal from proposals array
            // Priority: sent_to_client > approved > revision_requested
            const getDisplayProposal = () => {
              if (!contact.proposals || contact.proposals.length === 0) {
                // Fallback to old fields for backward compatibility
                return contact.proposalLink ? {
                  proposalLink: contact.proposalLink,
                  proposalStatus: contact.proposalStatus,
                  proposalApprovedAt: contact.proposalApprovedAt,
                  status: contact.proposalStatus === 'Approved' ? 'approved' :
                         contact.proposalStatus === 'Request for Change' ? 'revision_requested' :
                         'sent_to_client',
                  clientFeedback: contact.proposalComment?.message || null
                } : null;
              }

              // Filter reviewable proposals
              const reviewableProposals = contact.proposals.filter(p =>
                p.status === 'sent_to_client' ||
                p.status === 'revision_requested' ||
                p.status === 'approved'
              );

              if (reviewableProposals.length === 0) {
                return null;
              }

              // Priority: sent_to_client > approved > revision_requested
              const sentToClient = reviewableProposals.filter(p => p.status === 'sent_to_client');
              if (sentToClient.length > 0) {
                // Sort by isCurrent first (true first), then by createdAt DESC (newest first)
                sentToClient.sort((a, b) => {
                  if (a.isCurrent !== b.isCurrent) {
                    return a.isCurrent ? -1 : 1;
                  }
                  // If both have same isCurrent, sort by createdAt DESC
                  const dateA = new Date(a.createdAt).getTime();
                  const dateB = new Date(b.createdAt).getTime();
                  return dateB - dateA;
                });
                return sentToClient[0];
              }

              const approved = reviewableProposals.filter(p => p.status === 'approved');
              if (approved.length > 0) {
                approved.sort((a, b) => {
                  if (a.isCurrent !== b.isCurrent) {
                    return a.isCurrent ? -1 : 1;
                  }
                  const dateA = new Date(a.createdAt).getTime();
                  const dateB = new Date(b.createdAt).getTime();
                  return dateB - dateA;
                });
                return approved[0];
              }

              const revisionRequested = reviewableProposals.filter(p => p.status === 'revision_requested');
              if (revisionRequested.length > 0) {
                revisionRequested.sort((a, b) => {
                  if (a.isCurrent !== b.isCurrent) {
                    return a.isCurrent ? -1 : 1;
                  }
                  const dateA = new Date(a.createdAt).getTime();
                  const dateB = new Date(b.createdAt).getTime();
                  return dateB - dateA;
                });
                return revisionRequested[0];
              }

              return null;
            };

            const displayProposal = getDisplayProposal();

            // Check if displayProposal is a ContactProposal (has id property) or fallback object
            const isContactProposal = displayProposal && 'id' in displayProposal;

            // Always use displayProposal if available (from proposals array), otherwise fallback to old fields
            const proposalLink = displayProposal?.proposalLink || contact.proposalLink;
            const proposalStatus = displayProposal?.status || contact.proposalStatus;
            const proposalApprovedAt = displayProposal?.proposalApprovedAt || contact.proposalApprovedAt;
            const clientFeedback = displayProposal?.clientFeedback;
            const proposalAttachments = isContactProposal ? (displayProposal as ContactProposal).attachments : undefined;

            // Map backend status to frontend status
            const mapStatusToFrontend = (status: string): 'Pending' | 'Approved' | 'Request for Change' => {
              if (status === 'approved') return 'Approved';
              if (status === 'revision_requested') return 'Request for Change';
              return 'Pending';
            };

            const frontendStatus = mapStatusToFrontend(proposalStatus || 'Pending');

            if (!proposalLink) {
              return null;
            }

            // Only show proposalComment if it belongs to the currently displayed proposal
            // Check if the comment is from a proposal with revision_requested status (old proposal)
            // If we're displaying a new proposal (sent_to_client), don't show old comments
            const shouldShowOldComment = displayProposal &&
              contact.proposalComment &&
              !clientFeedback &&
              displayProposal.status === 'revision_requested';

            // Debug log to check which proposal is selected
            console.log('Display Proposal:', displayProposal);
            console.log('All Proposals:', contact.proposals);
            console.log('Should show old comment:', shouldShowOldComment);

            return (
                        <Card className="mb-6 bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    {t('client.contactDetail.sections.proposal')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                      {proposalAttachments && proposalAttachments.length > 0 ? (
                        // Display attachments with fileName
                        <div className="space-y-2">
                          {proposalAttachments.map((attachment, index) => (
                                        <a
                              key={index}
                              href="#"
                              onClick={(e) => handleFileClick(e, attachment.s3Key)}
                              className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1 cursor-pointer"
                                        >
                              {attachment.fileName || attachment.s3Key.split('/').pop() || attachment.s3Key}
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                          ))}
                        </div>
                      ) : (
                        // Fallback to proposalLink (old format)
                        <a
                          href="#"
                          onClick={(e) => handleFileClick(e, proposalLink)}
                          className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          {proposalLink.split('/').pop() || proposalLink}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                                    </div>

                                    {/* Show approved time if approved */}
                    {frontendStatus === 'Approved' && proposalApprovedAt && (
                                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                            <p className="text-sm text-gray-600 mb-1">
                                                {t('client.contactDetail.proposal.approvedAt')}
                                            </p>
                                            <p className="text-base font-medium text-gray-900">
                          {proposalApprovedAt}
                                            </p>
                                        </div>
                                    )}

                    {/* Show client feedback if exists */}
                    {clientFeedback && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-gray-600 mb-1">
                          {t('client.contactDetail.proposal.comment')}
                        </p>
                        <p className="text-base text-gray-900 whitespace-pre-wrap mb-2">
                          {clientFeedback}
                        </p>
                      </div>
                    )}

                    {/* Show comment if exists (from proposalComment field) - only if displaying revision_requested proposal */}
                    {shouldShowOldComment && contact.proposalComment && (
                                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <p className="text-sm text-gray-600 mb-1">
                                                {t('client.contactDetail.proposal.comment')}
                                            </p>
                                            <p className="text-base text-gray-900 whitespace-pre-wrap mb-2">
                                                {contact.proposalComment.message}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {contact.proposalComment.createdAt}
                                            </p>
                                        </div>
                                    )}

                    {/* Show buttons only if not approved and no comment/feedback */}
                    {frontendStatus !== 'Approved' && !clientFeedback && !shouldShowOldComment && (
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleApproveProposal}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {t('client.contactDetail.proposal.approve')}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowCommentModal(true)}
                                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                            >
                                                {t('client.contactDetail.proposal.comment')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
            );
          })()}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/client/contacts')}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            {t('client.contactDetail.actions.back')}
                        </Button>
                        {contact.status !== 'Closed' && contact.status !== 'Cancelled' && (
                            <Button
                                variant="outline"
                                onClick={() => setShowCancelModal(true)}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                {t('client.contactDetail.actions.cancelConsultation')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CommentModal
                isOpen={showCommentModal}
                onClose={() => setShowCommentModal(false)}
                onSubmit={handleAddComment}
            />

            <CancelConsultationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onSubmit={handleCancelConsultation}
            />
        </div>
    );
}

