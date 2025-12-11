import { useLangStore } from '@/store/langStore';
import { loadLanguage } from '@/utils/loadLanguage';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import AccountDetailsClient from './components/account-details/AccountDetailsClient';
import InquireCheckStatus from './components/account-details/InquireCheckStatus';
import MakePayment from './components/account-details/MakePayment';
import OrderAnAffidavit from './components/account-details/OrderAnAffidavit';
import OrderCashierCheck from './components/account-details/OrderCashierCheck';
import OrderPrintStatements from './components/account-details/OrderPrintStatements';
import PositivePay from './components/account-details/PositivePay';
import QuickTransfer from './components/account-details/QuickTransfer';
import ReorderCheckbook from './components/account-details/ReorderCheckbook';
import StopCheckPayment from './components/account-details/StopCheckPayment';
import ActivateDevice from './components/auth/ActivateDevice';
import ForgotPassword from './components/auth/ForgotPassword';
import ForgotUserID from './components/auth/ForgotUserID';
import PersonalRegister from './components/auth/PersonalRegister';
import BPLandingPage from './components/bill-payments/BPLanding';
import BillPayment from './components/bill-payments/BillPayment';
import SavedBillersList from './components/bill-payments/manage-billers/SavebBillersList';
import BPHistory from './components/bill-payments/payment-history/BPHistory';
import ScheduledBillPayments from './components/bill-payments/scheduled-bill-payments/ScheduledBillPayments';
import DashboardLayout from './components/layout/Dashboard';
import TopupLandingPage from './components/mobile-manage/MobileRechargeLanding';
import { ThemeInitializer } from './components/theme/ThemeInitializer';
import BetweenLocalBank from './components/transfers/BetweenLocalBank';
import BetweenOwnAccounts from './components/transfers/BetweenOwnAccounts';
import BetweenOwnBank from './components/transfers/BetweenOwnBank';
import ManagePayees from './components/transfers/ManagePayees';
import ScheduleTransfers from './components/transfers/ScheduleTransfers';
import TransferHistory from './components/transfers/TransferHistory';
import TransferLandingPage from './components/transfers/TransferLanding';
import AddPayee from './components/transfers/manage-payees/AddPayee';
import EditPayee from './components/transfers/manage-payees/EditPayee';
import ScheduledTransferHistory from './components/transfers/schedule-transfers/ScheduledTransferHistory';
import AgreementConfirmation from './components/welcome/AgreementConfirmation';
import TermsAndConditions from './components/welcome/TermsAndConditions';
import Welcome from './components/welcome/Welcome';
import { useSession } from './context/SessionContext.jsx';
import { useInitialFetch } from './hooks/useInitialFetch';
import AccountActivity from './pages/AccountActivity';
import AccountRename from './pages/AccountRename';
import AccountsPage from './pages/Accounts';
import AppointmentsPage from './pages/Appointments';
import BeforeLoginContact from './pages/BeforeLoginContact';
import BeforeLoginFindBranch from './pages/BeforeLoginFindBranch';
import ChallengeQuestions from './pages/ChallangeQuestions';
import ChangePassword from './pages/ChangePassword';
import ContactUs from './pages/ContactUs';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import FAQPage from './pages/FAQ';
import FindBranch from './pages/FindBranch';
import Home from './pages/Home';
import MobileManage from './pages/MobileManage';
import MobileRecharge from './pages/MobileRecharge';
import NotFound from './pages/NotFound';
import Notifications from './pages/Notifications';
import P2PReceive from './pages/P2PReceive';
import P2PSend from './pages/P2PSend';
import PrivacyPolicyPage from './pages/PrivacyNotice';
import Profile from './pages/Profile';
import RegisterReceiveMoney from './pages/RegisterReceiveMoney';
import ReportFraud from './pages/ReportFraud';
import SecureMessage from './pages/SecureMessage';
import SecureUpload from './pages/SecureUpload';
import SecurityHistory from './pages/SecurityHistory';
import StatementPage from './pages/Statements';
import TechnicalRequirementPage from './pages/TechnicalRequirement';
import ThemePage from './pages/ThemePage';
import Transfer from './pages/Transfer';
import useBrandStore from './store/brandStore';

