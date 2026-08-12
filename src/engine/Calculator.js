/**
 * @file Calculator.js
 * @description Main orchestrator for Islamic inheritance calculations and statutory Mandatory Bequests (الوصية الواجبة).
 * Coordinates debt deductions, mandatory bequests, voluntary wills, fixed shares, residuary distribution,
 * Awl, Radd, Treasury fallbacks, and multi-step solver pedagogical breakdowns.
 */

import Fraction from '../fraction.js';
import { HEIR_NAMES_AR } from './Explanations.js';
import { applyBlockingRules } from './BlockingRules.js';
import { calculateFixedShares } from './FixedShares.js';
import { calculateGrandmothersShare } from './Grandmothers.js';
import { hasGrandfatherWithSiblings, calculateGrandfatherWithSiblings } from './Grandfather.js';
import { distributeResidue } from './Asabah.js';
import { checkAndApplyAwl } from './Awl.js';
import { checkAndApplyRadd } from './Radd.js';
import { calculateMandatoryBequests } from './MandatoryBequest.js';
import { executeWills, prepareFinalResults } from './PrepareResults.js';
import { getStandardSteps, getMandatoryBequestSteps } from './SolverDetails.js';

/**
 * @typedef {Object} RawHeirInput
 * @property {string} relationship - Standard relationship code (e.g. 'WIFE', 'SON').
 * @property {number} [count=1] - Number of heirs for this relationship.
 */

/**
 * @typedef {Object} MandatoryBequestInput
 * @property {string} id - Unique identifier for the bequest branch.
 * @property {'son'|'daughter'} type - Branch gender type.
 * @property {number} [sonsCount=0] - Number of living sons in this branch.
 * @property {number} [daughtersCount=0] - Number of living daughters in this branch.
 * @property {number} [greatSonsCount=0] - Number of living great-grandsons in this branch.
 * @property {number} [greatDaughtersCount=0] - Number of living great-granddaughters in this branch.
 * @property {boolean} [spouseAlive=false] - True if the deceased child's spouse is alive.
 * @property {boolean} [motherAlive=false] - True if the deceased child's mother is alive.
 * @property {boolean} [greatSpouseAlive=false] - True if the deceased grandson's spouse is alive.
 */

/**
 * @typedef {Object} CaseData
 * @property {string} [id] - Unique case identifier.
 * @property {string} [name] - Name of the deceased.
 * @property {'male'|'female'} [gender] - Gender of the deceased.
 * @property {number} total_estate_value - Total gross estate value.
 * @property {number} [funeral_expenses=0] - Pre-distribution funeral costs.
 * @property {number} [debts=0] - Debts and obligations.
 * @property {RawHeirInput[]} heirs - List of surviving primary heirs.
 * @property {import('./PrepareResults.js').WillInput[]} [wills] - List of voluntary wills.
 * @property {boolean} [heirsApprovedExcess=false] - Whether heirs approved wills exceeding 1/3.
 * @property {MandatoryBequestInput[]} [mandatoryBequests] - Mandatory bequest configurations.
 */

/**
 * Main Islamic Inheritance Calculator engine class.
 * 
 * Life Cycle of Calculation:
 * 1. Deduct funeral expenses and debts from gross estate -> Net Estate (التركة الصافية).
 * 2. If Mandatory Bequests (الوصية الواجبة) exist:
 *    - Calculate hypothetical share of deceased children via preliminary problem (العمل التمهيدي).
 *    - Deduct virtual spouse, mother/paternal grandmother, and grandfather shares in sub-problems.
 *    - Distribute branch residue to living grandchildren and great-grandchildren.
 *    - Cap total mandatory bequests at 1/3 of the net estate.
 * 3. Process Voluntary Wills (الوصية الاختيارية) against remaining estate portion.
 * 4. Apply Islamic Blocking Rules (حجب الحرمان) across all primary heirs.
 * 5. Allocate Quranic Fixed Shares (أصحاب الفروض) and Grandmothers' share.
 * 6. Distribute remaining residue to Residuary Heirs (العصبات) or Maliki Grandfather-Sibling division.
 * 7. Apply Al-Awl (العول) if total shares > 1.
 * 8. Apply Al-Radd (الرد) if total shares < 1 with no Asabah.
 * 9. Fallback to Islamic Treasury (بيت المال) if no surviving heirs exist.
 * 10. Generate pedagogical steps and compile final normalized distributions.
 */
