/* =============================================================================
   PANEL STROJENIA UI KALKULATORA (mobile ≤639 px)
   ─────────────────────────────────────────────────────────────────────────────
   Edytuj wartości poniżej, odśwież stronę (lub w konsoli: __matm0.fitCalcLayout()).
   Wszystko dotyczy TYLKO widoku telefonu — tablet/desktop bez zmian.

   SZYBKI TEST W DEVTOOLS
   1. Emuluj iPhone (np. 375×667 lub 414×896).
   2. Zakładka Kalkulator, pusty wyświetlacz („0").
   3. Zmień np. displayMinEmpty / keypadBoostEmpty → odśwież lub __matm0.fitCalcLayout().
   4. Wpisz cyfry — sprawdź czy displayMinActive nie ucina wyniku.
   5. Wynik „wypada" pod box → ZWIĘKSZ resultAnimSlack lub displayMinActive
   6. Tekst ucięty OD GÓRY (SE) → ZWIĘKSZ displayMinActive / exprBudgetBoost
      lub ZMNIEJSZ resultReserveEmpty / resultAnimSlack
   7. debug: true → logi w konsoli z wymiarami.

   TEKST WYŚWIETLACZA (najczęstsze na małych ekranach)
   • Ucięty placeholder lub wyrażenie od góry → ZWIĘKSZ displayMinEmpty / placeholderAreaMin
   • Zawinięte wyrażenie wypycha wynik → grid na mobile powinien użyć pustego miejsca U GÓRY
     (sprawdź na XR: długie wyrażenie, wynik przy dolnej krawędzi boxa)
   • Za dużo miejsca na wynik, mało na wyrażenie → ZMNIEJSZ resultReserveActive
   • Pusty ekran za wysoki → ZMNIEJSZ displayMinEmpty (ostrożnie, min. ~96 na SE)

   PROPORCJE (najczęstsze eksperymenty)
   • Większe przyciski przy pustym ekranie → ZMNIEJSZ displayMinEmpty lub ZWIĘKSZ keypadBoostEmpty
   • Mniejszy „pusty” wyświetlacz na wysokich telefonach → ZMNIEJSZ displayMaxEmptyRatio (np. 0.22)
   • Większy sufit skali klawiszy → ZWIĘKSZ scaleMax (np. 1.4)
   • Podczas pisania za ciasno → ZWIĘKSZ displayMinActive (np. 112)

   GRUPY PRZYCISKÓW (fontScale)
   • fn — szare (AC, %, (), ⌫)
   • number — cyfry i kropka
   • operator — ÷ × − +
   • equals — =
   • clear — AC (podklasa clear, dziedziczy fn)
   Wysokość rzędów jest wspólna; fontScale zmienia tylko rozmiar napisu w grupie.

   ============================================================================= */

window.CALC_LAYOUT_TUNE = {

    mobile: {

        /* --- Wyświetlacz vs klawiatura --- */

        // Min. wysokość wyświetlacza [px] gdy PUSTY (tylko „0" + placeholder).
        // Na SE nie schodź poniżej ~96 — inaczej placeholder będzie ucięty od góry.
        displayMinEmpty: 96,

        // Min. wysokość gdy użytkownik COŚ wpisuje — bufor na wyrażenie + wynik.
        // Na SE typowo 112–120; niżej = ucinanie wyrażenia od góry przy 2+ liniach.
        displayMinActive: 116,

        // Dodatkowe px „odjęte" od budżetu wyświetlacza i dodane do klawiatury (tylko gdy pusty).
        keypadBoostEmpty: 20,

        // Górny limit wysokości wyświetlacza przy pustym ekranie (ułamek wysokości panelu).
        // null = bez limitu (stary tryb: wyświetlacz pochłania nadmiar). 0.26 ≈ 26% panelu.
        displayMaxEmptyRatio: 0.26,

        // Odstęp między dolną krawędzią wyświetlacza a siatką przycisków [px].
        layoutGap: 16,

        /* --- Treść wyświetlacza (wyrażenie + wynik + placeholder) --- */

        // Min. wysokość obszaru placeholdera / wyrażenia gdy PUSTO [px].
        placeholderAreaMin: 28,

        // Min. wysokość pola wyrażenia podczas pisania [px] (nie schodzić poniżej).
        exprMinHeight: 28,

        // Dodatkowe px do budżetu wyrażenia (+ = mniej ucinania od góry).
        exprBudgetBoost: 6,

        // Odstęp między textarea a wierszem wyniku [px].
        exprResultGap: 6,

        // Stała rezerwa na wynik gdy PUSTO [px] (null = auto: wysokość „0" + gap).
        // Niższa niż active — bez zapasu na animację.
        resultReserveEmpty: 46,

        // Stała rezerwa na wynik podczas pisania [px] (null = auto z pomiaru).
        resultReserveActive: null,

        // Zapas na animację wyniku gdy PUSTO [px] — zwykle 0.
        resultAnimSlackEmpty: 0,

        // Zapas na animację wyniku podczas pisania [px].
        resultAnimSlack: 6,

        // Min. rezerwa wysokości na wiersz wyniku (fallback gdy active=auto) [px].
        resultReserveMin: 36,

        /* --- Siatka przycisków (bazowe wymiary przy skali 1) --- */

        btnRowBase: 56,   // wysokość jednego rzędu [px] przy scale 1
        gridGapBase: 8,   // odstęp między rzędami [px] przy scale 1
        rows: 5,
        gaps: 4,          // liczba przerw między 5 rzędami

        scaleMin: 0.7,    // dolny limit skali (małe ekrany, np. SE)
        scaleMax: 1.35,   // górny limit — wyżej = większe przyciski zanim wyświetlacz urośnie

        /* --- Grupy przycisków: mnożnik fontu względem --calc-btn-scale --- */

        groups: {
            fn:       { fontScale: 1.0 },
            number:   { fontScale: 1.0 },
            operator: { fontScale: 1.0 },
            equals:   { fontScale: 1.0 },
            clear:    { fontScale: 1.0 },
        },

        /* --- Diagnostyka --- */

        // true → console.log przy każdym przeliczeniu layoutu (wymiary, skala, pusty/aktywny).
        debug: false,
    },
};
