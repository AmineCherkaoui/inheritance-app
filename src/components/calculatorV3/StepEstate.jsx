import React from 'react';
import { Card, TextField, Input, Label } from '@heroui/react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, ShieldAlert, Coins, Landmark } from 'lucide-react';
import WillsForm from '../WillsForm';
import MandatoryBequestForm from '../MandatoryBequestForm';

export default function StepEstate({
  totalEstate,
  setTotalEstate,
  debts,
  setDebts,
  wills = [],
  addWill,
  updateWill,
  removeWill,
  heirsApprovedExcess,
  setHeirsApprovedExcess,
  checkWillsExceedThird,
  hasMandatoryBequest,
  handleSetHasMandatoryBequest,
  mandatoryBequests = [],
  setMandatoryBequests,
  errors = {}
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="w-full space-y-6"
    >
      {/* Header Section */}
      <div className="flex items-center justify-center gap-3">
        <div className="h-px bg-default-200 flex-1 max-w-28" />
        <div className="flex items-center gap-2 text-foreground font-black text-base sm:text-lg">
          <Coins size={18} className="text-amber-700" />
          <span>التركة والديون والوصايا</span>
        </div>
        <div className="h-px bg-default-200 flex-1 max-w-28" />
      </div>
      <p className="text-center text-xs text-muted-foreground -mt-3">
        أدخل أموال وحقوق المتوفى وتصفية الديون والوصايا الشرعية قبل القسمة
      </p>

      {/* Estate and Debts Inputs */}
      <div className="space-y-4 bg-white/90 p-5 sm:p-6 rounded-2xl border border-default-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Estate */}
          <div className="flex flex-col gap-1 w-full text-right">
            <TextField
              name="total-estate"
              type="number"
              value={totalEstate?.toString() ?? ''}
              onChange={(val) => setTotalEstate(val === '' ? undefined : Math.max(0, parseFloat(val) || 0))}
              isInvalid={!!errors.totalEstate}
            >
              <Label className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1.5 justify-start">
                <Wallet size={15} className="text-amber-600" /> قيمة التركة الإجمالية (د.م.)
              </Label>
              <Input
                variant="secondary"
                className="font-black text-amber-950 h-11 text-right"
                placeholder="أدخل إجمالي مبلغ التركة"
              />
            </TextField>
            {errors.totalEstate && (
              <div className="text-xs font-bold text-danger mt-1 text-right">{errors.totalEstate}</div>
            )}
          </div>

          {/* Debts */}
          <div className="flex flex-col gap-1 w-full text-right">
            <TextField
              name="debts"
              type="number"
              value={debts?.toString() ?? ''}
              onChange={(val) => setDebts(val === '' ? undefined : Math.max(0, parseFloat(val) || 0))}
            >
              <Label className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1.5 justify-start">
                <ShieldAlert size={15} className="text-amber-600" /> الديون والالتزامات المالية (اختياري)
              </Label>
              <Input
                variant="secondary"
                className="font-semibold h-11 text-right"
                placeholder="أدخل إجمالي الديون المستحقة"
              />
            </TextField>
          </div>
        </div>
      </div>

      {/* Wills & Mandatory Bequests Forms */}
      <div className="space-y-5">
        <div className="shadow-xs rounded-2xl overflow-hidden border border-default-200 bg-white">
          <WillsForm
            wills={wills}
            addWill={addWill}
            updateWill={updateWill}
            removeWill={removeWill}
            heirsApprovedExcess={heirsApprovedExcess}
            setHeirsApprovedExcess={setHeirsApprovedExcess}
            checkWillsExceedThird={checkWillsExceedThird}
            errors={errors}
          />
        </div>

        <div className="shadow-xs rounded-2xl overflow-hidden border border-default-200 bg-white">
          <MandatoryBequestForm
            hasMandatoryBequest={hasMandatoryBequest}
            setHasMandatoryBequest={handleSetHasMandatoryBequest}
            mandatoryBequests={mandatoryBequests}
            setMandatoryBequests={setMandatoryBequests}
          />
        </div>
      </div>
    </motion.div>
  );
}
