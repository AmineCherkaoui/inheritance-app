export const HEIR_CATEGORIES = {
  primary: {
    title: 'الورثة الأساسيون (الزوج/الزوجة والأولاد والوالدان)',
    list: [
      { key: 'HUSBAND', label: 'الزوج', type: 'select', max: 1 },
      { key: 'WIFE', label: 'الزوجة', type: 'counter', max: 4 },
      { key: 'SON', label: 'الابن (الأبناء)', type: 'counter', note: 'يحجب الفروع الأبعد والإخوة والأعمام' },
      { key: 'DAUGHTER', label: 'البنت (البنات)', type: 'counter', note: 'ترث بالفرض أو بالتعصيب مع الابن' },
      { key: 'FATHER', label: 'الأب', type: 'select', max: 1, note: 'يحجب الأجداد والإخوة والأعمام' },
      { key: 'MOTHER', label: 'الأم', type: 'select', max: 1, note: 'ترث الثلث أو السدس مع وجود الفرع أو الإخوة' }
    ]
  },
  descendants: {
    title: 'الفروع (الأحفاد)',
    list: [
      { key: 'GRANDSON', label: 'ابن الابن', type: 'counter' },
      { key: 'GRANDDAUGHTER', label: 'بنت الابن', type: 'counter' },
      { key: 'GREAT_GRANDSON', label: 'ابن ابن الابن', type: 'counter' },
      { key: 'GREAT_GRANDDAUGHTER', label: 'بنت ابن الابن', type: 'counter' }
    ]
  },
  siblings: {
    title: 'الإخوة والأخوات',
    list: [
      { key: 'FULL_BROTHER', label: 'الأخ الشقيق', type: 'counter' },
      { key: 'FULL_SISTER', label: 'الأخت الشقيقة', type: 'counter' },
      { key: 'PATERNAL_BROTHER', label: 'الأخ لأب', type: 'counter' },
      { key: 'PATERNAL_SISTER', label: 'الأخت لأب', type: 'counter' },
      { key: 'MATERNAL_BROTHER', label: 'الأخ لأم', type: 'counter' },
      { key: 'MATERNAL_SISTER', label: 'الأخت لأم', type: 'counter' }
    ]
  },
  grandparents: {
    title: 'الأجداد والجدات',
    list: [
      { key: 'PATERNAL_GRANDFATHER', label: 'الجد لأب (أبو الأب)', type: 'select', max: 1 },
      { key: 'PATERNAL_GREAT_GRANDFATHER', label: 'أبو أبو الأب (أبو الجد)', type: 'select', max: 1 },
      { key: 'PATERNAL_GRANDMOTHER', label: 'الجدة لأب (أم الأب)', type: 'select', max: 1 },
      { key: 'MATERNAL_GRANDMOTHER', label: 'الجدة لأم (أم الأم)', type: 'select', max: 1 },
      { key: 'MATERNAL_GREAT_GRANDMOTHER', label: 'أم أم الأم', type: 'select', max: 1 },
      { key: 'PATERNAL_GREAT_GRANDMOTHER', label: 'أم أب الأب', type: 'select', max: 1 },
      { key: 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER', label: 'أم أم الأب', type: 'select', max: 1 }
    ]
  },
  nephews: {
    title: 'أبناء الإخوة',
    list: [
      { key: 'NEPHEW_FULL', label: 'ابن الأخ الشقيق', type: 'counter' },
      { key: 'NEPHEW_PATERNAL', label: 'ابن الأخ لأب', type: 'counter' },
      { key: 'GREAT_NEPHEW_FULL', label: 'ابن ابن الأخ الشقيق', type: 'counter' },
      { key: 'GREAT_NEPHEW_PATERNAL', label: 'ابن ابن الأخ لأب', type: 'counter' }
    ]
  },
  uncles_cousins: {
    title: 'الأعمام وأبناء العمومة',
    list: [
      { key: 'UNCLE_FULL', label: 'العم الشقيق', type: 'counter' },
      { key: 'UNCLE_PATERNAL', label: 'العم لأب', type: 'counter' },
      { key: 'COUSIN_FULL', label: 'ابن العم الشقيق', type: 'counter' },
      { key: 'COUSIN_PATERNAL', label: 'ابن العم لأب', type: 'counter' },
      { key: 'GREAT_COUSIN_FULL', label: 'ابن ابن العم الشقيق', type: 'counter' },
      { key: 'GREAT_COUSIN_PATERNAL', label: 'ابن ابن العم لأب', type: 'counter' }
    ]
  },
  father_uncles_cousins: {
    title: 'أعمام الأب وأبناء عمومة الأب',
    list: [
      { key: 'FATHER_UNCLE_FULL', label: 'عم الأب الشقيق', type: 'counter' },
      { key: 'FATHER_UNCLE_PATERNAL', label: 'عم الأب لأب', type: 'counter' },
      { key: 'FATHER_COUSIN_FULL', label: 'ابن عم الأب الشقيق', type: 'counter' },
      { key: 'FATHER_COUSIN_PATERNAL', label: 'ابن عم الأب لأب', type: 'counter' }
    ]
  }
};

export const BLOCKING_RULES = {
  'SON': [
    'GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER',
    'FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER',
    'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
    'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'GRANDSON': [
    'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER', 'FULL_BROTHER', 'FULL_SISTER',
    'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'NEPHEW_FULL', 'NEPHEW_PATERNAL',
    'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL', 'UNCLE_FULL', 'UNCLE_PATERNAL',
    'COUSIN_FULL', 'COUSIN_PATERNAL', 'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL',
    'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'GREAT_GRANDSON': [
    'FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER',
    'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
    'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'FATHER': [
    'PATERNAL_GRANDFATHER', 'PATERNAL_GREAT_GRANDFATHER', 'PATERNAL_GRANDMOTHER',
    'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER',
    'FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER',
    'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
    'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'MOTHER': [
    'PATERNAL_GRANDMOTHER', 'MATERNAL_GRANDMOTHER', 'MATERNAL_GREAT_GRANDMOTHER',
    'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER'
  ],
  'PATERNAL_GRANDFATHER': [
    'PATERNAL_GREAT_GRANDFATHER', 'PATERNAL_GREAT_GRANDMOTHER',
    'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
    'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'PATERNAL_GREAT_GRANDFATHER': [
    'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
    'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'FULL_BROTHER': [
    'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'NEPHEW_FULL',
    'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
    'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'PATERNAL_BROTHER': [
    'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
    'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'NEPHEW_FULL': [
    'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
    'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'NEPHEW_PATERNAL': [
    'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL', 'UNCLE_FULL', 'UNCLE_PATERNAL',
    'COUSIN_FULL', 'COUSIN_PATERNAL', 'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL',
    'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'GREAT_NEPHEW_FULL': [
    'GREAT_NEPHEW_PATERNAL', 'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'GREAT_NEPHEW_PATERNAL': [
    'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'UNCLE_FULL': [
    'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'UNCLE_PATERNAL': [
    'COUSIN_FULL', 'COUSIN_PATERNAL', 'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL',
    'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'COUSIN_FULL': [
    'COUSIN_PATERNAL', 'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL',
    'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'COUSIN_PATERNAL': [
    'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL',
    'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'GREAT_COUSIN_FULL': [
    'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL',
    'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'GREAT_COUSIN_PATERNAL': [
    'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'FATHER_UNCLE_FULL': [
    'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'FATHER_UNCLE_PATERNAL': [
    'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
  ],
  'FATHER_COUSIN_FULL': [
    'FATHER_COUSIN_PATERNAL'
  ],
  'MATERNAL_GRANDMOTHER': [
    'MATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER'
  ],
  'PATERNAL_GRANDMOTHER': [
    'MATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER'
  ]
};

export const isHeirBlocked = (heirKey, currentHeirs) => {
  for (const [blocker, blockedList] of Object.entries(BLOCKING_RULES)) {
    if (currentHeirs[blocker] && currentHeirs[blocker] > 0) {
      if (blockedList.includes(heirKey)) return true;
    }
  }

  if (heirKey === 'MATERNAL_BROTHER' || heirKey === 'MATERNAL_SISTER') {
    const hasDescendants = ['SON', 'DAUGHTER', 'GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER'].some(
      k => currentHeirs[k] > 0
    );
    const hasFather = currentHeirs['FATHER'] > 0;
    const hasGrandfather = currentHeirs['PATERNAL_GRANDFATHER'] > 0;
    const hasGreatGrandfather = currentHeirs['PATERNAL_GREAT_GRANDFATHER'] > 0;
    if (hasDescendants || hasFather || hasGrandfather || hasGreatGrandfather) return true;
  }
  return false;
};

export const isCategoryBlocked = (catKey, currentHeirs) => {
  if (catKey === 'primary') return false;
  const list = HEIR_CATEGORIES[catKey]?.list || [];
  return list.every(heir => isHeirBlocked(heir.key, currentHeirs));
};
