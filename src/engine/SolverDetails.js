/**
 * @file SolverDetails.js
 * @description Generates pedagogical, step-by-step breakdown data structures (خطوات الحل والشرح الفقهي)
 * for standard inheritance cases and Moroccan mandatory bequest (الوصية الواجبة) workflows.
 */

import Fraction from "../fraction.js";
import { HEIR_NAMES_AR, getParentDesignation, getParentLabel } from "./Explanations.js";

/**
 * Computes the Greatest Common Divisor of two numbers.
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

/**
 * Computes the Least Common Multiple of two numbers.
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
const lcm = (a, b) => (a * b) / gcd(a, b);

/**
 * Generates pedagogical steps for standard inheritance cases (without mandatory bequests).
 * 
 * Step 1: Jurisprudential Blocking & Share Assignment (فقه حجب الورثة وتوجيه السهام).
 * Step 2: Base Origin Determination (تأصيل المسألة والقاسم المشترك).
 * Step 3: Breakdown & Currency Distribution (تصحيح المسألة وإخراج نصيب كل فرد).
 * 
 * @param {import('./Calculator.js').InheritanceCalculator} calc - Calculator instance.
 * @param {Object} awlResult - Result from checkAndApplyAwl.
 * @returns {Array<{id: string, title: string, desc: string, table: Array<Object>}>} Array of step objects.
 */
