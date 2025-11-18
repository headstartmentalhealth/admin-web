'use client';

import PageHeading from '@/components/PageHeading';
import WithdrawalList, { RetrievalType } from '@/components/withdrawal/WithdrawalList';
import React from 'react';

const Withdrawals = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="section-container">

                <PageHeading
                    title="Withdrawals"
                    enableBreadCrumb={true}
                    layer2="Withdrawals"
                />

                <WithdrawalList retrieve={RetrievalType.ALL} />
                
            </div>
        </main>
    );
};

export default Withdrawals;
