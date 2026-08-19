import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Register Tajawal Font from local public directory
Font.register({
  family: "Tajawal",
  fonts: [
    { src: "/fonts/Tajawal-Regular.ttf" },
    { src: "/fonts/Tajawal-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/Tajawal-Bold.ttf", fontWeight: "bold" },
  ],
});

// Helper to compute fractions with a common denominator (LCM)
function getCommonDenominatorFractions(distributions) {
  const active = distributions.filter((d) => d.percentage > 0);
  if (active.length === 0) return [];

  const parsed = active.map((d) => {
    const parts = (d.individual_share_fraction || d.share_fraction).split("/");
    const num = parseInt(parts[0]) || 0;
    const den = parts[1] ? parseInt(parts[1]) : 1;

    const classParts = d.share_fraction.split("/");
    const classNum = parseInt(classParts[0]) || 0;
    const classDen = classParts[1] ? parseInt(classParts[1]) : 1;

    return { num, den, classNum, classDen, dist: d };
  });

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
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

  return parsed.map((p) => {
    if (p.num === 0) {
      return {
        ...p.dist,
        formatted_individual_fraction: "0",
        formatted_fraction: "0",
      };
    }
    const scale = commonDen / p.den;
    const scaledNum = p.num * scale;

    const classScale = commonDen / p.classDen;
    const classScaledNum = p.classNum * classScale;

    return {
      ...p.dist,
      formatted_individual_fraction: `${scaledNum}/${commonDen}`,
      formatted_fraction: `${classScaledNum}/${commonDen}`,
    };
  });
}

// PDF Styling aligned with Calculator V3 Theme
const styles = StyleSheet.create({
  page: {
    fontFamily: "Tajawal",
    padding: 28,
    fontSize: 9,
    backgroundColor: "#FBF5EC",
    color: "#3B0703",
    direction: "rtl",
  },
  header: {
    backgroundColor: "#4C0C06",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D6C9C5",
  },
  logo: {
    width: 85,
    height: 85,
    alignSelf: "center",
  },
  section: {
    marginBottom: 10,
    padding: 9,
    backgroundColor: "#FCFAF6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D6C9C5",
  },
  sectionTitle: {
    fontFamily: "Tajawal",
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#4C0C06",
    borderBottomWidth: 1,
    borderBottomColor: "#D6C9C5",
    paddingBottom: 4,
    marginBottom: 7,
    textAlign: "right",
  },
  deceasedRow: {
    flexDirection: "row-reverse",
    gap: "4px",
    alignItems: "center",
    paddingVertical: 3,
    marginBottom: 6,
  },
  label: {
    fontFamily: "Tajawal",
    color: "#6B5E59",
    textAlign: "right",
    fontSize: 8.5,
  },
  value: {
    fontFamily: "Tajawal",
    fontWeight: "bold",
    color: "#4C0C06",
    textAlign: "left",
    fontSize: 9.5,
  },

  // Estate Liquidation Grid (Cards matching Calculator V3)
  estateGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 6,
  },
  estateCard: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D6C9C5",
    backgroundColor: "#FCFAF6",
    textAlign: "right",
  },
  estateCardNet: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#4C0C06",
    borderWidth: 1,
    borderColor: "#D6C9C5",
    textAlign: "right",
  },
  estateCardDebts: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    textAlign: "right",
  },
  estateCardWills: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#D8B4FE",
    textAlign: "right",
  },
  estateLabel: {
    fontFamily: "Tajawal",
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#6B5E59",
    textAlign: "right",
    marginBottom: 2,
  },
  estateLabelNet: {
    fontFamily: "Tajawal",
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#E9C46A",
    textAlign: "right",
    marginBottom: 2,
  },
  estateLabelDebts: {
    fontFamily: "Tajawal",
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#991B1B",
    textAlign: "right",
    marginBottom: 2,
  },
  estateLabelWills: {
    fontFamily: "Tajawal",
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#6B21A8",
    textAlign: "right",
    marginBottom: 2,
  },
  estateVal: {
    fontFamily: "Tajawal",
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#3B0703",
    textAlign: "right",
  },
  estateValNet: {
    fontFamily: "Tajawal",
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#FBF5EC",
    textAlign: "right",
  },
  estateValDebts: {
    fontFamily: "Tajawal",
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#991B1B",
    textAlign: "right",
  },
  estateValWills: {
    fontFamily: "Tajawal",
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#6B21A8",
    textAlign: "right",
  },

  // Table Styling
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D6C9C5",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: "row-reverse",
    backgroundColor: "#F3EDE9",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#D6C9C5",
  },
  tableHeaderCell: {
    fontFamily: "Tajawal",
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#4C0C06",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row-reverse",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#EADBCE",
    alignItems: "center",
    backgroundColor: "#FCFAF6",
  },
  tableRowAlt: {
    flexDirection: "row-reverse",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#EADBCE",
    alignItems: "center",
    backgroundColor: "#F8F3EC",
  },
  tableCell: {
    fontFamily: "Tajawal",
    fontSize: 8.5,
    color: "#3B0703",
    textAlign: "center",
    fontWeight: "bold",
  },
  colHeir: { width: "25%", textAlign: "right" },
  colCount: { width: "10%" },
  colFraction: { width: "13%" },
  colPercent: { width: "15%" },
  colIndValue: { width: "18%", textAlign: "left" },
  colTotalValue: { width: "19%", textAlign: "left" },
  colValue: { width: "25%", textAlign: "left" },

  // Alerts
  alert: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 7,
    borderRadius: 6,
    marginBottom: 8,
    textAlign: "right",
  },
  alertText: {
    fontFamily: "Tajawal",
    color: "#92400E",
    fontSize: 8,
    lineHeight: 1.3,
    textAlign: "right",
  },
});

