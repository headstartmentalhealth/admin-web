import PageHeading from '@/components/PageHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiShield, FiSettings } from 'react-icons/fi';
import GeneralSettings from '@/components/settings/GeneralSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';

const Settings = () => {
  return (
    <main className='bg-muted/40 min-h-screen'>
      <header className='section-container pt-6 pb-4'>
        <PageHeading
          title='Settings'
          enableBreadCrumb={true}
          layer2='Settings'
        />
      </header>

      <section className='section-container-pt-0 '>
        <Tabs defaultValue='general' className='w-full'>
          <div className='flex flex-col md:flex-row gap-6'>
            {/* Sidebar Navigation */}
            <div className='w-full md:w-64 shrink-0'>
              <TabsList className='flex flex-col h-auto p-2 bg-background'>
                <TabsTrigger
                  value='general'
                  className='w-full justify-start px-4 py-3 data-[state=active]:bg-primary-main text-black-1 dark:text-white'
                >
                  <FiSettings className='w-4 h-4' />
                  &nbsp; General
                </TabsTrigger>
                <TabsTrigger
                  value='security'
                  className='w-full justify-start px-4 py-3 data-[state=active]:bg-primary-main text-black-1 dark:text-white'
                >
                  <FiShield className='w-4 h-4' />
                  &nbsp; Security
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Main Content Area */}
            <div className='flex-1'>
              <TabsContent value='general'>
                <GeneralSettings />
              </TabsContent>
              <TabsContent value='security'>
                <SecuritySettings />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </section>
    </main>
  );
};

export default Settings;
