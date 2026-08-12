import test from 'node:test';
import assert from 'node:assert';
import { InheritanceCalculator } from '../src/engine.js';

function map(result) {
    const d = {};
    result.distributions.forEach(x => d[x.relationship] = x);
    return d;
}

/*
====================================================
01 - Husband + Father + Mother + Son + Daughter
====================================================
*/

test('01 - Husband + Parents + Son + Daughter', () => {

    const calc = new InheritanceCalculator({
        total_estate_value: 180000,
        heirs: [
            { relationship: 'HUSBAND', count: 1 },
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 },
            { relationship: 'SON', count: 1 },
            { relationship: 'DAUGHTER', count: 1 }
        ]
    });

    const d = map(calc.calculate());

    assert.strictEqual(d.HUSBAND.share_fraction, '1/4');
    assert.strictEqual(d.FATHER.share_fraction, '1/6');
    assert.strictEqual(d.MOTHER.share_fraction, '1/6');
    assert.strictEqual(d.SON.share_fraction, '5/18');
    assert.strictEqual(d.DAUGHTER.share_fraction, '5/36');

});


/*
====================================================
02 - Husband + Parents + 1 Son + 3 Daughters
====================================================
*/

test('02 - Husband + Parents + 1 Son + 3 Daughters', () => {

    const calc = new InheritanceCalculator({
        total_estate_value: 240000,
        heirs: [
            { relationship: 'HUSBAND', count: 1 },
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 },
            { relationship: 'SON', count: 1 },
            { relationship: 'DAUGHTER', count: 3 }
        ]
    });

    const d = map(calc.calculate());

    assert.strictEqual(d.HUSBAND.share_fraction, '1/4');
    assert.strictEqual(d.FATHER.share_fraction, '1/6');
    assert.strictEqual(d.MOTHER.share_fraction, '1/6');

    // total for all daughters
    assert.strictEqual(d.DAUGHTER.share_fraction, '1/4');

    // each daughter
    assert.strictEqual(d.DAUGHTER.per_person_value, 20000);

    assert.strictEqual(d.SON.share_fraction, '1/6');

});


/*
====================================================
03 - Wife + Father + Mother + 2 Sons
====================================================
*/

test('03 - Wife + Parents + 2 Sons', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 480000,

        heirs: [
            { relationship: 'WIFE', count: 1 },
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 },
            { relationship: 'SON', count: 2 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.WIFE.share_fraction, '1/8');
    assert.strictEqual(d.FATHER.share_fraction, '1/6');
    assert.strictEqual(d.MOTHER.share_fraction, '1/6');

    // total for sons
    assert.strictEqual(d.SON.share_fraction, '13/24');

    // each son
    assert.strictEqual(d.SON.per_person_value, 130000);

});


/*
====================================================
04 - Wife + Parents + 2 Daughters
(Awl Case)
====================================================
*/

test('04 - Wife + Parents + 2 Daughters', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 240000,

        heirs: [
            { relationship: 'WIFE', count: 1 },
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 },
            { relationship: 'DAUGHTER', count: 2 }
        ]

    });

    const result = calc.calculate();

    const d = map(result);

    assert.strictEqual(result.is_aul, true);

    assert.strictEqual(d.WIFE.share_fraction, '1/9');
    assert.strictEqual(d.MOTHER.share_fraction, '4/27');
    assert.strictEqual(d.FATHER.share_fraction, '4/27');

    // total daughters
    assert.strictEqual(d.DAUGHTER.share_fraction, '16/27');

});


/*
====================================================
05 - Wife + Parents + Daughter
====================================================
*/

test('05 - Wife + Parents + Daughter', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'WIFE', count: 1 },
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 },
            { relationship: 'DAUGHTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.WIFE.share_fraction, '1/8');
    assert.strictEqual(d.MOTHER.share_fraction, '1/6');
    assert.strictEqual(d.DAUGHTER.share_fraction, '1/2');
    assert.strictEqual(d.FATHER.share_fraction, '5/24');

});


