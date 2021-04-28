Game.screens['game-play'] = (function(game, components, model) {
    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;
    let playing = false;

    let keyboard = Game.input.Keyboard();
    console.log(keyboard);

    function processInput(elapsedTime) {
        keyboard.update(elapsedTime);
        model.processInput(elapsedTime);
    }

    function endGame() {
        cancelNextRequest = true;
        playing = false;
        model.endGame();
        game.showScreen("main-menu");
    }

    function update(elapsedTime) {
        model.update(elapsedTime);
    }

    function render() {
        model.render();
    }

    document.addEventListener('visibilitychange', function(){
        if (playing && document.visibilityState == "hidden") {
            cancelNextRequest = true;
        } else if (playing && document.visibilityState == "visible") {
            cancelNextRequest = false;
            lastTimeStamp = performance.now();
        }
     });
    
    keyboard.register("Escape", endGame, true);

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
        // Register Non-configurable Input

        model.initialize();
    }

    function run() {
        // Deregister/Register New Custom Controls

        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        playing = true;
        model.run();
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize, run
    };

}(Game.game, Game.components, Game.model))