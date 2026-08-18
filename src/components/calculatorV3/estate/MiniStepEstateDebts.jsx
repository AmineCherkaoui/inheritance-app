import React from 'react';
import { motion } from 'motion/react';
import { Wallet, ShieldAlert, Coins, BanknoteX } from 'lucide-react';
import { cn } from '../../../utils';
import StepHeader from '../StepHeader';

export default function MiniStepEstateDebts({
  totalEstate,
  setTotalEstate,
  debts,
  setDebts,
  errors = {}
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.22 }}
      className="w-full flex flex-col gap-6"
    >
      {/* Header */}
      <StepHeader
        title="التركة والديون والالتزامات"
        icon={Coins}
        subtitle="تُصفى الديون والالتزامات المالية من التركة قبل توزيع الميراث"
      />

      {/* Inputs Section */}
      <div className="space-y-4">
        {/* Total Estate */}
        <div className="space-y-1.5 pt-2">
          <label className="text-sm font-bold text-muted-foreground block text-right">
            قيمة التركة الإجمالية
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              value={totalEstate !== undefined ? totalEstate : ''}
              onChange={(e) => {
                const val = e.target.value;
                setTotalEstate(val === '' ? undefined : Math.max(0, parseFloat(val) || 0));
              }}
              placeholder="أدخل إجمالي مبلغ التركة"
              className={cn(
                'w-full pr-11 px-4 py-2 rounded-lg border border-primary-950/20 bg-white/50 text-primary-950 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary-950 transition-all text-right',
                errors.totalEstate && 'border-red-500 focus:ring-red-500'
              )}
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Wallet size={18} className="text-primary-950" />
            </div>
          </div>
          {errors.totalEstate && (
            <p className="text-xs font-bold text-red-600 text-right mt-1">{errors.totalEstate}</p>
          )}
        </div>

        {/* Debts */}
        <div className="space-y-1.5 pt-2">
          <label className="text-sm font-bold text-muted-foreground block text-right">
            الديون والالتزامات المالية (اختياري)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              value={debts !== undefined ? debts : ''}
              onChange={(e) => {
                const val = e.target.value;
                setDebts(val === '' ? undefined : Math.max(0, parseFloat(val) || 0));
              }}
              placeholder="أدخل إجمالي الديون المستحقة إن وجدت"
              className="w-full pr-11 px-4 py-2 rounded-lg border border-primary-950/20 bg-white/50 text-primary-950 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary-950 transition-all text-right"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <BanknoteX size={18} className="text-primary-950" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
