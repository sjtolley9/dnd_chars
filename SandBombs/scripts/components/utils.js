Game.components.Vector2D = Vector2D = function(x,y) {
    let that = {
        x: x,
        y: y,
    }

    that.magnitude = function() {
        return Math.sqrt(that.x*that.x + that.y*that.y);
    }

    that.normalize = function() {
        let mag = that.magnitude();
        that.x /= mag;
        that.y /= mag;
    }

    that.crossProduct = function(v2) {
        return (that.x * v2.y) - (that.y * v2.x);
    }

    that.dotProduct = function(v2) {
        return that.x*v2.x + that.y*v2.y;
    }

    return that;
}

Game.components.computeAngle = function(rot, ptCenter, ptTarget) {
    let v1 = this.Vector2D(Math.cos(rot), Math.sin(rot));

    let v2 = this.Vector2D(ptTarget.x - ptCenter.x, ptTarget.y - ptCenter.y);

    v2.normalize();

    let dp = v1.dotProduct(v2);
    let angle = Math.acos(dp);

    let cp = v1.crossProduct(v2);

    return {
        angle: angle,
        crossProduct: cp
    }
}

Game.components.testTolerance = function(value, test, tolerance) {
    if (Math.abs(value-test) < tolerance) {
        return true;
    }

    return false;
}

Game.components.Model = Model = function(center=Vector2D(0,0), rotation=0, size=Vector2D(0,0)) {
    let that = {
        center: center,
        rotation: rotation,
        size: size,
    }

    that.setSize = function(size) {
        that.size = size;
    }

    that.setRotation = function(rotation) {
        that.rotation = rotation;
    }

    that.setCenter = function(center) {
        that.center = center;
    }

    that.rotate = function(theta) {
        that.rotation += theta;
    }

    that.translate = function(v) {
        that.center.x += v.x;
        that.center.y += v.y;
    }

    return that;
};

MOUSE_X = 0;
MOUSE_Y = 0;
MOUSE_NEW=0;

document.getElementById("canvas").addEventListener('mousemove', (event) => {
    MOUSE_X = event.offsetX;
    MOUSE_Y = event.offsetY;
    MOUSE_NEW = 1000;
});

let DrawBag = function(bg=[]) {
    let that = {
        bag: bg,
        size: bg.length,
        currentSize: bg.length,
        index: 0,
    };

    that.draw = function() {
        if (that.size == 0 || that.currentSize == 0) {
            return null;
        }
        let beadIndex = that.index+Math.floor(Math.random()*that.currentSize);
        let temp = that.bag[that.index];
        that.bag[that.index] = that.bag[beadIndex];
        that.bag[beadIndex] = temp;
        that.index++;
        that.currentSize--;

        return that.bag[that.index-1];
    }

    that.add = function(bead) {
        that.bag.push(bead);
        that.size++;
        that.currentSize++;
    }

    that.addN = function(bead, N) {
        for (let i = 0; i < N; i++) {
            that.add(bead);
        }
    }

    that.reset = function() {
        that.currentSize = that.size;
        that.index = 0;
    }

    return that;
}