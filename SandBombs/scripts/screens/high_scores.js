Game.screens['high-scores'] = (function(game) {
	function initialize() {
        document.getElementById('id-scores-back').addEventListener(
            'click',
            function() {game.showScreen('main-menu'); }
		);
	}

	function run() {
		let score_box = document.getElementById('scores-box');
		let time_box = document.getElementById('times-box');
		score_box.innerHTML = '';
		time_box.innerHTML = '';
		for (let i in Game.components.Score.scores) {
			score_box.innerHTML += `<div class="score">${Game.components.Score.scores[i]}</div>`;
		}
		for (let i in Game.components.Score.times) {
			time_box.innerHTML += `<div class="score">${Game.components.Score.times[i]}s</div>`;
		}
	}

	return {
		initialize, run
	}
}(Game.game))