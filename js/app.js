$(window).load(function(){

	$('.loader').fadeOut(2000);
});

$(document).ready(function(){

	$('#playGame').click(function(e){

		e.preventDefault();

		toggleGame();

	
});

	//Launch game
	var launcher = function(){

	  	var game = new Phaser.Game(1400, 840, Phaser.CANVAS, 'gameContainer');
		
		game.state.add('Boot', SantaGame.Boot);
		game.state.add('Preloader', SantaGame.Preloader);
		game.state.add('MainMenu', SantaGame.MainMenu);
		game.state.add('Game', SantaGame.Game);

		//Start the boot state
		game.state.start('Boot');
	}

	//Check device orientation
	var toggleGame = function(){

		if(window.matchMedia("(orientation:landscape)") ){

			$('#turn').hide();
			$('#home').fadeOut();
			$('#gameContainer').css('display', 'block');
			$('#gameContainer').addClass('zoomIn');

			launcher();

			console.log('orientation landscape !');
		}
		else{

			$('#turn').show();
			$('#gameContainer').hide();

			console.log('orientation portrait !');

			//Check if orientation change
			$(window).on('resize orientationchange change', toggleGame() );
		}
	}

});