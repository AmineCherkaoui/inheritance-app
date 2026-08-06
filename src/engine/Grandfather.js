import Fraction from '../fraction.js';

export function hasGrandfatherWithSiblings(heirs) {
    const activeGF = ['PATERNAL_GRANDFATHER', 'PATERNAL_GREAT_GRANDFATHER'].find(r => heirs[r] && !heirs[r].is_blocked);
    if (!activeGF) return false;

    const activeSiblings = ['FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER']
        .some(rel => heirs[rel] && !heirs[rel].is_blocked);
    
    return activeSiblings;
}

export function calculateGrandfatherWithSiblings(heirs, results, explanations, remaining, otherFixedHeirsExist) {
    const gfKey = ['PATERNAL_GRANDFATHER', 'PATERNAL_GREAT_GRANDFATHER'].find(r => heirs[r] && !heirs[r].is_blocked);
    if (!gfKey) return remaining;

    const gfName = heirs[gfKey].displayName;

    const FB = heirs['FULL_BROTHER'] && !heirs['FULL_BROTHER'].is_blocked ? heirs['FULL_BROTHER'].count : 0;
    const FS = heirs['FULL_SISTER'] && !heirs['FULL_SISTER'].is_blocked ? heirs['FULL_SISTER'].count : 0;
    const PB = heirs['PATERNAL_BROTHER'] && !heirs['PATERNAL_BROTHER'].is_blocked ? heirs['PATERNAL_BROTHER'].count : 0;
    const PS = heirs['PATERNAL_SISTER'] && !heirs['PATERNAL_SISTER'].is_blocked ? heirs['PATERNAL_SISTER'].count : 0;

    // --- Option 1: المقاسمة (Sharing) ---
    // Grandfather counts as a brother (2 parts). Brothers count as 2, sisters as 1.
    const totalParts = 2 + 2 * (FB + PB) + (FS + PS);
    const shareSharing = remaining.mul(new Fraction(2, totalParts));

    let grandfatherShare = shareSharing;
    let explanationOption = '';

    if (!otherFixedHeirsExist) {
        // Case A: No other fixed-share heirs (بغير صاحب فرض)
        // Grandfather gets the best of: 1) المقاسمة, 2) ثلث التركة (1/3 of total estate)
        const shareOneThird = new Fraction(1, 3);
        if (shareOneThird.greaterThan(grandfatherShare)) {
            grandfatherShare = shareOneThird;
            explanationOption = `بفرض ثلث التركة كونه الأحظ له مع الإخوة لعدم وجود أصحاب فروض آخرين.`;
        } else {
            explanationOption = `بالمقاسمة مع الإخوة (كأخ) كونه الأحظ له لعدم وجود أصحاب فروض آخرين.`;
        }
    } else {
        // Case B: With other fixed-share heirs (مع صاحب فرض)
        // Grandfather gets the best of: 1) المقاسمة, 2) ثلث الباقي (1/3 of remainder), 3) سدس جميع المال (1/6 of total estate)
        const shareOneThirdOfRemainder = remaining.mul(new Fraction(1, 3));
        const shareOneSixthOfTotal = new Fraction(1, 6);

        if (shareOneThirdOfRemainder.greaterThan(grandfatherShare)) {
            grandfatherShare = shareOneThirdOfRemainder;
            explanationOption = `بفرض ثلث الباقي بعد ذوي الفروض كونه الأحظ له من المقاسمة وسدس التركة.`;
        } else {
            explanationOption = `بالمقاسمة مع الإخوة كأحدهم كونه الأحظ له.`;
        }

        if (shareOneSixthOfTotal.greaterThan(grandfatherShare)) {
            grandfatherShare = shareOneSixthOfTotal;
            explanationOption = `بفرض السدس (1/6) فرضاً كونه الأحظ له ولا يمكن أن يقل نصيبه عنه.`;
        }
    }

    // Assign Grandfather's share
    results[gfKey] = { share: grandfatherShare, count: 1 };
    explanations[gfKey] = `يرث ${gfName} ${explanationOption}`;

    // Sibling share of remainder
    let siblingShare = remaining.sub(grandfatherShare);
    if (siblingShare.lessThan(0)) {
        siblingShare = new Fraction(0);
    }

    // Distribute to siblings using Maliki rule (Mu'adah)
    if (siblingShare.greaterThan(0)) {
        const totalSiblingsCount = FB + FS + PB + PS;
        if (FB > 0 || FS > 0) {
            // Full siblings present (they count paternal siblings but block/restrict them)
            if (FB > 0) {
                // Full brother is present, he takes all remaining sibling shares with full sisters (2:1)
                // and completely blocks paternal siblings.
                const totalFullParts = 2 * FB + FS;
                const fbShare = siblingShare.mul(new Fraction(2 * FB, totalFullParts));
                results['FULL_BROTHER'] = { share: fbShare, count: FB };
                explanations['FULL_BROTHER'] = `يرث الأخ الشقيق (أو الأشقاء بالتساوي) بالتعصيب مع الجد والأخوات الشقيقات للذكر مثل حظ الأنثيين بعد أن حجبوا الإخوة لأب.`;

                if (FS > 0) {
                    const fsShare = siblingShare.mul(new Fraction(FS, totalFullParts));
                    results['FULL_SISTER'] = { share: fsShare, count: FS };
                    explanations['FULL_SISTER'] = `ترث الأخت الشقيقة (أو الأخوات بالتساوي) بالتعصيب مع الإخوة الأشقاء.`;
                }

                // Paternal siblings are blocked
                ['PATERNAL_BROTHER', 'PATERNAL_SISTER'].forEach(p => {
                    if (heirs[p]) {
                        heirs[p].is_blocked = true;
                        heirs[p].blocked_by = 'FULL_BROTHER';
                        explanations[p] = `محجوب(ة) لاستغراق الإخوة الأشقاء للتركة المتبقية بعد نصيب الجد.`;
                    }
                });
            } else {
                // Only full sisters present, no full brothers.
                // Full sister(s) take their fixed share (1/2 if single, 2/3 if multiple) as maximum from the TOTAL estate.
                const sisterMaxFraction = new Fraction(FS === 1 ? 1 : 2, FS === 1 ? 2 : 3);
                
                // Compare sister's max fraction with sibling share
                const actualSisterShare = siblingShare.greaterThan(sisterMaxFraction) ? sisterMaxFraction : siblingShare;
                results['FULL_SISTER'] = { share: actualSisterShare, count: FS };
                explanations['FULL_SISTER'] = `ترث الأخت الشقيقة (أو الأخوات بالتساوي) فرضاً ${FS === 1 ? 'النصف (1/2)' : 'الثلثين (2/3)'} كحد أقصى بعد نصيب الجد.`;

                const paternalRemainder = siblingShare.sub(actualSisterShare);
                if (paternalRemainder.greaterThan(0) && (PB > 0 || PS > 0)) {
                    const totalPaternalParts = 2 * PB + PS;
                    if (PB > 0) {
                        const pbShare = paternalRemainder.mul(new Fraction(2 * PB, totalPaternalParts));
                        results['PATERNAL_BROTHER'] = { share: pbShare, count: PB };
                        explanations['PATERNAL_BROTHER'] = `يرث الأخ لأب الباقي بعد أن أخذت الأخت الشقيقة فرضها الأقصى.`;
                    }
                    if (PS > 0) {
                        const psShare = paternalRemainder.mul(new Fraction(PS, totalPaternalParts));
                        results['PATERNAL_SISTER'] = { share: psShare, count: PS };
                        explanations['PATERNAL_SISTER'] = `ترث الأخت لأب الباقي بالتعصيب مع الأخ لأب بعد فرض الأخت الشقيقة.`;
                    }
                } else {
                    ['PATERNAL_BROTHER', 'PATERNAL_SISTER'].forEach(p => {
                        if (heirs[p]) {
                            heirs[p].is_blocked = true;
                            heirs[p].blocked_by = 'FULL_SISTER';
                            explanations[p] = `محجوب(ة) لاستغراق الأخت الشقيقة للسهام المتبقية.`;
                        }
                    });
                }
            }
        } else {
            // No full siblings, only paternal siblings.
            const totalPaternalParts = 2 * PB + PS;
            if (PB > 0) {
                const pbShare = siblingShare.mul(new Fraction(2 * PB, totalPaternalParts));
                results['PATERNAL_BROTHER'] = { share: pbShare, count: PB };
                explanations['PATERNAL_BROTHER'] = `يرث الأخ لأب الباقي تعصيباً للذكر مثل حظ الأنثيين بالاشتراك مع الأخوات لأب.`;
            }
            if (PS > 0) {
                const psShare = siblingShare.mul(new Fraction(PS, totalPaternalParts));
                results['PATERNAL_SISTER'] = { share: psShare, count: PS };
                explanations['PATERNAL_SISTER'] = `ترث الأخت لأب بالتعصيب مع الأخ لأب.`;
            }
        }
    }

    return new Fraction(0); // All remaining has been distributed to GF & siblings
}
