import { deletePayee, getListOfPayees } from '@/api/endpoints';
import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { useSuccessModalStore } from '@/store/successModalStore';
import { useEffect, useState } from 'react';
import TransferPrecon from '../global/TransferPrecon';
import PayeeFilterForm from './manage-payees/PayeeFilterForm';
import PayeeListTable from './manage-payees/PayeeListTable';
import { useNavigate } from "react-router";

export default function ManagePayees() {
  const [filters, setFilters] = useState({
    type: 'TMA01',
  });

  const [payees, setPayees] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess } = useSuccessModalStore.getState();

  const { showMsgPopup } = usePopup();
  const navigate = useNavigate();
  const handleSearch = async (newFilters) => {
    setIsSearching(true);

    try {
      // ---------------------------------------------------------
      // 1️⃣ Build payload with default values
      // ---------------------------------------------------------
      let binding = '2';
      let fromFlag = '1';

      if (newFilters.type === 'TOB01') {
        binding = '1';
      }

      const payload = {
        type: newFilters.type,
        binding,
        fromFlag,
      };

      setFilters(newFilters);

      const res = await getListOfPayees(payload);

      if (res.rs?.status === 'success') {
        const raw = res.rs.p.split('|').filter(Boolean);

        const formatted = raw.map((row) => {
          const p = row.split(';');

          return {
            name: p[0] ?? '',
            accountType: p[1] ?? '',
            routingNo: p[2] ?? '',
            accountNumber: p[5] ?? '',
            bankName: p[6] ?? '',
            nickName: p[7] ?? '',
            currency: p[9] ?? '',
            id: p[10] ?? '',
          };
        });

        setPayees(formatted);
      } else {
        setPayees([]);
      }
    } catch (err) {
      console.error('Error loading payees:', err);
      setPayees([]);
    }

    setIsSearching(false);
  };

  useEffect(() => {
    handleSearch(filters);
  }, []);

  const handleDeletePreview = (payee) => {
    const payload = {
      name: payee.name,
      nickName: payee.nickName,
      accNo: payee.accountNumber,
      routingNo: payee.routingNo,
      bankName: payee.bankName,
    };

    setSelectedPayee(payload);
    setIsOpen(true);
  };

  const handleEditPreview = (payee) => {
    payee.type = filters.type;
    navigate(`/dashboard/transfers/edit-payee`, {state: { payee: payee }})
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);

      const res = await deletePayee(selectedPayee);

      console.log('Delete response:', res);

      if (res?.rs?.status === 'success') {
        showSuccess(res.rs, 'Delete Payee');

        setIsOpen(false);
      } else {
        showMsgPopup('error', res?.rs?.msg || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <HeaderTop
        title="Manage Payees"
        text="View, add, edit, or delete your saved transfer recipients"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <PayeeFilterForm initialFilters={filters} onSearch={handleSearch} isSearching={isSearching} />

      <PayeeListTable
        data={payees}
        isSearching={isSearching}
        onDeletePreview={handleDeletePreview}
        onEditPreview={handleEditPreview}
      />

      <TransferPrecon
        heading="Delete Payee"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        formData={selectedPayee}
        onConfirm={handleConfirmDelete}
        isSubmitting={isSubmitting}
        feesData={feesData}
        setFeesData={() => { }}
        skipCalculateFees
      />
    </div>
  );
}
