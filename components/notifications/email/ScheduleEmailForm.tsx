'use client';

import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  ActionKind,
  notificationTemplates,
  NotificationType,
  SystemRole,
} from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useOrg from '@/hooks/page/useOrg';
import {
  ScheduleEmailProps,
  ScheduleEmailSchema,
} from '@/lib/schema/notification.schema';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { scheduleEmail } from '@/redux/slices/notificationSlice';
import toast from 'react-hot-toast';
import { MultiSelect } from '@/components/ui/MultiSelect';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import useOrgOwners from '@/hooks/page/useOrgOwners';
import { fetchUsers } from '@/redux/slices/userSlice';
import { ThemeToggle } from '@/components/theme-toggle';

// Types
interface OrganizationOption {
  value: string;
  label: string;
}

interface ScheduleEmailFormContentProps {
  template: string;
  setTemplate: (template: string) => void;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

// Dynamically load the CKEditor component
const TinyMceEditor = dynamic(() => import('@/components/editor/TinyMceEditor'), { ssr: false });

const DEFAULT_FORM_VALUES: ScheduleEmailProps = {
  title: '',
  message: '',
  type: NotificationType.EMAIL,
  scheduled_time: '',
  recipients: [],
};

// Custom hook for form logic
const useEmailForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [body, setBody] = useState<ScheduleEmailProps>(DEFAULT_FORM_VALUES);
  const [editorData, setEditorData] = useState('');
  const [selectedOrgUser, setSelectedOrgUser] = useState<string[]>([]);
  const [allowAction, setAllowAction] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleScheduleEmail = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: any = await dispatch(scheduleEmail(body));

      if (response.requestStatus === 'rejected') {
        throw new Error(response.payload);
      }

      setBody(DEFAULT_FORM_VALUES);
      toast.success(response?.payload?.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
      setAllowAction(false);
    }
  }, [body, dispatch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const updatedBody = {
        ...body,
        message: editorData,
        recipients: selectedOrgUser,
      };
      setBody(updatedBody);

      const { error } = ScheduleEmailSchema.validate(updatedBody);
      if (error) {
        toast.error(error.details[0].message);
        return;
      }

      return true;
    },
    [body, editorData, selectedOrgUser]
  );

  return {
    isLoading,
    body,
    setBody,
    editorData,
    setEditorData,
    selectedOrgUser,
    setSelectedOrgUser,
    allowAction,
    setAllowAction,
    handleScheduleEmail,
    handleSubmit,
  };
};

// Preview component
const EmailPreview = ({
  editorData,
  organization,
}: {
  editorData: string;
  organization: any;
}) => (
  <div className='flex-1 border border-dashed rounded-lg'>
    <div className='space-y-6 p-4 rounded-lg shadow sm:p-6 md:p-8 w-full'>
      <div className='flex flex-col items-center justify-center pt-8 mx-auto pt:mt-0'>
        <a
          href='#'
          className='flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white'
        >
          {organization?.logo_url ? (
            <Image
              src={organization.logo_url}
              width={150}
              height={150}
              alt='Logo'
              className='m-auto block object-contain max-h-[70px]'
              priority
            />
          ) : (
            <>
              <Image
                src='/logo.png'
                width={150}
                height={150}
                alt='Logo'
                className='m-auto block dark:hidden'
                priority
              />
              <Image
                src='/logo-white.png'
                width={150}
                height={150}
                alt='Logo'
                className='m-auto hidden dark:block'
                priority
              />
            </>
          )}
        </a>
        <div className='mt-3 overflow-hidden'>
          <div dangerouslySetInnerHTML={{ __html: editorData }} />
        </div>
      </div>
    </div>
  </div>
);

