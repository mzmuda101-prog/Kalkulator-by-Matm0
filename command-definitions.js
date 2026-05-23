(function() {
    'use strict';

    /*
       This file documents commands for the help drawer only.
       The parser in app.js stays authoritative: if the parser supports more than
       this list, the app should still accept it. Keep this file human-editable.
    */
    // UWAGA dla mnie z przyszłości:
    // wpis "@tryb lub .tryb" w Trybach rozmieszczenia ma hardkodowane @ i . w syntax/description
    // jeśli kiedyś zmienię MODE na coś innego to ten jeden wpis trzeba zaktualizować ręcznie
    // reszta command-definitions używa {PIPE} {MODE} {SERIES} więc sama się aktualizuje
    window.MATM0_COMMAND_DEFINITIONS = {
        engineering: [
            {
                title: 'Najkrocej',
                items: [
                    { syntax: 'x=120/4', command: 'x=120/4', description: 'podziel dlugosc 120 na 4 punkty na osi X.' },
                    { syntax: 'y=200/5', command: 'y=200/5', description: 'podzial pionowo na osi Y.' },
                    { syntax: '120/4', command: '120/4', description: 'skrot dla osi X.' },
                    { syntax: 'x=120 {PIPE} co=20', command: 'x=120 {PIPE} co=20', description: 'punkty co 20 bez wpisywania liczby punktow.' },
                ],
            },
            {
                title: 'Tryby rozmieszczenia',
                items: [
                    { syntax: '@tryb lub .tryb', description: 'kropka dziala tak samo jak @, latwiejsza na telefonie.' },
                    { syntax: '@between', command: 'x=120/4 {PIPE} {MODE}between', description: 'punkty rowno wewnatrz pola.' },
                    { syntax: '@edges', command: 'x=120/4 {PIPE} {MODE}edges', description: 'pierwszy i ostatni punkt na krancach pola.' },
                    { syntax: 'co=20 / @every:20', command: 'x=120 {PIPE} co=20', description: 'staly odstep miedzy punktami.' },
                    { syntax: '@centered', command: 'x=120/4 {PIPE} {MODE}centered', description: 'wycentruj os wzgledem zera.' },
                    { syntax: '@inside', command: 'x=120/4 {PIPE} {MODE}inside', description: 'alias dla trybu wewnatrz pola.' },
                    { syntax: '@krance / @krawedzie', command: 'x=120/4 {PIPE} {MODE}krance', description: 'aliasy dla @edges.' },
                ],
            },
            {
                title: 'Marginesy i poczatek osi',
                items: [
                    { syntax: 'm=10/20', command: 'x=120/4 {PIPE} m=10/20', description: 'margines start 10, koniec 20.' },
                    { syntax: '<-10 ,, ->20', command: 'x=120/4 {PIPE} <-10 {PIPE} ->20', description: 'marginesy zapisane strzalkami.' },
                    { syntax: 'origin=-60', command: 'x=120/4 {PIPE} origin=-60', description: 'przesuwa poczatek osi, przydatne przy liczeniu od srodka.' },
                    { syntax: 'start=10 / left=10 / ms=10', command: 'x=120/4 {PIPE} left=10', description: 'aliasy marginesu poczatkowego.' },
                    { syntax: 'end=20 / right=20 / me=20', command: 'x=120/4 {PIPE} right=20', description: 'aliasy marginesu koncowego.' },
                    { syntax: 'offset=50 / zero=50', command: 'x=120/4 {PIPE} offset=50', description: 'aliasy przesuniecia osi.' },
                ],
            },
            {
                title: 'Jednostki i opis',
                items: [
                    { syntax: 'u=mm / u=cm / u=m', command: 'x=120/4 {PIPE} u=mm', description: 'ustawia jednostke w wyniku.' },
                    { syntax: 'opis=otwory / label=A / nazwa=A', command: 'x=120/4 {PIPE} opis=otwory', description: 'nazywa serie punktow.' },
                    { syntax: 'r=5 / dia=5 / fi=5 / ø=5', command: 'x=120/4 {PIPE} fi=5', description: 'ustawia promien punktu w wizualizacji wykresow.' },
                    { syntax: 'unit=mm / jednostka=mm', command: 'x=120/4 {PIPE} unit=mm', description: 'aliasy jednostek.' },
                ],
            },
            {
                title: 'Przyklady praktyczne',
                items: [
                    { syntax: 'x=120/4 {PIPE} m=10/10 {PIPE} @edges {PIPE} u=mm', command: 'x=120/4 {PIPE} m=10/10 {PIPE} @edges {PIPE} u=mm', description: 'cztery punkty z rownymi marginesami.' },
                    { syntax: 'x=120 {PIPE} co=15 {PIPE} fi=8 {PIPE} opis=otwory', command: 'x=120 {PIPE} co=15 {PIPE} fi=8 {PIPE} opis=otwory', description: 'otwory co 15, promien 8, z opisem.' },
                    { syntax: 'y=200/5 {PIPE} @edges {PIPE} x=30', command: 'y=200/5 {PIPE} @edges {PIPE} x=30', description: 'pionowa seria przesunieta na X=30.' },
                    { syntax: 'x=120/4 ;; x=120/6 {PIPE} y=30', command: 'x=120/4 ;; x=120/6 {PIPE}  y=30', description: 'dwie serie punktow naraz.' },
                ],
            },
        ],
        graph: [
            {
                title: 'Funkcje podstawowe',
                items: [
                    { syntax: 'f(x)=x', command: 'f(x)=x', description: 'prosta liniowa.' },
                    { syntax: 'f(x)=x^2', command: 'f(x)=x^2', description: 'parabola.' },
                    { syntax: 'f(x)=x^3', command: 'f(x)=x^3', description: 'funkcja szescienna.' },
                ],
            },
            {
                title: 'Trygonometria i stale',
                items: [
                    { syntax: 'f(x)=sin(x)', command: 'f(x)=sin(x)', description: 'sinus.' },
                    { syntax: 'f(x)=cos(x)', command: 'f(x)=cos(x)', description: 'cosinus.' },
                    { syntax: 'f(x)=tan(x)', command: 'f(x)=tan(x)', description: 'tangens.' },
                    { syntax: 'pi', command: 'f(x)=sin(pi*x)', description: 'liczba pi.' },
                    { syntax: 'e', command: 'f(x)=e^x', description: 'liczba Eulera.' },
                ],
            },
            {
                title: 'Funkcje pomocnicze',
                items: [
                    { syntax: 'sqrt(x)', command: 'f(x)=sqrt(x)', description: 'pierwiastek.' },
                    { syntax: 'abs(x)', command: 'f(x)=abs(x)', description: 'wartosc bezwzgledna.' },
                    { syntax: 'log(x) / ln(x)', command: 'f(x)=log(x)', description: 'logarytm dziesietny lub naturalny.' },
                    { syntax: 'floor / ceil / round', command: 'f(x)=round(x)', description: 'zaokraglenia.' },
                    { syntax: 'exp(x)', command: 'f(x)=exp(x)', description: 'funkcja wykladnicza.' },
                ],
            },
            {
                title: 'Geometria 2D',
                items: [
                    { syntax: 'punkt=150,200 ,, label=A ,, r=8', command: 'punkt=150,200 {PIPE} label=A {PIPE} r=8', description: 'punkt w miejscu X=150, Y=200.' },
                    { syntax: 'rect=400x300', command: 'rect=400x300', description: 'prostokat 400 na 300.' },
                    { syntax: 'rect=400x300 ,, ox=50 ,, oy=50', command: 'rect=400x300 {PIPE} ox=50 {PIPE} oy=50', description: 'prostokat przesuniety od poczatku ukladu.' },
                    { syntax: 'siatka=400x300 ,, co=100x100', command: 'siatka=400x300 {PIPE} co=100x100', description: 'siatka punktow w prostokacie.' },
                ],
            },
            {
                title: 'Wieloseria',
                items: [
                    { syntax: 'f(x)=sin(x) ;; f(x)=cos(x)', command: 'f(x)=sin(x) ;; f(x)=cos(x)', description: 'dwie funkcje naraz.' },
                    { syntax: 'rect=400x300 ;; siatka=400x300 ,, co=200x150', command: 'rect=400x300 ;; siatka=400x300 {PIPE} co=200x150 {PIPE} label=slup', description: 'obrys plus punkty konstrukcyjne.' },
                    { syntax: 'x=300/4 ,, y=-2 ;; punkt=150,0', command: 'x=300/4 {PIPE} y=-2 {PIPE} punkt=150,0 {PIPE} label=kotwica', description: 'podzial osi plus osobny punkt.' },
                ],
            },
        ],
    };
})();
