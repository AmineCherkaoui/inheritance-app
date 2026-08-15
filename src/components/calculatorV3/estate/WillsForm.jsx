import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Select, ListBox } from '@heroui/react';
import { ScrollText, Plus, Trash2, AlertTriangle } from 'lucide-react';

export default function WillsForm({
  wills = [],
  addWill,
  updateWill,
  removeWill,
  heirsApprovedExcess,
  setHeirsApprovedExcess,
  checkWillsExceedThird,
  errors = {}
}) {
  return (
    <div className="flex flex-col gap-4 bg-white/50 p-4 rounded-xl  border border-primary-950/10">
      {/* Title */}
      <div className="space-y-1">
        <label className=" text-primary-950 font-bold text-muted-foreground flex items-center gap-2 justify-start text-right">
          <ScrollText size={20} />
          <span >الوصايا </span>
        </label>

      </div>

      {/* Add Will Button with HeroUI */}
      <Button
        onPress={addWill}
        className="w-full py-2.5 px-4 rounded-full  bg-primary-950 text-white hover:bg-primary-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Plus size={16} />
        <span>إضافة وصية جديدة</span>
      </Button>

      {/* Wills List */}
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {wills.map((will, idx) => (
            <motion.div
              key={will.id}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden p-0.5"
            >
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center rounded-xl">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={will.name}
                    placeholder={`اسم الوصية`}
                    onChange={(e) => updateWill(will.id, 'name', e.target.value)}
                    className="w-full pr-4 px-4 py-2 rounded-lg border border-primary-950/20 bg-white/50 text-primary-950 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary-950 transition-all text-right"
                  />
                </div>

                <div className="sm:w-56">
                  <Select
                    className="w-full"
                    aria-label=""
                    placeholder=""
                    value={will.value}
                    onChange={(val) => {
                      if (val) updateWill(will.id, 'value', val);
                    }}
                    isInvalid={!!errors[will.id]}
                  >
                    <Select.Trigger className="w-full py-1.5 px-3 rounded-lg border border-primary-950/20 bg-white/80 text-primary-950 text-sm font-semibold transition-all outline-none focus:outline-none focus:!ring-1 focus:!ring-primary-950 data-[open=true]:!ring-1 data-[open=true]:!ring-primary-950 data-[focus-visible=true]:!ring-1 data-[focus-visible=true]:!ring-primary-950 aria-expanded:!ring-1 aria-expanded:!ring-primary-950 shadow-none">
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
                  {errors[will.id] && (
                    <p className="text-xs font-bold text-red-600 text-right mt-1">{errors[will.id]}</p>
                  )}
                </div>

                {/* Remove Button with HeroUI */}
                <Button
                  isIconOnly
                  onPress={() => removeWill(will.id)}
                  aria-label="حذف الوصية"
                  className="rounded-lg shrink-0 text-primary-950 bg-white border border-primary-950/20 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-400"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>



      {/* Excess Third Consent Alert */}
      <AnimatePresence>
        {wills.length > 0 && checkWillsExceedThird && checkWillsExceedThird() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <div className="flex items-center gap-3 bg-secondary-200/10 border border-secondary-200 px-4 py-2 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer select-none w-full">
                <input
                  type="checkbox"
                  checked={heirsApprovedExcess}
                  onChange={(e) => setHeirsApprovedExcess(e.target.checked)}
                  className="w-4 h-4 text-secondary-500 accent-secondary-500 rounded cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-semibold text-secondary-500 flex items-center gap-2">
                  <AlertTriangle size={16} className=" shrink-0" />
                  <span>هل وافق الورثة على الوصية بأكثر من الثلث؟</span>
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
