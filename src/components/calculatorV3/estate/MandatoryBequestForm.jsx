import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@heroui/react';
import { Plus, Minus, Trash2, Users } from 'lucide-react';
import { cn } from '../../../utils';

export default function MandatoryBequestForm({
  hasMandatoryBequest,
  setHasMandatoryBequest,
  mandatoryBequests = [],
  setMandatoryBequests
}) {
  return (
    <div className="space-y-4 bg-white/50 p-4 rounded-xl">
      {/* Switch Card */}
      <div
        onClick={() => {
          const next = !hasMandatoryBequest;
          setHasMandatoryBequest(next);
          if (!next) {
            setMandatoryBequests([]);
          }
        }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex flex-col text-right">
          <span className="text-primary-950 text-sm sm:text-base font-extrabold flex items-center gap-1.5">
            <Users size={20} />
            <span>هل يوجد أولاد لابن المتوفي او لبنت متوفية (وصية واجبة) </span>
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
            تُمنح للأحفاد المحجوبين الذين توفي والدهم أو والدتهم في حياة المورث وفق القانون
          </span>
        </div>

        {/* Dual Segmented Switch (نعم / لا) */}
        <div
          className="inline-flex items-center bg-neutral-200/50 p-0.5 rounded-full shrink-0 select-none relative gap-1"
          dir="rtl"
        >
          {/* YES Option */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setHasMandatoryBequest(true);
            }}
            className={cn(
              'relative z-10 px-4 py-2 text-xs font-black rounded-full transition-colors duration-200 cursor-pointer min-w-10 text-center',
              hasMandatoryBequest
                ? 'text-white'
                : 'text-neutral-600 hover:text-primary-950'
            )}
          >
            {hasMandatoryBequest && (
              <motion.span
                layoutId="mandatoryBequestTogglePill"
                className="absolute inset-0 bg-primary-950 rounded-full -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            نعم
          </button>

          {/* NO Option */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setHasMandatoryBequest(false);
              setMandatoryBequests([]);
            }}
            className={cn(
              'relative z-10 px-4 py-2 text-xs font-black rounded-full transition-colors duration-200 cursor-pointer min-w-10 text-center',
              !hasMandatoryBequest
                ? 'text-primary-950'
                : 'text-neutral-600 hover:text-primary-950'
            )}
          >
            {!hasMandatoryBequest && (
              <motion.span
                layoutId="mandatoryBequestTogglePill"
                className="absolute inset-0 bg-white rounded-full -z-10 border border-neutral-200/80"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            لا
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <AnimatePresence initial={false}>
        {hasMandatoryBequest && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 overflow-hidden pt-2"
          >
            {/* Add Son/Daughter Buttons at the Top */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onPress={() =>
                  setMandatoryBequests([
                    ...mandatoryBequests,
                    {
                      id: `mb-${Date.now()}-${Math.random()}`,
                      name: '',
                      type: 'son',
                      sonsCount: 0,
                      daughtersCount: 0,
                      greatSonsCount: 0,
                      greatDaughtersCount: 0,
                      motherAlive: true,
                      spouseAlive: true,
                      greatSpouseAlive: true
                    }
                  ])
                }
                className="w-full flex-1 py-1.5 px-4 rounded-lg bg-transparent border border-dashed border-primary-950/30 hover:bg-primary-950/5 text-primary-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} />
                <span>إضافة أولاد ابن متوفى</span>
              </Button>

              <Button
                onPress={() =>
                  setMandatoryBequests([
                    ...mandatoryBequests,
                    {
                      id: `mb-${Date.now()}-${Math.random()}`,
                      name: '',
                      type: 'daughter',
                      sonsCount: 0,
                      daughtersCount: 0,
                      motherAlive: true,
                      spouseAlive: true
                    }
                  ])
                }
                className="w-full flex-1 py-1.5 px-4 rounded-lg bg-transparent border border-dashed border-primary-950/30 hover:bg-primary-950/5 text-primary-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} />
                <span>إضافة أولاد بنت متوفية</span>
              </Button>
            </div>

            {/* Branches List */}
            {mandatoryBequests.map((mb, idx) => (
              <div
                key={mb.id}
                className="flex flex-col gap-3 rounded-xl p-4  bg-white/90 border border-neutral-200/50"
              >
                {/* Branch Header & Name Input */}
                <div className="flex items-center justify-between gap-3 pb-3 ">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      placeholder={
                        mb.type === 'son'
                          ? `اسم الابن المتوفى`
                          : `اسم البنت المتوفية`
                      }
                      value={mb.name || ''}
                      onChange={(e) => {
                        const updated = mandatoryBequests.map((item) =>
                          item.id === mb.id ? { ...item, name: e.target.value } : item
                        );
                        setMandatoryBequests(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/30 text-primary-950 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-950 transition-all text-right"
                    />
                  </div>

                  <Button
                    isIconOnly
                    size="sm"
                    onPress={() => {
                      const updated = mandatoryBequests.filter((item) => item.id !== mb.id);
                      setMandatoryBequests(updated);
                    }}
                    aria-label="حذف الفرع"
                    className="rounded-lg shrink-0 text-primary-950 bg-white border border-neutral-200 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-400"
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>

                {/* Counters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Sons Counter */}
                  <div className="flex items-center justify-between px-2 py-1 bg-white/30 rounded-lg border border-primary-950/20">
                    <span className="text-xs font-bold text-primary-950">
                      {mb.type === 'son' ? 'أبناؤه (ابن ابن)' : 'أبناؤها (ابن بنت)'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        isIconOnly
                        onPress={() => {
                          const updated = mandatoryBequests.map((item) =>
                            item.id === mb.id
                              ? { ...item, sonsCount: Math.max(0, (item.sonsCount || 0) - 1) }
                              : item
                          );
                          setMandatoryBequests(updated);
                        }}
                        className="size-7 min-w-0 rounded-md  bg-white/40 hover:bg-white/80 text-primary-950 font-bold"
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="w-6 text-center text-xs font-black text-primary-950 font-mono">
                        {mb.sonsCount || 0}
                      </span>
                      <Button
                        size="sm"
                        isIconOnly
                        onPress={() => {
                          const updated = mandatoryBequests.map((item) =>
                            item.id === mb.id
                              ? { ...item, sonsCount: (item.sonsCount || 0) + 1 }
                              : item
                          );
                          setMandatoryBequests(updated);
                        }}
                        className="size-7 min-w-0 rounded-md  bg-white/40 hover:bg-white/80 text-primary-950 font-bold"
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                  </div>

                  {/* Daughters Counter */}
                  <div className="flex items-center justify-between px-2 py-1 bg-white/30 rounded-lg border border-primary-950/30">
                    <span className="text-xs font-bold text-primary-950">
                      {mb.type === 'son' ? 'بناته (بنت ابن)' : 'بناتها (بنت بنت)'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        isIconOnly
                        onPress={() => {
                          const updated = mandatoryBequests.map((item) =>
                            item.id === mb.id
                              ? { ...item, daughtersCount: Math.max(0, (item.daughtersCount || 0) - 1) }
                              : item
                          );
                          setMandatoryBequests(updated);
                        }}
                        className="size-7 min-w-0 rounded-md  bg-white/40 hover:bg-white/80 text-primary-950 font-bold"
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="w-6 text-center text-xs font-black text-primary-950 font-mono">
                        {mb.daughtersCount || 0}
                      </span>
                      <Button
                        size="sm"
                        isIconOnly
                        onPress={() => {
                          const updated = mandatoryBequests.map((item) =>
                            item.id === mb.id
                              ? { ...item, daughtersCount: (item.daughtersCount || 0) + 1 }
                              : item
                          );
                          setMandatoryBequests(updated);
                        }}
                        className="size-7 min-w-0 rounded-md  bg-white/40 hover:bg-white/80 text-primary-950 font-bold"
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                  </div>

                  {/* Great Grandchildren Counters (Only for Son) */}
                  {mb.type === 'son' && (
                    <>
                      <div className="flex items-center justify-between px-2 py-1 bg-white/30 rounded-lg border border-primary-950/30">
                        <span className="text-xs font-bold text-primary-950">أبناء ابنه (ابن ابن ابن)</span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            isIconOnly
                            onPress={() => {
                              const updated = mandatoryBequests.map((item) =>
                                item.id === mb.id
                                  ? { ...item, greatSonsCount: Math.max(0, (item.greatSonsCount || 0) - 1) }
                                  : item
                              );
                              setMandatoryBequests(updated);
                            }}
                            className="size-7 min-w-0 rounded-md  bg-white/40 hover:bg-white/80 text-primary-950 font-bold"
                          >
                            <Minus size={12} />
                          </Button>
                          <span className="w-6 text-center text-xs font-black text-primary-950 font-mono">
                            {mb.greatSonsCount || 0}
                          </span>
                          <Button
                            size="sm"
                            isIconOnly
                            onPress={() => {
                              const updated = mandatoryBequests.map((item) =>
                                item.id === mb.id
                                  ? { ...item, greatSonsCount: (item.greatSonsCount || 0) + 1 }
                                  : item
                              );
                              setMandatoryBequests(updated);
                            }}
                            className="size-7 min-w-0 rounded-md  bg-white/40 hover:bg-white/80 text-primary-950 font-bold"
                          >
                            <Plus size={12} />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-2 py-1 bg-white/30 rounded-lg border border-primary-950/30">
                        <span className="text-xs font-bold text-primary-950">بنات ابنه (بنت ابن ابن)</span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            isIconOnly
                            onPress={() => {
                              const updated = mandatoryBequests.map((item) =>
                                item.id === mb.id
                                  ? { ...item, greatDaughtersCount: Math.max(0, (item.greatDaughtersCount || 0) - 1) }
                                  : item
                              );
                              setMandatoryBequests(updated);
                            }}
                            className="size-7 min-w-0 rounded-md  bg-white/40 hover:bg-white/80 text-primary-950 font-bold"
                          >
                            <Minus size={12} />
                          </Button>
                          <span className="w-6 text-center text-xs font-black text-primary-950 font-mono">
                            {mb.greatDaughtersCount || 0}
                          </span>
                          <Button
                            size="sm"
                            isIconOnly
                            onPress={() => {
                              const updated = mandatoryBequests.map((item) =>
                                item.id === mb.id
                                  ? { ...item, greatDaughtersCount: (item.greatDaughtersCount || 0) + 1 }
                                  : item
                              );
                              setMandatoryBequests(updated);
                            }}
                            className="size-7 min-w-0 rounded-md  bg-white/40 hover:bg-white/80 text-primary-950 font-bold"
                          >
                            <Plus size={12} />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Mother Status */}
                  <div className="flex items-center justify-between px-2 py-1 bg-white/30 rounded-lg border border-primary-950/30">
                    <span className="text-xs font-bold text-primary-950">
                      {mb.type === 'son' ? 'أم الابن المتوفى؟' : 'أم البنت المتوفية؟'}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = mandatoryBequests.map((item) =>
                            item.id === mb.id ? { ...item, motherAlive: true } : item
                          );
                          setMandatoryBequests(updated);
                        }}
                        className={cn(
                          'px-2.5 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer',
                          mb.motherAlive !== false
                            ? 'bg-primary-950 text-white'
                            : 'bg-white/50 text-primary-950 border border-primary-950/30'
                        )}
                      >
                        على قيد الحياة
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = mandatoryBequests.map((item) =>
                            item.id === mb.id ? { ...item, motherAlive: false } : item
                          );
                          setMandatoryBequests(updated);
                        }}
                        className={cn(
                          'px-2.5 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer',
                          mb.motherAlive === false
                            ? 'bg-primary-950 text-white'
                            : 'bg-white/50 text-primary-950 border border-primary-950/30'
                        )}
                      >
                        متوفاة
                      </button>
                    </div>
                  </div>

                  {/* Spouse Status */}
                  <div className="flex items-center justify-between py-1 px-2 bg-white/30 rounded-lg border border-primary-950/30">
                    <span className="text-xs font-bold text-primary-950">
                      {mb.type === 'son' ? 'أرملة هذا الابن؟' : 'أرمل هذه البنت؟'}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = mandatoryBequests.map((item) =>
                            item.id === mb.id ? { ...item, spouseAlive: true } : item
                          );
                          setMandatoryBequests(updated);
                        }}
                        className={cn(
                          'px-2.5 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer',
                          mb.spouseAlive !== false
                            ? 'bg-primary-950 text-white'
                            : 'bg-white/50 text-primary-950 border border-primary-950/30'
                        )}
                      >
                        على قيد الحياة
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = mandatoryBequests.map((item) =>
                            item.id === mb.id ? { ...item, spouseAlive: false } : item
                          );
                          setMandatoryBequests(updated);
                        }}
                        className={cn(
                          'px-2.5 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer',
                          mb.spouseAlive === false
                            ? 'bg-primary-950 text-white'
                            : 'bg-white/50 text-primary-950 border border-primary-950/30'
                        )}
                      >
                        {mb.type === 'son' ? 'متوفاة' : 'متوفى'}
                      </button>
                    </div>
                  </div>

                  {/* Great Spouse Status */}
                  {mb.type === 'son' && ((mb.greatSonsCount || 0) > 0 || (mb.greatDaughtersCount || 0) > 0) && (
                    <div className="flex items-center justify-between py-1 px-2 bg-white/30 rounded-lg border border-primary-950/30">
                      <span className="text-xs font-bold text-primary-950">أرملة ابن الابن؟</span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = mandatoryBequests.map((item) =>
                              item.id === mb.id ? { ...item, greatSpouseAlive: true } : item
                            );
                            setMandatoryBequests(updated);
                          }}
                          className={cn(
                            'px-2.5 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer',
                            mb.greatSpouseAlive !== false
                              ? 'bg-primary-950 text-white'
                              : 'bg-white/50 text-primary-950 border border-primary-950/30'
                          )}
                        >
                          على قيد الحياة
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = mandatoryBequests.map((item) =>
                              item.id === mb.id ? { ...item, greatSpouseAlive: false } : item
                            );
                            setMandatoryBequests(updated);
                          }}
                          className={cn(
                            'px-2.5 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer',
                            mb.greatSpouseAlive === false
                              ? 'bg-primary-950 text-white'
                              : 'bg-white/50 text-primary-950 border border-primary-950/30'
                          )}
                        >
                          متوفاة
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
