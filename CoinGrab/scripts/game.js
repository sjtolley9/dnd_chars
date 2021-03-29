Texture = function(spec){
	let that = {
		imageSrc: spec.src,
		ready: false,
	}

	that.image = new Image();

	that.image.onload = function() {
		that.ready = true;
		console.log(`Loaded ${that.imageSrc}`);
	}

	that.image.src = spec.src;

	that.render = function(c, x,y,w,h) {
		if (that.ready){c.drawImage(that.image, x,y,w,h);}
	}

	return that;
};

TOTAL_COINAGE = 0;
let timer = 0;

IT_GENERIC = 0;
IT_COIN = 1;
IT_BOMB = 2;
IT_2X = 3;
IT_HEART = 4;
IT_STRETCH = 5;
IT_WAND = 6;

ITEM_UID = 0;

let Item = function(spec, type=IT_GENERIC) {
	let that = {
		center: spec.center,
		vel: {x: 0, y:0},
		type: type,
		dim: spec.dim || {w: 20, h:20},
		texture: COIN_TEXTURE,
		timer: 0,
		uuid: ITEM_UID++,
	}

	that.update = function(elapsedTime) {
		that.timer += elapsedTime;
		that.vel.y += 0.02;
		that.center.y += that.vel.y;
		that.center.x += that.vel.x;
		if (that.center.x < that.dim.w/2 || that.center.x > 500-that.dim.w/2) {
			that.center.x = Math.min(500-that.dim.w/2,Math.max(that.center.x,that.dim.w/2))
			that.vel.x *= -1;
		}
	}

	that.applyForce = function(force) {
		that.vel.x += force.x;
		that.vel.y += force.y;
	}

	that.render = function(c) {
		that.texture.render(c, that.center.x-that.dim.w/2, that.center.y-that.dim.h/2,that.dim.w,that.dim.h);
	}

	return that;
}

let Coin = function(spec) {
	let that = Item(spec, IT_COIN)

	that.value = 1+~~(Math.random()*2)*4;
	TOTAL_COINAGE += that.value;
	that.texture = (that.value == 5) ? COIN5_TEXTURE : COIN_TEXTURE;

	that.render = function(c) {
		that.texture.render(c, that.center.x-that.dim.w*Math.cos(0.01*that.timer)/2, that.center.y-that.dim.h/2,that.dim.w*Math.cos(0.01*that.timer),that.dim.h);
	}

	return that;
}

let Bomb = function(spec) {
	spec.dim = {w:40,h:40}
	let that = Item(spec, IT_BOMB);

	that.texture = BOMB_TEXTURE;

	return that;
}

let PU_2X = function(spec) {
	spec.dim = {w:50,h:50};
	let that = Item(spec, IT_2X);

	that.texture = PU_2X_TEXTURE;

	return that;
}

let PU_HEART = function(spec) {
	spec.dim = {w:30,h:30};
	let that = Item(spec, IT_HEART);

	that.texture = HEART_TEXTURE;

	return that;
}

let PU_STRETCH = function(spec) {
	spec.dim = {w:60,h:20};
	let that = Item(spec, IT_STRETCH);

	that.texture = BUCKET_TEXTURE;

	return that;
}

let PU_WAND = function(spec) {
	let that = Item(spec, IT_WAND);
	that.r = 0;
	that.coin = 50;

	that.normalUpdate = that.update;

	that.texture = WAND_TEXTURE;

	that.update = function(elapsedTime) {
		that.normalUpdate(elapsedTime);
		that.r += 0.0025*elapsedTime;

		that.coin -= elapsedTime;
		if (that.coin <= 0) {
			that.coin += 10;
			let coin = Coin({center:{x:that.center.x, y:that.center.y}});
			coin.applyForce({x:Math.sin(that.r)*0.5,y:Math.cos(that.r)*0.5});
			game.coins1.push(coin);
		}
	}

	return that;
}