function formatCurrency(val) {
  return (
    Number(val).toLocaleString("ar-MA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " د.م."
  );
}

// Helper functions identical to DetailedCalculationDrawer
function formatHeirsListSummary(distributions) {
  if (!distributions || distributions.length === 0) return "";

  const regulars = [];
  const branches = {};

  for (const d of distributions) {
    if (
      d.relationship === "TREASURY" ||
      d.relationship_display === "بيت المال" ||
      d.relationship?.startsWith("WILL_") ||
      d.is_will ||
      d.type === "will"
    ) {
      continue;
    }
    const text = d.relationship_display;
    const match = text.match(/(.+?)\s*\((من\s+[^)]+)\)/);
    const hasMultiple = d.count !== "-" && parseInt(d.count) > 1;
    const displaySuffix = hasMultiple ? ` (${d.count})` : "";

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
    parts.push(`${branchLabel} (${kids.join(" و ")})`);
  }

  return parts.join(" و ");
}

function formatRowName(name, stepId) {
  if (!name) return "—";
  if (stepId && stepId.startsWith("step2")) {
    if (name.includes("ابن ابن متوفى")) return "ابن ابن";
    if (name.includes("ابن متوفى")) return "ابن";
    if (name.includes("بنت متوفاة")) return "بنت";
  }
  return name;
}