export function getStandardSteps(calc, awlResult) {
    const steps = [];

    // =========================================================================
    // Step 1: Explanations Table (الفروض وتوجيه السهام الفقهية)
    // =========================================================================
    const step1Table = [];
    for (const h of Object.values(calc.heirs)) {
        const rel = h.relationship;
        const initialDist = (calc.initial_shares && calc.initial_shares[rel]) || calc.results[rel];
        let shareStr = '—';
        if (initialDist && !h.is_blocked) {
            shareStr = initialDist.share.toString();
        }
        step1Table.push({
            name: h.displayName,
            share: shareStr,
            why: calc.explanations[rel] || (h.is_blocked ? 'محجوب من الميراث.' : 'يرث نصيبه الشرعي.')
        });
    }

    steps.push({
        id: 'std_step1',
        title: 'أولاً: فقه حجب الورثة وتوجيه السهام',
        desc: 'تحديد نصيب كل وارث بناءً على القواعد الفقهية وحجبه حجب حرمان أو حجب نقصان مع التوضيح الفقهي:',
        table: step1Table
    });

    // =========================================================================
    // Step 2: Base Origin Table (تأصيل المسألة)
    // =========================================================================
    let baseOrigin = 1;
    let hasFractions = false;
    const activeInitialEntries = Object.entries(calc.initial_shares || calc.results).filter(([rel]) => {
        const heir = calc.heirs[rel];
        return heir && !heir.is_blocked;
    });

    for (const [, d] of activeInitialEntries) {
        const str = d.share.toString();
        if (str.includes('/')) {
            hasFractions = true;
            const den = parseInt(str.split('/')[1], 10) || 1;
            baseOrigin = lcm(baseOrigin, den);
        }
    }

    // If no fractions (all Asabah), base origin is sum of male(2) and female(1) heads
    if (!hasFractions && activeInitialEntries.length > 0) {
        let totalHeads = 0;
        for (const [rel, d] of activeInitialEntries) {
            const heir = calc.heirs[rel];
            const count = d.count || (heir ? heir.count : 1);
            if (rel === 'SON' || rel === 'FULL_BROTHER' || rel === 'PATERNAL_BROTHER' || rel === 'GRANDSON') {
                totalHeads += count * 2;
            } else if (rel === 'DAUGHTER' || rel === 'FULL_SISTER' || rel === 'PATERNAL_SISTER' || rel === 'GRANDDAUGHTER') {
                totalHeads += count * 1;
            } else {
                totalHeads += count;
            }
        }
        baseOrigin = totalHeads > 0 ? totalHeads : 1;
    }

    const step2Table = [];
    let sumInitialSharesVal = 0;
    for (const h of Object.values(calc.heirs)) {
        if (h.is_blocked) continue;
        const initialDist = (calc.initial_shares && calc.initial_shares[h.relationship]) || calc.results[h.relationship];
        if (initialDist) {
            const fractionVal = parseFloat(initialDist.share.valueOf());
            sumInitialSharesVal += fractionVal;
            const numeratorInBase = Math.round(fractionVal * baseOrigin);
            step2Table.push({
                name: h.displayName,
                share: `${numeratorInBase}/${baseOrigin}`
            });
        }
    }

    let step2ResultText = '';
    if (awlResult && awlResult.isAul) {
        step2ResultText = `أصل المسألة المستخرج هو ${baseOrigin}، وعالت المسألة بزيادة السهام المفروضة (${awlResult.sumShares.toString()}) إلى ${awlResult.sumShares.numerator}، فصار أصل المسألة العائل هو ${awlResult.sumShares.numerator}.`;
    } else if (sumInitialSharesVal < 0.999 && activeInitialEntries.length === 1 && (calc.heirs['HUSBAND'] || calc.heirs['WIFE'])) {
        const spouseKey = calc.heirs['HUSBAND'] ? 'HUSBAND' : 'WIFE';
        const spouseShare = calc.initial_shares ? calc.initial_shares[spouseKey].share.toString() : '1/4';
        step2ResultText = `أصل المسألة هو ${baseOrigin} (مخرج فرض ${spouseShare})، ورد باقي التركة (${baseOrigin - 1} أسهم من أصل ${baseOrigin}) إلى ${calc.heirs[spouseKey].displayName} بالرد لانفرادها وعدم وجود وارث آخر، فاستغرقت التركة كاملة (1/1).`;
    } else if (sumInitialSharesVal < 0.999 && !activeInitialEntries.some(([, d]) => d.asabah)) {
        const sumSharesNum = step2Table.reduce((acc, row) => {
            const num = parseInt(row.share.split('/')[0], 10) || 0;
            return acc + num;
        }, 0);
        step2ResultText = `أصل المسألة هو ${baseOrigin}، ومجموع سهام الفروض (${sumSharesNum}) أقل من أصل المسألة ولا يوجد عاصب، فرُدّت المسألة إلى مجموع السهام (${sumSharesNum}).`;
    } else {
        step2ResultText = `أصل المسألة هو ${baseOrigin} (القاسم المشترك لمخارج الفروض والسهام).`;
    }

    steps.push({
        id: 'std_step2',
        title: 'ثانياً: تأصيل المسألة',
        desc: 'استخراج أصل المسألة (القاسم المشترك الأصغر للسهام) وتوزيع السهام قبل تصحيح انكسارها على الرؤوس:',
        table: step2Table,
        result_text: step2ResultText
    });

    // =========================================================================
    // Step 3: Correction & Final Shares Table (تصحيح المسألة وتوزيع الأنصبة)
    // =========================================================================
    const scaleFactor = calc.heirs_scale_fraction || new Fraction(1);
    const activeHeirs = Object.entries(calc.results).map(([rel, d]) => {
        const heirObj = calc.heirs[rel];
        const finalShare = d.share.mul(scaleFactor);
        let displayName = heirObj ? heirObj.displayName : rel;
        if (rel === 'TREASURY') {
            displayName = 'بيت المال';
        }
        return {
            name: displayName,
            count: d.count,
            share: finalShare.toString(),
            percentage: Math.round(parseFloat(finalShare.valueOf()) * 10000) / 100
        };
    });

    let commonDen = 1;
    for (const h of activeHeirs) {
        if (h.share.includes('/')) {
            const den = parseInt(h.share.split('/')[1], 10) || 1;
            commonDen = lcm(commonDen, den);
        }
    }

    const step3FormattedTable = activeHeirs.map(h => {
        let num = parseInt(h.share, 10) || 0;
        let den = 1;
        if (h.share.includes('/')) {
            num = parseInt(h.share.split('/')[0], 10) || 0;
            den = parseInt(h.share.split('/')[1], 10) || 1;
        }
        const scaledNum = num * (commonDen / den);
        const value = calc.net_estate * (num / den);
        return {
            name: h.name,
            count: h.count,
            share: `${scaledNum}/${commonDen}`,
            percentage: h.percentage,
            value: value
        };
    });

    steps.push({
        id: 'std_step3',
        title: 'ثالثاً: تصحيح المسألة وإخراج نصيب كل فرد',
        desc: 'قسمة السهام على عدد الرؤوس عند انكسارها وتوزيع القيمة المالية للتركة على الورثة بالتفصيل:',
        table: step3FormattedTable
    });

    return steps;
}

