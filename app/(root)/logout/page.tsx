'use client';

import { logout } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LogOut, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response: any = await dispatch(logout());
      if (response.requestStatus === 'rejected') {
        throw new Error(response.payload || 'Logout failed');
      }
      toast.success('Logged out successfully');
      router.push('/sign-in');
    } catch (err: any) {
      toast.error(err.message || 'Logout failed');
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-6 sm:p-8 text-center transition-all">
        {/* Decorative Icon */}
        <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        {/* Headings */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Confirm Logout
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Are you sure you want to log out of your account? You will need to log back in to access your dashboard.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Yes, Log Out
              </>
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-gray-750 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            No, Keep Me Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
