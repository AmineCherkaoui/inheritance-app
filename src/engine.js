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
        'PATERNAL_GRANDFATHER': ['PATERNAL_GREAT_GRANDFATHER', 'PATERNAL_GREAT_GRANDMOTHER',
            'NEPHEW_FULL', 'NEPHEW_PATERNAL', 'GREAT_NEPHEW_FULL', 'GREAT_NEPHEW_PATERNAL',
            'UNCLE_FULL', 'UNCLE_PATERNAL', 'COUSIN_FULL', 'COUSIN_PATERNAL',
            'GREAT_COUSIN_FULL', 'GREAT_COUSIN_PATERNAL', 'FATHER_UNCLE_FULL',
            'FATHER_UNCLE_PATERNAL', 'FATHER_COUSIN_FULL', 'FATHER_COUSIN_PATERNAL'],
        'PATERNAL_GREAT_GRANDFATHER': [
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
        this.gender = caseData.gender || (caseData.heirs && caseData.heirs.some(h => h.relationship === 'HUSBAND') ? 'female' : 'male');
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
        this._apply_radd();

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
        const activeSiblings = ['FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER']
            .filter(rel => this.heirs[rel] && !this.heirs[rel].is_blocked);
        const hasActiveSiblings = activeSiblings.length > 0;

        if (this.heirs['HUSBAND']) {
            const share = InheritanceCalculator.FIXED_SHARES['HUSBAND'][hasChildren ? 'with_children' : 'without_children'];
            this.results['HUSBAND'] = { share, count: 1 };
            this.explanations['HUSBAND'] = hasChildren
                ? `يرث الزوج الربع (1/4) فرضاً لوجود فرع وارث للمتوفاة (الأولاد أو أولاد البنين وإن نزلوا)، لقوله تعالى: [فَإِنْ كَانَ لَهُنَّ وَلَدٌ فَلَكُمُ الرُّبُعُ مِمَّا تَرَكْنَ].`
                : `يرث الزوج النصف (1/2) فرضاً لعدم وجود فرع وارث للمتوفاة (الأولاد أو أولاد البنين وإن نزلوا)، لقوله تعالى: [وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِنْ لَمْ يَكُنْ لَهُنَّ وَلَدٌ].`;
            remaining = remaining.sub(share);
        }

        if (this.heirs['WIFE']) {
            const heir = this.heirs['WIFE'];
            const share = InheritanceCalculator.FIXED_SHARES['WIFE'][hasChildren ? 'with_children' : 'without_children'];
            this.results['WIFE'] = { share, count: heir.count };
            this.explanations['WIFE'] = hasChildren
                ? `ترث الزوجة (أو تشترك الزوجات بالتساوي في) الثمن (1/8) فرضاً لوجود فرع وارث للمتوفى (الأولاد أو أولاد البنين وإن نزلوا)، لقوله تعالى: [فَإِنْ كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُّمُنُ مِمَّا تَرَكْتُمْ].`
                : `ترث الزوجة من زوجها الربع (1/4) فرضاً (أو تشترك فيه الزوجات بالتساوي) لعدم وجود فرع وارث للمتوفى (بنين أو بنات أو أولاد البنين)، والفرع الوارث هم: الأولاد بنون أو بنات، وأولاد الأبناء وإن نزلوا، أما أولاد البنات فهم فروع غير وارثين، لقوله تعالى: [وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِنْ لَمْ يَكُنْ لَكُمْ وَلَدٌ].`;
            remaining = remaining.sub(share);
        }

        if (this.heirs['FATHER']) {
            if (hasChildren) {
                const share = InheritanceCalculator.FIXED_SHARES['FATHER']['with_children'];
                this.results['FATHER'] = { share, count: 1, asabah: true };
                this.explanations['FATHER'] = `يرث الأب السدس (1/6) فرضاً لوجود فرع وارث للمتوفى، لقوله تعالى: [وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِنْ كَانَ لَهُ وَلَدٌ]، مع حقه في أخذ الباقي تعصيباً إن كان الفرع الوارث إناثاً فقط.`;
                remaining = remaining.sub(share);
            }
        }

        if (this.heirs['PATERNAL_GRANDFATHER'] && !this.heirs['PATERNAL_GRANDFATHER'].is_blocked && !hasActiveSiblings) {
            if (hasChildren) {
                const share = new Fraction(1, 6);
                this.results['PATERNAL_GRANDFATHER'] = { share, count: 1, asabah: true };
                this.explanations['PATERNAL_GRANDFATHER'] = `يرث الجد لأب (أبو الأب) السدس (1/6) فرضاً عند عدم وجود الأب ووجود فرع وارث، كونه يقوم مقام الأب عند فقده، مع حقه في أخذ الباقي تعصيباً إن كان الفرع إناثاً فقط.`;
                remaining = remaining.sub(share);
            }
        }

        if (this.heirs['PATERNAL_GREAT_GRANDFATHER'] && !this.heirs['PATERNAL_GREAT_GRANDFATHER'].is_blocked && !hasActiveSiblings) {
            if (hasChildren) {
                const share = new Fraction(1, 6);
                this.results['PATERNAL_GREAT_GRANDFATHER'] = { share, count: 1, asabah: true };
                this.explanations['PATERNAL_GREAT_GRANDFATHER'] = `يرث أبو أبو الأب السدس (1/6) فرضاً عند عدم وجود الأب أو الجد القريب ووجود فرع وارث للمتوفى، مع حقه في تعصيب الباقي إن كان الفرع إناثاً.`;
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
            this.explanations['MOTHER'] = useOneSixth
                ? `ترث الأم السدس (1/6) فرضاً ${hasChildren ? 'لوجود فرع وارث للمتوفى (لقوله تعالى: [وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِنْ كَانَ لَهُ وَلَدٌ])' : 'لوجود جمع من الإخوة للمتوفى (اثنان فأكثر من أي جهة كانوا، لقوله تعالى: [فَإِنْ كَانَ لَهُ إِخْوَةٌ فَلِأُمِّهِ السُّدُسُ])'}.`
                : `ترث الأم الثلث (1/3) فرضاً لعدم وجود فرع وارث للمتوفى وعدم وجود جمع من الإخوة، لقوله تعالى: [فَإِنْ لَمْ يَكُنْ لَهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ فَلِأُمِّهِ الثُّلُثُ].`;
            remaining = remaining.sub(share);
        }

        // Daughter / Daughter of Son / Daughter of grandson
        if (this.heirs['DAUGHTER'] && !this.heirs['SON']) {
            const heir = this.heirs['DAUGHTER'];
            const share = InheritanceCalculator.FIXED_SHARES['DAUGHTER'][heir.count === 1 ? 'single' : 'multiple'];
            this.results['DAUGHTER'] = { share, count: heir.count };
            this.explanations['DAUGHTER'] = heir.count === 1
                ? `ترث البنت الصلبية النصف (1/2) فرضاً لانفرادها ولعدم وجود ابن صلب يعصبها، لقوله تعالى: [وَإِنْ كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ].`
                : `يرث البنات الصلبيات الثلثين (2/3) فرضاً لتعددهن (اثنتين فأكثر) ولعدم وجود ابن صلب يعصبهن (توزع بالتساوي)، لقوله تعالى: [فَإِنْ كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ].`;
            remaining = remaining.sub(share);
        }

        if (this.heirs['GRANDDAUGHTER'] && !this.heirs['GRANDDAUGHTER'].is_blocked) {
            const heir = this.heirs['GRANDDAUGHTER'];
            if (!this.heirs['DAUGHTER']) {
                const share = heir.count === 1 ? new Fraction(1, 2) : new Fraction(2, 3);
                this.results['GRANDDAUGHTER'] = { share, count: heir.count };
                this.explanations['GRANDDAUGHTER'] = heir.count === 1
                    ? `ترث بنت الابن النصف (1/2) فرضاً عند عدم وجود فرع وارث أعلى منها (كالولد الصلبي) وعدم وجود ابن ابن يعصبها.`
                    : `يرث بنات الابن الثلثين (2/3) فرضاً لتعددهن ولعدم وجود فرع وارث أعلى منهن ولا عاصب يعصبهن (توزع بالتساوي بينهن).`;
                remaining = remaining.sub(share);
            } else {
                const daughterCount = this.heirs['DAUGHTER'].count;
                if (daughterCount === 1) {
                    const share = new Fraction(1, 6);
                    this.results['GRANDDAUGHTER'] = { share, count: heir.count };
                    this.explanations['GRANDDAUGHTER'] = `ترث بنت الابن (أو بنات الابن بالتساوي) السدس (1/6) فرضاً تكملةً للثلثين لوجود بنت صلبية واحدة وارثة أعلى منها مستحقة للنصف.`;
                    remaining = remaining.sub(share);
                } else {
                    this.heirs['GRANDDAUGHTER'].is_blocked = true;
                    this.explanations['GRANDDAUGHTER'] = `بنت الابن محجوبة من الميراث لاستغراق البنات الصلبيات فرض الثلثين (2/3).`;
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
                    ? `ترث بنت ابن الابن النصف (1/2) فرضاً لانفرادها ولعدم وجود فرع وارث أعلى منها ولا عاصب يعصبها.`
                    : `يرث بنات ابن الابن الثلثين (2/3) فرضاً لتعددهن لعدم وجود فرع وارث أعلى منهن ولا عاصب.`;
                remaining = remaining.sub(share);
            } else if (daughterCount + granddaughterCount === 1) {
                const share = new Fraction(1, 6);
                this.results['GREAT_GRANDDAUGHTER'] = { share, count: heir.count };
                this.explanations['GREAT_GRANDDAUGHTER'] = `ترث بنت ابن الابن السدس (1/6) فرضاً تكملة للثلثين لوجود بنت واحدة (أو بنت ابن) أعلى منها مستحقة للنصف.`;
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
                    ? `ترث الأخت الشقيقة النصف (1/2) فرضاً لانفرادها وعدم وجود فرع وارث أو أصل ذكر (أب/جد) أو أخ شقيق يعصبها، لقوله تعالى: [إِنِ امْرُؤٌ هَلَكَ لَيْسَ لَهُ وَلَدٌ وَلَهُ أُخْتٌ فَلَهَا نِصْفُ مَا تَرَكَ].`
                    : `يرث الأخوات الشقيقات الثلثين (2/3) فرضاً لتعددهن وعدم وجود فرع وارث أو أصل ذكر أو عاصب يعصبهن (توزع بالتساوي)، لقوله تعالى: [فَإِنْ كَانَتَا اثْنَتَيْنِ فَلَهُمَا الثُّلُثَانِ مِمَّا تَرَكَ].`;
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
                    this.explanations[rel] = `يرث الأخ/الأخت لأم السدس (1/6) فرضاً لانفراده وعدم وجود فرع وارث للمتوفى ولا أصل ذكر وارث (تسمى كلالة)، لقوله تعالى: [وَإِنْ كَانَ رَجُلٌ يُورَثُ كَلَالَةً أَوِ امْرَأَةٌ وَلَهُ أَخٌ أَوْ أُخْتٌ فَلِكُلِّ وَاحِدٍ مِنْهُمَا السُّدُسُ].`;
                } else {
                    share = new Fraction(1, 3).mul(new Fraction(heir.count, totalMaternal));
                    this.explanations[rel] = `يرث الإخوة لأم الثلث (1/3) فرضاً يشتركون فيه بالتساوي (للذكر مثل الأنثى دون تفضيل) لتعددهم وعدم وجود فرع وارث ولا أصل ذكر وارث، لقوله تعالى: [فَإِنْ كَانُوا أَكْثَرَ مِنْ ذَلِكَ فَهُمْ شُرَكَاءُ فِي الثُّلُثِ].`;
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
                    ? `ترث الجدة السدس (1/6) فرضاً عند عدم وجود الأم الحاجبة لها كلياً.`
                    : `ترث الجدة السدس (1/6) فرضاً تشترك فيه مع الجدات الوارثات بالتساوي لعدم وجود الأم.`;
                remaining = remaining.sub(shareEach);
            }
        }

        return remaining;
    }

    _distribute_residue(remaining) {
        if (remaining.lessThan(0) || remaining.equals(0)) {
            return;
        }

        // Special case: Grandfather with Siblings (الجد مع الإخوة) under Maliki school (Moroccan Family Code)
        const activeSiblings = ['FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER']
            .filter(rel => this.heirs[rel] && !this.heirs[rel].is_blocked);
        
        let activeGFKey = null;
        if (this.heirs['PATERNAL_GRANDFATHER'] && !this.heirs['PATERNAL_GRANDFATHER'].is_blocked) {
            activeGFKey = 'PATERNAL_GRANDFATHER';
        } else if (this.heirs['PATERNAL_GREAT_GRANDFATHER'] && !this.heirs['PATERNAL_GREAT_GRANDFATHER'].is_blocked) {
            activeGFKey = 'PATERNAL_GREAT_GRANDFATHER';
        }

        if (activeGFKey && activeSiblings.length > 0) {
            const FB = this.heirs['FULL_BROTHER'] ? this.heirs['FULL_BROTHER'].count : 0;
            const FS = this.heirs['FULL_SISTER'] ? this.heirs['FULL_SISTER'].count : 0;
            const PB = this.heirs['PATERNAL_BROTHER'] ? this.heirs['PATERNAL_BROTHER'].count : 0;
            const PS = this.heirs['PATERNAL_SISTER'] ? this.heirs['PATERNAL_SISTER'].count : 0;

            // Option 1: المقاسمة (Sharing)
            // Grandfather counts as a brother (2 shares). Brothers count as 2 shares. Sisters count as 1 share.
            const totalParts = 2 + 2 * (FB + PB) + (FS + PS);
            const shareSharing = remaining.mul(new Fraction(2, totalParts));

            // Check if there are other heirs of fixed shares
            const otherFixedHeirsExist = ['HUSBAND', 'WIFE', 'MOTHER', 'DAUGHTER', 'GRANDDAUGHTER', 'GREAT_GRANDDAUGHTER', 
                                          'PATERNAL_GRANDMOTHER', 'MATERNAL_GRANDMOTHER', 'MATERNAL_GREAT_GRANDMOTHER', 
                                          'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER']
                                          .some(r => this.heirs[r] && !this.heirs[r].is_blocked);

            // Option 2: ثلث الباقي (1/3 of remainder) or ثلث جميع المال (1/3 of total)
            const shareOneThird = otherFixedHeirsExist ? remaining.mul(new Fraction(1, 3)) : new Fraction(1, 3);

            // Option 3: سدس جميع المال (1/6 of total)
            const shareOneSixth = otherFixedHeirsExist ? new Fraction(1, 6) : new Fraction(0);

            // Determine the best option (الأحظ)
            let grandfatherShare = shareSharing;
            let explanationOption = 'بالمقاسمة مع الإخوة كأخ شقيق كونه الأحظ له';

            if (shareOneThird.greaterThan(grandfatherShare)) {
                grandfatherShare = shareOneThird;
                explanationOption = otherFixedHeirsExist 
                    ? 'بفرض ثلث الباقي كونه الأحظ له لوجود أصحاب فروض مع الإخوة'
                    : 'بفرض ثلث التركة كونه الأحظ له مع الإخوة';
            }
            if (shareOneSixth.greaterThan(grandfatherShare)) {
                grandfatherShare = shareOneSixth;
                explanationOption = 'بفرض السدس كونه الأحظ له لوجود أصحاب فروض مع الإخوة';
            }

            // Assign grandfather's share
            this.results[activeGFKey] = { share: grandfatherShare, count: 1 };
            const gfName = this.heirs[activeGFKey].displayName;
            this.explanations[activeGFKey] = `يرث ${gfName} ${explanationOption}.`;

            // Calculate remaining share for siblings
            const siblingShare = remaining.sub(grandfatherShare);

            if (siblingShare.greaterThan(0)) {
                if (FB > 0 || FS > 0) {
                    // Full siblings present
                    if (FB > 0) {
                        const totalFullParts = 2 * FB + FS;
                        const brotherShare = siblingShare.mul(new Fraction(2 * FB, totalFullParts));
                        this.results['FULL_BROTHER'] = { share: brotherShare, count: FB };
                        this.explanations['FULL_BROTHER'] = `يرث الأخ الشقيق (أو الإخوة الأشقاء بالتساوي) الباقي بعد نصيب الجد بالتعصيب للذكر مثل حظ الأنثيين.`;
                        
                        if (FS > 0) {
                            const sisterShare = siblingShare.mul(new Fraction(FS, totalFullParts));
                            this.results['FULL_SISTER'] = { share: sisterShare, count: FS };
                            this.explanations['FULL_SISTER'] = `ترث الأخت الشقيقة (أو الأخوات الشقيقات بالتساوي) بالتعصيب مع الإخوة الأشقاء.`;
                        }
                    } else {
                        // Only full sisters, no full brothers
                        const sisterMaxFraction = new Fraction(FS === 1 ? 1 : 2, FS === 1 ? 2 : 3);
                        const actualSisterShare = siblingShare.greaterThan(sisterMaxFraction) ? sisterMaxFraction : siblingShare;
                        this.results['FULL_SISTER'] = { share: actualSisterShare, count: FS };
                        this.explanations['FULL_SISTER'] = `ترث الأخت الشقيقة (أو الأخوات الشقيقات بالتساوي) فرضاً ${FS === 1 ? 'النصف (1/2)' : 'الثلثين (2/3)'} من التركة كحد أقصى.`;
                        
                        const paternalShare = siblingShare.sub(actualSisterShare);
                        if (paternalShare.greaterThan(0) && (PB > 0 || PS > 0)) {
                            const totalPaternalParts = 2 * PB + PS;
                            if (PB > 0) {
                                const pBrotherShare = paternalShare.mul(new Fraction(2 * PB, totalPaternalParts));
                                this.results['PATERNAL_BROTHER'] = { share: pBrotherShare, count: PB };
                                this.explanations['PATERNAL_BROTHER'] = `يرث الأخ لأب الباقي بعد نصيب الجد والأخوات الشقيقات بالتعصيب.`;
                            }
                            if (PS > 0) {
                                const pSisterShare = paternalShare.mul(new Fraction(PS, totalPaternalParts));
                                this.results['PATERNAL_SISTER'] = { share: pSisterShare, count: PS };
                                this.explanations['PATERNAL_SISTER'] = `ترث الأخت لأب الباقي بعد نصيب الجد والأخوات الشقيقات بالتعصيب.`;
                            }
                        }
                    }

                    // Block paternal siblings from sharing directly if full siblings took everything
                    for (const rel of ['PATERNAL_BROTHER', 'PATERNAL_SISTER']) {
                        if (this.heirs[rel] && !this.results[rel]) {
                            this.heirs[rel].is_blocked = true;
                            this.heirs[rel].blocked_by = FB > 0 ? 'FULL_BROTHER' : 'FULL_SISTER';
                            this.explanations[rel] = `${this.heirs[rel].displayName} محجوب لوجود الإخوة الأشقاء واستغراقهم التركة مضافاً إلى الجد.`;
                        }
                    }
                } else {
                    // No full siblings, only paternal siblings
                    const totalPaternalParts = 2 * PB + PS;
                    if (PB > 0) {
                        const pBrotherShare = siblingShare.mul(new Fraction(2 * PB, totalPaternalParts));
                        this.results['PATERNAL_BROTHER'] = { share: pBrotherShare, count: PB };
                        this.explanations['PATERNAL_BROTHER'] = `يرث الأخ لأب الباقي بعد نصيب الجد بالتعصيب للذكر مثل حظ الأنثيين.`;
                    }
                    if (PS > 0) {
                        const pSisterShare = siblingShare.mul(new Fraction(PS, totalPaternalParts));
                        this.results['PATERNAL_SISTER'] = { share: pSisterShare, count: PS };
                        this.explanations['PATERNAL_SISTER'] = `ترث الأخت لأب الباقي بعد نصيب الجد بالتعصيب مع الإخوة لأب.`;
                    }
                }
            }
            return;
        }

        // 1. Children
        if (this.heirs['SON']) {
            const sonCount = this.heirs['SON'].count;
            const daughterCount = this.heirs['DAUGHTER'] ? this.heirs['DAUGHTER'].count : 0;
            const totalParts = (sonCount * 2) + daughterCount;

            const sonShare = remaining.mul(new Fraction(sonCount * 2, totalParts));
            this.results['SON'] = { share: sonShare, count: sonCount };
            this.explanations['SON'] = `يرث الابن (أو الأبناء بالتساوي) الباقي من التركة تعصيباً (عصبة بالنفس كونه أقرب عاصب ذكر للمتوفى)، ويشتركون مع البنات بالتعصيب بالغير للذكر مثل حظ الأنثيين، لقوله تعالى: [يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنْثَيَيْنِ].`;

            if (daughterCount > 0) {
                const daughterShare = remaining.mul(new Fraction(daughterCount, totalParts));
                this.results['DAUGHTER'] = { share: daughterShare, count: daughterCount };
                this.explanations['DAUGHTER'] = `ترث البنت (أو البنات بالتساوي) بالتعصيب بالغير مع الابن (للذكر مثل حظ الأنثيين)، لقوله تعالى: [يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنْثَيَيْنِ].`;
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
            this.explanations['GRANDSON'] = `يرث ابن الابن الباقي تعصيباً كونه يقوم مقام الابن عند عدمه، ويشترك مع بنات الابن بالتعصيب بالغير (للذكر مثل حظ الأنثيين).`;

            if (daughterCount > 0) {
                const daughterShare = remaining.mul(new Fraction(daughterCount, totalParts));
                this.results['GRANDDAUGHTER'] = { share: daughterShare, count: daughterCount };
                this.explanations['GRANDDAUGHTER'] = `ترث بنت الابن بالتعصيب بالغير مع ابن الابن (للذكر مثل حظ الأنثيين) لعدم وجود فرع وارث أعلى.`;
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
            this.explanations['GREAT_GRANDSON'] = `يرث ابن ابن الابن الباقي تعصيباً لعدم وجود فروع وارثة ذكر أعلى درجة منه.`;

            if (daughterCount > 0) {
                const daughterShare = remaining.mul(new Fraction(daughterCount, totalParts));
                this.results['GREAT_GRANDDAUGHTER'] = { share: daughterShare, count: daughterCount };
                this.explanations['GREAT_GRANDDAUGHTER'] = `ترث بنت ابن الابن بالتعصيب بالغير مع ابن ابن الابن (للذكر مثل حظ الأنثيين).`;
            }
            return;
        }

        // 4. Father
        if (this.heirs['FATHER'] && !this.results['FATHER']) {
            this.results['FATHER'] = { share: remaining, count: 1 };
            this.explanations['FATHER'] = `يرث الأب الباقي تعصيباً (عصبة بالنفس) لعدم وجود فرع وارث ذكر (بنين أو أولاد البنين)، للحديث الشريف: (ألحقوا الفرائض بأهلها، فما بقي فهو لأولى رجل ذكر).`;
            return;
        } else if (this.results['FATHER'] && this.results['FATHER'].asabah) {
            this.results['FATHER'].share = this.results['FATHER'].share.add(remaining);
            this.explanations['FATHER'] = `يرث الأب السدس فرضاً لوجود فرع وارث أنثى (لقوله تعالى: [وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِنْهُمَا السُّدُسُ]) مضافاً إليه الباقي تعصيباً لعدم وجود فرع وارث ذكر للمتوفى.`;
            return;
        }

        // 5. Grandfathers
        if (this.heirs['PATERNAL_GRANDFATHER'] && !this.heirs['PATERNAL_GRANDFATHER'].is_blocked) {
            if (!this.results['PATERNAL_GRANDFATHER']) {
                this.results['PATERNAL_GRANDFATHER'] = { share: remaining, count: 1 };
                this.explanations['PATERNAL_GRANDFATHER'] = `يرث الجد لأب (أبو الأب) الباقي تعصيباً عند عدم وجود الأب أو فرع وارث ذكر للمتوفى، كونه يقوم مقام الأب.`;
            } else if (this.results['PATERNAL_GRANDFATHER'] && this.results['PATERNAL_GRANDFATHER'].asabah) {
                this.results['PATERNAL_GRANDFATHER'].share = this.results['PATERNAL_GRANDFATHER'].share.add(remaining);
                this.explanations['PATERNAL_GRANDFATHER'] = `يرث الجد لأب السدس فرضاً لوجود فرع وارث أنثى بالإضافة إلى الباقي تعصيباً لعدم وجود الأب وفرع ذكر.`;
            }
            return;
        }

        if (this.heirs['PATERNAL_GREAT_GRANDFATHER'] && !this.heirs['PATERNAL_GREAT_GRANDFATHER'].is_blocked) {
            if (!this.results['PATERNAL_GREAT_GRANDFATHER']) {
                this.results['PATERNAL_GREAT_GRANDFATHER'] = { share: remaining, count: 1 };
                this.explanations['PATERNAL_GREAT_GRANDFATHER'] = `يرث أبو أبو الأب الباقي تعصيباً لعدم وجود الأب أو الجد القريب أو فرع وارث ذكر للمتوفى.`;
            } else if (this.results['PATERNAL_GREAT_GRANDFATHER'] && this.results['PATERNAL_GREAT_GRANDFATHER'].asabah) {
                this.results['PATERNAL_GREAT_GRANDFATHER'].share = this.results['PATERNAL_GREAT_GRANDFATHER'].share.add(remaining);
                this.explanations['PATERNAL_GREAT_GRANDFATHER'] = `يرث أبو أبو الأب السدس فرضاً لوجود فرع وارث أنثى وعدم وجود الأب أو الجد القريب بالإضافة إلى الباقي تعصيباً.`;
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
            this.explanations['FULL_BROTHER'] = `يرث الأخ الشقيق (أو الإخوة الأشقاء بالتساوي) الباقي تعصيباً كونه أقرب عاصب ذكر متبقي (عصبة بالنفس)، ويشتركون مع الأخوات الشقيقات بالتعصيب بالغير (للذكر مثل حظ الأنثيين)، لقوله تعالى: [وَإِنْ كَانُوا إِخْوَةً رِجَالًا وَنِسَاءً فَلِلذَّكَرِ مِثْلُ حَظِّ الْأُنْثَيَيْنِ].`;

            if (sisterCount > 0) {
                this.results['FULL_SISTER'] = { share: remaining.mul(new Fraction(sisterCount, totalParts)), count: sisterCount };
                this.explanations['FULL_SISTER'] = `ترث الأخت الشقيقة بالتعصيب بالغير مع الأخ الشقيق (للذكر مثل حظ الأنثيين)، لقوله تعالى: [وَإِنْ كَانُوا إِخْوَةً رِجَالًا وَنِسَاءً فَلِلذَّكَرِ مِثْلُ حَظِّ الْأُنْثَيَيْنِ].`;
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
            this.explanations['PATERNAL_BROTHER'] = `يرث الأخ لأب (أو الإخوة لأب بالتساوي) الباقي تعصيباً (عصبة بالنفس) لعدم وجود عاصب أقرب كالأخ الشقيق أو الفروع أو الأصول الذكور، ويشتركون مع الأخوات لأب بالتعصيب بالغير.`;

            if (sisterCount > 0) {
                this.results['PATERNAL_SISTER'] = { share: remaining.mul(new Fraction(sisterCount, totalParts)), count: sisterCount };
                this.explanations['PATERNAL_SISTER'] = `ترث الأخت لأب بالتعصيب بالغير مع الأخ لأب (للذكر مثل حظ الأنثيين).`;
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

    _apply_radd() {
        let sumShares = new Fraction(0);
        for (const key of Object.keys(this.results)) {
            sumShares = sumShares.add(this.results[key].share);
        }

        if (sumShares.lessThan(1)) {
            for (const key of Object.keys(this.results)) {
                const originalShare = this.results[key].share;
                this.results[key].share = originalShare.div(sumShares);
                this.explanations[key] += ` (تمت زيادة النصيب بالرد لعدم وجود عاصب).`;
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
            if (this.gender === 'female') {
                whyText = whyText.replace(/المتوفى/g, 'المتوفاة');
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
                let whyText = this.explanations[relationship] || `${heirObj.displayName} محجوب من الميراث.`;
                if (this.gender === 'female') {
                    whyText = whyText.replace(/المتوفى/g, 'المتوفاة');
                }
                distributions.push({
                    relationship,
                    relationship_display: heirObj.displayName,
                    count: heirObj.count,
                    share_fraction: "0",
                    percentage: 0,
                    total_value: 0,
                    per_person_value: 0,
                    why: whyText
                });
            }
        }

        return {
            case_id: this.case.id,
            deceased_name: this.case.name,
            deceased_gender: this.gender,
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
