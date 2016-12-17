//The actual game.
BasicGame.Game = function(game){};

BasicGame.Game.prototype = {

	create: function(){

		this.setupBackground();
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
    	this.enemyFire();
    	this.processPlayerInput();
    	this.processDelayedEffects();
	},

	render: function(){

		//this.game.debug.body(this.bullet);
		//this.game.debug.body(this.enemy);
		//this.game.debug.body(this.player);
	},


	/****
	FUNCTIONS
	****/

	//Create() functions

	setupAudio: function(){

		this.sound.volume = 0.3;

		this.explosionSFX = this.add.audio('explosion');
		this.playerExplosionSFX = this.add.audio('playerExplosion');
	    this.enemyFireSFX = this.add.audio('enemyFire');
	    this.playerFireSFX = this.add.audio('playerFire');
	    this.powerUpSFX = this.add.audio('powerUp');
	},

	setupBackground: function(){

		//Background layers
		this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');
		this.sea.autoScroll(-120, BasicGame.SEA_SCROLL_SPEED);
	},

	setupPlayer: function(){

		//Player
		this.player = this.add.sprite(this.game.width / 10, this.game.height / 2, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.animations.add('fly', [0, 1, 2], 20, true);
		this.player.animations.add('ghost', [3, 0, 3, 1], 20, true);
		this.player.play('fly');
		this.player.angle = 90;
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.speed = BasicGame.PLAYER_SPEED;
		this.player.body.collideWorldBounds = true;
		this.player.body.setSize(20, 20, 28, 22); //20 x 20px hitbox, centered  hight than the center
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
		this.enemyPool.setAll('angle', 90);
		this.enemyPool.setAll('outOfBoundsKill', true);		
		this.enemyPool.setAll("checkWorldBounds", true);
		this.enemyPool.setAll(

			'reward', BasicGame.ENEMY_REWARD, false, false, 0, true
		);

		this.enemyPool.setAll(

			'dropRate', BasicGame.ENEMY_DROP_RATE, false, false, 0, true  //20% chance of droping powerup
		);

		this.enemyPool.forEach(function(enemy){

			enemy.animations.add('fly', [0, 1, 2], 20, true);		//Set anim for each sprite
			enemy.animations.add('hit', [3, 1, 3, 2], 20, false);
			enemy.events.onAnimationComplete.add(function(e){

				e.play('fly');
			}, this);
		});

		this.nextEnemyAt = 0;									
		this.enemyDelay = BasicGame.SPAWN_ENEMY_DELAY;

		//Enemy 2nd type
		this.shooterPool = this.add.group();
		this.shooterPool.enableBody = true;
		this.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.shooterPool.createMultiple(20, 'whiteEnemy');
		this.shooterPool.setAll('anchor.x', 0.5);				
		this.shooterPool.setAll('anchor.y', 0.5);
		this.shooterPool.setAll('angle', 90);
		this.shooterPool.setAll('outOfBoundsKill', true);		
		this.shooterPool.setAll("checkWorldBounds", true);
		this.shooterPool.setAll(

			'reward', BasicGame.SHOOTER_REWARD, false, false, 0, true
		);

		this.shooterPool.setAll(

			'dropRate', BasicGame.SHOOTER_DROP_RATE, false, false, 0, true //30% chance of droping powerup
		);

		this.shooterPool.forEach(function(enemy){

			enemy.animations.add('fly', [0, 1, 2], 20, true);
			enemy.animations.add('hit', [3, 1 ,3, 2], 20, false);
			enemy.events.onAnimationComplete.add(function(e){

				e.play('fly');
			}, this);
		});

		this.nextShooterAt = this.time.now + Phaser.Timer.SECOND * 5;
		this.shooterDelay = BasicGame.SPAWN_SHOOTER_DELAY;

		//Destroyer enemy
		this.destroyerPool = this.add.group();
		this.destroyerPool.enableBody = true;
		this.destroyerPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.destroyerPool.createMultiple(50, 'destroyerEnemy');
		this.destroyerPool.setAll('anchor.x', 0.5);				
		this.destroyerPool.setAll('anchor.y', 0.5);
		this.destroyerPool.setAll('scale.x', 0.5);				
		this.destroyerPool.setAll('scale.y', 0.5);
		this.destroyerPool.setAll('angle', 90);
		this.destroyerPool.setAll('outOfBoundsKill', true);		
		this.destroyerPool.setAll("checkWorldBounds", true);
		this.destroyerPool.setAll(

			'reward', BasicGame.ENEMY_REWARD, false, false, 0, true
		);

		this.destroyerPool.setAll(

			'dropRate', BasicGame.ENEMY_DROP_RATE, false, false, 0, true  //20% chance of droping powerup
		);

		this.destroyerPool.forEach(function(enemy){

			enemy.animations.add('fly', [0, 1], 20, true);		//Set anim for each sprite
			enemy.animations.add('hit', [2, 1, 2, 0], 20, false);
			enemy.events.onAnimationComplete.add(function(e){

				e.play('fly');
			}, this);
		});

		this.nextDestroyerAt = 0;									
		this.destroyerDelay = BasicGame.SPAWN_ENEMY_DELAY * 7;

		//Boss
		this.bossPool = this.add.group();
		this.bossPool.enableBody = true;
		this.bossPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.bossPool.createMultiple(1, 'boss');
		this.bossPool.setAll('anchor.x', 0.5);				
		this.bossPool.setAll('anchor.y', 0.5);
		this.bossPool.setAll('angle', 90);
		this.bossPool.setAll('outOfBoundsKill', true);		
		this.bossPool.setAll("checkWorldBounds", true);
		this.bossPool.setAll(

			'reward', BasicGame.BOSS_REWARD, false, false, 0, true
		);

		this.bossPool.setAll(

			'dropRate', BasicGame.BOSS_DROP_RATE, false, false, 0 , true
		);

		this.bossPool.forEach(function(enemy){

			enemy.animations.add('fly', [0, 1, 2], 20, true);
			enemy.animations.add('hit', [3, 1, 3, 2], 20, false);
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
		this.giftPool.createMultiple(30, 'gift');
		this.giftPool.setAll('anchor.x', 0.5);
		this.giftPool.setAll('anchor.y', 0.5);
		this.giftPool.setAll('scale.x', 0.95);
		this.giftPool.setAll('scale.y', 0.95);
		this.giftPool.setAll('angle', 90);
		this.giftPool.setAll('outOfBoundsKill', true);		
		this.giftPool.setAll("checkWorldBounds", true);
		this.giftPool.setAll(

			'reward', BasicGame.GIFT_REWARD, false, false, 0, true
		);

		/*this.giftPool.forEach(function(gift){

			gift.animations.add('fly', [0, 1], 20, true);
			gift.animations.add('hit', [2, 1, 2, 0], 20, false);
			gift.events.onAnimationComplete.add(function(e){

				e.play('fly');
			}, this);
		});*/

		this.nextGiftAt = this.time.now + Phaser.Timer.SECOND * 5;
		this.giftDelay = BasicGame.SPAWN_GIFT_DELAY;
	},

	setupBullets: function(){

		//EnemyBullet
		this.enemyBulletPool = this.add.group();
		this.enemyBulletPool.enableBody = true;
		this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;//Add physics to the whole group
		this.enemyBulletPool.createMultiple(100, 'enemyBullet');			//Add 100 bullet sprite in group
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
		this.bulletPool.createMultiple(100, 'bullet');			//Add 100 bullet sprite in group
		this.bulletPool.setAll('anchor.x', 0.5);				//Set anchor of all sprites
		this.bulletPool.setAll('anchor.y', 0.5);
		this.bulletPool.setAll('outOfBoundsKill', true);		//Automatically kill bullet sprite when out of bounds
		this.bulletPool.setAll("checkWorldBounds", true);
		this.netShotAt = 0;
		this.shotDelay = BasicGame.SHOT_DELAY;
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

	    	'reward', BasicGame.POWERUP_REWARD, false, false, 0, true
    	);

		//Life icons
		this.lives = this.add.group();

		var firstLifeIconX = this.game.width - 10 - (BasicGame.PLAYER_EXTRA_LIVES * 30); //calculate location of 1st life icon

		for(var i = 0; i < BasicGame.PLAYER_EXTRA_LIVES; i++){

			var life = this.lives.create(firstLifeIconX + (30 * i), 30, 'player');

			life.scale.setTo(0.5, 0.5);
			life.anchor.setTo(0.5, 0.5);
		}
	},

	setupText: function(){

		//Message
		this.instructions = this.add.text(						//Add text
		   			
   			this.game.width / 2,
   			this.game.height - 100,
			'Utiliser les flèches du clavier pour bouger, barre espace pour tirer \n' + 
			'Mobile : Toucher / cliquer pour bouger et tirer',
			{font: '2em Monospace', fill: '#fff', align: 'center'}	//Style text		
		);
		this.instructions.anchor.setTo(0.5, 0.5);
		this.instExpire = this.time.now +  BasicGame.INSTRUCTION_EXPIRE;				//Text expire

		//Score
		this.score = 0;
		this.scoreText = this.add.text(

			this.game.width / 2, 30, '' + this.score,
			{ font: '20px Monospace', fill: '#fff', align: 'center'}
		);
		this.scoreText.anchor.setTo(0.5,  0.5);
	},


	//update() functions

	checkCollisions: function(){

	 	//Enemy death
	    this.physics.arcade.overlap(
	      this.bulletPool, this.enemyPool, this.enemyHit, null, this
	    );

	    this.physics.arcade.overlap(
	      this.bulletPool, this.shooterPool, this.enemyHit, null, this
	    );

	    this.physics.arcade.overlap(
	      this.bulletPool, this.destroyerPool, this.enemyHit, null, this
	    );

	    //Player death
	    this.physics.arcade.overlap(
	      this.player, this.enemyPool, this.playerHit, null, this
	    );

	    this.physics.arcade.overlap(
	      this.player, this.shooterPool, this.playerHit, null, this
	    );

	    this.physics.arcade.overlap(
	      this.player, this.destroyerPool, this.playerHit, null, this
	    );

	    this.physics.arcade.overlap(
	      this.player, this.giftPool, this.giftHit, null, this
	    );

	    this.physics.arcade.overlap(
	      this.player, this.enemyBulletPool, this.playerHit, null, this
	    );

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

				1400, (this.rnd.integerInRange(20, this.game.height - 20) ), BasicGame.ENEMY_HEALTH 
			);	//Spawn at random location

			enemy.body.velocity.x = this.rnd.integerInRange( BasicGame.ENEMY_MIN_X_VELOCITY, BasicGame.ENEMY_MAX_X_VELOCITY);
			enemy.play('fly');
		}

		//=>TYPE 2
		if(this.nextShooterAt < this.time.now && this.shooterPool.countDead() > 0){

			this.nextShooterAt = this.time.now + this.shooterDelay;

			var shooter = this.shooterPool.getFirstExists(false);

			shooter.reset(
				
				1400, (this.rnd.integerInRange(60, this.game.height - 60) ), BasicGame.SHOOTER_HEALTH	//Spawn at random location
			);
			
			//Random target location
			var target = this.rnd.integerInRange(20, this.game.height - 20),
				targetX = this.game.width;

			//Move to target and rotate the sprite
			shooter.rotation = this.physics.arcade.moveToXY(

				shooter, -targetX, target, this.rnd.integerInRange(BasicGame.SHOOTER_MIN_VELOCITY, BasicGame.SHOOTER_MAX_VELOCITY)
			) - Math.PI / 2;

			shooter.play('fly');

			//Shot timer for each shooter
			shooter.nextShotAt = 0;
		}

		//=>TYPE 3
		if(this.nextDestroyerAt < this.time.now && this.destroyerPool.countDead() > 0){

			this.nextDestroyerAt = this.time.now + this.destroyerDelay;

			var destroyer = this.destroyerPool.getFirstExists(false);

			destroyer.reset(

				1400, (this.rnd.integerInRange(20, this.game.height - 20) ), BasicGame.DESTROYER_HEALTH 
			);	//Spawn at random location

			destroyer.body.velocity.x = this.rnd.integerInRange( BasicGame.DESTROYER_MIN_VELOCITY, BasicGame.DESTROYER_MAX_VELOCITY);
			destroyer.play('fly');

			destroyer.nextShotAt = 0;
		}
	},

	spawnGift: function(){

		//Random gift spawn =>TYPE 1
		if(this.nextGiftAt < this.time.now && this.giftPool.countDead() > 0){

			var startY = this.rnd.integerInRange(100, this.game.height - 100),
				startX = this.rnd.integerInRange(100, this.game.width - 100),
				spread = 60,
				frequency = 70,
				verticalSpacing = 70,
				horizontalSpacing = 100,
				enemyInWaves = 3;

			for(var i = 0; i < enemyInWaves; i++){

				var gift = this.giftPool.getFirstExists(false);

				if(gift){

					gift.startY = startY;
					gift.startX = startX;

					gift.reset(

						this.game.width + (-horizontalSpacing * i),  startY 
					);

					gift.body.velocity.x = BasicGame.GIFT_MAX_VELOCITY;
					gift.play('fly');

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

					bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY
				);

				enemy.nextShotAt = this.time.now + BasicGame.SHOOTER_SHOT_DELAY;
				this.enemyFireSFX.play();
			}
		}, this);

		this.destroyerPool.forEachAlive(function(enemy){

			if(this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0){

				var bullet = this.enemyBulletPool.getFirstExists(false);

				bullet.reset(enemy.x, enemy.y);
				this.physics.arcade.moveToObject(

					bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY
				);

				enemy.nextShotAt = this.time.now + BasicGame.DESTROYER_SHOT_DELAY;
				this.enemyFireSFX.play();
			}
		}, this);

	    if(this.bossApproaching === false && this.boss.alive && this.boss.nextShotAt < this.time.now && this.enemyBulletPool.countDead() >= 10){

	        this.boss.nextShotAt = this.time.now + BasicGame.BOSS_SHOT_DELAY;
	        this.enemyFireSFX.play();

	        for(var i = 0; i < 5; i++){

		        //process 2 bullets at a time
		        var leftBullet = this.enemyBulletPool.getFirstExists(false);

		        leftBullet.reset(

		        	this.boss.x, this.boss.y + 20
	        	);

		        var rightBullet = this.enemyBulletPool.getFirstExists(false);

		        rightBullet.reset(

		        	this.boss.x, this.boss.y - 20
	        	);

		       	if(this.boss.health > BasicGame.BOSS_HEALTH / 2){

		          // aim directly at the player
		          this.physics.arcade.moveToObject(

		            leftBullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY
		          );

		          this.physics.arcade.moveToObject(

		            rightBullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY
		          );

		        } 
		        else{

		            // aim slightly off center of the player
		            this.physics.arcade.moveToXY(

		              leftBullet, this.player.x -  i * 100, this.player.y,
		              BasicGame.ENEMY_BULLET_VELOCITY
		            );

		            this.physics.arcade.moveToXY(

		              rightBullet, this.player.x + i * 100, this.player.y,
		              BasicGame.ENEMY_BULLET_VELOCITY
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

	    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.activePointer.isDown){

	    	if(this.returnText && this.returnText.exists){

	    		this.quitGame();
	    	}
	    	else{

	    		this.fire();
	    	}
	    }
	},

	processDelayedEffects: function(){

	    if(this.instructions.exists && this.time.now > this.instExpire){

	    	this.instructions.destroy();
	    }

	    if(this.ghostUntil && this.ghostUntil < this.time.now){

	    	this.ghostUntil = null;
	    	this.player.play('fly');
	    }

	    if(this.showReturn && this.time.now > this.showReturn){

	    	this.returnText = this.add.text(

	    		this.game.width / 2, this.game.height / 2 + 100,
	    		'Appuyez sur la barre ESPACE pour revenir au menu principal', 
	    		{ font: ' 16px sans-serif', fill: '#fff'} 
    		);

    		this.returnText.anchor.setTo(0.5, 0.5);
    		this.showReturn = false;
	    }

	    if(this.bossApproaching && this.boss.x > 80){

	    	this.bossApproaching = false;
	    	console.log(0);
	    	this.boss.nextShotAt = 0;
	    	console.log(1);

	    	this.boss.body.velocity.y = this.rnd.integerInRange(-BasicGame.BOSS_Y_VELOCITY, BasicGame.BOSS_Y_VELOCITY);
	    	console.log(2);
	    	this.boss.body.velocity.x = 0; 
	    	console.log(3);

	    	this.boss.body.bounce.x = 1;
	    	this.boss.body.bounce.y = 1;
	    	console.log(4);
	    	this.boss.body.collideWorldBounds = true;
	    }
	},

	enemyHit: function(bullet, enemy){

		bullet.kill();											//Kill bullet (display off)

		if(this.weaponLevel >= 2 && this.weaponLevel < 4){

			this.damageEnemy(enemy, BasicGame.BULLET_DAMAGE_UP);
			console.log(BasicGame.BULLET_DAMAGE_UP);
		}
		else if(this.weaponLevel > 4){

			this.damageEnemy(enemy, BasicGame.BULLET_DAMAGE_UP_2);
			console.log(BasicGame.BULLET_DAMAGE_UP_2);
		}
		else{
			
			this.damageEnemy(enemy, BasicGame.BULLET_DAMAGE);
		}
	},

	playerHit: function(player, enemy){
		if(this.ghostUntil && this.ghostUntil > this.time.now){	//check if this.ghostUntil is !undefined or null

		      return;
	    }

	    this.playerExplosionSFX.play();
		this.damageEnemy(enemy, BasicGame.CRASH_DAMAGE);

		var life = this.lives.getFirstAlive();

		if(life !== null){

			life.kill();
			this.weaponLevel = 0;
			this.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;
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
				this.enemyBulletPool.destroy();
				this.displayEnd(true);
			}
		}
	},

	addToScore: function(score){

		this.score += score;
		this.scoreText.text = this.score;

		//prevent boss spawn again upon winning
		if(this.score >= 10000 && this.bossPool.countDead() == 1){

			this.spawnBoss();
		}
	},

	playerPowerUp: function(player, powerUp){

		this.addToScore(powerUp.reward);
		powerUp.kill();
		this.powerUpSFX.play();

		if(this.weaponLevel < 5){

			this.weaponLevel++;
		}
	},

	displayEnd: function(win){

		if(this.endText && this.endText.exists){

			return;
		}

		var msg = win ? 'Vous avez gagné !' : 'Vous avez perdu !';

		this.endText = this.add.text(

			this.game.width / 2, this.game.height / 2 - 100, msg, 
			{ font: '80px serif', fill: '#fff'}
		);

		this.endText.anchor.setTo(0.5, 0);


		this.finalScoreText = this.add.text(

			this.game.width / 2, this.game.height / 2 + 10, this.score + ' PTS', 
			{ font: '30px Monospace', fill: '#ffa300'}
		);

		this.finalScoreText.anchor.setTo(0.5, 0);


		this.showReturn = this.time.now + BasicGame.RETURN_MESSAGE_DELAY;
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

		if(this.powerUpPool.countDead() === 0 || this.weaponLevel === 5){

			return;
		}

		if(this.rnd.frac() < enemy.dropRate){

			var powerUp = this.powerUpPool.getFirstExists(false);

			powerUp.reset(enemy.x, enemy.y);
			powerUp.body.velocity.x = BasicGame.POWERUP_VELOCITY;
		}
	},
	
	spawnBoss: function(){

		
		this.bossApproaching = true;
			    	console.log(5);

		this.boss.reset( this.game.width, this.game.height / 2, BasicGame.BOSS_HEALTH);
			    	console.log(6);

		this.physics.enable(this.boss, Phaser.Physics.ARCADE);
			    	console.log(7);

		//this.boss.body.velocity.y = BasicGame.BOSS_Y_VELOCITY;
			    	//console.log(8);

		this.boss.body.velocity.x = BasicGame.BOSS_X_VELOCITY;
			    	console.log("8bis");

		this.boss.play('fly');
			    	console.log(9);
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
	      	bullet.body.velocity.x = BasicGame.BULLET_VELOCITY;
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

		          5 - i * 10, BasicGame.BULLET_VELOCITY, bullet.body.velocity //the left bullets spread from -95 degrees to -135 degrees
		        );

		        bullet = this.bulletPool.getFirstExists(false);
		        bullet.reset(
 
		        	this.player.x, this.player.y + 20	//spawn right bullet slightly right off center
	        	);

		        this.physics.arcade.velocityFromAngle(

		          -5 + i * 10, BasicGame.BULLET_VELOCITY, bullet.body.velocity  //the right bullets spread from -85 degrees to -45
		   	    );
		    }
	    }
	},

	quitGame: function(pointer){

		//Destroy all no longer needed
		this.sea.destroy();
	    this.player.destroy();
	    this.enemyPool.destroy();
	    this.bulletPool.destroy();
	    this.explosionPool.destroy();
	    this.shooterPool.destroy();
	    this.enemyBulletPool.destroy();
	    this.powerUpPool.destroy();
	    this.bossPool.destroy();
	    this.instructions.destroy();
	    this.scoreText.destroy();
	    this.endText.destroy();
	    this.returnText.destroy();
	
	    //Go back to main menu
	    this.state.start('MainMenu');
	}
};
