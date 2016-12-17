//The title screen and main menu before the actual game.
SantaGame.MainMenu = function (game) {

  this.music = null;
  this.playButton = null;

};

SantaGame.MainMenu.prototype = {

  create: function(){

    this.add.sprite(0, 0, 'titlepage');

    this.loadingText = this.add.text(
    	this.game.width / 2, this.game.height / 2 + 160, 
    	"Cliquez ou toucher l'écran pour commencer", 
    	{ font: "20px Open Sans", fill: "#fff" }
	);

    this.loadingText.anchor.setTo(0.5, 0.5);
    this.add.text(
      this.game.width / 2, this.game.height - 30, 
      "image assets Copyright (c) 2016 Jérémie Néhlil", 
      { font: "12px Open Sans", fill: "#fff", align: "center"}
      ).anchor.setTo(0.5, 0.5);

    this.add.text(
      this.game.width / 2, this.game.height - 5, 
      "sound assets Copyright (c) 2012 - 2013 Devin Watson", 
      { font: "12px Open Sans", fill: "#fff", align: "center"}
      ).anchor.setTo(0.5, 0.5);

  },

  update: function(){

    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.activePointer.isDown){

      this.startGame();
    } 

  },

  startGame: function(pointer){

    //Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    //this.music.stop();

    //And start the actual game
    this.state.start('Game');

  }

};