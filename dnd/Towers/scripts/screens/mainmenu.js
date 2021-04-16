Game.screens['main-menu'] = (function(game) {
	function initialize() {
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() {game.showScreen('game-play'); });
	}

	function run() {

	}

	return {
		initialize, run
	}
}(Game.game))