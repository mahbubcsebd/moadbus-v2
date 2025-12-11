import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const ActivityLog = ({ data }) => {
  // Default empty string means NO date is open initially
  const [openDate, setOpenDate] = useState('');

  const handleToggle = (date) => {
    setOpenDate((prev) => (prev === date ? '' : date));
  };

  if (!data || data.length === 0) {
    return <div className="p-6 text-center text-gray-500">No activity logs found.</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((day) => {
        const isOpen = openDate === day.date;
        const ActivityIcon = isOpen ? ChevronDown : ChevronRight;

        return (
          <div
            key={day.date}
            className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <button
              onClick={() => handleToggle(day.date)}
              className={`flex items-center justify-between w-full p-4 text-left font-semibold transition-colors duration-300 ${
                isOpen ? 'bg-gray-50 text-gray-900' : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="flex items-center">
                <ActivityIcon className="w-5 h-5 mr-2 text-gray-500 transition-transform duration-300" />
                {day.date}
              </span>
              <span className="px-2 py-1 text-xs font-normal text-gray-400 bg-gray-100 rounded-full">
                {day.activities.length} Events
              </span>
            </button>

            {/* Accordion Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border-t border-gray-100">
                    {day.activities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        // Using simplified grid since time might be empty
                        className="flex items-start gap-4 px-6 py-3 transition-colors bg-white border-b border-gray-50 hover:bg-primary/5/30 last:border-b-0"
                      >
                        {/* Dot Indicator */}
                        <div className="w-2 h-2 mt-2 bg-orange-400 rounded-full shrink-0" />

                        {/* Description */}
                        <span className="text-sm leading-relaxed text-gray-700">
                          {activity.description}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityLog;
