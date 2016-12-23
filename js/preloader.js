// Loads all assets before the actual game. Once that’s done, the game proceeds to MainMenu.

SantaGame.Preloader = function(game){

	this.background = null;
	this.preloadBar = null;
};

SantaGame.Preloader.prototype = {

	preload: function(){

	    //Preloader assets
	    //this.load.image('preloaderBar', '/assets/utils/preloaderbar.png');


		//Show the load bar
		this.stage.backgroundColor = '#2d2d2d';

		//this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
		this.add.text(

			this.game.width / 2, this.game.height / 2 - 30,
			'Chargement...',
			{ font: '32px Open Sans', fill: '#fff'}
		).anchor.setTo(0.5, 0.5);

		//Set load bar as loader sprite
		//this.load.setPreloadSprite(this.preloadBar);

		//Load the rest of assets
		this.load.image('titlepage', '/assets/utils/mainmenu.png');

		this.load.image('sky', '/assets/layers/layer-sky.png');
		this.load.image('mountain1', '/assets/layers/layer-1.png');
		this.load.image('mountain2', '/assets/layers/layer-2.png');
		this.load.image('mountain3', '/assets/layers/layer-3.png');
		this.load.image('forest', '/assets/layers/layer-4.png');
		this.load.image('snow1', '/assets/layers/snow-1.png');

		this.load.image('bullet', '/assets/bullet/bullet-player.png');
		this.load.image('enemyBullet', '/assets/bullet/bullet-enemy.png');

		this.load.spritesheet('powerup1', '/assets/object/powerup.png', 32, 32);
		this.load.image('gift', '/assets/object/gift.png');
		this.load.image('snowflakes', '/assets/object/snowflake.png');

		this.load.spritesheet('greenEnemy', '/assets/enemy/enemy-2.png', 32, 32);
		this.load.spritesheet('whiteEnemy', '/assets/enemy/enemy-1.png', 82, 82);
		this.load.spritesheet('boss', '/assets/boss/boss-snowman.png', 126, 138);

		this.load.spritesheet('explosion', '/assets/object/explosion.png', 32, 32);

		this.load.spritesheet('player', '/assets/player/santa.png', 220, 128);

		this.load.image('lives', '/assets/object/lives.png');

		this.load.audio('explosion', ['/assets/sound/explosion.ogg', 'assets/sound/explosion.wav']);
		this.load.audio('ambiance', ['/assets/sound/music-bg.wav', 'assets/sound/music-bg.ogg']);
		this.load.audio('playerExplosion', ['/assets/sound/player-explosion.ogg', 'assets/sound/player-explosion.wav']);
		this.load.audio('enemyFire', ['/assets/sound/enemy-fire.ogg', 'assets/sound/enemy-fire.wav']);
		this.load.audio('playerFire', ['/assets/sound/player-fire.ogg', 'assets/sound/player-fire.wav']);
		this.load.audio('powerUp', ['/assets/sound/powerup.ogg', 'assets/sound/powerup.wav']);
	}, 

	create: function(){

		//Once load finished, disable cropping
		//this.preloadBar.cropEnabled = false;
	},

	update: function(){

		this.state.start('MainMenu');
	}
};