/*
====================================================
06 - Husband + Daughter
(Radd)
====================================================
*/

test('06 - Husband + Daughter', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'HUSBAND', count: 1 },
            { relationship: 'DAUGHTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.HUSBAND.share_fraction, '1/4');
    assert.strictEqual(d.DAUGHTER.share_fraction, '3/4');

});


/*
====================================================
07 - Wife + Daughter
(Radd)
====================================================
*/

test('07 - Wife + Daughter', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'WIFE', count: 1 },
            { relationship: 'DAUGHTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.WIFE.share_fraction, '1/8');
    assert.strictEqual(d.DAUGHTER.share_fraction, '7/8');

});


/*
====================================================
08 - Two Wives + Son
====================================================
*/

test('08 - Two Wives + Son', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 160000,

        heirs: [
            { relationship: 'WIFE', count: 2 },
            { relationship: 'SON', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.WIFE.share_fraction, '1/8');
    assert.strictEqual(d.WIFE.total_value, 20000);
    assert.strictEqual(d.WIFE.per_person_value, 10000);

    assert.strictEqual(d.SON.share_fraction, '7/8');

});


/*
====================================================
09 - Two Wives + Two Sons
====================================================
*/

test('09 - Two Wives + Two Sons', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 160000,

        heirs: [
            { relationship: 'WIFE', count: 2 },
            { relationship: 'SON', count: 2 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.WIFE.share_fraction, '1/8');
    assert.strictEqual(d.WIFE.total_value, 20000);
    assert.strictEqual(d.WIFE.per_person_value, 10000);

    assert.strictEqual(d.SON.share_fraction, '7/8');
    assert.strictEqual(d.SON.per_person_value, 70000);

});


/*
====================================================
10 - Father Only
====================================================
*/

test('10 - Father Only', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'FATHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FATHER.share_fraction, '1');
    assert.strictEqual(d.FATHER.total_value, 100000);

});


/*
====================================================
11 - Father + Mother
====================================================
*/

test('11 - Father + Mother', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.MOTHER.share_fraction, '1/3');
    assert.strictEqual(d.FATHER.share_fraction, '2/3');

});


/*
====================================================
12 - Husband + Father + Mother
(Umariyyatayn)
====================================================
*/

test('12 - Husband + Father + Mother', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'HUSBAND', count: 1 },
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.HUSBAND.share_fraction, '1/2');
    assert.strictEqual(d.MOTHER.share_fraction, '1/6');
    assert.strictEqual(d.FATHER.share_fraction, '1/3');

});


/*
====================================================
13 - Wife + Father + Mother
(Umariyyatayn)
====================================================
*/

test('13 - Wife + Father + Mother', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'WIFE', count: 1 },
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.WIFE.share_fraction, '1/4');
    assert.strictEqual(d.MOTHER.share_fraction, '1/4');
    assert.strictEqual(d.FATHER.share_fraction, '1/2');

});


/*
====================================================
14 - One Daughter
====================================================
*/

test('14 - One Daughter', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 90000,

        heirs: [
            { relationship: 'DAUGHTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.DAUGHTER.share_fraction, '1');

});


/*
====================================================
15 - Two Daughters
====================================================
*/

test('15 - Two Daughters', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'DAUGHTER', count: 2 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.DAUGHTER.share_fraction, '1');
    assert.strictEqual(d.DAUGHTER.per_person_value, 60000);

});


/*
====================================================
16 - Three Daughters
====================================================
*/

test('16 - Three Daughters', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 150000,

        heirs: [
            { relationship: 'DAUGHTER', count: 3 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.DAUGHTER.share_fraction, '1');
    assert.strictEqual(d.DAUGHTER.per_person_value, 50000);

});


/*
====================================================
17 - One Son
====================================================
*/

test('17 - One Son', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'SON', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.SON.share_fraction, '1');

});


/*
====================================================
18 - Two Sons
====================================================
*/

test('18 - Two Sons', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'SON', count: 2 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.SON.share_fraction, '1');
    assert.strictEqual(d.SON.per_person_value, 50000);

});


