import { getListOfPayments } from '@/api/endpoints';
import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { useSuccessModalStore } from '@/store/successModalStore';
import { useState } from 'react';
import ScheduleTransferFilterForm from './schedule-transfers/ScheduleTransferFilterForm';
import ScheduleTransferListTable from './schedule-transfers/ScheduleTransferListTable';

export default function ScheduleTransfers() {
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

  const handleSearch = async (newFilters) => {
    setIsSearching(true);
    try { 
      let fromFlag = '1';

      const payload = {
        output:newFilters.type,
        fromFlag,
      };

      setFilters(newFilters);

      const res = await getListOfPayments(payload);

      if (res.rs?.status === 'success') {
        const raw = res.rs.p.split('|').filter(Boolean);

        const formatted = raw.map((row) => {
          const p = row.split(';');
          console.log('p.....', p);

          return {
            id: p[0] ?? '',
            accountType: p[16] ?? '',
            fromAc: p[1] ?? '',
            toAc: p[15] ?? '',
            toAccName: p[3] ?? '',
            currency: p[4] ?? '',
            amount: p[5] ?? '',
            desc: p[6] ?? '',
            date: p[8] ?? '',
            status: p[13] ?? '',
            howOften: p[9] ?? '',
            untilSelect: p[10] ?? '',
            endDate: p[11] ?? '',
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

  return (
    <div>
      <HeaderTop
        title="Scheduled Transfers"
        text="View and manage all your upcoming transfers"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <ScheduleTransferFilterForm onSearch={handleSearch} isSearching={isSearching} />

      <ScheduleTransferListTable data={payees} isSearching={isSearching} />
    </div>
  );
}
