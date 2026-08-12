import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

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

export default function PdfReport({ result }) {
  const allFormatted = getCommonDenominatorFractions(result.distributions || []);
  const heirsDistributions = allFormatted.filter(d => !d.relationship.startsWith('WILL_'));
  const willsDistributions = allFormatted.filter(d => d.relationship.startsWith('WILL_'));
  const blockedHeirs = (result.distributions || []).filter(d => d.percentage === 0);

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

        {/* Excluded/Blocked Heirs */}
        {/* {blockedHeirs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الورثة المحجوبون</Text>
            {blockedHeirs.map((heir, idx) => (
              <View key={idx} style={{ paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {heir.why ? heir.why : 'محجوب حجب حرمان'}
                  </Text>
                  <Text style={{ fontWeight: 'bold', color: '#ef4444', fontFamily: 'Tajawal' }}>
                    {heir.relationship_display}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )} */}

        {/* Share Explanations (أسباب الميراث والوصايا) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تفاصيل وتوجيه الأنصبة والوصايا</Text>
          {allFormatted.map((heir, idx) => (
            <View key={idx} style={styles.explanationCard}>
              <Text style={styles.explanationName}>{heir.relationship_display}</Text>
              <Text style={styles.whyText}>{heir.why || 'تم التخصيص حسب الأنصبة الشرعية.'}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
