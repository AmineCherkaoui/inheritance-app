import React from 'react';

const HEIR_MAP = {
  HUSBAND: 'hu',
  WIFE: 'wi',
  SON: 'so',
  DAUGHTER: 'da',
  FATHER: 'fa',
  MOTHER: 'mo',
  GRANDSON: 'gs',
  GRANDDAUGHTER: 'gd',
  GREAT_GRANDSON: 'ggs',
  GREAT_GRANDDAUGHTER: 'ggd',
  FULL_BROTHER: 'fb',
  FULL_SISTER: 'fs',
  PATERNAL_BROTHER: 'pb',
  PATERNAL_SISTER: 'ps',
  MATERNAL_BROTHER: 'mb',
  MATERNAL_SISTER: 'ms',
  PATERNAL_GRANDFATHER: 'pgf',
  PATERNAL_GREAT_GRANDFATHER: 'pggf',
  PATERNAL_GRANDMOTHER: 'pgm',
  MATERNAL_GRANDMOTHER: 'mgm',
  MATERNAL_GREAT_GRANDMOTHER: 'mggm',
  PATERNAL_GREAT_GRANDMOTHER: 'pggm',
  MATERNAL_PATERNAL_GREAT_GRANDMOTHER: 'mpggm',
  NEPHEW_FULL: 'nf',
  NEPHEW_PATERNAL: 'np',
  GREAT_NEPHEW_FULL: 'gnf',
  GREAT_NEPHEW_PATERNAL: 'gnp',
  UNCLE_FULL: 'uf',
  UNCLE_PATERNAL: 'up',
  COUSIN_FULL: 'cf',
  COUSIN_PATERNAL: 'cp',
  GREAT_COUSIN_FULL: 'gcf',
  GREAT_COUSIN_PATERNAL: 'gcp',
  FATHER_UNCLE_FULL: 'fuf',
  FATHER_UNCLE_PATERNAL: 'fup',
  FATHER_COUSIN_FULL: 'fcf',
  FATHER_COUSIN_PATERNAL: 'fcp'
};

const REVERSE_HEIR_MAP = Object.fromEntries(
  Object.entries(HEIR_MAP).map(([k, v]) => [v, k])
);

export const serializeState = (state) => {
  try {
    const compact = {};
    if (state.deceasedName) compact.n = state.deceasedName;
    if (state.deceasedGender) compact.g = state.deceasedGender === 'male' ? 'm' : 'f';
    if (state.totalEstate !== undefined && state.totalEstate !== null) compact.e = state.totalEstate;
    if (state.debts !== undefined && state.debts !== null) compact.d = state.debts;
    if (state.heirsApprovedExcess) compact.a = 1;
    
    if (state.heirs) {
      compact.h = {};
      for (const [k, v] of Object.entries(state.heirs)) {
        const shortKey = HEIR_MAP[k] || k;
        compact.h[shortKey] = v;
      }
    }
    
    if (state.wills && state.wills.length > 0) {
      compact.w = state.wills.map(w => {
        const cw = {};
        if (w.name) cw.n = w.name;
        if (w.value) cw.v = w.value;
        if (w.valueType) {
          cw.t = w.valueType === 'fraction' ? 'r' : (w.valueType === 'percentage' ? 'p' : 'a');
        }
        if (w.id) cw.i = w.id;
        return cw;
      });
    }

    if (state.mandatoryBequests && state.mandatoryBequests.length > 0) {
      compact.mb = state.mandatoryBequests.map(item => ({
        t: item.type === 'son' ? 's' : 'd',
        s: item.sonsCount,
        d: item.daughtersCount,
        gs: item.greatSonsCount,
        gd: item.greatDaughtersCount,
        ma: item.motherAlive !== false ? 1 : 0,
        sa: item.spouseAlive !== false ? 1 : 0,
        gsa: item.greatSpouseAlive === true ? 1 : 0,
        i: item.id
      }));
    }

    const json = JSON.stringify(compact);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error("Failed to serialize state:", e);
    return "";
  }
};

export const deserializeState = (str) => {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = decodeURIComponent(escape(atob(base64)));
    const parsed = JSON.parse(jsonStr);

    if (parsed.deceasedGender || parsed.heirs || parsed.totalEstate || parsed.debts) {
      return parsed;
    }

    const state = {};
    if (parsed.n) state.deceasedName = parsed.n;
    if (parsed.g) state.deceasedGender = parsed.g === 'm' ? 'male' : 'female';
    if (parsed.e !== undefined) state.totalEstate = parsed.e;
    if (parsed.d !== undefined) state.debts = parsed.d;
    state.heirsApprovedExcess = parsed.a === 1;

    if (parsed.h) {
      state.heirs = {};
      for (const [k, v] of Object.entries(parsed.h)) {
        const fullKey = REVERSE_HEIR_MAP[k] || k;
        state.heirs[fullKey] = v;
      }
    }

    if (parsed.w) {
      state.wills = parsed.w.map(cw => {
        const w = {};
        if (cw.n) w.name = cw.n;
        if (cw.v) w.value = cw.v;
        if (cw.t) {
          w.valueType = cw.t === 'r' ? 'fraction' : (cw.t === 'p' ? 'percentage' : 'amount');
        }
        if (cw.i) w.id = cw.i;
        return w;
      });
    }

    if (parsed.mb) {
      state.mandatoryBequests = parsed.mb.map(item => ({
        id: item.i,
        type: item.t === 's' ? 'son' : 'daughter',
        sonsCount: item.s,
        daughtersCount: item.d,
        greatSonsCount: item.gs,
        greatDaughtersCount: item.gd,
        motherAlive: item.ma !== 0,
        spouseAlive: item.sa !== 0,
        greatSpouseAlive: item.gsa === 1
      }));
    }

    return state;
  } catch (e) {
    console.error("Failed to deserialize state:", e);
    return null;
  }
};

export const renderExplanationWithQuranFont = (text) => {
  if (!text) return null;
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const verse = part.slice(1, -1);
      return (
        <span key={index} className="font-quran mx-0.5">
          [{verse}]
        </span>
      );
    }
    return part;
  });
};

