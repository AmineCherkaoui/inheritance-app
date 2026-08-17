import ExcelJS from 'exceljs';
import { downloadBlob } from '../utils';

export async function exportExcelReport(result) {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('تقرير توزيع التركة');

    // Enable RTL
    sheet.views = [{ rightToLeft: true, showGridLines: true }];

    // Column widths (6 columns now)
    sheet.columns = [
      { key: 'col1', width: 30 }, // Heir Name
      { key: 'col2', width: 14 }, // Count
      { key: 'col3', width: 22 }, // Individual Share (Fraction)
      { key: 'col4', width: 22 }, // Individual Share (%)
      { key: 'col5', width: 26 }, // Individual Value (د.م.)
      { key: 'col6', width: 28 }  // Category Total Value (د.م.)
    ];

    const currencyFmt = '#,##0.00" د.م."';
    const fontName = 'Segoe UI';

    // Parse values to actual numbers for Excel formulas to work correctly
    const grossEstateNum = Number(result.total_estate) || 0;
    const deductionsNum = Number(result.deductions) || 0;
    const willsCostNum = Number(result.total_wills_cost) || 0;
    const netEstateNum = Number(result.net_estate) || 0;

    // Premium Website UI Colors
    const colors = {
      primaryText: '78350F',   // Amber text
      bannerBg: 'FFFBEB',      // Soft yellow-amber bg
      headerBg: 'FEF3C7',      // Website light amber button/card style
      borderLight: 'F3F4F6',   // Very soft gray grid border
      textDark: '1F2937',      // Neutral dark
      successText: '047857',   // Emerald text
      successBg: 'F0FDF4',     // Emerald light bg
      grayHeaderBg: 'F9FAFB'
    };

    const thinBorder = {
      top: { style: 'thin', color: { argb: colors.borderLight } },
      left: { style: 'thin', color: { argb: colors.borderLight } },
      bottom: { style: 'thin', color: { argb: colors.borderLight } },
      right: { style: 'thin', color: { argb: colors.borderLight } }
    };

    const doubleBorder = {
      top: { style: 'thin', color: { argb: '34D399' } },
      bottom: { style: 'double', color: { argb: '059669' } },
      left: { style: 'thin', color: { argb: colors.borderLight } },
      right: { style: 'thin', color: { argb: colors.borderLight } }
    };

    // 1. Header Title Banner (Matched to website header)
    sheet.mergeCells('A1:F1');
    const titleRow = sheet.getRow(1);
    titleRow.height = 42;
    const titleCell = titleRow.getCell(1);
    titleCell.value = `تقرير توزيع التركة الشرعي - ${result.deceased_name}`;
    titleCell.font = { size: 15, bold: true, color: { argb: colors.primaryText }, name: fontName };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colors.bannerBg }
    };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.border = thinBorder;

    // Spacer
    sheet.addRow([]);

    // 2. Summary Table Section
    sheet.mergeCells('A3:F3');
    const summaryTitle = sheet.getRow(3).getCell(1);
    summaryTitle.value = 'ملخص حساب التركة والمال';
    summaryTitle.font = { size: 11, bold: true, color: { argb: colors.primaryText }, name: fontName };
    summaryTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: colors.bannerBg };
    sheet.getRow(3).height = 26;

    sheet.addRow(['البند المالي', 'المبلغ بالتفصيل (د.م.)']);
    const summaryHeader = sheet.getRow(4);
    summaryHeader.height = 24;
    summaryHeader.font = { bold: true, color: { argb: colors.primaryText }, name: fontName };
    summaryHeader.alignment = { horizontal: 'right', vertical: 'middle' };
    for (let c = 1; c <= 2; c++) {
      summaryHeader.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerBg } };
      summaryHeader.getCell(c).border = thinBorder;
    }

    const summaryRows = [
      ['إجمالي التركة (التركة الخام)', grossEstateNum],
      ['الديون والالتزامات المستقطعة', -deductionsNum],
      ['الوصايا الشرعية المنفذة', -willsCostNum],
      ['صافي التركة للورثة المستحقين', { formula: 'SUM(B5:B7)', result: netEstateNum }]
    ];

    summaryRows.forEach((r, idx) => {
      const row = sheet.addRow(r);
      row.height = 22;
      row.getCell(2).numFmt = currencyFmt;
      row.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
      row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };

      const isTotalRow = idx === 3;
      const rFont = {
        bold: isTotalRow,
        color: { argb: isTotalRow ? colors.successText : colors.textDark },
        name: fontName,
        size: 10
      };

      for (let c = 1; c <= 2; c++) {
        const cell = row.getCell(c);
        cell.font = rFont;
        cell.border = isTotalRow ? doubleBorder : thinBorder;
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isTotalRow ? colors.successBg : 'FFFFFF' }
        };
      }
    });

    // Spacer
    sheet.addRow([]);

    // 3. Heirs Section Table
    sheet.addRow(['أنصبة الورثة المستحقين']);
    const heirsSecIdx = sheet.rowCount;
    sheet.mergeCells(`A${heirsSecIdx}:F${heirsSecIdx}`);
    const heirsTitleCell = sheet.getRow(heirsSecIdx).getCell(1);
    heirsTitleCell.font = { size: 11, bold: true, color: { argb: colors.primaryText }, name: fontName };
    heirsTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: colors.bannerBg };
    sheet.getRow(heirsSecIdx).height = 26;

    sheet.addRow(['الوارث المستحق', 'عدد الأفراد', 'نصيب الفرد', 'نصيب الفرد مئوياً', 'نصيب الفرد (د.م.)', 'إجمالي الفئة (د.م.)']);
    const heirsHeaderRowIdx = sheet.rowCount;
    const heirsHeader = sheet.getRow(heirsHeaderRowIdx);
    heirsHeader.height = 24;
    heirsHeader.font = { bold: true, color: { argb: colors.primaryText }, name: fontName };
    heirsHeader.alignment = { horizontal: 'center', vertical: 'middle' };
    for (let c = 1; c <= 6; c++) {
      heirsHeader.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerBg } };
      heirsHeader.getCell(c).border = thinBorder;
    }

    // Common denominator calculations
    const heirsList = result.distributions.filter(d => !d.relationship.startsWith('WILL_'));
    const parsed = heirsList.filter(d => d.percentage > 0).map(d => {
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
      if (p.den > 0) commonDen = lcm(commonDen, p.den);
      if (p.classDen > 0) commonDen = lcm(commonDen, p.classDen);
    }

    heirsList.forEach((d) => {
      const isCalculated = d.percentage > 0;
      let individualShareFractStr = d.individual_share_fraction || d.share_fraction;

      if (isCalculated) {
        const p = parsed.find(x => x.dist.relationship === d.relationship);
        if (p) {
          const scale = commonDen / p.den;
          individualShareFractStr = `${p.num * scale}/${commonDen}`;
        }
      }

      const rowIdx = sheet.rowCount + 1;
      const indPercentage = d.individual_percentage ?? d.percentage;

      const row = sheet.addRow([
        d.relationship_display,
        Number(d.count) || 0,
        individualShareFractStr,
        (Number(indPercentage) || 0) / 100,
        { formula: `D${rowIdx}*B$8`, result: Number(d.per_person_value) || 0 },
        { formula: `B${rowIdx}*E${rowIdx}`, result: Number(d.total_value) || 0 }
      ]);
      row.height = 22;
      row.getCell(4).numFmt = '0.00%';
      row.getCell(5).numFmt = currencyFmt;
      row.getCell(6).numFmt = currencyFmt;

      // Alignment
      row.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
      row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell(6).alignment = { horizontal: 'left', vertical: 'middle' };

      for (let c = 1; c <= 6; c++) {
        const cell = row.getCell(c);
        cell.font = { name: fontName, size: 10, color: { argb: colors.textDark } };
        cell.border = thinBorder;
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' }
        };
      }
    });

    // 4. Wills Table
    const willsList = result.distributions.filter(d => d.relationship.startsWith('WILL_'));
    if (willsList.length > 0) {
      sheet.addRow([]);
      sheet.addRow(['الوصايا الشرعية المنفذة']);
      const willsTitleRowIdx = sheet.rowCount;
      sheet.mergeCells(`A${willsTitleRowIdx}:F${willsTitleRowIdx}`);
      const willsTitleCell = sheet.getRow(willsTitleRowIdx).getCell(1);
      willsTitleCell.font = { size: 11, bold: true, color: { argb: colors.primaryText }, name: fontName };
      willsTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: colors.bannerBg };
      sheet.getRow(willsTitleRowIdx).height = 26;

      sheet.addRow(['الوصية المنفذة', '', 'نصيب الوصية', 'النسبة المئوية', 'نصيب الفرد (د.م.)', 'القيمة المالية للوصية (د.م.)']);
      const willsHeaderRowIdx = sheet.rowCount;
      const willsHeader = sheet.getRow(willsHeaderRowIdx);
      willsHeader.height = 24;
      willsHeader.font = { bold: true, color: { argb: colors.primaryText }, name: fontName };
      willsHeader.alignment = { horizontal: 'center', vertical: 'middle' };
      for (let c = 1; c <= 6; c++) {
        willsHeader.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerBg } };
        willsHeader.getCell(c).border = thinBorder;
      }

      willsList.forEach((d) => {
        const rowIdx = sheet.rowCount + 1;
        const row = sheet.addRow([
          d.relationship_display,
          '-',
          d.share_fraction,
          (Number(d.percentage) || 0) / 100,
          '-',
          { formula: `D${rowIdx}*(B$5+B$6)`, result: Number(d.total_value) || 0 } // Gross Estate B5 + Debts B6
        ]);
        row.height = 22;
        row.getCell(4).numFmt = '0.00%';
        row.getCell(6).numFmt = currencyFmt;

        row.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
        row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(6).alignment = { horizontal: 'left', vertical: 'middle' };

        for (let c = 1; c <= 6; c++) {
          const cell = row.getCell(c);
          cell.font = { name: fontName, size: 10, color: { argb: colors.textDark } };
          cell.border = thinBorder;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF' }
          };
        }
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    downloadBlob(new Blob([buffer]), `تقرير_الميراث_${result.deceased_name}.xlsx`);
  } catch (e) {
    console.error('Excel export failed internally', e);
    throw e;
  }
}