let BoxGuy = function() {
	let that = {
		center: {x:250,y:450},
		stretch: true,
		stretchTimer: 3000,
	}

	that.collidesWith = function(coin) {
		if (!that.stretch){
			return coin.center.x > that.center.x-75 && coin.center.x < that.center.x+75 &&
				coin.center.y > that.center.y-25 && coin.center.y < that.center.y+25;
		} else {
			return coin.center.x > that.center.x-150 && coin.center.x < that.center.x+150 &&
				coin.center.y > that.center.y-25 && coin.center.y < that.center.y+25;
		}
	}

	that.moveLeft = function(elapsedTime) {
		that.center.x -= 0.5*elapsedTime;
	}

	that.moveRight = function(elapsedTime) {
		that.center.x += 0.5*elapsedTime;
	}

	that.doStretch = function() {
		that.stretchTimer = 3000;
		that.stretch = true;
	}

	that.unStretch = function() {
		let res = that.stretch;
		that.stretch = false;

		return res;
	}

	that.update = function(elapsedTime) {
		if (that.center.x >= 425) {
			that.center.x = 425;
		} else if (that.center.x <= 75) {
			that.center.x = 76;
		}
		/*if (that.stretch) {
			that.stretchTimer -= elapsedTime;
			if (that.stretchTimer <= 0) {
				that.stretch = false;
			}
		}*/
	}

	that.render = function(c) {
		if (!that.stretch)
			BUCKET_TEXTURE.render(c, that.center.x-75,that.center.y-25,150,50);
		else
			BUCKET_TEXTURE.render(c, that.center.x-150,that.center.y-25,300,50);
	}

	return that;
}

let LootTable = function() {
	let that = {
		items: [],
		total: 0,
	}

	that.addItem = function(item, weight) {
		that.items.push({item: item, weight: weight});
		that.total += weight;
	}

	that.getItem = function(spec) {
		let tot = ~~(Math.random()*that.total);
		for (let i = 0; i < that.items.length; i++) {
			let it = that.items[i];
			tot -= it.weight;
			if (tot <= 0) {
				return it.item(spec);
			}
		}
	}

	return that;
}();

LootTable.addItem(PU_2X, 15);
LootTable.addItem(PU_HEART, 1);
LootTable.addItem(PU_STRETCH, 8);
LootTable.addItem(PU_WAND, 8);

let CoinFairy = function(game) {
	let that = {
		center: {x:50,y:50},
		timer: 1500,
		powerUpTimer: 5000,
		game: game,
		wandAngle: 0,
		coins: false,
	}

	that.update = function(elapsedTime) {
		this.wandAngle += 0.0025*elapsedTime;
		that.timer -= elapsedTime;
		that.powerUpTimer -= elapsedTime;
		
		if (that.timer <= 0) {
			that.timer += 1000 + 500*(1+Math.floor(Math.random()*3));
			that.center.x = 100+Math.floor(Math.random()*300);
			that.center.y = 50+Math.floor(Math.random()*10);
		}

		if (that.powerUpTimer <= 0) {
			that.powerUpTimer += 3500 + 100*(Math.floor(Math.random()*5))
			that.powerUpTimer /= 1.5;
			let coin = LootTable.getItem({center:{x:that.center.x-Math.cos(that.wandAngle)*150,
				y:that.center.y-Math.sin(that.wandAngle)*50}});
			coin.applyForce({x:(Math.random()-0.5),y:(Math.random()-0.5)});
			game.coins.push(coin);

			let dirs = [Math.PI/2, Math.PI*5/8, Math.PI*3/8];
			if (Math.random() < 0.25) {
				for (i in dirs) {
					let dir = dirs[i];
					let bomb = Bomb({center: {...this.center}});
					bomb.applyForce({x:Math.cos(dir)*1.5,y:Math.sin(dir)*1.5});
					game.coins.push(bomb);
				}
			}
		}

		that.coins = !that.coins;

		if (that.coins) {
			for (let i = 0; i < 2; i++) {
				let coin = Coin({center:{x:that.center.x+Math.cos(that.wandAngle)*150,
					y:that.center.y+Math.sin(that.wandAngle)*50}});
				coin.applyForce({x:(Math.random()-0.5)*coin.value,y:(Math.random()-0.5)*coin.value});
				game.coins.push(coin);
			}
		}/**/
	}

	that.render = function(c) {
		FAIRY_TEXTURE.render(c, that.center.x-20,that.center.y-20,40,40)
		c.fillStyle = "goldenrod";
		WAND_TEXTURE.render(c, that.center.x+Math.cos(that.wandAngle)*150-15,
			that.center.y+Math.sin(that.wandAngle)*50-15,30,30);
	}

	return that;
}

