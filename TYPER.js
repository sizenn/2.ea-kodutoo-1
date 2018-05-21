var TYPER = function(){

	//singleton
    if (TYPER.instance_) {
        return TYPER.instance_;
    }
    TYPER.instance_ = this;

    this.routes = TYPER.routes;
	// Muutujad
	this.WIDTH = window.innerWidth;
	this.HEIGHT = window.innerHeight;
	this.canvas = null;
	this.ctx = null;
  this.canvas2 = null;
  this.ctx2 = null;
  this.timerMultiplier = 1;
  this.players = [];
  this.tickSpeed = 500;

  this.typingTotalTime = 0;
  this.typingStartTime = 0;
  this.typingTotalLetters = 0;
  this.typingAvgTime = 0;
  this.currentScore = 0;

	this.words = []; // kõik sõnad
	this.word = null; // preagu arvamisel olev sõna
	this.word_min_length = 3;
	this.guessed_words = 0; // arvatud sõnade arv

	//mängija objekt, hoiame nime ja skoori
	//this.player = {name: null, score: 0, avgSpeed: 0, bestScore: 0};
  this.player = null;
	this.init();
};
var Player = function(name){
  this.name = name;
  this.topScore = 0;
  this.avgSpeed = 0;
  this.nowScore = 0;
  this.nowSpeed = 0;
};

TYPER.routes = {
  'game-view': {
    'render' : function (){
      console.log("mänguleht");
    }
  },
  'index-view' : function (){
    console.log("esileht");
  }
};

