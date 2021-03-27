Game.screens['level-editor'] = (function(game, objects, renderer, graphics, input) {
    let lastTimeStamp = performance.now();
    let cancelNextRequest = false;

	let keyboard = input.Keyboard();
	let mouse = input.Mouse();
    let colliders = [];
    let oldpoint = {x:-1,y:-1};
    let lander = {x:50,y:50};

    function processInput(elapsedTime) {
        keyboard.update(elapsedTime);
        mouse.update(elapsedTime);
    }

    function update(elapsedTime) {

    }

    function render() {
        graphics.clear();
        graphics.render_colliders(colliders);

        graphics.drawSquare(lander, 15, 0, "purple");
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
		lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop)
        }
    }

    function initialize() {
		keyboard.register('Escape', function() {
			cancelNextRequest = true;
			game.showScreen('main-menu');
		});
        keyboard.register('Enter', function() {
            if (colliders.length == 0) return;
            colliders.push({x1:oldpoint.x, y1:oldpoint.y, x2:500, y2: 500});
            let levelized = btoa(JSON.stringify({terrain: colliders, lander: lander}));

            game.levels.push(levelized);

            colliders = [];
            oldpoint = {x:-1, y: -1};
        },true);
        keyboard.register('Backspace', function() {

            colliders = [];
            oldpoint = {x:-1, y: -1};
        },true);
        mouse.register('mousedown', function(e, elapsedTime) {
            console.log(e);
            if (e.ctrlKey) {
                lander.x = e.offsetX;
                lander.y = e.offsetY;
                console.log(lander);
                return;
            }
            if (oldpoint.x == -1 && oldpoint.y == -1) {
                oldpoint.x = 0;
                oldpoint.y = e.offsetY;
            } else {
                let newpoint = {x: e.offsetX, y: e.offsetY};

                if (e.shiftKey) {
                    newpoint.y = oldpoint.y;
                }

                colliders.push({x1:oldpoint.x, y1:oldpoint.y, x2:newpoint.x, y2: newpoint.y});
                oldpoint = newpoint;
            }
        });
    }

    function run() {
        game.showScreen("game-play",false);
		lastTimeStamp = performance.now();
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}

	return {
		initialize, run
	}
}(Game.game, Game.objects, Game.render, Game.graphics, Game.input));

Game.copyTemplate("credits","id-back-creds");
Game.copyTemplate("level-editor-about","id-back-lea");