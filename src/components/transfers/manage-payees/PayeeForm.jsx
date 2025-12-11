import GlobalInput from '@/components/global/GlobalInput';
import GlobalSelect from '@/components/global/GlobalSelect';
import HeaderTop from '@/components/global/HeaderTop';
import { Button } from '@/components/ui/button';
import { useAccountsStore } from '@/store/accountsStore';
import { useMetaDataStore } from '@/store/useMetaDataStore';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const payeeTypeOptions = [
  {
    value: 'TTP01',
    label: 'To Other Moadbus Account',
  },
  {
    value: 'TOB01',
    label: 'To Other Local Bank',
  },
];

export default function PayeeForm({ onPreview, mode, payee }) {
  const { handleSubmit, register, control, setValue } = useForm();
  const tn = useAccountsStore((state) => state.tn) || '';
  const currency = useMetaDataStore((state) => state.tn.cList) || '';
  const [payeeType, setPayeeType] = useState('TTP01');

  useEffect(() => {
    if (mode === 'edit' && payee) {
      setValue('nickname', payee.nickName);
      setValue('accountNumber', payee.accountNumber);
      setValue('bank', payee.routingNo);
      setValue('currency', payee.currency);
      setValue('accountType', payee.accountType);
      setValue('payeeType', payee.type);

      setPayeeType(payee.type);
    }
  }, [mode, payee, setValue]);

  // safe splits
  const currency_arr = (currency || '').split('|').filter(Boolean);
  const accType_arr = (tn.at || '').split('|').filter(Boolean);
  const bank_arr = (tn.ep || '').split('|').filter(Boolean);

  // Currency options
  const currencyOptions = useMemo(() => {
    return currency_arr.map((cur) => {
      const curr = cur.split('#');
      return { label: curr[1] ?? curr[0], value: curr[0] ?? curr[1] ?? '' };
    });
  }, [currency_arr]);

  // Account type options
  const accTypeOption = useMemo(() => {
    return accType_arr.map((cur) => {
      const curr = cur.split('#');
      return { label: curr[1] ?? curr[0], value: curr[0] ?? curr[1] ?? '' };
    });
  }, [accType_arr]);

  // Bank options
  const bankOptions = useMemo(() => {
    if (payeeType === 'TOB01') {
      return bank_arr
        .map((cur) => {
          const curr = cur.split('#');
          if (curr[0] && curr[0] !== '000000000') {
            return { label: curr[1] ?? curr[0], value: curr[0] };
          }
          return null;
        })
        .filter(Boolean);
    }
    return [{ label: 'Moadbus Bank', value: '000000000' }];
  }, [bank_arr, payeeType]);

  const onSubmit = (values) => {
    const payload = {
      action: '1',
      binding: '1',
      accType: values.accType,
      name: values.fullName,
      nickName: values.nickname,
      accNo: values.accountNumber,
      routingNo: values.bank,
      currency: values.currency,
      expDate: '',
    };
    if (mode === 'edit') {
      payload.action = '2';
      payload.id = payee.id;
      payload.name = payee.name;
      if (payeeType === 'TTP01') {
        payload.binding = '2';
      }
    }
    onPreview(payload);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-4xl mx-auto"
    >
      <HeaderTop
        title={`${mode === 'edit' ? 'Edit' : 'Add'} Payee`}
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {mode === 'edit' && (
          <div className="text-gray-500"> First Name & Last Name : {payee.name}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payee Type SELECT */}
          {mode !== 'edit' && (
            <Controller
              name="payeeType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <GlobalSelect
                  label="Payee Type"
                  placeholder="Select type"
                  options={payeeTypeOptions}
                  value={field.value ?? ''} // <- ensure default empty string
                  onChange={(val) => {
                    field.onChange(val); // update form
                    setPayeeType(val);
                  }}
                />
              )}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {mode !== 'edit' && (
            <GlobalInput
              label="First Name & Last Name"
              type="text"
              placeholder="Enter full name"
              required
              {...register('fullName')}
            />
          )}
          <GlobalInput
            label="Beneficiary Nickname"
            type="text"
            placeholder="Enter nickname"
            required
            {...register('nickname')}
          />

          <GlobalInput
            label="Account Number"
            type="number"
            placeholder="Enter account number"
            required
            {...register('accountNumber')}
          />

          {/* Account Type */}
          {payeeType === 'TOB01' && (
            <Controller
              name="accType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <GlobalSelect
                  label="Account Type"
                  placeholder="Select Account Type"
                  options={accTypeOption}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          )}

          {/* Bank SELECT */}
          <Controller
            name="bank"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <GlobalSelect
                label="Bank"
                placeholder="Select Bank"
                options={bankOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {/* Currency SELECT */}
          {payeeType === 'TOB01' && (
            <Controller
              name="currency"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <GlobalSelect
                  label="Currency"
                  placeholder="Select Currency"
                  options={currencyOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          )}
          <Button variant="primary" type="submit" size="default" className="w-full h-10 md:h-12">
            Submit
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
