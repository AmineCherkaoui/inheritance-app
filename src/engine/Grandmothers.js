import Fraction from '../fraction.js';

export function calculateGrandmothersShare(heirs, results, explanations, remaining) {
    const grandmotherKeys = [
        'PATERNAL_GRANDMOTHER',
        'MATERNAL_GRANDMOTHER',
        'MATERNAL_GREAT_GRANDMOTHER',
        'PATERNAL_GREAT_GRANDMOTHER',
        'MATERNAL_PATERNAL_GREAT_GRANDMOTHER'
    ];

    const activeGrandmothers = grandmotherKeys.filter(g => heirs[g] && !heirs[g].is_blocked);

    if (activeGrandmothers.length > 0) {
        if (heirs['MOTHER'] && !heirs['MOTHER'].is_blocked) {
            // Mother is present, so grandmothers should have already been blocked by BlockingRules.
            // Just in case, double check.
            return remaining;
        }

        const oneSixth = new Fraction(1, 6);
        const shareEach = oneSixth.div(new Fraction(activeGrandmothers.length));

        for (const gm of activeGrandmothers) {
            results[gm] = { share: shareEach, count: heirs[gm].count || 1 };
            explanations[gm] = activeGrandmothers.length === 1
                ? `ترث الجدة السدس (1/6) فرضاً لانفرادها وعدم وجود الأم الحاجبة لها.`
                : `ترث الجدة السدس (1/6) فرضاً بالاشتراك مع الجدات الوارثات بالتساوي لعدم وجود الأم.`;
            
            remaining = remaining.sub(shareEach);
        }
    }

    return remaining;
}
