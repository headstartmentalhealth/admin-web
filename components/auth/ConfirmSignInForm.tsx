'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { decryptInput, isEncrypted } from '@/lib/utils';

import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { VerifyLoginFormSchema } from '@/lib/schema/auth.schema';
import { Loader2, RotateCcw } from 'lucide-react';
import { resendOtp, verifyLogin } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';
import OTPInput from '../ui/OtpInput';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';

const RESEND_COOLDOWN = 60; // seconds
const OTP_SENT_KEY = 'otp_sent_at';

const defaultValue = {
  otp: '',
};

const ConfirmSignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token')!;
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [body, setBody] = useState(defaultValue);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Compute remaining seconds from the stored timestamp, clamped to [0, RESEND_COOLDOWN] */
  const getRemainingSeconds = (): number => {
    const stored = sessionStorage.getItem(OTP_SENT_KEY);
    if (!stored) return 0;
    const elapsed = Math.floor((Date.now() - Number(stored)) / 1000);
    return Math.max(0, RESEND_COOLDOWN - elapsed);
  };

  // Initialise from sessionStorage so a refresh resumes the correct countdown
  const [countdown, setCountdown] = useState<number>(() => {
    if (typeof window === 'undefined') return RESEND_COOLDOWN;
    return getRemainingSeconds();
  });

  const startCountdownFrom = useCallback((seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(seconds);
    if (seconds <= 0) return;
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const startCountdown = useCallback(() => {
    sessionStorage.setItem(OTP_SENT_KEY, String(Date.now()));
    startCountdownFrom(RESEND_COOLDOWN);
  }, [startCountdownFrom]);

  // On mount: resume from stored timestamp (handles refresh) or start fresh
  useEffect(() => {
    const remaining = getRemainingSeconds();
    if (remaining > 0) {
      startCountdownFrom(remaining);
    } else if (!sessionStorage.getItem(OTP_SENT_KEY)) {
      // First ever load — kick off the timer and record the timestamp
      startCountdown();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const email = decryptInput(token);

      const { error } = VerifyLoginFormSchema.validate({
        ...body,
        email,
      });

      if (error) {
        throw new Error(error.details[0].message);
      }

      const { otp } = body;

      const response: any = await dispatch(verifyLogin({ email, otp }));

      if (response.type === 'auth/verify-otp/rejected') {
        throw new Error(response.payload.message);
      }

      router.push('/');
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;

    try {
      setIsResending(true);
      const email = decryptInput(token);

      const response: any = await dispatch(resendOtp({ email }));

      if (response.type === 'auth/resend-otp/rejected') {
        throw new Error(response.payload?.message || 'Failed to resend OTP');
      }

      toast.success('A new OTP has been sent to your email.');
      startCountdown();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleOTPComplete = (otp: string) => {
    setBody({ ...body, otp });
  };

  useEffect(() => {
    if (!token || !isEncrypted(token)) {
      router.push('/sign-in');
    }
  }, [token, router]);

  const canResend = countdown === 0 && !isResending;

  return (
    <>
      <form className='mt-8' onSubmit={handleSubmit}>
        <div className='flex flex-col'>
          <div className='flex mt-5 mb-4'>
            <OTPInput onComplete={handleOTPComplete} />
          </div>

          {/* Resend OTP row */}
          <div className='flex items-center justify-center mb-6 text-sm'>
            {countdown > 0 ? (
              <span className='text-gray-500 dark:text-gray-400'>
                Resend OTP in{' '}
                <span className='font-semibold text-primary-main tabular-nums dark:text-white'>
                  0:{String(countdown).padStart(2, '0')}
                </span>
              </span>
            ) : (
              <button
                type='button'
                onClick={handleResendOtp}
                disabled={!canResend}
                className='flex items-center gap-1 text-primary-main hover:underline disabled:opacity-50 disabled:cursor-not-allowed dark:text-white'
              >
                {isResending ? (
                  <Loader2 size={14} className='animate-spin' />
                ) : (
                  <RotateCcw size={14} />
                )}
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <button
            type='submit'
            className='w-full flex justify-center items-center px-5 py-3 text-base font-medium text-white bg-primary-main rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-main dark:hover:bg-primary-700 dark:focus:ring-primary-800'
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <Loader2 size={20} className='animate-spin' />
                <span>Loading...</span>
              </div>
            ) : (
              'Proceed to your account'
            )}
          </button>

          <Link
            href={'/sign-in'}
            className='text-sm text-center mt-3 hover:underline'
          >
            <div className='flex justify-center items-center gap-1'>
              <IoIosArrowBack />
              Back to Signin
            </div>
          </Link>
        </div>
      </form>
    </>
  );
};

export default ConfirmSignInForm;
