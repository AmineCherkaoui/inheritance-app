import React from 'react';
import { Card, TextField, Input, Label } from '@heroui/react';
import { motion } from 'motion/react';
import { User, Wallet, ShieldAlert } from 'lucide-react';

export default function EstateForm({
  deceasedName,
  setDeceasedName,
  deceasedGender,
  handleGenderChange,
  totalEstate,
  setTotalEstate,
  debts,
  setDebts
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="rounded-3xl shadow-none border border-default-200">
        <Card.Header>
          <Card.Title className="text-lg font-bold tracking-tight">بيانات التركة والوارثين</Card.Title>
          <Card.Description>
            أدخل الاسم، إجمالي التركة، والديون لتصفيتها قبل عملية التوزيع الشرعي للتركة.
          </Card.Description>
        </Card.Header>

        <Card.Content className="flex flex-col gap-5">
          {/* 1. Gender Toggle (First) */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold">جنس المتوفى</Label>
            <div className="flex p-1 bg-surface-secondary rounded-2xl w-fit gap-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${deceasedGender === 'male' ? 'bg-white text-amber-700 shadow-sm' : 'text-muted hover:text-foreground'}`}
                onClick={() => handleGenderChange('male')}
              >
                ذكر (المتوفى)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${deceasedGender === 'female' ? 'bg-white text-amber-700 shadow-sm' : 'text-muted hover:text-foreground'}`}
                onClick={() => handleGenderChange('female')}
              >
                أنثى (المتوفاة)
              </motion.button>
            </div>
          </div>

          {/* 2. Name (Second) */}
          <div className="grid grid-cols-1 gap-4">
            <TextField name="deceased-name" value={deceasedName} onChange={setDeceasedName}>
              <Label className="flex items-center gap-1.5 text-xs font-semibold">
                <User size={14} className="text-amber-600" /> اسم المتوفى (اختياري)
              </Label>
              <Input placeholder="مثال: أحمد" variant="secondary" />
            </TextField>
          </div>

          {/* 3. Total Estate (Third) & 4. Debt (Fourth) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              name="total-estate"
              type="number"
              value={totalEstate.toString()}
              onChange={(val) => setTotalEstate(Math.max(0, parseFloat(val) || 0))}
            >
              <Label className="flex items-center gap-1.5 text-xs font-semibold">
                <Wallet size={14} className="text-amber-600" /> قيمة التركة الإجمالية
              </Label>
              <Input placeholder="100000" variant="secondary" className="font-semibold" />
            </TextField>

            <TextField
              name="debts"
              type="number"
              value={debts.toString()}
              onChange={(val) => setDebts(Math.max(0, parseFloat(val) || 0))}
            >
              <Label className="flex items-center gap-1.5 text-xs font-semibold">
                <ShieldAlert size={14} className="text-amber-600" /> الديون والالتزامات
              </Label>
              <Input placeholder="0" variant="secondary" />
            </TextField>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}
