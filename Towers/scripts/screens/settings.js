/*
The Spectacular Keyboardulator
*/
Game.components.KeyboardSetter = (function(settings) {
	let that = {
		setting: {active: false},
		settings: settings,
		dereg: [],
	}

	that.readySetting = function(name, handler) {
		that.setting.active = true;
		that.setting.name = name;
		that.setting.handler = handler;
	}

	that.keyPress = function(e) {
		if (that.setting.active) {
			that.setting.active = false;
			that.dereg.push(that.settings[that.setting.name]);
			that.settings[that.setting.name] = e.key;
			console.log(that.settings);
			Game.components.Score.storeSettings();
			that.setting.handler(that.setting.name, e.key);
		}
	}

	window.addEventListener('keydown', that.keyPress);

	return that;
}(Game.components.Score.getSettings()));

Game.screens['settings'] = (function(game) {
	function finishRegisterHandler(settingName, setting) {
		document.getElementById(`current-${settingName}`).innerHTML = setting;
	}

	function registerSetter(settingName) {
		document.getElementById(`setting-${settingName}`).addEventListener(
			'click',
			function(){
				Game.components.KeyboardSetter.readySetting(settingName, finishRegisterHandler);
			});
	}

	function initialize() {
		document.getElementById('id-back-settings').addEventListener(
            'click',
            function() {game.showScreen('main-menu'); });
		registerSetter("sell");
		registerSetter("upgrade");
		registerSetter("go");
		finishRegisterHandler("sell", Game.components.KeyboardSetter.settings.sell);
		finishRegisterHandler("go", Game.components.KeyboardSetter.settings.go);
		finishRegisterHandler("upgrade", Game.components.KeyboardSetter.settings.upgrade);
	}

	function run() {
		//Game.objects.KeyboardSetter.readySetting("thrust");
	}

	return {
		initialize, run
	}
}(Game.game))