'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AppDispatch, RootState } from '@/redux/store';
import { acceptInvite } from '@/redux/slices/organizationSlice';

const JoinInvitationForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const { invite } = useSelector((state: RootState) => state.organization);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const resultAction = await dispatch(
        acceptInvite({
          token,
          ...(name && { name }),
          ...(password && { password }),
        })
      );

      if (acceptInvite.fulfilled.match(resultAction)) {
        // Redirect to sign in or dashboard after accepting
        router.push('/auth/login');
      } else {
        setError(
          (resultAction.payload as any)?.message ||
            (resultAction.payload as string) ||
            'Failed to accept invitation'
        );
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!invite) return null;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {!invite.user && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-4"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Accept Invitation'}
      </Button>
    </form>
  );
};

export default JoinInvitationForm;
