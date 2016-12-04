//window.onload = function(){

	//Create phaser game and inject in gameContainer div
  var game = new Phaser.Game(1400, 840, Phaser.CANVAS, 'gameContainer');
	
	game.state.add('Boot', BasicGame.Boot);
	game.state.add('Preloader', BasicGame.Preloader);
	game.state.add('MainMenu', BasicGame.MainMenu);
	game.state.add('Game', BasicGame.Game);

	//Start the boot state
	game.state.start('Boot');

//};