/*
====================================================
19 - Son + Daughter
====================================================
*/

test('19 - Son + Daughter', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 90000,

        heirs: [
            { relationship: 'SON', count: 1 },
            { relationship: 'DAUGHTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.SON.share_fraction, '2/3');
    assert.strictEqual(d.DAUGHTER.share_fraction, '1/3');

});


/*
====================================================
20 - Two Sons + Two Daughters
====================================================
*/

test('20 - Two Sons + Two Daughters', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 180000,

        heirs: [
            { relationship: 'SON', count: 2 },
            { relationship: 'DAUGHTER', count: 2 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.SON.share_fraction, '2/3');
    assert.strictEqual(d.SON.per_person_value, 60000);

    assert.strictEqual(d.DAUGHTER.share_fraction, '1/3');
    assert.strictEqual(d.DAUGHTER.per_person_value, 30000);

});

/*
====================================================
21 - Two Grandmothers
====================================================
*/
test('21 - Two Grandmothers', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'PATERNAL_GRANDMOTHER', count: 1 },
            { relationship: 'MATERNAL_GRANDMOTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.PATERNAL_GRANDMOTHER.share_fraction, '1/2');
    assert.strictEqual(d.MATERNAL_GRANDMOTHER.share_fraction, '1/2');

    assert.strictEqual(d.PATERNAL_GRANDMOTHER.total_value, 60000);
    assert.strictEqual(d.MATERNAL_GRANDMOTHER.total_value, 60000);

});


/*
====================================================
22 - Grandfather Only
====================================================
*/

test('22 - Grandfather Only', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'PATERNAL_GRANDFATHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.PATERNAL_GRANDFATHER.share_fraction, '1');
    assert.strictEqual(d.PATERNAL_GRANDFATHER.total_value, 100000);

});


/*
====================================================
23 - Grandson Only
====================================================
*/

test('23 - Grandson Only', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 90000,

        heirs: [
            { relationship: 'GRANDSON', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.GRANDSON.share_fraction, '1');

});


/*
====================================================
24 - Grandson + Granddaughter
====================================================
*/

test('24 - Grandson + Granddaughter', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 90000,

        heirs: [
            { relationship: 'GRANDSON', count: 1 },
            { relationship: 'GRANDDAUGHTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.GRANDSON.share_fraction, '2/3');
    assert.strictEqual(d.GRANDDAUGHTER.share_fraction, '1/3');

});


/*
====================================================
25 - Daughter + Granddaughter
====================================================
*/

test('25 - Daughter + Granddaughter', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'DAUGHTER', count: 1 },
            { relationship: 'GRANDDAUGHTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.DAUGHTER.share_fraction, '3/4');
    assert.strictEqual(d.GRANDDAUGHTER.share_fraction, '1/4');

    assert.strictEqual(d.DAUGHTER.total_value, 90000);
    assert.strictEqual(d.GRANDDAUGHTER.total_value, 30000);

});


/*
====================================================
26 - Two Daughters + Granddaughter
(Granddaughter blocked)
====================================================
*/

test('26 - Two Daughters + Granddaughter', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'DAUGHTER', count: 2 },
            { relationship: 'GRANDDAUGHTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.DAUGHTER.share_fraction, '1');

    assert.ok(
        !d.GRANDDAUGHTER ||
        d.GRANDDAUGHTER.share_fraction === '0'
    );

});


/*
====================================================
27 - Father blocks Full Brother
====================================================
*/

test('27 - Father blocks Full Brother', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'FATHER', count: 1 },
            { relationship: 'FULL_BROTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FATHER.share_fraction, '1');

    assert.ok(
        !d.FULL_BROTHER ||
        d.FULL_BROTHER.share_fraction === '0'
    );

});


/*
====================================================
28 - Father blocks Full Sister
====================================================
*/

test('28 - Father blocks Full Sister', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'FATHER', count: 1 },
            { relationship: 'FULL_SISTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FATHER.share_fraction, '1');

    assert.ok(
        !d.FULL_SISTER ||
        d.FULL_SISTER.share_fraction === '0'
    );

});