function App() {
  useInitialFetch();
  useEffect(() => {
    const savedLang = useLangStore.getState().lang;
    loadLanguage(savedLang);
  }, []);
  const { resetTimers } = useSession();

  const brandConfig = useBrandStore((state) => state.brandConfig);

  return (
    <div onClick={resetTimers}>
      <ThemeInitializer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-userID" element={<ForgotUserID />} />
        <Route path="/personal-registration" element={<PersonalRegister />} />

        <Route path="/activate-device" element={<ActivateDevice />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy-notice" element={<PrivacyPolicyPage />} />
        <Route path="/technical-requirements" element={<TechnicalRequirementPage />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="statements" element={<StatementPage />} />

          {/* Transfers */}
          <Route path="transfers" element={<TransferLandingPage />} />
          <Route path="transfer/:accountNumber" element={<Transfer />} />
          <Route path="activity/:accountNumber" element={<AccountActivity />} />
          <Route path="change-account/:accountNumber" element={<AccountRename />} />

          <Route path="transfers/transfer-between-own-acccounts" element={<BetweenOwnAccounts />} />
          <Route path="transfers/transfer-between-own-bank" element={<BetweenOwnBank />} />
          <Route path="transfers/transfer-between-local-bank" element={<BetweenLocalBank />} />

          <Route path="transfers/transfers-history" element={<TransferHistory />} />
          <Route path="transfers/manage-payees" element={<ManagePayees />} />
          <Route path="transfers/add-payee" element={<AddPayee />} />
          <Route path="transfers/edit-payee" element={<EditPayee />} />

          <Route path="transfers/schedule-transfers" element={<ScheduleTransfers />} />
          <Route
            path="transfers/schedule-transfers-history"
            element={<ScheduledTransferHistory />}
          />

          {/* Bill Payment */}
          <Route path="bill-payments" element={<BPLandingPage />} />
          <Route path="bill-payments-pay" element={<BillPayment />} />
          <Route path="bill-payments-history" element={<BPHistory />} />
          <Route path="bill-payments-billers" element={<SavedBillersList />} />
          <Route path="bill-payments-scheduled" element={<ScheduledBillPayments />} />

          <Route path="contact-us" element={<ContactUs />} />
          <Route path="documents" element={<Documents />} />
          <Route path="secure-messages" element={<SecureMessage />} />
          <Route path="secure-upload" element={<SecureUpload />} />
          <Route path="find-branch" element={<FindBranch />} />
          <Route path="appointments" element={<AppointmentsPage />} />

          {/* { Account Options} */}
          <Route path="account-options" element={<AccountDetailsClient />} />
          <Route path="order-print-statement" element={<OrderPrintStatements />} />
          <Route path="order-an-affidavit" element={<OrderAnAffidavit />} />
          <Route path="reorder-checkbook" element={<ReorderCheckbook />} />
          <Route path="stop-check-payment" element={<StopCheckPayment />} />
          <Route path="order-cashier-check" element={<OrderCashierCheck />} />
          <Route path="inquire-check-status" element={<InquireCheckStatus />} />
          <Route path="positive-pay" element={<PositivePay />} />
          <Route path="transfer" element={<QuickTransfer />} />
          <Route path="make-payment" element={<MakePayment />} />

          {/* Mobile Top Up */}
          <Route path="mobile-topup" element={<TopupLandingPage />} />
          <Route path="mobile-recharge" element={<MobileRecharge />} />
          <Route path="mobile-manage" element={<MobileManage />} />

          {/* P2P Payments */}
          <Route path="p2p-send" element={<P2PSend />} />
          <Route path="p2p-receive" element={<P2PReceive />} />
          <Route path="register-recieved-money" element={<RegisterReceiveMoney />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />} />

          {/* Security */}
          <Route path="security-history" element={<SecurityHistory />} />
          <Route path="security-password" element={<ChangePassword />} />
          <Route path="security-fraud" element={<ReportFraud />} />
          <Route path="security-questions" element={<ChallengeQuestions />} />

          {/* Profile */}
          <Route path="notification" element={<Notifications />} />
          {/* Theme */}
          <Route path="theme" element={<ThemePage />} />
        </Route>

        {/* Before Login */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/agreement" element={<AgreementConfirmation />} />
        <Route path="/terms-condition" element={<TermsAndConditions />} />
        <Route path="/contact-us" element={<BeforeLoginContact />} />
        <Route path="/find-branch" element={<BeforeLoginFindBranch />} />

        {/* Not found page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
