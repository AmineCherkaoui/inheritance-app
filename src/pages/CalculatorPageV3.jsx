import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Calculator, RotateCcw, AlertCircle } from 'lucide-react';
import { deserializeState, cn } from '../utils';
import { InheritanceCalculator } from '../engine';

// Modular Components for V3
import TopNav from '../components/calculatorV3/TopNav';
import StepSidebar from '../components/calculatorV3/StepSidebar';
import StepMobile from '../components/calculatorV3/StepMobile';
import StepDeceasedInfo from '../components/calculatorV3/StepDeceasedInfo';
import MiniStepEstateDebts from '../components/calculatorV3/estate/MiniStepEstateDebts';
import MiniStepWills from '../components/calculatorV3/estate/MiniStepWills';
import MiniStepSpouse from '../components/calculatorV3/heirs/MiniStepSpouse';
import MiniStepChildren from '../components/calculatorV3/heirs/MiniStepChildren';
import MiniStepParents from '../components/calculatorV3/heirs/MiniStepParents';
import MiniStepCategoryHeirs from '../components/calculatorV3/heirs/MiniStepCategoryHeirs';
import StepResults from '../components/calculatorV3/StepResults';
import BottomFooter from '../components/calculatorV3/BottomFooter';
import AppBackground from '../components/AppBackground';
import { isHeirBlocked, HEIR_CATEGORIES } from '../components/calculatorV3/heirConstants';
import MobileNav from '../components/calculatorV3/MobileNav';

const ALL_MINI_STEPS = [
  // Parent Step 0 (بيانات حالة المتوفى)
  { key: 'deceased_info', parentStep: 0, label: 'بيانات المتوفى' },

  // Parent Step 1 (التركة)
  { key: 'estate_debts', parentStep: 1, label: 'التركة والديون' },
  { key: 'wills', parentStep: 1, label: 'الوصايا' },

  // Parent Step 2 (الورثة)
  { key: 'spouse', parentStep: 2, label: 'الزوج / الزوجة' },
  { key: 'children', parentStep: 2, label: 'الأولاد' },
  { key: 'parents', parentStep: 2, label: 'الأبوان' },
  { key: 'descendants', parentStep: 2, label: 'الفروع (الأحفاد)' },
  { key: 'siblings', parentStep: 2, label: 'الإخوة والأخوات' },
  { key: 'grandparents', parentStep: 2, label: 'الأجداد والجدات' },
  { key: 'nephews', parentStep: 2, label: 'أبناء الإخوة' },
  { key: 'uncles_cousins', parentStep: 2, label: 'الأعمام وأبناء العم' },
  { key: 'father_uncles_cousins', parentStep: 2, label: 'أعمام الأب وأبناء عمومتهم' }
];

const isStepBlocked = (stepKey, currentHeirs, gender) => {
  if (stepKey === 'spouse') {
    const key = gender === 'female' ? 'HUSBAND' : 'WIFE';
    return isHeirBlocked(key, currentHeirs);
  }
  if (stepKey === 'children') {
    return isHeirBlocked('SON', currentHeirs) && isHeirBlocked('DAUGHTER', currentHeirs);
  }
  if (stepKey === 'parents') {
    return isHeirBlocked('FATHER', currentHeirs) && isHeirBlocked('MOTHER', currentHeirs);
  }

  const catKey = stepKey;
  if (HEIR_CATEGORIES[catKey]) {
    return HEIR_CATEGORIES[catKey].list.every((heir) => isHeirBlocked(heir.key, currentHeirs));
  }
  return false;
};

