'use client';

import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  ActionKind,
  notificationTemplates,
  NotificationType,
} from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useOrg from '@/hooks/page/useOrg';
import {
  ScheduleEmailProps,
  ScheduleEmailSchema,
} from '@/lib/schema/notification.schema';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { scheduleEmail } from '@/redux/slices/notificationSlice';
import toast from 'react-hot-toast';
import { MultiSelect } from '@/components/ui/MultiSelect';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import useOrgOwners from '@/hooks/page/useOrgOwners';

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
const CkEditor = dynamic(() => import('@/components/CkEditor'), { ssr: false });

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
const EmailPreview = ({ editorData }: { editorData: string }) => (
  <div className='flex-1 border border-dashed rounded-lg'>
    <div className='space-y-6 p-4 rounded-lg shadow sm:p-6 md:p-8 w-full'>
      <div className='flex flex-col items-center justify-center pt-8 mx-auto pt:mt-0'>
        <a
          href='#'
          className='flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white'
        >
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
  const { organization, loading } = useOrg();
  const { organizationOwners, loading: orgOwnersLoading } = useOrgOwners();

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

  const organizationList = useMemo(() => {
    if (searchParams.has('orgId')) {
      return [
        {
          value: loading ? '' : organization?.user_id!,
          label: loading
            ? ''
            : `${organization?.business_name!} - (${organization?.user.email})`,
        },
      ];
    }
    return organizationOwners.map((orgOwner) => ({
      value: orgOwnersLoading ? '' : orgOwner?.id!,
      label: orgOwnersLoading
        ? ''
        : `${orgOwner?.name!} - (${orgOwner?.email})`,
    }));
  }, [
    searchParams,
    loading,
    organization,
    organizationOwners,
    orgOwnersLoading,
  ]);

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
    <div className='flex flex-col lg:flex-row gap-2'>
      <form className='flex-1' onSubmit={onFormSubmit}>
        <div className='space-y-6 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'>
          <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
            Compose email
          </h1>

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

          <div>
            <label
              htmlFor='organization'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Organization
            </label>
            <MultiSelect
              options={organizationList}
              onValueChange={setSelectedOrgUser}
              defaultValue={selectedOrgUser}
              placeholder='Select organization'
              variant='inverted'
              animation={2}
              maxCount={3}
            />
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
                <CkEditor
                  editorData={editorData}
                  setEditorData={setEditorData}
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

      <EmailPreview editorData={editorData} />
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
