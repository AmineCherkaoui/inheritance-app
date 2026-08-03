import Fraction from './fraction';

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

export class InheritanceCalculator {
    static FIXED_SHARES = {
        'HUSBAND': { 'with_children': new Fraction(1, 4), 'without_children': new Fraction(1, 2) },
        'WIFE': { 'with_children': new Fraction(1, 8), 'without_children': new Fraction(1, 4) },
        'FATHER': { 'with_children': new Fraction(1, 6), 'without_children': null },
        'MOTHER': { 'with_children': new Fraction(1, 6), 'without_children': new Fraction(1, 3) },
        'DAUGHTER': { 'single': new Fraction(1, 2), 'multiple': new Fraction(2, 3) },
        'GRANDDAUGHTER': { 'single': new Fraction(1, 2), 'multiple': new Fraction(2, 3) },
        'GREAT_GRANDDAUGHTER': { 'single': new Fraction(1, 2), 'multiple': new Fraction(2, 3) },
        'FULL_SISTER': { 'single': new Fraction(1, 2), 'multiple': new Fraction(2, 3) },
        'PATERNAL_SISTER': { 'single': new Fraction(1, 2), 'multiple': new Fraction(2, 3) },
        'MATERNAL_BROTHER': { 'single': new Fraction(1, 6), 'multiple': new Fraction(1, 3) },
        'MATERNAL_SISTER': { 'single': new Fraction(1, 6), 'multiple': new Fraction(1, 3) },
        'PATERNAL_GRANDMOTHER': new Fraction(1, 6),
        'MATERNAL_GRANDMOTHER': new Fraction(1, 6),
        'MATERNAL_GREAT_GRANDMOTHER': new Fraction(1, 6),
        'PATERNAL_GREAT_GRANDMOTHER': new Fraction(1, 6),
        'MATERNAL_PATERNAL_GREAT_GRANDMOTHER': new Fraction(1, 6),
    };

