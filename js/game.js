//The actual game.
SantaGame.Game = function(game){};


SantaGame.Game.prototype = {

	create: function(){

		this.getHighscore();
		this.setupBackground();
		this.setupParticles();
		this.setupPlayer();
    	this.setupEnemies();
    	this.setupCollectibles();
    	this.setupBullets();
    	this.setupExplosions();
    	this.setupPlayerIcons();
    	this.setupText();

    	//Audio
    	this.setupAudio();

		//Keyboard controls
		this.cursors = this.input.keyboard.createCursorKeys();	//Add controls
	},

	update: function(){

 		this.checkCollisions();
    	this.spawnEnemies();
    	this.spawnGift();
    	this.updateWindDirection();
    	this.enemyFire();
    	this.processPlayerInput();
    	this.processDelayedEffects();
	},

	render: function(){

		//this.game.debug.body(this.bullet);
		//this.game.debug.body(this.enemy);
		//this.game.debug.body(this.player);
		//this.game.debug.spriteInfo(this.enemy);
	},


	/****
	FUNCTIONS
	****/

	//Create() functions

	setupAudio: function(){

		this.sound.volume = 0.3;

		//this.ambianceSFX = this.add.audio('ambiance');
		//this.ambianceSFX.play();
		this.explosionSFX = this.add.audio('explosion');
		this.playerExplosionSFX = this.add.audio('playerExplosion');
	    this.enemyFireSFX = this.add.audio('enemyFire');
	    this.playerFireSFX = this.add.audio('playerFire');
	    this.powerUpSFX = this.add.audio('powerUp');
	},

	setupBackground: function(){

		//Background layers
		this.sky = this.add.tileSprite(0, 0, 1400, 840, 'sky');
		this.sky.autoScroll(0, 0);

		this.mountain = this.add.tileSprite(0, 0, 1400, 840, 'mountain1');
		this.mountain.autoScroll(-75, 0);
		
		this.mountain2 = this.add.tileSprite(0, 0, 1400, 840, 'mountain2');
		this.mountain2.autoScroll(-150, 0);

		this.mountain3 = this.add.tileSprite(0, 0, 1400, 840, 'mountain3');
		this.mountain3.autoScroll(-300, 0);

		this.forest = this.add.tileSprite(0, 0, 1400, 840, 'forest');
		this.forest.autoScroll(-400, 0);
	},

	setupParticles: function(){
		//snow particles
		this.snowEmmitter = this.add.emitter(this.world.centerX, -20, 250);
		this.snowEmmitter.makeParticles('snowflakes');
		this.snowEmmitter.maxParticleScale = 0.6;
		this.snowEmmitter.minParticleScale = 0.2;
		this.snowEmmitter.setYSpeed(100, 200);
		this.snowEmmitter.gravity = 0;
		this.snowEmmitter.width = this.world.width * 1.5;
		this.snowEmmitter.minRotation = 0;
		this.snowEmmitter.maxRotation = 40;

		this.changeWindDirection();

		this.snowEmmitter.start(false, 10000, 100);
	},

	setupPlayer: function(){

		//Player
		this.player = this.add.sprite(this.game.width / 10, this.game.height / 2, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.animations.add('fly', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ,13, 14], 30, true);
		this.player.animations.add('ghost', [15, 1, 17, 3, 19, 5, 21, 7, 23, 9, 25 ,11, 27 ,13, 29], 30, true);
		this.player.play('fly');
		this.player.angle = 0;
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.speed = SantaGame.PLAYER_SPEED;
		this.player.body.collideWorldBounds = true;
		this.player.body.setSize(50, 50, 60, 60); //20 x 20px hitbox, centered  hight than the center
		this.weaponLevel = 0;
	},

	setupEnemies: function(){

		//Enemy
		this.enemyPool = this.add.group();
		this.enemyPool.enableBody = true;
		this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemyPool.createMultiple(50, 'greenEnemy');
		this.enemyPool.setAll('anchor.x', 0.5);				
		this.enemyPool.setAll('anchor.y', 0.5);
		this.enemyPool.setAll('angle', 0);
		this.enemyPool.setAll('outOfBoundsKill', true);		
		this.enemyPool.setAll("checkWorldBounds", true);
		this.enemyPool.setAll(

			'reward', SantaGame.ENEMY_REWARD, false, false, 0, true
		);

		this.enemyPool.setAll(

			'dropRate', SantaGame.ENEMY_DROP_RATE, false, false, 0, true  //chance of droping powerup
		);

		this.enemyPool.forEach(function(enemy){

			enemy.animations.add('fly', [0, 1, 2, 3, 4], 20, true);		//Set anim for each sprite
			enemy.animations.add('hit', [0, 1, 2, 3, 4], 20, false);
			enemy.events.onAnimationComplete.add(function(e){

				e.play('fly');
			}, this);
		});

		this.nextEnemyAt = 0;									
		this.enemyDelay = SantaGame.SPAWN_ENEMY_DELAY;

		//Enemy 2nd type
		this.shooterPool = this.add.group();
		this.shooterPool.enableBody = true;
		this.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.shooterPool.createMultiple(20, 'whiteEnemy');
		this.shooterPool.setAll('anchor.x', 0.5);				
		this.shooterPool.setAll('anchor.y', 0.5);
		this.shooterPool.setAll('scale.x', 0.65);
		this.shooterPool.setAll('scale.y', 0.65);
		this.shooterPool.setAll('outOfBoundsKill', true);		
		this.shooterPool.setAll("checkWorldBounds", true);
		this.shooterPool.setAll(

			'reward', SantaGame.SHOOTER_REWARD, false, false, 0, true
		);

		this.shooterPool.setAll(

			'dropRate', SantaGame.SHOOTER_DROP_RATE, false, false, 0, true //chance of droping powerup
		);

		this.shooterPool.forEach(function(enemy){

			enemy.animations.add('fly', [0, 1, 2, 3, 4], 20, true);
			enemy.animations.add('hit', [5, 1 ,7, 3, 9], 20, false);
			enemy.events.onAnimationComplete.add(function(e){

				e.play('fly');
			}, this);
		});

		this.nextShooterAt = this.time.now + Phaser.Timer.SECOND * 5;
		this.shooterDelay = SantaGame.SPAWN_SHOOTER_DELAY;


		//Boss
		this.bossPool = this.add.group();
		this.bossPool.enableBody = true;
		this.bossPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.bossPool.createMultiple(1, 'boss');
		this.bossPool.setAll('anchor.x', 0.5);				
		this.bossPool.setAll('anchor.y', 0.5);
		this.bossPool.setAll('angle', 0);
		this.bossPool.setAll('outOfBoundsKill', true);		
		this.bossPool.setAll("checkWorldBounds", true);
		this.bossPool.setAll(

			'reward', SantaGame.BOSS_REWARD, false, false, 0, true
		);

		this.bossPool.setAll(

			'dropRate', SantaGame.BOSS_DROP_RATE, false, false, 0 , true
		);

		this.bossPool.forEach(function(enemy){

			enemy.animations.add('fly', [0, 1, 2, 4, 5, 6], 20, true);
			enemy.animations.add('hit', [7, 1, 9, 3, 11, 5, 13], 20, false);
			enemy.events.onAnimationComplete.add(function(e){

				e.play('fly');
			}, this);
		});

		this.boss = this.bossPool.getTop();
		this.bossApproaching = false;
	},

	setupCollectibles: function(){

		//Gift Waves
		this.giftPool = this.add.group();
		this.giftPool.enableBody = true;
		this.giftPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.giftPool.createMultiple(10, 'gift');
		this.giftPool.setAll('anchor.x', 0.5);
		this.giftPool.setAll('anchor.y', 0.5);
		this.giftPool.setAll('scale.x', 0.95);
		this.giftPool.setAll('scale.y', 0.95);
		this.giftPool.setAll('angle', 0);
		this.giftPool.setAll('outOfBoundsKill', true);		
		this.giftPool.setAll("checkWorldBounds", true);
		this.giftPool.setAll(

			'reward', SantaGame.GIFT_REWARD, false, false, 0, true
		);

		/*this.giftPool.forEach(function(gift){

			gift.animations.add('fly', [0, 1], 20, true);
			gift.animations.add('hit', [2, 1, 2, 0], 20, false);
			gift.events.onAnimationComplete.add(function(e){

				e.play('fly');
			}, this);
		});*/

		this.nextGiftAt = this.time.now + Phaser.Timer.SECOND * 5;
		this.giftDelay = SantaGame.SPAWN_GIFT_DELAY * 2;
	},

	setupBullets: function(){

		//EnemyBullet
		this.enemyBulletPool = this.add.group();
		this.enemyBulletPool.enableBody = true;
		this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;//Add physics to the whole group
		this.enemyBulletPool.createMultiple(50, 'enemyBullet');		//Add 100 bullet sprite in group
		this.enemyBulletPool.setAll('anchor.x', 0.5);				//Set anchor of all sprites
		this.enemyBulletPool.setAll('anchor.y', 0.5);
		this.enemyBulletPool.setAll('outOfBoundsKill', true);		//Automatically kill bullet sprite when out of bounds
		this.enemyBulletPool.setAll("checkWorldBounds", true);
		this.enemyBulletPool.setAll(

			'reward', 0, false, false, 0, true
		);

		//Bullet
		this.bulletPool = this.add.group();						//Add empty sprite group into game
		this.bulletPool.enableBody = true;
		this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;//Add physics to the whole group
		this.bulletPool.createMultiple(100, 'bullet');			//Add 50 bullet sprite in group
		this.bulletPool.setAll('anchor.x', 0.5);				//Set anchor of all sprites
		this.bulletPool.setAll('anchor.y', 0.5);
		this.bulletPool.setAll('outOfBoundsKill', true);		//Automatically kill bullet sprite when out of bounds
		this.bulletPool.setAll("checkWorldBounds", true);
		this.nextShotAt = 0;
		this.shotDelay = SantaGame.SHOT_DELAY;
	},

	setupExplosions: function(){

		//Explosion
		this.explosionPool = this.add.group();
		this.explosionPool.enableBody = true;
	    this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
	    this.explosionPool.createMultiple(100, 'explosion');
	    this.explosionPool.setAll('anchor.x', 0.5);
	    this.explosionPool.setAll('anchor.y', 0.5);
	    this.explosionPool.forEach(function (explosion){

	      explosion.animations.add('boom');
	    });
	},

	setupPlayerIcons: function(){

		//Power up
		this.powerUpPool = this.add.group();
		this.powerUpPool.enableBody = true;
	    this.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
	    this.powerUpPool.createMultiple(5, 'powerup1');
	    this.powerUpPool.setAll('anchor.x', 0.5);
	    this.powerUpPool.setAll('anchor.y', 0.5);
	    this.powerUpPool.setAll('outOfBoundsKill', true);
	    this.powerUpPool.setAll('checkWorldBounds', true);
	    this.powerUpPool.setAll(

	    	'reward', SantaGame.POWERUP_REWARD, false, false, 0, true
    	);

    	this.powerUpPool.forEach(function(power){

			power.animations.add('fly', [0, 1, 2, 3, 4], 20, true);		//Set anim for each sprite
			power.play('fly');
		});


		//Life icons
		this.lives = this.add.group();

		var firstLifeIconX = this.game.width - 10 - (SantaGame.PLAYER_EXTRA_LIVES * 30); //calculate location of 1st life icon

		for(var i = 0; i < SantaGame.PLAYER_EXTRA_LIVES; i++){

			var life = this.lives.create(firstLifeIconX + (30 * i), 30, 'lives');

			life.scale.setTo(0.5, 0.5);
			life.anchor.setTo(0.5, 0.5);
		}
	},

	setupText: function(){

		//Message
		this.instructions = this.add.text(						//Add text
		   			
   			this.game.width / 2,
   			this.game.height - 100,/*
			'Utiliser les flèches du clavier pour bouger, barre espace pour tirer \n' + 
			'Mobile : Toucher / cliquer pour bouger et tirer',*/
			'',
			{font: '2em Open Sans', fill: '#fff', align: 'center'}	//Style text		
		);
		this.instructions.anchor.setTo(0.5, 0.5);
		this.instExpire = this.time.now +  SantaGame.INSTRUCTION_EXPIRE;				//Text expire

		//Score
		this.score = 0;
		this.scoreText = this.add.text(

			this.game.width / 2, 30, '' + this.score,
			{ font: '20px Open Sans', fill: '#fff', align: 'center'}
		);
		this.scoreText.anchor.setTo(0.5,  0.5);

		this.bestScoreText = this.add.text(

			10, 10, 'Meilleur score:'+ ' ' + this.highscore,
			{font: '20px Open Sans', fill: '#fff', align: 'center'}
		);
	},


	//update() functions

	checkCollisions: function(){

		this.bulletCollideGroup = [];
		this.enemyCollideGroup = [];
		this.bulletCollideGroup.push(this.shooterPool, this.enemyPool);
		this.enemyCollideGroup.push(this.enemyPool, this.shooterPool, this.giftPool, this.enemyBulletPool);

		this.physics.arcade.overlap(

			this.bulletPool, this.bulletCollideGroup, this.enemyHit, null, this
		);

		this.physics.arcade.overlap(
			this.player, this.enemyCollideGroup, this.playerHit, null, this
		);

	 	//Enemy death/*
	    /*this.physics.arcade.overlap(
	      this.bulletPool, this.enemyPool, this.enemyHit, null, this
	    );

	    this.physics.arcade.overlap(
	      this.bulletPool, this.shooterPool, this.enemyHit, null, this
	    );

	    //Player death
	    this.physics.arcade.overlap(
	      this.player, this.enemyPool, this.playerHit, null, this
	    );

	    this.physics.arcade.overlap(
	      this.player, this.shooterPool, this.playerHit, null, this
	    );*/

	    this.physics.arcade.overlap(
	      this.player, this.giftPool, this.giftHit, null, this
	    );
		/*
	    this.physics.arcade.overlap(
	      this.player, this.enemyBulletPool, this.playerHit, null, this
	    );*/

	    this.physics.arcade.overlap(
	      this.player, this.powerUpPool, this.playerPowerUp, null, this
	    );

	    //Boss
	    if (this.bossApproaching === false) {

	      this.physics.arcade.overlap(
	        this.bulletPool, this.bossPool, this.enemyHit, null, this
	      );

	      this.physics.arcade.overlap(
	        this.player, this.bossPool, this.playerHit, null, this
	      );
	    }	
	},

	spawnEnemies: function(){

		//Random enemy spawn =>TYPE 1
		if(this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0){

			this.nextEnemyAt = this.time.now + this.enemyDelay;

			var enemy = this.enemyPool.getFirstExists(false);

			enemy.reset(

				1400, (this.rnd.integerInRange(20, this.game.height - 20) ),SantaGame.ENEMY_HEALTH 
			);	//Spawn at random location

			enemy.body.velocity.x = this.rnd.integerInRange(SantaGame.ENEMY_MIN_X_VELOCITY,SantaGame.ENEMY_MAX_X_VELOCITY);
			enemy.play('fly');
		}

		if(this.score > 2000 && this.score < 24500){

			//=>TYPE 2
			if(this.nextShooterAt < this.time.now && this.shooterPool.countDead() > 0){

				this.nextShooterAt = this.time.now + this.shooterDelay;

				var shooter = this.shooterPool.getFirstExists(false);

				shooter.reset(
					
					1400, (this.rnd.integerInRange(60, this.game.height - 60) ), SantaGame.SHOOTER_HEALTH	//Spawn at random location
				);
				
				//Random target location
				var target = this.rnd.integerInRange(20, this.game.height - 20),
					targetX = this.game.width;

				//Move to target and rotate the sprite
				shooter.rotation = this.physics.arcade.moveToXY(

					shooter, -targetX, target, this.rnd.integerInRange(SantaGame.SHOOTER_MIN_VELOCITY, SantaGame.SHOOTER_MAX_VELOCITY)
				) - Math.PI / 2;

				shooter.play('fly');

				//Shot timer for each shooter
				shooter.nextShotAt = 0;
			}
		}
	},

	spawnGift: function(){

		//Random gift spawn =>TYPE 1
		if(this.nextGiftAt < this.time.now && this.giftPool.countDead() > 0){

			var startY = this.rnd.integerInRange(100, this.game.height - 100),
				//startX = this.rnd.integerInRange(100, this.game.width - 100),
				spread = 60,
				frequency = 70,
				verticalSpacing = 70,
				horizontalSpacing = 100,
				giftInWaves = 3;

			for(var i = 0; i < giftInWaves; i++){

				var gift = this.giftPool.getFirstExists(false);

				if(gift){

					gift.startY = startY;
					//gift.startX = startX;

					gift.reset(

						this.game.width + (-horizontalSpacing * i),  startY 
					);

					gift.body.velocity.x = -SantaGame.GIFT_VELOCITY;
					//gift.play('fly');

					gift.update = function(){

						this.body.y = this.startY - Math.sin((this.x) / frequency) * spread;
						
						/*if(this.x < this.game.width - 1600){

							this.kill();
							this.x = -20;
						}*/
					}
				}
			}
			this.nextGiftAt = this.time.now + this.giftDelay;
		}
	},

	enemyFire: function(){

		this.shooterPool.forEachAlive(function(enemy){

			if(this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0){

				var bullet = this.enemyBulletPool.getFirstExists(false);

				bullet.reset(enemy.x, enemy.y);
				this.physics.arcade.moveToObject(

					bullet, this.player, SantaGame.ENEMY_BULLET_VELOCITY
				);

				enemy.nextShotAt = this.time.now + SantaGame.SHOOTER_SHOT_DELAY;
				this.enemyFireSFX.play();
			}
		}, this);

	    if(this.bossApproaching === false && this.boss.alive && this.boss.nextShotAt < this.time.now && this.enemyBulletPool.countDead() >= 10){

	        this.boss.nextShotAt = this.time.now + SantaGame.BOSS_SHOT_DELAY;
	        this.enemyFireSFX.play();

	        for(var i = 0; i < 5; i++){

		        //process 2 bullets at a time
		        var topBullet = this.enemyBulletPool.getFirstExists(false);

		       	topBullet.reset(

		        	this.boss.x + i * 10, this.boss.y + 10
	        	);

		        var bottomBullet = this.enemyBulletPool.getFirstExists(false);

		        bottomBullet.reset(

		        	this.boss.x - i * 10, this.boss.y - i * 10
	        	);

		       	if(this.boss.health > SantaGame.BOSS_HEALTH / 2){

		       		this.boss.body.velocity.x = 0;
		       		this.boss.body.velocity.y = SantaGame.BOSS_Y_VELOCITY;

			        // aim directly at the player
			        this.physics.arcade.moveToObject(

			            topBullet, this.player, SantaGame.ENEMY_BULLET_VELOCITY
			        );

			        this.physics.arcade.moveToObject(

			        	bottomBullet, this.player, SantaGame.ENEMY_BULLET_VELOCITY
			        );

		        } /*
		        else if()this.boss.health > SantaGame.BOSS_HEALTH / 4{

		        }*/
		        else{

		            // aim slightly off center of the player
		            this.physics.arcade.moveToXY(

		              	topBullet, this.player.x, this.player.y - i * 100, SantaGame.ENEMY_BULLET_VELOCITY
		            );

		            this.physics.arcade.moveToXY(

		              	bottomBullet, this.player.x, this.player.y + i * 100, SantaGame.ENEMY_BULLET_VELOCITY
		            );
		        }
	      	}
	    }
	},

	processPlayerInput: function(){

		//Player velocity init
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;

		//Keyboard controls arrow
		if(this.cursors.left.isDown){

			this.player.body.velocity.x = -this.player.speed;
		}
		else if(this.cursors.right.isDown){
			
			this.player.body.velocity.x = this.player.speed;
		}

		if(this.cursors.up.isDown){

			this.player.body.velocity.y = -this.player.speed;
		}
		else if(this.cursors.down.isDown){
			
			this.player.body.velocity.y = this.player.speed;
		}

		//Mouse & Touch movement		
	    if(this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 15){

	      this.physics.arcade.moveToPointer(this.player, this.player.speed);
	    }

    	if(this.returnText && this.returnText.exists){

		    if(this.input.keyboard.isDown(Phaser.Keyboard.Q) ){

	    		this.quitGame();
	    	}
		    else if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.activePointer.isDown){
	    	
	    		this.restartGame();
	    	}
	    }

	    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.activePointer.isDown){

    		this.fire();
	    }
	},

	processDelayedEffects: function(){

	    if(this.instructions.exists && this.time.now > this.instExpire){

	    	this.instructions.destroy();
	    }

	    else if(this.ghostUntil && this.ghostUntil < this.time.now){

	    	this.ghostUntil = null;
	    	this.player.play('fly');
	    }

	    else if(this.showReturn && this.time.now > this.showReturn){

	    	this.returnText = this.add.text(

	    		this.game.width / 2, this.game.height / 2 + 100,
	    		'Appuyez sur la touche Q pour revenir au menu principal \n' +
	    		'Appuyez sur ESPACE pour recommencez', 
	    		{ font: ' 16px sans-serif', fill: '#fff', align: 'center'} 
    		);

    		this.returnText.anchor.setTo(0.5, 0.5);
    		this.showReturn = false;
	    }

	    else if(this.bossApproaching && this.boss.x > 1200){

	    	this.bossApproaching = false;
	    	this.boss.nextShotAt = 0;

	    	this.physics.enable(this.boss, Phaser.Physics.ARCADE);

	    	this.boss.body.velocity.y = 0;
	    	this.boss.body.velocity.x = SantaGame.BOSS_X_VELOCITY; 

	    	this.boss.body.bounce.y = 0;
	    	this.boss.body.bounce.x = 1;
	    	this.boss.body.collideWorldBounds = true;
	    }
	},

	enemyHit: function(bullet, enemy){

		bullet.kill();											//Kill bullet (display off)
		this.damageEnemy(enemy, SantaGame.BULLET_DAMAGE);
	},

	playerHit: function(player, enemy){

		if(this.ghostUntil && this.ghostUntil > this.time.now){	//check if this.ghostUntil is !undefined or null

		      return;
	    }

	    this.playerExplosionSFX.play();
		this.damageEnemy(enemy, SantaGame.CRASH_DAMAGE);

		var life = this.lives.getFirstAlive();

		if(life !== null){

			life.kill();
			this.weaponLevel = 0;
			this.ghostUntil = this.time.now + SantaGame.PLAYER_GHOST_TIME;
			this.player.play('ghost');
		}
		else{

			this.explode(player);
			player.kill();
			this.displayEnd(false);
		}
	},

	giftHit: function(player, gift){

		gift.kill();
		this.addToScore(gift.reward);
	},

	damageEnemy: function(enemy, damage){

		enemy.damage(damage);

		if(enemy.alive){

			enemy.play('hit');
			//console.log(this.boss.health);
		}
		else{

			this.explode(enemy);
			this.explosionSFX.play();
			this.spawnPowerUp(enemy);
			this.addToScore(enemy.reward);

			//check if sprite is boss
			if(enemy.key === 'boss'){

				this.enemyPool.destroy();
				this.shooterPool.destroy();
				this.bossPool.destroy();
				this.giftPool.destroy();
				this.enemyBulletPool.destroy();
				this.displayEnd(true);
			}
		}
	},

	addToScore: function(score){

		this.score += score;
		this.scoreText.text = this.score;

		if(this.score >= 0 && this.score < 2000){

			SantaGame.SPAWN_ENEMY_DELAY = Phaser.Timer.SECOND;
		}
		else if(this.score >= 2000 && this.score < 5000){

			SantaGame.SPAWN_ENEMY_DELAY = Phaser.Timer.SECOND * 0.8;
			SantaGame.SPAWN_SHOOTER_DELAY = Phaser.Timer.SECOND * 3;
		}
		else if(this.score > 5000 && this.score < 10000){

			SantaGame.SPAWN_ENEMY_DELAY =  Phaser.Timer.SECOND * 0.6;
			SantaGame.SPAWN_SHOOTER_DELAY = Phaser.Timer.SECOND * 2.5;
		}
		else if(this.score > 10000 && this.score < 17500){

			SantaGame.SPAWN_ENEMY_DELAY = Phaser.Timer.SECOND * 0.5;
			SantaGame.SPAWN_SHOOTER_DELAY = Phaser.Timer.SECOND * 2;
		}
		else if(this.score > 17500 && this.score < 25000){

			SantaGame.SPAWN_ENEMY_DELAY = Phaser.Timer.SECOND * 0.3;
			SantaGame.SPAWN_SHOOTER_DELAY = Phaser.Timer.SECOND * 1.5;
		}
		//prevent boss spawn again upon winning
		else if(this.score >= 25000 && this.bossPool.countDead() == 1){

			SantaGame.SPAWN_ENEMY_DELAY = Phaser.Timer.SECOND * 0.7;
			this.spawnBoss();
		}
	},

	playerPowerUp: function(player, powerUp){

		this.addToScore(powerUp.reward);
		powerUp.kill();
		this.powerUpSFX.play();

		if(this.weaponLevel < 3){

			this.weaponLevel++;
		}
	},

	displayEnd: function(win){

		if(this.endText && this.endText.exists){

			return;
		}

		//Win or Lose
		var msg = win ? 'Vous avez gagné !' : 'Vous avez perdu !';

		this.endText = this.add.text(

			this.game.width / 2, this.game.height / 2 - 150, msg, 
			{ font: '80px serif', fill: '#fff'}
		);

		this.endText.anchor.setTo(0.5, 0);

		//Final score
		this.finalScoreText = this.add.text(

			this.game.width / 2, this.game.height / 2 - 35, 'Votre score : ' + this.score + ' PTS', 
			{ font: '24px Open Sans', fill: '#ffa300'}
		);

		this.finalScoreText.anchor.setTo(0.5, 0);

		//Highscore
		this.saveHighscore();

		this.bestScoreText = this.add.text(

			this.game.width / 2, this.game.height / 2 + 20, 'Meilleur score : ' + this.highscore + 'PTS', 
			{ font: '30px Open Sans',  fill: '#ffa300'}
		);

		this.bestScoreText.anchor.setTo(0.5, 0);

		this.showReturn = this.time.now + SantaGame.RETURN_MESSAGE_DELAY;
	},

	explode: function(sprite){

		if(this.explosionPool.countDead === 0){

			return;
		}

		var explosion = this.explosionPool.getFirstExists(false);

		explosion.reset(sprite.x, sprite.y);
		explosion.play('boom', 15, false, true);				//15 fps, false dont loop anim, true kill sprite at anim end
		explosion.body.velocity.x = sprite.body.velocity.x;
		explosion.body.velocity.y = sprite.body.velocity.y;
	},

	spawnPowerUp: function(enemy){

		if(this.powerUpPool.countDead() === 0 || this.weaponLevel === 3){

			return;
		}

		if(this.rnd.frac() < enemy.dropRate){

			var powerUp = this.powerUpPool.getFirstExists(false);

			powerUp.reset(enemy.x, enemy.y);
			powerUp.body.velocity.x = SantaGame.POWERUP_VELOCITY;
		}
	},
	
	spawnBoss: function(){

		
		this.bossApproaching = true;

		this.boss.reset( 

			this.game.width, this.game.height * 0.5, SantaGame.BOSS_HEALTH
		);

		this.physics.enable(this.boss, Phaser.Physics.ARCADE);

		this.boss.body.velocity.x = SantaGame.BOSS_X_VELOCITY;
		this.boss.body.velocity.y = 0;

		this.boss.play('fly');
	},	    	

	fire: function(){

		if(!this.player.alive || this.nextShotAt > this.time.now){

			return;
		}

		this.nextShotAt = this.time.now + this.shotDelay;
		this.playerFireSFX.play();

	    var bullet;

	    if(this.weaponLevel === 0) {

		    if(this.bulletPool.countDead() === 0){

		        return;
	    	}

	      	bullet = this.bulletPool.getFirstExists(false);
	      	bullet.reset(this.player.x + 20, this.player.y);
	      	bullet.body.velocity.x = SantaGame.BULLET_VELOCITY;
	    } 
	    else{

	      	if(this.bulletPool.countDead() < this.weaponLevel * 2){

	        	return;
	    	}

		    for(var i = 0; i < this.weaponLevel; i++){

		        bullet = this.bulletPool.getFirstExists(false);

		        bullet.reset(

		        	this.player.x, this.player.y - 20	//spawn left bullet slightly left off center
	        	);

		        this.physics.arcade.velocityFromAngle(

		          -5 - i * 10, SantaGame.BULLET_VELOCITY, bullet.body.velocity //the left bullets spread from -95 degrees to -135 degrees
		        );

		        bullet = this.bulletPool.getFirstExists(false);
		        bullet.reset(
 
		        	this.player.x, this.player.y + 20	//spawn right bullet slightly right off center
	        	);

		        this.physics.arcade.velocityFromAngle(

		          5 - i * 10, SantaGame.BULLET_VELOCITY, bullet.body.velocity  //the right bullets spread from -85 degrees to -45
		   	    );
		    }
	    }
	},

	assetsDestroy: function(){

		//Destroy all no longer needed
		this.sky.destroy();
		this.mountain.destroy();
		this.mountain2.destroy();
		this.mountain3.destroy();
		this.forest.destroy();

		this.snowEmmitter.destroy();

	    this.player.destroy();

	    this.enemyPool.destroy();
	    this.explosionPool.destroy();
	    this.shooterPool.destroy();

	    this.bulletPool.destroy();
	    this.enemyBulletPool.destroy();
	    this.powerUpPool.destroy();
	    this.giftPool.destroy();

	    this.bossPool.destroy();

	    this.instructions.destroy();
	    this.scoreText.destroy();
	    this.endText.destroy();
	    this.returnText.destroy();
	}, 

	quitGame: function(pointer){
	
		this.assetsDestroy();
		
	    //Go back to main menu
	    this.state.start('MainMenu');
	},

	restartGame: function(pointer){

		this.assetsDestroy();
	
	    //Go back to main menu
	    this.state.start('Game');
	},

	getHighscore: function(){

		this.highscore = localStorage.getItem('AngrySanta.highScore');

		if(this.highscore === null){	

			localStorage.setItem('AngrySanta.highScore', 0);
			this.highscore = 0;
		}
	},

	saveHighscore: function(){

		this.getHighscore();

		if(this.highscore < this.score){

			this.highscore = this.score;
			localStorage.setItem('AngrySanta.highScore', this.highscore);
		}
		else{

			return this.highscore;
		}
	},

	updateWindDirection: function(){

		this.interval = 4 * 60;

		var  i = 0;
		i++;

		if( i === this.interval){

			this.changeWindDirection();

			this.interval = Math.floor(Math.random() * 20) * 60; //0-20s at 60fps

			i = 0;
		}
	},

	changeWindDirection: function(){

		var max = 0;

		var multi = Math.floor((max + 200) / 4),
			frag = (Math.floor(Math.random() * 100) - multi);

		this.max = max + frag;

		if(this.max > 200){

			this.max = -50;
		}

		else if(this.max < -200){

			this.max = -250;
		}

		this.setXSpeed(this.snowEmmitter, this.max);
	},

	setXSpeed: function(emitter, max){

		emitter.setXSpeed(-max - 20, max);
		emitter.forEachAlive(this.setParticleXSpeed, this, max);
	},

	setParticleXSpeed: function(particle, max){

		particle.body.velocity.x = -max - Math.floor(Math.random() * 30);
	}
};