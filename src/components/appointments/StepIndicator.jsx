import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';

const StepIndicatorSimple = ({ steps, currentStep }) => {
  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <div className="w-full mb-8 md:mb-12 px-4 md:px-8">
      <div className="relative max-w-4xl mx-auto">
        <div className="relative w-full h-8 md:h-10">
          <div className="absolute top-3.5 md:top-4 left-0 right-0 h-0.5 bg-gray-200" />
          <motion.div
            initial={{ width: '0%' }}
            animate={{
              width:
                currentStep === 1 ? '0%' : `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute  top-3.5 md:top-4 left-0 right-0 h-0.5 bg-primary"
          />

          {/* Steps - Absolutely Positioned */}
          {steps.map((step, index) => {
            const isComplete = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isHovered = hoveredStep === step.id;

            // Calculate position percentage for each step
            const leftPosition = steps.length === 1 ? 50 : (index / (steps.length - 1)) * 100;

            return (
              <div
                key={step.id}
                className="absolute top-0"
                style={{ left: `${leftPosition}%` }}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                onTouchStart={() => setHoveredStep(step.id)}
                onTouchEnd={() => setTimeout(() => setHoveredStep(null), 2000)}
              >
                <div className="relative -translate-x-1/2">
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: step.id * 0.08,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    className={`
                      relative w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center
                      transition-all duration-300 cursor-pointer
                      ${
                        isComplete
                          ? 'bg-blue-600 shadow-md'
                          : isCurrent
                          ? 'bg-primary shadow-lg shadow-primary/50/40'
                          : 'bg-white border-2 border-gray-300'
                      }
                    `}
                  >
                    {/* Pulse effect for current step */}
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                    )}

                    {/* Icon/Circle */}
                    {isComplete ? (
                      <Check
                        className="w-4 h-4 md:w-[18px] md:h-[18px] text-white"
                        strokeWidth={2.5}
                      />
                    ) : isCurrent ? (
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white" />
                    ) : (
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-gray-300" />
                    )}
                  </motion.div>

                  {/* Tooltip for Mobile/Touch */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 md:hidden bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-lg"
                    >
                      {step.name}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </motion.div>
                  )}

                  {/* Step Name - Hidden on Mobile, Visible on MD+ */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: step.id * 0.08 + 0.2 }}
                    className={`
                      hidden md:block mt-2 md:mt-3 text-xs md:text-sm font-medium text-center
                      whitespace-nowrap transition-colors duration-300 absolute left-1/2 -translate-x-1/2
                      ${
                        isCurrent
                          ? 'text-primary font-semibold'
                          : isComplete
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }
                    `}
                  >
                    {step.name}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicatorSimple;