/*
====================================================
29 - Awl
Husband + Mother + 2 Full Sisters
====================================================
*/

test('29 - Awl: Husband + Mother + 2 Full Sisters', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 84000,

        heirs: [
            { relationship: 'HUSBAND', count: 1 },
            { relationship: 'MOTHER', count: 1 },
            { relationship: 'FULL_SISTER', count: 2 }
        ]

    });

    const result = calc.calculate();
    const d = map(result);

    assert.strictEqual(result.is_aul, true);

    assert.strictEqual(d.HUSBAND.share_fraction, '3/8');
    assert.strictEqual(d.MOTHER.share_fraction, '1/8');

    // Total share of both sisters
    assert.strictEqual(d.FULL_SISTER.share_fraction, '1/2');

    // Optional if your engine exposes it
    // assert.strictEqual(d.FULL_SISTER.per_person_fraction, '1/4');

});


/*
====================================================
30 - Father + Mother + Son
====================================================
*/

test('30 - Father + Mother + Son', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 180000,

        heirs: [
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 },
            { relationship: 'SON', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FATHER.share_fraction, '1/6');
    assert.strictEqual(d.MOTHER.share_fraction, '1/6');
    assert.strictEqual(d.SON.share_fraction, '2/3');

});

/*
====================================================
31 - Grandfather + Full Brother
(Grandfather takes all according to many simplified engines)
====================================================
*/

test('31 - Grandfather + Full Brother', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'PATERNAL_GRANDFATHER', count: 1 },
            { relationship: 'FULL_BROTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.PATERNAL_GRANDFATHER.share_fraction, '1/2');
    assert.strictEqual(d.FULL_BROTHER.share_fraction, '1/2');

});


/*
====================================================
32 - Grandfather + Full Sister
====================================================
*/

test('32 - Grandfather + Full Sister', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'PATERNAL_GRANDFATHER', count: 1 },
            { relationship: 'FULL_SISTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.PATERNAL_GRANDFATHER.share_fraction, '2/3');
    assert.strictEqual(d.FULL_SISTER.share_fraction, '1/3');

});


/*
====================================================
33 - Full Brother Only
====================================================
*/

test('33 - Full Brother Only', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'FULL_BROTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FULL_BROTHER.share_fraction, '1');

});


/*
====================================================
34 - Two Full Brothers
====================================================
*/

test('34 - Two Full Brothers', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'FULL_BROTHER', count: 2 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FULL_BROTHER.share_fraction, '1');
    assert.strictEqual(d.FULL_BROTHER.per_person_value, 60000);

});


/*
====================================================
35 - Full Brother + Full Sister
====================================================
*/

test('35 - Full Brother + Full Sister', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 90000,

        heirs: [
            { relationship: 'FULL_BROTHER', count: 1 },
            { relationship: 'FULL_SISTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FULL_BROTHER.share_fraction, '2/3');
    assert.strictEqual(d.FULL_SISTER.share_fraction, '1/3');

});


/*
====================================================
36 - Two Full Sisters
====================================================
*/

test('36 - Two Full Sisters', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'FULL_SISTER', count: 2 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FULL_SISTER.share_fraction, '1');
    assert.strictEqual(d.FULL_SISTER.per_person_value, 60000);

});


/*
====================================================
37 - One Full Sister
====================================================
*/

test('37 - One Full Sister', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'FULL_SISTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FULL_SISTER.share_fraction, '1');

});


/*
====================================================
38 - Mother blocks Maternal Brother
====================================================
*/

test('38 - Mother + Maternal Brother', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'MOTHER', count: 1 },
            { relationship: 'MATERNAL_BROTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.MOTHER.share_fraction, '2/3');
    assert.strictEqual(d.MATERNAL_BROTHER.share_fraction, '1/3');

    assert.strictEqual(d.MOTHER.total_value, 66666.67);
    assert.strictEqual(d.MATERNAL_BROTHER.total_value, 33333.33);

});