    static BLOCKING_RULES = {
        'SON': ['GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER', 'FULL_BROTHER', 'FULL_SISTER',
            'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'NEPHEW_FULL',
            'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'GRANDSON': ['GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER', 'FULL_BROTHER', 'FULL_SISTER',
            'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'NEPHEW_FULL',
            'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'GREAT_GRANDSON': ['FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'NEPHEW_FULL',
            'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'FATHER': ['PATERNAL_GRANDFATHER', 'PATERNAL_GREAT_GRANDFATHER', 'PATERNAL_GRANDMOTHER',
            'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER', 'FULL_BROTHER', 'FULL_SISTER',
            'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'NEPHEW_FULL',
            'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'MOTHER': ['PATERNAL_GRANDMOTHER', 'MATERNAL_GRANDMOTHER', 'MATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER'],
        'PATERNAL_GRANDFATHER': ['PATERNAL_GREAT_GRANDFATHER', 'PATERNAL_GREAT_GRANDMOTHER', 'FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER',
            'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'PATERNAL_GREAT_GRANDFATHER': ['FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER',
            'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'FULL_BROTHER': ['PATERNAL_BROTHER', 'PATERNAL_SISTER', 'NEPHEW_FULL',
            'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'PATERNAL_BROTHER': ['NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'NEPHEW_FULL': ['NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'NEPHEW_PATERNAL': ['GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'GREAT_NEPHEW_FULL': ['GREAT_NEPHEW_PATERNAL', 'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'GREAT_NEPHEW_PATERNAL': ['UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'UNCLE_FULL': ['UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'UNCLE_PATERNAL': ['COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'COUSIN_FULL': ['COUSIN_PATERNAL', 'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL',
            'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'COUSIN_PATERNAL': ['GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL',
            'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'GREAT_COUSIN_FULL': ['GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL',
            'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'GREAT_COUSIN_PATERNAL': ['FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'FATHER_UNCLE_FULL': ['FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'FATHER_UNCLE_PATERNAL': ['FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'FATHER_COUSIN_FULL': ['FATHER_COUSIN_PATERNAL'],
        'MATERNAL_GRANDMOTHER': ['MATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER'],
        'PATERNAL_GRANDMOTHER': ['MATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER']
    };

    constructor(caseData) {
        this.case = caseData;
        this.heirs = {};
        for (const h of caseData.heirs) {
            this.heirs[h.relationship] = {
                relationship: h.relationship,
                count: h.count || 1,
                is_blocked: false,
                blocked_by: null,
                displayName: HEIR_NAMES_AR[h.relationship] || h.relationship
            };
        }

        const total = parseFloat(caseData.total_estate_value) || 0;
        const funeral = parseFloat(caseData.funeral_expenses) || 0;
        const debts = parseFloat(caseData.debts) || 0;

        this.net_estate = total - (funeral + debts);
        this.wills_input = caseData.wills || [];
        this.heirs_approved_excess = caseData.heirsApprovedExcess === true;
        this.results = {};
        this.explanations = {};
    }

    calculate() {
        if (this.net_estate <= 0) {
            return {
                error: 'لا تركة للتوزيع بعد خصم الديون والالتزامات',
                error_en: 'No estate to distribute after deductions',
                distributions: []
            };
        }

        // Execute Wills (الوصايا)
        let totalWillsValue = 0;
        const processedWills = [];
        let totalWillsFraction = new Fraction(0);
        const oneThirdFraction = new Fraction(1, 3);
        const netEstateInt = Math.round(this.net_estate * 100);

        for (const will of this.wills_input) {
            let val = 0;
            let reqFraction = new Fraction(0);

            if (will.valueType === 'percentage') {
                const pct = parseFloat(will.value) || 0;
                val = (pct / 100) * this.net_estate;
                reqFraction = new Fraction(Math.round(pct * 100), 10000);
            } else if (will.valueType === 'fraction') {
                const parts = (will.value || '1/3').split('/');
                const num = parseInt(parts[0]) || 0;
                const den = parseInt(parts[1]) || 1;
                val = (num / den) * this.net_estate;
                reqFraction = new Fraction(num, den);
            } else {
                val = parseFloat(will.value) || 0;
                reqFraction = new Fraction(Math.round(val * 100), netEstateInt || 1);
            }

            totalWillsValue += val;
            totalWillsFraction = totalWillsFraction.add(reqFraction);

            processedWills.push({
                name: will.name || 'وصية غير مسماة',
                requested_value: val,
                executed_value: val,
                type: will.valueType,
                original_value: will.value,
                requested_fraction: reqFraction,
                executed_fraction: reqFraction
            });
        }

        const oneThirdLimit = this.net_estate / 3;
        let finalWillsCost = totalWillsValue;
        let willsExplanation = '';
        let isWillsScaled = false;

        const limitExceeded = totalWillsFraction.greaterThan(oneThirdFraction);

        if (limitExceeded && !this.heirs_approved_excess) {
            // Heirs did NOT approve: cap at 1/3 using proportional scaling (المحاصة)
            isWillsScaled = true;
            willsExplanation = `مجموع الوصايا تجاوز ثلث التركة المسموح به شرعاً (${oneThirdFraction.toString()}) بدون موافقة الورثة، لذا تم تخفيض الوصايا بالحصص (محاصة) لتصل إلى الثلث تماماً.`;

            // Scaling factor: oneThirdFraction / totalWillsFraction
            const scalingFactor = oneThirdFraction.div(totalWillsFraction);
            finalWillsCost = oneThirdLimit;

            for (const will of processedWills) {
                will.executed_fraction = will.requested_fraction.mul(scalingFactor);
                will.executed_value = will.executed_fraction.valueOf() * this.net_estate;
            }
        } else if (limitExceeded && this.heirs_approved_excess) {
            // Heirs approved: execute as-is, but still cap at 100% of estate if total exceeds it
            const oneFraction = new Fraction(1);
            if (totalWillsFraction.greaterThan(oneFraction)) {
                isWillsScaled = true;
                willsExplanation = `وافق الورثة على تجاوز الثلث، لكن مجموع الوصايا تجاوز كامل التركة فتم تخفيضها بالحصص لتساوي التركة.`;
                const scalingFactor = oneFraction.div(totalWillsFraction);
                finalWillsCost = this.net_estate;

                for (const will of processedWills) {
                    will.executed_fraction = will.requested_fraction.mul(scalingFactor);
                    will.executed_value = will.executed_fraction.valueOf() * this.net_estate;
                }
            } else {
                willsExplanation = `تجاوزت الوصايا ثلث التركة ولكن تم تنفيذها بالكامل لموافقة الورثة على ذلك.`;
            }
        } else if (totalWillsValue > 0) {
            willsExplanation = `تم تنفيذ جميع الوصايا بالكامل لكونها في حدود ثلث التركة.`;
        }

        // Convert fraction objects to strings for the output payload
        let finalWillsFraction = new Fraction(0);
        for (const will of processedWills) {
            will.requested_fraction_share = will.requested_fraction.toString();
            will.executed_fraction_share = will.executed_fraction.toString();
            will.executed_fraction_obj = will.executed_fraction; // Keep Fraction reference for scaling
            finalWillsFraction = finalWillsFraction.add(will.executed_fraction);
            delete will.requested_fraction;
            delete will.executed_fraction;
        }

        this.heirs_scale_fraction = new Fraction(1).sub(finalWillsFraction);

        this.wills_executed = processedWills;
        this.total_wills_cost = finalWillsCost;
        this.net_estate_for_heirs = this.net_estate - finalWillsCost;

        this.original_net_estate = this.net_estate;
        this.net_estate = this.net_estate_for_heirs;
        this.wills_explanation = willsExplanation;
        this.is_wills_scaled = isWillsScaled;

        this._apply_blocking_rules();

        let remaining = new Fraction(1);
        remaining = this._calculate_fixed_shares(remaining);
        this._distribute_residue(remaining);

        return this._prepare_results();
    }

    _has_children() {
        return ['SON', 'DAUGHTER', 'GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER'].some(
            r => this.heirs[r] && !this.heirs[r].is_blocked
        );
    }

    _apply_blocking_rules() {
        // Apply static rules
        for (const [blocker, blockedList] of Object.entries(InheritanceCalculator.BLOCKING_RULES)) {
            if (this.heirs[blocker] && !this.heirs[blocker].is_blocked) {
                for (const blocked of blockedList) {
                    if (this.heirs[blocked]) {
                        this.heirs[blocked].is_blocked = true;
                        this.heirs[blocked].blocked_by = blocker;
                        this.explanations[blocked] = `${this.heirs[blocked].displayName} محجوب حجب حرمان لوجود ${this.heirs[blocker].displayName}.`;
                    }
                }
            }
        }
    }

    _calculate_fixed_shares(remaining) {
        const hasChildren = this._has_children();

        if (this.heirs['HUSBAND']) {
            const share = InheritanceCalculator.FIXED_SHARES['HUSBAND'][hasChildren ? 'with_children' : 'without_children'];
            this.results['HUSBAND'] = { share, count: 1 };
            this.explanations['HUSBAND'] = `يرث الزوج ${hasChildren ? 'الربع (1/4)' : 'النصف (1/2)'} فرضاً ${hasChildren ? 'لوجود فرع وارث للمتوفى' : 'لعدم وجود فرع وارث للمتوفى'}.`;
            remaining = remaining.sub(share);
        }

        if (this.heirs['WIFE']) {
            const heir = this.heirs['WIFE'];
            const share = InheritanceCalculator.FIXED_SHARES['WIFE'][hasChildren ? 'with_children' : 'without_children'];
            this.results['WIFE'] = { share, count: heir.count };
            this.explanations['WIFE'] = `ترث الزوجة (أو تشترك الزوجات بالتساوي في) ${hasChildren ? 'الثمن (1/8)' : 'الربع (1/4)'} فرضاً ${hasChildren ? 'لوجود فرع وارث للمتوفى' : 'لعدم وجود فرع وارث للمتوفى'}.`;
            remaining = remaining.sub(share);
        }

        if (this.heirs['FATHER']) {
            if (hasChildren) {
                const share = InheritanceCalculator.FIXED_SHARES['FATHER']['with_children'];
                this.results['FATHER'] = { share, count: 1, asabah: true };
                this.explanations['FATHER'] = `يرث الأب السدس (1/6) فرضاً لوجود فرع وارث، مع حقه في أخذ الباقي تعصيباً إن وجد.`;
                remaining = remaining.sub(share);
            }
        }

        if (this.heirs['PATERNAL_GRANDFATHER'] && !this.heirs['PATERNAL_GRANDFATHER'].is_blocked) {
            if (hasChildren) {
                const share = new Fraction(1, 6);
                this.results['PATERNAL_GRANDFATHER'] = { share, count: 1, asabah: true };
                this.explanations['PATERNAL_GRANDFATHER'] = `يرث الجد لأب السدس (1/6) فرضاً لوجود فرع وارث وعدم وجود الأب، مع حقه في أخذ الباقي تعصيباً إن وجد.`;
                remaining = remaining.sub(share);
            }
        }

        if (this.heirs['PATERNAL_GREAT_GRANDFATHER'] && !this.heirs['PATERNAL_GREAT_GRANDFATHER'].is_blocked) {
            if (hasChildren) {
                const share = new Fraction(1, 6);
                this.results['PATERNAL_GREAT_GRANDFATHER'] = { share, count: 1, asabah: true };
                this.explanations['PATERNAL_GREAT_GRANDFATHER'] = `يرث أبو أبو الأب السدس (1/6) فرضاً لوجود فرع وارث وعدم وجود الأب أو الجد، مع حقه في أخذ الباقي تعصيباً إن وجد.`;
                remaining = remaining.sub(share);
            }
        }

        if (this.heirs['MOTHER']) {
            let siblingCount = 0;
            const siblingKeys = ['FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'MATERNAL_BROTHER', 'MATERNAL_SISTER'];
            for (const key of siblingKeys) {
                if (this.heirs[key]) {
                    siblingCount += this.heirs[key].count;
                }
            }
            const hasMultipleSiblings = siblingCount > 1;
            const useOneSixth = hasChildren || hasMultipleSiblings;

            const share = InheritanceCalculator.FIXED_SHARES['MOTHER'][useOneSixth ? 'with_children' : 'without_children'];
            this.results['MOTHER'] = { share, count: 1 };
            this.explanations['MOTHER'] = `ترث الأم ${useOneSixth ? 'السدس (1/6)' : 'الثلث (1/3)'} فرضاً ${useOneSixth ? (hasChildren ? 'لوجود فرع وارث للمتوفى' : 'لوجود جمع من الإخوة للمتوفى') : 'لعدم وجود فرع وارث أو جمع من الإخوة للمتوفى'}.`;
            remaining = remaining.sub(share);
        }

        // Daughter / Daughter of Son / Daughter of grandson
        if (this.heirs['DAUGHTER'] && !this.heirs['SON']) {
            const heir = this.heirs['DAUGHTER'];
            const share = InheritanceCalculator.FIXED_SHARES['DAUGHTER'][heir.count === 1 ? 'single' : 'multiple'];
            this.results['DAUGHTER'] = { share, count: heir.count };
            this.explanations['DAUGHTER'] = heir.count === 1
                ? `ترث البنت النصف (1/2) فرضاً لانفرادها ولعدم وجود ابن يعصبها.`
                : `يرث البنات الثلثين (2/3) فرضاً لتعددهن ولعدم وجود ابن يعصبهن (توزع بالتساوي).`;
            remaining = remaining.sub(share);
        }

        if (this.heirs['GRANDDAUGHTER'] && !this.heirs['GRANDDAUGHTER'].is_blocked) {
            const heir = this.heirs['GRANDDAUGHTER'];
            if (!this.heirs['DAUGHTER']) {
                const share = heir.count === 1 ? new Fraction(1, 2) : new Fraction(2, 3);
                this.results['GRANDDAUGHTER'] = { share, count: heir.count };
                this.explanations['GRANDDAUGHTER'] = heir.count === 1
                    ? `ترث بنت الابن النصف (1/2) فرضاً لعدم وجود فرع وارث أعلى منها ولا عاصب.`
                    : `يرث بنات الابن الثلثين (2/3) فرضاً لتعددهن ولعدم وجود فرع وارث أعلى منهن ولا عاصب (توزع بالتساوي).`;
                remaining = remaining.sub(share);
            } else {
                const daughterCount = this.heirs['DAUGHTER'].count;
                if (daughterCount === 1) {
                    const share = new Fraction(1, 6);
                    this.results['GRANDDAUGHTER'] = { share, count: heir.count };
                    this.explanations['GRANDDAUGHTER'] = `ترث بنت الابن (أو بنات الابن بالتساوي) السدس (1/6) فرضاً تكملةً للثلثين لوجود بنت واحدة صلبية وارثة أعلى منها.`;
                    remaining = remaining.sub(share);
                } else {
                    this.heirs['GRANDDAUGHTER'].is_blocked = true;
                    this.explanations['GRANDDAUGHTER'] = `بنت الابن محجوبة لاستغراق البنات الصلبيات فرض الثلثين (2/3).`;
                }
            }
        }

        if (this.heirs['GREAT_GRANDDAUGHTER'] && !this.heirs['GREAT_GRANDDAUGHTER'].is_blocked) {
            const heir = this.heirs['GREAT_GRANDDAUGHTER'];
            const daughterCount = this.heirs['DAUGHTER'] ? this.heirs['DAUGHTER'].count : 0;
            const granddaughterCount = this.heirs['GRANDDAUGHTER'] && !this.heirs['GRANDDAUGHTER'].is_blocked ? this.heirs['GRANDDAUGHTER'].count : 0;

            if (daughterCount === 0 && granddaughterCount === 0) {
                const share = heir.count === 1 ? new Fraction(1, 2) : new Fraction(2, 3);
                this.results['GREAT_GRANDDAUGHTER'] = { share, count: heir.count };
                this.explanations['GREAT_GRANDDAUGHTER'] = heir.count === 1
                    ? `ترث بنت ابن الابن النصف (1/2) فرضاً لعدم وجود فرع وارث أعلى منها ولا عاصب.`
                    : `يرث بنات ابن الابن الثلثين (2/3) فرضاً لتعددهن لعدم وجود فرع وارث أعلى منهن ولا عاصب.`;
                remaining = remaining.sub(share);
            } else if (daughterCount + granddaughterCount === 1) {
                const share = new Fraction(1, 6);
                this.results['GREAT_GRANDDAUGHTER'] = { share, count: heir.count };
                this.explanations['GREAT_GRANDDAUGHTER'] = `ترث بنت ابن الابن السدس (1/6) فرضاً تكملة للثلثين لوجود بنت واحدة (أو بنت ابن) أعلى منها.`;
                remaining = remaining.sub(share);
            } else {
                this.heirs['GREAT_GRANDDAUGHTER'].is_blocked = true;
                this.explanations['GREAT_GRANDDAUGHTER'] = `بنت ابن الابن محجوبة لاستغراق الفروع الأعلى فرض الثلثين (2/3).`;
            }
        }

        if (this.heirs['FULL_SISTER'] && !this.heirs['FULL_SISTER'].is_blocked) {
            if (!hasChildren && !this.heirs['FATHER'] && !this.heirs['FULL_BROTHER']) {
                const heir = this.heirs['FULL_SISTER'];
                const share = heir.count === 1 ? new Fraction(1, 2) : new Fraction(2, 3);
                this.results['FULL_SISTER'] = { share, count: heir.count };
                this.explanations['FULL_SISTER'] = heir.count === 1
                    ? `ترث الأخت الشقيقة النصف (1/2) فرضاً لانفرادها وعدم وجود فرع وارث أو أصل ذكر أو عاصب.`
                    : `يرث الأخوات الشقيقات الثلثين (2/3) فرضاً لتعددهن وعدم وجود فرع وارث أو أصل ذكر أو عاصب (توزع بالتساوي).`;
                remaining = remaining.sub(share);
            }
        }

        for (const rel of ['MATERNAL_BROTHER', 'MATERNAL_SISTER']) {
            if (this.heirs[rel] && !hasChildren && !this.heirs['FATHER'] && !this.heirs['PATERNAL_GRANDFATHER'] && !this.heirs['PATERNAL_GREAT_GRANDFATHER']) {
                const heir = this.heirs[rel];
                const mBrothers = this.heirs['MATERNAL_BROTHER'] ? this.heirs['MATERNAL_BROTHER'].count : 0;
                const mSisters = this.heirs['MATERNAL_SISTER'] ? this.heirs['MATERNAL_SISTER'].count : 0;
                const totalMaternal = mBrothers + mSisters;

                let share;
                if (totalMaternal === 1) {
                    share = new Fraction(1, 6);
                    this.explanations[rel] = `يرث الأخ/الأخت لأم السدس (1/6) فرضاً لانفراده وعدم وجود فرع وارث أو أصل ذكر.`;
                } else {
                    share = new Fraction(1, 3).mul(new Fraction(heir.count, totalMaternal));
                    this.explanations[rel] = `يرث الإخوة لأم الثلث (1/3) فرضاً يشتركون فيه بالذمة (بالتساوي للذكر مثل الأنثى) لتعددهم وعدم وجود فرع وارث أو أصل ذكر.`;
                }
                this.results[rel] = { share, count: heir.count };
                remaining = remaining.sub(share);
            }
        }

        // Grandmothers and Great Grandmothers
        const activeGrandmothers = ['PATERNAL_GRANDMOTHER', 'MATERNAL_GRANDMOTHER', 'MATERNAL_GREAT_GRANDMOTHER', 'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER']
            .filter(g => this.heirs[g] && !this.heirs[g].is_blocked);

        if (activeGrandmothers.length > 0 && !this.heirs['MOTHER']) {
            const shareEach = new Fraction(1, 6).div(new Fraction(activeGrandmothers.length));
            for (const gm of activeGrandmothers) {
                this.results[gm] = { share: shareEach, count: 1 };
                this.explanations[gm] = activeGrandmothers.length === 1
                    ? `ترث الجدة السدس (1/6) فرضاً لعدم وجود الأم.`
                    : `ترث الجدة السدس (1/6) فرضاً تشترك فيه مع الجدات الأخريات بالتساوي لعدم وجود الأم.`;
                remaining = remaining.sub(shareEach);
            }
        }

        return remaining;
    }

    _distribute_residue(remaining) {
        if (remaining.lessThan(0) || remaining.equals(0)) {
            return;
        }

        // 1. Children
        if (this.heirs['SON']) {
            const sonCount = this.heirs['SON'].count;
            const daughterCount = this.heirs['DAUGHTER'] ? this.heirs['DAUGHTER'].count : 0;
            const totalParts = (sonCount * 2) + daughterCount;

            const sonShare = remaining.mul(new Fraction(sonCount * 2, totalParts));
            this.results['SON'] = { share: sonShare, count: sonCount };
            this.explanations['SON'] = `يرث الابن (أو الأبناء) تعصيباً (العصبة بالغير) مع البنات إن وجدن، ويكون الباقي لهن ولهم للذكر مثل حظ الأنثيين.`;

            if (daughterCount > 0) {
                const daughterShare = remaining.mul(new Fraction(daughterCount, totalParts));
                this.results['DAUGHTER'] = { share: daughterShare, count: daughterCount };
                this.explanations['DAUGHTER'] = `ترث البنت (أو البنات) بالتعصيب مع الابن (للذكر مثل حظ الأنثيين).`;
            }
            return;
        }

        // 2. Grandsons
        if (this.heirs['GRANDSON'] && !this.heirs['GRANDSON'].is_blocked) {
            const sonCount = this.heirs['GRANDSON'].count;
            const daughterCount = this.heirs['GRANDDAUGHTER'] && !this.heirs['GRANDDAUGHTER'].is_blocked ? this.heirs['GRANDDAUGHTER'].count : 0;
            const totalParts = (sonCount * 2) + daughterCount;

            const sonShare = remaining.mul(new Fraction(sonCount * 2, totalParts));
            this.results['GRANDSON'] = { share: sonShare, count: sonCount };
            this.explanations['GRANDSON'] = `يرث ابن الابن الباقي تعصيباً (للذكر مثل حظ الأنثيين مع الإناث المساويات له).`;

            if (daughterCount > 0) {
                const daughterShare = remaining.mul(new Fraction(daughterCount, totalParts));
                this.results['GRANDDAUGHTER'] = { share: daughterShare, count: daughterCount };
                this.explanations['GRANDDAUGHTER'] = `ترث بنت الابن بالتعصيب مع ابن الابن (للذكر مثل حظ الأنثيين).`;
            }
            return;
        }

        // 3. Great Grandsons
        if (this.heirs['GREAT_GRANDSON'] && !this.heirs['GREAT_GRANDSON'].is_blocked) {
            const sonCount = this.heirs['GREAT_GRANDSON'].count;
            const daughterCount = this.heirs['GREAT_GRANDDAUGHTER'] && !this.heirs['GREAT_GRANDDAUGHTER'].is_blocked ? this.heirs['GREAT_GRANDDAUGHTER'].count : 0;
            const totalParts = (sonCount * 2) + daughterCount;

            const sonShare = remaining.mul(new Fraction(sonCount * 2, totalParts));
            this.results['GREAT_GRANDSON'] = { share: sonShare, count: sonCount };
            this.explanations['GREAT_GRANDSON'] = `يرث ابن ابن الابن الباقي تعصيباً.`;

            if (daughterCount > 0) {
                const daughterShare = remaining.mul(new Fraction(daughterCount, totalParts));
                this.results['GREAT_GRANDDAUGHTER'] = { share: daughterShare, count: daughterCount };
                this.explanations['GREAT_GRANDDAUGHTER'] = `ترث بنت ابن الابن بالتعصيب مع ابن ابن الابن.`;
            }
            return;
        }

        // 4. Father
        if (this.heirs['FATHER'] && !this.results['FATHER']) {
            this.results['FATHER'] = { share: remaining, count: 1 };
            this.explanations['FATHER'] = `يرث الأب الباقي تعصيباً لعدم وجود فرع وارث ذكر للمتوفى.`;
            return;
        } else if (this.results['FATHER'] && this.results['FATHER'].asabah) {
            this.results['FATHER'].share = this.results['FATHER'].share.add(remaining);
            this.explanations['FATHER'] = `يرث الأب السدس فرضاً لوجود فرع وارث أنثى بالإضافة إلى الباقي تعصيباً.`;
            return;
        }

        // 5. Grandfathers
        if (this.heirs['PATERNAL_GRANDFATHER'] && !this.heirs['PATERNAL_GRANDFATHER'].is_blocked) {
            if (!this.results['PATERNAL_GRANDFATHER']) {
                this.results['PATERNAL_GRANDFATHER'] = { share: remaining, count: 1 };
                this.explanations['PATERNAL_GRANDFATHER'] = `يرث الجد لأب الباقي تعصيباً لعدم وجود الأب أو فرع وارث ذكر للمتوفى.`;
            } else if (this.results['PATERNAL_GRANDFATHER'] && this.results['PATERNAL_GRANDFATHER'].asabah) {
                this.results['PATERNAL_GRANDFATHER'].share = this.results['PATERNAL_GRANDFATHER'].share.add(remaining);
                this.explanations['PATERNAL_GRANDFATHER'] = `يرث الجد لأب السدس فرضاً لوجود فرع وارث أنثى وعدم وجود الأب بالإضافة إلى الباقي تعصيباً.`;
            }
            return;
        }

        if (this.heirs['PATERNAL_GREAT_GRANDFATHER'] && !this.heirs['PATERNAL_GREAT_GRANDFATHER'].is_blocked) {
            if (!this.results['PATERNAL_GREAT_GRANDFATHER']) {
                this.results['PATERNAL_GREAT_GRANDFATHER'] = { share: remaining, count: 1 };
                this.explanations['PATERNAL_GREAT_GRANDFATHER'] = `يرث أبو أبو الأب الباقي تعصيباً لعدم وجود الأب أو الجد أو فرع وارث ذكر للمتوفى.`;
            } else if (this.results['PATERNAL_GREAT_GRANDFATHER'] && this.results['PATERNAL_GREAT_GRANDFATHER'].asabah) {
                this.results['PATERNAL_GREAT_GRANDFATHER'].share = this.results['PATERNAL_GREAT_GRANDFATHER'].share.add(remaining);
                this.explanations['PATERNAL_GREAT_GRANDFATHER'] = `يرث أبو أبو الأب السدس فرضاً لوجود فرع وارث أنثى وعدم وجود الأب أو الجد بالإضافة إلى الباقي تعصيباً.`;
            }
            return;
        }

        // 6. Full Sibling Asabah
        if (this.heirs['FULL_BROTHER'] && !this.heirs['FULL_BROTHER'].is_blocked) {
            const brotherCount = this.heirs['FULL_BROTHER'].count;
            let sisterCount = 0;
            if (this.heirs['FULL_SISTER'] && !this.heirs['FULL_SISTER'].is_blocked) {
                sisterCount = this.heirs['FULL_SISTER'].count;
            }
            const totalParts = (brotherCount * 2) + sisterCount;

            this.results['FULL_BROTHER'] = { share: remaining.mul(new Fraction(brotherCount * 2, totalParts)), count: brotherCount };
            this.explanations['FULL_BROTHER'] = `يرث الأخ الشقيق الباقي تعصيباً (العصبة بالغير مع الأخوات إن وجدن للذكر مثل حظ الأنثيين).`;

            if (sisterCount > 0) {
                this.results['FULL_SISTER'] = { share: remaining.mul(new Fraction(sisterCount, totalParts)), count: sisterCount };
                this.explanations['FULL_SISTER'] = `ترث الأخت الشقيقة بالتعصيب مع الأخ الشقيق (للذكر مثل حظ الأنثيين).`;
            }
            return;
        }

        // 7. Sibling Asabah (Paternal)
        if (this.heirs['PATERNAL_BROTHER'] && !this.heirs['PATERNAL_BROTHER'].is_blocked) {
            const brotherCount = this.heirs['PATERNAL_BROTHER'].count;
            let sisterCount = 0;
            if (this.heirs['PATERNAL_SISTER'] && !this.heirs['PATERNAL_SISTER'].is_blocked) {
                sisterCount = this.heirs['PATERNAL_SISTER'].count;
            }
            const totalParts = (brotherCount * 2) + sisterCount;

            this.results['PATERNAL_BROTHER'] = { share: remaining.mul(new Fraction(brotherCount * 2, totalParts)), count: brotherCount };
            this.explanations['PATERNAL_BROTHER'] = `يرث الأخ لأب الباقي تعصيباً.`;

            if (sisterCount > 0) {
                this.results['PATERNAL_SISTER'] = { share: remaining.mul(new Fraction(sisterCount, totalParts)), count: sisterCount };
                this.explanations['PATERNAL_SISTER'] = `ترث الأخت لأب بالتعصيب مع الأخ لأب.`;
            }
            return;
        }

        // 8. Other Fallbacks in order of priority (Asabah)
        const fallbackRels = [
            'NEPHEW_FULL', 'NEPHEW_PATERNAL',
            'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL',
            'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL',
            'FATHER_UNCLE_FULL', 'FATHER_UNCLE_PATERNAL',
            'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'
        ];
        for (const rel of fallbackRels) {
            if (this.heirs[rel] && !this.heirs[rel].is_blocked) {
                this.results[rel] = { share: remaining, count: this.heirs[rel].count };
                this.explanations[rel] = `يرث ${this.heirs[rel].displayName} الباقي تعصيباً كونه أقرب عاصب ذكر متبقي للمتوفى.`;
                return;
            }
        }
    }

    _prepare_results() {
        const distributions = [];
        let totalShares = new Fraction(0);
        for (const r of Object.values(this.results)) {
            totalShares = totalShares.add(r.share);
        }

        const isAul = totalShares.greaterThan(1);
        const originalNet = this.original_net_estate !== undefined ? this.original_net_estate : this.net_estate;
        const scaleFactor = this.heirs_scale_fraction && !this.heirs_scale_fraction.equals(new Fraction(1))
            ? this.heirs_scale_fraction
            : null;

        for (const [relationship, data] of Object.entries(this.results)) {
            let shareFraction = data.share;
            const count = data.count;

            if (isAul) {
                shareFraction = shareFraction.div(totalShares);
            }

            if (scaleFactor) {
                shareFraction = shareFraction.mul(scaleFactor);
            }

            const percentage = parseFloat(shareFraction.valueOf()) * 100;
            const totalValue = originalNet * shareFraction.valueOf();
            const perPersonValue = count > 0 ? totalValue / count : 0;

            const heirObj = this.heirs[relationship];
            const displayName = heirObj ? heirObj.displayName : relationship;

            let whyText = this.explanations[relationship] || '';
            if (isAul) {
                whyText += ` (تم تعديل النصيب بالعول نظراً لزيادة السهام عن أصل المسألة).`;
            }

            distributions.push({
                relationship,
                relationship_display: displayName,
                count,
                share_fraction: shareFraction.toString(),
                percentage: Math.round(percentage * 10000) / 10000,
                total_value: Math.round(totalValue * 100) / 100,
                per_person_value: Math.round(perPersonValue * 100) / 100,
                why: whyText
            });
        }

        // Add executed wills into the main active distributions list
        if (this.wills_executed && this.wills_executed.length > 0) {
            for (const will of this.wills_executed) {
                const pct = (will.executed_value / originalNet) * 100;

                distributions.push({
                    relationship: `WILL_${will.name}`,
                    relationship_display: `${will.name || 'وصية'}`,
                    count: '-',
                    share_fraction: will.executed_fraction_obj ? will.executed_fraction_obj.toString() : will.executed_fraction_share,
                    percentage: Math.round(pct * 10000) / 10000,
                    total_value: Math.round(will.executed_value * 100) / 100,
                    per_person_value: Math.round(will.executed_value * 100) / 100,
                    why: `تنفيذ الوصية الشرعية (الكسر المطلوب: ${will.original_value})`
                });
            }
        }


        for (const [relationship, heirObj] of Object.entries(this.heirs)) {
            if (heirObj.is_blocked && !this.results[relationship]) {
                distributions.push({
                    relationship,
                    relationship_display: heirObj.displayName,
                    count: heirObj.count,
                    share_fraction: "0",
                    percentage: 0,
                    total_value: 0,
                    per_person_value: 0,
                    why: this.explanations[relationship] || `${heirObj.displayName} محجوب من الميراث.`
                });
            }
        }

        return {
            case_id: this.case.id,
            deceased_name: this.case.name,
            total_estate: this.case.total_estate_value,
            deductions: (this.case.funeral_expenses || 0) + (this.case.debts || 0),
            original_net_estate: this.original_net_estate !== undefined ? this.original_net_estate : this.net_estate,
            total_wills_cost: this.total_wills_cost || 0,
            net_estate: this.net_estate,
            is_aul: isAul,
            aul_sum_fractions: totalShares.toString(),
            wills_executed: this.wills_executed || [],
            wills_explanation: this.wills_explanation || '',
            is_wills_scaled: this.is_wills_scaled || false,
            distributions: distributions.sort((a, b) => b.percentage - a.percentage)
        };
    }
}
