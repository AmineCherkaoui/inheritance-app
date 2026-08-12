import React, { useState, useEffect } from 'react';
import { Card, TextField, Input, Label, Button } from '@heroui/react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Scale, RotateCcw, Calculator, ArrowRight, ArrowLeft,
  User, Wallet, ShieldAlert, Check, Plus, Minus, UserCheck, UserX
} from 'lucide-react';
import { serializeState, deserializeState } from '../utils';
import { InheritanceCalculator } from '../engine';
import WillsForm from './WillsForm';
import MandatoryBequestForm from './MandatoryBequestForm';

const HEIR_CATEGORIES = {
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

const BLOCKING_RULES = {
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

const isHeirBlocked = (heirKey, currentHeirs) => {
  for (const [blocker, blockedList] of Object.entries(BLOCKING_RULES)) {
    if (currentHeirs[blocker] && currentHeirs[blocker] > 0) {
      if (blockedList.includes(heirKey)) return true;
    }
  }

  if (heirKey === 'MATERNAL_BROTHER' || heirKey === 'MATERNAL_SISTER') {
    const hasDescendants = ['SON', 'DAUGHTER', 'GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER'].some(k => currentHeirs[k] > 0);
    const hasFather = currentHeirs['FATHER'] > 0;
    const hasGrandfather = currentHeirs['PATERNAL_GRANDFATHER'] > 0;
    const hasGreatGrandfather = currentHeirs['PATERNAL_GREAT_GRANDFATHER'] > 0;
    if (hasDescendants || hasFather || hasGrandfather || hasGreatGrandfather) return true;
  }
  return false;
};

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
    return HEIR_CATEGORIES[catKey].list.every(heir => isHeirBlocked(heir.key, currentHeirs));
  }
  return false;
};

const ALL_STEPS = [
  { key: 'deceased_info', label: 'بيانات المتوفى' },
  { key: 'estate_debts', label: 'التركة والديون' },
  { key: 'wills', label: 'الوصايا' },
  { key: 'spouse', label: 'الزوج / الزوجة' },
  { key: 'children', label: 'الأولاد' },
  { key: 'parents', label: 'الأبوان' },
  { key: 'descendants', label: 'الفروع (الأحفاد)' },
  { key: 'siblings', label: 'الإخوة والأخوات' },
  { key: 'grandparents', label: 'الأجداد والجدات' },
  { key: 'nephews', label: 'أبناء الإخوة' },
  { key: 'uncles_cousins', label: 'الأعمام وأبناء العم' },
  { key: 'father_uncles_cousins', label: 'أعمام الأب وأبناء عمومتهم' }
];

