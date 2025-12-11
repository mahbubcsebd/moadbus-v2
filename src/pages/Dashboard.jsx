import AccountsGrid from '@/components/accounts/AccountGrid';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTransactions from '@/components/layout/RecentTransaction';
import { useAccountsStore } from '@/store/accountsStore';
import { useTranslation } from '@/utils/t';

export default function Dashboard() {
  const userName = useAccountsStore((s) => s.userName);
  const t = useTranslation();

  return (
    <>
      <h1 className="text-[20px] lg:text-2xl md:text-[28px] text-[#71717A] mb-1 lg:mb-2">
        {t('login_welcome_back.login_welcome_back')},{' '}
        <span className=" font-semibold text-[#18181B]"> {userName}</span>
      </h1>
      <p className="text-sm mb-5 md:text-base text-[#71717A]">
        Manage your accounts and transactions
      </p>
      <div className="mb-6 md:mb-8">
        <QuickActions />
      </div>
      <AccountsGrid />
      <RecentTransactions />
    </>
  );
}
