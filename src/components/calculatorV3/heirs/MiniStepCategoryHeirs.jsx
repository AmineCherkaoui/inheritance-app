import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@heroui/react';
import { Plus, Minus, Users, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils';
import StepHeader from '../StepHeader';
import { HEIR_CATEGORIES, isHeirBlocked } from '../heirConstants';

export default function MiniStepCategoryHeirs({
  categoryKey,
  heirs = {},
  updateHeir
}) {
  const category = HEIR_CATEGORIES[categoryKey];
  if (!category) return null;

  const availableHeirs = category.list.filter((h) => !isHeirBlocked(h.key, heirs));
  const blockedHeirsCount = category.list.length - availableHeirs.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.22 }}
      className="w-full flex flex-col gap-6"
    >
      {/* Dynamic Category Header */}
      <StepHeader
        title={category.title}
        icon={Users}
        subtitle={category.subtitle || 'أدخل عدد الأقارب المستحقين إن وجدوا، أو اضغط "التالي" للمتابعة إن لم يوجدوا'}
      />

      {/* Main Container */}
      <div className="flex flex-col gap-4">
        {availableHeirs.length === 0 ? (
          /* All heirs in category are blocked */
          <div className="p-4 bg-secondary-100/80 border border-secondary-200 text-primary-950 rounded-xl text-xs sm:text-sm flex items-start gap-3 text-right">
            <AlertCircle size={18} className="text-secondary-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-extrabold text-primary-950">
                جميع الورثة في فئة «{category.title}» محجوبون شرعاً
              </span>
              <span className="text-muted-foreground text-xs leading-relaxed">
                نظراً لوجود ورثة أقرب في الدرجة (مثل الابن أو الأب)، تسقط حقوق هذه الفئة بحكم قواعد الحجب الشرعية. يمكنك المتابعة مباشرة عبر زر «التالي».
              </span>
            </div>
          </div>
        ) : (
          /* Available Heirs List */
          <>
            <div className="flex items-center justify-end">
              {blockedHeirsCount > 0 && (
                <span className="text-[11px] font-bold text-primary-950 bg-white border border-primary-950/10 px-2.5 py-0.5 rounded-full">
                  تم حجب {blockedHeirsCount} من هذه الفئة تلقائياً
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableHeirs.map((heir) => {
                const count = heirs[heir.key] || 0;
                const isSelected = count > 0;
                const isSingle = heir.type === 'select';

                return (
                  <div
                    key={heir.key}
                    onClick={() => {
                      if (count === 0) {
                        updateHeir(heir.key, 1);
                      }
                    }}
                    className={cn(
                      'flex items-center flex-col sm:flex-row gap-4 justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200',
                      isSelected
                        ? 'bg-primary-950 border-secondary-200 text-secondary-200 ring-2 ring-secondary-200 shadow-md'
                        : 'bg-white/50 border-primary-950/20 text-primary-950 cursor-pointer hover:bg-primary-950/5'
                    )}
                  >
                    <div className="flex flex-col text-center sm:text-right">
                      <span
                        className={cn(
                          'text-xs sm:text-sm font-extrabold',
                          isSelected ? 'text-secondary-200' : 'text-primary-950'
                        )}
                      >
                        {heir.label}
                      </span>
                      {heir.note && (
                        <span
                          className={cn(
                            'text-[11px] sm:text-xs mt-0.5',
                            isSelected ? 'text-secondary-100/80' : 'text-muted-foreground'
                          )}
                        >
                          {heir.note}
                        </span>
                      )}
                    </div>

                    {isSelected ? (
                      <div
                        className="flex w-fit items-center gap-1.5 p-1 rounded-lg border-2 border-secondary-200/50 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => updateHeir(heir.key, Math.max(0, count - 1))}
                          aria-label={`إنقاص ${heir.label}`}
                          className="size-7 min-w-0 rounded-md font-bold cursor-pointer transition-colors active:scale-95 hover:bg-primary-800 text-secondary-200 bg-transparent flex items-center justify-center"
                        >
                          <Minus size={12} className="stroke-4" />
                        </button>
                        <span className="w-7 text-center text-xs sm:text-sm font-black font-mono text-secondary-100">
                          {count}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isSingle) {
                              updateHeir(heir.key, count + 1);
                            }
                          }}
                          disabled={isSingle}
                          aria-label={`زيادة ${heir.label}`}
                          className={cn(
                            'size-7 min-w-0 rounded-md font-bold transition-colors active:scale-95 text-secondary-200 bg-transparent flex items-center justify-center',
                            isSingle
                              ? 'opacity-30 cursor-not-allowed'
                              : 'cursor-pointer hover:bg-primary-800'
                          )}
                        >
                          <Plus size={12} className="stroke-4" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onPress={() => updateHeir(heir.key, 1)}
                        className="px-4 rounded-lg border-dashed border-primary-950 text-primary-950 font-bold hover:bg-primary-950/10 border bg-transparent flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Plus size={14} className="stroke-3" />
                        <span className='text-xs'>إضافة</span>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
