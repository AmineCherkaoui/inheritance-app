import React from 'react';
import { Card, Button, Accordion } from '@heroui/react';
import { motion } from 'motion/react';
import {
  Users, UserCheck, UserX, Plus, Minus, Check,
  AlertCircle, ChevronDown, Heart
} from 'lucide-react';
import { HEIR_CATEGORIES, isHeirBlocked, isCategoryBlocked } from './heirConstants';

export default function StepHeirs({
  heirs = {},
  updateHeir,
  deceasedGender = 'male',
  hasMandatoryBequest = false
}) {
  const activeHeirsCount = Object.values(heirs).filter(c => c > 0).length;

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
          <Users size={18} className="text-amber-700" />
          <span>تحديد ورثة المتوفى</span>
        </div>
        <div className="h-px bg-default-200 flex-1 max-w-28" />
      </div>
      <p className="text-center text-xs text-muted-foreground -mt-3">
        حدد الورثة الأحياء والأقارب المستحقين، وسيتم تطبيق قواعد الحجب الشرعي تلقائياً
      </p>

      {/* Quick Summary Pill */}
      <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200/80 px-4 py-2 rounded-xl text-xs">
        <span className="text-amber-950 font-bold">
          عدد فئات الورثة المحددة حالياً:
        </span>
        <span className="font-black px-2 py-0.5 rounded-md bg-amber-600 text-white font-mono">
          {activeHeirsCount}
        </span>
      </div>

      {/* 1. Spouse & Primary Family Section */}
      <div className="bg-white/95 rounded-2xl p-5 border border-default-200 shadow-xs space-y-4">
        <h4 className="text-xs font-black text-foreground flex items-center gap-1.5 border-b border-default-100 pb-2">
          <Heart size={14} className="text-amber-600" />
          <span>الزوج(ة) والوالدان والأولاد</span>
        </h4>

        {/* Spouse selection */}
        {deceasedGender === 'female' ? (
          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground block text-right">
              هل يوجد زوج على قيد الحياة؟
            </span>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => updateHeir('HUSBAND', heirs['HUSBAND'] === 1 ? 0 : 1)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer font-extrabold text-xs ${
                  heirs['HUSBAND'] === 1
                    ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-default-200 hover:border-amber-300 text-foreground'
                }`}
              >
                <UserCheck size={16} className={heirs['HUSBAND'] === 1 ? 'text-amber-600' : 'text-muted-foreground'} />
                <span>يوجد زوج</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => updateHeir('HUSBAND', -1)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer font-extrabold text-xs ${
                  heirs['HUSBAND'] === -1
                    ? 'border-red-500 bg-red-50 text-red-900 shadow-xs'
                    : 'border-default-200 hover:border-red-200 text-muted-foreground'
                }`}
              >
                <UserX size={16} className={heirs['HUSBAND'] === -1 ? 'text-red-500' : 'text-muted-foreground'} />
                <span>لا يوجد زوج</span>
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground block text-right">
              هل توجد زوجة (أو زوجات) على قيد الحياة؟
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all font-extrabold text-xs ${
                  heirs['WIFE'] > 0
                    ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-default-200 text-foreground'
                }`}
              >
                <div
                  className="flex items-center gap-1.5 cursor-pointer flex-1"
                  onClick={() => updateHeir('WIFE', heirs['WIFE'] > 0 ? 0 : 1)}
                >
                  <UserCheck size={16} className={heirs['WIFE'] > 0 ? 'text-amber-600' : 'text-muted-foreground'} />
                  <span>توجد زوجة</span>
                </div>
                {heirs['WIFE'] > 0 && (
                  <div className="flex items-center gap-1 bg-white px-1 py-0.5 rounded-lg border border-default-300">
                    <Button
                      size="sm"
                      isIconOnly
                      onPress={() => updateHeir('WIFE', Math.max(1, heirs['WIFE'] - 1))}
                      className="w-6 h-6 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                    >
                      <Minus size={11} />
                    </Button>
                    <span className="w-5 text-center text-xs font-black">{heirs['WIFE']}</span>
                    <Button
                      size="sm"
                      isIconOnly
                      onPress={() => updateHeir('WIFE', Math.min(4, heirs['WIFE'] + 1))}
                      className="w-6 h-6 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                    >
                      <Plus size={11} />
                    </Button>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => updateHeir('WIFE', -1)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer font-extrabold text-xs ${
                  heirs['WIFE'] === -1
                    ? 'border-red-500 bg-red-50 text-red-900 shadow-xs'
                    : 'border-default-200 hover:border-red-200 text-muted-foreground'
                }`}
              >
                <UserX size={16} className={heirs['WIFE'] === -1 ? 'text-red-500' : 'text-muted-foreground'} />
                <span>لا توجد زوجة</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* Parents (Father & Mother) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => updateHeir('FATHER', heirs['FATHER'] > 0 ? 0 : 1)}
            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
              heirs['FATHER'] > 0
                ? 'border-amber-600 bg-amber-50/50 text-amber-900'
                : 'border-default-200 hover:border-amber-300 text-foreground'
            }`}
          >
            <span className="text-xs font-bold">الأب</span>
            <span className={`text-xs font-extrabold ${heirs['FATHER'] > 0 ? 'text-amber-700' : 'text-muted-foreground'}`}>
              {heirs['FATHER'] > 0 ? 'موجود ✔️' : 'غير موجود'}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => updateHeir('MOTHER', heirs['MOTHER'] > 0 ? 0 : 1)}
            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
              heirs['MOTHER'] > 0
                ? 'border-amber-600 bg-amber-50/50 text-amber-900'
                : 'border-default-200 hover:border-amber-300 text-foreground'
            }`}
          >
            <span className="text-xs font-bold">الأم</span>
            <span className={`text-xs font-extrabold ${heirs['MOTHER'] > 0 ? 'text-amber-700' : 'text-muted-foreground'}`}>
              {heirs['MOTHER'] > 0 ? 'موجودة ✔️' : 'غير موجودة'}
            </span>
          </motion.button>
        </div>

        {/* Children (Sons & Daughters) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Sons */}
          <div className="flex items-center justify-between p-3 border border-default-200 rounded-xl bg-white">
            <div className="flex flex-col text-right">
              <span className="text-xs font-extrabold">عدد الأبناء (ذكور)</span>
              <span className="text-[10px] text-muted-foreground">يحجبون الحواشي والأحفاد</span>
            </div>
            <div className="flex items-center gap-1 bg-default-50 p-1 rounded-lg border border-default-200">
              <Button
                size="sm"
                isIconOnly
                onPress={() => updateHeir('SON', Math.max(0, (heirs['SON'] || 0) - 1))}
                className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-200"
              >
                <Minus size={12} />
              </Button>
              <span className="w-6 text-center text-xs font-black font-mono">{heirs['SON'] || 0}</span>
              <Button
                size="sm"
                isIconOnly
                onPress={() => updateHeir('SON', (heirs['SON'] || 0) + 1)}
                className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-200"
              >
                <Plus size={12} />
              </Button>
            </div>
          </div>

          {/* Daughters */}
          <div className="flex items-center justify-between p-3 border border-default-200 rounded-xl bg-white">
            <div className="flex flex-col text-right">
              <span className="text-xs font-extrabold">عدد البنات (إناث)</span>
              <span className="text-[10px] text-muted-foreground">يرثن بالفرض أو بالتعصيب</span>
            </div>
            <div className="flex items-center gap-1 bg-default-50 p-1 rounded-lg border border-default-200">
              <Button
                size="sm"
                isIconOnly
                onPress={() => updateHeir('DAUGHTER', Math.max(0, (heirs['DAUGHTER'] || 0) - 1))}
                className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-200"
              >
                <Minus size={12} />
              </Button>
              <span className="w-6 text-center text-xs font-black font-mono">{heirs['DAUGHTER'] || 0}</span>
              <Button
                size="sm"
                isIconOnly
                onPress={() => updateHeir('DAUGHTER', (heirs['DAUGHTER'] || 0) + 1)}
                className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-200"
              >
                <Plus size={12} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Other Categories Accordion (Grandchildren, Siblings, Grandparents, Nephews, Uncles) */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-muted-foreground block text-right px-1">
          باقي الأقارب والفروع والحواشي
        </h4>

        <Accordion
          variant="surface"
          allowsMultipleExpanded
          className="w-full rounded-2xl overflow-hidden shadow-none border border-default-200 bg-white p-2 flex flex-col gap-2"
        >
          {Object.entries(HEIR_CATEGORIES)
            .filter(([catKey]) => catKey !== 'primary')
            .map(([catKey, cat]) => {
              const isDescendantsAndMandatory = catKey === 'descendants' && hasMandatoryBequest;
              const isBlocked = isCategoryBlocked(catKey, heirs) && !isDescendantsAndMandatory;

              if (isBlocked) return null;

              const visibleHeirs = isDescendantsAndMandatory
                ? cat.list
                : cat.list.filter(h => !isHeirBlocked(h.key, heirs));

              if (visibleHeirs.length === 0) return null;

              const selectedCount = visibleHeirs.filter(h => heirs[h.key] > 0).length;

              return (
                <Accordion.Item key={catKey}>
                  <Accordion.Heading>
                    <Accordion.Trigger className="font-bold py-2.5 px-3">
                      <span className="flex items-center gap-2 text-xs sm:text-sm">
                        {cat.title}
                        {isDescendantsAndMandatory ? (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                            مُعطّل (لوجود وصية واجبة)
                          </span>
                        ) : selectedCount > 0 ? (
                          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-amber-600 text-white text-[10px] font-black font-mono">
                            {selectedCount}
                          </span>
                        ) : null}
                      </span>
                      <Accordion.Indicator>
                        <ChevronDown size={15} />
                      </Accordion.Indicator>
                    </Accordion.Trigger>
                  </Accordion.Heading>

                  <Accordion.Panel>
                    <Accordion.Body className="pt-2 pb-3 px-3 space-y-2.5">
                      {isDescendantsAndMandatory && (
                        <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl text-xs">
                          <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            تم تفعيل خيار <strong>«الوصية الواجبة»</strong>، ويتم احتساب حصص الفروع تلقائياً من خلال الخطوة السابقة (التركة والوصايا).
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {visibleHeirs.map((heir) => {
                          const currentVal = heirs[heir.key] || 0;
                          const isActive = currentVal > 0;
                          const isCardDisabled = isDescendantsAndMandatory;

                          return (
                            <Card
                              key={heir.key}
                              className={`flex flex-row items-center justify-between rounded-xl p-3 shadow-none border transition-all duration-150 ${
                                isCardDisabled
                                  ? 'opacity-40 cursor-not-allowed bg-default-50 border-default-200'
                                  : isActive
                                  ? 'border-amber-500 bg-amber-50/30 ring-1 ring-amber-400'
                                  : 'border-default-200 hover:border-amber-300 bg-white'
                              }`}
                              onClick={() => {
                                if (isCardDisabled) return;
                                if (heir.type === 'select') {
                                  updateHeir(heir.key, isActive ? 0 : 1);
                                } else if (!isActive) {
                                  updateHeir(heir.key, 1);
                                }
                              }}
                            >
                              <span className={`text-xs font-bold ${isActive ? 'text-amber-950' : 'text-foreground'}`}>
                                {heir.label}
                              </span>

                              <div className="flex items-center gap-1">
                                {isCardDisabled ? (
                                  <span className="text-[10px] font-bold text-muted-foreground bg-default-100 px-2 py-0.5 rounded-md">
                                    وصية واجبة
                                  </span>
                                ) : heir.type === 'select' ? (
                                  <Button
                                    size="sm"
                                    onPress={() => updateHeir(heir.key, isActive ? 0 : 1)}
                                    className={`h-7 px-2.5 text-[10px] font-extrabold rounded-lg ${
                                      isActive
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'bg-default-100 text-foreground hover:bg-default-200'
                                    }`}
                                  >
                                    {isActive ? (
                                      <span className="flex items-center gap-1">
                                        <Check size={11} className="stroke-3" /> مضاف
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1">
                                        <Plus size={11} /> إضافة
                                      </span>
                                    )}
                                  </Button>
                                ) : (
                                  <div className="flex items-center">
                                    {!isActive ? (
                                      <Button
                                        size="sm"
                                        onPress={() => updateHeir(heir.key, 1)}
                                        className="h-7 px-2.5 text-[10px] font-extrabold rounded-lg bg-default-100 text-foreground hover:bg-default-200"
                                      >
                                        <span className="flex items-center gap-1">
                                          <Plus size={11} /> إضافة
                                        </span>
                                      </Button>
                                    ) : (
                                      <div
                                        className="flex items-center gap-1 bg-amber-50 p-0.5 rounded-lg border border-amber-300 shadow-2xs"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Button
                                          size="sm"
                                          isIconOnly
                                          onPress={() => updateHeir(heir.key, Math.max(0, currentVal - 1))}
                                          className="w-6 h-6 min-w-0 bg-transparent text-foreground hover:bg-amber-100 rounded-md"
                                        >
                                          <Minus size={11} />
                                        </Button>
                                        <span className="w-5 text-center text-xs font-black text-amber-950 font-mono">
                                          {currentVal}
                                        </span>
                                        <Button
                                          size="sm"
                                          isIconOnly
                                          onPress={() => updateHeir(heir.key, currentVal + 1)}
                                          className="w-6 h-6 min-w-0 bg-transparent text-foreground hover:bg-amber-100 rounded-md"
                                        >
                                          <Plus size={11} />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </Accordion.Body>
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
        </Accordion>
      </div>
    </motion.div>
  );
}
