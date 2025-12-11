'use client';

import { getAccountStatements, getRecentTransactions } from '@/api/endpoints';
import AccountDetailsList from '@/components/account-details/AccountDetailsList';
import QuickActionsGrid from '@/components/account-details/QuickActionsGrid';
import StatementCard from '@/components/account-details/StatementCard';
import TransactionCard from '@/components/account-details/TransactionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const AccountDetailsClient = ({ account }) => {
  const navigate = useNavigate();
  const { state } = useLocation();

  account = state.account;
  console.log('Received:', state);
  const [searchQuery, setSearchQuery] = useState('');

  const [statements, setStatements] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const filteredTransactions = transaction.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        let payload = { accountNo: account.accountNumber };
        let history = await getRecentTransactions(payload);
        if (history.rs.status == 'success' && history.rs.ats) {
          history = history.rs.ats.split('|');
          let historyList = history.map((item) => {
            let current = item.split('#');
            return {
              refNumber: current[0],
              date: current[1],
              amount: Number(current[2]).toFixed(2),
              currency: current[11],
              txnActivityCode: current[3],
              txnFromAccount: current[4] ? current[4] : '',
              txnFromAccountType: current[5],
              txnToAccount: current[6] ? current[6] : '',
              txnToAccountType: current[7],
              status: current[8],
              description: current[9],
              type: Number(current[2]) > 0 ? 'credit' : 'debit',
            };
          });
          setTransaction(historyList);
        }

        let stPayload = {
          accNo: account.accountNumber,
          year: new Date().getFullYear(),
        };
        let statements = await getAccountStatements(stPayload);
        if (statements.rs.status == 'success' && statements.rs.ats) {
          let statement = statements.rs.ats.split('|');
          let statementList = statement.map((item) => {
            let current = item.split('#');
            const lastSegment = current[7] || '';
            const fileName = lastSegment.split('fileName=')[1] || '';

            return {
              month: current[0],
              transactions: current[1],
              balance: Number(current[2]).toFixed(2),
              fileName,
            };
          });
          setStatements(statementList);
        }
      } catch (error) {
        console.error('Failed to get transaction statement', error);
      }
    };

    if (account?.accountNumber) {
      fetchData();
    }
  }, [account]);

  return (
    <div className="">
      {/* Main Content */}
      <div className="">
        {/* <AccountBalanceCard account={account} /> */}
        <QuickActionsGrid account={account} />
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full h-auto grid-cols-4 p-1 bg-white border border-gray-200 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2.5 text-xs sm:text-sm font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2.5 text-xs sm:text-sm font-medium"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="statements"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2.5 text-xs sm:text-sm font-medium"
            >
              Statements
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2.5 text-xs sm:text-sm font-medium"
            >
              Details
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
                  Recent Transactions
                </h3>
              </div>
              <div className="space-y-2">
                {transaction.length > 0 ? (
                  transaction
                    .slice(0, 5)
                    .map((transaction, index) => (
                      <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        index={index}
                      />
                    ))
                ) : (
                  <p className="text-sm text-gray-500">No recent transactions.</p>
                )}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => navigate('/dashboard/transfers/transfers-history')}
              >
                View All Transactions
              </Button>
            </motion.div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative mb-4">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>

              <div className="space-y-2">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <TransactionCard key={transaction.id} transaction={transaction} index={index} />
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          {/* Statements Tab */}
          <TabsContent value="statements" className="mt-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Account Statements
              </h3>
              <div className="space-y-2">
                {statements.length > 0 ? (
                  statements.map((statement, index) => (
                    <StatementCard key={index} statement={statement} index={index} />
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">
                    <p>No statements available for this account.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Account Information
              </h3>
              <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
                <AccountDetailsList account={account} />
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="h-8" />
    </div>
  );
};

export default AccountDetailsClient;
