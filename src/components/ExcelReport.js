import ExcelJS from 'exceljs';
import { downloadBlob } from '../utils';

// Helper to compute fractions with a common denominator (LCM)
function getCommonDenominatorFractions(distributions) {
  const active = distributions.filter((d) => d.percentage > 0);
  if (active.length === 0) return [];

  const parsed = active.map((d) => {
    const parts = (d.individual_share_fraction || d.share_fraction || '1/1').split('/');
    const num = parseInt(parts[0], 10) || 0;
    const den = parts[1] ? parseInt(parts[1], 10) : 1;

    const classParts = (d.share_fraction || '1/1').split('/');
    const classNum = parseInt(classParts[0], 10) || 0;
    const classDen = classParts[1] ? parseInt(classParts[1], 10) : 1;

    return { num, den, classNum, classDen, dist: d };
  });

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a, b) => (a * b) / gcd(a, b);

  let commonDen = 1;
  for (const p of parsed) {
    if (p.den > 0) commonDen = lcm(commonDen, p.den);
    if (p.classDen > 0) commonDen = lcm(commonDen, p.classDen);
  }

  return parsed.map((p) => {
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

// Dynamically auto-fit column widths according to content length
function autoFitColumns(sheet) {
  const minWidths = [30, 15, 20, 18, 24, 26]; // Minimum widths for Col A to F

  sheet.columns.forEach((column, colIdx) => {
    let maxContentLen = minWidths[colIdx] || 16;

    column.eachCell({ includeEmpty: false }, (cell) => {
      const rowNum = cell.row;
      // Skip top banners and full-width merged rows
      if (rowNum <= 3) return;

      // Only measure unmerged cells to avoid skewing column width
      if (!cell.isMerged) {
        let cellText = '';
        if (cell.value !== null && cell.value !== undefined) {
          if (typeof cell.value === 'object' && cell.value.result !== undefined) {
            cellText = Number(cell.value.result).toLocaleString('ar-MA');
          } else if (typeof cell.value === 'object' && cell.value.formula) {
            cellText = '';
          } else {
            cellText = String(cell.value);
          }
        }

        // Add padding allowance for currency and percentage labels
        if (cell.numFmt) {
          if (cell.numFmt.includes('د.م.')) {
            cellText += '  د.م.';
          }
          if (cell.numFmt.includes('%')) {
            cellText += ' %';
          }
        }

        const calculatedLen = Math.ceil(cellText.length * 1.2);
        if (calculatedLen > maxContentLen) {
          maxContentLen = calculatedLen;
        }
      }
    });

    column.width = Math.min(Math.max(maxContentLen + 4, minWidths[colIdx] || 16), 55);
  });
}

export async function exportExcelReport(result, stateSnapshot = {}) {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('تقرير توزيع التركة');

    // Right-to-Left (RTL) mode enabled for proper Arabic flow
    sheet.views = [{ rightToLeft: true, showGridLines: true }];

    const currencyFmt = '#,##0.00" د.م."';
    const percentFmt = '0.00%';
    const fontName = 'Segoe UI';

    // Financial values
    const grossEstateNum = Number(result.total_estate) || 0;
    const deductionsNum = Number(result.deductions) || 0;
    const willsCostNum = Number(result.total_wills_cost) || 0;
    const netEstateNum = (result.original_net_estate || result.total_estate) - willsCostNum;

    // V3 Luxury Palette Tokens (ARGB hex without #)
    const colors = {
      // V3 Primary (Deep Royal Burgundy / Garnet)
      primary950: 'FF240406',    // Deep royal burgundy (Hero banner & Table header)
      primary900: 'FF3B0A0E',    // Dark garnet (Sub-banner)
      primary800: 'FF5A1218',    // Accent burgundy
      primary50: 'FFFDF4F4',    // Softest rose-cream tint

      // V3 Secondary (Warm Gold / Champagne / Amber)
      goldDark: 'FF785317',    // Deep antique bronze gold
      goldMedium: 'FFB5893D',    // Signature V3 Gold (Secondary-400/500)
      goldLight: 'FFF0D5AA',    // Champagne gold text (Secondary-200)
      goldBanner: 'FFF8ECD7',    // Soft gold banner/card background (Secondary-100)
      bgWarmCream: 'FFFDF8F0',    // Warm ivory page tint (Secondary-50)
      bgZebra: 'FFFBF7F0',    // Alternating row soft warm tint

      // Neutrals & Clean Rows
      rowWhite: 'FFFFFFFF',    // Pure white for even rows
      textDark: 'FF1E293B',    // Dark slate text
      textMuted: 'FF64748B',    // Slate muted text
      borderSoft: 'FFEFE7DC',    // Soft delicate warm border
      borderGold: 'FFD8C2A0',    // Distinct gold border

      // Functional Accents
      redText: 'FFB91C1C',    // Debts text
      redBg: 'FFFDF2F2',    // Debts soft background
      purpleText: 'FF6D28D9',    // Wills deep violet text
      purpleBg: 'FFFBF5FF',    // Wills soft background
      emeraldText: 'FF047857',    // Net estate / success text
      emeraldBg: 'FFECFDF5'     // Success background
    };

    const thinBorder = {
      top: { style: 'thin', color: { argb: colors.borderSoft } },
      left: { style: 'thin', color: { argb: colors.borderSoft } },
      bottom: { style: 'thin', color: { argb: colors.borderSoft } },
      right: { style: 'thin', color: { argb: colors.borderSoft } }
    };

    const sectionHeaderBorder = {
      top: { style: 'thin', color: { argb: colors.goldMedium } },
      left: { style: 'thin', color: { argb: colors.goldMedium } },
      bottom: { style: 'thin', color: { argb: colors.goldMedium } },
      right: { style: 'thin', color: { argb: colors.goldMedium } }
    };

    const tableHeaderBorder = {
      top: { style: 'thin', color: { argb: colors.goldMedium } },
      left: { style: 'thin', color: { argb: colors.primary800 } },
      bottom: { style: 'medium', color: { argb: colors.goldMedium } },
      right: { style: 'thin', color: { argb: colors.primary800 } }
    };

    const doubleTotalBorder = {
      top: { style: 'thin', color: { argb: colors.goldMedium } },
      bottom: { style: 'double', color: { argb: colors.goldDark } },
      left: { style: 'thin', color: { argb: colors.borderSoft } },
      right: { style: 'thin', color: { argb: colors.borderSoft } }
    };

    const deceasedName = result.deceased_name || (result.deceased_gender === 'female' ? 'المتوفاة' : 'المتوفى');
    const deceasedGenderLabel = result.deceased_gender === 'female' ? 'المتوفاة' : 'المتوفى';
    const reportDate = new Date().toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // ==========================================
    // 1. Header Title Banner (V3 Luxury Burgundy + Gold)
    // ==========================================
    sheet.mergeCells('A1:F1');
    const titleRow = sheet.getRow(1);
    titleRow.height = 46;
    const titleCell = titleRow.getCell(1);
    titleCell.value = 'تقرير توزيع التركة الشرعي';
    titleCell.font = { size: 16, bold: true, color: { argb: colors.goldLight }, name: fontName };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary950 } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Subtitle & Metadata Banner
    sheet.mergeCells('A2:F2');
    const metaRow = sheet.getRow(2);
    metaRow.height = 28;
    const metaCell = metaRow.getCell(1);
    metaCell.value = `${deceasedGenderLabel}: ${deceasedName}    •    تاريخ التقرير: ${reportDate}    •    محرك حساب الفرائض والمواريث`;
    metaCell.font = { size: 10, bold: true, color: { argb: colors.goldLight }, name: fontName };
    metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary900 } };
    metaCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Spacer
    sheet.addRow([]);

    // ==========================================
    // 2. Financial Summary (تصفية التركة والخصوم الشرعية)
    // ==========================================
    const summarySecRowIdx = sheet.rowCount + 1;
    sheet.mergeCells(`A${summarySecRowIdx}:F${summarySecRowIdx}`);
    const summarySecCell = sheet.getRow(summarySecRowIdx).getCell(1);
    summarySecCell.value = 'تصفية التركة والخصوم الشرعية';
    summarySecCell.font = { size: 11, bold: true, color: { argb: colors.primary950 }, name: fontName };
    summarySecCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.goldBanner } };
    sheet.getRow(summarySecRowIdx).height = 28;
    summarySecCell.alignment = { horizontal: 'center', vertical: 'middle', indent: 1 };
    summarySecCell.border = sectionHeaderBorder;

    // Header row
    const sumHeaderRowIdx = sheet.rowCount + 1;
    sheet.addRow(['البند المالي والشرعي', 'المبلغ (د.م.)', 'النسبة المئوية', 'البيان والتفصيل الشرعي', '', '']);
    sheet.mergeCells(`D${sumHeaderRowIdx}:F${sumHeaderRowIdx}`);
    const sumHeader = sheet.getRow(sumHeaderRowIdx);
    sumHeader.height = 26;
    sumHeader.font = { bold: true, size: 10, color: { argb: colors.goldLight }, name: fontName };
    sumHeader.alignment = { horizontal: 'center', vertical: 'middle' };

    for (let c = 1; c <= 6; c++) {
      const cell = sumHeader.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary950 } };
      cell.border = tableHeaderBorder;
    }
    sumHeader.getCell(1).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };

    // Data rows for liquidation
    const summaryData = [
      {
        label: 'إجمالي التركة (التركة الخام)',
        amount: grossEstateNum,
        pct: 1.0,
        desc: 'إجمالي أموال وحقوق وممتلكات المورث قبل أداء الاستقطاعات',
        isNet: false
      }
    ];

    if (deductionsNum > 0) {
      summaryData.push({
        label: 'الديون والالتزامات المستقطعة',
        amount: -deductionsNum,
        pct: -(deductionsNum / (grossEstateNum || 1)),
        desc: 'مؤن التجهيز والديون العينية والشخصية وحقوق الله المسددة',
        isNet: false,
        isRed: true
      });
    }

    if (willsCostNum > 0) {
      summaryData.push({
        label: 'الوصايا الشرعية المنفذة',
        amount: -willsCostNum,
        pct: -(willsCostNum / (grossEstateNum || 1)),
        desc: 'الوصايا الشرعية والواجبة المقتطعة في حدود الثلث الشرعي',
        isNet: false,
        isPurple: true
      });
    }

    summaryData.push({
      label: 'صافي تركة الورثة المستحقين',
      amount: netEstateNum,
      pct: netEstateNum / (grossEstateNum || 1),
      desc: 'التركة الصافية القابلة للقسمة والتوزيع على الورثة الشرعيين',
      isNet: true
    });

    summaryData.forEach((item) => {
      const rIdx = sheet.rowCount + 1;
      sheet.addRow([item.label, item.amount, item.pct, item.desc, '', '']);
      sheet.mergeCells(`D${rIdx}:F${rIdx}`);
      const row = sheet.getRow(rIdx);
      row.height = item.isNet ? 26 : 24;

      row.getCell(1).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(4).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };

      row.getCell(2).numFmt = currencyFmt;
      row.getCell(3).numFmt = percentFmt;

      const bg = item.isNet
        ? colors.goldBanner
        : (item.isRed ? colors.redBg : (item.isPurple ? colors.purpleBg : colors.rowWhite));
      const textColor = item.isNet
        ? colors.primary900
        : (item.isRed ? colors.redText : (item.isPurple ? colors.purpleText : colors.textDark));

      for (let c = 1; c <= 6; c++) {
        const cell = row.getCell(c);
        cell.font = {
          name: fontName,
          size: item.isNet ? 10.5 : 9.5,
          bold: item.isNet || c === 1,
          color: { argb: textColor }
        };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
        cell.border = item.isNet ? doubleTotalBorder : thinBorder;
      }
    });

    // Spacer
    sheet.addRow([]);

    // ==========================================
    // 3. Heirs Distribution Table (أنصبة الورثة المستحقين)
    // ==========================================
    const allFormatted = getCommonDenominatorFractions(result.distributions || []);
    const heirsList = allFormatted.filter((d) => !d.relationship.startsWith('WILL_'));
    const willsList = allFormatted.filter((d) => d.relationship.startsWith('WILL_'));

    const heirsSecRowIdx = sheet.rowCount + 1;
    sheet.mergeCells(`A${heirsSecRowIdx}:F${heirsSecRowIdx}`);
    const heirsSecCell = sheet.getRow(heirsSecRowIdx).getCell(1);
    heirsSecCell.value = 'أنصبة الورثة المستحقين';
    heirsSecCell.font = { size: 11, bold: true, color: { argb: colors.primary950 }, name: fontName };
    heirsSecCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.goldBanner } };
    sheet.getRow(heirsSecRowIdx).height = 28;
    heirsSecCell.alignment = { horizontal: 'center', vertical: 'middle', indent: 1 };
    heirsSecCell.border = sectionHeaderBorder;

    // Heirs Header
    const heirsHeaderRowIdx = sheet.rowCount + 1;
    sheet.addRow([
      'الوارث المستحق',
      'عدد الأفراد',
      'نصيب الفرد (الفرض)',
      'نصيب الفرد مئوياً',
      'نصيب الفرد (د.م.)',
      'إجمالي الفئة (د.م.)'
    ]);
    const heirsHeader = sheet.getRow(heirsHeaderRowIdx);
    heirsHeader.height = 28;
    heirsHeader.font = { bold: true, size: 10, color: { argb: colors.goldLight }, name: fontName };
    heirsHeader.alignment = { horizontal: 'center', vertical: 'middle' };

    for (let c = 1; c <= 6; c++) {
      const cell = heirsHeader.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary950 } };
      cell.border = tableHeaderBorder;
    }
    heirsHeader.getCell(1).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };

    // Heirs Data Rows
    const firstHeirRowIdx = sheet.rowCount + 1;

    heirsList.forEach((d, idx) => {
      const indPercentage = d.individual_percentage ?? d.percentage;
      const shareFractionStr = d.formatted_individual_fraction || d.individual_share_fraction || d.share_fraction || '—';

      const row = sheet.addRow([
        d.relationship_display,
        Number(d.count) || 1,
        shareFractionStr,
        (Number(indPercentage) || 0) / 100,
        Number(d.per_person_value) || 0,
        Number(d.total_value) || 0
      ]);

      row.height = 24;
      row.getCell(2).numFmt = '#,##0';
      row.getCell(4).numFmt = percentFmt;
      row.getCell(5).numFmt = currencyFmt;
      row.getCell(6).numFmt = currencyFmt;

      row.getCell(1).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell(6).alignment = { horizontal: 'left', vertical: 'middle' };

      const rowBg = idx % 2 === 0 ? colors.rowWhite : colors.bgZebra;

      for (let c = 1; c <= 6; c++) {
        const cell = row.getCell(c);
        cell.font = {
          name: fontName,
          size: 9.5,
          color: { argb: colors.textDark },
          bold: c === 1 || c === 3 || c === 6
        };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
        cell.border = thinBorder;
      }
    });

    const lastHeirRowIdx = sheet.rowCount;

    if (heirsList.length > 0) {
      const totalRowIdx = sheet.rowCount + 1;
      const totalRow = sheet.addRow([
        'مجموع أنصبة الورثة',
        { formula: `SUM(B${firstHeirRowIdx}:B${lastHeirRowIdx})` },
        'كامل التركة',
        1.0,
        '-',
        { formula: `SUM(F${firstHeirRowIdx}:F${lastHeirRowIdx})` }
      ]);

      totalRow.height = 26;
      totalRow.getCell(2).numFmt = '#,##0';
      totalRow.getCell(4).numFmt = percentFmt;
      totalRow.getCell(6).numFmt = currencyFmt;

      totalRow.getCell(1).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      totalRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
      totalRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
      totalRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
      totalRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
      totalRow.getCell(6).alignment = { horizontal: 'left', vertical: 'middle' };

      for (let c = 1; c <= 6; c++) {
        const cell = totalRow.getCell(c);
        cell.font = {
          name: fontName,
          size: 10,
          bold: true,
          color: { argb: colors.primary950 }
        };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.goldBanner } };
        cell.border = doubleTotalBorder;
      }
    }

    // ==========================================
    // 4. Executed Wills Table (الوصايا الشرعية المنفذة)
    // ==========================================
    if (willsList.length > 0) {
      sheet.addRow([]);
      const willsSecRowIdx = sheet.rowCount + 1;
      sheet.mergeCells(`A${willsSecRowIdx}:F${willsSecRowIdx}`);
      const willsSecCell = sheet.getRow(willsSecRowIdx).getCell(1);
      willsSecCell.value = 'تفاصيل الوصايا';
      willsSecCell.font = { size: 11, bold: true, color: { argb: colors.primary900 }, name: fontName };
      willsSecCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.goldBanner } };
      sheet.getRow(willsSecRowIdx).height = 28;
      willsSecCell.alignment = { horizontal: 'center', vertical: 'middle', indent: 1 };
      willsSecCell.border = sectionHeaderBorder;

      const willsHeaderRowIdx = sheet.rowCount + 1;
      sheet.addRow(['الوصية / المستفيد', '', '', 'الفرض / الكسر', 'النسبة المئوية', 'المبلغ المقتطع (د.م.)']);
      sheet.mergeCells(`A${willsHeaderRowIdx}:C${willsHeaderRowIdx}`);
      const willsHeader = sheet.getRow(willsHeaderRowIdx);
      willsHeader.height = 26;
      willsHeader.font = { bold: true, size: 10, color: { argb: colors.goldLight }, name: fontName };
      willsHeader.alignment = { horizontal: 'center', vertical: 'middle' };

      for (let c = 1; c <= 6; c++) {
        const cell = willsHeader.getCell(c);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary950 } };
        cell.border = tableHeaderBorder;
      }
      willsHeader.getCell(1).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };

      willsList.forEach((w) => {
        const wIdx = sheet.rowCount + 1;
        sheet.addRow([
          w.relationship_display,
          '',
          '',
          w.formatted_fraction || w.share_fraction || '—',
          (Number(w.percentage) || 0) / 100,
          Number(w.total_value) || 0
        ]);
        sheet.mergeCells(`A${wIdx}:C${wIdx}`);

        const row = sheet.getRow(wIdx);
        row.height = 24;
        row.getCell(5).numFmt = percentFmt;
        row.getCell(6).numFmt = currencyFmt;

        row.getCell(1).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
        row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(6).alignment = { horizontal: 'left', vertical: 'middle' };

        for (let c = 1; c <= 6; c++) {
          const cell = row.getCell(c);
          cell.font = { name: fontName, size: 9.5, color: { argb: colors.textDark }, bold: c === 1 || c === 6 };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.rowWhite } };
          cell.border = thinBorder;
        }
      });
    }

    // ==========================================
    // 5. Debts Details Table (تفاصيل الديون والالتزامات)
    // ==========================================
    const rawDebts = stateSnapshot.debts || result.debts || [];
    const activeDebtsList = Array.isArray(rawDebts)
      ? rawDebts.filter((d) => Number(d.amount) > 0)
      : [];

    if (activeDebtsList.length > 0) {
      sheet.addRow([]);
      const debtsSecRowIdx = sheet.rowCount + 1;
      sheet.mergeCells(`A${debtsSecRowIdx}:F${debtsSecRowIdx}`);
      const debtsSecCell = sheet.getRow(debtsSecRowIdx).getCell(1);
      debtsSecCell.value = 'تفاصيل الديون والالتزامات المالية المسددة';
      debtsSecCell.font = { size: 11, bold: true, color: { argb: colors.redText }, name: fontName };
      debtsSecCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.redBg } };
      sheet.getRow(debtsSecRowIdx).height = 28;
      debtsSecCell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      debtsSecCell.border = sectionHeaderBorder;

      const debtsHeaderRowIdx = sheet.rowCount + 1;
      sheet.addRow(['بيان الدين / الالتزام', '', '', 'النوع الشرعي للدين', '', 'المبلغ المسدد (د.م.)']);
      sheet.mergeCells(`A${debtsHeaderRowIdx}:C${debtsHeaderRowIdx}`);
      sheet.mergeCells(`D${debtsHeaderRowIdx}:E${debtsHeaderRowIdx}`);

      const debtsHeader = sheet.getRow(debtsHeaderRowIdx);
      debtsHeader.height = 26;
      debtsHeader.font = { bold: true, size: 10, color: { argb: colors.goldLight }, name: fontName };
      debtsHeader.alignment = { horizontal: 'center', vertical: 'middle' };

      for (let c = 1; c <= 6; c++) {
        const cell = debtsHeader.getCell(c);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary950 } };
        cell.border = tableHeaderBorder;
      }
      debtsHeader.getCell(1).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };

      activeDebtsList.forEach((debt, dIdx) => {
        const rowIdx = sheet.rowCount + 1;
        const typeLabel = debt.type === 'funeral'
          ? 'مؤن التجهيز والدفن'
          : debt.type === 'mortgage'
            ? 'دين عيني برهن'
            : debt.type === 'allah'
              ? 'حق لله تعالى (زكاة/نذر/كفارة)'
              : 'دين عادي شخصي';

        sheet.addRow([
          debt.description || `دين رقم ${dIdx + 1}`,
          '',
          '',
          typeLabel,
          '',
          Number(debt.amount) || 0
        ]);
        sheet.mergeCells(`A${rowIdx}:C${rowIdx}`);
        sheet.mergeCells(`D${rowIdx}:E${rowIdx}`);

        const row = sheet.getRow(rowIdx);
        row.height = 24;
        row.getCell(6).numFmt = currencyFmt;

        row.getCell(1).alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
        row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(6).alignment = { horizontal: 'left', vertical: 'middle' };

        for (let c = 1; c <= 6; c++) {
          const cell = row.getCell(c);
          cell.font = { name: fontName, size: 9.5, color: { argb: colors.textDark }, bold: c === 1 || c === 6 };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.rowWhite } };
          cell.border = thinBorder;
        }
      });
    }



    // Apply dynamic column widths auto-fitting
    autoFitColumns(sheet);

    // Export buffer & trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `تقرير_الميراث_${deceasedName}.xlsx`;
    downloadBlob(new Blob([buffer]), fileName);
  } catch (e) {
    console.error('Excel export failed internally', e);
    throw e;
  }
}
