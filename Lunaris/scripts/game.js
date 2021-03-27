Game.game = (function(screens) {
    function showScreen(id, run=true) {
        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }

        document.getElementById(id).classList.add('active');

        if (run) {
            screens[id].run();
        }
    }

    function initialize() {
        let screen = null;

        for (screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }

        showScreen('main-menu');
    }

    let debug = false;
    let levels = [];

    return {initialize, showScreen, debug, levels}
}(Game.screens));