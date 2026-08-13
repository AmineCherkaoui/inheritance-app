import React from 'react';
import { Card, Button } from '@heroui/react';
import { motion } from 'motion/react';
import { Plus, Minus, Check, Users } from 'lucide-react';
import { HEIR_CATEGORIES, isHeirBlocked } from '../heirConstants';

export default function MiniStepCategoryHeirs({
  categoryKey,
  heirs = {},
  updateHeir
}) {
  const category = HEIR_CATEGORIES[categoryKey];
  if (!category) return null;

  const availableHeirs = category.list.filter(h => !isHeirBlocked(h.key, heirs));

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
          <span>{category.title}</span>
        </div>
        <div className="h-px bg-default-200 flex-1 max-w-28" />
      </div>
      <p className="text-center text-xs text-muted-foreground -mt-3">
        أضف أي أقارب مستحقين للإرث في هذه الفئة (إن وجدوا)
      </p>

      {/* Card */}
      <Card className="rounded-3xl border border-default-200 p-6 sm:p-8 space-y-5 bg-white/95 shadow-xl shadow-amber-900/2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {availableHeirs.map((heir) => {
            const currentVal = heirs[heir.key] || 0;
            const isActive = currentVal > 0;

            return (
              <div
                key={heir.key}
                className={`flex items-center justify-between rounded-2xl p-3.5 border-2 transition-all duration-200 ${
                  isActive
                    ? 'border-amber-600 bg-amber-50/25 shadow-xs ring-1 ring-amber-600/10'
                    : 'border-default-200 hover:border-amber-200 bg-white'
                }`}
              >
                <span className={`text-xs font-extrabold ${isActive ? 'text-amber-950' : 'text-foreground'}`}>
                  {heir.label}
                </span>

                <div>
                  {!isActive ? (
                    <Button
                      size="sm"
                      onPress={() => updateHeir(heir.key, 1)}
                      className="h-8 px-3 text-[11px] font-black rounded-xl transition-all bg-transparent border border-default-300 text-foreground hover:bg-default-100"
                    >
                      <span className="flex items-center gap-1">
                        <Plus size={12} /> إضافة
                      </span>
                    </Button>
                  ) : heir.type === 'select' ? (
                    <Button
                      size="sm"
                      onPress={() => updateHeir(heir.key, 0)}
                      className="h-8 px-3 text-[11px] font-black rounded-xl transition-all bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                    >
                      <span className="flex items-center gap-1">
                        <Check size={12} className="stroke-3" /> مضاف
                      </span>
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 p-0.5 rounded-lg border border-amber-300 bg-amber-50 shadow-3xs transition-all">
                      <Button
                        size="sm"
                        isIconOnly
                        onPress={() => updateHeir(heir.key, Math.max(0, currentVal - 1))}
                        className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-amber-100"
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="w-6 text-center text-xs font-black text-amber-950 font-mono">
                        {currentVal}
                      </span>
                      <Button
                        size="sm"
                        isIconOnly
                        onPress={() => updateHeir(heir.key, currentVal + 1)}
                        className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-amber-100"
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
