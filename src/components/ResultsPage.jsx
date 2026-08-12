import React, { useState } from 'react';
import { Card, Separator, Button } from '@heroui/react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router';
import {
  Scale, ShieldAlert, Award, FileText, CheckCircle,
  TrendingDown, TrendingUp, Users, Minus,
  ScrollText, AlertTriangle, Banknote, ArrowRight, PieChart as PieIcon, BarChart3, Share2,
  ChevronLeft, Sparkles, BookOpenCheck, ArrowLeft
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { serializeState, deserializeState, renderExplanationWithQuranFont } from '../utils';
import { InheritanceCalculator } from '../engine';
import { pdf } from '@react-pdf/renderer';
import PdfReport from './PdfReport';
import { exportExcelReport } from './ExcelReport';
import DetailedCalculationDrawer from './DetailedCalculationDrawer';

function formatCurrency(value) {
  return (value ?? 0).toLocaleString('ar-MA', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' د.م.';
}

function BreakdownStep({ icon: Icon, iconColor, label, value, valueColor = 'text-foreground', operation, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-3.5 px-4 rounded-xl transition-colors ${highlight ? 'bg-emerald-50/70 border border-emerald-200/60' : 'bg-default-50 border border-default-100'}`}>
      <div className="flex items-center gap-2.5">
        {operation && (
          <span className={`text-xs font-black w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${operation === '-' ? 'bg-red-100/70 text-red-650' : 'bg-emerald-100/70 text-emerald-650'}`}>
            {operation}
          </span>
        )}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconColor || 'bg-default-100 text-muted-foreground'}`}>
          <Icon size={15} />
        </div>
        <span className="text-xs font-bold text-muted-foreground">{label}</span>
      </div>
      <span className={`text-sm font-extrabold font-mono ${valueColor}`}>{formatCurrency(value)}</span>
    </div>
  );
}

function getCommonDenominatorFractions(distributions) {
  const active = distributions.filter(d => d.percentage > 0);
  if (active.length === 0) return [];

  const parsed = active.map(d => {
    const parts = (d.individual_share_fraction || d.share_fraction).split('/');
    const num = parseInt(parts[0]) || 0;
    const den = parts[1] ? parseInt(parts[1]) : 1;

    const classParts = d.share_fraction.split('/');
    const classNum = parseInt(classParts[0]) || 0;
    const classDen = classParts[1] ? parseInt(classParts[1]) : 1;

    return { num, den, classNum, classDen, dist: d };
  });

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const lcm = (a, b) => (a * b) / gcd(a, b);

  let commonDen = 1;
  for (const p of parsed) {
    if (p.den > 0) {
      commonDen = lcm(commonDen, p.den);
    }
    if (p.classDen > 0) {
      commonDen = lcm(commonDen, p.classDen);
    }
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

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  let result = location.state?.result;

  // Restore state from URL query param if result is not passed in location state (e.g. page refresh)
  if (!result) {
    const params = new URLSearchParams(window.location.search);
    const sharedStateStr = params.get('s');
    if (sharedStateStr) {
      const state = deserializeState(sharedStateStr);
      if (state) {
        const heirsList = Object.entries(state.heirs || {}).map(([relationship, count]) => ({
          relationship,
          count
        }));
        if (heirsList.length > 0) {
          const caseData = {
            id: Date.now(),
            name: state.deceasedName || (state.deceasedGender === 'male' ? 'المتوفى' : 'المتوفاة'),
            gender: state.deceasedGender,
            total_estate_value: parseFloat(state.totalEstate) || 0,
            funeral_expenses: 0,
            debts: parseFloat(state.debts) || 0,
            heirs: heirsList,
            wills: state.wills || [],
            heirsApprovedExcess: state.heirsApprovedExcess || false,
            mandatoryBequests: state.mandatoryBequests || []
          };
          const calculator = new InheritanceCalculator(caseData);
          result = calculator.calculate();
        }
      }
    }
  }

  const handleBack = () => {
    const params = new URLSearchParams(window.location.search);
    const sharedStateStr = params.get('s');
    const fromPath = location.state?.from || '/';
    if (sharedStateStr) {
      navigate(`${fromPath}?s=${sharedStateStr}`);
    } else {
      navigate(fromPath);
    }
  };

  const getShareLink = () => {
    const params = new URLSearchParams(window.location.search);
    const sharedStateStr = params.get('s');
    if (sharedStateStr) {
      return window.location.href;
    }
    if (!result) return window.location.origin;

    const heirs = {};
    for (const dist of (result.distributions || [])) {
      if (dist.share_fraction !== "0" && !dist.relationship.startsWith('MANDATORY_WILL_') && !dist.relationship.startsWith('WILL_')) {
        heirs[dist.relationship] = dist.count;
      }
    }
    const wills = (result.wills_executed || []).map(w => ({
      name: w.name,
      value: w.original_value,
      valueType: w.type
    }));
    const state = {
      deceasedName: result.deceased_name,
      deceasedGender: result.deceased_gender || (heirs['HUSBAND'] ? 'female' : 'male'),
      totalEstate: result.total_estate,
      debts: result.deductions,
      heirs,
      wills,
      heirsApprovedExcess: !result.is_wills_scaled,
      mandatoryBequests: result.mandatory_bequests || []
    };
    const code = serializeState(state);
    return `${window.location.origin}/results?s=${code}`;
  };

  const copyShareLink = () => {
    const url = getShareLink();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        fallbackCopyShareLink(url);
      });
    } else {
      fallbackCopyShareLink(url);
    }
  };

  const fallbackCopyShareLink = (url) => {
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
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const handlePreviewPdf = async () => {
    if (loadingPdf) return;
    setLoadingPdf(true);
    try {
      const blob = await pdf(<PdfReport result={result} />).toBlob();
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
      console.error('Failed to export Excel report', e);
    } finally {
      setExportingExcel(false);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4" dir="rtl">
        <Card className="max-w-md w-full text-center p-8 border border-default-200 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5 border border-amber-250">
            <Scale size={32} className="text-amber-600" />
          </div>
          <h3 className="text-lg font-black text-foreground mb-2">لا توجد نتائج لعرضها</h3>
          <p className="text-sm text-muted-foreground mb-6">يرجى ملء تفاصيل التركة والورثة في الصفحة الرئيسية لحساب التوزيع أولاً.</p>
          <Button
            color="warning"
            onPress={() => navigate('/')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
            fullWidth
          >
            الذهاب للآلة الحاسبة
          </Button>
        </Card>
      </div>
    );
  }

  const displayNetEstate = result.original_net_estate - (result.total_wills_cost || 0);

  // Common denominator scaled list
  const allFormatted = getCommonDenominatorFractions(result.distributions || []);
  const heirsDistributions = allFormatted.filter(d => !d.relationship.startsWith('WILL_'));
  const willsDistributions = allFormatted.filter(d => d.relationship.startsWith('WILL_'));
  const blockedHeirs = (result.distributions || []).filter(d => d.percentage === 0);

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
  const hasRadd = !result.is_aul && (result.distributions || []).some(d => d.why && d.why.includes('ردت المسألة'));

  return (
    <div className="min-h-screen bg-background pb-16 pt-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto mb-8 flex items-center gap-4 bg-white/90 p-4 sm:p-5 rounded-3xl border border-default-150/40 backdrop-blur-md shadow-xs"
      >
        {location.state?.from && (
          <Button
            variant="outline"
            isIconOnly
            onPress={handleBack}
            className="rounded-2xl border-default-250 shrink-0 bg-white shadow-3xs hover:bg-default-50 transition-colors"
            aria-label="الرجوع"
          >
            <ArrowRight size={18} />
          </Button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <Scale size={22} className="text-amber-600 shrink-0" /> تفاصيل توزيع التركة
          </h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">توزيع شرعي مبني على الشريعة الإسلامية وقانون الأسرة</p>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Side / First Column: Unified Contents */}
        <div className="lg:col-span-8 space-y-6">
          {result.is_aul && (
            <div className="flex items-start gap-3 p-4 bg-amber-50/70 border border-amber-200 text-amber-950 rounded-2xl text-xs leading-relaxed">
              <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-800">تنبيه بالعول:</strong> عالت المسألة نظراً لزيادة السهام المفروضة. تم تعديل نصيب كل وارث بنسبة عادلة شرعاً (أصل المسألة الجديد: {result.aul_sum_fractions}).
              </div>
            </div>
          )}

          {/* Charts Card - Shown First */}
          <Card className="rounded-3xl border border-default-200 bg-white p-6">
            <h3 className="text-sm font-black flex items-center gap-2 mb-6 text-foreground">
              <PieIcon size={16} className="text-amber-600" /> التحليل البياني وتوزيع التركة
            </h3>

            {hasWillsOrDebts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chart 1: Total Estate Allocation */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-muted-foreground mb-3 text-center">تقسيم التركة الإجمالية</span>
                  <div className="relative h-60 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={estateAllocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius="48%"
                          outerRadius="72%"
                          paddingAngle={estateAllocationData.length > 1 ? 4 : 0}
                          dataKey="value"
                        >
                          {estateAllocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={ALLOC_COLORS[index % ALLOC_COLORS.length]} stroke={estateAllocationData.length > 1 ? "#ffffff" : "none"} strokeWidth={estateAllocationData.length > 1 ? 2 : 0} className="focus:outline-hidden" />
                          ))}
                        </Pie>
                        <Tooltip
                          wrapperStyle={{ zIndex: 1000 }}
                          formatter={(value) => `${value.toLocaleString()} د.م.`}
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontFamily: 'Tajawal', textAlign: 'right' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center bg-white/95 w-22 h-22 rounded-full border border-default-100 z-0">
                      <span className="text-[7px] font-black text-muted-foreground uppercase">إجمالي التركة</span>
                      <span className="text-[10px] font-extrabold text-foreground font-mono mt-0.5">{formatCurrency(result.total_estate)}</span>
                    </div>
                  </div>

                  {/* Custom HTML Legend */}
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-4 max-w-xs">
                    {estateAllocationData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground/80">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ALLOC_COLORS[index % ALLOC_COLORS.length] }} />
                        <span>{entry.name}</span>
                        <span className="text-muted-foreground font-mono text-[9px]">(%{entry.percentage.toFixed(1)})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 2: Family Shares Distribution */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-muted-foreground mb-3 text-center">توزيع أنصبة الورثة (العائلة)</span>
                  <div className="relative h-60 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={familyPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius="48%"
                          outerRadius="72%"
                          paddingAngle={familyPieData.length > 1 ? 4 : 0}
                          dataKey="value"
                        >
                          {familyPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={familyPieData.length > 1 ? "#ffffff" : "none"} strokeWidth={familyPieData.length > 1 ? 2 : 0} className="focus:outline-hidden" />
                          ))}
                        </Pie>
                        <Tooltip
                          wrapperStyle={{ zIndex: 1000 }}
                          formatter={(value) => `${value.toLocaleString()} د.م.`}
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontFamily: 'Tajawal', textAlign: 'right' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center bg-white/95 w-22 h-22 rounded-full border border-default-100 z-0">
                      <span className="text-[7px] font-black text-muted-foreground uppercase">صافي التركة للورثة</span>
                      <span className="text-[10px] font-extrabold text-amber-700 font-mono mt-0.5">{formatCurrency(displayNetEstate)}</span>
                    </div>
                  </div>

                  {/* Custom HTML Legend */}
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-4 max-w-xs">
                    {familyPieData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground/80">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span>{entry.name}</span>
                        <span className="text-muted-foreground font-mono text-[9px]">(%{entry.percentage.toFixed(1)})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Center only Family Shares Chart if no wills and no debts */
              <div className="w-full max-w-md mx-auto flex flex-col items-center">
                <span className="text-xs font-black text-muted-foreground mb-3 text-center">توزيع أنصبة الورثة (العائلة)</span>
                <div className="relative h-60 w-full max-w-65 mx-auto flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={familyPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="48%"
                        outerRadius="72%"
                        paddingAngle={familyPieData.length > 1 ? 4 : 0}
                        dataKey="value"
                      >
                        {familyPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={familyPieData.length > 1 ? "#ffffff" : "none"} strokeWidth={familyPieData.length > 1 ? 2 : 0} className="focus:outline-hidden" />
                        ))}
                      </Pie>
                      <Tooltip
                        wrapperStyle={{ zIndex: 1000 }}
                        formatter={(value) => `${value.toLocaleString()} د.م.`}
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontFamily: 'Tajawal', textAlign: 'right' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center bg-white/95 w-24 h-24 rounded-full border border-default-100 z-0">
                    <span className="text-[7px] font-black text-muted-foreground uppercase">صافي التركة للورثة</span>
                    <span className="text-[11px] font-extrabold text-amber-700 font-mono mt-0.5">{formatCurrency(displayNetEstate)}</span>
                  </div>
                </div>

                {/* Custom HTML Legend */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-5 max-w-md">
                  {familyPieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{entry.name}</span>
                      <span className="text-muted-foreground font-mono text-[10px]">(%{entry.percentage.toFixed(1)})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Table Card 1: Heirs (أنصبة الورثة المستحقين) */}
          <Card className="rounded-3xl border border-default-200 bg-white p-6 overflow-hidden">
            <h3 className="text-sm font-black flex items-center gap-2 mb-4 text-foreground">
              <Users size={16} className="text-amber-600" /> أنصبة الورثة المستحقين
            </h3>
            <div className="overflow-x-auto border border-default-100 rounded-2xl">
              <table className="w-full border-collapse text-right">
                <thead>
                  <tr className="border-b border-default-150 text-xs font-bold text-muted-foreground bg-default-50/50">
                    <th className="py-3.5 px-4 text-right">الوارث</th>
                    <th className="py-3.5 px-4 text-center">عدد الأفراد</th>
                    <th className="py-3.5 px-4 text-center">نصيب الفرد</th>
                    <th className="py-3.5 px-4 text-center">نصيب الفرد مئوياً</th>
                    <th className="py-3.5 px-4 text-center">نصيب الفرد (مال)</th>
                    <th className="py-3.5 px-4 text-left">إجمالي الفئة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-100">
                  {heirsDistributions.map((dist, idx) => {
                    const indPercentage = dist.individual_percentage ?? dist.percentage;
                    return (
                      <tr key={idx} className="hover:bg-default-50/40 transition-colors duration-150">
                        <td className="py-3.5 px-4 text-right font-bold text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                            <span>{dist.relationship_display}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center text-sm font-semibold text-muted-foreground font-mono">
                          {dist.count}
                        </td>
                        <td className="py-3.5 px-4 text-center text-sm font-black text-amber-700 font-mono">
                          {dist.individual_share_fraction || dist.share_fraction}
                        </td>
                        <td className="py-3.5 px-4 text-center text-sm font-bold text-foreground font-mono">
                          %{indPercentage.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-center text-sm font-bold text-amber-600 font-mono">
                          {formatCurrency(dist.per_person_value)}
                        </td>
                        <td className="py-3.5 px-4 text-left text-sm font-extrabold text-foreground font-mono">
                          {formatCurrency(dist.total_value)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Table Card 2: Wills (الوصايا الشرعية المنفذة) */}
          {willsDistributions.length > 0 && (
            <Card className="rounded-3xl border border-default-200 bg-white p-6 overflow-hidden">
              <h3 className="text-sm font-black flex items-center gap-2 mb-4 text-foreground">
                <FileText size={16} className="text-purple-600" /> الوصايا الشرعية المنفذة
              </h3>

              <div className="overflow-x-auto border border-default-100 rounded-2xl">
                <table className="w-full border-collapse text-right">
                  <thead>
                    <tr className="border-b border-default-150 text-xs font-bold text-muted-foreground bg-default-50/50">
                      <th className="py-3.5 px-4 text-right">الوصية</th>
                      <th className="py-3.5 px-4 text-center">نصيب الوصية</th>
                      <th className="py-3.5 px-4 text-center">النسبة المئوية</th>
                      <th className="py-3.5 px-4 text-left">من المال</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-default-100">
                    {willsDistributions.map((dist, idx) => (
                      <tr key={idx} className="hover:bg-default-50/40 transition-colors duration-150">
                        <td className="py-3.5 px-4 text-right font-bold text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: '#8b5cf6' }} />
                            <span>{dist.relationship_display}</span>
                          </div>
                        </td>

                        <td className="py-3.5 text-amber-700 px-4 text-center text-sm font-black text-purple-750 font-mono">
                          {dist.share_fraction}
                        </td>
                        <td className="py-3.5 px-4 text-center text-sm font-bold text-foreground font-mono">
                          %{dist.percentage.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-left text-sm font-extrabold text-foreground font-mono">
                          {formatCurrency(dist.total_value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Simple & Flat Calculation Steps Trigger Card */}
          <div
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-2xl border border-default-200 bg-white hover:bg-default-50/80 p-4 sm:p-5 transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full text-right"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
                <ScrollText size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">
                    خطوات الحل والشرح التفصيلي للمسألة
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-default-100 text-muted-foreground rounded-md">
                    {stepsCount} مراحل
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  عرض الأدلة الفقهية، قواعد الحجب، تأصيل الفروض، وتصحيح الأنصبة
                </p>
              </div>
            </div>

            <Button
              onPress={() => setIsDrawerOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 h-9 rounded-xl flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
            >
              <span>عرض الخطوات</span>
              <ChevronLeft size={16} />
            </Button>
          </div>

          <DetailedCalculationDrawer
            result={result}
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          />
        </div>

        {/* Left Side / Second Column: Estate Breakdown Summary (Sticky Sidebar) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky top-6">
          {/* Estate Summary Breakdown Card */}
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card className="rounded-3xl border border-default-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-default-100">
                <span className="text-xs font-black text-muted-foreground uppercase">
                  {result.deceased_gender === 'female' ? 'المتوفاة' : 'المتوفى'}
                </span>
                <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-lg">
                  {result.deceased_name}
                </span>
              </div>

              <div className="space-y-2">
                <BreakdownStep
                  icon={Banknote}
                  iconColor="bg-default-100 text-foreground"
                  label="إجمالي التركة"
                  value={result.total_estate}
                  valueColor="text-foreground"
                />

                {result.deductions > 0 && (
                  <BreakdownStep
                    icon={TrendingDown}
                    iconColor="bg-red-50 text-red-500"
                    label="الديون والالتزامات"
                    value={result.deductions}
                    valueColor="text-red-600"
                    operation="-"
                  />
                )}

                {result.total_wills_cost > 0 && (
                  <BreakdownStep
                    icon={ScrollText}
                    iconColor="bg-purple-50 text-purple-500"
                    label="الوصايا المنفذة"
                    value={result.total_wills_cost}
                    valueColor="text-purple-600"
                    operation="-"
                  />
                )}

                <div className="pt-1 mt-1">
                  <Separator className="mb-2" />
                  <BreakdownStep
                    icon={TrendingUp}
                    iconColor="bg-emerald-50 text-emerald-600"
                    label="صافي التركة للورثة"
                    value={displayNetEstate}
                    valueColor="text-emerald-700"
                    highlight
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Share and Export Actions Card */}
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <Card className="rounded-3xl border border-default-200 bg-white p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-xs font-black text-muted-foreground uppercase mb-0.5">مشاركة وتصدير</h3>
                <p className="text-[10px] text-muted-foreground">احفظ المسألة أو شارك التقرير الشرعي مع العائلة</p>
              </div>

              <div className="space-y-2.5">
                <Button
                  variant="outline"
                  onPress={copyShareLink}
                  className="w-full font-bold transition-all duration-200 flex items-center justify-center gap-2 h-11"
                >
                  <Share2 size={16} className="shrink-0" />
                  <span>{copied ? 'تم نسخ الرابط!' : 'نسخ رابط المسألة'}</span>
                </Button>

                <Button
                  onPress={handlePreviewPdf}
                  isDisabled={loadingPdf}
                  className="w-full font-bold text-white bg-amber-500 hover:bg-amber-600  flex items-center justify-center gap-2 transition-all duration-200 h-11"
                >
                  <FileText size={16} className="shrink-0" />
                  <span>{loadingPdf ? 'جاري تجهيز التقرير...' : 'معاينة تقرير PDF'}</span>
                </Button>

                <Button
                  onPress={handleExportExcel}
                  isDisabled={exportingExcel}
                  className="w-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all duration-200 h-11"
                >
                  <BarChart3 size={16} className="shrink-0" />
                  <span>{exportingExcel ? 'جاري تصدير Excel...' : 'تصدير إلى Excel'}</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
