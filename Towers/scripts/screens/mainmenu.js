Game.screens['main-menu'] = (function(game) {
	function initialize() {
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() {game.showScreen('game-play'); });
        document.getElementById('id-settings').addEventListener(
            'click',
            function() {game.showScreen('settings'); });
        document.getElementById('id-scores').addEventListener(
            'click',
            function() {game.showScreen('high-scores'); });
	}

	function run() {

	}

	return {
		initialize, run
	}
}(Game.game))