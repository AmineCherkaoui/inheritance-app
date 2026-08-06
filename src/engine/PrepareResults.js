import Fraction from '../fraction.js';
import { formatExplanation } from './Explanations.js';

export function executeWills(willsInput, netEstate, heirsApprovedExcess) {
    let totalWillsValue = 0;
    const processedWills = [];
    let totalWillsFraction = new Fraction(0);
    const oneThirdFraction = new Fraction(1, 3);
    const netEstateInt = Math.round(netEstate * 100);

    for (const will of willsInput) {
        let val = 0;
        let reqFraction = new Fraction(0);

        if (will.valueType === 'percentage') {
            const pct = parseFloat(will.value) || 0;
            val = (pct / 100) * netEstate;
            reqFraction = new Fraction(Math.round(pct * 100), 10000);
        } else if (will.valueType === 'fraction') {
            const parts = (will.value || '1/3').split('/');
            const num = parseInt(parts[0]) || 0;
            const den = parseInt(parts[1]) || 1;
            val = (num / den) * netEstate;
            reqFraction = new Fraction(num, den);
        } else {
            val = parseFloat(will.value) || 0;
            reqFraction = new Fraction(Math.round(val * 100), netEstateInt || 1);
        }

        totalWillsValue += val;
        totalWillsFraction = totalWillsFraction.add(reqFraction);

        processedWills.push({
            name: will.name || 'وصية غير مسماة',
            requested_value: val,
            executed_value: val,
            type: will.valueType,
            original_value: will.value,
            requested_fraction: reqFraction,
            executed_fraction: reqFraction
        });
    }

    const oneThirdLimit = netEstate / 3;
    let finalWillsCost = totalWillsValue;
    let willsExplanation = '';
    let isWillsScaled = false;

    const limitExceeded = totalWillsFraction.greaterThan(oneThirdFraction);

    if (limitExceeded && !heirsApprovedExcess) {
        isWillsScaled = true;
        willsExplanation = `مجموع الوصايا تجاوز ثلث التركة المسموح به شرعاً (${oneThirdFraction.toString()}) بدون موافقة الورثة، لذا تم تخفيض الوصايا بالحصص (محاصة) لتصل إلى الثلث تماماً.`;

        const scalingFactor = oneThirdFraction.div(totalWillsFraction);
        finalWillsCost = oneThirdLimit;

        for (const will of processedWills) {
            will.executed_fraction = will.requested_fraction.mul(scalingFactor);
            will.executed_value = will.executed_fraction.valueOf() * netEstate;
        }
    } else if (limitExceeded && heirsApprovedExcess) {
        const oneFraction = new Fraction(1);
        if (totalWillsFraction.greaterThan(oneFraction)) {
            isWillsScaled = true;
            willsExplanation = `وافق الورثة على تجاوز الثلث، لكن مجموع الوصايا تجاوز كامل التركة فتم تخفيضها بالحصص لتساوي التركة.`;
            const scalingFactor = oneFraction.div(totalWillsFraction);
            finalWillsCost = netEstate;

            for (const will of processedWills) {
                will.executed_fraction = will.requested_fraction.mul(scalingFactor);
                will.executed_value = will.executed_fraction.valueOf() * netEstate;
            }
        } else {
            willsExplanation = `تجاوزت الوصايا ثلث التركة ولكن تم تنفيذها بالكامل لموافقة الورثة على ذلك.`;
        }
    } else if (totalWillsValue > 0) {
        willsExplanation = `تم تنفيذ جميع الوصايا بالكامل لكونها في حدود ثلث التركة.`;
    }

    let finalWillsFraction = new Fraction(0);
    for (const will of processedWills) {
        will.requested_fraction_share = will.requested_fraction.toString();
        will.executed_fraction_share = will.executed_fraction.toString();
        will.executed_fraction_obj = will.executed_fraction;
        finalWillsFraction = finalWillsFraction.add(will.executed_fraction);
        delete will.requested_fraction;
        delete will.executed_fraction;
    }

    const heirsScaleFraction = new Fraction(1).sub(finalWillsFraction);

    return {
        processedWills,
        finalWillsCost,
        netEstateForHeirs: netEstate - finalWillsCost,
        heirsScaleFraction,
        willsExplanation,
        isWillsScaled
    };
}

