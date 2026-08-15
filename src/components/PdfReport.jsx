import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register Tajawal Font from local public directory
Font.register({
  family: 'Tajawal',
  fonts: [
    { src: '/fonts/Tajawal-Regular.ttf' },
    { src: '/fonts/Tajawal-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/Tajawal-Bold.ttf', fontWeight: 'bold' }
  ]
});

// Helper to compute fractions with a common denominator (LCM)
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
      return { ...p.dist, formatted_individual_fraction: '0', formatted_fraction: '0' };
    }
    const scale = commonDen / p.den;
    const scaledNum = p.num * scale;

    const classScale = commonDen / p.classDen;
    const classScaledNum = p.classNum * classScale;

    return {
      ...p.dist,
      formatted_individual_fraction: `${scaledNum}/${commonDen}`,
      formatted_fraction: `${classScaledNum}/${commonDen}`
    };
  });
}

// PDF Styling
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Tajawal',
    padding: 30,
    fontSize: 9,
    backgroundColor: '#FBFBFA',
    color: '#1A1A19',
    direction: 'rtl'
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#d97706',
    paddingBottom: 10,
    marginBottom: 15,
    textAlign: 'right'
  },
  title: {
    fontFamily: 'Tajawal',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3,
    textAlign: 'right'
  },
  subtitle: {
    fontFamily: 'Tajawal',
    fontSize: 9,
    color: '#d97706',
    fontWeight: 'bold',
    textAlign: 'right'
  },
  section: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  sectionTitle: {
    fontFamily: 'Tajawal',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#b5893d',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 3,
    marginBottom: 8,
    textAlign: 'right'
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc'
  },
  label: {
    fontFamily: 'Tajawal',
    color: '#64748b',
    textAlign: 'right',
    fontSize: 9
  },
  value: {
    fontFamily: 'Tajawal',
    fontWeight: 500,
    color: '#0f172a',
    textAlign: 'left'
  },
  boldValue: {
    fontFamily: 'Tajawal',
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 11,
    textAlign: 'left'
  },

  // Table Styling
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 5,
    marginBottom: 5
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: '#b5893d',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1'
  },
  tableHeaderCell: {
    fontFamily: 'Tajawal',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row-reverse',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center'
  },
  tableCell: {
    fontFamily: 'Tajawal',
    fontSize: 9,
    color: '#0f172a',
    textAlign: 'center'
  },
  colHeir: { width: '25%', textAlign: 'right' },
  colCount: { width: '10%' },
  colFraction: { width: '13%' },
  colPercent: { width: '15%' },
  colIndValue: { width: '18%', textAlign: 'left' },
  colTotalValue: { width: '19%', textAlign: 'left' },
  colValue: { width: '25%', textAlign: 'left' },

  explanationCard: {
    backgroundColor: '#fafaf9',
    borderRadius: 4,
    padding: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#f5f5f4'
  },
  explanationName: {
    fontFamily: 'Tajawal',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'right',
    marginBottom: 2
  },
  whyText: {
    fontFamily: 'Tajawal',
    fontSize: 8,
    color: '#475569',
    textAlign: 'right'
  },
  alert: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fef3c7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    textAlign: 'right'
  },
  alertText: {
    fontFamily: 'Tajawal',
    color: '#78350f',
    fontSize: 9,
    lineHeight: 1.3,
    textAlign: 'right'
  }
});

