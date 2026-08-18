import React from 'react';
import { ScrollText, X, Sparkles, CheckCircle2 } from 'lucide-react';
import Sheet, {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetClose
} from '../ui/Sheet';
import AppBackground from '../AppBackground';
import { renderExplanationWithQuranFont, cn } from '../../utils';

function formatCurrency(value) {
  return (value ?? 0).toLocaleString('ar-MA', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' د.م.';
}

function formatHeirsListSummary(distributions) {
  if (!distributions || distributions.length === 0) return '';

  const regulars = [];
  const branches = {};

  for (const d of distributions) {
    if (
      d.relationship === 'TREASURY' ||
      d.relationship_display === 'بيت المال' ||
      d.relationship?.startsWith('WILL_') ||
      d.is_will ||
      d.type === 'will'
    ) {
      continue;
    }
    const text = d.relationship_display;
    const match = text.match(/(.+?)\s*\((من\s+[^)]+)\)/);
    const hasMultiple = d.count !== '-' && parseInt(d.count) > 1;
    const displaySuffix = hasMultiple ? ` (${d.count})` : '';

    if (match) {
      const baseName = match[1].trim();
      const branchLabel = match[2].trim();
      if (!branches[branchLabel]) {
        branches[branchLabel] = [];
      }
      const itemText = `${baseName}${displaySuffix}`;
      if (!branches[branchLabel].includes(itemText)) {
        branches[branchLabel].push(itemText);
      }
    } else {
      const itemText = `${text}${displaySuffix}`;
      if (!regulars.includes(itemText)) {
        regulars.push(itemText);
      }
    }
  }

  const parts = [...regulars];
  for (const [branchLabel, kids] of Object.entries(branches)) {
    parts.push(`${branchLabel} (${kids.join(' و ')})`);
  }

  return parts.join(' و ');
}

function formatRowName(name, stepId) {
  if (!name) return '—';
  if (stepId && stepId.startsWith('step2')) {
    if (name.includes('ابن ابن متوفى')) return 'ابن ابن';
    if (name.includes('ابن متوفى')) return 'ابن';
    if (name.includes('بنت متوفاة')) return 'بنت';
  }
  return name;
}

