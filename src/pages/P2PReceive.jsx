import HeaderTop from '@/components/global/HeaderTop';
import TransferSuccess from '@/components/global/TransferSuccess';
import RegisteredPayeesSection from '@/components/p2p-receive/RegisteredPayeesSection';
import { useP2PReceiveStore } from '@/store/p2pReceiveStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function P2PReceive() {
  const { payees, fetchPayees, deletePayees, isSubmitting } = useP2PReceiveStore();
  const [selectedPayees, setSelectedPayees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayees();
  }, []);

  const handleRegister = () => {
    navigate('/dashboard/register-recieved-money');
  };

  const handleToggleSelect = (id) => {
    setSelectedPayees((prev) =>
      prev.includes(id) ? prev.filter((payeeId) => payeeId !== id) : [...prev, id],
    );
  };

  const handleDelete = async () => {
    if (selectedPayees.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedPayees.length} payee(s)?`)) {
      const success = await deletePayees(selectedPayees);
      if (success) {
        setSelectedPayees([]);
      }
    }
  };

  return (
    <div>
      <HeaderTop
        title="Receive Money from Third Party"
        text="Below are list of registered P2P Payees to receive money"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <RegisteredPayeesSection
        data={payees}
        selectedPayees={selectedPayees}
        onToggleSelect={handleToggleSelect}
        onRegister={handleRegister}
        onDelete={handleDelete}
        onCancel={() => setSelectedPayees([])}
      />

      <TransferSuccess />
    </div>
  );
}
