Game.screens['main-menu'] = (function(game) {
	function initialize() {
		document.getElementById('id-new-game').addEventListener(
            'click',
            function() {game.showScreen('game-play'); });

		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() {game.showScreen('high-scores'); });

		document.getElementById('id-level-editor').addEventListener(
			'click',
			function() {game.showScreen('level-editor'); });

		document.getElementById('id-settings').addEventListener(
			'click',
			function() {game.showScreen('settings'); });

		document.getElementById('id-credits').addEventListener(
			'click',
			function() {game.showScreen('credits'); });

		document.getElementById('id-level-editor-guide').addEventListener(
			'click',
			function() {game.showScreen('level-editor-about'); });
        
	}

	function run() {

	}

	return {
		initialize, run
	}
}(Game.game))