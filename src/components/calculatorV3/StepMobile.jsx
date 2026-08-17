import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils';

export const STEPS_CONFIG = [
  {
    index: 0,
    title: 'بيانات حالة المتوفى',
    subtitle: 'إدخال الاسم و جنس المتوفى'
  },
  {
    index: 1,
    title: 'التركة',
    subtitle: 'إدخال أموال وحقوق المتوفى'
  },
  {
    index: 2,
    title: 'الورثة',
    subtitle: 'تحديد ورثة المتوفى'
  },
  {
    index: 3,
    title: 'النتائج',
    subtitle: 'عرض تفاصيل القسمة الشرعية'
  }
];

function StepMedallion({ number, className }) {
  return (
    <div className={cn('relative flex items-center justify-center size-4 select-none  ', className)}>
      <img src="/images/step-motif.svg" alt="step" className="w-full" />

      <span className="text-primary-950 font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {number}
      </span>
    </div>
  );
}

export default function StepMobile({
  currentStepIndex = 0,
  onStepClick,
  canNavigateToStep,
  className
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef(null);

  const steps = STEPS_CONFIG;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleStepSelect = (index) => {
    const isNavigable = canNavigateToStep ? canNavigateToStep(index) : index <= currentStepIndex;
    if (isNavigable && onStepClick) {
      onStepClick(index);
      setIsDropdownOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full z-30 select-none', className)}>
      {/* Mobile Card Banner */}
      <div className="w-full bg-linear-to-r from-primary-950 to-primary-800    text-white rounded-2xl p-3 sm:p-4 flex items-center justify-between relative overflow-hidden shadow-lg border border-secondary-300/20">

        <div
          className="absolute inset-0 bg-cover opacity-6 pointer-events-none"
          style={{ backgroundImage: "url('/images/motif.svg')" }}
        />

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <StepMedallion
                number={currentStep.index + 1}
                className="size-12"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center: Current Step Title & Subtitle */}
        <div className="relative z-10 flex-1  text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.index}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center"
            >
              <h2 className="text-secondary-300 font-black text-base sm:text-lg leading-tight">
                {currentStep.title}
              </h2>
              <p className="text-secondary-50/90 text-[11px] sm:text-xs font-medium leading-snug mt-0.5">
                {currentStep.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Left Side: "الخطوات ▾" Dropdown Trigger Button */}
        <div className="relative z-10">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-label="قائمة الخطوات"
            className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md  text-white text-[10px] px-2 py-1 rounded-full transition-all cursor-pointer shadow-sm"
          >

            <span>الخطوات</span>
            <ChevronDown
              size={12}
              className={cn('transition-transform duration-200', isDropdownOpen ? 'rotate-180' : 'rotate-0')}
            />
          </button>
        </div>

      </div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute top-full right-0 left-0 mt-2 bg-primary-950 rounded-2xl border border-secondary-300/30 p-2.5 shadow-2xl z-50 overflow-hidden transform-gpu"
          >
            <div className="flex flex-col gap-1.5">
              {steps.map((step) => {
                const isActive = currentStepIndex === step.index;
                const isCompleted = currentStepIndex > step.index;
                const isNavigable = canNavigateToStep ? canNavigateToStep(step.index) : step.index <= currentStepIndex;

                return (
                  <button
                    key={step.index}
                    type="button"
                    onClick={() => handleStepSelect(step.index)}
                    disabled={!isNavigable}
                    className={cn(
                      'w-full flex items-center justify-between p-2 rounded-xl text-right transition-colors duration-150 select-none',
                      isActive
                        ? 'bg-primary-500/15  text-secondary-50'
                        : isNavigable
                          ? 'hover:bg-white/10 active:bg-white/15 text-white/90 cursor-pointer'
                          : 'opacity-40 cursor-not-allowed text-white/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Step Circle */}
                      <div
                        className={cn(
                          'size-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 transition-colors duration-150',
                          isActive
                            ? 'bg-secondary-300 text-primary-950 border border-secondary-200 shadow-sm'
                            : isCompleted
                              ? 'bg-secondary-300/90 text-primary-950'
                              : 'bg-primary-900 border border-secondary-300/50 text-secondary-300'
                        )}
                      >
                        {isCompleted && !isActive ? (
                          <Check size={13} className="stroke-3" />
                        ) : (
                          step.index + 1
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="flex flex-col text-right">
                        <span
                          className={cn(
                            'text-xs sm:text-sm font-bold leading-tight',
                            isActive ? 'text-secondary-300' : 'text-white'
                          )}
                        >
                          {step.title}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-secondary-50/70 leading-snug mt-0.5">
                          {step.subtitle}
                        </span>
                      </div>
                    </div>

                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
