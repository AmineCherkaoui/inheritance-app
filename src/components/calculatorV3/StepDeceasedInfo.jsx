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
              'flex items-center flex-col gap-2 sm:flex-row px-2 sm:px-6 py-3 rounded-xl border cursor-pointer transition-all duration-200',
              deceasedGender === 'male'
                ? 'bg-primary-950 border-secondary-200 text-secondary-200 ring-2 ring-secondary-200 shadow-md'
                : 'bg-white/50 text-primary-950 border-primary-950/50 hover:bg-primary-950/10'
            )}
          >
            <div className={cn('p-1 rounded-lg')}>
              <svg xmlns="http://www.w3.org/2000/svg" className='size-8' viewBox="0 0 512 512">
                <path d="M0 0h512v512H0z" fill="none" />
                <circle cx="256" cy="56" r="56" fill="currentColor" />
                <path fill="currentColor" d="M304 128h-96a64.19 64.19 0 0 0-64 64v107.52c0 10.85 8.43 20.08 19.27 20.47A20 20 0 0 0 184 300v-99.73a8.18 8.18 0 0 1 7.47-8.25a8 8 0 0 1 8.53 8V489a23 23 0 0 0 23 23a23 23 0 0 0 23-23V346.34a10.24 10.24 0 0 1 9.33-10.34A10 10 0 0 1 266 346v143a23 23 0 0 0 23 23a23 23 0 0 0 23-23V200.27a8.18 8.18 0 0 1 7.47-8.25a8 8 0 0 1 8.53 8v99.52c0 10.85 8.43 20.08 19.27 20.47A20 20 0 0 0 368 300V192a64.19 64.19 0 0 0-64-64" />
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
              'flex items-center flex-col gap-2 sm:flex-row px-2 sm:px-6 py-3 rounded-xl border cursor-pointer transition-all duration-200',
              deceasedGender === 'female'
                ? 'bg-primary-950 border-secondary-200 text-secondary-200 ring-2 ring-secondary-200 shadow-md'
                : 'bg-white/50 text-primary-950 border-primary-950/50 hover:bg-primary-950/10'
            )}
          >
            <div className={cn('p-1 rounded-lg')}>
              <svg xmlns="http://www.w3.org/2000/svg" className='size-8' viewBox="0 0 512 512">
                <path d="M0 0h512v512H0z" fill="none" />
                <circle cx="255.75" cy="56" r="56" fill="currentColor" />
                <path fill="currentColor" d="m394.63 277.9l-10.33-34.41v-.11l-22.46-74.86h-.05l-2.51-8.45a44.87 44.87 0 0 0-43-32.08h-120a44.84 44.84 0 0 0-43 32.08l-2.51 8.45h-.06l-22.46 74.86v.11l-10.37 34.41c-3.12 10.39 2.3 21.66 12.57 25.14a20 20 0 0 0 25.6-13.18l25.58-85.25l2.17-7.23a8 8 0 0 1 15.53 2.62a7.8 7.8 0 0 1-.17 1.61L155.43 347.4a16 16 0 0 0 15.32 20.6h29v114.69c0 16.46 10.53 29.31 24 29.31s24-12.85 24-29.31V368h16v114.69c0 16.46 10.53 29.31 24 29.31s24-12.85 24-29.31V368h30a16 16 0 0 0 15.33-20.6l-43.74-145.81a7.5 7.5 0 0 1-.16-1.59a8 8 0 0 1 15.54-2.63l2.17 7.23l25.57 85.25A20 20 0 0 0 382.05 303c10.27-3.44 15.69-14.71 12.58-25.1" />
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
            className="w-full  pr-11 px-4 py-2 rounded-lg border border-primary-950/20 bg-white/50 text-primary-950 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary-950 transition-all text-right"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <User size={18} className='text-primary-950' />

          </div>
        </div>
      </div>
    </motion.div>
  );
}