/**
 * Generates pedagogical step-by-step breakdown tables for Moroccan Mandatory Bequests (قانون الوصية الواجبة المغربي).
 * 
 * Steps Produced:
 * - Step 1: Checking eligibility without mandatory bequest (التحقق من استحقاق الوصية الواجبة).
 * - Step 2: Preliminary case assuming deceased parent is alive (العمل التمهيدي).
 * - Step 3: Sub-problem distributing each branch's share to descendants (قسمة مقدار الوصية الواجبة على أصحابها).
 * - Step 4: Final consolidated distribution table across all heirs and bequest beneficiaries.
 * 
 * @param {import('./Calculator.js').InheritanceCalculator} calc - Calculator instance.
 * @param {Object} awlResult - Result from checkAndApplyAwl.
 * @returns {Array<{id: string, title: string, desc: string, table: Array<Object>, result_text?: string}>} Array of step objects.
 */
export function getMandatoryBequestSteps(calc, awlResult) {
    if (!calc.case.mandatoryBequests || calc.case.mandatoryBequests.length === 0) {
        return [];
    }

    const steps = [];

    let voluntaryWillsFraction = new Fraction(0);
    if (!calc.heirs_approved_excess) {
        for (const will of calc.wills_input || []) {
            if (will.valueType === 'fraction') {
                const parts = (will.value || '1/3').split('/');
                const num = parseInt(parts[0], 10) || 0;
                const den = parseInt(parts[1], 10) || 1;
                voluntaryWillsFraction = voluntaryWillsFraction.add(new Fraction(num, den));
            } else if (will.valueType === 'percentage') {
                const val = parseInt(will.value, 10) || 0;
                voluntaryWillsFraction = voluntaryWillsFraction.add(new Fraction(val, 100));
            }
        }
        if (voluntaryWillsFraction.greaterThan(new Fraction(1, 3))) {
            voluntaryWillsFraction = new Fraction(1, 3);
        }
    }
    const scaleFactorForWills = new Fraction(1).sub(voluntaryWillsFraction);

    // =========================================================================
    // STEP 1: Dry run to check who inherits without mandatory bequest
    // =========================================================================
    const step1HeirsList = [];
    for (const h of calc.case.heirs) {
        step1HeirsList.push({ relationship: h.relationship, count: h.count || 1 });
    }

    let step1SonIndex = 0;
    let step1DaughterIndex = 0;
    for (const mb of calc.case.mandatoryBequests) {
        if (mb.type === 'son') {
            step1SonIndex++;
            const parentDesig = getParentDesignation(mb, step1SonIndex);
            const totalSons = parseInt(mb.sonsCount, 10) || 0;
            const totalDaughters = parseInt(mb.daughtersCount, 10) || 0;
            const totalGreatSons = parseInt(mb.greatSonsCount, 10) || 0;
            const totalGreatDaughters = parseInt(mb.greatDaughtersCount, 10) || 0;
            if (totalSons > 0) step1HeirsList.push({ relationship: 'GRANDSON', count: totalSons, displayName: `ابن ابن ${parentDesig}` });
            if (totalDaughters > 0) step1HeirsList.push({ relationship: 'GRANDDAUGHTER', count: totalDaughters, displayName: `بنت ابن ${parentDesig}` });
            if (totalGreatSons > 0) step1HeirsList.push({ relationship: 'GREAT_GRANDSON', count: totalGreatSons, displayName: `ابن ابن ابن ${parentDesig}` });
            if (totalGreatDaughters > 0) step1HeirsList.push({ relationship: 'GREAT_GRANDDAUGHTER', count: totalGreatDaughters, displayName: `بنت ابن ابن ${parentDesig}` });
        } else if (mb.type === 'daughter') {
            step1DaughterIndex++;
        }
    }

    const step1Case = {
        ...calc.case,
        heirs: step1HeirsList,
        mandatoryBequests: []
    };
    const calc1 = new calc.constructor(step1Case);
    for (const h of step1HeirsList) {
        if (h.displayName && calc1.heirs[h.relationship]) {
            calc1.heirs[h.relationship].displayName = h.displayName;
        }
    }
    const res1 = calc1.calculate();

    const step1Table = res1.distributions.map(d => {
        const heirObj = calc1.heirs[d.relationship];
        const isBlocked = heirObj ? heirObj.is_blocked : false;
        return {
            name: d.relationship_display,
            count: d.count,
            share: isBlocked ? '—' : d.share_fraction,
            percentage: isBlocked ? 0 : d.percentage,
            status: isBlocked ? 'غير وارث ويستحق الوصية الواجبة' : 'وارث بدون الوصية الواجبة',
            why: d.why
        };
    });

    // Manually add daughter's non-heir children to step 1 table
    let step1DaughterIndex2 = 0;
    for (const mb of calc.case.mandatoryBequests) {
        if (mb.type === 'daughter') {
            step1DaughterIndex2++;
            const parentDesig = getParentDesignation(mb, step1DaughterIndex2);
            const totalSons = parseInt(mb.sonsCount, 10) || 0;
            const totalDaughters = parseInt(mb.daughtersCount, 10) || 0;
            if (totalSons > 0) {
                step1Table.push({
                    name: `ابن بنت ${parentDesig}`,
                    count: totalSons,
                    share: '—',
                    percentage: 0,
                    status: 'غير وارث ويستحق الوصية الواجبة',
                    why: 'ولد البنت لا يرث مع وجود صاحب فرض أو عاصب لأنه من ذوي الأرحام.'
                });
            }
            if (totalDaughters > 0) {
                step1Table.push({
                    name: `بنت بنت ${parentDesig}`,
                    count: totalDaughters,
                    share: '—',
                    percentage: 0,
                    status: 'غير وارث ويستحق الوصية الواجبة',
                    why: 'ولد البنت لا يرث مع وجود صاحب فرض أو عاصب لأنه من ذوي الأرحام.'
                });
            }
        }
    }

    steps.push({
        id: 'step1',
        title: 'أولاً: التحقق من استحقاق الوصية الواجبة',
        desc: 'معرفة ما إذا كان أولاد الأبناء المتوفين وارثين بدون تطبيق الوصية الواجبة أم لا، فإذا كانوا وارثين ولو لقدر يسير من التركة فلا يتم تطبيق قانون الوصية الواجبة عليهم:',
        table: step1Table
    });

    // =========================================================================
    // STEP 2: Preliminary calculation assuming all deceased children are alive
    // =========================================================================
    const tempHeirsMap = {};
    for (const h of Object.values(calc.heirs)) {
        if (!h.is_blocked && h.count > 0) {
            tempHeirsMap[h.relationship] = h.count;
        }
    }

    let deceasedSonsCount = 0;
    let deceasedDaughtersCount = 0;
    let virtualGrandsonCount = 0;

    const hasLivingGrandchildrenAsHeirs = (calc.heirs['GRANDSON'] && !calc.heirs['GRANDSON'].is_blocked) ||
        (calc.heirs['GRANDDAUGHTER'] && !calc.heirs['GRANDDAUGHTER'].is_blocked);

    for (const mb of calc.case.mandatoryBequests) {
        if (mb.type === 'son') {
            if (hasLivingGrandchildrenAsHeirs) {
                virtualGrandsonCount++;
            } else {
                deceasedSonsCount++;
            }
        } else if (mb.type === 'daughter') {
            deceasedDaughtersCount++;
        }
    }

    if (deceasedSonsCount > 0) {
        tempHeirsMap['SON'] = (tempHeirsMap['SON'] || 0) + deceasedSonsCount;
    }
    if (virtualGrandsonCount > 0) {
        tempHeirsMap['GRANDSON'] = (tempHeirsMap['GRANDSON'] || 0) + virtualGrandsonCount;
    }
    if (deceasedDaughtersCount > 0) {
        tempHeirsMap['DAUGHTER'] = (tempHeirsMap['DAUGHTER'] || 0) + deceasedDaughtersCount;
    }

    const step2HeirsList = Object.entries(tempHeirsMap).map(([relationship, count]) => ({
        relationship,
        count
    }));

    const step2Case = {
        ...calc.case,
        heirs: step2HeirsList,
        mandatoryBequests: []
    };
    const calc2 = new calc.constructor(step2Case);
    if (calc2.heirs['SON']) calc2.heirs['SON'].displayName = 'ابن';
    if (calc2.heirs['DAUGHTER']) calc2.heirs['DAUGHTER'].displayName = 'بنت';
    if (calc2.heirs['GRANDSON']) calc2.heirs['GRANDSON'].displayName = 'ابن ابن';
    const res2 = calc2.calculate();

    const step2Table = res2.distributions.map(d => {
        const heirObj = calc2.heirs[d.relationship];
        const isBlocked = heirObj ? heirObj.is_blocked : false;
        return {
            name: d.relationship_display,
            count: d.count,
            share: isBlocked ? '—' : d.share_fraction,
            percentage: isBlocked ? 0 : d.percentage,
            why: d.why
        };
    });

    let singleSonShare = new Fraction(0);
    if (res2.distributions.find(d => d.relationship === 'SON')) {
        const d = res2.distributions.find(d => d.relationship === 'SON');
        const parts = d.share_fraction.split('/');
        const num = parseInt(parts[0], 10) || 0;
        const den = parts[1] ? parseInt(parts[1], 10) : 1;
        singleSonShare = new Fraction(num, den).mul(scaleFactorForWills).div(new Fraction(d.count || 1));
    }
    let singleDaughterShare = new Fraction(0);
    if (res2.distributions.find(d => d.relationship === 'DAUGHTER')) {
        const d = res2.distributions.find(d => d.relationship === 'DAUGHTER');
        const parts = d.share_fraction.split('/');
        const num = parseInt(parts[0], 10) || 0;
        const den = parts[1] ? parseInt(parts[1], 10) : 1;
        singleDaughterShare = new Fraction(num, den).mul(scaleFactorForWills).div(new Fraction(d.count || 1));
    }
    let singleGrandsonShare = new Fraction(0);
    if (res2.distributions.find(d => d.relationship === 'GRANDSON')) {
        const d = res2.distributions.find(d => d.relationship === 'GRANDSON');
        const parts = d.share_fraction.split('/');
        const num = parseInt(parts[0], 10) || 0;
        const den = parts[1] ? parseInt(parts[1], 10) : 1;
        singleGrandsonShare = new Fraction(num, den).mul(scaleFactorForWills).div(new Fraction(d.count || 1));
    }

    const resultTextParts = [];
    let sIdx2 = 0;
    let dIdx2 = 0;
    for (const mb of calc.case.mandatoryBequests) {
        if (mb.type === 'son') sIdx2++;
        else if (mb.type === 'daughter') dIdx2++;

        const label = mb.type === 'son' ? getParentLabel(mb, sIdx2) : getParentLabel(mb, dIdx2);

        let parentShare = new Fraction(0);
        if (mb.type === 'son') {
            parentShare = hasLivingGrandchildrenAsHeirs ? singleGrandsonShare : singleSonShare;
        } else {
            parentShare = singleDaughterShare;
        }

        resultTextParts.push(`نصيب ${label} الافتراضي في التركة هو: ${parentShare.toString()}`);
    }

    steps.push({
        id: 'step2',
        title: 'ثانياً: العمل التمهيدي (افتراض حياة أصول الفروع المتوفين)',
        desc: 'ندخل إلى المسألة أصول الفروع المتوفين باعتبارهم أحياء لتقدير نصيب كل منهم الافتراضي في التركة:',
        table: step2Table,
        result_text: resultTextParts.join('\n')
    });

    // =========================================================================
    // STEP 3: Sub-problem distributions within each branch
    // =========================================================================
    let bSonIdx = 0;
    let bDaughterIdx = 0;
    const multipleBranches = calc.case.mandatoryBequests.length > 1;

    for (let bIdx = 0; bIdx < calc.case.mandatoryBequests.length; bIdx++) {
        const mb = calc.case.mandatoryBequests[bIdx];
        if (mb.type === 'son') bSonIdx++;
        else if (mb.type === 'daughter') bDaughterIdx++;

        const branchLabel = mb.type === 'son' ? getParentLabel(mb, bSonIdx) : getParentLabel(mb, bDaughterIdx);

        let parentShare = new Fraction(0);
        if (mb.type === 'son') {
            parentShare = hasLivingGrandchildrenAsHeirs ? singleGrandsonShare : singleSonShare;
        } else {
            parentShare = singleDaughterShare;
        }
        const parentShareStr = parentShare.toString();

        const step3HeirsList = [];
        const totalSons = parseInt(mb.sonsCount, 10) || 0;
        const totalDaughters = parseInt(mb.daughtersCount, 10) || 0;
        const totalGreatSons = parseInt(mb.greatSonsCount, 10) || 0;
        const totalGreatDaughters = parseInt(mb.greatDaughtersCount, 10) || 0;
        const hasGreat = totalGreatSons > 0 || totalGreatDaughters > 0;

        if (hasGreat) {
            // Deceased is the grandson
            if (totalGreatSons > 0) step3HeirsList.push({ relationship: 'SON', count: totalGreatSons, displayName: 'ابن' });
            if (totalGreatDaughters > 0) step3HeirsList.push({ relationship: 'DAUGHTER', count: totalGreatDaughters, displayName: 'بنت' });
            if (mb.greatSpouseAlive) {
                step3HeirsList.push({ relationship: 'WIFE', count: 1, displayName: 'زوجـة' });
            }
            if (mb.spouseAlive) {
                step3HeirsList.push({ relationship: 'MOTHER', count: 1, displayName: 'أم' });
            }
            if (mb.motherAlive) {
                step3HeirsList.push({ relationship: 'FATHER_MOTHER', count: 1, displayName: 'أم الأب' });
            }
            const hasGF = calc.case.heirs.some(h => h.relationship === 'PATERNAL_GRANDFATHER' || h.relationship === 'FATHER');
            if (hasGF) {
                step3HeirsList.push({ relationship: 'PATERNAL_GRANDFATHER', count: 1, displayName: 'أب أب الأب' });
            }
            const hasGM = calc.case.heirs.some(h => h.relationship === 'MOTHER' || h.relationship === 'MATERNAL_GRANDMOTHER' || h.relationship === 'PATERNAL_GRANDMOTHER');
            if (hasGM) {
                step3HeirsList.push({ relationship: 'MOTHER_MOTHER', count: 1, displayName: 'أم أب الأب' });
            }
        } else {
            // Deceased is the son/daughter
            if (totalSons > 0) step3HeirsList.push({ relationship: 'SON', count: totalSons, displayName: 'ابن' });
            if (totalDaughters > 0) step3HeirsList.push({ relationship: 'DAUGHTER', count: totalDaughters, displayName: 'بنت' });
            if (mb.spouseAlive) {
                const spouseRel = mb.type === 'son' ? 'WIFE' : 'HUSBAND';
                const spouseName = mb.type === 'son' ? 'زوجـة' : 'زوج';
                step3HeirsList.push({ relationship: spouseRel, count: 1, displayName: spouseName });
            }
            if (mb.motherAlive) {
                step3HeirsList.push({ relationship: 'MOTHER', count: 1, displayName: 'أم' });
            } else {
                const hasGM = calc.case.heirs.some(h => h.relationship === 'MOTHER' || h.relationship === 'MATERNAL_GRANDMOTHER' || h.relationship === 'PATERNAL_GRANDMOTHER');
                if (hasGM) {
                    step3HeirsList.push({ relationship: 'PATERNAL_GRANDMOTHER', count: 1, displayName: 'أم الأب' });
                }
            }
            const hasGF = calc.case.heirs.some(h => h.relationship === 'PATERNAL_GRANDFATHER' || h.relationship === 'FATHER');
            if (hasGF) {
                step3HeirsList.push({ relationship: 'PATERNAL_GRANDFATHER', count: 1, displayName: 'أب الأب' });
            }
        }

        const step3Case = {
            ...calc.case,
            heirs: step3HeirsList.map(h => ({ relationship: h.relationship, count: h.count })),
            mandatoryBequests: []
        };
        const calc3 = new calc.constructor(step3Case);
        for (const h of step3HeirsList) {
            if (h.displayName && calc3.heirs[h.relationship]) {
                calc3.heirs[h.relationship].displayName = h.displayName;
            }
        }

        const res3 = calc3.calculate();

        const step3Table = res3.distributions.map(d => {
            return {
                name: d.relationship_display,
                count: d.count,
                share: d.share_fraction,
                percentage: d.percentage,
                why: d.why
            };
        });

        const mbResultEntry = calc.mandatory_bequests_result.list.find(l => l.id === mb.id);
        let branchBequestFract = '0';
        if (mbResultEntry) {
            let sum = new Fraction(0);
            for (const kid of mbResultEntry.kids) {
                sum = sum.add(kid.share);
            }
            branchBequestFract = sum.toString();
        }

        const titlePrefix = multipleBranches ? `ثالثاً (${bIdx + 1}):` : 'ثالثاً:';
        steps.push({
            id: `step3_${mb.id}`,
            title: `${titlePrefix} قسمة مقدار الوصية الواجبة لفرع ${branchLabel} على مستحقيها`,
            desc: `نقوم بتقسيم نصيب ${branchLabel} الافتراضي (${parentShareStr}) على فروعه بعد استنزال أنصبة ورثته الافتراضيين:`,
            table: step3Table,
            result_text: `نصيب الواحد من التركة كلها هو نصيب كل فرد مضروباً في قيمة ما يخصهم من حق أصلهم (${parentShareStr}). إجمالي نصيب مستحقي الوصية الواجبة لهذا الفرع هو: ${branchBequestFract} (وهو ليس أكبر من الثلث).`
        });
    }

    // =========================================================================
    // STEP 4: Distribution of remaining estate across all parties
    // =========================================================================
    const scaleFactor4 = calc.heirs_scale_fraction || new Fraction(1);
    const activeHeirs = [];
    for (const [rel, d] of Object.entries(calc.results)) {
        const heirObj = calc.heirs[rel];
        const finalShare = d.share.mul(scaleFactor4);
        if (heirObj && heirObj.branches && heirObj.branches.length > 1) {
            const count = d.count;
            const indShare = count > 1 ? finalShare.div(new Fraction(count)) : finalShare;
            for (const b of heirObj.branches) {
                const bShare = indShare.mul(new Fraction(b.count));
                const nameMap = {
                    'GRANDSON': 'ابن ابن',
                    'GRANDDAUGHTER': 'بنت ابن',
                    'GREAT_GRANDSON': 'ابن ابن ابن',
                    'GREAT_GRANDDAUGHTER': 'بنت ابن ابن'
                };
                const baseName = nameMap[rel] || HEIR_NAMES_AR[rel] || rel;
                const bDisplayName = b.designation ? `${baseName} ${b.designation}` : baseName;
                activeHeirs.push({
                    name: bDisplayName,
                    count: b.count,
                    share: bShare.toString(),
                    percentage: Math.round(parseFloat(bShare.valueOf()) * 10000) / 100
                });
            }
        } else {
            let displayName = heirObj ? heirObj.displayName : rel;
            if (rel === 'TREASURY') {
                displayName = 'بيت المال';
            }
            activeHeirs.push({
                name: displayName,
                count: d.count,
                share: finalShare.toString(),
                percentage: Math.round(parseFloat(finalShare.valueOf()) * 10000) / 100
            });
        }
    }

    if (calc.mandatory_bequests_result && calc.mandatory_bequests_result.list) {
        let mbSonIndex = 0;
        let mbDaughterIndex = 0;
        for (const mb of calc.mandatory_bequests_result.list) {
            let parentDesig = '';
            if (mb.type === 'son') {
                mbSonIndex++;
                parentDesig = getParentDesignation(mb, mbSonIndex);
            } else {
                mbDaughterIndex++;
                parentDesig = getParentDesignation(mb, mbDaughterIndex);
            }
            for (const kid of mb.kids) {
                let relationshipDisplay = '';
                if (kid.type === 'grandson') relationshipDisplay = `ابن ابن ${parentDesig}`;
                else if (kid.type === 'granddaughter') relationshipDisplay = `بنت ابن ${parentDesig}`;
                else if (kid.type === 'great_grandson') relationshipDisplay = `ابن ابن ابن ${parentDesig}`;
                else if (kid.type === 'great_granddaughter') relationshipDisplay = `بنت ابن ابن ${parentDesig}`;
                else if (kid.type === 'grandson_of_daughter') relationshipDisplay = `ابن بنت ${parentDesig}`;
                else if (kid.type === 'granddaughter_of_daughter') relationshipDisplay = `بنت بنت ${parentDesig}`;

                activeHeirs.push({
                    name: relationshipDisplay,
                    count: kid.count,
                    share: kid.share.mul(new Fraction(kid.count)).toString(),
                    percentage: Math.round(parseFloat(kid.share.valueOf()) * kid.count * 10000) / 100
                });
            }
        }
    }

    if (calc.wills_executed && calc.wills_executed.length > 0) {
        const mbFract = (calc.mandatory_bequests_result && calc.mandatory_bequests_result.fraction) || new Fraction(0);
        const scaleRemaining = new Fraction(1).sub(mbFract);
        for (const will of calc.wills_executed) {
            const executedFraction = will.executed_fraction_obj || new Fraction(will.executed_fraction_share || '0');
            const willEntireEstateFraction = executedFraction.mul(scaleRemaining);
            activeHeirs.push({
                name: `مُوصَىٰ له بـ ${will.name || 'وصية'}`,
                count: '-',
                share: willEntireEstateFraction.toString(),
                percentage: Math.round(parseFloat(willEntireEstateFraction.valueOf()) * 10000) / 100
            });
        }
    }

    let commonDen = 1;
    for (const h of activeHeirs) {
        if (h.share.includes('/')) {
            const den = parseInt(h.share.split('/')[1], 10) || 1;
            commonDen = lcm(commonDen, den);
        }
    }

    const step4Table = activeHeirs.map(h => {
        let num = parseInt(h.share, 10) || 0;
        let den = 1;
        if (h.share.includes('/')) {
            num = parseInt(h.share.split('/')[0], 10) || 0;
            den = parseInt(h.share.split('/')[1], 10) || 1;
        }
        const scaledNum = num * (commonDen / den);
        return {
            name: h.name,
            count: h.count,
            share: `${scaledNum}/${commonDen}`,
            percentage: h.percentage,
            status: 'نصيب نهائي من التركة'
        };
    });

    steps.push({
        id: 'step4',
        title: 'رابعاً: جدول الورثة والأنصبة النهائية من التركة كلها',
        desc: 'بعد خصم نصيب الوصية الواجبة من التركة، يتم توزيع باقي التركة على الورثة الآخرين وفق أنصبتهم الأصلية:',
        table: step4Table
    });

    return steps;
}