let PowerupTracker = function() {
	let that = {
		powers: [],
		multiplier: 1,
	};

	that.addPower = function(type) {
		that.powers.push({type:type, timeLeft: 5000});
	}

	that.update = function(elapsedTime) {
		let new_pus = [];
		that.multiplier = 1;
		for (i in that.powers) {
			that.powers[i].timeLeft -= elapsedTime;
			if (that.powers[i].timeLeft > 0) {
				new_pus.push(that.powers[i]);
				if (that.powers[i].type == IT_2X) {
					that.multiplier *= 2;
				}
			}
		}

		that.powers = new_pus;
	}

	that.getMultiplier = function() {
		return that.multiplier;
	}

	that.getActiveCount = function() {
		return that.powers.length;
	}

	return that;
}

COIN_TEXTURE = Texture({src: "assets/coin.png"});
COIN5_TEXTURE = Texture({src: "assets/coin5.png"});
BOMB_TEXTURE = Texture({src: "assets/bomb.png"});
PU_2X_TEXTURE = Texture({src: "assets/2X.png"});
HEART_TEXTURE = Texture({src: "assets/heart.png"});
FAIRY_TEXTURE = Texture({src: "assets/fairy.png"});
WAND_TEXTURE = Texture({src: "assets/wand.png"});
BUCKET_TEXTURE = Texture({src: "assets/bucket.png"});
CAVE_TEXTURE = Texture({src: "assets/cave.png"});

Game = (function(){
	let canvas = document.getElementById("canvas");
	let c = canvas.getContext("2d");
	let lastTimeStamp = performance.now();

	let that = {
		coins: [],
		coins1: [],
		lives: 3,
	}

	game = that;

	let guy = BoxGuy();
	let score = 0;
	let fairy = CoinFairy(that);
	let put = PowerupTracker();

	let keyInput = Keyboard();

	keyInput.register("a", guy.moveLeft);
	keyInput.register("d", guy.moveRight);

	function processInput(elapsedTime) {
		keyInput.update(elapsedTime);
	}

	function update(elapsedTime) {
		timer += elapsedTime;
		if (that.lives > 0) {
			let currentMultiplier = put.getMultiplier();
			guy.update(elapsedTime);
			fairy.update(elapsedTime);

			let new_coins = [];
			for (i in that.coins) {
				that.coins[i].update(elapsedTime);
				if (that.coins[i].center.y < 550) {
					if (guy.collidesWith(that.coins[i])) {
						if (that.coins[i].type == IT_BOMB) {

							if (!guy.unStretch() || that.lives > 1) {
								that.lives--;
							}

							if (that.lives <= 0) {
								break;
							}
						} else if (that.coins[i].type == IT_COIN) {
							score += that.coins[i].value*currentMultiplier;
						} else if (that.coins[i].type == IT_2X) {
							put.addPower(IT_2X);
						} else if (that.coins[i].type == IT_HEART) {
							that.lives++;
						} else if (that.coins[i].type == IT_STRETCH) {
							guy.doStretch();
						}
					} else {
						new_coins.push(that.coins[i]);
					}
				}
			}
			that.coins = new_coins;
			that.coins = that.coins.concat(that.coins1);
			that.coins1 = [];

			put.update(elapsedTime);
		} else {
			
		}
	}

	function render() {
		CAVE_TEXTURE.render(c,0,0,500,500);
		if (that.lives > 0) {

			let onTop = [];

			for (i in that.coins) {
				if (that.coins[i].type == IT_2X || that.coins[i].type == IT_BOMB
					|| that.coins[i].type == IT_HEART || that.coins[i].type == IT_WAND){
					onTop.push(that.coins[i]);
				} else {
					that.coins[i].render(c);
				}
			}

			for (i in onTop) {
				onTop[i].render(c);
			}

			guy.render(c);
			fairy.render(c);

			c.fillStyle = "black";
			c.fillText(`Score: ${score}`,0,50);
			c.fillText(`x${put.getMultiplier()}`,0,70);
			//c.fillText(`x${put.getActiveCount()}`,0,60);

			for (let i = 0; i < that.lives; i++) {
				HEART_TEXTURE.render(c, i*30,0,30+Math.sin(i+timer*0.01),30);
			}
		} else {
			c.fillStyle = "black";
			c.fillText(`Final Score: ${score}`,0,50);
			c.fillText(`Total Money Created: ${TOTAL_COINAGE}`,0,70);
		}
	}

	function gameLoop(time) {
		let elapsedTime = time - lastTimeStamp;
		lastTimeStamp = time;

		processInput(elapsedTime);

		update(elapsedTime)
		render();

		requestAnimationFrame(gameLoop);
	}

	requestAnimationFrame(gameLoop);
}());