import Statements from '@/components/accounts/Statements';
import HeaderTop from '@/components/global/HeaderTop';

const StatementPage = () => {
  return (
    <div className="">
      <HeaderTop
        title="Account Statements"
        text="View and download your account statements"
        link="/dashboard/accounts"
        linkText="Back to Accounts"
      />
      <Statements />
    </div>
  );
};

export default StatementPage;