/*
====================================================
39 - Father blocks Paternal Brother
====================================================
*/

test('39 - Father + Paternal Brother', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'FATHER', count: 1 },
            { relationship: 'PATERNAL_BROTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FATHER.share_fraction, '1');

    assert.ok(
        !d.PATERNAL_BROTHER ||
        d.PATERNAL_BROTHER.share_fraction === '0'
    );

});


/*
====================================================
40 - Son blocks Grandson
====================================================
*/

test('40 - Son blocks Grandson', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'SON', count: 1 },
            { relationship: 'GRANDSON', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.SON.share_fraction, '1');

    assert.ok(
        !d.GRANDSON ||
        d.GRANDSON.share_fraction === '0'
    );

});

/*
====================================================
41 - Son blocks Full Brother
====================================================
*/

test('41 - Son blocks Full Brother', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'SON', count: 1 },
            { relationship: 'FULL_BROTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.SON.share_fraction, '1');

    assert.ok(
        !d.FULL_BROTHER ||
        d.FULL_BROTHER.share_fraction === '0'
    );

});


/*
====================================================
42 - Son blocks Full Sister
====================================================
*/

test('42 - Son blocks Full Sister', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'SON', count: 1 },
            { relationship: 'FULL_SISTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.SON.share_fraction, '1');

    assert.ok(
        !d.FULL_SISTER ||
        d.FULL_SISTER.share_fraction === '0'
    );

});


/*
====================================================
43 - Full Brother blocks Nephew
====================================================
*/

test('43 - Full Brother blocks Nephew', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'FULL_BROTHER', count: 1 },
            { relationship: 'NEPHEW', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.FULL_BROTHER.share_fraction, '1');

    assert.ok(
        !d.NEPHEW ||
        d.NEPHEW.share_fraction === '0'
    );

});


/*
====================================================
44 - Full Nephew Only
====================================================
*/

test('44 - Full Nephew Only', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'NEPHEW_FULL', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.NEPHEW_FULL.share_fraction, '1');

});


/*
====================================================
45 - Paternal Uncle Only
====================================================
*/

test('45 - Paternal Uncle Only', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'UNCLE_PATERNAL', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.UNCLE_PATERNAL.share_fraction, '1');

});


/*
====================================================
46 - Paternal Uncle blocks Paternal Cousin
====================================================
*/

test('46 - Paternal Uncle blocks Paternal Cousin', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'UNCLE_PATERNAL', count: 1 },
            { relationship: 'COUSIN_PATERNAL', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.UNCLE_PATERNAL.share_fraction, '1');

    assert.ok(
        !d.COUSIN_PATERNAL ||
        d.COUSIN_PATERNAL.share_fraction === '0'
    );

});


/*
====================================================
47 - Paternal Cousin Only
====================================================
*/

test('47 - Paternal Cousin Only', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 100000,

        heirs: [
            { relationship: 'COUSIN_PATERNAL', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.COUSIN_PATERNAL.share_fraction, '1');

});

/*
====================================================
48 - Daughter + Full Brother
====================================================
*/

test('48 - Daughter + Full Brother', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'DAUGHTER', count: 1 },
            { relationship: 'FULL_BROTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.DAUGHTER.share_fraction, '1/2');
    assert.strictEqual(d.FULL_BROTHER.share_fraction, '1/2');

});


/*
====================================================
49 - Two Daughters + Full Brother
====================================================
*/

test('49 - Two Daughters + Full Brother', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'DAUGHTER', count: 2 },
            { relationship: 'FULL_BROTHER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.DAUGHTER.share_fraction, '2/3');
    assert.strictEqual(d.FULL_BROTHER.share_fraction, '1/3');

});


/*
====================================================
50 - Daughter + Full Sister
(Full sister becomes residuary with daughter)
====================================================
*/

