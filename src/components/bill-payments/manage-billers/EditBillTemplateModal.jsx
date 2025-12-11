'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useMemo, useState } from 'react';

import { usePopup } from '@/context/PopupContext';
import { useMetaDataStore } from '@/store/useMetaDataStore';
import GlobalInput from '../../global/GlobalInput';
import GlobalSelect from '../../global/GlobalSelect';
import { Button } from '../../ui/button';

import { updateBillerTemplates } from '@/api/endpoints';

const EditBillTemplateModal = ({ isOpen, onClose, billerData, onSubmit }) => {
  const [formData, setFormData] = useState({
    billerName: '',
    nickName: '',
    currency: '',
    refNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currency = useMetaDataStore((state) => state.tn.cList) || '';

  const { showMsgPopup, showConfirmPopup } = usePopup();
  // Currency dropdown
  let currency_arr = currency.split('|');
  const currencyOptions = useMemo(() => {
    return currency_arr.map((cur) => {
      let curr = cur.split('#');
      return {
        label: curr[1],
        value: curr[0],
      };
    });
  }, [currency_arr]);

  useEffect(() => {
    if (billerData) {
      setFormData({
        billerName: billerData.billerName || '',
        nickName: billerData.nickName || '',
        currency: billerData.currency || 'USD',
        refNumber: billerData.refNumber || '',
      });
      setErrors({});
    }
  }, [billerData, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nickName.trim()) {
      newErrors.nickName = 'Biller Template Name is required.';
    }
    if (!formData.currency) {
      newErrors.currency = 'Currency is required.';
    }
    if (!formData.refNumber.trim()) {
      newErrors.refNumber = 'Reference Number is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (validate()) {
        setIsSubmitting(true);

        console.log('Submitting edited template:', formData);
        let payload = {
          billerId: billerData.billerId,
          memo: 'dummy',
          bank: billerData.bankName,
          acctNo: billerData.accountNumber,
          id: billerData.id,
          payee: billerData.billerName,
          accType: billerData.accountType,
        };

        let result = await updateBillerTemplates({ ...payload, ...formData });

        showMsgPopup(result.rs.status, result.rs.msg);
        onSubmit();
        setIsSubmitting(false);
        onClose();
      }
    } catch (e) {
      console.error('Error get biller list', e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0">
        <DialogHeader className="p-6 border-b border-gray-200 relative">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit Bill Template
          </DialogTitle>
          {/* <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button> */}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Biller Name (Read-only as per image) */}
            <GlobalInput
              label="Biller Name"
              placeholder="G Exchange Corp"
              value={formData.billerName}
              isReadOnly={true}
            />

            {/* Biller Template Name */}
            <GlobalInput
              label="Biller Template Name"
              placeholder="G Exch"
              value={formData.nickName}
              onChange={(e) => handleChange('nickName', e.target.value)}
              error={errors.nickName}
            />

            {/* Currency */}
            <GlobalSelect
              label="Currency"
              required
              placeholder="USD"
              value={formData.currency}
              onChange={(value) => handleChange('currency', value)}
              options={currencyOptions}
              error={errors.currency}
            />

            {/* Reference No. */}
            <GlobalInput
              label="Reference No."
              required
              placeholder="135246789"
              value={formData.refNumber}
              onChange={(e) => handleChange('refNumber', e.target.value)}
              error={errors.refNumber}
            />
          </div>

          <DialogFooter className="p-6 border-t border-gray-200">
            <div className="flex w-full gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                size="default"
                className="w-full text-sm border-blue-600 text-blue-600 hover:bg-blue-50"
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={isSubmitting}
                size="default"
                className="w-full text-sm bg-primary hover:bg-primary text-white"
              >
                Submit
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBillTemplateModal;