export default function DetailedCalculationDrawerV3({ result, isOpen, onOpenChange, onClose }) {
  if (!result) return null;

  const handleClose = () => {
    onOpenChange?.(false);
    onClose?.();
  };

  const isMandatory = result.mandatory_bequest_steps && result.mandatory_bequest_steps.length > 0;
  const steps = isMandatory ? result.mandatory_bequest_steps : (result.standard_steps || []);
  const heirsSummary = formatHeirsListSummary(result.distributions);

  return (
    <Sheet
      isOpen={isOpen}
      onClose={handleClose}
      side="right"
      size="w-full max-w-4xl"
      dir="rtl"
      className="bg-secondary-50 border-l border-primary-950/20 flex flex-col shadow-2xl text-primary-950 relative overflow-hidden"
    >
      <AppBackground className="absolute inset-0" />

      {/* Header */}
      <SheetHeader className="relative z-10 p-4 sm:p-5 border-b border-primary-950/15 bg-secondary-50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-950 text-secondary-200 flex items-center justify-center shrink-0 shadow-xs">
              <ScrollText size={20} />
            </div>
            <div className="flex flex-col text-right">
              <SheetTitle className="text-base sm:text-lg font-black text-primary-950">
                خطوات الحل والشرح التفصيلي
              </SheetTitle>
            </div>
          </div>

          <SheetClose
            onClick={handleClose}
            className="p-2 rounded-full text-primary-950/70 hover:text-primary-950 hover:bg-primary-950/10 transition-colors cursor-pointer shrink-0"
          >
            <X size={22} className="stroke-2.5" />
          </SheetClose>
        </div>
      </SheetHeader>

      {/* Body */}
      <SheetBody className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Case Summary Card */}
        {heirsSummary && (
          <div className="bg-primary-950 text-secondary-200 border border-secondary-200/30 p-4 rounded-xl text-xs sm:text-sm font-bold leading-relaxed text-right flex items-start gap-3 shadow-2xs">
            <Sparkles size={18} className="text-secondary-200 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-secondary-200/70 font-semibold">بيان ورثة المتوفى:</span>
              <span>مات وترك: {heirsSummary}</span>
            </div>
          </div>
        )}

        {/* Steps Rendering */}
        <div className="flex flex-col gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="bg-white/70 border border-primary-950/15 rounded-xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-2xs"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-primary-950/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-primary-950 text-secondary-200 rounded-full text-[10px] font-black font-mono">
                    المرحلة {idx + 1}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-primary-950">
                    {step.title}
                  </h4>
                </div>
              </div>

              {step.desc && (
                <p className="text-xs text-muted-foreground leading-relaxed text-right">
                  {step.desc}
                </p>
              )}

              {/* Step Table */}
              {step.table && step.table.length > 0 && (
                <div className="overflow-x-auto border border-primary-950/15 rounded-xl bg-white/80">
                  <table className="w-full border-collapse text-right text-xs">
                    <thead>
                      <tr className="border-b border-primary-950/10 text-[11px] font-bold text-primary-950 bg-primary-950/5">
                        <th className="py-2.5 px-3 text-right">الوارث</th>

                        {/* Standard Step 1 */}
                        {step.id === 'std_step1' && (
                          <>
                            <th className="py-2.5 px-3 text-center">نصيبه</th>
                            <th className="py-2.5 px-3 text-right">التوضيح الفقهي والدليل الشرعي</th>
                          </>
                        )}

                        {/* Standard Step 2 */}
                        {step.id === 'std_step2' && (
                          <th className="py-2.5 px-3 text-center">السهم قبل التصحيح</th>
                        )}

                        {/* Standard Step 3 */}
                        {step.id === 'std_step3' && (
                          <>
                            <th className="py-2.5 px-3 text-center">العدد</th>
                            <th className="py-2.5 px-3 text-center">نصيب الفرد</th>
                            <th className="py-2.5 px-3 text-center">النسبة</th>
                            <th className="py-2.5 px-3 text-left">من المال</th>
                          </>
                        )}

                        {/* Mandatory Bequest Step 1 */}
                        {isMandatory && step.id === 'step1' && (
                          <>
                            <th className="py-2.5 px-3 text-center">العدد</th>
                            <th className="py-2.5 px-3 text-center">نصيب الفرد</th>
                            <th className="py-2.5 px-3 text-center">حالة الاستحقاق</th>
                            <th className="py-2.5 px-3 text-right">ملاحظات شرعية</th>
                          </>
                        )}

                        {/* Mandatory Bequest Other Steps */}
                        {isMandatory && step.id !== 'step1' && (
                          <>
                            <th className="py-2.5 px-3 text-center">العدد</th>
                            <th className="py-2.5 px-3 text-center">نصيب الفرد</th>
                            <th className="py-2.5 px-3 text-center">النسبة</th>
                            <th className="py-2.5 px-3 text-right">ملاحظات</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-primary-950/10">
                      {step.table.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-primary-950/5 transition-colors">
                          <td className="py-2.5 px-3 text-right font-bold text-primary-950 whitespace-nowrap">
                            {formatRowName(row.name, step.id)}
                          </td>

                          {/* Standard Step 1 Cells */}
                          {step.id === 'std_step1' && (
                            <>
                              <td className="py-2.5 px-3 text-center font-black text-primary-950 font-mono">
                                {row.share}
                              </td>
                              <td className="py-2.5 px-3 text-right text-[11px] text-muted-foreground leading-relaxed min-w-50">
                                {row.why ? renderExplanationWithQuranFont(row.why) : '—'}
                              </td>
                            </>
                          )}

                          {/* Standard Step 2 Cells */}
                          {step.id === 'std_step2' && (
                            <td className="py-2.5 px-3 text-center font-black text-primary-950 font-mono">
                              {row.share}
                            </td>
                          )}

                          {/* Standard Step 3 Cells */}
                          {step.id === 'std_step3' && (
                            <>
                              <td className="py-2.5 px-3 text-center font-bold text-muted-foreground font-mono">
                                {row.count}
                              </td>
                              <td className="py-2.5 px-3 text-center font-black text-primary-950 font-mono">
                                {row.share}
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold text-primary-950 font-mono">
                                %{row.percentage.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-3 text-left font-black text-primary-950 font-mono">
                                {formatCurrency(row.value)}
                              </td>
                            </>
                          )}

                          {/* Mandatory Bequest Step 1 Cells */}
                          {isMandatory && step.id === 'step1' && (
                            <>
                              <td className="py-2.5 px-3 text-center font-bold text-muted-foreground font-mono">
                                {row.count}
                              </td>
                              <td className="py-2.5 px-3 text-center font-black text-primary-950 font-mono">
                                {row.share}
                              </td>
                              <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                <span className={cn(
                                  'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                                  row.status.includes('غير وارث')
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                )}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right text-[11px] text-muted-foreground leading-relaxed min-w-50">
                                {row.why ? renderExplanationWithQuranFont(row.why) : '—'}
                              </td>
                            </>
                          )}

                          {/* Mandatory Bequest Other Steps Cells */}
                          {isMandatory && step.id !== 'step1' && (
                            <>
                              <td className="py-2.5 px-3 text-center font-bold text-muted-foreground font-mono">
                                {row.count}
                              </td>
                              <td className="py-2.5 px-3 text-center font-black text-primary-950 font-mono">
                                {row.share}
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold text-primary-950 font-mono">
                                %{row.percentage.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-3 text-right text-[11px] text-muted-foreground leading-relaxed min-w-50">
                                {row.why ? renderExplanationWithQuranFont(row.why) : '—'}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Step Result Summary Text */}
              {step.result_text && (
                <div className="bg-emerald-500/10 border border-emerald-500/25 text-primary-950 p-3 rounded-xl text-xs font-bold leading-relaxed whitespace-pre-line flex items-start gap-2 text-right">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span>{step.result_text}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetBody>
    </Sheet>
  );
}
