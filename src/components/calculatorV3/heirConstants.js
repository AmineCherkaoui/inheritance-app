export const HEIR_CATEGORIES = {
  primary: {
    title: 'الورثة الأساسيون (الزوج/الزوجة والأولاد والوالدان)',
    subtitle: 'أصحاب الفروض والعصبات الأقرب الذين لا يحجبهم أحد حجب حرمان أبداً',
    list: [
      { key: 'HUSBAND', label: 'الزوج', type: 'select', max: 1, note: 'يرث النصف فرضا عند عدم الفرع الوارث، أو الربع مع وجوده' },
      { key: 'WIFE', label: 'الزوجة', type: 'counter', max: 4, note: 'ترث الربع فرضا عند عدم الفرع الوارث، أو الثمن مع وجوده' },
      { key: 'SON', label: 'الابن (الأبناء)', type: 'counter', note: 'عصبة بالنفس، يحجب الفروع الأبعد والإخوة والأعمام' },
      { key: 'DAUGHTER', label: 'البنت (البنات)', type: 'counter', note: 'ترث بالفرض (النصف للواحدة، والثلثين لأكثر) أو بالتعصيب مع الابن' },
      { key: 'FATHER', label: 'الأب', type: 'select', max: 1, note: 'يرث بالفرض أو بالتعصيب، ويحجب الأجداد والإخوة والأعمام' },
      { key: 'MOTHER', label: 'الأم', type: 'select', max: 1, note: 'ترث الثلث أو السدس مع وجود الفرع الوارث أو جمع من الإخوة' }
    ]
  },
  descendants: {
    title: 'الفروع (الأحفاد)',
    subtitle: 'أولاد الأبناء (الأحفاد من جهة الذكور) يرثون عند عدم وجود الفرع المباشر الأقرب',
    list: [
      { key: 'GRANDSON', label: 'ابن الابن', type: 'counter', note: 'عصبة بالنفس عند عدم وجود الابن المباشر' },
      { key: 'GRANDDAUGHTER', label: 'بنت الابن', type: 'counter', note: 'ترث بالفرض (السدس تكملة للثلثين) أو بالتعصيب' },
      { key: 'GREAT_GRANDSON', label: 'ابن ابن الابن', type: 'counter', note: 'عصبة بالنفس بالدرجة الأبعد عند عدم من قبله' },
      { key: 'GREAT_GRANDDAUGHTER', label: 'بنت ابن الابن', type: 'counter', note: 'ترث بالفرض أو بالتعصيب مع من في درجتها' }
    ]
  },
  siblings: {
    title: 'الإخوة والأخوات',
    subtitle: 'الإخوة والأخوات الأشقاء، ولأب، ولأم يرثون عند عدم الفرع الوارث المذكر والأب',
    list: [
      { key: 'FULL_BROTHER', label: 'الأخ الشقيق', type: 'counter', note: 'عصبة بالنفس، يحجب الإخوة لأب والأعمام' },
      { key: 'FULL_SISTER', label: 'الأخت الشقيقة', type: 'counter', note: 'ترث بالفرض (النصف أو الثلثين) أو بالتعصيب' },
      { key: 'PATERNAL_BROTHER', label: 'الأخ لأب', type: 'counter', note: 'عصبة بالنفس عند عدم الأخ الشقيق' },
      { key: 'PATERNAL_SISTER', label: 'الأخت لأب', type: 'counter', note: 'ترث بالفرض (السدس تكملة للثلثين) أو بالتعصيب' },
      { key: 'MATERNAL_BROTHER', label: 'الأخ لأم', type: 'counter', note: 'يرث بالفرض (السدس للمنفرد، والثلث للجماعة بالتساوي)' },
      { key: 'MATERNAL_SISTER', label: 'الأخت لأم', type: 'counter', note: 'تشترك مع الإخوة لأم في الثلث بالسوية دون تفاضل' }
    ]
  },
  grandparents: {
    title: 'الأجداد والجدات',
    subtitle: 'الأجداد والجدات الصحيحون الوارثون شرعاً عند عدم الأب والأم',
    list: [
      { key: 'PATERNAL_GRANDFATHER', label: 'الجد لأب (أبو الأب)', type: 'select', max: 1, note: 'يحل محل الأب عند عدمه ويرث بالفرض أو التعصيب' },
      { key: 'PATERNAL_GREAT_GRANDFATHER', label: 'أبو أبو الأب (أبو الجد)', type: 'select', max: 1, note: 'يرث عند عدم الأب والجد الأقرب منه' },
      { key: 'PATERNAL_GRANDMOTHER', label: 'الجدة لأب (أم الأب)', type: 'select', max: 1, note: 'ترث السدس فرضا عند عدم الأم' },
      { key: 'MATERNAL_GRANDMOTHER', label: 'الجدة لأم (أم الأم)', type: 'select', max: 1, note: 'ترث السدس فرضا عند عدم الأم' },
      { key: 'MATERNAL_GREAT_GRANDMOTHER', label: 'أم أم الأم', type: 'select', max: 1, note: 'ترث عند عدم الجدات الأقرب' },
      { key: 'PATERNAL_GREAT_GRANDMOTHER', label: 'أم أب الأب', type: 'select', max: 1, note: 'ترث عند عدم الجدات الأقرب' },
      { key: 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER', label: 'أم أم الأب', type: 'select', max: 1, note: 'ترث عند عدم الجدات الأقرب' }
    ]
  },
  nephews: {
    title: 'أبناء الإخوة',
    subtitle: 'أبناء الإخوة الذكور الأشقاء ولأب (عصبة بالنفس عند عدم الإخوة والأصول والفروع الذكور)',
    list: [
      { key: 'NEPHEW_FULL', label: 'ابن الأخ الشقيق', type: 'counter', note: 'عصبة بالنفس، يحجب ابن الأخ لأب' },
      { key: 'NEPHEW_PATERNAL', label: 'ابن الأخ لأب', type: 'counter', note: 'عصبة بالنفس عند عدم ابن الأخ الشقيق' },
      { key: 'GREAT_NEPHEW_FULL', label: 'ابن ابن الأخ الشقيق', type: 'counter', note: 'عصبة بالنفس بالدرجة الأبعد' },
      { key: 'GREAT_NEPHEW_PATERNAL', label: 'ابن ابن الأخ لأب', type: 'counter', note: 'عصبة بالنفس بالدرجة الأبعد' }
    ]
  },
  uncles_cousins: {
    title: 'الأعمام وأبناء العمومة',
    subtitle: 'أعمام المتوفى وأبناء عمومته الذكور (عصبة بالنفس بحسب القرب والجهة)',
    list: [
      { key: 'UNCLE_FULL', label: 'العم الشقيق', type: 'counter', note: 'عصبة بالنفس، يحجب العم لأب وأبناء العم' },
      { key: 'UNCLE_PATERNAL', label: 'العم لأب', type: 'counter', note: 'عصبة بالنفس عند عدم العم الشقيق' },
      { key: 'COUSIN_FULL', label: 'ابن العم الشقيق', type: 'counter', note: 'عصبة بالنفس، يحجب ابن العم لأب' },
      { key: 'COUSIN_PATERNAL', label: 'ابن العم لأب', type: 'counter', note: 'عصبة بالنفس عند عدم ابن العم الشقيق' },
      { key: 'GREAT_COUSIN_FULL', label: 'ابن ابن العم الشقيق', type: 'counter', note: 'عصبة بالنفس بالدرجة الأبعد' },
      { key: 'GREAT_COUSIN_PATERNAL', label: 'ابن ابن العم لأب', type: 'counter', note: 'عصبة بالنفس بالدرجة الأبعد' }
    ]
  },
  father_uncles_cousins: {
    title: 'أعمام الأب وأبناء عمومة الأب',
    subtitle: 'أعمام الأب وأبناء عمومة الأب الذكور (الطبقة الأخيرة من العصبات)',
    list: [
      { key: 'FATHER_UNCLE_FULL', label: 'عم الأب الشقيق', type: 'counter', note: 'عصبة بالنفس، يحجب عم الأب لأب' },
      { key: 'FATHER_UNCLE_PATERNAL', label: 'عم الأب لأب', type: 'counter', note: 'عصبة بالنفس عند عدم عم الأب الشقيق' },
      { key: 'FATHER_COUSIN_FULL', label: 'ابن عم الأب الشقيق', type: 'counter', note: 'عصبة بالنفس' },
      { key: 'FATHER_COUSIN_PATERNAL', label: 'ابن عم الأب لأب', type: 'counter', note: 'عصبة بالنفس عند عدم ابن عم الأب الشقيق' }
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
