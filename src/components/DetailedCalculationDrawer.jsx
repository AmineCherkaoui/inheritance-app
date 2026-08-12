import React from 'react';
import { Drawer, Button } from '@heroui/react';
import { ScrollText, X } from 'lucide-react';
import { renderExplanationWithQuranFont } from '../utils';

function formatCurrency(value) {
  return (value ?? 0).toLocaleString('ar-MA', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' د.م.';
}

function formatHeirsListSummary(distributions) {
  if (!distributions || distributions.length === 0) return '';

  const regulars = [];
  const branches = {};

  for (const d of distributions) {
    if (d.relationship === 'TREASURY' || d.relationship_display === 'بيت المال') {
      continue;
    }
    const text = d.relationship_display;
    const match = text.match(/(.+?)\s*\((من\s+(?:الابن\s+المتوفى|البنت\s+المتوفية)\s*#\d+)\)/);
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

export default function DetailedCalculationDrawer({ result, isOpen, onOpenChange }) {
  if (!result) return null;

  const isMandatory = result.mandatory_bequest_steps && result.mandatory_bequest_steps.length > 0;
  const steps = isMandatory ? result.mandatory_bequest_steps : (result.standard_steps || []);

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right" className="max-w-full w-full h-full">
        <Drawer.Dialog className="max-w-4xl w-full h-full bg-white border-l border-default-200 flex flex-col" dir="rtl">
          <Drawer.CloseTrigger className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-default-100 transition-colors">
            <X size={18} />
          </Drawer.CloseTrigger>

          <Drawer.Header className="border-b border-default-100 pb-4 px-6 pt-6">
            <Drawer.Heading className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
              <ScrollText size={20} className="text-amber-600" /> خطوات الحل والشرح التفصيلي للمسألة
            </Drawer.Heading>
          </Drawer.Header>

          <Drawer.Body className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Input state summary */}
            <div className="bg-default-50 border border-default-150/40 p-4 rounded-2xl text-xs font-bold leading-relaxed text-foreground">
              مات وترك: {formatHeirsListSummary(result.distributions)}
              {isMandatory}
            </div>

            {steps.map((step) => (
              <div key={step.id} className="pb-6 mb-6 border-b border-default-150/60 last:border-0">
                <h4 className="text-xs sm:text-sm font-black text-amber-700 mb-2">{step.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{step.desc}</p>

                <div className="overflow-x-auto border border-default-150/40 rounded-2xl mb-3">
                  <table className="w-full border-collapse text-right text-xs">
                    <thead>
                      <tr className="border-b border-default-150 text-[10px] font-bold text-muted-foreground bg-default-50/50">
                        <th className="py-2.5 px-3 text-right">الوارث</th>

                        {/* Adjust headers based on step ID */}
                        {step.id === 'std_step1' && (
                          <>
                            <th className="py-2.5 px-3 text-center">نصيبه</th>
                            <th className="py-2.5 px-3 text-right">التوضيح الفقهي</th>
                          </>
                        )}

                        {step.id === 'std_step2' && (
                          <th className="py-2.5 px-3 text-center">السهم قبل التصحيح</th>
                        )}

                        {step.id === 'std_step3' && (
                          <>
                            <th className="py-2.5 px-3 text-center">عدد الأفراد</th>
                            <th className="py-2.5 px-3 text-center">نصيب الفرد</th>
                            <th className="py-2.5 px-3 text-center">النسبة المئوية</th>
                            <th className="py-2.5 px-3 text-left">من المال</th>
                          </>
                        )}

                        {/* Mandatory steps headers */}
                        {isMandatory && step.id === 'step1' && (
                          <>
                            <th className="py-2.5 px-3 text-center">عدد الأفراد</th>
                            <th className="py-2.5 px-3 text-center">نصيب الفرد</th>
                            <th className="py-2.5 px-3 text-center">حالة الاستحقاق</th>
                            <th className="py-2.5 px-3 text-right">ملاحظات</th>
                          </>
                        )}

                        {isMandatory && step.id !== 'step1' && (
                          <>
                            <th className="py-2.5 px-3 text-center">عدد الأفراد</th>
                            <th className="py-2.5 px-3 text-center">نصيب الفرد</th>
                            <th className="py-2.5 px-3 text-center">النسبة</th>
                            <th className="py-2.5 px-3 text-right">ملاحظات</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                      {step.table.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-default-50/20">
                          <td className="py-2.5 px-3 text-right font-bold text-foreground whitespace-nowrap">{row.name}</td>

                          {/* Render cells based on step ID */}
                          {step.id === 'std_step1' && (
                            <>
                              <td className="py-2.5 px-3 text-center font-black text-amber-700 font-mono">{row.share}</td>
                              <td className="py-2.5 px-3 text-right text-[10px] text-muted-foreground leading-relaxed min-w-37.5">
                                {row.why ? renderExplanationWithQuranFont(row.why) : '—'}
                              </td>
                            </>
                          )}

                          {step.id === 'std_step2' && (
                            <td className="py-2.5 px-3 text-center font-black text-amber-700 font-mono">{row.share}</td>
                          )}

                          {step.id === 'std_step3' && (
                            <>
                              <td className="py-2.5 px-3 text-center font-semibold text-muted-foreground font-mono">{row.count}</td>
                              <td className="py-2.5 px-3 text-center font-black text-amber-700 font-mono">{row.share}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-foreground font-mono">%{row.percentage.toFixed(2)}</td>
                              <td className="py-2.5 px-3 text-left font-bold text-amber-600 font-mono">{formatCurrency(row.value)}</td>
                            </>
                          )}

                          {/* Mandatory steps cells */}
                          {isMandatory && step.id === 'step1' && (
                            <>
                              <td className="py-2.5 px-3 text-center font-semibold text-muted-foreground font-mono">{row.count}</td>
                              <td className="py-2.5 px-3 text-center font-black text-amber-700 font-mono">{row.share}</td>
                              <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${row.status.includes('غير وارث') ? 'bg-amber-50 text-amber-800 border border-amber-250/30' : 'bg-emerald-50 text-emerald-800 border border-emerald-250/30'}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right text-[10px] text-muted-foreground leading-relaxed min-w-37.5">
                                {row.why ? renderExplanationWithQuranFont(row.why) : '—'}
                              </td>
                            </>
                          )}

                          {isMandatory && step.id !== 'step1' && (
                            <>
                              <td className="py-2.5 px-3 text-center font-semibold text-muted-foreground font-mono">{row.count}</td>
                              <td className="py-2.5 px-3 text-center font-black text-amber-700 font-mono">{row.share}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-foreground font-mono">%{row.percentage.toFixed(2)}</td>
                              <td className="py-2.5 px-3 text-right text-[10px] text-muted-foreground leading-relaxed min-w-37.5">
                                {row.why ? renderExplanationWithQuranFont(row.why) : '—'}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {step.result_text && (
                  <div className="bg-emerald-50/60 border border-emerald-200/50 text-emerald-850 p-3 rounded-xl text-xs font-bold leading-relaxed">
                    {step.result_text}
                  </div>
                )}
              </div>
            ))}
          </Drawer.Body>


        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
