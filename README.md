# 2. kodutöö – *Typer* mängu täiendus

Autor: Rasmus Kivipõld

Rakenduse protsessi flowd näeb:  skeem.png

## Lisatud funktsionaalsus:
Tiksub aeg, mida tähistab red-green bar arvatava sõna üleval. Kui tähe õigesti kirjutad saad aega juurde ja kui tähe valesti kirjutad läheb aega maha.
Mida rohkem sõnu arvatud on, seda kiiremini aeg tiksuma hakkab 
```
(this.tickSpeed = 500 - (parseInt(this.guessed_words / 5) * 30))
```
Kui kirjutad mingi tähe valesti, siis vilgub rakenduse äär punaselt.
Mäng lõppeb kui aeg otsa saab, skoor salvestatakse localStoragesse.

## Skoori arvutamine:
Tähe õigesti kirjutamisel tuleb this.currentScore += 1
Tähe valesti kirjutamisel läheb this.currentScore -= 2

Highskoori arvutamisel vaadatakse, et kas antud mängijal on juba highscore olemas. Kui on, siis kas ta tegi parema tulemuse. Kui tegi, siis uuendatakse.

Iga uue sõna loosimisel lisatakse juurde ajavahe ja trükitud tähtede arv. 
```
this.typingTotalTime += (Date.now() - this.typingStartTime)
this.typingTotalLetters += this.word_min_length + parseInt(this.guessed_words / 5)
```
nendega arvutatakse funktsioonis endGame() keskmine trükkimise kiirus (sümbolit/sekundis)
