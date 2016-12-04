// Loads all assets before the actual game. Once that’s done, the game proceeds to MainMenu.

BasicGame.Preloader = function(game){

	this.background = null;
	this.preloadBar = null;
};

BasicGame.Preloader.prototype = {

	preload: function(){

		//Show the load bar
		this.stage.backgroundColor = '#2d2d2d';

		this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
		this.add.text(

			this.game.width / 2, this.game.height / 2 - 30,
			'Chargement...',
			{ font: '32px Monospace', fill: '#fff'}
		).anchor.setTo(0.5, 0.5);

		//Set load bar as loader sprite
		this.load.setPreloadSprite(this.preloadBar);

		//Load the rest of assets
		this.load.image('titlepage', '/assets/utils/titlepage.png');
		this.load.image('sea', '/assets/layers/sea.png');
		this.load.image('bullet', '/assets/bullet/bullet.png');
		this.load.image('enemyBullet', '/assets/bullet/enemy-bullet.png');
		this.load.image('powerup1', '/assets/object/powerup1.png');
		this.load.image('powerup2', '/assets/object/powerup2.png');
		this.load.spritesheet('greenEnemy', '/assets/enemy/enemy.png', 32, 32);
		this.load.spritesheet('whiteEnemy', '/assets/enemy/shooting-enemy.png', 32, 32);
		this.load.spritesheet('destroyerEnemy', '/assets/enemy/destroyer.png', 32, 174);
		this.load.spritesheet('boss', '/assets/boss/boss.png', 93, 75);
		this.load.spritesheet('explosion', '/assets/object/explosion.png', 32, 32);
		this.load.spritesheet('player', '/assets/player/player.png', 64, 64);

		this.load.audio('explosion', ['assets/sound/explosion.ogg', 'assets/sound/explosion.wav']);
		this.load.audio('playerExplosion', ['assets/sound/player-explosion.ogg', 'assets/sound/player-explosion.wav']);
		this.load.audio('enemyFire', ['assets/sound/enemy-fire.ogg', 'assets/sound/enemy-fire.wav']);
		this.load.audio('playerFire', ['assets/sound/player-fire.ogg', 'assets/sound/player-fire.wav']);
		this.load.audio('powerUp', ['assets/sound/powerup.ogg', 'assets/sound/powerup.wav']);
	}, 

	create: function(){

		//Once load finished, disable cropping
		this.preloadBar.cropEnabled = false;
	},

	update: function(){

		this.state.start('MainMenu');
	}
}