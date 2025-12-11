'use client';

import AccountOptionsForm from '@/components/account-options/AccountOptionsForm';
import GlobalSuccess from '@/components/global/GlobalSuccess';
import HeaderTop from '@/components/global/HeaderTop';
import { useAccountsStore } from '@/store/accountsStore';
import { useLocation, useParams } from 'react-router';

export default function AccountRename() {
  const { accountNumber } = useParams();
  const location = useLocation();
  const { accounts } = useAccountsStore();

  // Try to get account from State (passed from Link) or Find in Store
  let account = location.state?.account;

  if (!account && accounts.length > 0) {
    account = accounts.find((a) => a.accountNumber === accountNumber || a.id === accountNumber);
  }

  // Fallback if direct access without state/store loading
  if (!account) {
    return <div className="p-8 text-center">Loading Account Details...</div>;
  }

  return (
    <div>
      <HeaderTop
        title="Account Options"
        text="Manage your account settings"
        link={`/dashboard/activity/${account.accountNumber}`}
        linkText="Back to Activity"
      />

      <AccountOptionsForm account={account} />

      {/* Global Success Modal */}
      <GlobalSuccess />
    </div>
  );
}
