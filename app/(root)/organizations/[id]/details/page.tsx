'use client';

import PageHeading from '@/components/PageHeading';
import SectionContent from '@/components/SectionContent';
import { Button } from '@/components/ui/Button';
import React, { useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import useOrg from '@/hooks/page/useOrg';
import { formatMoney, PurchaseItemType } from '@/lib/utils';
import useContacts from '@/hooks/page/useContacts';
import ContactList from '@/components/organizations/contacts/ContactList';
import ProductsList from '@/components/products/ProductsList';
import useProducts from '@/hooks/page/useProducts';
import usePayments from '@/hooks/page/usePayments';
import PaymentsList from '@/components/payments/PaymentsList';
import CouponsList from '@/components/coupons/CouponsList';
import useCoupons from '@/hooks/page/useCoupons';
import CartList from '@/components/cart/CartList';
import useCart from '@/hooks/page/useCart';
import CustomersList from '@/components/organizations/customers/CustomersList';
import useCustomers from '@/hooks/page/useCustomers';
import useSubscriptionPlans from '@/hooks/page/useSubscriptionPlans';
import SubscriptionPlansList from '@/components/subscriptions/SubscriptionPlansList';
import useMultimedia from '@/hooks/page/useMultimedia';
import MultimediaList from '@/components/multimedia/MultimediaList';
import OrgOverview from '@/components/organizations/OrgOverview';
import useDistinctPayments from '@/hooks/page/useDistinctPayments';
import SuspendUnsuspendOrgAccount from '@/components/organizations/organization/SuspendUnsuspendOrgAccount';
import { useRouter } from 'next/navigation';
import useOrgKyc from '@/hooks/page/useOrgKyc';
import OrgKyc from '@/components/organizations/OrgKyc';

const OrganizationDetails = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const { organization } = useOrg();
  const { kyc, loading: kycLoading } = useOrgKyc();

  const {
    customers,
    loading: customerLoading,
    count: totalCustomers,
    currentPage: customerCurrentPage,
    onClickNext: customerOnClickNext,
    onClickPrev: customerOnClickPrev,
  } = useCustomers();

  const {
    contacts,
    loading: contactLoading,
    count: totalContacts,
    currentPage,
    onClickNext,
    onClickPrev,
  } = useContacts();

  const {
    products,
    loading: productsLoading,
    count: totalProducts,
    currentPage: productsCurrentPage,
    onClickNext: productsOnClickNext,
    onClickPrev: productsOnClickPrev,
  } = useProducts();

  const {
    payments,
    loading: paymentsLoading,
    count: totalPayments,
    currentPage: paymentsCurrentPage,
    onClickNext: paymentsOnClickNext,
    onClickPrev: paymentsOnClickPrev,
  } = usePayments();

  const {
    distinctPayments,
    distinctLoading: distinctPaymentsLoading,
    countDistinct: totalDistinctPayments,
    currentPage: distinctPaymentsCurrentPage,
    onClickNext: distinctPaymentsOnClickNext,
    onClickPrev: distinctPaymentsOnClickPrev,
  } = useDistinctPayments({ purchase_type: PurchaseItemType.SUBSCRIPTION });

  const {
    coupons,
    loading: couponsLoading,
    count: totalCoupons,
    currentPage: couponsCurrentPage,
    onClickNext: couponsOnClickNext,
    onClickPrev: couponsOnClickPrev,
  } = useCoupons();

  const {
    carts,
    loading: cartsLoading,
    count: totalCarts,
    currentPage: cartsCurrentPage,
    onClickNext: cartsOnClickNext,
    onClickPrev: cartsOnClickPrev,
  } = useCart();

  const {
    subscription_plans,
    loading: subscriptionPlansLoading,
    count: totalSubscriptionPlans,
    currentPage: subscriptionPlansCurrentPage,
    onClickNext: subscriptionPlansOnClickNext,
    onClickPrev: subscriptionPlansOnClickPrev,
  } = useSubscriptionPlans();

  const {
    multimedia,
    loading: multimediaLoading,
    count: totalMultimedia,
    currentPage: multimediaCurrentPage,
    onClickNext: multimediaOnClickNext,
    onClickPrev: multimediaOnClickPrev,
  } = useMultimedia();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OrgOverview organization={organization} />;
      case 'KYC':
        return (
          <OrgKyc
            kyc={kyc}
            loading={kycLoading}
            OrgId={organization?.id ?? ''}
          />
        );
      case 'contacts':
        return (
          <ContactList
            contacts={contacts}
            count={totalContacts}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            currentPage={currentPage}
            loading={contactLoading}
          />
        );
      case 'products':
        return (
          <ProductsList
            products={products}
            count={totalProducts}
            onClickNext={productsOnClickNext}
            onClickPrev={productsOnClickPrev}
            currentPage={productsCurrentPage}
            loading={productsLoading}
          />
        );
      case 'payments':
        return (
          <PaymentsList
            payments={payments}
            count={totalPayments}
            onClickNext={paymentsOnClickNext}
            onClickPrev={paymentsOnClickPrev}
            currentPage={paymentsCurrentPage}
            loading={paymentsLoading}
          />
        );
      case 'coupons':
        return (
          <CouponsList
            coupons={coupons}
            count={totalCoupons}
            onClickNext={couponsOnClickNext}
            onClickPrev={couponsOnClickPrev}
            currentPage={couponsCurrentPage}
            loading={couponsLoading}
          />
        );
      case 'carts':
        return (
          <CartList
            carts={carts}
            count={totalCarts}
            onClickNext={cartsOnClickNext}
            onClickPrev={cartsOnClickPrev}
            currentPage={cartsCurrentPage}
            loading={cartsLoading}
          />
        );
      case 'customers':
        return (
          <CustomersList
            customers={customers}
            count={totalCustomers}
            onClickNext={customerOnClickNext}
            onClickPrev={customerOnClickPrev}
            currentPage={customerCurrentPage}
            loading={customerLoading}
          />
        );
      case 'subscription Plans':
        return (
          <SubscriptionPlansList
            subscription_plans={subscription_plans}
            count={totalSubscriptionPlans}
            onClickNext={subscriptionPlansOnClickNext}
            onClickPrev={subscriptionPlansOnClickPrev}
            currentPage={subscriptionPlansCurrentPage}
            loading={subscriptionPlansLoading}
          />
        );
      case 'subscribers':
        return (
          <PaymentsList
            payments={distinctPayments}
            count={totalDistinctPayments}
            onClickNext={distinctPaymentsOnClickNext}
            onClickPrev={distinctPaymentsOnClickPrev}
            currentPage={distinctPaymentsCurrentPage}
            loading={distinctPaymentsLoading}
          />
        );
      case 'multimedia':
        return (
          <MultimediaList
            multimedia={multimedia}
            count={totalMultimedia}
            onClickNext={multimediaOnClickNext}
            onClickPrev={multimediaOnClickPrev}
            currentPage={multimediaCurrentPage}
            loading={multimediaLoading}
          />
        );
      default:
        return null;
    }
  };

  const navigateTocomposeEmailPage = () => {
    router.push(`/notifications/email/compose?orgId=${organization?.id}`);
  };

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading
          title={organization?.business_name}
          enableBreadCrumb={true}
          layer2={'Organizations'}
          layer3={organization?.business_name}
          enableBackButton={true}
          ctaButtons={
            <div className='flex gap-2'>
              <Button
                onClick={navigateTocomposeEmailPage}
                className='p-2 px-3 space-x-1'
              >
                <IoIosAdd /> <span>Compose</span>
              </Button>

              <SuspendUnsuspendOrgAccount
                userId={organization?.user_id!}
                isSuspended={organization?.user?.is_suspended!}
                organization={organization!}
              />
            </div>
          }
        />
      </header>

      <SectionContent>
        <div className='px-4'>
          {/* Stats */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            {[
              {
                label: 'Contacts & Members',
                value: totalContacts.toLocaleString(),
                change: '',
              },
              {
                label: 'Revenue',
                value: formatMoney(
                  +organization?.stat.total_revenue!,
                  organization?.business_wallet.currency
                ),
                change: '',
              },
              {
                label: 'Orders',
                value: organization?.stat.payments_count,
                change: '',
              },
              {
                label: 'Wallet Balance',
                value: formatMoney(
                  +organization?.business_wallet.balance!,
                  organization?.business_wallet.currency
                ),
                change: '',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className='bg-white dark:bg-gray-800 p-4 rounded-md shadow-md'
              >
                <h3 className='text-gray-600 dark:text-white'>{stat.label}</h3>
                <div className='flex gap-2 items-center'>
                  <p className='text-xl font-bold'>{stat.value}</p>
                  {stat.change && (
                    <span
                      className={
                        stat.change.includes('-')
                          ? 'text-red-500'
                          : 'text-green-500'
                      }
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className='shadow-lg p-6'>
          <div
            className='
          flex space-x-4 border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap'
          >
            {[
              'overview',
              'KYC',
              'contacts',
              'products',
              'payments',
              'coupons',
              'carts',
              'customers',
              'subscription Plans',
              'subscribers',
              'multimedia',
            ].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-gray-400'
                }`}
                onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>{renderTabContent()}</div>
        </div>
      </SectionContent>
    </main>
  );
};

export default OrganizationDetails;
