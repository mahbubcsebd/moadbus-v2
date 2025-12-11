import { getBranchTimesApi } from '@/api/endpoints';
import GlobalInput from '@/components/global/GlobalInput';
import GlobalSelect from '@/components/global/GlobalSelect';
import { useBranchAtmStore } from '@/store/useBranchAtmStore';
import { formatDateForApi, parseTimes } from '@/utils/appointmentHelpers';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

// Helper to get today's date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const StepDayAndTime = ({ onNext, onBack, selectedLocation }) => {
  const { locations } = useBranchAtmStore();

  const [formData, setFormData] = useState({
    locationId: selectedLocation?.id || '',
    date: getCurrentDate(),
    time: '',
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [errors, setErrors] = useState({});

  // Dropdown options
  const locationList =
    locations.length > 0 ? locations : selectedLocation ? [selectedLocation] : [];

  const locationOptions = locationList.map((loc) => ({
    value: loc.id,
    label: `${loc.name}, ${loc.address}`,
  }));

  const fetchTimes = async (branchId, dateStr) => {
    if (!branchId || !dateStr) return;

    setLoadingTimes(true);
    setAvailableTimes([]);

    try {
      const apiDate = formatDateForApi(dateStr);
      const res = await getBranchTimesApi(branchId, apiDate);
      const rs = res?.rs || res;

      if (rs?.bat) {
        const times = parseTimes(rs.bat);
        setAvailableTimes(times);

        if (times.length > 0) {
          setFormData((prev) => ({ ...prev, time: times[0] }));
          setErrors((prev) => ({ ...prev, time: '' }));
        } else {
          setFormData((prev) => ({ ...prev, time: '' }));
        }
      } else {
        setAvailableTimes([]);
        setFormData((prev) => ({ ...prev, time: '' }));
      }
    } catch (error) {
      console.error('Time fetch error:', error);
      setAvailableTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  };

  useEffect(() => {
    if (formData.locationId && formData.date) {
      fetchTimes(formData.locationId, formData.date);
    }
  }, []);

  const handleLocationChange = (val) => {
    setFormData((prev) => ({ ...prev, locationId: val }));
    setErrors((prev) => ({ ...prev, locationId: '' }));

    if (formData.date) {
      fetchTimes(val, formData.date);
    }
  };

  const handleDateChange = (e) => {
    const rawDate = e.target.value;
    setFormData((prev) => ({ ...prev, date: rawDate }));
    setErrors((prev) => ({ ...prev, date: '' }));

    if (formData.locationId && rawDate) {
      fetchTimes(formData.locationId, rawDate);
    }
  };

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, time }));
    setErrors((prev) => ({ ...prev, time: '' }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.locationId) newErrors.locationId = 'Location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedLocation =
      locationList.find((l) => l.id == formData.locationId) || selectedLocation;

    onNext({
      appointmentDate: formatDateForApi(formData.date),
      appointmentTime: formData.time,
      branch: updatedLocation,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 pt-8"
    >
      <h3 className="text-lg font-semibold text-gray-800">Check Availability</h3>

      <form onSubmit={handleNext} className="max-w-2xl space-y-6">
        <GlobalSelect
          label="Check Availability at"
          required
          placeholder="Select Branch"
          value={formData.locationId}
          onChange={handleLocationChange}
          options={locationOptions}
          error={errors.locationId}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlobalInput
            label="Date"
            required
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            error={errors.date}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available times on: {formData.date ? formatDateForApi(formData.date) : '--/--/----'}
            </label>
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 max-h-48 overflow-y-auto min-h-[100px]">
              {loadingTimes ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : availableTimes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`px-2 py-2 text-sm font-medium rounded border transition-colors
                        ${
                          formData.time === time
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm py-4">
                  {!formData.locationId
                    ? 'Select a location first'
                    : !formData.date
                    ? 'Select a date'
                    : 'No times available'}
                </div>
              )}
            </div>
            {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time}</p>}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            type="button"
            className="border-blue-600 text-blue-600"
          >
            Back
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="bg-primary hover:bg-primary text-white"
          >
            Next
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default StepDayAndTime;
