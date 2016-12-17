//The actual game.

//Variables
var BasicGame = {};


BasicGame.Game = function(game) {};

BasicGame.Game.prototype = {

	preload: function(){

		this.load.image('sea', '/assets/layers/sea.png');
		this.load.image('bullet', '/assets/bullet/bullet.png');
		this.load.spritesheet('greenEnemy', '/assets/enemy/enemy.png', 32, 32);
		this.load.spritesheet('explosion', '/assets/object/explosion.png', 32, 32);
		this.load.spritesheet('player', '/assets/player/player.png', 64, 64);
	},

	create: function(){

		//Layers
		this.sea = this.add.tileSprite(0, 0, 1400, 840, 'sea');

		//Player
		this.player = this.add.sprite(200, 300, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.animations.add('fly', [0, 1, 2], 20, true);
		this.player.play('fly');
		this.player.angle = 90;
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.speed = 300;
		this.player.body.collideWorldBounds = true;
		this.player.body.setSize(20, 20, 28, 22); //20 x 20px hitbox, centered  hight than the center

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
		this.enemyPool.forEach(function(enemy){

			enemy.animations.add('fly', [0, 1, 2], 20, true);	//Set anim for each sprite
		});

		this.nextEnemyAt = 0;									
		this.enemyDelay = 1000;

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
		this.shotDelay = 100;

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

		//Keyboard controls
		this.cursors = this.input.keyboard.createCursorKeys();	//Add controls

		//Message
		this.instructions = this.add.text(600, 700,    			//Add text
			'Utiliser les flèches du clavier pour bouger, barre espace pour tirer \n' + 
			'Mobile : Toucher / cliquer pour bouger et tirer',
			{font: '2em Monospace', fill: '#fff', align: 'center'}	//Style text		
		);
		this.instructions.anchor.setTo(0.5, 0.5);
		this.instExpire = this.time.now + 10000;				//Text expire
	},

	update: function(){

		this.sea.tilePosition.x -= 0.2;							//Move background sea on x axis
		
		this.physics.arcade.overlap(
			this.bulletPool, this.enemyPool, this.enemyHit, null, this	//Enable collision when bullet hit enemy
		);

		//Player death
		this.physics.arcade.overlap(
			this.player, this.enemyPool, this.playerHit, null, this
		);

		//Random enemy spawn
		if(this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0){

			this.nextEnemyAt = this.time.now + this.enemyDelay;

			var enemy = this.enemyPool.getFirstExists(false);

			enemy.reset(1400, (this.rnd.integerInRange(20, 820) ));	//Spawn at random location
			enemy.body.velocity.x = this.rnd.integerInRange(-30, -120);
			enemy.play('fly');
		}

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

	    	this.fire();
	    }

	    if(this.instructions.exists && this.time.now > this.instExpire){

	    	this.instructions.destroy();
	    }
	},

	render: function(){

		//this.game.debug.body(this.bullet);
		//this.game.debug.body(this.enemy);
		//this.game.debug.body(this.player);
	},

	enemyHit: function(bullet, enemy){

		bullet.kill();											//Kill bullet (display off)
		this.explode(enemy);
		enemy.kill();

	},

	playerHit: function(player, enemy){

		this.explode(enemy);
		enemy.kill();

		this.explode(player);
		player.kill();
	},

	fire: function(){

		if(!this.player.alive || this.nextShotAt > this.time.now){

			return;
		}

		if(this.bulletPool.countDead() === 0){

			return;
		}

		this.nextShotAt = this.time.now + this.shotDelay;

		var bullet = this.bulletPool.getFirstExists(false); 	//Find the 1st dead bullet in pool

		bullet.reset(this.player.x + 20, this.player.y); 		//Revive sprite and place it in new location
		bullet.body.velocity.x = 500;
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
	}
};