test('50 - Daughter + Full Sister', () => {

    const calc = new InheritanceCalculator({

        total_estate_value: 120000,

        heirs: [
            { relationship: 'DAUGHTER', count: 1 },
            { relationship: 'FULL_SISTER', count: 1 }
        ]

    });

    const d = map(calc.calculate());

    assert.strictEqual(d.DAUGHTER.share_fraction, '1/2');
    assert.strictEqual(d.FULL_SISTER.share_fraction, '1/2');

});

/*
====================================================
51 - Wills scaled down (No approval, exceeding 1/3)
====================================================
*/
test('51 - Wills scaled down without approval', () => {
    const calc = new InheritanceCalculator({
        total_estate_value: 90000,
        heirsApprovedExcess: false,
        wills: [
            { name: 'Will_A', valueType: 'fraction', value: '1/4' },
            { name: 'Will_B', valueType: 'fraction', value: '1/4' }
        ],
        heirs: [
            { relationship: 'SON', count: 1 }
        ]
    });

    const res = calc.calculate();
    const d = map(res);

    // Each will is scaled to 1/6 (total 1/3)
    assert.strictEqual(d.WILL_Will_A.share_fraction, '1/6');
    assert.strictEqual(d.WILL_Will_B.share_fraction, '1/6');
    // Son gets the remaining 2/3
    assert.strictEqual(d.SON.share_fraction, '2/3');
});

/*
====================================================
52 - Wills executed fully (With approval)
====================================================
*/
test('52 - Wills executed fully with approval', () => {
    const calc = new InheritanceCalculator({
        total_estate_value: 90000,
        heirsApprovedExcess: true,
        wills: [
            { name: 'Will_A', valueType: 'fraction', value: '1/4' },
            { name: 'Will_B', valueType: 'fraction', value: '1/4' }
        ],
        heirs: [
            { relationship: 'SON', count: 1 }
        ]
    });

    const res = calc.calculate();
    const d = map(res);

    assert.strictEqual(d.WILL_Will_A.share_fraction, '1/4');
    assert.strictEqual(d.WILL_Will_B.share_fraction, '1/4');
    assert.strictEqual(d.SON.share_fraction, '1/2');
});

/*
====================================================
53 - Two Daughters + Two Granddaughters + Grandson
(Blessed cousin saves granddaughters from blocking)
====================================================
*/
test('53 - Two Daughters + Two Granddaughters + Grandson', () => {
    const calc = new InheritanceCalculator({
        total_estate_value: 120000,
        heirs: [
            { relationship: 'DAUGHTER', count: 2 },
            { relationship: 'GRANDDAUGHTER', count: 2 },
            { relationship: 'GRANDSON', count: 1 }
        ]
    });

    const d = map(calc.calculate());

    // Daughters take 2/3
    assert.strictEqual(d.DAUGHTER.share_fraction, '2/3');

    // Grandson + 2 Granddaughters share the remaining 1/3 (1/3 total) as Asabah.
    // Ratio: Grandson gets 2 parts, Granddaughters get 1 part each -> total parts = 4.
    // Grandson share: 1/3 * 2/4 = 1/6
    // Granddaughters share: 1/3 * 2/4 = 1/6 total (1/12 each)
    assert.strictEqual(d.GRANDSON.share_fraction, '1/6');
    assert.strictEqual(d.GRANDDAUGHTER.share_fraction, '1/6');
});

/*
====================================================
54 - Grandfather + Full Sister + Paternal Brother (Mu'adah)
====================================================
*/
test('54 - Grandfather + Full Sister + Paternal Brother (Mu\'adah)', () => {
    const calc = new InheritanceCalculator({
        total_estate_value: 100000,
        heirs: [
            { relationship: 'PATERNAL_GRANDFATHER', count: 1 },
            { relationship: 'FULL_SISTER', count: 1 },
            { relationship: 'PATERNAL_BROTHER', count: 1 }
        ]
    });

    const d = map(calc.calculate());

    // Grandfather gets المقاسمة: 2 / (2 + 1 + 2) = 2/5 = 40%
    assert.strictEqual(d.PATERNAL_GRANDFATHER.share_fraction, '2/5');

    // Sibling portion: 3/5
    // Full Sister takes her max of 1/2 of total = 1/2 = 5/10 = 50%
    assert.strictEqual(d.FULL_SISTER.share_fraction, '1/2');

    // Paternal Brother gets the remainder of sibling portion: 3/5 - 1/2 = 6/10 - 5/10 = 1/10 = 10%
    assert.strictEqual(d.PATERNAL_BROTHER.share_fraction, '1/10');
});