export default function CalculatorPageV2() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedGender, setDeceasedGender] = useState('male');
  const [totalEstate, setTotalEstate] = useState();
  const [debts, setDebts] = useState();
  const [heirs, setHeirs] = useState({});
  const [wills, setWills] = useState([]);
  const [heirsApprovedExcess, setHeirsApprovedExcess] = useState(false);
  const [hasMandatoryBequest, setHasMandatoryBequest] = useState(false);
  const [mandatoryBequests, setMandatoryBequests] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const hasActiveDescendants = ['GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER'].some(key => heirs[key] > 0);

  const handleSetHasMandatoryBequest = (val) => {
    setHasMandatoryBequest(val);
    if (val) {
      setHeirs(prev => {
        const updated = { ...prev };
        delete updated['GRANDSON'];
        delete updated['GRANDDAUGHTER'];
        delete updated['GREAT_GRANDSON'];
        delete updated['GREAT_GRANDDAUGHTER'];
        return updated;
      });
    }
  };

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
          setWills(state.wills.map((w, idx) => ({
            id: w.id || `will-${Date.now()}-${idx}-${Math.random()}`,
            name: w.name || '',
            value: w.value || '',
            valueType: w.valueType || 'fraction'
          })));
        }
        if (state.heirsApprovedExcess !== undefined) setHeirsApprovedExcess(state.heirsApprovedExcess);
        if (state.mandatoryBequests !== undefined) {
          setMandatoryBequests(state.mandatoryBequests);
          setHasMandatoryBequest(state.mandatoryBequests.length > 0);
        }
      }
    }
  }, []);

  // Auto clean up blocked heirs
  const cleanHeirs = (updatedHeirs) => {
    let changed = false;
    const clean = { ...updatedHeirs };
    for (const key of Object.keys(clean)) {
      if (isHeirBlocked(key, clean)) {
        delete clean[key];
        changed = true;
      }
      if (deceasedGender === 'male' && key === 'HUSBAND') {
        delete clean[key];
        changed = true;
      }
      if (deceasedGender === 'female' && key === 'WIFE') {
        delete clean[key];
        changed = true;
      }
      if (hasMandatoryBequest && ['GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER'].includes(key)) {
        delete clean[key];
        changed = true;
      }
    }
    return { clean, changed };
  };

  const updateHeir = (key, val) => {
    if (hasMandatoryBequest && ['GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER'].includes(key)) {
      return;
    }
    setHeirs(prev => {
      const updated = { ...prev };
      if (val <= 0 && val !== -1) {
        delete updated[key];
      } else {
        updated[key] = val;
      }
      const { clean } = cleanHeirs(updated);
      return clean;
    });
  };

  const handleGenderChange = (gender) => {
    setDeceasedGender(gender);
    setHeirs(prev => {
      const updated = { ...prev };
      if (gender === 'male') {
        delete updated['HUSBAND'];
      } else {
        delete updated['WIFE'];
      }
      const { clean } = cleanHeirs(updated);
      return clean;
    });
  };

  const addWill = () => {
    setWills(prev => [
      ...prev,
      { id: `will-${Date.now()}-${Math.random()}`, name: '', value: '', valueType: 'fraction' }
    ]);
  };

  const updateWill = (id, key, val) => {
    setWills(prev => prev.map(w => {
      if (w.id === id) {
        const updated = { ...w, [key]: val };
        if (key === 'valueType') {
          updated.value = '';
        }
        return updated;
      }
      return w;
    }));
  };

  const removeWill = (id) => {
    setWills(prev => prev.filter(w => w.id !== id));
  };

  const checkWillsExceedThird = () => {
    let net = parseFloat(totalEstate) - parseFloat(debts || 0);
    if (net <= 0) return false;

    let sum = 0;
    for (const will of wills) {
      let val = 0;
      if (will.valueType === 'percentage') {
        val = (parseFloat(will.value) || 0) / 100 * net;
      } else if (will.valueType === 'fraction') {
        const parts = (will.value || '1/3').split('/');
        const num = parseFloat(parts[0]) || 0;
        const den = parseFloat(parts[1]) || 1;
        val = (num / den) * net;
      } else {
        val = parseFloat(will.value) || 0;
      }
      sum += val;
    }
    return sum > (net / 3);
  };

  const activeSteps = ALL_STEPS.filter(step => {
    if (step.key === 'deceased_info' || step.key === 'estate_debts' || step.key === 'wills') {
      return true;
    }
    if (step.key === 'descendants' && hasMandatoryBequest) {
      return false;
    }
    return !isStepBlocked(step.key, heirs, deceasedGender);
  });

  const currentStep = activeSteps[currentStepIndex] || activeSteps[0];

  const handleNext = () => {
    if (currentStep.key === 'estate_debts') {
      if (!totalEstate || parseFloat(totalEstate) <= 0) {
        setErrors({ totalEstate: 'يرجى إدخال قيمة التركة الإجمالية أكبر من الصفر.' });
        return;
      }
    }
    if (currentStep.key === 'wills') {
      const newErrors = {};
      wills.forEach(will => {
        if (!will.value) {
          newErrors[will.id] = 'يرجى اختيار الكسر للوصية.';
        }
      });
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleCalculate();
    }
  };

  const handlePrev = () => {
    setErrors({});
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleCalculate = () => {
    const heirsList = Object.entries(heirs)
      .filter(([_, count]) => count > 0)
      .map(([relationship, count]) => ({
        relationship,
        count
      }));

    if (heirsList.length === 0 && (!hasMandatoryBequest || mandatoryBequests.length === 0)) {
      setErrorMessage('الرجاء إضافة وارث واحد على الأقل للمسألة في الخطوات التالية.');
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

    const calculator = new InheritanceCalculator(caseData);
    const output = calculator.calculate();
    const serializeStateObj = {
      deceasedName,
      deceasedGender,
      totalEstate,
      debts,
      heirs,
      wills,
      heirsApprovedExcess,
      mandatoryBequests: hasMandatoryBequest ? mandatoryBequests : []
    };
    const sharedStateStr = serializeState(serializeStateObj);
    navigate(`/results?s=${sharedStateStr}`, { state: { result: output, from: '/v2' } });
  };

  const resetAll = () => {
    setHeirs({});
    setWills([]);
    setHeirsApprovedExcess(false);
    setHasMandatoryBequest(false);
    setMandatoryBequests([]);
    setDeceasedGender('male');
    setDeceasedName('');
    setTotalEstate(undefined);
    setDebts(undefined);
    setErrorMessage('');
    setErrors({});
    setCurrentStepIndex(0);
  };



  const isNextDisabled = (() => {
    if (currentStep.key === 'estate_debts') {
      return !totalEstate || parseFloat(totalEstate) <= 0;
    }
    if (currentStep.key === 'spouse') {
      const spouseKey = deceasedGender === 'female' ? 'HUSBAND' : 'WIFE';
      return heirs[spouseKey] === undefined;
    }
    if (currentStep.key === 'wills') {
      return wills.some(will => !will.value);
    }
    return false;
  })();

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-50/60 via-background to-background flex flex-col justify-between p-4 sm:p-6 lg:p-8" dir="rtl">
      {/* Header (Top) */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4 space-y-1 shrink-0"
      >
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100/60 text-amber-800 text-[10px] sm:text-xs font-bold border border-amber-200/60">
          <Scale size={13} /> محاكي تقسيم التركات الشرعي
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          حساب المواريث خطوة بخطوة
        </h1>
      </motion.header>

      {/* Main Content Area (Centered Fullscreen Card) */}
      <div className="flex-1 flex flex-col items-center justify-center my-4">
        <div className="w-full max-w-xl space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-danger/10 border border-danger/30 text-danger rounded-2xl text-xs font-bold text-center">
              {errorMessage}
            </div>
          )}

          {/* Wizard Step Container */}
          <div className="min-h-55">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                {currentStep.key === 'deceased_info' && (
                  <Card className="rounded-3xl border border-default-200 p-6 sm:p-8 space-y-6 bg-white shadow-xl shadow-amber-900/2">
                    <div className="text-center space-y-1 border-b border-default-100 pb-4">
                      <h3 className="text-lg font-black text-foreground">بيانات حالة المتوفى</h3>
                      <p className="text-xs text-muted-foreground">الرجاء إدخال الاسم وتحديد جنس المتوفى للبدء.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGenderChange('male')}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${deceasedGender === 'male'
                          ? 'border-amber-600 bg-amber-50/20 shadow-xs ring-1 ring-amber-600/30'
                          : 'border-default-200 hover:border-amber-300'
                          }`}
                      >
                        <User size={36} className={deceasedGender === 'male' ? 'text-amber-600' : 'text-muted-foreground'} />
                        <span className={`text-sm font-extrabold mt-3 ${deceasedGender === 'male' ? 'text-amber-800' : 'text-muted-foreground'}`}>ذكر (متوفى)</span>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGenderChange('female')}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${deceasedGender === 'female'
                          ? 'border-amber-600 bg-amber-50/20 shadow-xs ring-1 ring-amber-600/30'
                          : 'border-default-200 hover:border-amber-300'
                          }`}
                      >
                        <User size={36} className={deceasedGender === 'female' ? 'text-amber-600' : 'text-muted-foreground'} />
                        <span className={`text-sm font-extrabold mt-3 ${deceasedGender === 'female' ? 'text-amber-800' : 'text-muted-foreground'}`}>أنثى (متوفاة)</span>
                      </motion.div>
                    </div>

                    <TextField name="deceased-name" value={deceasedName} onChange={setDeceasedName}>
                      <Label className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1.5">
                        <User size={14} className="text-amber-600" /> {deceasedGender === 'male' ? 'اسم المتوفى (اختياري)' : 'اسم المتوفاة (اختياري)'}
                      </Label>
                      <Input variant="secondary" className="font-semibold h-11" placeholder="مثال: أحمد بن علي" />
                    </TextField>
                  </Card>
                )}

                {currentStep.key === 'estate_debts' && (
                  <Card className="rounded-3xl border border-default-200 p-6 sm:p-8 space-y-5 bg-white shadow-xl shadow-amber-900/2">
                    <div className="text-center space-y-1 border-b border-default-100 pb-4">
                      <h3 className="text-lg font-black text-foreground">التركة والديون والالتزامات</h3>
                      <p className="text-xs text-muted-foreground">تُصفى الديون والالتزامات المالية من التركة قبل توزيع الميراث.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1 w-full">
                        <TextField
                          name="total-estate"
                          type="number"
                          value={totalEstate?.toString() ?? ''}
                          onChange={(val) => setTotalEstate(val === '' ? undefined : Math.max(0, parseFloat(val) || 0))}
                          isInvalid={!!errors.totalEstate}
                        >
                          <Label className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1.5">
                            <Wallet size={14} className="text-amber-600" /> قيمة التركة الإجمالية (المال الخام)
                          </Label>
                          <Input variant="secondary" className="font-black text-amber-950 h-11" placeholder="أدخل إجمالي مبلغ التركة" />
                        </TextField>
                        {errors.totalEstate && (
                          <div className="text-xs font-bold text-danger mt-1">{errors.totalEstate}</div>
                        )}
                      </div>

                      <TextField
                        name="debts"
                        type="number"
                        value={debts?.toString() ?? ''}
                        onChange={(val) => setDebts(val === '' ? undefined : Math.max(0, parseFloat(val) || 0))}
                      >
                        <Label className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1.5">
                          <ShieldAlert size={14} className="text-amber-600" /> الديون والالتزامات المالية (اختياري)
                        </Label>
                        <Input variant="secondary" className="font-semibold h-11" placeholder="أدخل إجمالي الديون المستحقة" />
                      </TextField>
                    </div>
                  </Card>
                )}

                {currentStep.key === 'wills' && (
                  <div className="flex flex-col gap-6">
                    <div className="shadow-xl shadow-amber-900/2 rounded-3xl overflow-hidden border border-default-200">
                      <WillsForm
                        wills={wills}
                        addWill={addWill}
                        updateWill={updateWill}
                        removeWill={removeWill}
                        heirsApprovedExcess={heirsApprovedExcess}
                        setHeirsApprovedExcess={setHeirsApprovedExcess}
                        checkWillsExceedThird={checkWillsExceedThird}
                        errors={errors}
                      />
                    </div>

                    <div className="shadow-xl shadow-amber-900/2 rounded-3xl overflow-hidden border border-default-200">
                      <MandatoryBequestForm
                        hasMandatoryBequest={hasMandatoryBequest}
                        setHasMandatoryBequest={handleSetHasMandatoryBequest}
                        mandatoryBequests={mandatoryBequests}
                        setMandatoryBequests={setMandatoryBequests}
                      />
                    </div>
                  </div>
                )}

                {currentStep.key === 'spouse' && (
                  <Card className="rounded-3xl border border-default-200 p-6 sm:p-8 space-y-5 bg-white shadow-xl shadow-amber-900/2">
                    <div className="text-center space-y-1 border-b border-default-100 pb-4">
                      <h3 className="text-lg font-black text-foreground">الزوج أو الزوجات</h3>
                      <p className="text-xs text-muted-foreground">حدد حالة زوج(ة) المتوفى على قيد الحياة.</p>
                    </div>

                    {deceasedGender === 'female' ? (
                      <div className="space-y-4 pt-2">
                        <Label className="text-xs font-bold text-muted-foreground text-center block">هل يوجد زوج على قيد الحياة؟</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateHeir('HUSBAND', 1)}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${heirs['HUSBAND'] === 1
                              ? 'border-amber-600 bg-amber-50/20 shadow-xs ring-1 ring-amber-600/30'
                              : 'border-default-200 hover:border-amber-300'
                              }`}
                          >
                            <UserCheck size={32} className={`mb-1.5 ${heirs['HUSBAND'] === 1 ? 'text-amber-650' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-extrabold ${heirs['HUSBAND'] === 1 ? 'text-amber-800' : 'text-muted-foreground'}`}>زوج موجود</span>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateHeir('HUSBAND', -1)}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${heirs['HUSBAND'] === -1
                              ? 'border-red-500 bg-red-50/10 shadow-xs ring-1 ring-red-500/30'
                              : 'border-default-200 hover:border-amber-300'
                              }`}
                          >
                            <UserX size={32} className={`mb-1.5 ${heirs['HUSBAND'] === -1 ? 'text-red-500' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-extrabold ${heirs['HUSBAND'] === -1 ? 'text-red-800' : 'text-muted-foreground'}`}>لا يوجد زوج</span>
                          </motion.div>
                        </div>
                        <div className="text-center font-bold text-xs mt-3">
                          {heirs['HUSBAND'] === 1 && <span className="text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">الخيار المحدد: يوجد زوج على قيد الحياة</span>}
                          {heirs['HUSBAND'] === -1 && <span className="text-red-800 bg-red-50 px-3 py-1 rounded-full border border-red-200">الخيار المحدد: لا يوجد زوج</span>}
                          {heirs['HUSBAND'] === undefined && <span className="text-muted-foreground bg-default-100 px-3 py-1 rounded-full border border-default-200">الرجاء اختيار أحد الخيارات للمتابعة</span>}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-2">
                        <Label className="text-xs font-bold text-muted-foreground text-center block">هل توجد زوجة (أو زوجات) على قيد الحياة؟</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div
                            whileHover={heirs['WIFE'] > 0 ? {} : { scale: 1.02 }}
                            whileTap={heirs['WIFE'] > 0 ? {} : { scale: 0.98 }}
                            onClick={() => {
                              if (!(heirs['WIFE'] > 0)) {
                                updateHeir('WIFE', 1);
                              }
                            }}
                            className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${heirs['WIFE'] > 0
                              ? 'border-amber-600 bg-amber-50/20 shadow-xs ring-1 ring-amber-600/30'
                              : 'border-default-200 hover:border-amber-300'
                              }`}
                          >
                            <UserCheck size={32} className={`mb-1.5 ${heirs['WIFE'] > 0 ? 'text-amber-650' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-extrabold ${heirs['WIFE'] > 0 ? 'text-amber-800 mb-2' : 'text-muted-foreground'}`}>زوجة موجودة</span>
                            {heirs['WIFE'] > 0 && (
                              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-default-300/60 shadow-3xs" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="sm"
                                  isIconOnly
                                  onPress={() => updateHeir('WIFE', Math.max(1, heirs['WIFE'] - 1))}
                                  className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                                >
                                  <Minus size={12} className="stroke-3" />
                                </Button>
                                <span className="w-6 text-center text-xs font-extrabold">{heirs['WIFE']}</span>
                                <Button
                                  size="sm"
                                  isIconOnly
                                  onPress={() => updateHeir('WIFE', Math.min(4, heirs['WIFE'] + 1))}
                                  className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-100"
                                >
                                  <Plus size={12} className="stroke-3" />
                                </Button>
                              </div>
                            )}
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateHeir('WIFE', -1)}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${heirs['WIFE'] === -1
                              ? 'border-red-500 bg-red-50/10 shadow-xs ring-1 ring-red-500/30'
                              : 'border-default-200 hover:border-amber-300'
                              }`}
                          >
                            <UserX size={32} className={`mb-1.5 ${heirs['WIFE'] === -1 ? 'text-red-500' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-extrabold ${heirs['WIFE'] === -1 ? 'text-red-800' : 'text-muted-foreground'}`}>لا توجد زوجة</span>
                          </motion.div>
                        </div>

                        <div className="text-center font-bold text-xs mt-3">
                          {heirs['WIFE'] > 0 && <span className="text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">الخيار المحدد: توجد زوجة (العدد: {heirs['WIFE']})</span>}
                          {heirs['WIFE'] === -1 && <span className="text-red-800 bg-red-50 px-3 py-1 rounded-full border border-red-200">الخيار المحدد: لا توجد زوجة</span>}
                          {heirs['WIFE'] === undefined && <span className="text-muted-foreground bg-default-100 px-3 py-1 rounded-full border border-default-200">الرجاء اختيار أحد الخيارات للمتابعة</span>}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {currentStep.key === 'children' && (
                  <Card className="rounded-3xl border border-default-200 p-6 sm:p-8 space-y-5 bg-white shadow-xl shadow-amber-900/2">
                    <div className="text-center space-y-1 border-b border-default-100 pb-4">
                      <h3 className="text-lg font-black text-foreground">الأولاد (البنون والبنات)</h3>
                      <p className="text-xs text-muted-foreground">أدخل عدد الأبناء والبنات المباشرين للمتوفى.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 border border-default-200 rounded-2xl">
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold">عدد الأبناء (الذكور)</span>
                          <span className="text-[10px] text-muted-foreground">يحجبون الفروع الأبعد والإخوة</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white p-0.5 rounded-lg border border-default-300/60 shadow-3xs">
                          <Button
                            size="sm"
                            isIconOnly
                            onPress={() => updateHeir('SON', Math.max(0, (heirs['SON'] || 0) - 1))}
                            className="w-8 h-8 bg-transparent text-foreground hover:bg-default-100"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center text-xs font-extrabold">{heirs['SON'] || 0}</span>
                          <Button
                            size="sm"
                            isIconOnly
                            onPress={() => updateHeir('SON', (heirs['SON'] || 0) + 1)}
                            className="w-8 h-8 bg-transparent text-foreground hover:bg-default-100"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3.5 border border-default-200 rounded-2xl">
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold">عدد البنات (الإناث)</span>
                          <span className="text-[10px] text-muted-foreground">يرثن بالفرض أو بالتعصيب مع الابن</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white p-0.5 rounded-lg border border-default-300/60 shadow-3xs">
                          <Button
                            size="sm"
                            isIconOnly
                            onPress={() => updateHeir('DAUGHTER', Math.max(0, (heirs['DAUGHTER'] || 0) - 1))}
                            className="w-8 h-8 bg-transparent text-foreground hover:bg-default-100"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center text-xs font-extrabold">{heirs['DAUGHTER'] || 0}</span>
                          <Button
                            size="sm"
                            isIconOnly
                            onPress={() => updateHeir('DAUGHTER', (heirs['DAUGHTER'] || 0) + 1)}
                            className="w-8 h-8 bg-transparent text-foreground hover:bg-default-100"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {currentStep.key === 'parents' && (
                  <Card className="rounded-3xl border border-default-200 p-6 sm:p-8 space-y-5 bg-white shadow-xl shadow-amber-900/2">
                    <div className="text-center space-y-1 border-b border-default-100 pb-4">
                      <h3 className="text-lg font-black text-foreground">الأبوان (الأب والأم)</h3>
                      <p className="text-xs text-muted-foreground">اختر والدي المتوفى على قيد الحياة.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => updateHeir('FATHER', heirs['FATHER'] > 0 ? 0 : 1)}
                        className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${heirs['FATHER'] > 0
                          ? 'border-amber-600 bg-amber-50/20 shadow-xs'
                          : 'border-default-200 hover:border-amber-300'
                          }`}
                      >
                        <UserCheck size={28} className={`mb-1.5 ${heirs['FATHER'] > 0 ? 'text-amber-650' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-extrabold ${heirs['FATHER'] > 0 ? 'text-amber-800' : 'text-muted-foreground'}`}>الأب {heirs['FATHER'] > 0 ? '✔️' : '(غير موجود)'}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => updateHeir('MOTHER', heirs['MOTHER'] > 0 ? 0 : 1)}
                        className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${heirs['MOTHER'] > 0
                          ? 'border-amber-600 bg-amber-50/20 shadow-xs'
                          : 'border-default-200 hover:border-amber-300'
                          }`}
                      >
                        <UserCheck size={28} className={`mb-1.5 ${heirs['MOTHER'] > 0 ? 'text-amber-650' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-extrabold ${heirs['MOTHER'] > 0 ? 'text-amber-800' : 'text-muted-foreground'}`}>الأم {heirs['MOTHER'] > 0 ? '✔️' : '(غير موجود)'}</span>
                      </motion.button>
                    </div>
                  </Card>
                )}

                {/* Dynamic steps for rest of categories */}
                {['descendants', 'siblings', 'grandparents', 'nephews', 'uncles_cousins', 'father_uncles_cousins'].includes(currentStep.key) && (
                  <Card className="rounded-3xl border border-default-200 p-6 sm:p-8 space-y-5 bg-white shadow-xl shadow-amber-900/2">
                    <div className="text-center space-y-1 border-b border-default-100 pb-4">
                      <h3 className="text-lg font-black text-foreground">
                        {HEIR_CATEGORIES[currentStep.key].title}
                      </h3>
                      <p className="text-xs text-muted-foreground">أضف أي أقارب آخرين مستحقين للإرث.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                      {HEIR_CATEGORIES[currentStep.key].list.filter(h => !isHeirBlocked(h.key, heirs)).map(heir => {
                        const currentVal = heirs[heir.key] || 0;
                        const isActive = currentVal > 0;

                        return (
                          <div
                            key={heir.key}
                            className={`flex items-center justify-between rounded-2xl p-3.5 border-2 transition-all duration-200 ${isActive
                              ? 'border-amber-600 bg-amber-50/20 shadow-xs ring-1 ring-amber-600/10'
                              : 'border-default-200 hover:border-amber-200 bg-white'
                              }`}
                          >
                            <span className={`text-xs font-extrabold ${isActive ? 'text-amber-950' : 'text-foreground'}`}>
                              {heir.label}
                            </span>
                            <div>
                              {!isActive ? (
                                <Button
                                  size="sm"
                                  onPress={() => updateHeir(heir.key, 1)}
                                  className="h-8 px-3 text-[11px] font-black rounded-xl transition-all bg-transparent border border-default-300 text-foreground hover:bg-default-100"
                                >
                                  <span className="flex items-center gap-1">
                                    <Plus size={12} /> إضافة
                                  </span>
                                </Button>
                              ) : heir.type === 'select' ? (
                                <Button
                                  size="sm"
                                  onPress={() => updateHeir(heir.key, 0)}
                                  className="h-8 px-3 text-[11px] font-black rounded-xl transition-all bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                                >
                                  <span className="flex items-center gap-1">
                                    <Check size={12} className="stroke-3" /> مضاف
                                  </span>
                                </Button>
                              ) : (
                                <div className="flex items-center gap-1.5 p-0.5 rounded-lg border border-amber-300 bg-amber-50 shadow-3xs transition-all">
                                  <Button
                                    size="sm"
                                    isIconOnly
                                    onPress={() => updateHeir(heir.key, Math.max(0, currentVal - 1))}
                                    className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-250/20"
                                  >
                                    <Minus size={12} />
                                  </Button>
                                  <span className="w-6 text-center text-xs font-black text-amber-950">
                                    {currentVal}
                                  </span>
                                  <Button
                                    size="sm"
                                    isIconOnly
                                    onPress={() => updateHeir(heir.key, currentVal + 1)}
                                    className="w-7 h-7 min-w-0 bg-transparent text-foreground hover:bg-default-250/20"
                                  >
                                    <Plus size={12} />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4 pt-2">
            <Button
              variant="outline"
              onPress={handlePrev}
              isDisabled={currentStepIndex === 0}
              className="flex-1 font-bold h-12 border-default-300 rounded-2xl"
            >
              <ArrowRight size={16} /> السابق
            </Button>

            <Button
              onPress={handleNext}
              isDisabled={isNextDisabled}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 rounded-2xl shadow-sm"
            >
              {currentStepIndex === activeSteps.length - 1 ? (
                <>
                  <Calculator size={16} /> احسب التركة
                </>
              ) : (
                <>
                  التالي <ArrowLeft size={16} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer / Reset Button (Bottom) */}
      <div className="flex flex-col items-center gap-2 py-4 shrink-0">
        <Button
          variant="ghost"
          onPress={resetAll}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-default-100/50 px-4 py-1.5 rounded-full"
        >
          <RotateCcw size={12} className="ml-1" /> البدء من جديد (إعادة تعيين)
        </Button>
        <span className="text-[10px] text-muted-foreground/60 font-medium">نظام المواريث الشرعي المطور</span>
      </div>
    </div>
  );
}
