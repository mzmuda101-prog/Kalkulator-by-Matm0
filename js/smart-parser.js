/* ============================================================
   [PL] smart-parser — wydzielany silnik wyrażeń smart-kalkulatora.
   [EN] smart-parser — the smart-calculator expression engine, being
        extracted out of app.js (pkt 2 kierunku „typowanego silnika”,
        patrz project_kalkulator_unified_engine_direction).

   PIERWSZY NAJEMCA: podsilnik CZASU (prymityw `_TIME` + zegar).
   Samowystarczalny — zależy WYŁĄCZNIE od window.MATM0_DATA (tabela jednostek).
   Wystawia window.MATM0_PARSER. app.js konsumuje go jako cienkie wiązanie.
   Kolejne podsilniki (daty/waluty/jednostki) dochodzą tu ewolucyjnie.
   ============================================================ */
(function() {
    'use strict';
    var DATA = (typeof window !== 'undefined' && window.MATM0_DATA) || {};
    var UNIT_CATS = DATA.UNIT_CATEGORIES || {};

    function _nowMinutes() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
    // Token zegara → minuty doby (0..1439) lub null. Akceptuje HH:MM oraz „teraz"/„now".
    function _parseClockToken(str) {
        var s = String(str).trim().toLowerCase();
        if (s === 'teraz' || s === 'now') return _nowMinutes();
        var m = s.match(/^(\d{1,2}):(\d{2})$/);
        if (!m) return null;
        var h = +m[1], mi = +m[2];
        if (h > 23 || mi > 59) return null;
        return h * 60 + mi;
    }

    // ── Wspólny PRYMITYW CZASU: JEDNO źródło prawdy dla zegara i jednostek.
    // Tabela = MATM0_DATA.UNIT_CATEGORIES.time (ta sama, z której app.js buduje CALC_UNITS) →
    // współczynniki NIE mogą się rozjechać (to był powód rozjazdu „300s"). Do PARSOWANIA TRWANIA
    // dokładamy aliasy ważne TYLKO w kontekście czasu (w konwerterze 'm'=metr, 'g'=gram, więc
    // osobno) + potoczne odmiany PL.
    var _TIME = (function() {
        var t = UNIT_CATS.time || { base: 's', units: { s: 1 } };
        var dur = Object.assign({}, t.units, {
            m: 60, g: 3600,
            godzin: 3600, godzine: 3600,
            minut: 60, minute: 60,
            sekund: 1, sekunde: 1
        });
        var names = Object.keys(dur).sort(function(a, b) { return b.length - a.length; }); // najdłuższe-najpierw
        var nameRe = names.map(function(n) { return n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|');
        // Napis trwania → SEKUNDY (lub null). „2h", „90 min", „300s", „1h30", „1:30", „1:30:20", „1h 5 min 30 s".
        function parseSeconds(str) {
            var s = String(str).trim().toLowerCase().replace(/\s+/g, ' ');
            if (!s) return null;
            var m;
            if ((m = s.match(/^(\d{1,3}):(\d{2})(?::(\d{2}))?$/))) {
                var mm = +m[2], ss = m[3] ? +m[3] : 0;
                if (mm > 59 || ss > 59) return null;
                return (+m[1]) * 3600 + mm * 60 + ss;
            }
            // „Nh M" — godziny + gołe minuty bez jednostki (np. „1h30", „2 godz 15")
            if ((m = s.match(/^(\d+)\s*(?:h|g|godz[a-ząćęłńóśźż]*)\s*(\d+)$/))) {
                return (+m[1]) * 3600 + (+m[2]) * 60;
            }
            var pair = '(\\d+(?:[.,]\\d+)?)\\s*(' + nameRe + ')';
            if (!new RegExp('^(?:' + pair + '\\s*)+$').test(s)) return null;
            var total = 0, re = new RegExp(pair, 'g'), x;
            while ((x = re.exec(s))) {
                var f = dur[x[2]];
                if (f == null) return null;
                total += parseFloat(x[1].replace(',', '.')) * f;
            }
            return total;
        }
        return { units: t.units, base: t.base, parseSeconds: parseSeconds };
    })();
    // Czas trwania → MINUTY (zegar liczy w minutach). Deleguje do wspólnego prymitywu.
    function _parseDuration(str) {
        var sec = _TIME.parseSeconds(str);
        return sec == null ? null : sec / 60;
    }
    function _fmtClock(mins) {
        mins = ((Math.round(mins) % 1440) + 1440) % 1440; // zawijanie przez północ
        var h = Math.floor(mins / 60), mi = mins % 60;
        return (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + mi;
    }
    function _fmtDuration(mins) {
        mins = Math.round(Math.abs(mins));
        var h = Math.floor(mins / 60), mi = mins % 60;
        if (h && mi) return h + ' h ' + mi + ' min';
        if (h) return h + ' h';
        return mi + ' min';
    }
    // Dokładny czas zegarowy z SEKUNDAMI (HH:MM:SS) — do pokazania, „z czego" zaokrąglono.
    function _fmtClockSec(mins) {
        var totalSec = ((Math.round(mins * 60) % 86400) + 86400) % 86400;
        var h = Math.floor(totalSec / 3600), mi = Math.floor((totalSec % 3600) / 60), s = totalSec % 60;
        var p = function(n) { return (n < 10 ? '0' : '') + n; };
        return p(h) + ':' + p(mi) + ':' + p(s);
    }
    // Czas zegarowy — „17:00 + 3h", „od 9:30 do 17:15", „teraz + 90 min", „17:00 - 9:30".
    // Zwraca kanoniczny fragment wyniku { text, value, kind, exact } albo null (nie-zegar).
    function evalClockExpression(raw) {
        var s = String(raw || '').trim();
        if (!s) return null;
        var low = s.toLowerCase();
        var m;
        // „od HH:MM do HH:MM" → czas trwania (z przeskokiem przez północ)
        if ((m = low.match(/^od\s+(.+?)\s+do\s+(.+)$/))) {
            var a = _parseClockToken(m[1]), b = _parseClockToken(m[2]);
            if (a != null && b != null) {
                var diff = b - a; if (diff < 0) diff += 1440;
                return { text: _fmtDuration(diff), value: diff, kind: 'duration', exact: true };
            }
            return null;
        }
        // „HH:MM - HH:MM" → różnica (oba muszą być zegarem) — przed regułą odejmowania trwania
        if ((m = low.match(/^(\d{1,2}:\d{2}|teraz|now)\s*-\s*(\d{1,2}:\d{2}|teraz|now)$/))) {
            var a2 = _parseClockToken(m[1]), b2 = _parseClockToken(m[2]);
            if (a2 != null && b2 != null) {
                var diff2 = a2 - b2; if (diff2 < 0) diff2 += 1440;
                return { text: _fmtDuration(diff2), value: diff2, kind: 'duration', exact: true };
            }
            return null;
        }
        // „HH:MM + <trwanie>" / „HH:MM - <trwanie>" → nowy czas zegarowy
        if ((m = low.match(/^(\d{1,2}:\d{2}|teraz|now)\s*([+\-])\s*(.+)$/))) {
            var base = _parseClockToken(m[1]);
            var dur = _parseDuration(m[3]);
            if (base != null && dur != null) {
                var res = base + (m[2] === '-' ? -dur : dur);
                // exact=false, gdy sekundy dały ułamek minuty → wyświetlany HH:MM jest zaokrąglony.
                // exactText = pełny HH:MM:SS „z czego" zaokrąglono (sygnał ≈, A2).
                var isExact = Number.isInteger(res);
                return { text: _fmtClock(res), value: null, kind: 'clock', exact: isExact,
                         exactText: isExact ? null : _fmtClockSec(res) };
            }
            return null;
        }
        // „teraz" / „now" samodzielnie → aktualny czas
        if (low === 'teraz' || low === 'now') return { text: _fmtClock(_nowMinutes()), value: null, kind: 'clock', exact: true };
        return null;
    }

    var API = {
        time: _TIME,                       // prymityw czasu (parseSeconds, units, base)
        parseDurationMinutes: _parseDuration,
        evalClockExpression: evalClockExpression
    };
    if (typeof window !== 'undefined') window.MATM0_PARSER = API;
    if (typeof self !== 'undefined') self.MATM0_PARSER = API;
})();
