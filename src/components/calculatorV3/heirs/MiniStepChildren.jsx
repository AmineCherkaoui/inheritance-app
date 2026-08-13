import React from 'react';
import { Card, Button } from '@heroui/react';
import { motion } from 'motion/react';
import { Plus, Minus, Users } from 'lucide-react';

export default function MiniStepChildren({
  heirs = {},
  updateHeir
}) {
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
          <span>الأولاد (البنون والبنات)</span>
        </div>
        <div className="h-px bg-default-200 flex-1 max-w-28" />
      </div>
      <p className="text-center text-xs text-muted-foreground -mt-3">
        أدخل عدد الأبناء والبنات المباشرين للمتوفى
      </p>

      {/* Card */}
      <Card className="rounded-3xl border border-default-200 p-6 sm:p-8 space-y-5 bg-white/95 shadow-xl shadow-amber-900/2">
        <div className="space-y-3">
          {/* Sons */}
          <div className="flex items-center justify-between p-4 border border-default-200 rounded-2xl bg-white">
            <div className="flex flex-col text-right">
              <span className="text-sm font-extrabold text-foreground">عدد الأبناء (الذكور)</span>
              <span className="text-xs text-muted-foreground">يحجبون الفروع الأبعد والإخوة والأعمام</span>
            </div>
            <div className="flex items-center gap-1.5 bg-default-50 p-1 rounded-xl border border-default-200 shadow-2xs">
              <Button
                size="sm"
                isIconOnly
                onPress={() => updateHeir('SON', Math.max(0, (heirs['SON'] || 0) - 1))}
                className="w-8 h-8 bg-transparent text-foreground hover:bg-default-200"
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center text-sm font-black font-mono">{heirs['SON'] || 0}</span>
              <Button
                size="sm"
                isIconOnly
                onPress={() => updateHeir('SON', (heirs['SON'] || 0) + 1)}
                className="w-8 h-8 bg-transparent text-foreground hover:bg-default-200"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>

          {/* Daughters */}
          <div className="flex items-center justify-between p-4 border border-default-200 rounded-2xl bg-white">
            <div className="flex flex-col text-right">
              <span className="text-sm font-extrabold text-foreground">عدد البنات (الإناث)</span>
              <span className="text-xs text-muted-foreground">يرثن بالفرض أو بالتعصيب مع الابن</span>
            </div>
            <div className="flex items-center gap-1.5 bg-default-50 p-1 rounded-xl border border-default-200 shadow-2xs">
              <Button
                size="sm"
                isIconOnly
                onPress={() => updateHeir('DAUGHTER', Math.max(0, (heirs['DAUGHTER'] || 0) - 1))}
                className="w-8 h-8 bg-transparent text-foreground hover:bg-default-200"
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center text-sm font-black font-mono">{heirs['DAUGHTER'] || 0}</span>
              <Button
                size="sm"
                isIconOnly
                onPress={() => updateHeir('DAUGHTER', (heirs['DAUGHTER'] || 0) + 1)}
                className="w-8 h-8 bg-transparent text-foreground hover:bg-default-200"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
