//The initial state. 

//Variables
var SantaGame = {

  BG_SCROLL_SPEED: 10,
  PLAYER_SPEED: 300,
  ENEMY_MIN_X_VELOCITY: -150,
  ENEMY_MAX_X_VELOCITY: -600,
  SHOOTER_MIN_VELOCITY: 100,
  SHOOTER_MAX_VELOCITY: 400,
  GIFT_VELOCITY: 200,
  BOSS_Y_VELOCITY: 200,
  BOSS_X_VELOCITY: 200,
  BULLET_VELOCITY: 500,
  ENEMY_BULLET_VELOCITY: 350,
  POWERUP_VELOCITY: -400,

  SPAWN_ENEMY_DELAY: Phaser.Timer.SECOND * 1.1,
  SPAWN_SHOOTER_DELAY: Phaser.Timer.SECOND * 3.5,
  SPAWN_GIFT_DELAY: Phaser.Timer.SECOND * 5.5,

  SHOT_DELAY: Phaser.Timer.SECOND * 0.1,
  SHOOTER_SHOT_DELAY: Phaser.Timer.SECOND * 2.5,
  BOSS_SHOT_DELAY: Phaser.Timer.SECOND,

  ENEMY_HEALTH: 2,
  SHOOTER_HEALTH: 5,
  BOSS_HEALTH: 200,

  BULLET_DAMAGE: 1,
  CRASH_DAMAGE: 5,

  ENEMY_REWARD: 100,
  SHOOTER_REWARD: 400,
  GIFT_REWARD: 1000,
  BOSS_REWARD: 10000,
  POWERUP_REWARD: 100,

  ENEMY_DROP_RATE: 0.2,
  SHOOTER_DROP_RATE: 0.5,
  BOSS_DROP_RATE: 0, 

  PLAYER_EXTRA_LIVES: 5,
  PLAYER_GHOST_TIME: Phaser.Timer.SECOND * 3,

  INSTRUCTION_EXPIRE: Phaser.Timer.SECOND * 10,
  RETURN_MESSAGE_DELAY: Phaser.Timer.SECOND * 2
};

SantaGame.Boot = function(game){};

SantaGame.Boot.prototype = {

	init: function(){


		this.input.maxPointers = 1;

    //Desktop setting -just in case-
    if(this.game.device.desktop){

      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(800, 480, 1400, 840);
    }
    else{

      //mobile setting
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(480, 288, 800, 480);
      this.scale.forceLandscape = true;
    }

    this.scale.pageAlignVertically = true;
  },

  preaload: function(){

    //Preloader assets
    this.load.image('preloaderBar', '/assets/utils/preloader-bar.png');
  },

	create: function(){

		this.state.start('Preloader');
	}
};