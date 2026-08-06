export const HEIR_NAMES_AR = {
    'HUSBAND': 'الزوج',
    'WIFE': 'الزوجة',
    'FATHER': 'الأب',
    'MOTHER': 'الأم',
    'SON': 'الابن',
    'DAUGHTER': 'البنت',
    'GRANDSON': 'ابن الابن',
    'GRANDDAUGHTER': 'بنت الابن',
    'GREAT_GRANDSON': 'ابن ابن الابن',
    'GREAT_GRANDDAUGHTER': 'بنت ابن الابن',
    'FULL_BROTHER': 'الأخ الشقيق',
    'FULL_SISTER': 'الأخت الشقيقة',
    'PATERNAL_BROTHER': 'الأخ لأب',
    'PATERNAL_SISTER': 'الأخت لأب',
    'MATERNAL_BROTHER': 'الأخ لأم',
    'MATERNAL_SISTER': 'الأخت لأم',
    'PATERNAL_GRANDFATHER': 'الجد لأب (أبو الأب)',
    'PATERNAL_GREAT_GRANDFATHER': 'الجد لأب (أبو أبو الأب)',
    'PATERNAL_GRANDMOTHER': 'الجدة لأب (أم الأب)',
    'MATERNAL_GRANDMOTHER': 'الجدة لأم (أم الأم)',
    'MATERNAL_GREAT_GRANDMOTHER': 'أم أم الأم',
    'PATERNAL_GREAT_GRANDMOTHER': 'أم أب الأب',
    'MATERNAL_PATERNAL_GREAT_GRANDMOTHER': 'أم أم الأب',
    'NEPHEW_FULL': 'ابن الأخ الشقيق',
    'NEPHEW_PATERNAL': 'ابن الأخ لأب',
    'GREAT_NEPHEW_FULL': 'ابن ابن الأخ الشقيق',
    'GREAT_NEPHEW_PATERNAL': 'ابن ابن الأخ لأب',
    'UNCLE_FULL': 'العم الشقيق',
    'UNCLE_PATERNAL': 'العم لأب',
    'COUSIN_FULL': 'ابن العم الشقيق',
    'COUSIN_PATERNAL': 'ابن العم لأب',
    'GREAT_COUSIN_FULL': 'ابن ابن العم الشقيق',
    'GREAT_COUSIN_PATERNAL': 'ابن ابن العم لأب',
    'FATHER_UNCLE_FULL': 'عم الأب الشقيق',
    'FATHER_UNCLE_PATERNAL': 'عم الأب لأب',
    'FATHER_COUSIN_FULL': 'ابن عم الأب الشقيق',
    'FATHER_COUSIN_PATERNAL': 'ابن عم الأب لأب'
};

export function formatExplanation(whyText, gender) {
    if (!whyText) return '';
    if (gender === 'female') {
        return whyText.replace(/المتوفى/g, 'المتوفاة');
    }
    return whyText;
}
