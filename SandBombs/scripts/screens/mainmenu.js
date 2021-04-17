Game.screens['main-menu'] = (function(game) {
	function initialize() {
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() {game.showScreen('game-play'); }
		);


        document.getElementById('id-credits').addEventListener(
            'click',
            function() {game.showScreen('credits'); }
		);


        document.getElementById('id-high-scores').addEventListener(
            'click',
            function() {game.showScreen('high-scores'); }
		);
	}

	function run() {

	}

	return {
		initialize, run
	}
}(Game.game))