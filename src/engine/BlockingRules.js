import { hasMaleDescendants, hasFemaleDescendants, hasFather, hasGrandfather } from './Helpers.js';

export function applyBlockingRules(heirs, explanations) {
    // Helper function to block an heir
    const block = (blockedKey, blockerKey, reason) => {
        if (heirs[blockedKey]) {
            heirs[blockedKey].is_blocked = true;
            heirs[blockedKey].blocked_by = blockerKey;
            explanations[blockedKey] = reason;
        }
    };

    // 1. Mother blocks all grandmothers
    if (heirs['MOTHER'] && !heirs['MOTHER'].is_blocked) {
        const reason = `الجدة محجوبة حجب حرمان لوجود الأم.`;
        ['PATERNAL_GRANDMOTHER', 'MATERNAL_GRANDMOTHER', 'MATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER']
            .forEach(gm => block(gm, 'MOTHER', reason));
    }

    // 2. Father blocks grandfathers & paternal grandmothers
    if (heirs['FATHER'] && !heirs['FATHER'].is_blocked) {
        block('PATERNAL_GRANDFATHER', 'FATHER', `الجد محجوب لوجود الأب.`);
        block('PATERNAL_GREAT_GRANDFATHER', 'FATHER', `الجد محجوب لوجود الأب.`);
        
        // Father blocks paternal grandmothers (since they are related through him)
        const patGmReason = `الجدة لأب محجوبة لوجود الأب.`;
        ['PATERNAL_GRANDMOTHER', 'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER']
            .forEach(gm => block(gm, 'FATHER', patGmReason));
        
        // Father blocks all siblings and below
        const siblingReason = `محجوب(ة) حجب حرمان لوجود الأب.`;
        ['FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'MATERNAL_BROTHER', 'MATERNAL_SISTER',
         'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
         'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL',
         'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL']
            .forEach(h => block(h, 'FATHER', siblingReason));
    }

    // 3. Paternal Grandfather blocking rules
    if (heirs['PATERNAL_GRANDFATHER'] && !heirs['PATERNAL_GRANDFATHER'].is_blocked) {
        block('PATERNAL_GREAT_GRANDFATHER', 'PATERNAL_GRANDFATHER', `الجد الأبعد محجوب بالجد الأقرب.`);
        block('PATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GRANDFATHER', `الجدة لأب محجوبة بالجد.`);
        block('MATERNAL_PATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GRANDFATHER', `الجدة لأب محجوبة بالجد.`);

        // Grandfather blocks maternal siblings
        const matSibReason = `الإخوة لأم محجوبون بالجد لأب.`;
        block('MATERNAL_BROTHER', 'PATERNAL_GRANDFATHER', matSibReason);
        block('MATERNAL_SISTER', 'PATERNAL_GRANDFATHER', matSibReason);

        // Grandfather blocks nephews, uncles, and cousins (but NOT full/paternal siblings)
        const belowReason = `محجوب لوجود الجد لأب.`;
        ['NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
         'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL',
         'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL']
            .forEach(h => block(h, 'PATERNAL_GRANDFATHER', belowReason));
    }

    // Paternal Great Grandfather blocking rules
    if (heirs['PATERNAL_GREAT_GRANDFATHER'] && !heirs['PATERNAL_GREAT_GRANDFATHER'].is_blocked) {
        const gpReason = `محجوب لوجود الجد لأب الأعلى.`;
        block('MATERNAL_BROTHER', 'PATERNAL_GREAT_GRANDFATHER', gpReason);
        block('MATERNAL_SISTER', 'PATERNAL_GREAT_GRANDFATHER', gpReason);
        ['NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
         'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL']
            .forEach(h => block(h, 'PATERNAL_GREAT_GRANDFATHER', gpReason));
    }

    // 4. Descendants blocking rules
    // Son blocks all descendants below him and all siblings, nephews, uncles, cousins
    if (heirs['SON'] && !heirs['SON'].is_blocked) {
        const reason = `محجوب(ة) حجب حرمان لوجود الابن.`;
        ['GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER',
         'FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'MATERNAL_BROTHER', 'MATERNAL_SISTER',
         'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
         'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL',
         'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL']
            .forEach(h => block(h, 'SON', reason));
    }

    // Grandson blocks below him and siblings, nephews, uncles, cousins
    if (heirs['GRANDSON'] && !heirs['GRANDSON'].is_blocked) {
        const reason = `محجوب(ة) حجب حرمان لوجود ابن الابن.`;
        ['GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER',
         'FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'MATERNAL_BROTHER', 'MATERNAL_SISTER',
         'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
         'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL']
            .forEach(h => block(h, 'GRANDSON', reason));
    }

    // Great Grandson blocks below him
    if (heirs['GREAT_GRANDSON'] && !heirs['GREAT_GRANDSON'].is_blocked) {
        const reason = `محجوب(ة) لوجود ابن ابن الابن.`;
        ['FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'MATERNAL_BROTHER', 'MATERNAL_SISTER',
         'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL']
            .forEach(h => block(h, 'GREAT_GRANDSON', reason));
    }

    // Female descendants blocking rules
    // If we have daughters or granddaughter, they block maternal siblings
    if (hasFemaleDescendants(heirs)) {
        const reason = `الإخوة لأم محجوبون لوجود فرع وارث.`;
        block('MATERNAL_BROTHER', 'FEMALE_DESCENDANTS', reason);
        block('MATERNAL_SISTER', 'FEMALE_DESCENDANTS', reason);
    }

    // Two or more daughters block granddaughters unless there is a grandson (asbah)
    if (heirs['DAUGHTER'] && heirs['DAUGHTER'].count >= 2) {
        const hasActiveGrandson = heirs['GRANDSON'] && !heirs['GRANDSON'].is_blocked;
        if (!hasActiveGrandson) {
            block('GRANDDAUGHTER', 'DAUGHTER', `بنت الابن محجوبة لاستغراق البنات الصلبيات فرض الثلثين ولعدم وجود عاصب (ابن ابن) يعصبها.`);
        }
        
        // Also block great granddaughters if no great grandson
        const hasActiveGreatGrandson = heirs['GREAT_GRANDSON'] && !heirs['GREAT_GRANDSON'].is_blocked;
        if (!hasActiveGreatGrandson) {
            block('GREAT_GRANDDAUGHTER', 'DAUGHTER', `بنت ابن الابن محجوبة لاستغراق البنات الصلبيات فرض الثلثين ولعدم وجود عاصب.`);
        }
    }

    // Granddaughters (two or more) block great granddaughters unless there is a great grandson
    if (heirs['GRANDDAUGHTER'] && !heirs['GRANDDAUGHTER'].is_blocked && heirs['GRANDDAUGHTER'].count >= 2) {
        const hasActiveGreatGrandson = heirs['GREAT_GRANDSON'] && !heirs['GREAT_GRANDSON'].is_blocked;
        if (!hasActiveGreatGrandson) {
            block('GREAT_GRANDDAUGHTER', 'GRANDDAUGHTER', `بنت ابن الابن محجوبة لاستغراق بنات الابن فرض الثلثين ولعدم وجود عاصب.`);
        }
    }

    // 5. Maternal grandmother blocks maternal great-grandmothers
    if (heirs['MATERNAL_GRANDMOTHER'] && !heirs['MATERNAL_GRANDMOTHER'].is_blocked) {
        block('MATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_GRANDMOTHER', `محجوبة بالجدة لأم الأقرب منها.`);
        block('MATERNAL_PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_GRANDMOTHER', `محجوبة بالجدة لأم الأقرب منها.`);
    }

    // Paternal grandmother blocks paternal great-grandmothers
    if (heirs['PATERNAL_GRANDMOTHER'] && !heirs['PATERNAL_GRANDMOTHER'].is_blocked) {
        block('PATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GRANDMOTHER', `محجوبة بالجدة لأب الأقرب منها.`);
        block('MATERNAL_PATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GRANDMOTHER', `محجوبة بالجدة لأب الأقرب منها.`);
    }

    // 6. Full Brother blocking rules
    if (heirs['FULL_BROTHER'] && !heirs['FULL_BROTHER'].is_blocked) {
        const fbReason = `محجوب(ة) لوجود الأخ الشقيق.`;
        ['PATERNAL_BROTHER', 'PATERNAL_SISTER',
         'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
         'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL']
            .forEach(h => block(h, 'FULL_BROTHER', fbReason));
    }

    // 7. Full Sister Asabah with Others (العصبة مع الغير) blocking rules
    // Sisters with daughters become Asabah, which block paternal siblings, nephews, uncles, etc.
    const hasDaughtersOrGranddaughters = hasFemaleDescendants(heirs);
    const hasFullSister = heirs['FULL_SISTER'] && !heirs['FULL_SISTER'].is_blocked;
    const noMaleDescendantOrFatherOrGF = !hasMaleDescendants(heirs) && !hasFather(heirs) && !hasGrandfather(heirs);
    
    const fullSisterIsAsabahWithOthers = hasDaughtersOrGranddaughters && hasFullSister && noMaleDescendantOrFatherOrGF;
    
    if (fullSisterIsAsabahWithOthers) {
        const fsReason = `محجوب(ة) لوجود الأخت الشقيقة التي صارت عصبة مع البنات (الأخوات مع البنات عصبة).`;
        ['PATERNAL_BROTHER', 'PATERNAL_SISTER',
         'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL']
            .forEach(h => block(h, 'FULL_SISTER', fsReason));
    }

    // Two or more full sisters block paternal sisters, unless there's a paternal brother (asbah)
    if (heirs['FULL_SISTER'] && !heirs['FULL_SISTER'].is_blocked && heirs['FULL_SISTER'].count >= 2) {
        const hasPaternalBrother = heirs['PATERNAL_BROTHER'] && !heirs['PATERNAL_BROTHER'].is_blocked;
        if (!hasPaternalBrother) {
            block('PATERNAL_SISTER', 'FULL_SISTER', `الأخت لأب محجوبة لاستغراق الأخوات الشقيقات فرض الثلثين ولعدم وجود عاصب (أخ لأب) يعصبها.`);
        }
    }

    // 8. Paternal Brother blocking rules
    if (heirs['PATERNAL_BROTHER'] && !heirs['PATERNAL_BROTHER'].is_blocked) {
        const pbReason = `محجوب لوجود الأخ لأب.`;
        ['NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL']
            .forEach(h => block(h, 'PATERNAL_BROTHER', pbReason));
    }

    // Paternal Sister Asabah with Others blocking rules
    const hasPaternalSister = heirs['PATERNAL_SISTER'] && !heirs['PATERNAL_SISTER'].is_blocked;
    const noFullBrother = !(heirs['FULL_BROTHER'] && !heirs['FULL_BROTHER'].is_blocked);
    const paternalSisterIsAsabahWithOthers = hasDaughtersOrGranddaughters && hasPaternalSister && noMaleDescendantOrFatherOrGF && noFullBrother && !fullSisterIsAsabahWithOthers;

    if (paternalSisterIsAsabahWithOthers) {
        const psReason = `محجوب لوجود الأخت لأب التي صارت عصبة مع البنات.`;
        ['NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL']
            .forEach(h => block(h, 'PATERNAL_SISTER', psReason));
    }

    // 9. Nephew (Full) blocking
    if (heirs['NEPHEW_FULL'] && !heirs['NEPHEW_FULL'].is_blocked) {
        const reason = `محجوب لوجود ابن الأخ الشقيق.`;
        ['NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL']
            .forEach(h => block(h, 'NEPHEW_FULL', reason));
    }

    // Nephew (Paternal) blocking
    if (heirs['NEPHEW_PATERNAL'] && !heirs['NEPHEW_PATERNAL'].is_blocked) {
        const reason = `محجوب لوجود ابن الأخ لأب.`;
        ['GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
         'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL']
            .forEach(h => block(h, 'NEPHEW_PATERNAL', reason));
    }

    // Great Nephew (Full) blocking
    if (heirs['GREAT_NEPHEW_FULL'] && !heirs['GREAT_NEPHEW_FULL'].is_blocked) {
        const reason = `محجوب لوجود ابن ابن الأخ الشقيق.`;
        ['GREAT_NEPHEW_PATERNAL', 'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL']
            .forEach(h => block(h, 'GREAT_NEPHEW_FULL', reason));
    }

    // Great Nephew (Paternal) blocking
    if (heirs['GREAT_NEPHEW_PATERNAL'] && !heirs['GREAT_NEPHEW_PATERNAL'].is_blocked) {
        const reason = `محجوب لوجود ابن ابن الأخ لأب.`;
        ['UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL']
            .forEach(h => block(h, 'GREAT_NEPHEW_PATERNAL', reason));
    }

    // Uncle (Full) blocking
    if (heirs['UNCLE_FULL'] && !heirs['UNCLE_FULL'].is_blocked) {
        const reason = `محجوب لوجود العم الشقيق.`;
        ['UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL']
            .forEach(h => block(h, 'UNCLE_FULL', reason));
    }

    // Uncle (Paternal) blocking
    if (heirs['UNCLE_PATERNAL'] && !heirs['UNCLE_PATERNAL'].is_blocked) {
        const reason = `محجوب لوجود العم لأب.`;
        ['COUSIN_FULL', 'COUSIN_PATERNAL']
            .forEach(h => block(h, 'UNCLE_PATERNAL', reason));
    }

    // Cousin (Full) blocking
    if (heirs['COUSIN_FULL'] && !heirs['COUSIN_FULL'].is_blocked) {
        const reason = `محجوب لوجود ابن العم الشقيق.`;
        ['COUSIN_PATERNAL']
            .forEach(h => block(h, 'COUSIN_FULL', reason));
    }
}
