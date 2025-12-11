import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { globals } from '@/globals/appGlobals';
import { useAccountsStore } from '@/store/accountsStore';
import { useSuccessModalStore } from '@/store/successModalStore';
import { formatToMMDDYYYY } from '@/utils/formatDate';
import { validateTwoDecimal } from '@/utils/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import GlobalInput from '../../global/GlobalInput';
import GlobalSelect from '../../global/GlobalSelect';
import TransferPrecon from '../../global/TransferPrecon';
import { Button } from '../../ui/button';
import { getlistOfBills, getBillHistory } from '@/api/endpoints';
import PaymentHistoryFilter from './PaymentHistoryFilter';
import PaymentResultsList from './PaymentResultsList';

// -------------------------------------------------------
// ZOD SCHEMA
// -------------------------------------------------------
const schema = z.object({
  fromAccount: z.string().min(1, 'From account is required.'),
  toAccount: z.string().min(1, 'To account is required.'),
  amount: z
    .string()
    .min(1, 'Amount is required.')
    .refine((v) => Number(v) > 0, 'Amount must be positive.')
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), 'Max 2 decimals allowed.'),
  description: z.string().min(1, 'Description is required.'),
  transferType: z.enum(['immediate', 'scheduled']),
  startDate: z.string().optional(),
  howOften: z.string(),
  untilOption: z.string(),
  untilDate: z.string().optional(),
});

const formatDate = (date) => {
  let date_arr = date.split('-');
  return `${date_arr[1]}/${date_arr[2]}/${date_arr[0]}`
}

export default function BPHistory({ onSubmit, isSubmitting = false }) {
  const [billersOption, setBillersOption] = useState([]);
  const [paymentResultsList, setPaymentResultsList] = useState([]);

  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: '',
      billerID: '',
      endDate: '',
    },
  });

  const getBillersList = async (params) => {
    try {
      let listOfBills = await getlistOfBills();
      listOfBills = listOfBills.rs.b.split('|');
      let billersOption = [];
      listOfBills.map((item) => {
        let current_array = item.split(';');
        let x = current_array[0];
        let nickName = x.substr(x.indexOf('-') + 1);
        if (!billersOption.some(obj => obj.label == nickName)) {
          billersOption.push({
            label: nickName,
            value: nickName
          })
        };

      })
      setBillersOption(billersOption);
    } catch (e) {
      console.error("Error get biller list", e);
      setBillersOption([])
    }
  }

  useMemo(() => {
    getBillersList()
  }, [])


  const handleReset = () => reset();

  const initialFilters = {
    fromDate: "",
    endDate: "",
    billerId: ""
  };

  const handleSearch = async (filters) => {
    setIsSearching(true);
    filters.fromDate = formatDate(filters.fromDate);
    filters.endDate = formatDate(filters.endDate);

    let result = await getBillHistory(filters);
    let final_result = [];
    if (result.rs.status == "error") alert(result.rs.msg)
    else {
      result = result.rs && result.rs.ats;
      let result_arr = result.split('|');

      result_arr.map((item) => {
        let current = item.split('#');

        let commission = +current[10];
        let tca = +current[11];
        let stamp = +current[12];
        let tax = +current[13];
        let totalFees = commission + tca + tax + stamp;
        final_result.push({
          id: current[0],
          payFrom: current[3],
          payTo: current[4],
          date: current[1],
          reference: current[16],
          templateName: current[17],
          currency: current[7],
          amount: current[2],
          billerName: current[14],
          totalFees: totalFees
        })
      })



      setPaymentResultsList(final_result)

    }
    setIsSearching(false);
  };
  return (
    <>
      <div>
        <HeaderTop
          title="Payment History"
          text="View and track all your payments"
          link="/dashboard"
          linkText="Back to Dashboard"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-4xl mx-auto"
        >
          <PaymentHistoryFilter
            initialFilters={initialFilters}
            onSearch={handleSearch}
            isSearching={isSearching}
          />
          <PaymentResultsList data={paymentResultsList} />
        </motion.div>
      </div>
    </>)
}