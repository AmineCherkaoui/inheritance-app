import Fraction from '../fraction.js';

export function checkAndApplyRadd(results, explanations, heirs) {
    // Radd is only applicable if the sum of all assigned shares is less than 1,
    // and there is no residuary heir (Asabah) who has taken the remainder.
    // Let's first check if any residuary heir took any residue.
    // Residuary heirs in results have explanations that mention تعصيب or Asabah, 
    // but a cleaner way is to see if any heir is registered as Asabah, or if we have a remaining > 0 after fixed shares.
    // Wait, if distributeResidue was called, any residue would have been assigned. 
    // So if sum of all shares in results is less than 1, it means no Asabah is present (otherwise sum would be 1).
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

    // If sum of all shares is less than 1, and we have heirs to return to
    if (sumShares.lessThan(1)) {
        if (activeOtherKeys.length > 0) {
            // Standard Radd: spouses get their fixed share, remainder distributed among others
            const remainingForOthers = new Fraction(1).sub(sumSpouses);

            for (const key of activeOtherKeys) {
                const originalShare = results[key].share;
                const newShare = remainingForOthers.mul(originalShare.div(sumOthers));
                results[key].share = newShare;
                explanations[key] = (explanations[key] || '') + ` (ردت المسألة: تم زيادة النصيب بالرد لعدم وجود عاصب، من ${originalShare.toString()} إلى ${newShare.toString()}).`;
            }
        } else if (activeSpouseKeys.length > 0) {
            // Spouse is the only heir: gets the entire estate via Radd
            for (const key of activeSpouseKeys) {
                results[key].share = new Fraction(1);
                explanations[key] = (explanations[key] || '') + ` (ردت المسألة: تم زيادة نصيب الزوج/الزوجة بالرد لعدم وجود أي وارث آخر).`;
            }
        }
    }
}
