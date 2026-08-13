import React from 'react';
import { Card, Button, Label } from '@heroui/react';
import { motion } from 'motion/react';
import { UserCheck, UserX, Plus, Minus, Heart } from 'lucide-react';
import { cn } from '../../../utils';

export default function MiniStepSpouse({
  heirs = {},
  updateHeir,
  deceasedGender = 'male'
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
          <Heart size={18} className="text-amber-700" />
          <span>{deceasedGender === 'female' ? 'الزوج' : 'الزوجة أو الزوجات'}</span>
        </div>
        <div className="h-px bg-default-200 flex-1 max-w-28" />
      </div>
      <p className="text-center text-xs text-muted-foreground -mt-3">
        {deceasedGender === 'female' ? 'حدد ما إذا كان الزوج على قيد الحياة' : 'حدد عدد الزوجات على قيد الحياة (حتى 4)'}
      </p>

      {/* Card */}
      <Card className="rounded-3xl border border-default-200 p-6 sm:p-8 space-y-5 bg-white/95 shadow-xl shadow-amber-900/2">
        {deceasedGender === 'female' ? (
          <div className="space-y-4">
            <Label className="text-xs font-bold text-muted-foreground text-center block">
              هل يوجد زوج على قيد الحياة؟
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateHeir('HUSBAND', 1)}
                className={cn(
                  'flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200',
                  heirs['HUSBAND'] === 1
                    ? 'border-amber-600 bg-amber-50/30 shadow-xs ring-1 ring-amber-600/30'
                    : 'border-default-200 hover:border-amber-300'
                )}
              >
                <UserCheck size={32} className={cn('mb-1.5', heirs['HUSBAND'] === 1 ? 'text-amber-600' : 'text-muted-foreground')} />
                <span className={cn('text-sm font-extrabold', heirs['HUSBAND'] === 1 ? 'text-amber-800' : 'text-muted-foreground')}>
                  زوج موجود
                </span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateHeir('HUSBAND', -1)}
                className={cn(
                  'flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200',
                  heirs['HUSBAND'] === -1
                    ? 'border-red-500 bg-red-50/20 shadow-xs ring-1 ring-red-500/30'
                    : 'border-default-200 hover:border-amber-300'
                )}
              >
                <UserX size={32} className={cn('mb-1.5', heirs['HUSBAND'] === -1 ? 'text-red-500' : 'text-muted-foreground')} />
                <span className={cn('text-sm font-extrabold', heirs['HUSBAND'] === -1 ? 'text-red-800' : 'text-muted-foreground')}>
                  لا يوجد زوج
                </span>
              </motion.div>
            </div>
            <div className="text-center font-bold text-xs mt-3">
              {heirs['HUSBAND'] === 1 && (
                <span className="text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  الخيار المحدد: يوجد زوج على قيد الحياة
                </span>
              )}
              {heirs['HUSBAND'] === -1 && (
                <span className="text-red-800 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  الخيار المحدد: لا يوجد زوج
                </span>
              )}
              {heirs['HUSBAND'] === undefined && (
                <span className="text-muted-foreground bg-default-100 px-3 py-1 rounded-full border border-default-200">
                  الرجاء اختيار أحد الخيارات للمتابعة
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Label className="text-xs font-bold text-muted-foreground text-center block">
              هل توجد زوجة (أو زوجات) على قيد الحياة؟
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={heirs['WIFE'] > 0 ? {} : { scale: 1.02 }}
                whileTap={heirs['WIFE'] > 0 ? {} : { scale: 0.98 }}
                onClick={() => {
                  if (!(heirs['WIFE'] > 0)) {
                    updateHeir('WIFE', 1);
                  }
                }}
                className={cn(
                  'flex flex-col items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200',
                  heirs['WIFE'] > 0
                    ? 'border-amber-600 bg-amber-50/30 shadow-xs ring-1 ring-amber-600/30'
                    : 'border-default-200 hover:border-amber-300'
                )}
              >
                <UserCheck size={32} className={cn('mb-1.5', heirs['WIFE'] > 0 ? 'text-amber-600' : 'text-muted-foreground')} />
                <span className={cn('text-sm font-extrabold', heirs['WIFE'] > 0 ? 'text-amber-800 mb-2' : 'text-muted-foreground')}>
                  زوجة موجودة
                </span>
                {heirs['WIFE'] > 0 && (
                  <div
                    className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-default-300/60 shadow-3xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      isIconOnly
                      onPress={() => updateHeir('WIFE', Math.max(1, heirs['WIFE'] - 1))}
                      className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                    >
                      <Minus size={12} className="stroke-3" />
                    </Button>
                    <span className="w-6 text-center text-xs font-black">{heirs['WIFE']}</span>
                    <Button
                      size="sm"
                      isIconOnly
                      onPress={() => updateHeir('WIFE', Math.min(4, heirs['WIFE'] + 1))}
                      className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                    >
                      <Plus size={12} className="stroke-3" />
                    </Button>
                  </div>
                )}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateHeir('WIFE', -1)}
                className={cn(
                  'flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200',
                  heirs['WIFE'] === -1
                    ? 'border-red-500 bg-red-50/20 shadow-xs ring-1 ring-red-500/30'
                    : 'border-default-200 hover:border-amber-300'
                )}
              >
                <UserX size={32} className={cn('mb-1.5', heirs['WIFE'] === -1 ? 'text-red-500' : 'text-muted-foreground')} />
                <span className={cn('text-sm font-extrabold', heirs['WIFE'] === -1 ? 'text-red-800' : 'text-muted-foreground')}>
                  لا توجد زوجة
                </span>
              </motion.div>
            </div>

            <div className="text-center font-bold text-xs mt-3">
              {heirs['WIFE'] > 0 && (
                <span className="text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  الخيار المحدد: توجد زوجة (العدد: {heirs['WIFE']})
                </span>
              )}
              {heirs['WIFE'] === -1 && (
                <span className="text-red-800 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  الخيار المحدد: لا توجد زوجة
                </span>
              )}
              {heirs['WIFE'] === undefined && (
                <span className="text-muted-foreground bg-default-100 px-3 py-1 rounded-full border border-default-200">
                  الرجاء اختيار أحد الخيارات للمتابعة
                </span>
              )}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
