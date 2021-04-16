Game.components.Bullet = function(center, vel, power=1) {
    let that = {
        center: center,
        vel: vel,
        life: 5000,
        power: power,
    };

    that.update = function(elapsedTime) {
        that.center.x += that.vel.x*elapsedTime;
        that.center.y += that.vel.y*elapsedTime;
        that.life -= elapsedTime;
    }

    that.render = function() {
        Game.renderer.core.drawPoint(that.center, "black");
    }

    return that;
}