TYPER.prototype = {

	// Funktsioon, mille käivitame alguses
	init: function(){
    this.canvas = document.getElementsByTagName('canvas')[1];
		this.ctx = this.canvas.getContext('2d');
    this.canvas2 = document.getElementsByTagName('canvas')[0];
    this.ctx2 = this.canvas2.getContext('2d');
		// canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
    this.canvas2.style.width = this.WIDTH + 'px';
    //this.canvas2.style.height = this.HEIGHT/5*2 + 'px';
    this.canvas2.style.height = this.HEIGHT + 'px';
		this.canvas.style.width = this.WIDTH + 'px';
		this.canvas.style.height = this.HEIGHT + 'px';


		//resolutsioon
		// kui retina ekraan, siis võib ja peaks olema 2 korda suurem
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;

    window.addEventListener('hashchange', this.routeChange.bind(this));
    if(!window.location.hash){
      window.location.hash = 'index-view';
    }else{
      this.routeChange();
    }
	},
  routeChange : function(event){
    this.currentRoute = location.hash.slice(1);

    if(this.routes[this.currentRoute]){

    }else{
      //404 not found
    }
  },
  startGame: function(){
    this.timerMultiplier = 1;
    this.tickSpeed = 500;
    this.loadPlayerData();
		this.loadWords();
  },

	loadPlayerData: function(){

		// küsime mängija nime ja muudame objektis nime
		var p_name = document.getElementById("name").value;
		// Kui ei kirjutanud nime või jättis tühjaks
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";
		}

		// Mänigja objektis muudame nime
		this.player = new Player(p_name); // player =>>> {name:"Romil", score: 0}
    console.log(this.player.name+"nimi kuvatud");
	},

	loadWords: function(){

        console.log('loading...');

		// AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
		var xmlhttp = new XMLHttpRequest();

		// määran mis juhtub, kui saab vastuse
		xmlhttp.onreadystatechange = function(){

			//console.log(xmlhttp.readyState); //võib teoorias kõiki staatuseid eraldi käsitleda

			// Sai faili tervenisti kätte
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){

                console.log('successfully loaded');

				// serveri vastuse sisu
				var response = xmlhttp.responseText;
				//console.log(response);

				// tekitame massiivi, faili sisu aluseks, uue sõna algust märgib reavahetuse \n
				var words_from_file = response.split('\n');
				//console.log(words_from_file);

                // Kuna this viitab siin xmlhttp päringule siis tuleb läheneda läbi avaliku muutuja
                // ehk this.words asemel tuleb kasutada typerGame.words

				//asendan massiivi
				typerGame.words = structureArrayByWordLength(words_from_file);

				// küsime mängija andmed


				// kõik sõnad olemas, alustame mänguga

				typerGame.start();
        typerGame.timer();
			}
		};

		xmlhttp.open('GET','./lemmad2013.txt',true);
		xmlhttp.send();
	},
  timer: function(){
    var that = this;
    this.timerInterval = setTimeout(function(){that.timerDraw();},this.tickSpeed);
  },
  timerCalc: function(){

  },
  timerDraw: function(){
    if(this.timerMultiplier >= 1.00){
      this.timerMultiplier = 1.00;
    }
    if(this.timerMultiplier <= 0){
      console.log("game ended");
      this.endGame();
    }else{
      this.ctx2.clearRect( 0, 0, this.canvas2.width, this.canvas2.height);
      this.ctx2.fillStyle="red";
      this.ctx2.fillStyle="red";
      this.ctx2.fillRect(this.canvas2.width/6,this.canvas2.height/4,this.canvas2.width/6*4,this.canvas.height/80);
      this.ctx2.fillStyle="green";
      this.ctx2.fillRect(this.canvas2.width/6,this.canvas2.height/4,this.canvas2.width/6*4*this.timerMultiplier,this.canvas.height/80);
      this.ctx2.stroke();
      this.timerMultiplier -= 0.02;
      var that = this;
      this.timerInterval = setTimeout(function(){that.timerDraw();},this.tickSpeed);
    }
  },
  screenFlash: function(){
    this.ctx2.strokeStyle="red";
    this.ctx2.lineWidth="8";
    this.ctx2.rect(0,0,this.canvas2.width,this.canvas2.height);
    this.ctx2.stroke();
    var that = this;
    setTimeout(function(){
      that.ctx2.strokeStyle="white";
      that.ctx2.rect(0,0,this.canvas2.width,this.canvas2.height);
      that.ctx2.stroke();
    },200);
  },
  endGame: function(){
    if(!localStorage.players){
      localStorage.setItem('players', JSON.stringify(this.players));
    }
    if(localStorage.players){
      this.players = JSON.parse(localStorage.players);
      this.hasRecord = false;
      this.avgSpeed = this.typingTotalLetters / this.typingTotalTime * 1000;
      var that = this;
      var index = 0;
      this.players.forEach(function(player){
        index += 1;
        if(player.name === that.player.name){
          that.hasRecord = true;
          if(that.currentScore > player.topScore){
            that.player.topScore = that.currentScore;
          }else{that.player.topScore = player.topScore;}
          if(that.avgSpeed > player.avgSpeed){
            that.player.avgSpeed = player.avgSpeed;
          }else{that.player.avgSpeed = player.avgSpeed;}
          that.player.nowSpeed = player.avgSpeed;
          that.player.nowScore = player.currentScore;
          that.players.splice(index,1);
          that.players.push(that.player);
        }
      });
      if(!this.hasRecord){
        this.player.topScore = this.currentScore;
        this.player.nowScore = this.currentScore;
        this.player.avgSpeed = this.avgSpeed;
        this.player.nowSpeed = this.avgSpeed;
        this.players.push(this.player);

      }
      localStorage.setItem('players', JSON.stringify(this.players));
    }
    location.href='#index-view';
  },
	start: function(){

		// Tekitame sõna objekti Word
    this.typingAvgTime = 0;
    this.typingStartTime = Date.now();
    console.log(this.typingStartTime);
    this.typingTotalTime = 0;
    this.typingTotalLetters = 0;
		this.generateWord();
		//console.log(this.word);

        //joonista sõna
		this.word.Draw();

		// Kuulame klahvivajutusi
		window.addEventListener('keypress', this.keyPressed.bind(this));

	},

    generateWord: function(){

        // kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
        // iga viie sõna tagant suureneb sõna pikkus ühe võrra
        var generated_word_length =  this.word_min_length + parseInt(this.guessed_words/5);

    	// Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
    	var random_index = (Math.random()*(this.words[generated_word_length].length-1)).toFixed();

        // random sõna, mille salvestame siia algseks
    	var word = this.words[generated_word_length][random_index];
    	// Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx);
    },

	keyPressed: function(event){

		//console.log(event);
		// event.which annab koodi ja fromcharcode tagastab tähe
		var letter = String.fromCharCode(event.which);
		//console.log(letter);

		// Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
		//console.log(this.word);
		if(letter === this.word.left.charAt(0)){
      this.timerMultiplier += 0.01;
      this.currentScore += 1;
			// Võtame ühe tähe maha
			this.word.removeFirstLetter();

			// kas sõna sai otsa, kui jah - loosite uue sõna

			if(this.word.left.length === 1){


        this.tickSpeed = 500 - (parseInt(this.guessed_words/5)*30);
        //update player score

				//loosin uue sõna
        this.typingTotalTime += (Date.now() - this.typingStartTime);
        this.typingTotalLetters += this.word_min_length + parseInt(this.guessed_words/5);
        this.guessed_words += 1;
        this.typingStartTime = Date.now();
				this.generateWord();
			}

			//joonistan uuesti
			this.word.Draw();
		}else{
      this.timerMultiplier -= 0.02;
      this.currentScore -= 2;
      this.screenFlash();
    }

	}

};


/* HELPERS */
function structureArrayByWordLength(words){
    // TEEN massiivi ümber, et oleksid jaotatud pikkuse järgi
    // NT this.words[3] on kõik kolmetähelised

    // defineerin ajutise massiivi, kus kõik on õiges jrk
    var temp_array = [];

    // Käime läbi kõik sõnad
    for(var i = 0; i < words.length; i++){

        var word_length = words[i].length;

        // Kui pole veel seda array'd olemas, tegu esimese just selle pikkusega sõnaga
        if(temp_array[word_length] === undefined){
            // Teen uue
            temp_array[word_length] = [];
        }

        // Lisan sõna juurde
        temp_array[word_length].push(words[i]);
    }

    return temp_array;
}

window.onload = function(){
	var typerGame = new TYPER();
	window.typerGame = typerGame;
};
