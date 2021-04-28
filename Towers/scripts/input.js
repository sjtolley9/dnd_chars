Game.input.Mouse = function() {
    'use strict';

    let that = {
            mouseDown : [],
            mouseUp : [],
            mouseMove : [],
            handlersDown : [],
            handlersUp : [],
            handlersMove : []
        };

    function mouseDown(e) {
        //console.log('mousedown - x: ' + e.clientX + ', y: ' + e.clientY);
        that.mouseDown.push(e);
    }

    function mouseUp(e) {
        //console.log('mouseup -   x: ' + e.clientX + ', y: ' + e.clientY);
        that.mouseUp.push(e);
    }

    function mouseMove(e) {
        //console.log('mousemove - x: ' + e.clientX + ', y: ' + e.clientY);
        that.mouseMove.push(e);
    }

    that.update = function(elapsedTime) {
        //
        // Process the mouse events for each of the different kinds of handlers
        for (let event = 0; event < that.mouseDown.length; event++) {
            for (let handler = 0; handler < that.handlersDown.length; handler++) {
                that.handlersDown[handler](that.mouseDown[event], elapsedTime);
            }
        }

        for (let event = 0; event < that.mouseUp.length; event++) {
            for (let handler = 0; handler < that.handlersUp.length; handler++) {
                that.handlersUp[handler](that.mouseUp[event], elapsedTime);
            }
        }

        for (let event = 0; event < that.mouseMove.length; event++) {
            for (let handler = 0; handler < that.handlersMove.length; handler++) {
                that.handlersMove[handler](that.mouseMove[event], elapsedTime);
            }
        }

        //
        // Now that we have processed all the inputs, reset everything back to the empty state
        that.mouseDown.length = 0;
        that.mouseUp.length = 0;
        that.mouseMove.length = 0;
    };

    that.register = function(type, handler) {
        if (type === 'mousedown') {
            that.handlersDown.push(handler);
        }
        else if (type === 'mouseup') {
            that.handlersUp.push(handler);
        }
        else if (type === 'mousemove') {
            that.handlersMove.push(handler);
        }
    };

    let canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousemove', mouseMove);

    return that;
};

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