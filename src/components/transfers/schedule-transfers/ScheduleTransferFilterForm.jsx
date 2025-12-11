import GlobalSelect from '@/components/global/GlobalSelect';
import { Button } from '@/components/ui/button';
import { useAccountsStore } from '@/store/accountsStore';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

const payeeTypeOptions = [
  { value: '1', label: 'Between my Accounts at Moadbus' },
  { value: '3', label: 'To Other Moadbus Account' },
  { value: '2', label: 'To Other Local Bank' },
];

export default function ScheduleTransferFilterForm({ onSearch, isSearching }) {
  const accounts = useAccountsStore((s) => s.accounts || []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      type: '',
    },
  });

  const accountOptions = useMemo(
    () =>
      accounts
        .filter((acc) => {
          const desc = acc.description?.toLowerCase() || '';
          return desc.includes('current') || desc.includes('savings');
        })
        .map((acc) => ({
          label: acc.description,
          value: acc.accountNumber,
        })),
    [accounts],
  );

  const onSubmit = (values) => {
    onSearch(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Controller
            name="type"
            control={control}
            rules={{ required: 'Please choose a type' }}
            render={({ field }) => (
              <GlobalSelect
                label="Transfer Type"
                placeholder="Select type"
                options={payeeTypeOptions}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                error={errors.type?.message}
              />
            )}
          />
          {/* From Account */}
          <Controller
            name="fromAccount"
            control={control}
            render={({ field }) => (
              <GlobalSelect
                label="From Account"
                options={accountOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <Button
          variant="primary"
          type="submit"
          loading={isSearching}
          size="default"
          className="w-full h-10 md:h-12"
        >
          Search
        </Button>
      </form>
    </motion.div>
  );
}