export default function PdfReport({
  result,
  shareUrl,
  qrCodeDataUrl,
  logoDataUrl,
}) {
  const allFormatted = getCommonDenominatorFractions(
    result.distributions || [],
  );
  const heirsDistributions = allFormatted.filter(
    (d) => !d.relationship.startsWith("WILL_"),
  );
  const willsDistributions = allFormatted.filter((d) =>
    d.relationship.startsWith("WILL_"),
  );

  const isMandatory =
    result.mandatory_bequest_steps && result.mandatory_bequest_steps.length > 0;
  const steps = isMandatory
    ? result.mandatory_bequest_steps
    : result.standard_steps || [];

  const displayNetEstate =
    (result.original_net_estate || result.total_estate) -
    (result.total_wills_cost || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          {logoDataUrl ? (
            <Image src={logoDataUrl} style={styles.logo} />
          ) : (
            <Image src="/images/logo.svg" style={styles.logo} />
          )}
        </View>

        {/* Estate & Cases Metadata */}
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>بيانات التركة والوفاة</Text> */}

          {/* Deceased Info */}
          <View style={styles.deceasedRow}>
            <Text style={styles.label}>
              {result.deceased_gender === "female"
                ? "اسم المتوفاة"
                : "اسم المتوفى"}
            </Text>
            <Text style={styles.value}>
              {result.deceased_name ||
                (result.deceased_gender === "female" ? "المتوفاة" : "المتوفى")}
            </Text>
          </View>

          {/* Estate Grid - 4 Cards Layout matching Calculator V3 */}
          <View style={styles.estateGrid}>
            {/* Gross Estate */}
            <View style={styles.estateCard}>
              <Text style={styles.estateLabel}>إجمالي التركة</Text>
              <Text style={styles.estateVal}>
                {formatCurrency(result.total_estate)}
              </Text>
            </View>

            {/* Debts */}
            {result.deductions > 0 && (
              <View style={styles.estateCardDebts}>
                <Text style={styles.estateLabelDebts}>الديون والالتزامات</Text>
                <Text style={styles.estateValDebts}>
                  -{formatCurrency(result.deductions)}
                </Text>
              </View>
            )}

            {/* Wills */}
            {result.total_wills_cost > 0 && (
              <View style={styles.estateCardWills}>
                <Text style={styles.estateLabelWills}>الوصايا المنفذة</Text>
                <Text style={styles.estateValWills}>
                  -{formatCurrency(result.total_wills_cost)}
                </Text>
              </View>
            )}

            {/* Net Estate */}
            <View style={styles.estateCardNet}>
              <Text style={styles.estateLabelNet}>صافي تركة الورثة</Text>
              <Text style={styles.estateValNet}>
                {formatCurrency(displayNetEstate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Warning if Aul occured */}
        {result.is_aul && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              تنبيه بالعول: عالت المسألة نظراً لزيادة السهام المفروضة عن أصل
              المسألة. تم تعديل نصيب كل وارث بنسبة عادلة شرعاً (أصل السهام
              الجديد: {result.aul_sum_fractions}).
            </Text>
          </View>
        )}

        {/* Table of Heirs (الورثة المستحقون) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أنصبة الورثة المستحقين</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colHeir]}>
                الوارث
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colCount]}>
                عدد الأفراد
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colFraction]}>
                نصيب الفرد
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colPercent]}>
                نصيب الفرد مئوياً
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colIndValue]}>
                نصيب الفرد (مال)
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colTotalValue]}>
                إجمالي الفئة
              </Text>
            </View>

            {heirsDistributions.map((heir, idx) => {
              const indPercentage =
                heir.individual_percentage ?? heir.percentage;
              const rowStyle =
                idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow;
              return (
                <View key={idx} style={rowStyle}>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.colHeir,
                      { color: "#4C0C06" },
                    ]}
                  >
                    {heir.relationship_display}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.colCount,
                      { color: "#6B5E59" },
                    ]}
                  >
                    {heir.count}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.colFraction,
                      { color: "#4C0C06" },
                    ]}
                  >
                    {heir.formatted_individual_fraction ||
                      heir.formatted_fraction}
                  </Text>
                  <Text style={[styles.tableCell, styles.colPercent]}>
                    %{indPercentage.toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colIndValue]}>
                    {formatCurrency(heir.per_person_value)}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.colTotalValue,
                      { color: "#4C0C06" },
                    ]}
                  >
                    {formatCurrency(heir.total_value)}
                  </Text>
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
                <Text style={[styles.tableHeaderCell, styles.colHeir]}>
                  الوصية
                </Text>
                <Text style={[styles.tableHeaderCell, styles.colFraction]}>
                  نصيب الوصية
                </Text>
                <Text style={[styles.tableHeaderCell, styles.colPercent]}>
                  النسبة المئوية
                </Text>
                <Text style={[styles.tableHeaderCell, styles.colValue]}>
                  من المال
                </Text>
              </View>

              {willsDistributions.map((will, idx) => {
                const rowStyle =
                  idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow;
                return (
                  <View key={idx} style={rowStyle}>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colHeir,
                        { color: "#4C0C06" },
                      ]}
                    >
                      {will.relationship_display}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colFraction,
                        { color: "#4C0C06" },
                      ]}
                    >
                      {will.formatted_fraction}
                    </Text>
                    <Text style={[styles.tableCell, styles.colPercent]}>
                      %{will.percentage.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colValue,
                        { color: "#6B21A8" },
                      ]}
                    >
                      {formatCurrency(will.total_value)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Detailed Calculation Steps (خطوات الحل والشرح التفصيلي للمسألة) */}
        {steps.length > 0 && (
          <View style={[styles.section, { marginTop: 8 }]}>
            <Text style={styles.sectionTitle}>
              خطوات الحل والشرح التفصيلي للمسألة
            </Text>

            {/* Input state summary Banner */}
            <View
              style={{
                backgroundColor: "#4C0C06",
                borderColor: "#D6C9C5",
                borderWidth: 1,
                borderRadius: 6,
                padding: 7,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Tajawal",
                  fontSize: 8.5,
                  color: "#FBF5EC",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                مات وترك: {formatHeirsListSummary(result.distributions)}
              </Text>
            </View>

            {steps.map((step, sIdx) => (
              <View
                key={sIdx}
                wrap={false}
                style={{
                  marginBottom: 10,
                  paddingBottom: 7,
                  borderBottomWidth: sIdx === steps.length - 1 ? 0 : 1,
                  borderBottomColor: "#EADBCE",
                }}
              >
                {/* Step Title with Badge */}
                <View
                  style={{
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 3,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Tajawal",
                      fontSize: 7.5,
                      fontWeight: "bold",
                      backgroundColor: "#4C0C06",
                      color: "#E9C46A",
                      paddingVertical: 1.5,
                      paddingHorizontal: 5,
                      borderRadius: 4,
                    }}
                  >
                    المرحلة {sIdx + 1}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Tajawal",
                      fontSize: 9.5,
                      fontWeight: "bold",
                      color: "#4C0C06",
                      textAlign: "right",
                    }}
                  >
                    {step.title}
                  </Text>
                </View>

                {step.desc && (
                  <Text
                    style={{
                      fontFamily: "Tajawal",
                      fontSize: 7.5,
                      color: "#6B5E59",
                      marginBottom: 4,
                      textAlign: "right",
                      lineHeight: 1.3,
                    }}
                  >
                    {step.desc}
                  </Text>
                )}

                {/* Step Table */}
                {step.table && step.table.length > 0 && (
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text
                        style={[
                          styles.tableHeaderCell,
                          { width: "25%", textAlign: "right" },
                        ]}
                      >
                        الوارث
                      </Text>

                      {/* Header columns based on step type */}
                      {step.id === "std_step1" && (
                        <>
                          <Text
                            style={[styles.tableHeaderCell, { width: "15%" }]}
                          >
                            نصيبه
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              { width: "60%", textAlign: "right" },
                            ]}
                          >
                            التوضيح الفقهي والدليل الشرعي
                          </Text>
                        </>
                      )}

                      {step.id === "std_step2" && (
                        <Text
                          style={[styles.tableHeaderCell, { width: "75%" }]}
                        >
                          السهم قبل التصحيح
                        </Text>
                      )}

                      {step.id === "std_step3" && (
                        <>
                          <Text
                            style={[styles.tableHeaderCell, { width: "15%" }]}
                          >
                            العدد
                          </Text>
                          <Text
                            style={[styles.tableHeaderCell, { width: "20%" }]}
                          >
                            نصيب الفرد
                          </Text>
                          <Text
                            style={[styles.tableHeaderCell, { width: "20%" }]}
                          >
                            النسبة
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              { width: "20%", textAlign: "left" },
                            ]}
                          >
                            من المال
                          </Text>
                        </>
                      )}

                      {isMandatory && step.id === "step1" && (
                        <>
                          <Text
                            style={[styles.tableHeaderCell, { width: "12%" }]}
                          >
                            العدد
                          </Text>
                          <Text
                            style={[styles.tableHeaderCell, { width: "15%" }]}
                          >
                            نصيب الفرد
                          </Text>
                          <Text
                            style={[styles.tableHeaderCell, { width: "18%" }]}
                          >
                            حالة الاستحقاق
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              { width: "30%", textAlign: "right" },
                            ]}
                          >
                            ملاحظات شرعية
                          </Text>
                        </>
                      )}

                      {isMandatory && step.id !== "step1" && (
                        <>
                          <Text
                            style={[styles.tableHeaderCell, { width: "12%" }]}
                          >
                            العدد
                          </Text>
                          <Text
                            style={[styles.tableHeaderCell, { width: "15%" }]}
                          >
                            نصيب الفرد
                          </Text>
                          <Text
                            style={[styles.tableHeaderCell, { width: "18%" }]}
                          >
                            النسبة
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              { width: "30%", textAlign: "right" },
                            ]}
                          >
                            ملاحظات
                          </Text>
                        </>
                      )}
                    </View>

                    {/* Table Rows */}
                    {step.table.map((row, rIdx) => {
                      const rowStyle =
                        rIdx % 2 === 1 ? styles.tableRowAlt : styles.tableRow;
                      return (
                        <View key={rIdx} style={rowStyle}>
                          <Text
                            style={[
                              styles.tableCell,
                              {
                                width: "25%",
                                textAlign: "right",
                                fontWeight: "bold",
                                color: "#4C0C06",
                              },
                            ]}
                          >
                            {formatRowName(row.name, step.id)}
                          </Text>

                          {step.id === "std_step1" && (
                            <>
                              <Text
                                style={[
                                  styles.tableCell,
                                  {
                                    width: "15%",
                                    fontWeight: "bold",
                                    color: "#4C0C06",
                                  },
                                ]}
                              >
                                {row.share}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  {
                                    width: "60%",
                                    textAlign: "right",
                                    fontSize: 7.5,
                                    color: "#6B5E59",
                                  },
                                ]}
                              >
                                {row.why || "—"}
                              </Text>
                            </>
                          )}

                          {step.id === "std_step2" && (
                            <Text
                              style={[
                                styles.tableCell,
                                {
                                  width: "75%",
                                  fontWeight: "bold",
                                  color: "#4C0C06",
                                },
                              ]}
                            >
                              {row.share}
                            </Text>
                          )}

                          {step.id === "std_step3" && (
                            <>
                              <Text
                                style={[
                                  styles.tableCell,
                                  { width: "15%", color: "#6B5E59" },
                                ]}
                              >
                                {row.count}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  {
                                    width: "20%",
                                    fontWeight: "bold",
                                    color: "#4C0C06",
                                  },
                                ]}
                              >
                                {row.share}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  { width: "20%", fontWeight: "bold" },
                                ]}
                              >
                                %{row.percentage.toFixed(2)}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  {
                                    width: "20%",
                                    textAlign: "left",
                                    color: "#4C0C06",
                                    fontWeight: "bold",
                                  },
                                ]}
                              >
                                {formatCurrency(row.value)}
                              </Text>
                            </>
                          )}

                          {isMandatory && step.id === "step1" && (
                            <>
                              <Text
                                style={[
                                  styles.tableCell,
                                  { width: "12%", color: "#6B5E59" },
                                ]}
                              >
                                {row.count}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  {
                                    width: "15%",
                                    fontWeight: "bold",
                                    color: "#4C0C06",
                                  },
                                ]}
                              >
                                {row.share}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  {
                                    width: "18%",
                                    fontSize: 7.5,
                                    color: row.status.includes("غير وارث")
                                      ? "#92400E"
                                      : "#065F46",
                                  },
                                ]}
                              >
                                {row.status}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  {
                                    width: "30%",
                                    textAlign: "right",
                                    fontSize: 7.5,
                                    color: "#6B5E59",
                                  },
                                ]}
                              >
                                {row.why || "—"}
                              </Text>
                            </>
                          )}

                          {isMandatory && step.id !== "step1" && (
                            <>
                              <Text
                                style={[
                                  styles.tableCell,
                                  { width: "12%", color: "#6B5E59" },
                                ]}
                              >
                                {row.count}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  {
                                    width: "15%",
                                    fontWeight: "bold",
                                    color: "#4C0C06",
                                  },
                                ]}
                              >
                                {row.share}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  { width: "18%", fontWeight: "bold" },
                                ]}
                              >
                                %{row.percentage.toFixed(2)}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  {
                                    width: "30%",
                                    textAlign: "right",
                                    fontSize: 7.5,
                                    color: "#6B5E59",
                                  },
                                ]}
                              >
                                {row.why || "—"}
                              </Text>
                            </>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Step Result Banner */}
                {step.result_text && (
                  <View
                    style={{
                      backgroundColor: "#ECFDF5",
                      borderWidth: 1,
                      borderColor: "#A7F3D0",
                      padding: 5,
                      borderRadius: 4,
                      marginTop: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Tajawal",
                        fontSize: 7.5,
                        fontWeight: "bold",
                        color: "#065F46",
                        textAlign: "right",
                        lineHeight: 1.3,
                      }}
                    >
                      {step.result_text}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Footer with QR Code linking to the current inheritance issue */}
        <View
          wrap={false}
          style={{
            marginTop: 10,
            padding: 9,
            borderWidth: 1,
            borderColor: "#D6C9C5",
            borderRadius: 8,
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FCFAF6",
          }}
        >
          <View style={{ flex: 1, paddingRight: 10, textAlign: "right" }}>
            <Text
              style={{
                fontFamily: "Tajawal",
                fontSize: 9.5,
                fontWeight: "bold",
                color: "#4C0C06",
                marginBottom: 2,
                textAlign: "right",
              }}
            >
              معاينة ومتابعة المسألة إلكترونياً
            </Text>
            <Text
              style={{
                fontFamily: "Tajawal",
                fontSize: 7.5,
                color: "#6B5E59",
                lineHeight: 1.3,
                textAlign: "right",
              }}
            >
              امسح رمز الاستجابة السريعة (QR Code) بكاميرا هاتفك لفتح وتعديل هذه
              المسألة ومشاركتها مباشرة على المنصة.
            </Text>
          </View>
          {qrCodeDataUrl ? (
            <View
              style={{
                width: 70,
                height: 70,
                backgroundColor: "#FFFFFF",
                padding: 3,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#D6C9C5",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image src={qrCodeDataUrl} style={{ width: 64, height: 64 }} />
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
