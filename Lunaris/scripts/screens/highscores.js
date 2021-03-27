Game.screens['high-scores'] = (function(game) {
	function initialize() {
		document.getElementById('id-back-scores').addEventListener(
            'click',
            function() {game.showScreen('main-menu'); });
		document.getElementById('id-clear-scores').addEventListener(
			'click',
			function() {Game.high_scores = []; delete localStorage["Lunaris.highScores"]; run();});
		Game.high_scores = JSON.parse(localStorage.getItem("Lunaris.highScores"));
		if (Game.high_scores == null) {
			Game.high_scores = [];
		}
	}

	function run() {
		Game.high_scores.sort((a,b)=>b-a);
		Game.high_scores = Game.high_scores.slice(0,10);

		document.getElementById('score-box').innerHTML = '';
		let scores = '<ul>';
		for (let i = 0; i < Math.min(Game.high_scores.length,5); i++) {
			scores += `<li>${Game.high_scores[i]}</li>`;
		}
		scores += "</ul>";
		document.getElementById('score-box').innerHTML = scores;
	}

	return {
		initialize, run
	}
}(Game.game))