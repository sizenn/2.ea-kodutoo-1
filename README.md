# 2. kodutöö – *Typer* mängu täiendus

Mängu eesmärk on võimalikult kiiresti ekraanile tekkivaid sõnu ära trükkida. Sõnad võetud [Eesti Keele Instituudi lehelt](http://www.eki.ee/tarkvara/wordlist/), [lemmad2013](http://www.eki.ee/tarkvara/wordlist/lemmad2013.txt)

Kodutööna peate täiendama etteantud mängu, et nõuded oleksid täidetud. 

**Töö võib teha ka kahekesi, kuid siis peab GitHubis nägema, kes mida tegi!**

## Nõuded

1. Eraldi on mängu tutvustav leht, kus kirjeldatakse mängu, saab sisestada mängija nime ning alustada mängu
1. Mängijate kohta hoitakse meeles skoori ja salvestakse nt kasutades [localStorage](https://www.w3schools.com/html/html5_webstorage.asp)'it 
1. Mängu tutvustaval lehel näidatakse 10 parima mängija skoori (selle brauseri põhjal kui kasutate localStorage'it)
1. Mäng on põnevam ja teeb midagi lisaks, nt mõni nendest:
    1. valesti tähe trükkimisel on tagajärg (nt mõjutab skoori, ekraan vilgub)
    1. kasutaja saab ise valida raskusastme või teda huvitavad sõnad (sõnapikkuse vms järgi)
    1. eraldi on öörežiim (ingl *dark mode*)
    1. mängus on animatsioonid (nt tähed lendavad ära pärast trükkimist)
    1. ...
1. Eraldi on statistika leht, kus näidatakse ära arvatud sõnade ja kasutajate kohta statistikat (nt eksimuste arv, kirjutamise kiirus vms)
1. [EI OLE KOHUSTUSLIK] Juba mängitud sõnu enam ei loosita
1. [EI OLE KOHUSTUSLIK] Skoori ja kõiki muid andmeid hoitakse serveris 
1. [EI OLE KOHUSTUSLIK] Mängu loogika on serveris ja kasutatakse mängus petmist ennetatakse – *cheat*'imine on kõvasti keerulisem
1. [EI OLE KOHUSTUSLIK] Mäng näeb hea välja ja töötab ka retina ekraanidel!

## Täiendav abimaterjal

* Canvas retina ekraani jaoks [High DPI Canvas](https://www.html5rocks.com/en/tutorials/canvas/hidpi/)
* Mäng 60fps [requestAnimationFrame](http://creativejs.com/resources/requestanimationframe/)
