Game.screens['game-play'] = (function(game, objects, renderer, graphics, input) {
	let lastTimeStamp = performance.now();
	let cancelNextRequest = true;

	let level3="eyJ0ZXJyYWluIjpbeyJ4MSI6MCwieTEiOjc3LCJ4MiI6NDQsInkyIjo3MH0seyJ4MSI6NDQsInkxIjo3MCwieDIiOjEwOCwieTIiOjgxfSx7IngxIjoxMDgsInkxIjo4MSwieDIiOjE3OCwieTIiOjc3fSx7IngxIjoxNzgsInkxIjo3NywieDIiOjI2NSwieTIiOjYxfSx7IngxIjoyNjUsInkxIjo2MSwieDIiOjMwOSwieTIiOjc0fSx7IngxIjozMDksInkxIjo3NCwieDIiOjM3MCwieTIiOjg4fSx7IngxIjozNzAsInkxIjo4OCwieDIiOjM3MSwieTIiOjExOX0seyJ4MSI6MzcxLCJ5MSI6MTE5LCJ4MiI6MzI1LCJ5MiI6MTc5fSx7IngxIjozMjUsInkxIjoxNzksIngyIjoyMTIsInkyIjoxOTd9LHsieDEiOjIxMiwieTEiOjE5NywieDIiOjE0NywieTIiOjE5Mn0seyJ4MSI6MTQ3LCJ5MSI6MTkyLCJ4MiI6NTksInkyIjoyMTl9LHsieDEiOjU5LCJ5MSI6MjE5LCJ4MiI6NDQsInkyIjoyNzh9LHsieDEiOjQ0LCJ5MSI6Mjc4LCJ4MiI6NDYsInkyIjozMzl9LHsieDEiOjQ2LCJ5MSI6MzM5LCJ4MiI6MTMyLCJ5MiI6MzM5fSx7IngxIjoxMzIsInkxIjozMzksIngyIjoxNDIsInkyIjozNzV9LHsieDEiOjE0MiwieTEiOjM3NSwieDIiOjEyMSwieTIiOjM5M30seyJ4MSI6MTIxLCJ5MSI6MzkzLCJ4MiI6NDksInkyIjo0Mjh9LHsieDEiOjQ5LCJ5MSI6NDI4LCJ4MiI6NDUsInkyIjo0Nzd9LHsieDEiOjQ1LCJ5MSI6NDc3LCJ4MiI6MzEzLCJ5MiI6NDYwfSx7IngxIjozMTMsInkxIjo0NjAsIngyIjo0MjAsInkyIjo0NzZ9LHsieDEiOjQyMCwieTEiOjQ3NiwieDIiOjQ2MiwieTIiOjQ3NX0seyJ4MSI6NDYyLCJ5MSI6NDc1LCJ4MiI6NTAwLCJ5MiI6NTAwfV0sImxhbmRlciI6eyJ4IjoxMjcsInkiOjQ0OX19";

	let terrain = [];

	let levels = [
		genTerrain1,
		genTerrain1_2,
		genTerrain2,
		genGenTerrain(level3),
	]
	let level_index = 0;
	let b = [];
	let colliders = [];
	let time_box = [];
	let tb_ptr = 0;
	let restart_countdown = 0;

	let session_score = 0;
	let level_score = 0;

	let go_to_next_level = false;
	
	let keyboard = input.Keyboard();

	let myTest = objects.Test({
		center: {x: 250, y: 150},
		radius: 15,
	})

	// Reference: https://stackoverflow.com/questions/37224912/circle-line-segment-collision
	function lineCircleIntersection(pt1, pt2, circle) {
		let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
		let v2 = { x: pt1.x - circle.center.x, y: pt1.y - circle.center.y };
		let b = -2 * (v1.x * v2.x + v1.y * v2.y);
		let c =  2 * (v1.x * v1.x + v1.y * v1.y);
		let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
		if (isNaN(d)) { // no intercept
			return false;
		}
		// These represent the unit distance of point one and two on the line
		let u1 = (b - d) / c;  
		let u2 = (b + d) / c;
		if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
			return true;
		}
		if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
			return true;
		}
		return false;
	}


	function midpoint(points, p1, p2, max, jitter) {
		// get the midpoint index
		let mid = Math.round((p1 + p2) / 2)
		// if points are on eachother, or the midpoint is on either return
		if (p2 - p1 <= 1 || p1 === mid || p2 === mid) {
		return
		}
		// the displacement is (avg of the points) + max*(+-jitter)
		let d = ((points[p1] + points[p2]) / 2) + (max * (Math.random() * (jitter * 2) - jitter))
		// set the midpoint displacement value
		points[mid] = d
		// midpoint the new line segment to the left, and to the right.
		midpoint(points, p1, mid, max / 2, jitter)
		midpoint(points, mid, p2, max / 2, jitter)
	}

	function genTerrain1() {
		terrain = [];
		colliders = [];
		myTest.setPosition(30,30);
		for (let i = 0; i < 7; i++) {
			let r = 270 - Math.floor(Math.random()*10)*10;
			for (let j = 0; j < 9; j++) {
				terrain[j+i*9] = r;
			}
		}

		b = [...terrain];

		let p1 = Math.floor(Math.random()*4);
		let p2 = 4+Math.floor(Math.random()*3);
		
		midpoint(terrain, 0, p1*9, 10, 10);
		midpoint(terrain, p1*9+8, p2*9, 10, 10);
		midpoint(terrain, p2*9+8, 62, 10, 10);

		for (let i = 0; i+1 < terrain.length; i++) {
			let line = {x1: i*(500/(terrain.length-1)), y1: 500-terrain[i], x2: (i+1)*(500/(terrain.length-1)), y2: 500-terrain[i+1]};
			
			if (i > 0 && colliders[colliders.length-1].y1 == line.y2) {
				colliders[colliders.length-1].x2 = line.x2;
			} else {
				colliders.push(line);
			}
			//colliders.push(line);
		}
	}

	function genTerrain1_2() {
		terrain = [];
		colliders = [];
		myTest.setPosition(30,30);
		for (let i = 0; i < 9; i++) {
			let r = 270 - Math.floor(Math.random()*10)*10;
			for (let j = 0; j < 7; j++) {
				terrain[j+i*7] = r;
			}
		}

		b = [...terrain];

		let p1 = Math.floor(Math.random()*9);
		
		midpoint(terrain, 0, p1*7, 10, 10);
		midpoint(terrain, p1*7+6, 62, 10, 10);

		for (let i = 0; i+1 < terrain.length; i++) {
			let line = {x1: i*(500/(terrain.length-1)), y1: 500-terrain[i], x2: (i+1)*(500/(terrain.length-1)), y2: 500-terrain[i+1]};
			
			if (i > 0 && colliders[colliders.length-1].y1 == line.y2) {
				colliders[colliders.length-1].x2 = line.x2;
			} else {
				colliders.push(line);
			}
			//colliders.push(line);
		}
	}

	function genTerrain3() {
		terrain = [];
		let level = JSON.parse(atob(level3));
		myTest.setPosition(level.lander.x, level.lander.y);
		colliders = level.terrain;
	}

	function genTerrain4() {
		terrain = [];
		let level = JSON.parse(atob(level4));
		myTest.setPosition(level.lander.x, level.lander.y);
		colliders = level.terrain;
	}

	function genGenTerrain(level_string) {
		return function() {
			terrain = [];
			let level = JSON.parse(atob(level_string));
			myTest.setPosition(level.lander.x, level.lander.y);
			colliders = level.terrain;
		};
	}

	function genTerrain2() {
		terrain = []
		myTest.setPosition(400,400)
		colliders = [
			{x1:0, y1:150, x2:10, y2:140},
			{x1:10,y1:140, x2:30, y2:130},
			{x1:30,y1:130, x2:100,y2:140},
			{x1:100,y1:140,x2:170,y2:140},
			{x1:170,y1:140,x2:200,y2:120},
			{x1:200,y1:120,x2:350,y2:150},
			{x1:350,y1:150,x2:400,y2:200},
			{x1:400,y1:200,x2:225,y2:200},
			{x1:225,y1:200,x2:200,y2:225},
			{x1:200,y1:225,x2:150,y2:225},
			{x1:150,y1:225,x2:100,y2:275},
			{x1:100,y1:275,x2:100,y2:450},
			{x1:100,y1:450,x2:500,y2:500},
		];
	}

	//let myMouse = input.Mouse();

	function processInput(elapsedTime) {
		keyboard.update(elapsedTime);
	}

	function update(elapsedTime) {
		myTest.update(elapsedTime);

		Game.objects.ParticleSystem.update(elapsedTime);

		if (myTest.hasControl){
			for (let i = 0; i < colliders.length; i++) {
				col = colliders[i];
				p1 = {x: col.x1, y: col.y1};
				p2 = {x: col.x2, y: col.y2};
				if (lineCircleIntersection(p1, p2, myTest)) {
					restart_countdown = 3000;
					if (p1.y-p2.y == 0 && myTest.isLandingAngle() && myTest.isLangingVel()) {
						console.log("Landed Safely");
						go_to_next_level = true;
						myTest.stopControl(false);
						level_score = (myTest.fuel+myTest.bonusPoints)/Math.max(0.5,myTest.magnitude());
						session_score += level_score;
					} else {
						myTest.stopControl();
					}
					break;
				}
			}
			if (myTest.outOfBounds) {
				myTest.stopControl();
				restart_countdown = 3000;
			}
		} else {
			restart_countdown -= elapsedTime;
			if (restart_countdown <= 0) {
				myTest.restoreControl();
				myTest.reset();
				level_score = 0;
				if (go_to_next_level) {
					level_index += 1;
					if (level_index < levels.length) {
						levels[level_index]();
					} else {
						level_index = 0;
						levels[level_index]();
					}
					go_to_next_level = false;
				}
			}
		}

		for (let i = 0; i < 50000; i++) {
			b[0] = Math.random()**Math.random();
		}

		if (game.debug){
			time_box[tb_ptr] = elapsedTime;
			tb_ptr+=1;
			if (tb_ptr >= 500) {
				tb_ptr -= 500;
			}
		}
	}

	function render() {
		graphics.clear();

		//graphics.render_terrain(terrain);
		//graphics.render_terrain(b, "rgba(255,0,0,0.4)");
		graphics.render_colliders(colliders);

		renderer.Test.render(myTest);

		if (game.debug) {
			graphics.render_timebox(time_box);
		}

		Game.objects.ParticleSystem.render(graphics);

		graphics.fillBar(500-100,0,100,20,myTest.fuel,6000, "green", "white");

		if (restart_countdown > 0) {
			if (restart_countdown > 4000) {
				graphics.drawHeadline("5")
			}
			else if (restart_countdown > 3000) {
				graphics.drawHeadline("4")
			}
			else if (restart_countdown > 2000) {
				graphics.drawHeadline("3")
			}
			else if (restart_countdown > 1000) {
				graphics.drawHeadline("2")
			}
			else if (restart_countdown > 0) {
				graphics.drawHeadline("1")
			}
			graphics.drawHeadline(`Score: ${~~session_score}`, 1);
			graphics.drawHeadline(`Level Score: ${~~level_score}`, 2);
		}

		graphics.drawText(0,70,`Angle: ${~~myTest.toDegrees()}`, (myTest.isLandingAngle()) ? "lime" : "white");
		graphics.drawText(0,90,`Speed: ${~~myTest.magnitude()}m/s`, (myTest.isLangingVel()) ? "lime" : "white");
		graphics.drawText(0,110,`Score: ${~~session_score}`, (Game.high_scores.length == 0 || session_score > Game.high_scores[0]) ? "lime" : "white");
	}

	function gameLoop(time) {
		let elapsedTime = time - lastTimeStamp;
		lastTimeStamp = time;

		processInput(elapsedTime);
		update(elapsedTime);

		render();

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}

	function initialize() {
		// keyboard.register('a', myTest.moveLeft);
		// keyboard.register('d', myTest.moveRight);
		// keyboard.register('w', myTest.moveUp);
		// keyboard.register('s', myTest.moveDown);
		//keyboard.register(' ', myTest.launch, true)
		keyboard.register('p', function() {
			game.debug = !game.debug;
		}, true);
		keyboard.register('Escape', function() {
			cancelNextRequest = true;
			game.showScreen('main-menu');
			if (~~session_score > 0){
				Game.high_scores.push(~~session_score);
				localStorage["Lunaris.highScores"] = JSON.stringify(Game.high_scores);
				Game.screens.high_scores.run();
			}
		});
	}

	function newGame() {
		level_index = 0;
		level_score = 0;
		session_score = 0;
		levels[level_index]();
		myTest.reset();
		restart_countdown = 0;
		go_to_next_level = false;
	}

	function gameOver() {
		cancelNextRequest = true;
		game.showScreen('main-menu');
	}

	function run() {
		newGame();

		for (i in Game.objects.KeyboardSetter.dereg) {
			let key = Game.objects.KeyboardSetter.dereg[i];
			keyboard.deregister(key);
		}

		keyboard.register(Game.objects.KeyboardSetter.settings.left, myTest.moveLeft);
		keyboard.register(Game.objects.KeyboardSetter.settings.right, myTest.moveRight);
		keyboard.register(Game.objects.KeyboardSetter.settings.thrust, function(dt) {myTest.moveUp(dt);if (myTest.fuel>0) {Game.objects.sounds.thrust.play();}}, false,
			function(){Game.objects.sounds.thrust.pause();});

		if (game.levels.length > 0) {
			for (i in game.levels) {
				levels.push(genGenTerrain(game.levels[i]));
			}
			game.levels = [];
		}

		lastTimeStamp = performance.now();
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}

	return {
		initialize, run
	}
}(Game.game, Game.objects, Game.render, Game.graphics, Game.input));