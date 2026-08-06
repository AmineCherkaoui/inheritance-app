import Fraction from '../fraction.js';

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
            explanations[key] = (explanations[key] || '') + ` (عالت المسألة: تم تخفيض النصيب بنسبة زيادة السهام عن أصل المسألة من ${originalShare.toString()} إلى ${scaledShare.toString()}).`;
        }
    }

    return {
        isAul,
        sumShares
    };
}
