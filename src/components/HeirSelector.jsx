import React from 'react';
import { Accordion, Card, Button } from '@heroui/react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ChevronDown, Check, UserPlus, Plus, Minus } from 'lucide-react';

export default function HeirSelector({
  heirCategories,
  heirs,
  updateHeir,
  isCategoryBlocked,
  isHeirBlocked,
  deceasedGender
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      className="space-y-3"
    >
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2 px-1 tracking-tight">
        <Users size={20} className="text-amber-600" /> اختر الورثة المتواجدين
      </h3>

      <Accordion
        variant="surface"
        allowsMultipleExpanded
        className="w-full rounded-3xl overflow-hidden shadow-none border border-border bg-white p-2.5 flex flex-col gap-2.5"
      >
        {Object.entries(heirCategories).map(([catKey, cat]) => {
          if (isCategoryBlocked(catKey, heirs)) return null;

          let filteredList = cat.list;
          if (catKey === 'primary') {
            if (deceasedGender === 'male') {
              filteredList = cat.list.filter(h => h.key !== 'HUSBAND');
            } else {
              filteredList = cat.list.filter(h => h.key !== 'WIFE');
            }
          }

          const visibleHeirs = filteredList.filter(h => !isHeirBlocked(h.key, heirs));
          if (visibleHeirs.length === 0) return null;

          const selectedCount = visibleHeirs.filter(h => heirs[h.key] > 0).length;

          return (
            <Accordion.Item key={catKey}>
              <Accordion.Heading>
                <Accordion.Trigger className="font-semibold">
                  <span className="flex items-center gap-2 text-sm">
                    {cat.title}
                    {selectedCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                        {selectedCount}
                      </span>
                    )}
                  </span>
                  <Accordion.Indicator>
                    <ChevronDown size={16} />
                  </Accordion.Indicator>
                </Accordion.Trigger>
              </Accordion.Heading>

              <Accordion.Panel>
                <Accordion.Body className="pt-3 pb-4 px-3.5">
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                  >
                    <AnimatePresence initial={false}>
                      {visibleHeirs.map(heir => {
                        const currentVal = heirs[heir.key] || 0;
                        const isActive = currentVal > 0;

                        // Click handler for card click
                        const handleCardClick = () => {
                          if (heir.type === 'select') {
                            updateHeir(heir.key, isActive ? 0 : 1);
                          } else {
                            if (!isActive) {
                              updateHeir(heir.key, 1);
                            }
                          }
                        };

                        return (
                          <motion.div
                            key={heir.key}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Card
                              variant={isActive ? 'secondary' : 'default'}
                              className={`flex flex-row items-center justify-between rounded-xl transition-all duration-200 cursor-pointer select-none p-3.5 shadow-none border ${isActive ? 'border-amber-300 ring-1 ring-amber-300 bg-amber-50/15' : 'border-default-200 hover:border-amber-300'
                                }`}
                              onClick={handleCardClick}
                            >
                              <span className={`text-xs font-bold ${isActive ? 'text-amber-900' : 'text-foreground'}`}>
                                {heir.label}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {heir.type === 'select' ? (
                                  <div className="flex items-center">
                                    {isActive ? (
                                      <span className="flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-lg border border-amber-200/50">
                                        <Check size={12} className="stroke-3" /> موجود
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 text-[11px] font-bold text-muted hover:text-foreground bg-default-100 px-2.5 py-1 rounded-lg">
                                        <UserPlus size={12} /> إضافة
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    {isActive ? (
                                      <div className="flex items-center gap-1 bg-amber-50/70 p-0.5 rounded-lg border border-amber-200/60 shadow-2xs" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                          size="sm"
                                          isIconOnly
                                          variant="tertiary"
                                          onPress={() => updateHeir(heir.key, Math.max(0, currentVal - 1))}
                                          isDisabled={currentVal === 0}
                                          className="w-7 h-7 min-w-0 rounded-md hover:bg-amber-100 text-amber-900 flex items-center justify-center"
                                        >
                                          <Minus size={12} className="stroke-3" />
                                        </Button>
                                        <span className="w-6 text-center text-xs font-extrabold text-amber-900">
                                          {currentVal}
                                        </span>
                                        <Button
                                          size="sm"
                                          isIconOnly
                                          variant="tertiary"
                                          onPress={() => updateHeir(heir.key, heir.max ? Math.min(heir.max, currentVal + 1) : currentVal + 1)}
                                          className="w-7 h-7 min-w-0 rounded-md hover:bg-amber-100 text-amber-900 flex items-center justify-center"
                                        >
                                          <Plus size={12} className="stroke-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <span className="flex items-center gap-1 text-[11px] font-bold text-muted hover:text-foreground bg-default-100 px-2.5 py-1 rounded-lg">
                                        <UserPlus size={12} /> إضافة
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </motion.div>
  );
}
