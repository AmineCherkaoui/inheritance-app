/**
 * @file Awl.js
 * @description Implements the principle of Al-Awl (العول) in Islamic inheritance.
 * When the sum of all prescribed fixed shares exceeds 1, each heir's share is reduced pro-rata.
 */

import Fraction from '../fraction.js';

/**
 * Checks for Al-Awl and scales down all shares proportionally if the sum of shares exceeds 1.
 * 
 * Historical & Jurisprudential Context:
 * First decreed by Caliph Umar ibn Al-Khattab with the consensus of the Sahaba (إجماع الصحابة)
 * when fixed shares in a case sum to more than the total estate (e.g. Husband 1/2 + 2 Sisters 2/3 = 7/6).
 * 
 * @param {Object.<string, {share: Fraction, count: number}>} results - Distribution results dictionary.
 * @param {Object.<string, string>} explanations - Legal reasons dictionary.
 * @returns {{isAul: boolean, sumShares: Fraction}} Object indicating whether Awl occurred and the total sum of shares.
 */
export function checkAndApplyAwl(results, explanations) {
    let sumShares = new Fraction(0);
    for (const key of Object.keys(results)) {
        sumShares = sumShares.add(results[key].share);
    }

    const isAul = sumShares.greaterThan(1);

    if (isAul) {
        for (const key of Object.keys(results)) {
            const originalShare = results[key].share;
            const scaledShare = originalShare.div(sumShares);
            results[key].share = scaledShare;
            explanations[key] = (explanations[key] || '') + ` (عالت المسألة: تم تخفيض النصيب بنسبة زيادة السهام عن أصل المسألة من ${originalShare.toString()} إلى ${scaledShare.toString()}).`;
        }
    }

    return {
        isAul,
        sumShares
    };
}
