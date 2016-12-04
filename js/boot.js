//The initial state. 
//Sets up additional settings for the game. 
//Also pre-loads the image for the pre-loader progress bar before passing the game to Preloader.

//Variables
var BasicGame = {

  SEA_SCROLL_SPEED: 0,//12,
  PLAYER_SPEED: 300,
  ENEMY_MIN_X_VELOCITY: -100,
  ENEMY_MAX_X_VELOCITY: -600,
  SHOOTER_MIN_VELOCITY: 100,
  SHOOTER_MAX_VELOCITY: 400,
  DESTROYER_MIN_VELOCITY: -100,
  DESTROYER_MAX_VELOCITY: -250,
  SHOOTERWAVE_MIN_VELOCITY: -100,
  SHOOTERWAVE_MAX_VELOCITY: -200,
  BOSS_Y_VELOCITY: 15,
  BOSS_X_VELOCITY: 200,
  BULLET_VELOCITY: 500,
  ENEMY_BULLET_VELOCITY: 350,
  POWERUP_VELOCITY: -500,

  SPAWN_ENEMY_DELAY: Phaser.Timer.SECOND,
  SPAWN_SHOOTER_DELAY: Phaser.Timer.SECOND * 3,
  SPAWN_DESTROYER_DELAY: Phaser.Timer.SECOND * 12,
  SPAWN_SHOOTERWAVE_DELAY: Phaser.Timer.SECOND * 3,

  SHOT_DELAY: Phaser.Timer.SECOND * 0.1,
  SHOOTER_SHOT_DELAY: Phaser.Timer.SECOND * 2,
  DESTROYER_SHOT_DELAY: Phaser.Timer.SECOND / 2,
  SHOOTERWAVE_SHOT_DELAY: Phaser.Timer.SECOND * 6,
  BOSS_SHOT_DELAY: Phaser.Timer.SECOND,

  ENEMY_HEALTH: 2,
  SHOOTER_HEALTH: 5,
  DESTROYER_HEALTH: 10,
  SHOOTERWAVE_HEALTH: 3,
  BOSS_HEALTH: 500,

  BULLET_DAMAGE: 1,
  CRASH_DAMAGE: 5,

  ENEMY_REWARD: 100,
  SHOOTER_REWARD: 400,
  DESTROYER_REWARD: 400,
  SHOOTERWAVE_REWARD: 100,
  BOSS_REWARD: 10000,
  POWERUP_REWARD: 100,

  ENEMY_DROP_RATE: 0.2,
  SHOOTER_DROP_RATE: 0.3,
  DESTROYER_DROP_RATE: 0.5,
  SHOOTERWAVE_DROP_RATE: 0.1,
  BOSS_DROP_RATE: 0, 

  PLAYER_EXTRA_LIVES: 5,
  PLAYER_GHOST_TIME: Phaser.Timer.SECOND * 3,

  INSTRUCTION_EXPIRE: Phaser.Timer.SECOND * 10,
  RETURN_MESSAGE_DELAY: Phaser.Timer.SECOND * 2
};

BasicGame.Boot = function(game){};

BasicGame.Boot.prototype = {

	init: function(){


		this.input.maxPointers = 1;

		//Desktop setting -just in case-
		if(this.game.device.desktop){

		}
		else{

			//mobile setting
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.setMinMax(480, 260, 1400, 840);
			this.scale.forceLandscape = true;
		}

		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
	},

	preaload: function(){

		//Preloader assets
		this.load.image('preloaderBar', '/assets/utils/preloader-bar.png');
	},

	create: function(){

		this.state.start('Preloader');
	}
}