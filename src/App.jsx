import React, { useState, useEffect } from 'react';
import { InheritanceCalculator } from './engine';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';
import EstateForm from './components/EstateForm';
import WillsForm from './components/WillsForm';
import HeirSelector from './components/HeirSelector';
import ResultsDisplay from './components/ResultsDisplay';
import ResultsPage from './components/ResultsPage';
import { Button } from '@heroui/react';
import { motion } from 'motion/react';
import { Scale, RotateCcw, Calculator, Share2 } from 'lucide-react';
import './App.css';

export const serializeState = (state) => {
  try {
    const json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    console.error("Failed to serialize state:", e);
    return "";
  }
};

export const deserializeState = (str) => {
  try {
    const json = decodeURIComponent(escape(atob(str)));
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to deserialize state:", e);
    return null;
  }
};


const HEIR_CATEGORIES = {
  primary: {
    title: 'الورثة الأساسيون',
    list: [
      { key: 'HUSBAND', label: 'الزوج', type: 'select', max: 1 },
      { key: 'WIFE', label: 'الزوجة', type: 'counter', max: 4 },
      { key: 'SON', label: 'الابن (الأبناء)', type: 'counter' },
      { key: 'DAUGHTER', label: 'البنت (البنات)', type: 'counter' },
      { key: 'FATHER', label: 'الأب', type: 'select', max: 1 },
      { key: 'MOTHER', label: 'الأم', type: 'select', max: 1 }
    ]
  },
  descendants: {
    title: 'الفروع (الأولاد والأحفاد)',
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

const isHeirBlocked = (heirKey, currentHeirs) => {
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

const isCategoryBlocked = (catKey, currentHeirs) => {
  if (catKey === 'primary') return false;
  const list = HEIR_CATEGORIES[catKey].list;
  return list.every(heir => isHeirBlocked(heir.key, currentHeirs));
};

export function CalculatorPage() {
  const navigate = useNavigate();
  const [deceasedName, setDeceasedName] = useState('المتوفى');
  const [deceasedGender, setDeceasedGender] = useState('male');
  const [totalEstate, setTotalEstate] = useState(100000);
  const [debts, setDebts] = useState(0);
  const [heirs, setHeirs] = useState({});
  const [wills, setWills] = useState([]);
  const [heirsApprovedExcess, setHeirsApprovedExcess] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

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
        if (state.wills !== undefined) setWills(state.wills);
        if (state.heirsApprovedExcess !== undefined) setHeirsApprovedExcess(state.heirsApprovedExcess);

        // Run calculation automatically to show preview on load
        const heirsList = Object.entries(state.heirs || {}).map(([relationship, count]) => ({
          relationship,
          count
        }));
        if (heirsList.length > 0) {
          const caseData = {
            id: Date.now(),
            name: state.deceasedName || (state.deceasedGender === 'male' ? 'المتوفى' : 'المتوفاة'),
            total_estate_value: parseFloat(state.totalEstate) || 0,
            funeral_expenses: 0,
            debts: parseFloat(state.debts) || 0,
            heirs: heirsList,
            wills: state.wills || [],
            heirsApprovedExcess: state.heirsApprovedExcess || false
          };
          const calculator = new InheritanceCalculator(caseData);
          const output = calculator.calculate();
          setResult(output);
        }
      }
    }
  }, []);

  const getShareableUrl = () => {
    const state = {
      deceasedName,
      deceasedGender,
      totalEstate,
      debts,
      heirs,
      wills,
      heirsApprovedExcess
    };
    const code = serializeState(state);
    return `${window.location.origin}/results?s=${code}`;
  };

  const copyShareLink = () => {
    const url = getShareableUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      return updated;
    });
    setResult(null);
  };

  const updateHeir = (key, val) => {
    setHeirs(prev => {
      const updated = { ...prev };
      if (val <= 0) {
        delete updated[key];
      } else {
        updated[key] = val;
      }
      return updated;
    });
  };

  const addWill = () => {
    setWills(prev => [
      ...prev,
      { id: Date.now(), name: '', value: '1/3', valueType: 'fraction' }
    ]);
  };

  const updateWill = (id, key, val) => {
    setWills(prev => prev.map(w => {
      if (w.id === id) {
        const updated = { ...w, [key]: val };
        if (key === 'valueType') {
          updated.value = val === 'fraction' ? '1/3' : 0;
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
    let net = parseFloat(totalEstate) - parseFloat(debts);
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

  const handleCalculate = () => {
    const heirsList = Object.entries(heirs).map(([relationship, count]) => ({
      relationship,
      count
    }));

    if (heirsList.length === 0) {
      setErrorMessage('الرجاء إضافة وارث واحد على الأقل للمسألة.');
      return;
    }

    setErrorMessage('');

    const caseData = {
      id: Date.now(),
      name: deceasedName || (deceasedGender === 'male' ? 'المتوفى' : 'المتوفاة'),
      total_estate_value: parseFloat(totalEstate) || 0,
      funeral_expenses: 0,
      debts: parseFloat(debts) || 0,
      heirs: heirsList,
      wills: wills,
      heirsApprovedExcess: heirsApprovedExcess
    };

    console.log("Calculations input caseData:", caseData);
    const calculator = new InheritanceCalculator(caseData);
    const output = calculator.calculate();
    console.log("Calculations output:", output);
    setResult(output);
    navigate('/results', { state: { result: output } });
  };

  const resetAll = () => {
    setHeirs({});
    setWills([]);
    setHeirsApprovedExcess(false);
    setResult(null);
    setDeceasedGender('male');
    setDeceasedName('المتوفى');
    setTotalEstate(100000);
    setDebts(0);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-background pb-16 pt-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto mb-10 text-center space-y-3"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/60 text-amber-800 text-xs font-bold border border-amber-200/60">
          <Scale size={14} /> الميراث الشرعي الدقيق
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          محرك حساب الفرائض والمواريث
        </h1>
        <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed">
          برمجة وحسابات دقيقة قائمة على الشريعة الإسلامية مع التبرير الشرعي لكل وارث، وتصفية الديون والوصايا الشرعية.
        </p>
      </motion.header>

      {/* Main Layout - Centered Form */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className='flex flex-col gap-6'>
          <EstateForm
            deceasedName={deceasedName}
            setDeceasedName={setDeceasedName}
            deceasedGender={deceasedGender}
            handleGenderChange={handleGenderChange}
            totalEstate={totalEstate}
            setTotalEstate={setTotalEstate}
            debts={debts}
            setDebts={setDebts}
          />

          <WillsForm
            wills={wills}
            addWill={addWill}
            updateWill={updateWill}
            removeWill={removeWill}
            heirsApprovedExcess={heirsApprovedExcess}
            setHeirsApprovedExcess={setHeirsApprovedExcess}
            checkWillsExceedThird={checkWillsExceedThird}
          />
        </div>

        <HeirSelector
          heirCategories={HEIR_CATEGORIES}
          heirs={heirs}
          updateHeir={updateHeir}
          isCategoryBlocked={isCategoryBlocked}
          isHeirBlocked={isHeirBlocked}
          deceasedGender={deceasedGender}
        />

        {errorMessage && (
          <div className="lg:col-span-2 p-4 bg-danger/10 border border-danger/30 text-danger rounded-2xl text-sm font-semibold text-center">
            ⚠️ {errorMessage}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-1 mt-8 max-w-2xl mx-auto">
        <Button
          size="lg"
          onPress={handleCalculate}
          isDisabled={!!errorMessage}
          className="flex-2 bg-amber-600 hover:bg-amber-700 text-white font-bold h-12"
        >
          <Calculator size={16} /> احسب التركة
        </Button>

        <Button
          size="lg"
          variant="outline"
          onPress={resetAll}
          className="flex-1 font-semibold h-12"
        >
          <RotateCcw size={14} /> إعادة تعيين
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
