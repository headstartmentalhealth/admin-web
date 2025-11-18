'use client';

import { Modal } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import OTPInput from '../ui/OtpInput';
import { fetchWithdrawal, finalizeTransfer, verifyTransfer } from '@/redux/slices/withdrawalSlice';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

interface WithdrawalModalProps {
    withdrawalId?: string;
    open: boolean;
    setOpen: (value: boolean) => void;
}

const WithdrawalModal = ({ withdrawalId, open, setOpen }: WithdrawalModalProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { postLoading } = useSelector((state: RootState) => state.withdrawal);

    const [body, setBody] = useState<{ withdrawalId?: string; otp?: string; reference?: string }>({
        withdrawalId,
    });

    const handleOTPComplete = (otp: string) => {
        setBody({ ...body, otp });
    };

    const handleSubmitOTP = async () => {
        
        if (!body.otp || !withdrawalId) return;

        const confirm = window.confirm('Are you sure you want to submit this OTP and proceed with the withdrawal?');
        if (!confirm) return;

        try {

            const res = await dispatch(finalizeTransfer({ withdrawalId, otp: body.otp })).unwrap();
            const reference = res.data?.transfer_reference;
            setBody({ ...body, reference });

            await handleVerifyTransfer(reference);
        } catch (err: any) {
            toast.error(err || 'Failed to finalize withdrawal');
        }
    };

    const handleVerifyTransfer = async (reference: string) => {
        try {
            const res = await dispatch(verifyTransfer({ reference })).unwrap();
            const message = res.message || 'Transfer verified successfully';
            toast.success(message);

            if (withdrawalId) {
                dispatch(fetchWithdrawal(withdrawalId));
            }

            setOpen(false);
        } catch (err: any) {
            toast.error(err || 'Failed to verify transfer');
        }
    };

    useEffect(() => {
        if (!open) {
            setBody({ withdrawalId });
        }
    }, [open, withdrawalId]);

    return (
        <Modal show={open} size="xl" popup onClose={() => setOpen(false)}>
            <Modal.Header />
            <Modal.Body>
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Finalize Withdrawal
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Enter the OTP sent to your registered email address to securely verify and initiate
                        the withdrawal. Make sure you have access to the email linked to this account.
                    </p>
                    <div className="mt-4">
                        <OTPInput onComplete={handleOTPComplete} />
                    </div>
                    <button
                        type="button"
                        className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-main rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-main dark:hover:bg-primary-700 dark:focus:ring-primary-800 flex justify-center items-center mt-4"
                        disabled={postLoading || !body.otp}
                        onClick={handleSubmitOTP}>
                        {postLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                            </>
                        ) : (
                            'Submit OTP'
                        )}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default WithdrawalModal;
