import Fraction from '../fraction.js';
import { HEIR_NAMES_AR } from './Explanations.js';
import { applyBlockingRules } from './BlockingRules.js';
import { calculateFixedShares } from './FixedShares.js';
import { calculateGrandmothersShare } from './Grandmothers.js';
import { hasGrandfatherWithSiblings, calculateGrandfatherWithSiblings } from './Grandfather.js';
import { distributeResidue } from './Asabah.js';
import { checkAndApplyAwl } from './Awl.js';
import { checkAndApplyRadd } from './Radd.js';
import { executeWills, prepareFinalResults } from './PrepareResults.js';

export class InheritanceCalculator {
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

        // 1. Process Wills
        const willsResult = executeWills(this.wills_input, this.net_estate, this.heirs_approved_excess);
        this.wills_executed = willsResult.processedWills;
        this.total_wills_cost = willsResult.finalWillsCost;
        this.net_estate_for_heirs = willsResult.netEstateForHeirs;
        this.heirs_scale_fraction = willsResult.heirsScaleFraction;
        this.wills_explanation = willsResult.willsExplanation;
        this.is_wills_scaled = willsResult.isWillsScaled;

        const originalNetEstate = this.net_estate;
        const netEstateForCalculation = this.net_estate_for_heirs;

        // 2. Apply Blocking Rules
        applyBlockingRules(this.heirs, this.explanations);

        // 3. Calculate Shares
        let remaining = new Fraction(1);

        // Calculate standard fixed shares (excludes Grandfather/Siblings if they inherit together)
        remaining = calculateFixedShares(this.heirs, this.results, this.explanations, remaining);

        // Calculate Grandmothers share
        remaining = calculateGrandmothersShare(this.heirs, this.results, this.explanations, remaining);

        // Calculate Grandfather with Siblings (Maliki Rule) or standard Residue
        if (hasGrandfatherWithSiblings(this.heirs)) {
            const otherFixedHeirsExist = [
                'HUSBAND', 'WIFE', 'MOTHER', 'DAUGHTER', 'GRANDDAUGHTER', 'GREAT_GRANDDAUGHTER',
                'PATERNAL_GRANDMOTHER', 'MATERNAL_GRANDMOTHER', 'MATERNAL_GREAT_GRANDMOTHER',
                'PATERNAL_GREAT_GRANDMOTHER', 'MATERNAL_PATERNAL_GREAT_GRANDMOTHER'
            ].some(r => this.heirs[r] && !this.heirs[r].is_blocked);

            remaining = calculateGrandfatherWithSiblings(this.heirs, this.results, this.explanations, remaining, otherFixedHeirsExist);
        } else {
            distributeResidue(this.heirs, this.results, this.explanations, remaining);
        }

        // 4. Apply Awl
        const awlResult = checkAndApplyAwl(this.results, this.explanations);

        // 5. Apply Radd (if no Awl occurred)
        if (!awlResult.isAul) {
            checkAndApplyRadd(this.results, this.explanations, this.heirs);
        }

        // 6. Format and Prepare Final Results
        return prepareFinalResults({
            results: this.results,
            heirs: this.heirs,
            explanations: this.explanations,
            caseData: this.case,
            gender: this.gender,
            netEstate: netEstateForCalculation,
            originalNetEstate,
            totalWillsCost: this.total_wills_cost,
            willsExecuted: this.wills_executed,
            willsExplanation: this.wills_explanation,
            isWillsScaled: this.is_wills_scaled,
            isAul: awlResult.isAul,
            totalShares: awlResult.sumShares,
            heirsScaleFraction: this.heirs_scale_fraction
        });
    }
}
