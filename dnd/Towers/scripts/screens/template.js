Game.copyTemplate = function(name, back=false) {
	Game.screens[name] = (function(game) {
		function initialize() {
			if (back) {
				document.getElementById(back).addEventListener(
					'click',
					function() {game.showScreen('main-menu'); });
			}
		}
	
		function run() {
		}
	
		return {
			initialize, run
		}
	}(Game.game));
}