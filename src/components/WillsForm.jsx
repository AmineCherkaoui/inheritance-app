import React from 'react';
import { Card, Button, Input, Select, ListBox, Checkbox } from '@heroui/react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollText, Plus, Trash2, AlertTriangle } from 'lucide-react';

export default function WillsForm({
  wills,
  addWill,
  updateWill,
  removeWill,
  heirsApprovedExcess,
  setHeirsApprovedExcess,
  checkWillsExceedThird,
  errors = {}
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
    >
      <Card className="rounded-3xl shadow-none border border-default-200">
        <Card.Header>
          <Card.Title className="text-lg font-bold flex items-center gap-2 tracking-tight">
            <ScrollText size={20} className="text-amber-600" /> الوصايا (اختياري)
          </Card.Title>
          <Card.Description>
            تُنفذ الوصية في حدود ثلث التركة بعد خصم الديون. ما زاد عن الثلث يتطلب موافقة الورثة.
          </Card.Description>
        </Card.Header>

        <Card.Content className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {wills.map((will) => (
                <motion.div
                  key={will.id}
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <Card variant="secondary" className="flex flex-col md:flex-row gap-3 items-stretch md:items-center rounded-2xl p-3 shadow-none border border-default-100">
                    <Input
                      aria-label="اسم الوصية"
                      type="text"
                      value={will.name}
                      placeholder="اسم الوصية (مثال: لبناء مسجد)"
                      onChange={e => updateWill(will.id, 'name', e.target.value)}
                      variant="secondary"
                      className="flex-2"
                    />

                    <div className="flex-1 flex flex-col gap-1">
                      <Select
                        className="w-full"
                        aria-label="اختر الكسر"
                        placeholder="اختر الكسر"
                        value={will.value}
                        onChange={(val) => {
                          if (val) updateWill(will.id, 'value', val);
                        }}
                        isInvalid={!!errors[will.id]}
                      >
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="1/2" textValue="1/2 (النصف)">1/2 (النصف)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/3" textValue="1/3 (الثلث)">1/3 (الثلث)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/4" textValue="1/4 (الربع)">1/4 (الربع)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/5" textValue="1/5 (الخمس)">1/5 (الخمس)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/6" textValue="1/6 (السدس)">1/6 (السدس)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/7" textValue="1/7 (السبع)">1/7 (السبع)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/8" textValue="1/8 (الثمن)">1/8 (الثمن)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/9" textValue="1/9 (التسع)">1/9 (التسع)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/10" textValue="1/10 (العشر)">1/10 (العشر)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/12" textValue="1/12 (جزء من 12)">1/12 (جزء من 12)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/16" textValue="1/16 (جزء من 16)">1/16 (جزء من 16)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="1/24" textValue="1/24 (جزء من 24)">1/24 (جزء من 24)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="2/3" textValue="2/3 (الثلثين)">2/3 (الثلثين)<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="3/4" textValue="3/4 (ثلاثة أرباع)">3/4 (ثلاثة أرباع)<ListBox.ItemIndicator /></ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                      <AnimatePresence>
                        {errors[will.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -5 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs font-bold text-danger flex items-center gap-1 mt-1 px-1"
                          >
                            {errors[will.id]}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button
                      variant="danger-soft"
                      isIconOnly
                      onPress={() => removeWill(will.id)}
                      aria-label="حذف الوصية"
                      className="shrink-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button
            variant="outline"
            onPress={addWill}
            fullWidth
            className="border-dashed border-amber-600/40 text-amber-700 font-bold"
          >
            <Plus size={16} /> إضافة وصية جديدة
          </Button>

          <AnimatePresence>
            {wills.length > 0 && checkWillsExceedThird() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
              >
                <div className="flex items-center gap-3 bg-amber-50/40 border border-amber-250 p-4.5 rounded-2xl">
                  <label className="flex items-center gap-3 cursor-pointer select-none w-full">
                    <input
                      type="checkbox"
                      checked={heirsApprovedExcess}
                      onChange={(e) => setHeirsApprovedExcess(e.target.checked)}
                      className="w-4 h-4 text-amber-600 bg-white border-default-350 rounded-sm focus:ring-amber-500 focus:ring-2 cursor-pointer accent-amber-600 shrink-0"
                    />
                    <span className="text-sm font-semibold text-amber-950 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-700 shrink-0" /> هل وافق الورثة على الوصية بأكثر من الثلث؟
                    </span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card.Content>
      </Card>
    </motion.div>
  );
}
