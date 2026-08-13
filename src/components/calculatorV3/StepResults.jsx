import React, { useState } from 'react';
import { Card, Button, Separator } from '@heroui/react';
import { motion } from 'motion/react';
import {
  Scale, ShieldAlert, FileText,
  TrendingDown, TrendingUp, Users, ScrollText, Banknote,
  PieChart as PieIcon, BarChart3, Share2, ChevronLeft
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { serializeState, generateQRCodeWithLogo } from '../../utils';
import { pdf } from '@react-pdf/renderer';
import PdfReport from '../PdfReport';
import { exportExcelReport } from '../ExcelReport';
import DetailedCalculationDrawer from '../DetailedCalculationDrawer';

function formatCurrency(value) {
  return (value ?? 0).toLocaleString('ar-MA', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' د.م.';
}

function BreakdownStep({ icon: Icon, iconColor, label, value, valueColor = 'text-foreground', operation, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-3 px-4 rounded-xl transition-colors ${highlight ? 'bg-emerald-50/70 border border-emerald-200/60' : 'bg-default-50 border border-default-100'}`}>
      <div className="flex items-center gap-2.5">
        {operation && (
          <span className={`text-xs font-black w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${operation === '-' ? 'bg-red-100/70 text-red-600' : 'bg-emerald-100/70 text-emerald-600'}`}>
            {operation}
          </span>
        )}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconColor || 'bg-default-100 text-muted-foreground'}`}>
          <Icon size={14} />
        </div>
        <span className="text-xs font-bold text-muted-foreground">{label}</span>
      </div>
      <span className={`text-xs sm:text-sm font-extrabold font-mono ${valueColor}`}>{formatCurrency(value)}</span>
    </div>
  );
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

  if (!result) {
    return (
      <div className="w-full text-center py-12 space-y-4">
        <Scale size={36} className="text-muted-foreground mx-auto" />
        <p className="text-sm font-bold text-muted-foreground">لا توجد نتائج متوفرة بعد. يرجى إكمال الخطوات السابقة ثم الضغط على حساب التركة.</p>
        {onBackToEdit && (
          <Button onPress={onBackToEdit} className="bg-amber-600 text-white font-bold rounded-xl">
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
    estateAllocationData.push({ name: 'الوصايا المنفذة', value: result.total_wills_cost, percentage: (result.total_wills_cost / result.total_estate) * 100 });
  }
  if (result.deductions > 0) {
    estateAllocationData.push({ name: 'الديون والالتزامات', value: result.deductions, percentage: (result.deductions / result.total_estate) * 100 });
  }

  const COLORS = ['#b5893d', '#d97706', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#6366f1'];
  const ALLOC_COLORS = ['#b5893d', '#8b5cf6', '#ef4444'];
  const hasWillsOrDebts = result.total_wills_cost > 0 || result.deductions > 0;
  const isMandatory = result.mandatory_bequest_steps && result.mandatory_bequest_steps.length > 0;
  const stepsCount = isMandatory ? result.mandatory_bequest_steps.length : (result.standard_steps?.length || 3);

  const getShareLink = () => {
    const code = serializeState(stateSnapshot);
    return `${window.location.origin}/v3?s=${code}`;
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

  const handlePreviewPdf = async () => {
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
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('PDF preview failed', err);
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleExportExcel = async () => {
    if (exportingExcel) return;
    setExportingExcel(true);
    try {
      await exportExcelReport(result);
    } catch (e) {
      console.error('Failed to export Excel', e);
    } finally {
      setExportingExcel(false);
    }
  };

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
          <Scale size={18} className="text-amber-700" />
          <span>النتائج وتفاصيل القسمة الشرعية</span>
        </div>
        <div className="h-px bg-default-200 flex-1 max-w-28" />
      </div>
      <p className="text-center text-xs text-muted-foreground -mt-3">
        توزيع شرعي فقهي دقيق مبني على قواعد الميراث وتأصيل الفروض
      </p>

      {/* Aul Alert if any */}
      {result.is_aul && (
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl text-xs leading-relaxed text-right">
          <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-800">تنبيه بالعول:</strong> عالت المسألة نظراً لزيادة السهام المفروضة على أصل المسألة. تم تعديل نصيب كل وارث بنسبة عادلة شرعاً (أصل المسألة الجديد: {result.aul_sum_fractions}).
          </div>
        </div>
      )}

      {/* Estate Summary Breakdown */}
      <Card className="rounded-2xl border border-default-200 bg-white p-5 shadow-xs space-y-3.5 text-right">
        <div className="flex justify-between items-center pb-2.5 border-b border-default-100">
          <span className="text-xs font-black text-muted-foreground">
            {result.deceased_gender === 'female' ? 'المتوفاة' : 'المتوفى'}
          </span>
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-lg">
            {result.deceased_name || (result.deceased_gender === 'female' ? 'المتوفاة' : 'المتوفى')}
          </span>
        </div>

        <div className="space-y-2">
          <BreakdownStep
            icon={Banknote}
            label="إجمالي التركة (المال الخام)"
            value={result.total_estate}
            valueColor="text-foreground"
          />

          {result.deductions > 0 && (
            <BreakdownStep
              icon={TrendingDown}
              iconColor="bg-red-50 text-red-500"
              label="الديون والالتزامات المالية"
              value={result.deductions}
              valueColor="text-red-600"
              operation="-"
            />
          )}

          {result.total_wills_cost > 0 && (
            <BreakdownStep
              icon={ScrollText}
              iconColor="bg-purple-50 text-purple-500"
              label="الوصايا الشرعية المنفذة"
              value={result.total_wills_cost}
              valueColor="text-purple-600"
              operation="-"
            />
          )}

          <Separator className="my-1" />

          <BreakdownStep
            icon={TrendingUp}
            iconColor="bg-emerald-50 text-emerald-600"
            label="صافي التركة القابلة للتوزيع على الورثة"
            value={displayNetEstate}
            valueColor="text-emerald-700 font-black text-sm"
            highlight
          />
        </div>
      </Card>

      {/* Charts Section */}
      <Card className="rounded-2xl border border-default-200 bg-white p-5 text-right shadow-xs">
        <h3 className="text-xs font-black flex items-center gap-1.5 mb-4 text-foreground">
          <PieIcon size={15} className="text-amber-600" />
          <span>الرسم البياني وتوزيع الأنصبة</span>
        </h3>

        {hasWillsOrDebts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Estate Allocation */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-black text-muted-foreground mb-2 text-center">تقسيم التركة الإجمالية</span>
              <div className="relative h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={estateAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius="46%"
                      outerRadius="72%"
                      paddingAngle={estateAllocationData.length > 1 ? 3 : 0}
                      dataKey="value"
                    >
                      {estateAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ALLOC_COLORS[index % ALLOC_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => `${Number(val).toLocaleString()} د.م.`}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', fontSize: '11px', textAlign: 'right' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {estateAllocationData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-[10px] font-bold text-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ALLOC_COLORS[idx % ALLOC_COLORS.length] }} />
                    <span>{entry.name}</span>
                    <span className="text-muted-foreground font-mono">(%{entry.percentage.toFixed(1)})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Family Shares */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-black text-muted-foreground mb-2 text-center">توزيع أنصبة الورثة</span>
              <div className="relative h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={familyPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius="46%"
                      outerRadius="72%"
                      paddingAngle={familyPieData.length > 1 ? 3 : 0}
                      dataKey="value"
                    >
                      {familyPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => `${Number(val).toLocaleString()} د.م.`}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', fontSize: '11px', textAlign: 'right' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {familyPieData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-[10px] font-bold text-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span>{entry.name}</span>
                    <span className="text-muted-foreground font-mono">(%{entry.percentage.toFixed(1)})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm mx-auto flex flex-col items-center">
            <div className="relative h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={familyPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="46%"
                    outerRadius="72%"
                    paddingAngle={familyPieData.length > 1 ? 3 : 0}
                    dataKey="value"
                  >
                    {familyPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `${Number(val).toLocaleString()} د.م.`}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', fontSize: '11px', textAlign: 'right' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {familyPieData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1 text-[10px] font-bold text-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{entry.name}</span>
                  <span className="text-muted-foreground font-mono">(%{entry.percentage.toFixed(1)})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Heirs Table */}
      <Card className="rounded-2xl border border-default-200 bg-white p-5 text-right shadow-xs overflow-hidden">
        <h3 className="text-xs font-black flex items-center gap-1.5 mb-3 text-foreground">
          <Users size={15} className="text-amber-600" />
          <span>أنصبة الورثة المستحقين</span>
        </h3>

        <div className="overflow-x-auto border border-default-100 rounded-xl">
          <table className="w-full border-collapse text-right text-xs">
            <thead>
              <tr className="border-b border-default-150 font-bold text-muted-foreground bg-default-50/70">
                <th className="py-2.5 px-3">الوارث</th>
                <th className="py-2.5 px-3 text-center">العدد</th>
                <th className="py-2.5 px-3 text-center">الفرض / السهم</th>
                <th className="py-2.5 px-3 text-center">النسبة</th>
                <th className="py-2.5 px-3 text-center">نصيب الفرد</th>
                <th className="py-2.5 px-3 text-left">إجمالي الفئة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default-100">
              {heirsDistributions.map((dist, idx) => {
                const indPercentage = dist.individual_percentage ?? dist.percentage;
                return (
                  <tr key={idx} className="hover:bg-default-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span>{dist.relationship_display}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold text-muted-foreground">
                      {dist.count}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-black text-amber-700">
                      {dist.individual_share_fraction || dist.share_fraction}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-foreground">
                      %{indPercentage.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-600">
                      {formatCurrency(dist.per_person_value)}
                    </td>
                    <td className="py-2.5 px-3 text-left font-mono font-extrabold text-foreground">
                      {formatCurrency(dist.total_value)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Wills Table if any */}
      {willsDistributions.length > 0 && (
        <Card className="rounded-2xl border border-default-200 bg-white p-5 text-right shadow-xs overflow-hidden">
          <h3 className="text-xs font-black flex items-center gap-1.5 mb-3 text-foreground">
            <FileText size={15} className="text-purple-600" />
            <span>الوصايا الشرعية المنفذة</span>
          </h3>

          <div className="overflow-x-auto border border-default-100 rounded-xl">
            <table className="w-full border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-default-150 font-bold text-muted-foreground bg-default-50/70">
                  <th className="py-2.5 px-3">الوصية</th>
                  <th className="py-2.5 px-3 text-center">نصيب الوصية</th>
                  <th className="py-2.5 px-3 text-center">النسبة</th>
                  <th className="py-2.5 px-3 text-left">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-100">
                {willsDistributions.map((dist, idx) => (
                  <tr key={idx} className="hover:bg-default-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-foreground">
                      {dist.relationship_display}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-black text-purple-700">
                      {dist.share_fraction}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-foreground">
                      %{dist.percentage.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-left font-mono font-extrabold text-foreground">
                      {formatCurrency(dist.total_value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detailed Calculation Steps Trigger Card */}
      <div
        onClick={() => setIsDrawerOpen(true)}
        className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50/80 to-amber-100/30 hover:bg-amber-100/50 p-4 transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ScrollText size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-foreground">
                خطوات الحل والشرح الفقهي التفصيلي للمسألة
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200/70 text-amber-900 rounded-md font-mono">
                {stepsCount} مراحل
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              عرض الأدلة الشرعية، قواعد الحجب، تأصيل الفروض وتصحيح السهام
            </p>
          </div>
        </div>

        <Button
          onPress={() => setIsDrawerOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 h-8 rounded-xl flex items-center gap-1 shrink-0 self-end sm:self-auto"
        >
          <span>عرض الخطوات</span>
          <ChevronLeft size={14} />
        </Button>
      </div>

      <DetailedCalculationDrawer
        result={result}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />

      {/* Action Buttons: Share, PDF, Excel, Back & Reset */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <Button
          variant="outline"
          onPress={copyShareLink}
          className="font-bold border-default-300 rounded-xl h-11 text-xs flex items-center justify-center gap-1.5"
        >
          <Share2 size={15} />
          <span>{copied ? 'تم نسخ الرابط!' : 'مشاركة الرابط'}</span>
        </Button>

        <Button
          onPress={handlePreviewPdf}
          isDisabled={loadingPdf}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl h-11 text-xs flex items-center justify-center gap-1.5 shadow-xs"
        >
          <FileText size={15} />
          <span>{loadingPdf ? 'جاري التجهيز...' : 'معاينة PDF'}</span>
        </Button>

        <Button
          onPress={handleExportExcel}
          isDisabled={exportingExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 text-xs flex items-center justify-center gap-1.5 shadow-xs"
        >
          <BarChart3 size={15} />
          <span>{exportingExcel ? 'جاري التصدير...' : 'تصدير Excel'}</span>
        </Button>
      </div>
    </motion.div>
  );
}
