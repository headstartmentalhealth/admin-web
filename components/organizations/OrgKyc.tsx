'use client';

import React, { useState } from 'react';
import moment from 'moment';
import { File, ExternalLink, Download } from 'lucide-react';
import { Modal, Button, Textarea } from 'flowbite-react';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchOrganizationKYC, reviewKYC } from '@/redux/slices/organizationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { KycType } from '@/types/organization';
import toast from 'react-hot-toast';

const OrgKyc = ({ kyc, loading, OrgId }: { kyc: KycType[]; loading: boolean; OrgId: string }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [disapprovalReason, setDisapprovalReason] = useState('');

    const { kycActionLoading } = useSelector((state: RootState) => state.organization);

    const handleApprove = async (id: string) => {
        try {
            setApprovingId(id);
            await dispatch(
                reviewKYC({ kyc_id: id, is_approved: true, disapproval_reason: '' })
            ).unwrap();
            await dispatch(fetchOrganizationKYC(OrgId));
            toast.success('KYC approved successfully!');
        } catch (err: any) {
            toast.error(err || 'Failed to approve KYC.');
        } finally {
            setApprovingId(null);
        }
    };

    const handleReject = (id: string) => {
        setRejectingId(id);
        setOpenModal(true);
    };

    const confirmReject = async () => {
        if (!rejectingId) return;
        try {
            await dispatch(
                reviewKYC({
                    kyc_id: rejectingId,
                    is_approved: false,
                    disapproval_reason: disapprovalReason,
                })
            ).unwrap();
            await dispatch(fetchOrganizationKYC(OrgId));
            toast.success('KYC rejected successfully!');
        } catch (err: any) {
            toast.error(err || 'Failed to reject KYC.');
        } finally {
            setRejectingId(null);
            setDisapprovalReason('');
            setOpenModal(false);
        }
    };

    const renderFile = (label: string, url: string | null) => {
        if (!url) return null;
        const fileName = url.split('/').pop();
        return (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm">
                <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span className="truncate">
                        {label}: {fileName}
                    </span>
                </div>
                <div className="flex gap-2">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                        href={url}
                        download={fileName || true}
                        className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
                    >
                        <Download className="w-4 h-4" />
                    </a>
                </div>
            </div>
        );
    };

    if (loading) {
        return <p>Loading KYC data...</p>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kyc.map((item) => {
                    const isPending = item.is_approved === false && !item.disapproval_reason;
                    const isRejected = item.is_approved === false && !!item.disapproval_reason;

                    return (
                        <div
                            key={item.id}
                            className="border rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between transition-colors"
                        >
                            <div className="space-y-2 text-gray-800 dark:text-gray-200">
                                <p>
                                    <strong>ID Type:</strong> {item.id_type || 'N/A'}
                                </p>
                                <p>
                                    <strong>Location:</strong> {item.location || 'N/A'}
                                </p>
                                <p>
                                    <strong>City:</strong> {item.city || 'N/A'}
                                </p>
                                <p>
                                    <strong>State:</strong> {item.state || 'N/A'}
                                </p>
                                <p>
                                    <strong>Country:</strong> {item.country || 'N/A'} ({item.country_code})
                                </p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    {item.is_approved ? (
                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                            Approved
                                        </span>
                                    ) : isRejected ? (
                                        <span className="text-red-600 dark:text-red-400 font-semibold">
                                            Rejected
                                        </span>
                                    ) : (
                                        <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                                            Pending
                                        </span>
                                    )}
                                </p>
                                {isRejected && item.disapproval_reason && (
                                    <p>
                                        <strong>Reason:</strong> {item.disapproval_reason}
                                    </p>
                                )}
                                <p>
                                    <strong>Created:</strong> {moment(item.created_at).format('LLL')}
                                </p>
                                <p>
                                    <strong>Updated:</strong> {moment(item.updated_at).format('LLL')}
                                </p>

                                {/* Documents */}
                                <div className="mt-4 space-y-2">
                                    {renderFile('Document Front', item.doc_front)}
                                    {renderFile('Document Back', item.doc_back)}
                                    {renderFile('Utility Document', item.utility_doc)}
                                </div>
                            </div>

                            {isPending && (
                                <div className="flex gap-3 mt-5">
                                    <Button
                                        color="success"
                                        onClick={() => handleApprove(item.id)}
                                        isProcessing={approvingId === item.id || kycActionLoading}
                                        disabled={approvingId === item.id}
                                        className="w-full"
                                    >
                                        {approvingId === item.id ? 'Approving...' : 'Approve'}
                                    </Button>

                                    <Button
                                        color="failure"
                                        onClick={() => handleReject(item.id)}
                                        className="w-full"
                                    >
                                        Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Reject Modal */}
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Reject KYC
                        </h3>
                        <Textarea
                            placeholder="Enter rejection reason..."
                            rows={4}
                            value={disapprovalReason}
                            onChange={(e) => setDisapprovalReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                color="failure"
                                onClick={confirmReject}
                                disabled={!disapprovalReason}
                                isProcessing={kycActionLoading}
                            >
                                Confirm Reject
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default OrgKyc;
