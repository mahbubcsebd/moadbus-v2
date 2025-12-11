import { useMemo, useState, useEffect } from 'react';
import GlobalSelect from '@/components/global/GlobalSelect';
import FormInput from '../ui/form-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


const ScheduleTransfer = ({ errors }) => {

  const [payNow, setPayNow] = useState('N');
  const [recur, setRecur] = useState(1);
  const [until, setUntil] = useState('N');


  const untilOption = [{
    label: 'Further Notice',
    value: 'N'
  }, {
    label: 'Specified Date',
    value: 'Y'
  }]

  const recurrency = ['Once', 'Weekly', "Bi-weekly", 'Monthly', 'Quarterly', 'Halfyearly', 'Annual']



  return (
    <div className="">
      <div className="flex  items-center justify-center mt-1 gap-3">
        <div
          className={`text-sm text-gray-500 flex items-center justify-center rounded-4xl p-2 px-3  border ${payNow === 'N' ? "border-amber-400" : ""}`}
          onClick={() => { setPayNow('N'); setUntil('N'); setRecur(1) }}
        >
          Immediate
        </div>
        <div className={`text-sm text-gray-500 flex items-center justify-center rounded-4xl p-2 px-3  border ${payNow === 'Y' ? "border-amber-400" : ""}`}
          onClick={() => setPayNow('Y')}
        >
          Scheduled
        </div>
      </div>
      {payNow === 'Y' && <FormInput
        label="Start Date"
        type="date"
        placeholder="Enter Start Date"
        error={errors.startDate?.message}

      />
      }

      <div className="flex  items-center justify-center mt-3 gap-2 flex-wrap">
        {
          payNow === 'Y' && recurrency.map((item, index) => <label className=" text-sm text-gray-500 flex  items-center justify-center  border rounded-4xl p-2 pl-3 pr-3"><Input
            type="radio"
            name="recur"
            checked={index + 1 == recur}
            onChange={() => setRecur(index + 1)}
          /> {item}</label>)
        }
      </div>

      {
        recur !== 1 && <GlobalSelect
          label="Until"
          placeholder="Until"
          options={untilOption}
          required
          onChange={setUntil}
          error={errors.until?.message}
        />
      }

      {
        until === 'Y' && <FormInput
          label="End Date"
          type="date"
          placeholder="Enter End Date"
          error={errors.endDate?.message}
          required
        />
      }


    </div>
  );
};

export default ScheduleTransfer;
