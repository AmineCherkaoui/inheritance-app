import React from 'react';
import { Calculator } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../utils';

export default function StepSidebar({
  currentStepIndex = 0,
  onStepClick,
  canNavigateToStep
}) {
  const steps = [
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

  return (
    <aside className="w-full max-w-md min-h-[96svh] bg-primary-950 text-white rounded-2xl lg:px-6  xl:px-16 py-6 flex flex-col justify-between  relative overflow-hidden ">
      {/* Subtle background arabesque pattern overlay */}
      <div
        className="absolute inset-0 bg-cover opacity-6 pointer-events-none"
        style={{ backgroundImage: "url('/images/motif.svg')" }}
      />



      {/* Top Header & Emblem */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Emblem */}
        <div className="flex flex-col items-center">
          <img src="/images/logo.svg" alt="Logo" className='w-36' />
        </div>

        <img src="/images/divider.png" alt="Title" className='w-[70%]' />


        {/* Sidebar Title */}
        <div className="flex items-center gap-2 text-secondary-300  pt-1">
          <Calculator size={16} />
          <span>محاكي تقسيم التركات الشرعي</span>
        </div>
      </div>

      {/* Middle: 4 Vertical Steps Stepper */}
      <div className="relative z-10 my-8 space-y-6">
        <div className="relative flex flex-col gap-8">
          {/* Vertical Dotted Connector Line */}
          <div className="absolute right-4.75 top-5 bottom-2 w-px border-r-2 border-dashed border-secondary-300/50 z-0" />

          {steps.map((step) => {
            const isActive = currentStepIndex === step.index;
            const isCompleted = currentStepIndex > step.index;
            const isNavigable = canNavigateToStep ? canNavigateToStep(step.index) : step.index <= currentStepIndex;

            return (
              <motion.div
                key={step.index}
                whileHover={isNavigable ? { x: -3 } : {}}
                onClick={() => {
                  if (isNavigable && onStepClick) {
                    onStepClick(step.index);
                  }
                }}
                className={cn(
                  'relative z-10 flex items-center gap-3.5 text-right transition-all select-none',
                  isNavigable ? 'cursor-pointer' : 'cursor-not-allowed'
                )}
                disabled={!isNavigable}
              >
                {/* Step Circle Indicator */}
                <div
                  className={cn(
                    'w-9.5 h-9.5 rounded-full flex items-center justify-center font-black text-sm shrink-0 transition-all duration-200',
                    isActive
                      ? 'bg-secondary-300 text-primary-950 border-2 border-secondary-200'
                      : isCompleted
                        ? 'bg-secondary-300 border-2 border-secondary-200 text-primary-950'
                        : 'bg-primary-950 border border-secondary-300 text-secondary-300'
                  )}
                >
                  {step.index + 1}
                </div>

                {/* Step Text Info */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-extrabold transition-colors',
                      isActive
                        ? 'text-secondary-50'
                        : isCompleted
                          ? 'text-white'
                          : 'text-secondary-50/70'
                    )}
                  >
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] sm:text-[11px] leading-snug mt-0.5',
                      isActive
                        ? 'text-white/80 font-medium'
                        : 'text-secondary-50/80'
                    )}
                  >
                    {step.subtitle}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 text-center">
        <span className="text-[11px] text-secondary-300 font-medium tracking-wide">
          نظام المواريث الشرعي المطور
        </span>
      </div>
    </aside>
  );
}
