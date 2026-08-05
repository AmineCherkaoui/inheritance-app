import React from 'react';
import { Card, Separator } from '@heroui/react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale, ShieldAlert, Award, FileText, CheckCircle,
  TrendingDown, TrendingUp, Coins, Users, ArrowDown,
  Minus, ScrollText, AlertTriangle, User, Banknote
} from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
};

export const renderExplanationWithQuranFont = (text) => {
  if (!text) return null;
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const verse = part.slice(1, -1);
      return (
        <span key={index} className="font-quran mx-0.5">
          [{verse}]
        </span>
      );
    }
    return part;
  });
};

function formatCurrency(value) {
  return (value ?? 0).toLocaleString('ar-MA', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function BreakdownStep({ icon: Icon, iconColor, label, value, valueColor = 'text-foreground', operation, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-2.5 px-3.5 rounded-xl transition-colors ${highlight ? 'bg-emerald-50/70 border border-emerald-200/60' : ''}`}>
      <div className="flex items-center gap-2.5">
        {operation && (
          <span className={`text-[10px] font-black w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${operation === '-' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-600'}`}>
            {operation}
          </span>
        )}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconColor || 'bg-default-100 text-muted-foreground'}`}>
          <Icon size={14} />
        </div>
        <span className="text-xs font-bold text-muted-foreground">{label}</span>
      </div>
      <span className={`text-sm font-extrabold font-mono ${valueColor}`}>{formatCurrency(value)}</span>
    </div>
  );
}

function HeirRow({ dist, index, totalCount }) {
  const barWidth = Math.min(Math.max(dist.percentage, 2), 100);

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="border border-default-150 bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-sm transition-shadow duration-200">
        {/* Progress bar background */}
        <div className="relative">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              background: `linear-gradient(90deg, #d97706 0%, #d97706 ${barWidth}%, transparent ${barWidth}%)`
            }}
          />

          <div className="relative p-4 space-y-3">
            {/* Top row: name + fraction + percentage */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/40 flex items-center justify-center">
                  <User size={14} className="text-amber-700" />
                </div>
                <div>
                  <span className="block text-sm font-black text-foreground leading-tight">
                    {dist.relationship_display}
                  </span>
                  {dist.count > 1 && (
                    <span className="text-[10px] font-bold text-muted-foreground">
                      العدد: {dist.count}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-amber-50/80 border border-amber-200/40 text-amber-800 text-[11px] font-black font-mono">
                  {dist.share_fraction}
                </span>
                <span className="text-base font-black text-foreground tabular-nums">
                  {dist.percentage}%
                </span>
              </div>
            </div>

            {/* Percentage bar */}
            <div className="w-full h-1.5 bg-default-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #d97706, #f59e0b)' }}
              />
            </div>

            {/* Values */}
            <div className={`grid gap-2 ${dist.count > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div className="bg-default-50 rounded-xl p-2.5 border border-default-100">
                <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  {dist.count > 1 ? 'الإجمالي' : 'النصيب'}
                </span>
                <span className="text-sm font-black text-foreground font-mono">
                  {formatCurrency(dist.total_value)}
                </span>
              </div>
              {dist.count > 1 && (
                <div className="bg-default-50 rounded-xl p-2.5 border border-default-100">
                  <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">نصيب الفرد</span>
                  <span className="text-sm font-black text-foreground font-mono">
                    {formatCurrency(dist.per_person_value)}
                  </span>
                </div>
              )}
            </div>

            {/* Why section */}
            {dist.why && (
              <div className="flex gap-2 items-start text-[11px] text-muted-foreground bg-default-50/70 p-2.5 rounded-xl border border-default-50">
                <Award size={13} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{renderExplanationWithQuranFont(dist.why)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WillRow({ w, isScaled, index }) {
  const wasReduced = w.requested_fraction_share !== w.executed_fraction_share;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
    >
      <div className="bg-white rounded-2xl p-4 space-y-3 border border-default-150 shadow-2xs">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/40 flex items-center justify-center">
              <ScrollText size={14} className="text-purple-700" />
            </div>
            <span className="text-sm font-black text-foreground">{w.name}</span>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground bg-default-100 px-2.5 py-1 rounded-lg">
            الكسر المطلوب: {w.original_value}
          </span>
        </div>

        {/* Values comparison */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-default-50 p-3 rounded-xl border border-default-100">
            <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">المطلوب</span>
            <div className="text-sm font-black text-foreground font-mono">
              {formatCurrency(w.requested_value)}
            </div>
            <span className="text-[10px] font-bold text-muted-foreground font-mono">{w.requested_fraction_share}</span>
          </div>
          <div className={`p-3 rounded-xl border ${wasReduced ? 'bg-orange-50/50 border-orange-200/50' : 'bg-emerald-50/50 border-emerald-200/50'}`}>
            <span className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${wasReduced ? 'text-orange-600' : 'text-emerald-600'}`}>المنفذ</span>
            <div className={`text-sm font-black font-mono flex items-center gap-1 ${wasReduced ? 'text-orange-700' : 'text-emerald-700'}`}>
              {!wasReduced && <CheckCircle size={11} className="shrink-0" />}
              {formatCurrency(w.executed_value)}
            </div>
            <span className={`text-[10px] font-bold font-mono ${wasReduced ? 'text-orange-500' : 'text-emerald-500'}`}>
              {w.executed_fraction_share}
            </span>
          </div>
        </div>

        {/* Reduction indicator */}
        {wasReduced && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 bg-orange-50/60 px-3 py-1.5 rounded-lg border border-orange-200/40">
            <TrendingDown size={11} className="shrink-0" />
            <span>تم تخفيض هذه الوصية من {w.requested_fraction_share} إلى {w.executed_fraction_share} بموجب قاعدة المحاصة</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getCommonDenominatorFractions(distributions) {
  const active = distributions.filter(d => d.percentage > 0);
  if (active.length === 0) return [];

  const parsed = active.map(d => {
    const parts = d.share_fraction.split('/');
    const num = parseInt(parts[0]) || 0;
    const den = parts[1] ? parseInt(parts[1]) : 1;
    return { num, den, dist: d };
  });

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const lcm = (a, b) => (a * b) / gcd(a, b);

  let commonDen = 1;
  for (const p of parsed) {
    if (p.den > 0) {
      commonDen = lcm(commonDen, p.den);
    }
  }

  return parsed.map(p => {
    if (p.num === 0) {
      return { ...p.dist, share_fraction: '0' };
    }
    const scale = commonDen / p.den;
    const scaledNum = p.num * scale;
    return {
      ...p.dist,
      share_fraction: `${scaledNum}/${commonDen}`
    };
  });
}

export default function ResultsDisplay({ result }) {
  if (!result) {
    return null;
  }

  const heirsDistributions = getCommonDenominatorFractions(result.distributions || []);
  const blockedHeirs = (result.distributions || []).filter(d => d.percentage === 0);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className="space-y-5"
    >
      {/* ─── Estate Breakdown ─── */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="p-5 pb-3 border-b border-border">
            <h3 className="text-base font-black flex items-center gap-2 tracking-tight text-foreground">
              <Coins size={18} className="text-amber-600" /> ملخص التركة
            </h3>
          </div>

          <div className="p-4 space-y-0.5">
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
                operation="−"
              />
            )}

            {result.total_wills_cost > 0 && (
              <BreakdownStep
                icon={ScrollText}
                iconColor="bg-purple-50 text-purple-500"
                label="الوصايا المنفذة"
                value={result.total_wills_cost}
                valueColor="text-purple-600"
                operation="−"
              />
            )}

            <div className="pt-1 mt-1">
              <Separator className="mb-2" />
              <BreakdownStep
                icon={TrendingUp}
                iconColor="bg-emerald-50 text-emerald-600"
                label="صافي التركة للورثة"
                value={result.net_estate}
                valueColor="text-emerald-700"
                highlight
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ─── Wills Section ─── */}
      {result.wills_executed && result.wills_executed.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="p-5 pb-3 border-b border-border">
              <h3 className="text-base font-black flex items-center gap-2 tracking-tight text-foreground">
                <FileText size={18} className="text-purple-600" /> تنفيذ الوصايا الشرعية
              </h3>
            </div>

            <div className="p-4 space-y-3">
              {/* Explanation banner */}
              {result.wills_explanation && (
                <div className={`flex items-start gap-2.5 p-3.5 rounded-xl text-[11px] leading-relaxed border ${result.is_wills_scaled
                  ? 'bg-orange-50/60 border-orange-200/50 text-orange-800'
                  : 'bg-emerald-50/60 border-emerald-200/50 text-emerald-800'
                  }`}>
                  {result.is_wills_scaled
                    ? <AlertTriangle size={14} className="text-orange-500 shrink-0 mt-0.5" />
                    : <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  }
                  <span className="font-bold">{result.wills_explanation}</span>
                </div>
              )}

              {result.wills_executed.map((w, idx) => (
                <WillRow key={idx} w={w} isScaled={result.is_wills_scaled} index={idx} />
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* ─── Aul Warning ─── */}
      {result.is_aul && (
        <motion.div variants={itemVariants}>
          <div className="flex items-start gap-3 p-4 bg-amber-50/70 border border-amber-200/60 text-amber-950 rounded-2xl text-xs leading-relaxed">
            <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-800">تنبيه بالعول:</strong> عالت المسألة نظراً لزيادة مجموع السهام المفروضة عن أصل المسألة. تم تعديل نصيب كل وارث بنسبة عادلة شرعاً (مجموع السهام: {result.aul_sum_fractions}).
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Heirs Distribution ─── */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="p-5 pb-3 border-b border-border">
            <h3 className="text-base font-black flex items-center gap-2 tracking-tight text-foreground">
              <Users size={18} className="text-amber-600" /> أنصبة الورثة
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              توزيع صافي التركة ({formatCurrency(result.net_estate)}) على الورثة حسب الأحكام الشرعية
            </p>
          </div>

          <div className="p-4 space-y-4">
            <div className="overflow-x-auto border border-default-100 rounded-2xl">
              <table className="w-full border-collapse text-right">
                <thead>
                  <tr className="border-b border-default-100 text-xs font-bold text-muted-foreground bg-default-50/50">
                    <th className="py-3.5 px-4 text-right">الوارث / المستفيد</th>
                    <th className="py-3.5 px-4 text-center">عدد الأفراد</th>
                    <th className="py-3.5 px-4 text-center">نصيب الفرد</th>
                    <th className="py-3.5 px-4 text-center">النسبة المئوية</th>
                    <th className="py-3.5 px-4 text-left">من المال</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-100">
                  {heirsDistributions.map((dist, idx) => (
                    <tr key={idx} className="hover:bg-default-50/40 transition-colors duration-150">
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">
                        {dist.relationship_display}
                      </td>
                      <td className="py-3.5 px-4 text-center text-sm font-semibold text-muted-foreground font-mono">
                        {dist.count}
                      </td>
                      <td className="py-3.5 px-4 text-center text-sm font-black text-amber-700 font-mono">
                        {dist.share_fraction}
                      </td>
                      <td className="py-3.5 px-4 text-center text-sm font-bold text-foreground font-mono">
                        %{dist.percentage.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-left text-sm font-extrabold text-foreground font-mono">
                        {formatCurrency(dist.total_value)} د.م.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Explanations section */}
            <div className="space-y-2 pt-2 border-t border-default-100">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                تفاصيل وتوجيه الأنصبة
              </span>
              {heirsDistributions.map((dist, idx) => (
                <div key={idx} className="bg-default-50/50 p-3 rounded-xl border border-default-100/50 flex gap-2.5 items-start">
                  <Award size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-foreground mb-0.5">{dist.relationship_display}</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{dist.why ? renderExplanationWithQuranFont(dist.why) : 'تم التخصيص حسب الأنصبة الشرعية.'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Blocked heirs */}
            {blockedHeirs.length > 0 && (
              <div className="mt-2 pt-3 border-t border-default-100">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  ورثة محجوبون
                </span>
                {blockedHeirs.map((dist, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 py-2 px-3 rounded-xl text-[11px] text-muted-foreground">
                    <Minus size={12} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground/60">{dist.relationship_display}</span>
                      {dist.count > 1 && <span className="text-muted-foreground mr-1">({dist.count})</span>}
                      {dist.why && <span className="mr-1">— {renderExplanationWithQuranFont(dist.why)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
