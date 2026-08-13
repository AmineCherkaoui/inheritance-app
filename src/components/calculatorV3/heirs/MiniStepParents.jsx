import React from 'react';
import { Card } from '@heroui/react';
import { motion } from 'motion/react';
import { UserCheck, Users } from 'lucide-react';

export default function MiniStepParents({
  heirs = {},
  updateHeir
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-3">
        <div className="h-px bg-default-200 flex-1 max-w-28" />
        <div className="flex items-center gap-2 text-foreground font-black text-base sm:text-lg">
          <Users size={18} className="text-amber-700" />
          <span>الأبوان (الأب والأم)</span>
        </div>
        <div className="h-px bg-default-200 flex-1 max-w-28" />
      </div>
      <p className="text-center text-xs text-muted-foreground -mt-3">
        اختر والدي المتوفى على قيد الحياة
      </p>

      {/* Card */}
      <Card className="rounded-3xl border border-default-200 p-6 sm:p-8 space-y-5 bg-white/95 shadow-xl shadow-amber-900/2">
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => updateHeir('FATHER', heirs['FATHER'] > 0 ? 0 : 1)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
              heirs['FATHER'] > 0
                ? 'border-amber-600 bg-amber-50/30 shadow-xs'
                : 'border-default-200 hover:border-amber-300'
            }`}
          >
            <UserCheck size={28} className={`mb-2 ${heirs['FATHER'] > 0 ? 'text-amber-600' : 'text-muted-foreground'}`} />
            <span className={`text-xs sm:text-sm font-extrabold ${heirs['FATHER'] > 0 ? 'text-amber-800' : 'text-muted-foreground'}`}>
              الأب {heirs['FATHER'] > 0 ? '✔️' : '(غير موجود)'}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => updateHeir('MOTHER', heirs['MOTHER'] > 0 ? 0 : 1)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
              heirs['MOTHER'] > 0
                ? 'border-amber-600 bg-amber-50/30 shadow-xs'
                : 'border-default-200 hover:border-amber-300'
            }`}
          >
            <UserCheck size={28} className={`mb-2 ${heirs['MOTHER'] > 0 ? 'text-amber-600' : 'text-muted-foreground'}`} />
            <span className={`text-xs sm:text-sm font-extrabold ${heirs['MOTHER'] > 0 ? 'text-amber-800' : 'text-muted-foreground'}`}>
              الأم {heirs['MOTHER'] > 0 ? '✔️' : '(غير موجود)'}
            </span>
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
}