/*
====================================================
55 - Wife Only
====================================================
*/
test('55 - Wife Only (Gets Radd as sole heir)', () => {
    const calc = new InheritanceCalculator({
        total_estate_value: 100000,
        heirs: [
            { relationship: 'WIFE', count: 1 }
        ]
    });

    const d = map(calc.calculate());

    assert.strictEqual(d.WIFE.share_fraction, '1');
});

/*
====================================================
56 - Moroccan Mandatory Bequest: Wife + Parents + Son Branch (Living Grandchildren + Great-Grandchildren) + Daughter Branch
====================================================
*/
test('56 - Moroccan Mandatory Bequest: Wife + Parents + Living Grandchildren + Great-Grandchildren + Daughter Branch', () => {
    const calc = new InheritanceCalculator({
        total_estate_value: 45000,
        heirs: [
            { relationship: 'WIFE', count: 1 },
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 }
        ],
        mandatoryBequests: [
            {
                id: 'mb-daughter',
                type: 'daughter',
                sonsCount: 1,
                daughtersCount: 1,
                spouseAlive: true,
                motherAlive: true
            },
            {
                id: 'mb-son',
                type: 'son',
                sonsCount: 1,
                daughtersCount: 1,
                greatSonsCount: 1,
                greatDaughtersCount: 1,
                spouseAlive: true,
                motherAlive: true,
                greatSpouseAlive: true
            }
        ]
    });

    const res = calc.calculate();
    const d = {};
    for (const dist of res.distributions) {
        d[dist.relationship_display] = dist;
    }

    assert.strictEqual(d['الزوجة'].total_value, 4402.34);
    assert.strictEqual(d['الأم'].total_value, 5869.79);
    assert.strictEqual(d['الأب'].total_value, 5869.79);
    assert.strictEqual(d['ابن ابن (من الابن المتوفى #1)'].total_value, 12717.88);
    assert.strictEqual(d['بنت ابن (من الابن المتوفى #1)'].total_value, 6358.94);
    assert.strictEqual(d['ابن بنت (من البنت المتوفية #1)'].total_value, 6250);
    assert.strictEqual(d['بنت بنت (من البنت المتوفية #1)'].total_value, 3125);
    assert.strictEqual(d['ابن ابن ابن (من الابن المتوفى #1)'].total_value, 270.83);
    assert.strictEqual(d['بنت ابن ابن (من الابن المتوفى #1)'].total_value, 135.42);
});

