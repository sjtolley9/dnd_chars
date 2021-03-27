Game.input.Keyboard = function() {
    let that = {
        keys: {},
        handlers: {},
        type: {},
    };

    that.update = function(dT) {
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (that.handlers[key] && that.keys[key] != -1) {
                    that.handlers[key](dT);
                    if (that.type[key]) {
                        that.keys[key] = -1;
                    }
                }
            }
        }
    };

    that.register = function(key, handler, once=false, upHandler=undefined) {
        that.handlers[key] = handler;
        that.type[key] = once;
        if (upHandler != undefined) {
            that.handlers[key+"+Up"] = upHandler;
        }
    };

    that.deregister = function(key) {
        delete that.handlers[key];
    }

    function keyPress(e) {
        if (!that.keys[e.key]) {
            if (that.handlers.hasOwnProperty(e.key)) {
                e.preventDefault();
            }
            that.keys[e.key] = performance.now();
        }
    }
    function keyRelease(e) {
        if (that.handlers[e.key+"+Up"]) {
            that.handlers[e.key+"+Up"]();
        }
        delete that.keys[e.key];
    }

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);

    return that;
}