export function prepareFinalResults({
    results,
    heirs,
    explanations,
    caseData,
    gender,
    netEstate,
    originalNetEstate,
    totalWillsCost,
    willsExecuted,
    willsExplanation,
    isWillsScaled,
    isAul,
    totalShares,
    heirsScaleFraction
}) {
    const distributions = [];
    const scaleFactor = heirsScaleFraction && !heirsScaleFraction.equals(new Fraction(1)) ? heirsScaleFraction : null;

    for (const [relationship, data] of Object.entries(results)) {
        let shareFraction = data.share;
        const count = data.count;

        if (isAul) {
            shareFraction = shareFraction.div(totalShares);
        }

        if (scaleFactor) {
            shareFraction = shareFraction.mul(scaleFactor);
        }

        const percentage = parseFloat(shareFraction.valueOf()) * 100;
        const totalValue = originalNetEstate * shareFraction.valueOf();
        const perPersonValue = count > 0 ? totalValue / count : 0;

        const heirObj = heirs[relationship];
        const displayName = heirObj ? heirObj.displayName : relationship;

        let whyText = explanations[relationship] || '';
        if (isAul) {
            whyText += ` (تم تعديل النصيب بالعول نظراً لزيادة السهام عن أصل المسألة).`;
        }
        whyText = formatExplanation(whyText, gender);

        const individualShareFraction = count > 1 ? shareFraction.div(new Fraction(count)) : shareFraction;
        distributions.push({
            relationship,
            relationship_display: displayName,
            count,
            share_fraction: shareFraction.toString(),
            individual_share_fraction: individualShareFraction.toString(),
            percentage: Math.round(percentage * 10000) / 10000,
            individual_percentage: count > 1 ? Math.round((percentage / count) * 10000) / 10000 : Math.round(percentage * 10000) / 10000,
            total_value: Math.round(totalValue * 100) / 100,
            per_person_value: Math.round(perPersonValue * 100) / 100,
            why: whyText
        });
    }

    // Add executed wills
    if (willsExecuted && willsExecuted.length > 0) {
        for (const will of willsExecuted) {
            const pct = (will.executed_value / originalNetEstate) * 100;
            const willFractStr = will.executed_fraction_obj ? will.executed_fraction_obj.toString() : will.executed_fraction_share;
            distributions.push({
                relationship: `WILL_${will.name}`,
                relationship_display: `${will.name || 'وصية'}`,
                count: '-',
                share_fraction: willFractStr,
                individual_share_fraction: willFractStr,
                percentage: Math.round(pct * 10000) / 10000,
                individual_percentage: Math.round(pct * 10000) / 10000,
                total_value: Math.round(will.executed_value * 100) / 100,
                per_person_value: Math.round(will.executed_value * 100) / 100,
                why: `تنفيذ الوصية الشرعية (الكسر المطلوب: ${will.original_value})`
            });
        }
    }

    // Add blocked heirs
    for (const [relationship, heirObj] of Object.entries(heirs)) {
        if (heirObj.is_blocked && !results[relationship]) {
            let whyText = explanations[relationship] || `${heirObj.displayName} محجوب من الميراث.`;
            whyText = formatExplanation(whyText, gender);
            distributions.push({
                relationship,
                relationship_display: heirObj.displayName,
                count: heirObj.count,
                share_fraction: "0",
                individual_share_fraction: "0",
                percentage: 0,
                individual_percentage: 0,
                total_value: 0,
                per_person_value: 0,
                why: whyText
            });
        }
    }

    return {
        case_id: caseData.id,
        deceased_name: caseData.name,
        deceased_gender: gender,
        total_estate: caseData.total_estate_value,
        deductions: (caseData.funeral_expenses || 0) + (caseData.debts || 0),
        original_net_estate: originalNetEstate,
        total_wills_cost: totalWillsCost,
        net_estate: netEstate,
        is_aul: isAul,
        aul_sum_fractions: totalShares ? totalShares.toString() : "1",
        wills_executed: willsExecuted || [],
        wills_explanation: willsExplanation || '',
        is_wills_scaled: isWillsScaled || false,
        distributions: distributions.sort((a, b) => b.percentage - a.percentage)
    };
}
