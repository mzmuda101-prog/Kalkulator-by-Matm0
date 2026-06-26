// ============================================================
//  STRAŻNIK „złotego snapshotu" — porównuje, jak silnik liczy TERAZ, z tym co było
//  zapisane w test/baseline-snapshot.json (wygenerowanym przez baseline-gen.js).
//  KAŻDA różnica = potencjalna regresja przy przebudowie silnika (KROK 3).
//
//  Uruchom:  node test/baseline.js   (albo npm run test:baseline)
//  Kod 0 = zero zmian względem snapshotu; 1 = są różnice (wypisane).
//  Gdy zmiana jest CELOWA → przejrzyj różnice i odpal baseline-gen.js, by zapisać nowy stan.
// ============================================================
'use strict';
const fs = require('fs');
const path = require('path');
const { api } = require('./_bootstrap');

// Determinizm — IDENTYCZNY stub jak w generatorze.
api.state.fx.rates = { PLN: 1, EUR: 4.30, USD: 3.95, GBP: 5.00, CHF: 4.50 };
api.state.fx.ts = Date.now();
api.state.fx.source = 'merge';

const snapPath = path.join(__dirname, 'baseline-snapshot.json');
if (!fs.existsSync(snapPath)) {
    console.error('❌ Brak test/baseline-snapshot.json — odpal najpierw: node test/baseline-gen.js');
    process.exit(2);
}
const snapshot = JSON.parse(fs.readFileSync(snapPath, 'utf8'));

const FIELDS = ['value', 'unit', 'text', 'kind', 'exact', 'big', 'bigStr'];
let ok = 0, diff = 0;
const diffs = [];

snapshot.forEach(function (want) {
    var got;
    try {
        var r = api.evalCalcExpression(want.expr) || {};
        got = {
            value: (r.value === undefined ? null : r.value),
            unit: (r.unit === undefined ? null : r.unit),
            text: (r.text === undefined ? null : r.text),
            kind: (r.kind === undefined ? null : r.kind),
            exact: (r.exact === undefined ? null : r.exact),
            big: !!r.big,
            bigStr: (r.bigStr === undefined ? null : r.bigStr),
        };
    } catch (e) {
        got = { error: (e && e.message) || String(e) };
    }
    var changed = [];
    if (want.error || got.error) {
        if ((want.error || null) !== (got.error || null)) changed.push('error: ' + JSON.stringify(want.error) + ' → ' + JSON.stringify(got.error));
    } else {
        FIELDS.forEach(function (f) {
            // tolerancja float dla value
            if (f === 'value' && typeof want[f] === 'number' && typeof got[f] === 'number') {
                if (Math.abs(want[f] - got[f]) > Math.max(1e-9, Math.abs(want[f]) * 1e-12)) changed.push('value: ' + want[f] + ' → ' + got[f]);
            } else if (JSON.stringify(want[f]) !== JSON.stringify(got[f])) {
                changed.push(f + ': ' + JSON.stringify(want[f]) + ' → ' + JSON.stringify(got[f]));
            }
        });
    }
    if (changed.length) { diff++; diffs.push({ expr: want.expr, changed: changed }); } else { ok++; }
});

console.log('  ' + (diff ? '✗' : '✓') + ' baseline: ' + ok + '/' + (ok + diff) + ' bez zmian');
if (diffs.length) {
    console.log('\nRÓŻNICE WZGLĘDEM SNAPSHOTU (jeśli celowe — odpal baseline-gen.js):');
    diffs.forEach(function (d) { console.log('  ✗', d.expr); d.changed.forEach(function (c) { console.log('      ', c); }); });
}
process.exit(diff ? 1 : 0); // atrapa fetch trzyma event-loop → kończymy jawnie
