'use client';

import AccountSummary from '@/components/account-activity/AccountSummary';
import TransactionTable from '@/components/account-activity/TransactionTable'; // Updated TanStack Table
import GlobalSelect from '@/components/global/GlobalSelect';
import HeaderTop from '@/components/global/HeaderTop';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccountsStore } from '@/store/accountsStore';
import { useTransactionStore } from '@/store/transactionStore';
import { Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function ActivityPage() {
  // 1. Get Params from URL
  const { accountNumber } = useParams();
  const navigate = useNavigate();

  const { accounts } = useAccountsStore();
  const { transactions, fetchTransactions, loading } = useTransactionStore();

  const [selectedAccount, setSelectedAccount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Initialize Default Account based on Slug or First Account
  useEffect(() => {
    if (accounts.length > 0) {
      // If slug exists and matches an account, use it. Otherwise, use first account.
      const targetAccount = accountNumber || accounts[0].id;

      // Only update state if it's different to prevent loops
      if (selectedAccount !== targetAccount) {
        setSelectedAccount(targetAccount);
      }
    }
  }, [accounts, accountNumber]);

  // 3. Fetch Transactions when selectedAccount changes
  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount);

      // Optional: Update URL silently if the user manually changes dropdown
      // so pagination/refresh keeps the context.
      // if (selectedAccount !== accountNumber) {
      //   navigate(`/dashboard/activity/${selectedAccount}`, { replace: true });
      // }
    }
  }, [selectedAccount]);

  const handleAccountChange = (value) => {
    setSelectedAccount(value);
    // Optional: Navigate to the new route
    navigate(`/dashboard/activity/${value}`);
  };

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: acc.description,
  }));

  const activeAccountData = accounts.find((a) => a.id === selectedAccount);

  // Client-side filtering for search
  const filteredData = transactions.filter((t) =>
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Summary Data Preparation
  const summaryData = activeAccountData
    ? {
        'Current Balance': activeAccountData.balance?.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        }),
        'Available Balance': activeAccountData.balance?.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        }),
        'Account Number': activeAccountData.accountNumber || activeAccountData.id,
        'Account Type': activeAccountData.type || 'Savings Account',
        Currency: activeAccountData.currency,
        Status: 'Active',
      }
    : null;

  return (
    <div>
      <HeaderTop
        title="Account Activity"
        text="View your recent transactions and account summary"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      {/* Top Section: Select & Balance */}
      <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="w-full md:w-1/2">
            <GlobalSelect
              placeholder="Select Account"
              options={accountOptions}
              value={selectedAccount}
              onChange={handleAccountChange}
              className="h-12"
            />
          </div>

          {activeAccountData && (
            <div className="flex gap-8 text-right">
              <div>
                <p className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                  Current Balance
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {activeAccountData.currency}{' '}
                  {activeAccountData.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                  Available Balance
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {activeAccountData.currency}{' '}
                  {activeAccountData.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="gap-4 p-0 mb-6 bg-transparent">
              <TabsTrigger
                value="activity"
                className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-100 text-gray-600 transition-all"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-100 text-gray-600 transition-all"
              >
                Summary
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: ACTIVITY */}
            <TabsContent value="activity" className="mt-0">
              <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm min-h-[500px]">
                {/* Search Bar */}
                <div className="flex justify-end mb-6">
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Transaction Search"
                      className="w-full py-2 pl-4 pr-10 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute w-4 h-4 text-blue-500 -translate-y-1/2 right-3 top-1/2" />
                  </div>
                </div>

                {/* Table / Loader */}
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                ) : (
                  <TransactionTable transactions={filteredData} />
                )}
              </div>
            </TabsContent>

            {/* TAB 2: SUMMARY */}
            <TabsContent value="summary">
              {summaryData ? (
                <AccountSummary data={summaryData} />
              ) : (
                <div className="p-12 text-center bg-white border border-gray-200 rounded-lg">
                  <span className="text-gray-500">Select an account to view summary</span>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