// Main form component
const ScheduleEmailFormContent = ({
  template,
  setTemplate,
  openModal,
  setOpenModal,
}: ScheduleEmailFormContentProps) => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { organization, loading } = useOrg();

  const {
    isLoading,
    body,
    setBody,
    editorData,
    setEditorData,
    selectedOrgUser,
    setSelectedOrgUser,
    allowAction,
    setAllowAction,
    handleScheduleEmail,
    handleSubmit,
  } = useEmailForm();

  // Fetch all users with the 'user' role from Redux
  const { users: allUsers, loading: usersLoading } = useSelector(
    (state: RootState) => state.user
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  useEffect(() => {
    dispatch(fetchUsers({ limit: 1000, role: SystemRole.USER }));
  }, [dispatch]);

  // Locally filter users based on query and status
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !user.is_suspended) ||
      (statusFilter === 'suspended' && user.is_suspended);

    return matchesSearch && matchesStatus;
  });

  const handleToggleUser = (userId: string) => {
    setSelectedOrgUser((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredUsers.map((u) => u.id);
    setSelectedOrgUser((prev) => {
      const newSelection = new Set([...prev, ...filteredIds]);
      return Array.from(newSelection);
    });
  };

  const handleDeselectAll = () => {
    setSelectedOrgUser([]);
  };

  useEffect(() => {
    if (allowAction) {
      handleScheduleEmail();
    }
  }, [allowAction, handleScheduleEmail]);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (handleSubmit(e)) {
      setOpenModal(true);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row md:w-[70%] w-full gap-2'>
      <form className='flex-1' onSubmit={onFormSubmit}>
        <div className='space-y-6 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4'>
            <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
              Schedule email
            </h1>
            <ThemeToggle />
          </div>

          <div>
            <label
              htmlFor='subject'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Subject
            </label>
            <Input
              type='text'
              name='subject'
              required={true}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBody({ ...body, title: e.target.value })
              }
              value={body.title}
            />
          </div>

          {searchParams.get('type') === 'scheduled' && (
            <div>
              <label
                htmlFor='schedule_time'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Schedule
              </label>
              <Input
                type='datetime-local'
                name='schedule_time'
                value={body.scheduled_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBody({ ...body, scheduled_time: e.target.value })
                }
              />
            </div>
          )}

          <div>
            <label
              htmlFor='template'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Template
            </label>
            <Select
              name='template'
              data={notificationTemplates}
              required={true}
              value={template}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setTemplate(e.target.value)
              }
            />
          </div>

          {/* Recipient Selection Widget */}
          <div className='space-y-4 border border-gray-100 dark:border-gray-700 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-900/30'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
              <label className='block text-sm font-semibold text-gray-900 dark:text-white'>
                Recipients (Select Users)
              </label>
              <span className='text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full'>
                Selected: {selectedOrgUser.length} of {filteredUsers.length} filtered users
              </span>
            </div>

            {/* Filtering Controls */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              {/* Search */}
              <input
                type='text'
                placeholder='Search by name or email...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='block w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500'
              />

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className='block w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='all'>All Statuses (Active & Suspended)</option>
                <option value='active'>Active Only</option>
                <option value='suspended'>Suspended Only</option>
              </select>

              {/* Selection Utilities */}
              <div className='flex gap-2 justify-end items-center'>
                <button
                  type='button'
                  onClick={handleSelectAllFiltered}
                  className='px-3 py-2 text-xs font-semibold text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 rounded-md dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-600 dark:hover:text-white transition-all w-full text-center'
                >
                  Select All Filtered
                </button>
                <button
                  type='button'
                  onClick={handleDeselectAll}
                  className='px-3 py-2 text-xs font-semibold text-red-700 hover:text-white border border-red-700 hover:bg-red-800 rounded-md dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white transition-all w-full text-center'
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Scrollable list of users */}
            <div className='max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2 space-y-2 bg-white dark:bg-gray-900'>
              {usersLoading ? (
                <div className='flex items-center justify-center py-8 text-sm text-gray-500 dark:text-gray-400'>
                  <Loader2 className='animate-spin mr-2 h-4 w-4' />
                  Fetching users...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className='text-center py-8 text-sm text-gray-500 dark:text-gray-400'>
                  No users match your filters.
                </div>
              ) : (
                filteredUsers.map((user: any) => {
                  const isSelected = selectedOrgUser.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleToggleUser(user.id)}
                      className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer border transition-all ${isSelected
                        ? 'bg-blue-50/50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-800'
                        : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750'
                        }`}
                    >
                      <div className='flex items-center gap-3'>
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={() => { }} // handled by row onClick
                          className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <div>
                          <div className='text-sm font-semibold text-gray-900 dark:text-white'>
                            {user.name}
                          </div>
                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${user.is_suspended
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 mr-1.5 rounded-full ${user.is_suspended ? 'bg-red-500' : 'bg-green-500'
                              }`}
                          />
                          {user.is_suspended ? 'Suspended' : 'Active'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {template === 'custom' && (
            <div>
              <label
                htmlFor='body'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Body
              </label>
              <Suspense fallback={<div>Loading editor...</div>}>
                <TinyMceEditor
                  value={editorData}
                  onChange={setEditorData}
                  isEmailTemplate={true}
                />
              </Suspense>
            </div>
          )}

          <button
            type='submit'
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex gap-2'
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className='animate-spin' /> &nbsp; Loading...
              </>
            ) : (
              'Send'
            )}
          </button>

          <ActionConfirmationModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            allowAction={allowAction}
            setAllowAction={setAllowAction}
            action={ActionKind.FAVORABLE}
          />
        </div>
      </form>

    </div>
  );
};

// Main component
const ScheduleEmailForm = () => {
  const [template, setTemplate] = useState('custom');
  const [openModal, setOpenModal] = useState(false);

  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ScheduleEmailFormContent
        template={template}
        setTemplate={setTemplate}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </Suspense>
  );
};

export default ScheduleEmailForm;
