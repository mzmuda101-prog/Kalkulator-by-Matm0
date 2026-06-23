// ============================================================
//  Smoke-testy w Node (bez przeglądarki).
//  Atrapa DOM + ładowanie app.js żyje w test/_bootstrap.js.
//  Tutaj odpalamy in-app runnery z window.__matm0:
//    runCalcSmokeTests, runParserSmokeTests, runProjectionSmokeTests.
//  Ten sam pipeline co w aplikacji (evalCalcExpression, compileGraphExpression…).
//
//  Uruchom:   node test/smoke-node.js   (albo: npm test)
//  Wyjście:   kod 0 = wszystko PASS, 1 = są niepowodzenia (lista poniżej).
//  Po dodaniu nowej funkcji dorzuć przypadki do runnerów w app.js i odpal to.
// ============================================================
const { api } = require('./_bootstrap');

if (typeof api.runCalcSmokeTests !== 'function') {
  console.error('❌ window.__matm0.runCalcSmokeTests niedostępne (api:', Object.keys(api), ')');
  process.exit(3);
}

const runners = ['runCalcSmokeTests', 'runParserSmokeTests', 'runProjectionSmokeTests'];
let totalPass = 0, totalFail = 0;
const allFails = [];
runners.forEach(name => {
  if (typeof api[name] !== 'function') { console.log(`(pominięto ${name} — brak)`); return; }
  const res = api[name]() || [];
  let p = 0, f = 0;
  res.forEach(r => { if (r.pass) { p++; totalPass++; } else { f++; totalFail++; allFails.push(Object.assign({ runner: name }, r)); } });
  console.log(`  ${f ? '✗' : '✓'} ${name}: ${p}/${p + f} PASS`);
});
console.log(`\n=== RAZEM: ${totalPass}/${totalPass + totalFail} PASS ===`);
if (allFails.length) {
  console.log('\nNIEPRZESZŁE:');
  allFails.forEach(r => console.log('  ✗', '['+r.runner+']', r.expr, '| got:', r.got, r.error ? '| err: ' + r.error : '', r.unit !== undefined ? '| unit: ' + r.unit : ''));
}
process.exit(totalFail ? 1 : 0);
