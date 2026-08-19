import React from "react";
import { motion } from "motion/react";
import { Button } from "@heroui/react";
import { Plus, Minus, Users, Info, ShieldCheck } from "lucide-react";
import { cn } from "../../../utils";
import StepHeader from "../StepHeader";

export default function MiniStepChildren({ heirs = {}, updateHeir }) {
  const sonsCount = heirs["SON"] || 0;
  const daughtersCount = heirs["DAUGHTER"] || 0;
  const totalChildren = sonsCount + daughtersCount;

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
        title="الأولاد (البنون والبنات)"
        icon={Users}
        subtitle="أدخل عدد الأبناء والبنات المباشرين للمتوفى (إن وجدوا)"
      />

      {/* Main Container Card */}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-bold  block text-right">
          الفروع المباشرة للمتوفى
        </span>

        <div className="flex flex-col gap-3">
          {/* Sons Counter Row */}
          <div
            onClick={() => {
              if (sonsCount === 0) {
                updateHeir("SON", 1);
              }
            }}
            className={cn(
              "flex items-center flex-col sm:flex-row gap-4 justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200",
              sonsCount > 0
                ? "bg-primary-950 border-secondary-200 text-secondary-200 ring-2 ring-secondary-200 shadow-md"
                : "bg-white/50 border-primary-950/20 text-primary-950 cursor-pointer hover:bg-primary-950/5",
            )}
          >
            <div className="flex flex-col text-center sm:text-right">
              <span
                className={cn(
                  "text-xs sm:text-sm font-extrabold",
                  sonsCount > 0 ? "text-secondary-200" : "text-primary-950",
                )}
              >
                عدد الأبناء (الذكور)
              </span>
              <span
                className={cn(
                  "text-[11px] sm:text-xs mt-0.5",
                  sonsCount > 0 ? "text-secondary-100/80" : "",
                )}
              >
                عصبة بالنفس، يحجبون الأحفاد والإخوة والأعمام
              </span>
            </div>

            {sonsCount > 0 ? (
              <div
                className="flex w-fit items-center gap-1.5 p-1 rounded-lg border-2 border-secondary-200/50 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => updateHeir("SON", Math.max(0, sonsCount - 1))}
                  aria-label="إنقاص عدد الأبناء"
                  className="size-7 min-w-0 rounded-md font-bold cursor-pointer transition-colors active:scale-95 hover:bg-primary-800 text-secondary-200 bg-transparent flex items-center justify-center"
                >
                  <Minus size={12} className="stroke-4" />
                </button>
                <span className="w-7 text-center text-xs sm:text-sm font-black font-mono text-secondary-100">
                  {sonsCount}
                </span>
                <button
                  type="button"
                  onClick={() => updateHeir("SON", sonsCount + 1)}
                  aria-label="زيادة عدد الأبناء"
                  className="size-7 min-w-0 rounded-md font-bold cursor-pointer transition-colors active:scale-95 hover:bg-primary-800 text-secondary-200 bg-transparent flex items-center justify-center"
                >
                  <Plus size={12} className="stroke-4" />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                onPress={() => updateHeir("SON", 1)}
                className="px-4 rounded-lg border-dashed border-primary-950 text-primary-950 font-bold hover:bg-primary-950/10 border bg-transparent flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus size={14} className="stroke-3" />
                <span className="text-xs">إضافة</span>
              </Button>
            )}
          </div>

          {/* Daughters Counter Row */}
          <div
            onClick={() => {
              if (daughtersCount === 0) {
                updateHeir("DAUGHTER", 1);
              }
            }}
            className={cn(
              "flex items-center flex-col sm:flex-row gap-4 justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200",
              daughtersCount > 0
                ? "bg-primary-950 border-secondary-200 text-secondary-200 ring-2 ring-secondary-200 shadow-md"
                : "bg-white/50 border-primary-950/20 text-primary-950 cursor-pointer hover:bg-primary-950/5",
            )}
          >
            <div className="flex flex-col text-center sm:text-right">
              <span
                className={cn(
                  "text-xs sm:text-sm font-extrabold",
                  daughtersCount > 0
                    ? "text-secondary-200"
                    : "text-primary-950",
                )}
              >
                عدد البنات (الإناث)
              </span>
              <span
                className={cn(
                  "text-[11px] sm:text-xs mt-0.5",
                  daughtersCount > 0 ? "text-secondary-100/80" : "",
                )}
              >
                ترث الواحدة النصف، والاثنتان فأكثر الثلثين، أو بالتعصيب مع الابن
              </span>
            </div>

            {daughtersCount > 0 ? (
              <div
                className=" flex w-fit items-center gap-1.5 p-1 rounded-lg border-2 border-secondary-200/50 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() =>
                    updateHeir("DAUGHTER", Math.max(0, daughtersCount - 1))
                  }
                  aria-label="إنقاص عدد البنات"
                  className="size-7 min-w-0 rounded-md font-bold cursor-pointer transition-colors active:scale-95 hover:bg-primary-800 text-secondary-200 bg-transparent flex items-center justify-center"
                >
                  <Minus size={12} className="stroke-4" />
                </button>
                <span className="w-7 text-center text-xs sm:text-sm font-black font-mono text-secondary-100">
                  {daughtersCount}
                </span>
                <button
                  type="button"
                  onClick={() => updateHeir("DAUGHTER", daughtersCount + 1)}
                  aria-label="زيادة عدد البنات"
                  className="size-7 min-w-0 rounded-md font-bold cursor-pointer transition-colors active:scale-95 hover:bg-primary-800 text-secondary-200 bg-transparent flex items-center justify-center"
                >
                  <Plus size={12} className="stroke-4" />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                onPress={() => updateHeir("DAUGHTER", 1)}
                className="px-4 rounded-lg border-dashed border-primary-950 text-primary-950 font-bold hover:bg-primary-950/10 border bg-transparent flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus size={14} className="stroke-3" />
                <span className="text-xs">إضافة</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
