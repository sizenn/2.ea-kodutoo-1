var TYPER = function () {
  // singleton
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.routes = TYPER.routes
  // Muutujad
  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null
  this.canvas2 = null
  this.ctx2 = null
  this.timerMultiplier = 1
  this.players = []
  this.tickSpeed = 500

  this.typingTotalTime = 0
  this.typingStartTime = 0
  this.typingTotalLetters = 0
  this.typingAvgTime = 0
  this.currentScore = 0

  this.words = [] // kõik sõnad
  this.word = null // preagu arvamisel olev sõna
  this.word_min_length = 3
  this.guessed_words = 0 // arvatud sõnade arv

  // mängija objekt, hoiame nime ja skoori
  // this.player = {name: null, score: 0, avgSpeed: 0, bestScore: 0};
  this.player = null
  this.init()
}
var Player = function (name) {
  this.name = name
  this.topScore = 0
  this.avgSpeed = 0
  this.nowScore = 0
  this.nowSpeed = 0
}

TYPER.routes = {
  'game-view': {
    'render': function () {
      console.log('mänguleht')
    }
  },
  'index-view': function () {
    console.log('esileht')
  }
}

TYPER.prototype = {

  // Funktsioon, mille käivitame alguses
  init: function () {
    this.canvas = document.getElementsByTagName('canvas')[1]
    this.ctx = this.canvas.getContext('2d')
    this.canvas2 = document.getElementsByTagName('canvas')[0]
    this.ctx2 = this.canvas2.getContext('2d')
    // canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
    this.canvas2.style.width = this.WIDTH + 'px'
    this.canvas2.style.height = this.HEIGHT + 'px'
    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    window.addEventListener('keypress', this.keyPressed.bind(this))

    // resolutsioon
    // kui retina ekraan, siis võib ja peaks olema 2 korda suurem
    this.canvas.width = this.WIDTH
    this.canvas.height = this.HEIGHT

    this.updateHighScores()

    window.addEventListener('hashchange', this.routeChange.bind(this))
    if (!window.location.hash) {
      window.location.hash = 'index-view'
    } else {
      this.routeChange()
    }
  },
  routeChange: function (event) {
    this.currentRoute = location.hash.slice(1)

    if (this.routes[this.currentRoute]) {

    } else {
      // 404 not found
    }
  },
  startGame: function () {
    this.timerMultiplier = 1
    this.tickSpeed = 500
    this.typingTotalTime = 0
    this.typingStartTime = 0
    this.typingTotalLetters = 0
    this.typingAvgTime = 0
    this.currentScore = 0
    this.words = [] // kõik sõnad
    this.word = null // preagu arvamisel olev sõna
    this.word_min_length = 3
    this.guessed_words = 0 // arvatud sõnade arv
    this.loadPlayerData()
    this.loadWords()
    // this.start();
    // this.timer();
  },

  loadPlayerData: function () {
    // küsime mängija nime ja muudame objektis nime
    var pName = document.getElementById('name').value
    // Kui ei kirjutanud nime või jättis tühjaks
    if (pName === null || pName === '') {
      pName = 'Tundmatu'
    }

    // Mänigja objektis muudame nime
    this.player = new Player(pName) // player =>>> {name:"Romil", score: 0}
    console.log(this.player.name + ' nimi kuvatud')
  },

  loadWords: function () {
    console.log('loading...')

    // AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
    var xmlhttp = new XMLHttpRequest()

    // määran mis juhtub, kui saab vastuse
    xmlhttp.onreadystatechange = function () {
      // console.log(xmlhttp.readyState); //võib teoorias kõiki staatuseid eraldi käsitleda

      // Sai faili tervenisti kätte
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        console.log('successfully loaded')

        // serveri vastuse sisu
        var response = xmlhttp.responseText
        // console.log(response);

        // tekitame massiivi, faili sisu aluseks, uue sõna algust märgib reavahetuse \n
        var wordsFromFile = response.split('\n')
        // console.log(words_from_file);

        // Kuna this viitab siin xmlhttp päringule siis tuleb läheneda läbi avaliku muutuja
        // ehk this.words asemel tuleb kasutada typerGame.words

        // asendan massiivi
        typerGame.words = structureArrayByWordLength(wordsFromFile)

        // küsime mängija andmed

        // kõik sõnad olemas, alustame mänguga
        typerGame.start()
        typerGame.timer()
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },
  timer: function () {
    var that = this
    this.timerInterval = setTimeout(function () { that.timerDraw() }, this.tickSpeed)
  },
  timerCalc: function () {

  },
  timerDraw: function () {
    if (this.timerMultiplier >= 1.00) {
      this.timerMultiplier = 1.00
    }
    if (this.timerMultiplier <= 0) {
      this.endGame()
      this.updateHighScores()
    } else {
      this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height)
      this.ctx2.fillStyle = 'red'
      this.ctx2.fillStyle = 'red'
      this.ctx2.fillRect(this.canvas2.width / 6, this.canvas2.height / 4, this.canvas2.width / 6 * 4, this.canvas.height / 80)
      this.ctx2.fillStyle = 'green'
      this.ctx2.fillRect(this.canvas2.width / 6, this.canvas2.height / 4, this.canvas2.width / 6 * 4 * this.timerMultiplier, this.canvas.height / 80)
      this.ctx2.stroke()
      this.timerMultiplier -= 0.02
      var that = this
      this.timerInterval = setTimeout(function () { that.timerDraw() }, this.tickSpeed)
    }
  },
  screenFlash: function () {
    this.ctx2.strokeStyle = 'red'
    this.ctx2.lineWidth = '8'
    this.ctx2.rect(0, 0, this.canvas2.width, this.canvas2.height)
    this.ctx2.stroke()
    var that = this
    setTimeout(function () {
      that.ctx2.strokeStyle = 'white'
      that.ctx2.rect(0, 0, this.canvas2.width, this.canvas2.height)
      that.ctx2.stroke()
    }, 200)
  },
  endGame: function () {
    if (!localStorage.players) {
      localStorage.setItem('players', JSON.stringify(this.players))
    }
    if (localStorage.players) {
      this.players = JSON.parse(localStorage.players)
      this.avgSpeed = this.typingTotalLetters / this.typingTotalTime * 1000
      this.avgSpeed = +this.avgSpeed.toFixed(2)
      var that = this
      that.hasRecord = false
      var index = 0
      var playerIndex = 0
      this.players.forEach(function (player) {
        if (player.name === that.player.name) {
          that.hasRecord = true
          if (that.currentScore > player.topScore) {
            that.player.topScore = that.currentScore
          } else { that.player.topScore = player.topScore }
          if (that.avgSpeed > player.avgSpeed) {
            that.player.avgSpeed = that.avgSpeed
          } else { that.player.avgSpeed = player.avgSpeed }
          that.player.nowSpeed = player.avgSpeed
          that.player.nowScore = player.currentScore
          playerIndex = index
        }
        index += 1
      })
      if (that.hasRecord) {
        this.players.splice(playerIndex, 1)
        this.players.push(that.player)
      } else {
        this.player.topScore = this.currentScore
        this.player.nowScore = this.currentScore
        this.player.avgSpeed = this.avgSpeed
        this.player.nowSpeed = this.avgSpeed
        this.players.push(this.player)
      }

      if (localStorage.getItem('players') !== null) {
        localStorage.removeItem('players')
      }

      localStorage.setItem('players', JSON.stringify(this.players))
    }
    location.href = '#index-view'
  },

  updateHighScores: function () {
    if (localStorage.players) {
      this.players = JSON.parse(localStorage.players)
      this.players = this.players.sort(function (a, b) {
        return a.topScore - b.topScore
      })
      localStorage.removeItem('players')
      localStorage.setItem('players', JSON.stringify(this.players))

      var scoreDiv = document.getElementById('scoreDiv')
      while (scoreDiv.hasChildNodes()) {
        scoreDiv.removeChild(scoreDiv.lastChild)
      }

      var divId = 1
      this.players.forEach(function (player) {
        if (divId < 11) {
          var stats = document.createElement('tr')
          stats.classList.add('score' + divId)
          var stat1 = document.createElement('th')
          var stat2 = document.createElement('th')
          var stat3 = document.createElement('th')
          var text1 = document.createTextNode(player.name)
          var text2 = document.createTextNode(player.topScore)
          var text3 = document.createTextNode(player.avgSpeed)
          stat1.appendChild(text1)
          stat2.appendChild(text2)
          stat3.appendChild(text3)
          stats.appendChild(stat1)
          stats.appendChild(stat2)
          stats.appendChild(stat3)
          scoreDiv.appendChild(stats)
          divId += 1
        }
      })
    }
  },

  start: function () {
    // Tekitame sõna objekti Word
    this.typingAvgTime = 0
    this.typingStartTime = Date.now()
    this.typingTotalTime = 0
    this.typingTotalLetters = 0
    this.generateWord()

    // joonista sõna
    this.word.Draw()
  },

  generateWord: function () {
    // kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
    // iga viie sõna tagant suureneb sõna pikkus ühe võrra
    var generatedWordLength = this.word_min_length + parseInt(this.guessed_words / 5)
    // Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
    var randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()

    // random sõna, mille salvestame siia algseks
    var wordz = this.words[generatedWordLength][randomIndex]
    // Word on defineeritud eraldi Word.js failis
    this.word = new Word(wordz, this.canvas, this.ctx)
  },

  keyPressed: function (event) {
    // console.log(event);
    // event.which annab koodi ja fromcharcode tagastab tähe
    var letter = String.fromCharCode(event.which)
    // console.log(letter);

    // Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
    // console.log(this.word);
    if (letter === this.word.left.charAt(0)) {
      this.timerMultiplier += 0.01
      this.currentScore += 1
      // Võtame ühe tähe maha
      this.word.removeFirstLetter()

      // kas sõna sai otsa, kui jah - loosite uue sõna

      if (this.word.left.length === 0) {
        this.tickSpeed = 500 - (parseInt(this.guessed_words / 5) * 30)
        // update player score

        // loosin uue sõna
        this.typingTotalTime += (Date.now() - this.typingStartTime)
        this.typingTotalLetters += this.word_min_length + parseInt(this.guessed_words / 5)
        this.guessed_words += 1
        this.typingStartTime = Date.now()
        this.generateWord()
      }

      // joonistan uuesti
      this.word.Draw()
    } else {
      this.timerMultiplier -= 0.02
      this.currentScore -= 2
      this.screenFlash()
    }
  }

}

/* HELPERS */
function structureArrayByWordLength (words) {
  // TEEN massiivi ümber, et oleksid jaotatud pikkuse järgi
  // NT this.words[3] on kõik kolmetähelised

  // defineerin ajutise massiivi, kus kõik on õiges jrk
  var tempArray = []

  // Käime läbi kõik sõnad
  for (var i = 0; i < words.length; i++) {
    var wordLength = words[i].length

    // Kui pole veel seda array'd olemas, tegu esimese just selle pikkusega sõnaga
    if (tempArray[wordLength] === undefined) {
      // Teen uue
      tempArray[wordLength] = []
    }

    // Lisan sõna juurde
    tempArray[wordLength].push(words[i])
  }

  return tempArray
}

window.onload = function () {
  var typerGame = new TYPER()
  window.typerGame = typerGame
}
