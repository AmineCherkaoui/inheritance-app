import React from 'react';
import { Card, Button } from '@heroui/react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Trash2, Scale } from 'lucide-react';

export default function MandatoryBequestForm({
  hasMandatoryBequest,
  setHasMandatoryBequest,
  mandatoryBequests,
  setMandatoryBequests
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
      className="w-full"
    >
      <Card className="rounded-3xl border border-default-200 bg-white p-6 shadow-none">


        {/* Checkbox */}
        <div className="flex items-center gap-3 bg-amber-50/20 border border-amber-250/50 p-4 rounded-2xl mb-4">
          <label className="flex items-center gap-3 cursor-pointer select-none w-full">
            <input
              type="checkbox"
              checked={hasMandatoryBequest}
              onChange={(e) => {
                const checked = e.target.checked;
                setHasMandatoryBequest(checked);
                if (!checked) {
                  setMandatoryBequests([]);
                }
              }}
              className="w-4 h-4 text-amber-600 bg-white border-default-350 rounded-sm focus:ring-amber-500 focus:ring-2 cursor-pointer accent-amber-600 shrink-0"
            />
            <span className="text-xs sm:text-sm font-semibold text-amber-600">
              هل يوجد أولاد لابن متوفى أو لبنت متوفية (وصية واجبة)؟
            </span>
          </label>
        </div>

        {/* Form Fields */}
        <AnimatePresence initial={false}>
          {hasMandatoryBequest && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-3 overflow-hidden"
            >
              {mandatoryBequests.map((mb, idx) => (
                <div key={mb.id} className="flex flex-col gap-3 rounded-2xl p-4 border border-default-100 bg-default-50/50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-900">
                      {mb.type === 'son' ? `أولاد ابن متوفى #${idx + 1}` : `أولاد بنت متوفية #${idx + 1}`}
                    </span>
                    <Button
                      variant="danger-soft"
                      size="sm"
                      isIconOnly
                      onPress={() => {
                        const updated = mandatoryBequests.filter(item => item.id !== mb.id);
                        setMandatoryBequests(updated);
                        if (updated.length === 0) {
                          setHasMandatoryBequest(false);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Sons Counter */}
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-default-250 shadow-3xs">
                      <span className="text-xs font-bold text-muted-foreground pr-1">
                        {mb.type === 'son' ? 'أبنائه (ابن ابن)' : 'أبنائها (ابن بنت)'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          isIconOnly
                          onPress={() => {
                            const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, sonsCount: Math.max(0, (item.sonsCount || 0) - 1) } : item);
                            setMandatoryBequests(updated);
                          }}
                          className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="w-6 text-center text-xs font-extrabold">{mb.sonsCount || 0}</span>
                        <Button
                          size="sm"
                          isIconOnly
                          onPress={() => {
                            const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, sonsCount: (item.sonsCount || 0) + 1 } : item);
                            setMandatoryBequests(updated);
                          }}
                          className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                    </div>

                    {/* Daughters Counter */}
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-default-250 shadow-3xs">
                      <span className="text-xs font-bold text-muted-foreground pr-1">
                        {mb.type === 'son' ? 'بناته (بنت ابن)' : 'بناتها (بنت بنت)'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          isIconOnly
                          onPress={() => {
                            const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, daughtersCount: Math.max(0, (item.daughtersCount || 0) - 1) } : item);
                            setMandatoryBequests(updated);
                          }}
                          className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="w-6 text-center text-xs font-extrabold">{mb.daughtersCount || 0}</span>
                        <Button
                          size="sm"
                          isIconOnly
                          onPress={() => {
                            const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, daughtersCount: (item.daughtersCount || 0) + 1 } : item);
                            setMandatoryBequests(updated);
                          }}
                          className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                    </div>

                    {/* Great Grandchildren Counters (Only for Son) */}
                    {mb.type === 'son' && (
                      <>
                        <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-default-250 shadow-3xs">
                          <span className="text-xs font-bold text-muted-foreground pr-1">أبناء ابنه (ابن ابن ابن)</span>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              isIconOnly
                              onPress={() => {
                                const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, greatSonsCount: Math.max(0, (item.greatSonsCount || 0) - 1) } : item);
                                setMandatoryBequests(updated);
                              }}
                              className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="w-6 text-center text-xs font-extrabold">{mb.greatSonsCount || 0}</span>
                            <Button
                              size="sm"
                              isIconOnly
                              onPress={() => {
                                const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, greatSonsCount: (item.greatSonsCount || 0) + 1 } : item);
                                setMandatoryBequests(updated);
                              }}
                              className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                            >
                              <Plus size={12} />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-default-250 shadow-3xs">
                          <span className="text-xs font-bold text-muted-foreground pr-1">بنات ابنه (بنت ابن ابن)</span>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              isIconOnly
                              onPress={() => {
                                const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, greatDaughtersCount: Math.max(0, (item.greatDaughtersCount || 0) - 1) } : item);
                                setMandatoryBequests(updated);
                              }}
                              className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="w-6 text-center text-xs font-extrabold">{mb.greatDaughtersCount || 0}</span>
                            <Button
                              size="sm"
                              isIconOnly
                              onPress={() => {
                                const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, greatDaughtersCount: (item.greatDaughtersCount || 0) + 1 } : item);
                                setMandatoryBequests(updated);
                              }}
                              className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                            >
                              <Plus size={12} />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Mother Status */}
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-default-250 shadow-3xs">
                      <span className="text-xs font-bold text-muted-foreground pr-1">
                        {mb.type === 'son' ? 'أم الابن المتوفى؟' : 'أم البنت المتوفية؟'}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, motherAlive: true } : item);
                            setMandatoryBequests(updated);
                          }}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all duration-150 ${mb.motherAlive !== false ? 'bg-amber-600 border-amber-600 text-white shadow-3xs' : 'bg-default-50 border-default-200 text-muted-foreground'}`}
                        >
                          على قيد الحياة
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, motherAlive: false } : item);
                            setMandatoryBequests(updated);
                          }}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all duration-150 ${mb.motherAlive === false ? 'bg-amber-600 border-amber-600 text-white shadow-3xs' : 'bg-default-50 border-default-200 text-muted-foreground'}`}
                        >
                          متوفاة
                        </button>
                      </div>
                    </div>

                    {/* Spouse Status */}
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-default-250 shadow-3xs">
                      <span className="text-xs font-bold text-muted-foreground pr-1">
                        {mb.type === 'son' ? 'أرملة هذا الابن؟' : 'أرمل هذه البنت؟'}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, spouseAlive: true } : item);
                            setMandatoryBequests(updated);
                          }}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all duration-150 ${mb.spouseAlive !== false ? 'bg-amber-600 border-amber-600 text-white shadow-3xs' : 'bg-default-50 border-default-200 text-muted-foreground'}`}
                        >
                          على قيد الحياة
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, spouseAlive: false } : item);
                            setMandatoryBequests(updated);
                          }}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all duration-150 ${mb.spouseAlive === false ? 'bg-amber-600 border-amber-600 text-white shadow-3xs' : 'bg-default-50 border-default-200 text-muted-foreground'}`}
                        >
                          {mb.type === 'son' ? 'متوفاة' : 'متوفى'}
                        </button>
                      </div>
                    </div>

                    {/* Great Spouse Status (Only for Son when great grandchildren are present) */}
                    {mb.type === 'son' && ((mb.greatSonsCount || 0) > 0 || (mb.greatDaughtersCount || 0) > 0) && (
                      <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-default-250 shadow-3xs">
                        <span className="text-xs font-bold text-muted-foreground pr-1">أرملة ابن الابن؟</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, greatSpouseAlive: true } : item);
                              setMandatoryBequests(updated);
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all duration-150 ${mb.greatSpouseAlive !== false ? 'bg-amber-600 border-amber-600 text-white shadow-3xs' : 'bg-default-50 border-default-200 text-muted-foreground'}`}
                          >
                            على قيد الحياة
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = mandatoryBequests.map(item => item.id === mb.id ? { ...item, greatSpouseAlive: false } : item);
                              setMandatoryBequests(updated);
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all duration-150 ${mb.greatSpouseAlive === false ? 'bg-amber-600 border-amber-600 text-white shadow-3xs' : 'bg-default-50 border-default-200 text-muted-foreground'}`}
                          >
                            متوفاة
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-2 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 font-bold border-amber-600/30 text-amber-700 hover:bg-amber-50/50"
                  onPress={() => setMandatoryBequests([...mandatoryBequests, { id: `mb-${Date.now()}-${Math.random()}`, type: 'son', sonsCount: 0, daughtersCount: 0, greatSonsCount: 0, greatDaughtersCount: 0, motherAlive: true, spouseAlive: true, greatSpouseAlive: true }])}
                >
                  <Plus size={14} /> أولاد ابن متوفى
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 font-bold border-amber-600/30 text-amber-700 hover:bg-amber-50/50"
                  onPress={() => setMandatoryBequests([...mandatoryBequests, { id: `mb-${Date.now()}-${Math.random()}`, type: 'daughter', sonsCount: 0, daughtersCount: 0, motherAlive: true, spouseAlive: true }])}
                >
                  <Plus size={14} /> أولاد بنت متوفية
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