/*
====================================================
57 - Moroccan Mandatory Bequest: Wife + Parents + Son + Daughter + Deceased Son & Daughter Branches (Mothers Deceased)
====================================================
*/
test('57 - Moroccan Mandatory Bequest: Wife + Parents + Son + Daughter + Deceased Son & Daughter Branches (Mothers Deceased)', () => {
    const calc = new InheritanceCalculator({
        total_estate_value: 45000,
        heirs: [
            { relationship: 'WIFE', count: 1 },
            { relationship: 'FATHER', count: 1 },
            { relationship: 'MOTHER', count: 1 },
            { relationship: 'SON', count: 1 },
            { relationship: 'DAUGHTER', count: 1 }
        ],
        mandatoryBequests: [
            {
                id: 'mb-son',
                type: 'son',
                sonsCount: 1,
                daughtersCount: 1,
                greatSonsCount: 1,
                greatDaughtersCount: 1,
                spouseAlive: false,
                motherAlive: false,
                greatSpouseAlive: false
            },
            {
                id: 'mb-daughter',
                type: 'daughter',
                sonsCount: 1,
                daughtersCount: 1,
                spouseAlive: false,
                motherAlive: false
            }
        ]
    });

    const res = calc.calculate();
    const d = {};
    for (const dist of res.distributions) {
        d[dist.relationship_display] = dist;
    }

    assert.strictEqual(d['الابن'].total_value, 13446.37);
    assert.strictEqual(d['البنت'].total_value, 6723.19);
    assert.strictEqual(d['الأم'].total_value, 6206.02);
    assert.strictEqual(d['الأب'].total_value, 6206.02);
    assert.strictEqual(d['الزوجة'].total_value, 4654.51);
    assert.strictEqual(d['ابن ابن (من الابن المتوفى #1)'].total_value, 2166.67);
    assert.strictEqual(d['بنت ابن (من الابن المتوفى #1)'].total_value, 1083.33);
    assert.strictEqual(d['ابن بنت (من البنت المتوفية #1)'].total_value, 1805.56);
    assert.strictEqual(d['بنت بنت (من البنت المتوفية #1)'].total_value, 902.78);
    assert.strictEqual(d['ابن ابن ابن (من الابن المتوفى #1)'].total_value, 1203.7);
    assert.strictEqual(d['بنت ابن ابن (من الابن المتوفى #1)'].total_value, 601.85);
});

/*
====================================================
58 - Moroccan Mandatory Bequest: Separated Living Grandchildren Across Multiple Deceased Son Branches
====================================================
*/
test('58 - Moroccan Mandatory Bequest: Separated Living Grandchildren Across Multiple Deceased Son Branches', () => {
    const calc = new InheritanceCalculator({
        total_estate_value: 45000,
        heirs: [
            { relationship: 'PATERNAL_GRANDFATHER', count: 1 },
            { relationship: 'PATERNAL_GRANDMOTHER', count: 1 },
            { relationship: 'MATERNAL_GRANDMOTHER', count: 1 }
        ],
        mandatoryBequests: [
            {
                id: 'mb-son-1',
                type: 'son',
                sonsCount: 2,
                daughtersCount: 1,
                greatSonsCount: 1,
                greatDaughtersCount: 1,
                spouseAlive: false,
                motherAlive: false,
                greatSpouseAlive: false
            },
            {
                id: 'mb-son-2',
                type: 'son',
                sonsCount: 1,
                daughtersCount: 1,
                greatSonsCount: 1,
                greatDaughtersCount: 1,
                spouseAlive: false,
                motherAlive: false,
                greatSpouseAlive: false
            },
            {
                id: 'mb-daughter-1',
                type: 'daughter',
                sonsCount: 1,
                daughtersCount: 1,
                spouseAlive: false,
                motherAlive: false
            }
        ]
    });

    const res = calc.calculate();
    const d = {};
    for (const dist of res.distributions) {
        d[dist.relationship_display] = dist;
    }

    // Verify each branch is separated
    assert.ok(d['ابن ابن (من الابن المتوفى #1)'], 'Branch 1 grandsons should be separate');
    assert.strictEqual(d['ابن ابن (من الابن المتوفى #1)'].count, 2);

    assert.ok(d['ابن ابن (من الابن المتوفى #2)'], 'Branch 2 grandson should be separate');
    assert.strictEqual(d['ابن ابن (من الابن المتوفى #2)'].count, 1);

    assert.ok(d['بنت ابن (من الابن المتوفى #1)'], 'Branch 1 granddaughter should be separate');
    assert.strictEqual(d['بنت ابن (من الابن المتوفى #1)'].count, 1);

    assert.ok(d['بنت ابن (من الابن المتوفى #2)'], 'Branch 2 granddaughter should be separate');
    assert.strictEqual(d['بنت ابن (من الابن المتوفى #2)'].count, 1);

    // Verify no combined row exists
    assert.strictEqual(d['ابن ابن (من الابن المتوفى #1) و (من الابن المتوفى #2)'], undefined);
    assert.strictEqual(d['بنت ابن (من الابن المتوفى #1) و (من الابن المتوفى #2)'], undefined);
});