export class InheritanceCalculator {
    /**
     * Initializes the InheritanceCalculator instance with case parameters.
     * 
     * @param {CaseData} caseData - The inheritance case input model.
     */
    constructor(caseData) {
        this.case = caseData;
        this.gender = caseData.gender || (caseData.heirs && caseData.heirs.some(h => h.relationship === 'HUSBAND') ? 'female' : 'male');
        this.heirs = {};

        // 1. Initialize primary heirs
        for (const h of caseData.heirs || []) {
            this.heirs[h.relationship] = {
                relationship: h.relationship,
                count: h.count || 1,
                is_blocked: false,
                blocked_by: null,
                displayName: HEIR_NAMES_AR[h.relationship] || h.relationship
            };
        }

        // 2. Register living grandchildren from mandatory bequest branches into heirs map
        if (caseData.mandatoryBequests && caseData.mandatoryBequests.length > 0) {
            let sonIndex = 0;
            for (const mb of caseData.mandatoryBequests) {
                if (mb.type === 'son') {
                    sonIndex++;
                    const parentDesignation = `(من الابن المتوفى #${sonIndex})`;

                    const totalSons = parseInt(mb.sonsCount, 10) || 0;
                    const totalDaughters = parseInt(mb.daughtersCount, 10) || 0;
                    const totalGreatSons = parseInt(mb.greatSonsCount, 10) || 0;
                    const totalGreatDaughters = parseInt(mb.greatDaughtersCount, 10) || 0;

                    if (totalSons > 0) {
                        if (!this.heirs['GRANDSON']) {
                            this.heirs['GRANDSON'] = {
                                relationship: 'GRANDSON',
                                count: totalSons,
                                is_blocked: false,
                                blocked_by: null,
                                displayName: `ابن ابن ${parentDesignation}`
                            };
                        } else {
                            this.heirs['GRANDSON'].count += totalSons;
                            this.heirs['GRANDSON'].displayName += ` و ${parentDesignation}`;
                        }
                    }
                    if (totalDaughters > 0) {
                        if (!this.heirs['GRANDDAUGHTER']) {
                            this.heirs['GRANDDAUGHTER'] = {
                                relationship: 'GRANDDAUGHTER',
                                count: totalDaughters,
                                is_blocked: false,
                                blocked_by: null,
                                displayName: `بنت ابن ${parentDesignation}`
                            };
                        } else {
                            this.heirs['GRANDDAUGHTER'].count += totalDaughters;
                            this.heirs['GRANDDAUGHTER'].displayName += ` و ${parentDesignation}`;
                        }
                    }
                    if (totalGreatSons > 0) {
                        if (!this.heirs['GREAT_GRANDSON']) {
                            this.heirs['GREAT_GRANDSON'] = {
                                relationship: 'GREAT_GRANDSON',
                                count: totalGreatSons,
                                is_blocked: false,
                                blocked_by: null,
                                displayName: `ابن ابن ابن ${parentDesignation}`
                            };
                        } else {
                            this.heirs['GREAT_GRANDSON'].count += totalGreatSons;
                            this.heirs['GREAT_GRANDSON'].displayName += ` و ${parentDesignation}`;
                        }
                    }
                    if (totalGreatDaughters > 0) {
                        if (!this.heirs['GREAT_GRANDDAUGHTER']) {
                            this.heirs['GREAT_GRANDDAUGHTER'] = {
                                relationship: 'GREAT_GRANDDAUGHTER',
                                count: totalGreatDaughters,
                                is_blocked: false,
                                blocked_by: null,
                                displayName: `بنت ابن ابن ${parentDesignation}`
                            };
                        } else {
                            this.heirs['GREAT_GRANDDAUGHTER'].count += totalGreatDaughters;
                            this.heirs['GREAT_GRANDDAUGHTER'].displayName += ` و ${parentDesignation}`;
                        }
                    }
                }
            }
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

    /**
     * Calculates statutory Mandatory Bequests (الوصية الواجبة) under Moroccan Law (Articles 369-372 of the Family Code).
     * Delegated to the specialized `MandatoryBequest.js` module.
     * 
     * @returns {{cost: number, fraction: Fraction, isScaled: boolean, list: Array<Object>}} Result summary.
     */
    calculateMandatoryBequests() {
        return calculateMandatoryBequests({
            heirs: this.heirs,
            caseData: this.case,
            wills_input: this.wills_input,
            heirs_approved_excess: this.heirs_approved_excess,
            net_estate: this.net_estate,
            CalculatorClass: InheritanceCalculator
        });
    }

    /**
     * Executes the complete inheritance calculation pipeline.
     * 
     * @returns {import('./PrepareResults.js').FinalDistribution[]|Object} Result payload with formatted distributions and step breakdowns.
     */
    calculate() {
        if (this.net_estate <= 0) {
            return {
                error: 'لا تركة للتوزيع بعد خصم الديون والالتزامات',
                error_en: 'No estate to distribute after deductions',
                distributions: []
            };
        }

        // Run blocking rules temporarily to see who is blocked
        applyBlockingRules(this.heirs, {});

        // 1. Process Mandatory Bequests (الوصية الواجبة)
        const mbResult = this.calculateMandatoryBequests();
        this.mandatory_bequests_result = mbResult;

        const netEstateForWillsAndHeirs = this.net_estate - mbResult.cost;

        // Limit for voluntary wills: remaining portion of 1/3 after mandatory bequests
        let voluntaryLimitFraction = new Fraction(0);
        if (mbResult.fraction.lessThan(new Fraction(1, 3))) {
            const numerator = new Fraction(1, 3).sub(mbResult.fraction);
            const denominator = new Fraction(1).sub(mbResult.fraction);
            voluntaryLimitFraction = numerator.div(denominator);
        }

        // Scale the voluntary wills input to the remaining estate basis
        const mbFract = mbResult.fraction;
        const scaleRemaining = new Fraction(1).sub(mbFract);
        const scaledWillsInput = this.wills_input.map(will => {
            let newValue = will.value;
            if (scaleRemaining.valueOf() > 0) {
                if (will.valueType === 'fraction') {
                    const parts = (will.value || '1/3').split('/');
                    const num = parseInt(parts[0], 10) || 0;
                    const den = parts[1] ? parseInt(parts[1], 10) : 1;
                    const scaledFract = new Fraction(num, den).div(scaleRemaining);
                    newValue = scaledFract.toString();
                } else if (will.valueType === 'percentage') {
                    const val = parseFloat(will.value) || 0;
                    const scaledFract = new Fraction(Math.round(val * 100), 10000).div(scaleRemaining);
                    newValue = (scaledFract.valueOf() * 100).toString();
                }
            }
            return {
                ...will,
                value: newValue,
                original_value: will.value
            };
        });

        // Process Voluntary Wills on the remaining estate
        const willsResult = executeWills(scaledWillsInput, netEstateForWillsAndHeirs, this.heirs_approved_excess, voluntaryLimitFraction);
        this.wills_executed = willsResult.processedWills;
        this.total_wills_cost = willsResult.finalWillsCost;
        this.net_estate_for_heirs = willsResult.netEstateForHeirs;

        // Scale heirs fraction to account for mandatory bequests and voluntary wills
        this.heirs_scale_fraction = willsResult.heirsScaleFraction.mul(new Fraction(1).sub(mbResult.fraction));
        this.wills_explanation = willsResult.willsExplanation;
        this.is_wills_scaled = willsResult.isWillsScaled;

        const originalNetEstate = this.net_estate;

        // 2. Apply Islamic Blocking Rules (حجب الحرمان)
        for (const h of Object.values(this.heirs)) {
            h.is_blocked = false;
            h.blocked_by = null;
        }
        applyBlockingRules(this.heirs, this.explanations);

        // 3. Calculate Quranic Shares and Residue
        let remaining = new Fraction(1);

        // Standard fixed shares (excluding Grandfather if sharing with siblings)
        remaining = calculateFixedShares(this.heirs, this.results, this.explanations, remaining);

        // Grandmothers share
        remaining = calculateGrandmothersShare(this.heirs, this.results, this.explanations, remaining);

        // Grandfather with Siblings (Maliki Rule) or standard Residue
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

        // Save initial jurisprudential shares before Awl or Radd for pedagogical step breakdown
        this.initial_shares = {};
        for (const [rel, d] of Object.entries(this.results)) {
            this.initial_shares[rel] = {
                share: d.share,
                count: d.count,
                asabah: d.asabah
            };
        }

        // 4. Apply Al-Awl (العول)
        const awlResult = checkAndApplyAwl(this.results, this.explanations);

        // 5. Apply Al-Radd (الرد) if no Awl occurred
        if (!awlResult.isAul) {
            checkAndApplyRadd(this.results, this.explanations, this.heirs);
        }

        // 6. Fallback to Islamic Treasury (بيت المال) if there are no surviving active heirs
        const activeHeirsCount = Object.values(this.heirs).filter(h => h.count > 0 && !h.is_blocked).length;
        if (activeHeirsCount === 0) {
            this.results['TREASURY'] = {
                relationship: 'TREASURY',
                count: 1,
                share: remaining
            };
            this.explanations['TREASURY'] = 'يذهب باقي التركة لبيت مال المسلمين لعدم وجود وريث شرعي.';
        }

        // 7. Format and Prepare Final Results
        const mandatoryBequestSteps = getMandatoryBequestSteps(this, awlResult);
        const standardSteps = getStandardSteps(this, awlResult);

        return prepareFinalResults({
            results: this.results,
            heirs: this.heirs,
            explanations: this.explanations,
            caseData: this.case,
            gender: this.gender,
            netEstate: originalNetEstate - this.total_wills_cost,
            originalNetEstate,
            totalWillsCost: this.total_wills_cost,
            willsExecuted: this.wills_executed,
            willsExplanation: this.wills_explanation,
            isWillsScaled: this.is_wills_scaled,
            isAul: awlResult.isAul,
            totalShares: awlResult.sumShares,
            heirsScaleFraction: this.heirs_scale_fraction,
            mandatoryBequestsResult: this.mandatory_bequests_result,
            mandatoryBequestSteps,
            standardSteps
        });
    }
}
