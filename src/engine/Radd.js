/**
 * @file Radd.js
 * @description Implements the principle of Al-Radd (الرد) in Islamic inheritance law.
 * When the sum of all prescribed fixed shares is less than 1 and no residuary heir (Asabah) is present,
 * the remaining estate is redistributed proportionally to fixed-share heirs.
 */

import Fraction from '../fraction.js';

/**
 * Checks for and applies Al-Radd (الرد) to eligible fixed-share heirs.
 * 
 * Rules of Al-Radd:
 * 1. Standard Case: Spouses (Husband/Wife) take their fixed share only; the remainder is redistributed
 *    proportionally among other blood relatives (ذوو الفروض النسبية: Mother, Daughters, Granddaughters, Sisters, Maternal Siblings).
 * 2. Sole Heir Case: Under modern statutory codes (including Moroccan Mudawwana), if a spouse is the sole surviving heir
 *    with no other blood relatives, the entire estate returns to the spouse via Radd.
 * 
 * @param {Object.<string, {share: Fraction, count: number}>} results - Distribution results dictionary.
 * @param {Object.<string, string>} explanations - Legal reasons dictionary.
 * @param {import('./Helpers.js').HeirMap} [_heirs] - Active heirs map (optional).
 * @returns {void}
 */
export function checkAndApplyRadd(results, explanations, _heirs) {
    let sumShares = new Fraction(0);
    let sumSpouses = new Fraction(0);
    let sumOthers = new Fraction(0);

    const spouseKeys = ['HUSBAND', 'WIFE'];
    const activeSpouseKeys = [];
    const activeOtherKeys = [];

    for (const key of Object.keys(results)) {
        const share = results[key].share;
        sumShares = sumShares.add(share);
        if (spouseKeys.includes(key)) {
            sumSpouses = sumSpouses.add(share);
            activeSpouseKeys.push(key);
        } else {
            sumOthers = sumOthers.add(share);
            activeOtherKeys.push(key);
        }
    }

    // Apply Radd if the sum of shares is less than 1 and no Asabah was present
    if (sumShares.lessThan(1)) {
        if (activeOtherKeys.length > 0) {
            // Standard Radd: Spouses retain their fixed share; remainder is distributed proportionally among non-spouse heirs
            const remainingForOthers = new Fraction(1).sub(sumSpouses);

            for (const key of activeOtherKeys) {
                const originalShare = results[key].share;
                const newShare = remainingForOthers.mul(originalShare.div(sumOthers));
                results[key].share = newShare;
                explanations[key] = (explanations[key] || '') + ` (ردت المسألة: تم زيادة النصيب بالرد لعدم وجود عاصب، من ${originalShare.toString()} إلى ${newShare.toString()}).`;
            }
        } else if (activeSpouseKeys.length > 0) {
            // Sole Spouse: receives the entire estate (1/1) via Radd
            for (const key of activeSpouseKeys) {
                results[key].share = new Fraction(1);
                explanations[key] = (explanations[key] || '') + ` (ردت المسألة: تم زيادة نصيب الزوج/الزوجة بالرد لعدم وجود أي وارث آخر).`;
            }
        }
    }
}
