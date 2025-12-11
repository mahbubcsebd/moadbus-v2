import HeaderTop from '@/components/global/HeaderTop';
import TransferSuccess from '@/components/global/TransferSuccess';
import RegistrationForm from '@/components/register-recieved-money/RegistrationForm';
import { useP2PReceiveStore } from '@/store/p2pReceiveStore';
import { useNavigate } from 'react-router';

export default function RegisterReceiveMoney() {
  const { registerAccount, isSubmitting } = useP2PReceiveStore();
  const navigate = useNavigate();

  const handleRegistrationSubmit = async (formData) => {
    const success = await registerAccount(formData);
    if (success) {
    }
  };

  return (
    <div>
      <HeaderTop
        title="Register to Receive Money from Third Party"
        text="Enter your phone number or email address and press 'Search' to receive money into that Account."
        link="/dashboard/p2p-receive"
        linkText="Back to Payee List"
      />

      <RegistrationForm onSubmit={handleRegistrationSubmit} isSubmitting={isSubmitting} />

      <TransferSuccess />
    </div>
  );
}
