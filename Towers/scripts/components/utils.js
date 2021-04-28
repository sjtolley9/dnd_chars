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

Game.components.Box2D = Box2D = function(v1,v2) {
    let that = {
        x1: v1.x,
        x2: v2.x,
        y1: v1.y,
        y2: v2.y
    };

    that.isInside = function(v) {
        return (v.x >= that.x1 && v.x <= that.x2 && v.y >= that.y1 && v.y <= that.y2);
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