function formatCurrency(val) {
  return Number(val).toLocaleString('ar-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' د.م.';
}

// Helper functions identical to DetailedCalculationDrawer
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

export default function PdfReport({ result, shareUrl, qrCodeDataUrl }) {
  const allFormatted = getCommonDenominatorFractions(result.distributions || []);
  const heirsDistributions = allFormatted.filter(d => !d.relationship.startsWith('WILL_'));
  const willsDistributions = allFormatted.filter(d => d.relationship.startsWith('WILL_'));

  const isMandatory = result.mandatory_bequest_steps && result.mandatory_bequest_steps.length > 0;
  const steps = isMandatory ? result.mandatory_bequest_steps : (result.standard_steps || []);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>تقرير توزيع التركة الشرعي</Text>
          <Text style={styles.subtitle}>محرك حساب الفرائض والمواريث الإلكتروني</Text>
        </View>

        {/* Estate & Cases Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>بيانات التركة والوفاة</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{result.deceased_gender === 'female' ? 'اسم المتوفاة' : 'اسم المتوفى'}</Text>
            <Text style={styles.value}>{result.deceased_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>إجمالي التركة</Text>
            <Text style={styles.value}>{formatCurrency(result.total_estate)}</Text>
          </View>
          {result.deductions > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>الديون والالتزامات</Text>
              <Text style={styles.value}>-{formatCurrency(result.deductions)}</Text>
            </View>
          )}
          {result.total_wills_cost > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>إجمالي الوصايا المنفذة</Text>
              <Text style={styles.value}>-{formatCurrency(result.total_wills_cost)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>صافي التركة للورثة</Text>
            <Text style={styles.boldValue}>{formatCurrency(result.net_estate)}</Text>
          </View>
        </View>

        {/* Warning if Aul occured */}
        {result.is_aul && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              تنبيه بالعول: عالت المسألة نظراً لزيادة السهام المفروضة عن أصل المسألة. تم تعديل نصيب كل وارث بنسبة عادلة شرعاً (أصل السهام الجديد: {result.aul_sum_fractions}).
            </Text>
          </View>
        )}

        {/* Table of Heirs (الورثة المستحقون) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أنصبة الورثة المستحقين</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colHeir]}>الوارث</Text>
              <Text style={[styles.tableHeaderCell, styles.colCount]}>عدد الأفراد</Text>
              <Text style={[styles.tableHeaderCell, styles.colFraction]}>نصيب الفرد</Text>
              <Text style={[styles.tableHeaderCell, styles.colPercent]}>نصيب الفرد مئوياً</Text>
              <Text style={[styles.tableHeaderCell, styles.colIndValue]}>نصيب الفرد (مال)</Text>
              <Text style={[styles.tableHeaderCell, styles.colTotalValue]}>إجمالي الفئة</Text>
            </View>

            {heirsDistributions.map((heir, idx) => {
              const indPercentage = heir.individual_percentage ?? heir.percentage;
              return (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.colHeir]}>{heir.relationship_display}</Text>
                  <Text style={[styles.tableCell, styles.colCount]}>{heir.count}</Text>
                  <Text style={[styles.tableCell, styles.colFraction]}>{heir.formatted_individual_fraction || heir.formatted_fraction}</Text>
                  <Text style={[styles.tableCell, styles.colPercent]}>%{indPercentage.toFixed(2)}</Text>
                  <Text style={[styles.tableCell, styles.colIndValue]}>{formatCurrency(heir.per_person_value)}</Text>
                  <Text style={[styles.tableCell, styles.colTotalValue]}>{formatCurrency(heir.total_value)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Table of Wills (الوصايا الشرعية) */}
        {willsDistributions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الوصايا الشرعية المنفذة</Text>
            {result.wills_explanation && (
              <View style={[styles.alert, { marginBottom: 6 }]}>
                <Text style={styles.alertText}>{result.wills_explanation}</Text>
              </View>
            )}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.colHeir]}>الوصية</Text>
                <Text style={[styles.tableHeaderCell, styles.colFraction]}>نصيب الوصية</Text>
                <Text style={[styles.tableHeaderCell, styles.colPercent]}>النسبة المئوية</Text>
                <Text style={[styles.tableHeaderCell, styles.colValue]}>من المال</Text>
              </View>

              {willsDistributions.map((will, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.colHeir]}>{will.relationship_display}</Text>
                  <Text style={[styles.tableCell, styles.colFraction]}>{will.formatted_fraction}</Text>
                  <Text style={[styles.tableCell, styles.colPercent]}>%{will.percentage.toFixed(2)}</Text>
                  <Text style={[styles.tableCell, styles.colValue]}>{formatCurrency(will.total_value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Detailed Calculation Steps (خطوات الحل والشرح التفصيلي للمسألة) */}
        {steps.length > 0 && (
          <View style={[styles.section, { marginTop: 10 }]}>
            <Text style={styles.sectionTitle}>خطوات الحل والشرح التفصيلي للمسألة</Text>

            {/* Input state summary */}
            <View style={[styles.alert, { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', marginBottom: 10 }]}>
              <Text style={[styles.alertText, { color: '#1e293b', fontWeight: 'bold' }]}>
                مات وترك: {formatHeirsListSummary(result.distributions)}
              </Text>
            </View>

            {steps.map((step, sIdx) => (
              <View key={sIdx} wrap={false} style={{ marginBottom: 12, paddingBottom: 8, borderBottomWidth: sIdx === steps.length - 1 ? 0 : 1, borderBottomColor: '#f1f5f9' }}>
                <Text style={{ fontFamily: 'Tajawal', fontSize: 10, fontWeight: 'bold', color: '#b45309', marginBottom: 3, textAlign: 'right' }}>
                  {step.title}
                </Text>
                {step.desc && (
                  <Text style={{ fontFamily: 'Tajawal', fontSize: 8, color: '#64748b', marginBottom: 5, textAlign: 'right', lineHeight: 1.3 }}>
                    {step.desc}
                  </Text>
                )}

                {/* Step Table */}
                {step.table && step.table.length > 0 && (
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderCell, { width: '25%', textAlign: 'right' }]}>الوارث</Text>

                      {/* Header columns based on step type */}
                      {step.id === 'std_step1' && (
                        <>
                          <Text style={[styles.tableHeaderCell, { width: '15%' }]}>نصيبه</Text>
                          <Text style={[styles.tableHeaderCell, { width: '60%', textAlign: 'right' }]}>التوضيح الفقهي</Text>
                        </>
                      )}

                      {step.id === 'std_step2' && (
                        <Text style={[styles.tableHeaderCell, { width: '75%' }]}>السهم قبل التصحيح</Text>
                      )}

                      {step.id === 'std_step3' && (
                        <>
                          <Text style={[styles.tableHeaderCell, { width: '15%' }]}>عدد الأفراد</Text>
                          <Text style={[styles.tableHeaderCell, { width: '20%' }]}>نصيب الفرد</Text>
                          <Text style={[styles.tableHeaderCell, { width: '20%' }]}>النسبة المئوية</Text>
                          <Text style={[styles.tableHeaderCell, { width: '20%', textAlign: 'left' }]}>من المال</Text>
                        </>
                      )}

                      {isMandatory && step.id === 'step1' && (
                        <>
                          <Text style={[styles.tableHeaderCell, { width: '12%' }]}>عدد الأفراد</Text>
                          <Text style={[styles.tableHeaderCell, { width: '15%' }]}>نصيب الفرد</Text>
                          <Text style={[styles.tableHeaderCell, { width: '18%' }]}>حالة الاستحقاق</Text>
                          <Text style={[styles.tableHeaderCell, { width: '30%', textAlign: 'right' }]}>ملاحظات</Text>
                        </>
                      )}

                      {isMandatory && step.id !== 'step1' && (
                        <>
                          <Text style={[styles.tableHeaderCell, { width: '12%' }]}>عدد الأفراد</Text>
                          <Text style={[styles.tableHeaderCell, { width: '15%' }]}>نصيب الفرد</Text>
                          <Text style={[styles.tableHeaderCell, { width: '18%' }]}>النسبة</Text>
                          <Text style={[styles.tableHeaderCell, { width: '30%', textAlign: 'right' }]}>ملاحظات</Text>
                        </>
                      )}
                    </View>

                    {/* Table Rows */}
                    {step.table.map((row, rIdx) => (
                      <View key={rIdx} style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '25%', textAlign: 'right', fontWeight: 'bold' }]}>
                          {formatRowName(row.name, step.id)}
                        </Text>

                        {step.id === 'std_step1' && (
                          <>
                            <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold', color: '#b45309' }]}>{row.share}</Text>
                            <Text style={[styles.tableCell, { width: '60%', textAlign: 'right', fontSize: 7.5, color: '#475569' }]}>
                              {row.why || '—'}
                            </Text>
                          </>
                        )}

                        {step.id === 'std_step2' && (
                          <Text style={[styles.tableCell, { width: '75%', fontWeight: 'bold', color: '#b45309' }]}>{row.share}</Text>
                        )}

                        {step.id === 'std_step3' && (
                          <>
                            <Text style={[styles.tableCell, { width: '15%' }]}>{row.count}</Text>
                            <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold', color: '#b45309' }]}>{row.share}</Text>
                            <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>%{row.percentage.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, { width: '20%', textAlign: 'left', color: '#b45309' }]}>{formatCurrency(row.value)}</Text>
                          </>
                        )}

                        {isMandatory && step.id === 'step1' && (
                          <>
                            <Text style={[styles.tableCell, { width: '12%' }]}>{row.count}</Text>
                            <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold', color: '#b45309' }]}>{row.share}</Text>
                            <Text style={[styles.tableCell, { width: '18%', fontSize: 7.5, color: row.status.includes('غير وارث') ? '#b45309' : '#047857' }]}>
                              {row.status}
                            </Text>
                            <Text style={[styles.tableCell, { width: '30%', textAlign: 'right', fontSize: 7.5, color: '#475569' }]}>
                              {row.why || '—'}
                            </Text>
                          </>
                        )}

                        {isMandatory && step.id !== 'step1' && (
                          <>
                            <Text style={[styles.tableCell, { width: '12%' }]}>{row.count}</Text>
                            <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold', color: '#b45309' }]}>{row.share}</Text>
                            <Text style={[styles.tableCell, { width: '18%', fontWeight: 'bold' }]}>%{row.percentage.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, { width: '30%', textAlign: 'right', fontSize: 7.5, color: '#475569' }]}>
                              {row.why || '—'}
                            </Text>
                          </>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {/* Step Result Banner */}
                {step.result_text && (
                  <View style={{ backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0', padding: 6, borderRadius: 4, marginTop: 4 }}>
                    <Text style={{ fontFamily: 'Tajawal', fontSize: 8, fontWeight: 'bold', color: '#065f46', textAlign: 'right', lineHeight: 1.3 }}>
                      {step.result_text}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Footer with QR Code linking to the current inheritance issue */}
        <View wrap={false} style={{ marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e2e8f0', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fcfbf9', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#f1ede4' }}>
          <View style={{ flex: 1, paddingRight: 12, textAlign: 'right' }}>
            <Text style={{ fontFamily: 'Tajawal', fontSize: 10, fontWeight: 'bold', color: '#b45309', marginBottom: 2, textAlign: 'right' }}>
              معاينة ومتابعة المسألة إلكترونياً
            </Text>
            <Text style={{ fontFamily: 'Tajawal', fontSize: 8, color: '#64748b', lineHeight: 1.3, textAlign: 'right' }}>
              امسح رمز الاستجابة السريعة (QR Code) بكاميرا هاتفك لفتح وتعديل هذه المسألة ومشاركتها مباشرة على المنصة.
            </Text>
          </View>
          {qrCodeDataUrl ? (
            <View style={{ width: 75, height: 75, backgroundColor: '#ffffff', padding: 3, borderRadius: 6, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' }}>
              <Image src={qrCodeDataUrl} style={{ width: 68, height: 68 }} />
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
