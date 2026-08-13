import React from 'react';
import { motion } from 'motion/react';
import { User, FileText } from 'lucide-react';
import { cn } from '../../utils';
import StepHeader from './StepHeader';

export default function StepDeceasedInfo({
  deceasedName = '',
  setDeceasedName,
  deceasedGender = '',
  handleGenderChange
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.22 }}
      className="w-full flex flex-col gap-6"
    >
      {/* Header Section */}
      <StepHeader
        title="بيانات حالة المتوفى"
        icon={FileText}
        subtitle="الرجاء إدخال الاسم وتحديد جنس المتوفى للبدء"
      />

      {/* Gender Selection */}
      <div className="space-y-2">
        <span className="text-sm font-bold text-muted-foreground block text-right">
          الجنس
        </span>
        <div className="grid grid-cols-2 gap-4">
          {/* Male Button */}
          <motion.div
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGenderChange('male')}
            className={cn(
              'flex items-center px-6 py-3 rounded-xl border cursor-pointer transition-all duration-200',
              deceasedGender === 'male'
                ? 'bg-primary-950 border-secondary-200 text-secondary-200 ring-2 ring-secondary-200 shadow-md'
                : 'bg-white/20 text-primary-950 border-primary-950 hover:bg-primary-950/10'
            )}
          >
            <div className={cn('p-1 rounded-lg')}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>

            <div
              className={cn(
                'h-full w-px mx-4 transition-colors hidden sm:block',
                deceasedGender === 'male' ? 'bg-secondary-200' : 'bg-primary-950'
              )}
            />

            <div className={cn('flex flex-col text-center flex-1')}>
              <span className="text-xs sm:text-sm font-extrabold">جنس المتوفى</span>
              <span className="text-xs">
                ذكر
              </span>
            </div>
          </motion.div>

          {/* Female Button */}
          <motion.div
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGenderChange('female')}
            className={cn(
              'flex items-center px-6 py-3 rounded-xl border cursor-pointer transition-all duration-200',
              deceasedGender === 'female'
                ? 'bg-primary-950 border-secondary-200 text-secondary-200 ring-2 ring-secondary-200 shadow-md'
                : 'bg-white/20 text-primary-950 border-primary-950 hover:bg-primary-950/10'
            )}
          >
            <div className={cn('p-1 rounded-lg')}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                <path d="M12 11v3" />
              </svg>
            </div>

            <div
              className={cn(
                'h-full w-px mx-4 transition-colors hidden sm:block',
                deceasedGender === 'female' ? 'bg-secondary-200' : 'bg-primary-950'
              )}
            />

            <div className={cn('flex flex-col text-center flex-1')}>
              <span className="text-xs sm:text-sm font-extrabold">جنس المتوفى</span>
              <span className="text-xs">
                أنثى
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-1.5 pt-2">
        <label className="text-sm font-bold text-muted-foreground block text-right">
          {deceasedGender === 'female'
            ? 'اسم المتوفاة (اختياري)'
            : deceasedGender === 'male'
              ? 'اسم المتوفى (اختياري)'
              : 'اسم المتوفى / المتوفاة (اختياري)'}
        </label>
        <div className="relative">
          <input
            type="text"
            value={deceasedName}
            onChange={(e) => setDeceasedName(e.target.value)}
            placeholder="أدخل الاسم هنا"
            className="w-full  pr-11 px-4 py-2 rounded-lg border border-primary-950 bg-white/20 text-primary-950 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary-950 transition-all text-right"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <User size={18} className='text-primary-950' />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
