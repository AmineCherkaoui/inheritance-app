import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@heroui/react';
import {
  Scale, ShieldAlert, FileText, Download,
  FileSpreadsheet, Share2, ChevronLeft,
  ShieldCheck, Check, Banknote,
  TrendingDown, ScrollText, PieChart as PieIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { serializeState, generateQRCodeWithLogo, cn, downloadBlob } from '../../utils';
import { ROUTES } from '../../constants/links';
import { pdf } from '@react-pdf/renderer';
import PdfReport from '../PdfReport';
import { exportExcelReport } from '../ExcelReport';
import DetailedCalculationDrawerV3 from './DetailedCalculationDrawerV3';
import StepHeader from './StepHeader';

function formatCurrency(value) {
  return (value ?? 0).toLocaleString('ar-MA', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' د.م.';
}

function getCommonDenominatorFractions(distributions) {
  const active = distributions.filter(d => d.percentage > 0);
  if (active.length === 0) return [];

  const parsed = active.map(d => {
    const parts = (d.individual_share_fraction || d.share_fraction || '1/1').split('/');
    const num = parseInt(parts[0]) || 0;
    const den = parts[1] ? parseInt(parts[1]) : 1;

    const classParts = (d.share_fraction || '1/1').split('/');
    const classNum = parseInt(classParts[0]) || 0;
    const classDen = classParts[1] ? parseInt(classParts[1]) : 1;

    return { num, den, classNum, classDen, dist: d };
  });

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a, b) => (a * b) / gcd(a, b);

  let commonDen = 1;
  for (const p of parsed) {
    if (p.den > 0) commonDen = lcm(commonDen, p.den);
    if (p.classDen > 0) commonDen = lcm(commonDen, p.classDen);
  }

  return parsed.map(p => {
    if (p.num === 0) {
      return { ...p.dist, individual_share_fraction: '0', share_fraction: '0' };
    }
    const scale = commonDen / p.den;
    const scaledNum = p.num * scale;

    const classScale = commonDen / p.classDen;
    const classScaledNum = p.classNum * classScale;

    return {
      ...p.dist,
      individual_share_fraction: `${scaledNum}/${commonDen}`,
      share_fraction: `${classScaledNum}/${commonDen}`
    };
  });
}

const CHART_COLORS = ['#b5893d', '#4a7c59', '#6366f1', '#d97706', '#8b5cf6', '#0284c7', '#e11d48', '#059669'];
const ALLOC_COLORS = ['#b5893d', '#8b5cf6', '#ef4444'];

export default function StepResults({
  result,
  onBackToEdit,
  onReset,
  stateSnapshot = {}
}) {
  const [copied, setCopied] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [chartMode, setChartMode] = useState('heirs'); // 'heirs' | 'estate'

  if (!result) {
    return (
      <div className="w-full text-center py-12 space-y-4">
        <Scale size={36} className="text-muted-foreground mx-auto" />
        <p className="text-sm font-bold text-muted-foreground">
          لا توجد نتائج متوفرة بعد. يرجى إكمال الخطوات السابقة ثم الضغط على حساب التركة.
        </p>
        {onBackToEdit && (
          <Button onPress={onBackToEdit} className="bg-primary-950 text-secondary-200 font-bold rounded-xl">
            الرجوع للخطوات
          </Button>
        )}
      </div>
    );
  }

  const displayNetEstate = (result.original_net_estate || result.total_estate) - (result.total_wills_cost || 0);
  const allFormatted = getCommonDenominatorFractions(result.distributions || []);
  const heirsDistributions = allFormatted.filter(d => !d.relationship.startsWith('WILL_'));
  const willsDistributions = allFormatted.filter(d => d.relationship.startsWith('WILL_'));

  const familyPieData = heirsDistributions.map((dist) => ({
    name: dist.relationship_display,
    value: dist.total_value,
    percentage: dist.percentage
  }));

  const estateAllocationData = [
    { name: 'صافي الورثة', value: displayNetEstate, percentage: (displayNetEstate / result.total_estate) * 100 }
  ];
  if (result.total_wills_cost > 0) {
    estateAllocationData.push({
      name: 'الوصايا المنفذة',
      value: result.total_wills_cost,
      percentage: (result.total_wills_cost / result.total_estate) * 100
    });
  }
  if (result.deductions > 0) {
    estateAllocationData.push({
      name: 'الديون والالتزامات',
      value: result.deductions,
      percentage: (result.deductions / result.total_estate) * 100
    });
  }

  const hasWillsOrDebts = result.total_wills_cost > 0 || result.deductions > 0;
  const isMandatory = result.mandatory_bequest_steps && result.mandatory_bequest_steps.length > 0;


  const rawDebts = stateSnapshot.debts || [];
  const activeDebtsList = Array.isArray(rawDebts)
    ? rawDebts.filter((d) => Number(d.amount) > 0)
    : [];

  const getShareLink = () => {
    const code = serializeState(stateSnapshot);
    return `${window.location.origin}${ROUTES.CALCULATION}?s=${code}`;
  };

  const copyShareLink = () => {
    const url = getShareLink();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (url) => {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const handleDownloadPdf = async () => {
    if (loadingPdf) return;
    setLoadingPdf(true);
    try {
      const shareUrl = getShareLink();
      const qrCodeDataUrl = await generateQRCodeWithLogo(shareUrl);
      const blob = await pdf(
        <PdfReport
          result={result}
          shareUrl={shareUrl}
          qrCodeDataUrl={qrCodeDataUrl}
        />
      ).toBlob();
      const fileName = `تقرير_الميراث_${result.deceased_name || (result.deceased_gender === 'female' ? 'المتوفاة' : 'المتوفى')}.pdf`;
      downloadBlob(blob, fileName);
    } catch (err) {
      console.error('PDF download failed', err);
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleExportExcel = async () => {
    if (exportingExcel) return;
    setExportingExcel(true);
    try {
      await exportExcelReport(result, stateSnapshot);
    } catch (e) {
      console.error('Failed to export Excel', e);
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.22 }}
      className="w-full flex flex-col gap-6"
    >
      {/* Header Section */}
      <StepHeader
        title="تفاصيل توزيع التركة"
        icon={Scale}
        subtitle="توزيع شرعي مبني على الشريعة الإسلامية وقانون الأسرة"
      />

      {/* Estate Liquidation Overview (تصفية التركة والخصوم) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm font-bold text-muted-foreground block text-right">
            تصفية التركة والخصوم الشرعية
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-muted-foreground">
              {result.deceased_gender === 'female' ? 'المتوفاة' : 'المتوفى'}:
            </span>
            <span className="font-black text-primary-950">
              {result.deceased_name || (result.deceased_gender === 'female' ? 'المتوفاة' : 'المتوفى')}
            </span>
          </div>
        </div>

        <div className={cn(
          'grid gap-3',
          hasWillsOrDebts ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'
        )}>
          {/* Gross Estate */}
          <div className="bg-white/50 border border-primary-950/20 rounded-xl p-3.5 flex flex-col text-right">
            <span className="text-[11px] font-bold text-muted-foreground">إجمالي التركة (الخام)</span>
            <span className="text-xs sm:text-sm font-black font-mono text-primary-950 mt-1">
              {formatCurrency(result.total_estate)}
            </span>
          </div>

          {/* Debts */}
          {hasWillsOrDebts && (
            <div className={cn(
              'border rounded-xl p-3.5 flex flex-col text-right',
              result.deductions > 0 ? 'bg-red-500/5 border-red-500/30' : 'bg-white/50 border-primary-950/20'
            )}>
              <span className="text-[11px] font-bold text-red-700">الديون والالتزامات</span>
              <span className="text-xs sm:text-sm font-black font-mono text-red-700 mt-1">
                {result.deductions > 0 ? `- ${formatCurrency(result.deductions)}` : '0 د.م.'}
              </span>
            </div>
          )}

          {/* Wills */}
          {hasWillsOrDebts && (
            <div className={cn(
              'border rounded-xl p-3.5 flex flex-col text-right',
              result.total_wills_cost > 0 ? 'bg-purple-500/5 border-purple-500/30' : 'bg-white/50 border-primary-950/20'
            )}>
              <span className="text-[11px] font-bold text-purple-700">الوصايا المنفذة</span>
              <span className="text-xs sm:text-sm font-black font-mono text-purple-700 mt-1">
                {result.total_wills_cost > 0 ? `- ${formatCurrency(result.total_wills_cost)}` : '0 د.م.'}
              </span>
            </div>
          )}

          {/* Net Estate */}
          <div className="bg-primary-950 border border-secondary-200/50 rounded-xl p-3.5 flex flex-col text-right">
            <span className="text-[11px] font-bold text-secondary-200/80">صافي تركة الورثة</span>
            <span className="text-xs sm:text-sm font-black font-mono text-secondary-200 mt-1">
              {formatCurrency(displayNetEstate)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Heirs Table (Right) & Pie Chart (Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chart Column - 4 Cols */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-muted-foreground block text-right">
              التحليل البياني
            </span>
            {hasWillsOrDebts && (
              <div className="flex items-center gap-1 bg-white/80 p-0.5 rounded-lg border border-primary-950/10 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setChartMode('heirs')}
                  className={cn(
                    'px-2 py-0.5 rounded-md cursor-pointer transition-colors',
                    chartMode === 'heirs' ? 'bg-primary-950 text-white' : 'text-primary-950 hover:bg-primary-950/5'
                  )}
                >
                  الورثة
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('estate')}
                  className={cn(
                    'px-2 py-0.5 rounded-md cursor-pointer transition-colors',
                    chartMode === 'estate' ? 'bg-primary-950 text-white' : 'text-primary-950 hover:bg-primary-950/5'
                  )}
                >
                  التركة
                </button>
              </div>
            )}
          </div>

          <div className="bg-white/50 border border-primary-950/20 rounded-xl p-4 flex flex-col items-center justify-center">
            {/* Donut Chart */}
            <div className="relative h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={chartMode === 'estate' && hasWillsOrDebts ? estateAllocationData : familyPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="75%"
                    paddingAngle={(chartMode === 'estate' ? estateAllocationData.length : familyPieData.length) > 1 ? 2 : 0}
                    dataKey="value"
                  >
                    {(chartMode === 'estate' && hasWillsOrDebts ? estateAllocationData : familyPieData).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          chartMode === 'estate' && hasWillsOrDebts
                            ? ALLOC_COLORS[index % ALLOC_COLORS.length]
                            : CHART_COLORS[index % CHART_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `${Number(val).toLocaleString()} د.م.`}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      fontSize: '11px',
                      textAlign: 'right',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Estate Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-bold text-muted-foreground leading-tight">
                  {chartMode === 'estate' && hasWillsOrDebts ? 'إجمالي التركة' : 'صافي الورثة'}
                </span>
                <span className="text-xs font-black font-mono text-primary-950 mt-0.5">
                  {formatCurrency(chartMode === 'estate' && hasWillsOrDebts ? result.total_estate : displayNetEstate)}
                </span>
              </div>
            </div>

            {/* Percentage Legend */}
            <div className="w-full flex flex-col gap-1 mt-3 pt-3 border-t border-primary-950/10">
              {(chartMode === 'estate' && hasWillsOrDebts ? estateAllocationData : familyPieData).map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-0.5 text-primary-950"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          chartMode === 'estate' && hasWillsOrDebts
                            ? ALLOC_COLORS[idx % ALLOC_COLORS.length]
                            : CHART_COLORS[idx % CHART_COLORS.length]
                      }}
                    />
                    <span className="truncate font-bold text-[11px]">{entry.name}</span>
                  </div>
                  <span className="font-mono font-bold text-[11px] shrink-0">
                    %{entry.percentage.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heirs Table - 8 Cols */}
        <div className="lg:col-span-8 flex flex-col gap-2">
          <span className="text-sm font-bold text-muted-foreground block text-right">
            أنصبة الورثة المستحقين
          </span>

          <div className="overflow-x-auto bg-white/50 border border-primary-950/20 rounded-xl">
            <table className="w-full border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-primary-950/15 font-bold text-primary-950 bg-primary-950/5">
                  <th className="py-3 px-3 text-right">الوارث</th>
                  <th className="py-3 px-2 text-center">عدد الأفراد</th>
                  <th className="py-3 px-2 text-center">نصيب الفرد</th>
                  <th className="py-3 px-2 text-center">نصيب الفرد مئوياً</th>
                  <th className="py-3 px-3 text-center">نصيب الفرد (مال)</th>
                  <th className="py-3 px-3 text-left">إجمالي الفئة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-950/10">
                {heirsDistributions.map((dist, idx) => {
                  const indPercentage = dist.individual_percentage ?? dist.percentage;
                  return (
                    <tr key={idx} className="hover:bg-primary-950/5 transition-colors">
                      {/* Heir Name */}
                      <td className="py-3 px-3 font-bold text-primary-950">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                          />
                          <span>{dist.relationship_display}</span>
                        </div>
                      </td>

                      {/* Count */}
                      <td className="py-3 px-2 text-center font-mono font-bold text-muted-foreground">
                        {dist.count}
                      </td>

                      {/* Share Fraction */}
                      <td className="py-3 px-2 text-center font-mono font-black text-primary-950">
                        {dist.individual_share_fraction || dist.share_fraction}
                      </td>

                      {/* Percentage */}
                      <td className="py-3 px-2 text-center font-mono font-bold text-primary-950">
                        %{indPercentage.toFixed(2)}
                      </td>

                      {/* Individual Cash */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-primary-950">
                        {formatCurrency(dist.per_person_value)}
                      </td>

                      {/* Total Cash */}
                      <td className="py-3 px-3 text-left font-mono font-black text-primary-950">
                        {formatCurrency(dist.total_value)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Wills Section if any */}
      {willsDistributions.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-muted-foreground block text-right">
            الوصايا           </span>

          <div className="overflow-x-auto bg-white/50 border border-primary-950/20 rounded-xl">
            <table className="w-full border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-primary-950/15 font-bold text-primary-950 bg-primary-950/5">
                  <th className="py-2.5 px-3">الوصية / المستفيد</th>
                  <th className="py-2.5 px-3 text-center">النسبة المقتطعة</th>
                  <th className="py-2.5 px-3 text-left">المبلغ المقتطع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-950/10">
                {willsDistributions.map((dist, idx) => (
                  <tr key={idx} className="hover:bg-primary-950/5 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-primary-950">
                      {dist.relationship_display}
                    </td>

                    <td className="py-2.5 px-3 text-center font-mono font-black text-primary-950">
                      %{dist.percentage.toFixed(2)} {dist.share_fraction && `(${dist.share_fraction})`}
                    </td>
                    <td className="py-2.5 px-3 text-left font-mono font-extrabold text-primary-950">
                      {formatCurrency(dist.total_value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Debts Section if any */}
      {activeDebtsList.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-muted-foreground block text-right">
            تفاصيل الديون والالتزامات المالية المقتطعة
          </span>

          <div className="overflow-x-auto bg-white/50 border border-primary-950/20 rounded-xl">
            <table className="w-full border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-primary-950/15 font-bold text-primary-950 bg-primary-950/5">
                  <th className="py-2.5 px-3">بيان الدين / الالتزام</th>
                  <th className="py-2.5 px-3 text-center">النوع</th>
                  <th className="py-2.5 px-3 text-left">المبلغ المسدد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-950/10">
                {activeDebtsList.map((debt, idx) => (
                  <tr key={idx} className="hover:bg-primary-950/5 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-primary-950">
                      {debt.description || `دين رقم ${idx + 1}`}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-muted-foreground">
                      {debt.type === 'funeral'
                        ? 'مؤن التجهيز'
                        : debt.type === 'mortgage'
                          ? 'دين عيني برهن'
                          : debt.type === 'allah'
                            ? 'حق لله تعالى'
                            : 'دين عادي'}
                    </td>
                    <td className="py-2.5 px-3 text-left font-mono font-extrabold text-red-700">
                      {formatCurrency(Number(debt.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Calculation Steps Trigger Card */}
      <div className="bg-white/50 border border-primary-950/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col text-center sm:text-right">
          <span className="text-xs sm:text-sm font-extrabold text-primary-950">
            خطوات الحل والشرح التفصيلي للمسألة
          </span>
          <span className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            عرض الأدلة الفقهية، قواعد الحجب، تأصيل الفروض، وتصحيح الأنصبة
          </span>
        </div>

        <Button
          onPress={() => setIsDrawerOpen(true)}
          className="bg-primary-950 hover:bg-primary-900 text-secondary-200 font-bold text-xs px-5 py-2.5 rounded-lg border border-secondary-200/30 flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>عرض الخطوات</span>
          <ChevronLeft size={14} />
        </Button>
      </div>

      <DetailedCalculationDrawerV3
        result={result}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />

      {/* Bottom Bar: Summary & Sharing/Export Actions */}
      <div className="bg-white/50 border border-primary-950/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left / Info: Share Header */}
        <div className="flex flex-col text-center sm:text-right">
          <span className="text-xs sm:text-sm font-extrabold text-primary-950">
            مشاركة وتصدير
          </span>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            احفظ المسألة أو شارك التقرير الشرعي مع العائلة
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap justify-center gap-2">
          {/* Copy Link Button */}
          <Button
            onPress={copyShareLink}
            className="bg-white hover:bg-primary-950/5 text-primary-950 border border-primary-950/10 px-3.5  rounded-full font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="stroke-3" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>نسخ رابط المسألة</span>
              </>
            )}
          </Button>

          {/* PDF Download Button */}
          <Button
            onPress={handleDownloadPdf}
            isDisabled={loadingPdf}
            className="bg-secondary-400 hover:bg-secondary-500 text-white px-3.5  rounded-full font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>{loadingPdf ? 'جاري التحميل...' : 'تحميل تقرير PDF'}</span>
          </Button>

          {/* Excel Export Button */}
          <Button
            onPress={handleExportExcel}
            isDisabled={exportingExcel}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5  rounded-full  font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            <span>{exportingExcel ? 'جاري التصدير...' : 'تصدير EXCEL'}</span>
          </Button>
        </div>
      </div>


    </motion.div>
  );
}