export default function CalculatorPageV3() {
  const [activeMiniStepIndex, setActiveMiniStepIndex] = useState(0);

  // Step 1 State: Deceased Info
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedGender, setDeceasedGender] = useState('');

  // Step 2 State: Estate, Debts, Wills, Mandatory Bequests
  const [totalEstate, setTotalEstate] = useState();
  const [debts, setDebts] = useState();
  const [wills, setWills] = useState([]);
  const [heirsApprovedExcess, setHeirsApprovedExcess] = useState(false);
  const [hasMandatoryBequest, setHasMandatoryBequest] = useState(false);
  const [mandatoryBequests, setMandatoryBequests] = useState([]);

  // Step 3 State: Heirs
  const [heirs, setHeirs] = useState({});

  // Step 4 State: Results
  const [calculatedResult, setCalculatedResult] = useState(null);
  const [isViewingResults, setIsViewingResults] = useState(false);

  // Errors & Feedback
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedStateStr = params.get('s');
    if (sharedStateStr) {
      const state = deserializeState(sharedStateStr);
      if (state) {
        if (state.deceasedName !== undefined) setDeceasedName(state.deceasedName);
        if (state.deceasedGender !== undefined) setDeceasedGender(state.deceasedGender);
        if (state.totalEstate !== undefined) setTotalEstate(state.totalEstate);
        if (state.debts !== undefined) setDebts(state.debts);
        if (state.heirs !== undefined) setHeirs(state.heirs);
        if (state.wills !== undefined) {
          setWills(
            state.wills.map((w, idx) => ({
              id: w.id || `will-${Date.now()}-${idx}-${Math.random()}`,
              name: w.name || '',
              value: w.value || '',
              valueType: w.valueType || 'fraction'
            }))
          );
        }
        if (state.heirsApprovedExcess !== undefined) setHeirsApprovedExcess(state.heirsApprovedExcess);
        if (state.mandatoryBequests !== undefined) {
          setMandatoryBequests(state.mandatoryBequests);
          setHasMandatoryBequest(state.mandatoryBequests.length > 0);
        }

        // If heirs exist and total estate exists, precalculate result
        const heirsList = Object.entries(state.heirs || {})
          .filter(([_, count]) => count > 0)
          .map(([relationship, count]) => ({ relationship, count }));

        if (heirsList.length > 0 || (state.mandatoryBequests && state.mandatoryBequests.length > 0)) {
          const caseData = {
            id: Date.now(),
            name: state.deceasedName || (state.deceasedGender === 'male' ? 'المتوفى' : 'المتوفاة'),
            gender: state.deceasedGender || 'male',
            total_estate_value: parseFloat(state.totalEstate) || 0,
            funeral_expenses: 0,
            debts: parseFloat(state.debts) || 0,
            heirs: heirsList,
            wills: state.wills || [],
            heirsApprovedExcess: state.heirsApprovedExcess || false,
            mandatoryBequests: state.mandatoryBequests || []
          };
          try {
            const calculator = new InheritanceCalculator(caseData);
            const output = calculator.calculate();
            setCalculatedResult(output);
            setIsViewingResults(true);
          } catch (e) {
            console.error('Failed to precalculate:', e);
          }
        }
      }
    }
  }, []);

  const activeMiniSteps = ALL_MINI_STEPS.filter((step) => {
    if (step.key === 'deceased_info' || step.key === 'estate_debts' || step.key === 'wills') {
      return true;
    }
    if (step.key === 'descendants' && hasMandatoryBequest) {
      return false;
    }
    return !isStepBlocked(step.key, heirs, deceasedGender);
  });

  const currentMiniStep = activeMiniSteps[activeMiniStepIndex] || activeMiniSteps[0];
  const currentParentStep = isViewingResults ? 3 : (currentMiniStep?.parentStep ?? 0);

  const cleanHeirs = (updatedHeirs, gender = deceasedGender, mandatory = hasMandatoryBequest) => {
    const clean = { ...updatedHeirs };
    for (const key of Object.keys(clean)) {
      if (isHeirBlocked(key, clean)) {
        delete clean[key];
      }
      if (gender === 'male' && key === 'HUSBAND') {
        delete clean[key];
      }
      if (gender === 'female' && key === 'WIFE') {
        delete clean[key];
      }
      if (mandatory && ['GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER'].includes(key)) {
        delete clean[key];
      }
    }
    return clean;
  };

  const handleGenderChange = (gender) => {
    setDeceasedGender(gender);
    setHeirs((prev) => {
      const updated = { ...prev };
      if (gender === 'male') {
        delete updated['HUSBAND'];
      } else {
        delete updated['WIFE'];
      }
      return cleanHeirs(updated, gender);
    });
  };

  const updateHeir = (key, val) => {
    if (hasMandatoryBequest && ['GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER'].includes(key)) {
      return;
    }
    setHeirs((prev) => {
      const updated = { ...prev };
      if (val <= 0 && val !== -1) {
        delete updated[key];
      } else {
        updated[key] = val;
      }
      return cleanHeirs(updated);
    });
    setErrorMessage('');
  };

  const handleSetHasMandatoryBequest = (val) => {
    setHasMandatoryBequest(val);
    if (val) {
      setHeirs((prev) => {
        const updated = { ...prev };
        delete updated['GRANDSON'];
        delete updated['GRANDDAUGHTER'];
        delete updated['GREAT_GRANDSON'];
        delete updated['GREAT_GRANDDAUGHTER'];
        return cleanHeirs(updated, deceasedGender, true);
      });
    }
  };

  const addWill = () => {
    setWills((prev) => [
      ...prev,
      { id: `will-${Date.now()}-${Math.random()}`, name: '', value: '', valueType: 'fraction' }
    ]);
  };

  const updateWill = (id, key, val) => {
    setWills((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const updated = { ...w, [key]: val };
          if (key === 'valueType') {
            updated.value = '';
          }
          return updated;
        }
        return w;
      })
    );
  };

  const removeWill = (id) => {
    setWills((prev) => prev.filter((w) => w.id !== id));
  };

  const checkWillsExceedThird = () => {
    const net = parseFloat(totalEstate) - parseFloat(debts || 0);

    let sumFraction = 0;
    let sumFixedValue = 0;
    let hasValidSelection = false;

    for (const will of wills) {
      if (!will.value || will.value === '') continue;
      hasValidSelection = true;
      if (will.valueType === 'percentage') {
        sumFraction += (parseFloat(will.value) || 0) / 100;
      } else if (will.valueType === 'fraction') {
        const parts = will.value.split('/');
        const num = parseFloat(parts[0]) || 0;
        const den = parseFloat(parts[1]) || 1;
        if (den > 0) {
          sumFraction += num / den;
        }
      } else {
        sumFixedValue += parseFloat(will.value) || 0;
      }
    }

    if (!hasValidSelection) return false;

    if (sumFixedValue === 0) {
      return sumFraction > (1 / 3) + 0.00001;
    }

    if (net > 0) {
      const totalWillValue = (sumFraction * net) + sumFixedValue;
      return totalWillValue > (net / 3) + 0.01;
    }

    return sumFraction > (1 / 3) + 0.00001;
  };

  // Run calculation logic
  const handleCalculate = () => {
    const heirsList = Object.entries(heirs)
      .filter(([_, count]) => count > 0)
      .map(([relationship, count]) => ({
        relationship,
        count
      }));

    if (heirsList.length === 0 && (!hasMandatoryBequest || mandatoryBequests.length === 0)) {
      setErrorMessage('الرجاء إضافة وارث واحد على الأقل للمسألة في الخطوات السابقة.');
      return;
    }

    const caseData = {
      id: Date.now(),
      name: deceasedName || (deceasedGender === 'male' ? 'المتوفى' : 'المتوفاة'),
      gender: deceasedGender,
      total_estate_value: parseFloat(totalEstate) || 0,
      funeral_expenses: 0,
      debts: parseFloat(debts) || 0,
      heirs: heirsList,
      wills: wills,
      heirsApprovedExcess: heirsApprovedExcess,
      mandatoryBequests: hasMandatoryBequest ? mandatoryBequests : []
    };

    try {
      const calculator = new InheritanceCalculator(caseData);
      const output = calculator.calculate();
      setCalculatedResult(output);
      setIsViewingResults(true);
      setErrorMessage('');
    } catch (err) {
      console.error('Calculation error:', err);
      setErrorMessage('حدث خطأ أثناء حساب المسألة. يرجى التحقق من المدخلات.');
    }
  };

  // Step Navigation logic
  const handleNext = () => {
    setErrors({});
    setErrorMessage('');

    if (currentMiniStep.key === 'deceased_info') {
      if (!deceasedGender) {
        setErrorMessage('الرجاء تحديد جنس المتوفى للمتابعة.');
        return;
      }
    }

    if (currentMiniStep.key === 'estate_debts') {
      if (!totalEstate || parseFloat(totalEstate) <= 0) {
        setErrors({ totalEstate: 'يرجى إدخال قيمة التركة الإجمالية أكبر من الصفر.' });
        return;
      }
    }

    if (currentMiniStep.key === 'wills') {
      const newErrors = {};
      wills.forEach((will) => {
        if (!will.value) {
          newErrors[will.id] = 'يرجى اختيار الكسر للوصية.';
        }
      });
      const hasZeroCount = mandatoryBequests.some((mb) => {
        const count =
          (mb.sonsCount || 0) +
          (mb.daughtersCount || 0) +
          (mb.greatSonsCount || 0) +
          (mb.greatDaughtersCount || 0);
        return count <= 0;
      });
      if (hasMandatoryBequest && (mandatoryBequests.length === 0 || hasZeroCount)) {
        newErrors.mandatoryBequests =
          mandatoryBequests.length === 0
            ? 'يرجى إضافة فرع متوفى واحد على الأقل أو تغيير الخيار إلى "لا".'
            : 'يرجى تحديد عدد الأحفاد للفرع المضاف.';
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (activeMiniStepIndex < activeMiniSteps.length - 1) {
      setActiveMiniStepIndex(activeMiniStepIndex + 1);
    } else {
      handleCalculate();
    }
  };

  const handlePrev = () => {
    setErrors({});
    setErrorMessage('');
    if (isViewingResults) {
      setIsViewingResults(false);
      return;
    }
    if (activeMiniStepIndex > 0) {
      setActiveMiniStepIndex(activeMiniStepIndex - 1);
    }
  };

  const resetAll = () => {
    setDeceasedName('');
    setDeceasedGender('');
    setTotalEstate(undefined);
    setDebts(undefined);
    setWills([]);
    setHeirsApprovedExcess(false);
    setHasMandatoryBequest(false);
    setMandatoryBequests([]);
    setHeirs({});
    setCalculatedResult(null);
    setIsViewingResults(false);
    setErrors({});
    setErrorMessage('');
    setActiveMiniStepIndex(0);
  };

  // Navigate to parent step from sidebar
  const handleSidebarStepClick = (parentIndex) => {
    setErrors({});
    setErrorMessage('');

    if (parentIndex === 3) {
      if (calculatedResult) {
        setIsViewingResults(true);
      } else {
        handleCalculate();
      }
      return;
    }

    setIsViewingResults(false);
    const targetMiniStepIdx = activeMiniSteps.findIndex((s) => s.parentStep === parentIndex);
    if (targetMiniStepIdx !== -1) {
      setActiveMiniStepIndex(targetMiniStepIdx);
    }
  };

  const canNavigateToStep = (parentIndex) => {
    if (parentIndex === 0) return true;
    if (parentIndex === 1) return Boolean(deceasedGender);
    if (parentIndex === 2) return Boolean(deceasedGender) && totalEstate && parseFloat(totalEstate) > 0;
    if (parentIndex === 3) return calculatedResult !== null;
    return false;
  };

  const isNextDisabled = (() => {
    if (currentMiniStep.key === 'deceased_info') {
      return !deceasedGender;
    }
    if (currentMiniStep.key === 'estate_debts') {
      return !totalEstate || parseFloat(totalEstate) <= 0;
    }
    if (currentMiniStep.key === 'spouse') {
      const spouseKey = deceasedGender === 'female' ? 'HUSBAND' : 'WIFE';
      return heirs[spouseKey] === undefined;
    }
    if (currentMiniStep.key === 'wills') {
      const hasUnsetWills = wills.some((will) => !will.value);
      const hasZeroCount = mandatoryBequests.some((mb) => {
        const count =
          (mb.sonsCount || 0) +
          (mb.daughtersCount || 0) +
          (mb.greatSonsCount || 0) +
          (mb.greatDaughtersCount || 0);
        return count <= 0;
      });
      const hasInvalidMandatoryBequests =
        hasMandatoryBequest && (mandatoryBequests.length === 0 || hasZeroCount);
      return hasUnsetWills || hasInvalidMandatoryBequests;
    }
    return false;
  })();

  const currentStateSnapshot = {
    deceasedName,
    deceasedGender,
    totalEstate,
    debts,
    heirs,
    wills,
    heirsApprovedExcess,
    mandatoryBequests: hasMandatoryBequest ? mandatoryBequests : []
  };

  return (
    <div
      className="relative min-h-svh w-full bg-secondary-50 text-foreground flex flex-col justify-between select-none font-sans"
      dir="rtl"
    >
      <AppBackground />
      <div className="lg:hidden bg-primary-950/80 py-2 px-4 sticky top-0 backdrop-blur-sm border-b border-primary-950 z-50 flex items-center justify-between">
        <MobileNav
          currentStepIndex={currentParentStep}
          onStepClick={handleSidebarStepClick}
          canNavigateToStep={canNavigateToStep}
          onReset={resetAll}
        />
        <div className="flex items-center gap-2">
          <img src="/images/logo.svg" alt="Logo" className="h-12 w-auto" />
        </div>
      </div>

      {/* Main Container Layout: Sidebar on Right + Main Wizard on Left */}
      <main className="relative z-1 flex-1 grid grid-cols-1 lg:grid-cols-3 items-start gap-24 max-w-11/12 w-full mx-auto p-2 sm:p-4">
        {/* Right Side: Step Sidebar */}
        <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-4 justify-self-end">
          <StepSidebar
            currentStepIndex={currentParentStep}
            onStepClick={handleSidebarStepClick}
            canNavigateToStep={canNavigateToStep}
          />
        </div>

        {/* Center/Left: Main Content Wizard Area */}
        <section className="lg:col-span-2 self-stretch flex-1 flex flex-col justify-between relative gap-4 min-h-[calc(100svh-11rem)]">
          <TopNav className="hidden lg:block" />

          {/* Mobile Step Bar */}
          <div className="lg:hidden w-full pt-4">
            <StepMobile
              currentStepIndex={currentParentStep}
              onStepClick={handleSidebarStepClick}
              canNavigateToStep={canNavigateToStep}
            />
          </div>

          <div className="flex-1 flex flex-col justify-between gap-4 h-full w-full ">
            <div className="flex flex-col gap-4 my-auto w-full pt-6 lg:pt-0">
              {/* Title Header with Calligraphic Framing */}
              <div className="text-center space-y-1 max-w-md flex mx-auto">
                <img src="/images/title-header.png" alt="Title Header" className="w-full" />
              </div>
              {/* Error Message Banner */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">
                  {errorMessage}
                </div>
              )}
              {/* Wizard Mini-Steps & Results Switcher */}
              <div className="min-h-75 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {isViewingResults ? (
                    <StepResults
                      key="step-results"
                      result={calculatedResult}
                      onBackToEdit={() => setIsViewingResults(false)}
                      onReset={resetAll}
                      stateSnapshot={currentStateSnapshot}
                    />
                  ) : (
                    <>
                      {/* Step 1: Deceased Info */}
                      {currentMiniStep.key === 'deceased_info' && (
                        <StepDeceasedInfo
                          key="mini-deceased-info"
                          deceasedName={deceasedName}
                          setDeceasedName={setDeceasedName}
                          deceasedGender={deceasedGender}
                          handleGenderChange={handleGenderChange}
                        />
                      )}
                      {/* Step 2: Estate Mini-Steps */}
                      {currentMiniStep.key === 'estate_debts' && (
                        <MiniStepEstateDebts
                          key="mini-estate-debts"
                          totalEstate={totalEstate}
                          setTotalEstate={setTotalEstate}
                          debts={debts}
                          setDebts={setDebts}
                          errors={errors}
                        />
                      )}
                      {currentMiniStep.key === 'wills' && (
                        <MiniStepWills
                          key="mini-wills"
                          wills={wills}
                          addWill={addWill}
                          updateWill={updateWill}
                          removeWill={removeWill}
                          heirsApprovedExcess={heirsApprovedExcess}
                          setHeirsApprovedExcess={setHeirsApprovedExcess}
                          checkWillsExceedThird={checkWillsExceedThird}
                          hasMandatoryBequest={hasMandatoryBequest}
                          handleSetHasMandatoryBequest={handleSetHasMandatoryBequest}
                          mandatoryBequests={mandatoryBequests}
                          setMandatoryBequests={setMandatoryBequests}
                          errors={errors}
                        />
                      )}
                      {/* Step 3: Heirs Mini-Steps */}
                      {currentMiniStep.key === 'spouse' && (
                        <MiniStepSpouse
                          key="mini-spouse"
                          heirs={heirs}
                          updateHeir={updateHeir}
                          deceasedGender={deceasedGender}
                        />
                      )}
                      {currentMiniStep.key === 'children' && (
                        <MiniStepChildren
                          key="mini-children"
                          heirs={heirs}
                          updateHeir={updateHeir}
                        />
                      )}
                      {currentMiniStep.key === 'parents' && (
                        <MiniStepParents
                          key="mini-parents"
                          heirs={heirs}
                          updateHeir={updateHeir}
                        />
                      )}
                      {['descendants', 'siblings', 'grandparents', 'nephews', 'uncles_cousins', 'father_uncles_cousins'].includes(
                        currentMiniStep.key
                      ) && (
                          <MiniStepCategoryHeirs
                            key={`mini-cat-${currentMiniStep.key}`}
                            categoryKey={currentMiniStep.key}
                            heirs={heirs}
                            updateHeir={updateHeir}
                          />
                        )}
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* Navigation Controls Bar (السابق / التالي / احسب التركة) */}

            <div className="flex items-center justify-center gap-12">
              {/* Previous Button */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeMiniStepIndex === 0 && !isViewingResults}
                className={cn(
                  'px-6 py-1.5 rounded-md ring-1 ring-primary-950 bg-transparent text-primary-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5',
                  activeMiniStepIndex === 0 && !isViewingResults
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-default-100 cursor-pointer'
                )}
              >
                <ArrowRight size={16} />
                <span>السابق</span>
              </button>
              {/* Next / Calculate / New Case Button */}
              {isViewingResults ? (
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-6 py-1.5 rounded-md bg-primary-950 hover:bg-primary-900 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span>مسألة جديدة</span>
                </button>
              ) : activeMiniStepIndex === activeMiniSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className={cn(
                    'px-8 py-1.5 rounded-md bg-primary-950 font-black text-xs sm:text-sm transition-all flex items-center gap-2 text-white',
                    isNextDisabled
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-primary-900 cursor-pointer'
                  )}
                >
                  <Calculator size={16} />
                  <span>احسب التركة</span>
                  <ArrowLeft size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className={cn(
                    'px-8 py-1.5 rounded-md bg-primary-950 font-black text-xs sm:text-sm transition-all flex items-center gap-2 text-white',
                    isNextDisabled
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-primary-900 cursor-pointer'
                  )}
                >
                  <span>التالي</span>
                  <ArrowLeft size={16} />
                </button>
              )}
            </div>

            {/* Sharia Notice Banner */}
            <div className="mt-8 w-full bg-secondary-100  text-secondary-400/60 py-2 px-4 rounded-sm text-center text-xs flex items-center justify-center gap-2">
              <div className="size-6 rounded-full bg-secondary-400/60 flex items-center justify-center shrink-0">
                <AlertCircle size={16} className="text-white" />
              </div>
              <span>
                جميع الحسابات تتم وفق أحكام الشريعة الإسلامية والمذهب المالكي المعتمد في المملكة المغربية الشريفة
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Footer Notice & Trust Badges */}
      <BottomFooter />
    </div>
  );
}
